import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Avatar, Box, IconButton, LinearProgress, Paper, Skeleton, useMediaQuery } from "@mui/material"
import { Washima, WashimaMediaForm, WashimaProfilePic } from "../../../types/server/class/Washima/Washima"
import CancelIcon from "@mui/icons-material/Cancel"
import { api } from "../../../api"
import { useIo } from "../../../hooks/useIo"
import { WashimaInput } from "../WashimaInput"
import { KeyboardDoubleArrowDown, Lock } from "@mui/icons-material"
import { WhatsappWebSvg } from "../WhatsappWebSvg"
import { WashimaMessage } from "../../../types/server/class/Washima/WashimaMessage"
import { WashimaGroupUpdate } from "../../../types/server/class/Washima/WashimaGroupUpdate"
import { GroupUpdateItem } from "./GroupUpdateItem"
import { Chat } from "../../../types/Chat"
import { NoChat } from "./NoChat"
import { PhotoProvider, PhotoView } from "react-photo-view"
import { CopyAllButton } from "./WashimaTools/CopyAll"
import { useWashimaInput } from "../../../hooks/useWashimaInput"
import Message from "../../Zap/Message"
import { SelectContactsModal } from "../SelectContactsModal/SelectContactsModal"

interface WashimaChatProps {
    washima: Washima
    chat: Chat | null
    onClose: () => void
    inBoards?: boolean
}

export const WashimaChat: React.FC<WashimaChatProps> = ({ washima, chat, onClose, inBoards }) => {
    const io = useIo()
    const isMobile = useMediaQuery("(orientation: portrait)")
    const messagesBoxRef = useRef<HTMLDivElement>(null)
    const washimaInput = useWashimaInput()

    const [messages, setMessages] = useState<WashimaMessage[]>([])
    const [groupUpdates, setGroupUpdates] = useState<WashimaGroupUpdate[]>([])
    const [loadingMessageId, setLoadingMessageId] = useState<string | null>(null)
    const [selectedMessages, setSelectedMessages] = useState<WashimaMessage[]>([])
    const [chooseForwardingContacts, setChooseForwardingContacts] = useState(false)

    const messages_and_group_updates = useMemo(
        () => [...messages, ...groupUpdates].sort((a, b) => Number(b.timestamp) - Number(a.timestamp)),
        [messages, groupUpdates]
    )

    const [profilePic, setProfilePic] = useState("")
    const [loading, setLoading] = useState(false)
    const [isScrolled, setIsScrolled] = useState<boolean>(false)

    const handleScroll = () => {
        if (messagesBoxRef.current) {
            const { scrollTop } = messagesBoxRef.current

            const isAtBottom = scrollTop === 0 // Allow small margin

            setIsScrolled(!isAtBottom)
        }
    }

    const onSendMessage = (message?: string, media?: WashimaMediaForm) => {
        console.log({ message, media })
        if ((message || media) && chat) {
            console.log("mandando")
            io.emit("washima:message", washima.id, chat.id._serialized, message, media, washimaInput.replyMessage)
        }
    }

    const onForwardMessages = (contactIds: string[]) => {
        if (chat) {
            const message_ids = selectedMessages.map((item) => item.sid)
            console.log({ message_ids, contactIds })
            io.emit("washima:forward", washima.id, chat.id._serialized, contactIds, message_ids)
            setSelectedMessages([])
        }
    }

    const fetchProfilePic = async () => {
        if (!chat) return

        const params = { washima_id: washima.id, chat_id: chat.id._serialized, is_group: chat.isGroup }
        try {
            const response = await api.get("/washima/profile-pic", { params: params })
            const data = response.data as WashimaProfilePic
            setProfilePic(data.url)
        } catch (error) {
            console.log(error)
        }
    }

    const addMessages = (incomingMessages: WashimaMessage[]) => {
        setMessages((messages) => {
            const messageMap = new Map()

            incomingMessages.forEach((msg) => {
                messageMap.set(msg.sid, msg)
            })

            messages.forEach((msg) => {
                if (!messageMap.has(msg.sid)) {
                    messageMap.set(msg.sid, msg)
                }
            })

            return Array.from(messageMap.values())
        })
    }

    const fetchMessages = async (offset: number = 0) => {
        if (!chat) return

        try {
            const params = { washima_id: washima.id, chat_id: chat.id._serialized, is_group: chat.isGroup, offset }
            console.log(offset)
            const response = await api.get("/washima/chat", { params: params })
            const data = response.data as { messages: WashimaMessage[]; profilePic: string; group_updates?: WashimaGroupUpdate[] }
            if (data.messages) {
                addMessages(data.messages)
            }
            setGroupUpdates(data.group_updates || [])
        } catch (error) {
            console.log(error)
        }
    }

    const fetchChat = async () => {
        if (!chat) return

        try {
            setLoading(true)
            fetchProfilePic()
            await fetchMessages()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const reset = () => {
        setProfilePic("")
        setMessages([])
        setGroupUpdates([])
        setSelectedMessages([])
    }

    const scrollToMessage = async (id: string) => {
        console.log(id)
        const group_split = id.split("@g.us_")
        if (group_split.length >= 2) {
            setLoadingMessageId(group_split[1].split("_")[0])
        } else {
            const contact_split = id.split("@c.us_")
            if (contact_split.length >= 2) {
                setLoadingMessageId(contact_split[1])
            }
        }
    }

    useEffect(() => {
        if (loadingMessageId) {
            const element = document.getElementById(`message:${loadingMessageId}`)
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })
                setLoading(false)
                setLoadingMessageId(null)
            } else {
                setLoading(true)
                fetchMessages(messages.length).then(() => {})
            }
        }
    }, [loadingMessageId, messages.length])

    useEffect(() => {
        if (chat?.lastMessage) {
            setLoadingMessageId(chat.lastMessage.id.id)
        }
    }, [chat?.lastMessage])

    useEffect(() => {
        io.on("washima:message:update", (updated_message: WashimaMessage, updated_chat_id: string) => {
            const index = messages.findIndex((item) => item.sid === updated_message.sid)
            if (chat?.id._serialized === updated_chat_id && index > -1) {
                setMessages((messages) => {
                    const new_messages = [...messages]
                    new_messages[index] = updated_message
                    return new_messages
                })
            }
        })

        return () => {
            io.off("washima:message:update")
        }
    }, [chat, messages])

    useEffect(() => {
        reset()
        if (chat) {
            setLoading(true)
            fetchChat()

            io.on("washima:message", (data: { chat: Chat; message: WashimaMessage }, washima_id: string) => {
                if (washima_id === washima.id && data.message && data.chat.id._serialized === chat.id._serialized) {
                    console.log(data.message)
                    setMessages((values) => [...values, data.message])
                    if (data.message.fromMe) {
                        messagesBoxRef.current?.scrollTo({ top: 0, behavior: "smooth" })
                    }
                }
            })

            io.on("washima:group:update", (update: WashimaGroupUpdate) => {
                if (update.chat_id === chat.id._serialized) {
                    console.log(update)
                    setGroupUpdates((values) => [...values.filter((item) => item.sid !== update.sid), update])
                    if (update.type === "picture") {
                        fetchProfilePic()
                    }
                }
            })

            return () => {
                io.off("washima:message")
                io.off("washima:group:update")
            }
        }
    }, [chat])

    useEffect(() => {
        console.log({ isScrolled })
    }, [isScrolled])

    return chat ? (
        <Paper
            sx={{
                flex: 1,
                justifyContent: isMobile ? "flex-end" : "center",
                bgcolor: "background.paper",
                // height: isMobile ? "77vh" : "90vh",
                padding: isMobile ? "2vw" : "1vw",
                color: "text.secondary",
                gap: "1vw",
                flexDirection: "column",
                overflow: "hidden",
                position: "relative",
                background: "transparent",
            }}
            elevation={0}
        >
            {!inBoards && (
                <Box
                    sx={{
                        gap: isMobile ? "3vw" : "2vw",
                        alignItems: "center",
                        // height: isMobile ? "7vh" : "5vh",
                        padding: isMobile ? "2vw" : "",
                    }}
                >
                    {loading ? (
                        <Skeleton variant="circular" animation="wave" sx={{ width: isMobile ? "12vw" : "3vw", height: isMobile ? "12vw" : "3vw" }} />
                    ) : (
                        <PhotoProvider>
                            <PhotoView src={profilePic}>
                                <Avatar
                                    src={profilePic}
                                    sx={{
                                        width: isMobile ? "12vw" : "3vw",
                                        height: isMobile ? "12vw" : "3vw",
                                        bgcolor: "primary.main",
                                        cursor: "pointer",
                                    }}
                                    imgProps={{ draggable: false }}
                                    // onClick={() => picture.open(profilePic || "")}
                                />
                            </PhotoView>
                        </PhotoProvider>
                    )}
                    <p style={{ fontWeight: "bold" }}>{chat?.name}</p>
                    {!!chat && (
                        <Box sx={{ marginLeft: "auto" }}>
                            <CopyAllButton chat={chat} washima_id={washima.id} />
                            <IconButton sx={{ color: "text.secondary", padding: isMobile ? "0" : "" }} onClick={onClose}>
                                <CancelIcon />
                            </IconButton>
                        </Box>
                    )}
                </Box>
            )}

            <Box
                ref={messagesBoxRef}
                onScroll={handleScroll}
                sx={{
                    width: "100%",
                    height: inBoards ? "20vw" : isMobile ? "60vh" : washimaInput.replyMessage ? "60vh" : "70vh",
                    bgcolor: "background.default",
                    overflowY: "auto",
                    borderRadius: isMobile ? "0 3vw 0 3vw" : "0 1.5vw 0 1.5vw",
                    padding: inBoards ? "1vw" : isMobile ? "4vw" : "2vw",
                    color: "text.secondary",
                    flexDirection: "column-reverse",
                    gap: isMobile ? "1vw" : "0.25vw",
                    position: "relative",

                    "::-webkit-scrollbar-thumb": {
                        backgroundColor: "primary.main",
                    },
                }}
            >
                {messages_and_group_updates.map((item, index) =>
                    (item as WashimaMessage).from ? (
                        <Message
                            key={item.id._serialized}
                            message={item as WashimaMessage}
                            isGroup={chat?.isGroup}
                            washima={washima}
                            previousItem={messages_and_group_updates[index + 1]}
                            onVisible={index % 5 === 4 ? () => fetchMessages(messages.length) : undefined}
                            scrollTo={scrollToMessage}
                            selectedMessages={selectedMessages}
                            setSelectedMessages={setSelectedMessages}
                            inBoards={inBoards}
                        />
                    ) : (
                        <GroupUpdateItem key={item.sid} chat={chat} update={item as WashimaGroupUpdate} washima={washima} profilePic={profilePic} />
                    )
                )}
                {loading && <LinearProgress sx={{ position: "absolute", bottom: 0, left: 0, right: 0 }} />}
            </Box>
            <WashimaInput
                onSubmit={onSendMessage}
                disabled={!chat}
                washima={washima}
                chat_id={chat.id._serialized}
                selectedMessages={selectedMessages}
                onForwardPress={() => setChooseForwardingContacts(true)}
                inBoards={inBoards}
            />
            <Paper
                elevation={5}
                sx={{
                    opacity: isScrolled ? 1 : 0,
                    pointerEvents: isScrolled ? "auto" : "none",
                    position: "absolute",
                    bottom: washimaInput.replyMessage ? "11vw" : "7vw",
                    right: "2vw",
                    borderRadius: "100%",
                    transition: "0.5s",
                }}
            >
                <IconButton onClick={() => messagesBoxRef.current?.scrollTo({ behavior: "smooth", top: 0 })}>
                    <KeyboardDoubleArrowDown />
                </IconButton>
            </Paper>

            <SelectContactsModal
                open={chooseForwardingContacts}
                onClose={() => setChooseForwardingContacts(false)}
                washima={washima}
                title="Encaminhar mensagens para"
                onSubmit={onForwardMessages}
            />
        </Paper>
    ) : (
        <NoChat />
    )
}
