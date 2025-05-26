import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Avatar, Box, IconButton, LinearProgress, Paper, Skeleton, Typography, useMediaQuery } from "@mui/material"
import { Washima, WashimaMediaForm, WashimaProfilePic } from "../../../types/server/class/Washima/Washima"
import CancelIcon from "@mui/icons-material/Cancel"
import { api } from "../../../api"
import { useIo } from "../../../hooks/useIo"
import { WashimaInput } from "../WashimaInput"
import { KeyboardDoubleArrowDown } from "@mui/icons-material"
import { WashimaMessage } from "../../../types/server/class/Washima/WashimaMessage"
import { WashimaGroupUpdate } from "../../../types/server/class/Washima/WashimaGroupUpdate"
import { GroupUpdateItem } from "./GroupUpdateItem"
import { Chat } from "../../../types/Chat"
import { NoChat } from "../../Zap/NoChat"
import { PhotoProvider, PhotoView } from "react-photo-view"
import { CopyAllButton } from "./WashimaTools/CopyAll"
import { useWashimaInput } from "../../../hooks/useWashimaInput"
import Message from "../../Zap/Message"
import { SelectContactsModal } from "../SelectContactsModal/SelectContactsModal"
import { useDarkMode } from "../../../hooks/useDarkMode"
import { ChatSearch } from "./ChatSearch"
import { custom_colors } from "../../../style/colors"
import { BotActivity } from "./WashimaTools/BotActivity"
import { getAuthorName } from "../../Zap/MessageAuthor"

interface WashimaChatProps {
    washima: Washima
    chat: Chat | null
    onClose: () => void
    inBoards?: boolean
}

export const WashimaChat: React.FC<WashimaChatProps> = ({ washima, chat, onClose, inBoards }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()
    const io = useIo()
    const messagesBoxRef = useRef<HTMLDivElement>(null)
    const washimaInput = useWashimaInput()

    const [messages, setMessages] = useState<WashimaMessage[]>([])
    const [groupUpdates, setGroupUpdates] = useState<WashimaGroupUpdate[]>([])
    const [loadingMessageId, setLoadingMessageId] = useState<string | null>(null)
    const [selectedMessages, setSelectedMessages] = useState<WashimaMessage[]>([])
    const [chooseForwardingContacts, setChooseForwardingContacts] = useState(false)
    const [contactName, setContactName] = useState(chat?.name || "")
    const [contactPhone, setContactPhone] = useState("")

    const messages_and_group_updates = useMemo(
        () => [...messages, ...groupUpdates].sort((a, b) => Number(b.timestamp) - Number(a.timestamp)),
        [messages, groupUpdates]
    )

    const [profilePic, setProfilePic] = useState("")
    const [loading, setLoading] = useState(false)
    const [isScrolled, setIsScrolled] = useState<boolean>(false)
    const isInContacts = !useMemo(() => {
        if (!chat) return false
        // Check if the name contains only valid phone number characters
        const hasValidChars = /^[+\d\s\-()]*$/.test(chat.name)
        // Extract all digits from the name
        const digits = chat.name.replace(/\D/g, "")
        // Ensure the number of digits is within a valid range (adjust min/max as needed)
        return hasValidChars && digits.length >= 5 && digits.length <= 15
    }, [chat])

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

    const fetchMessages = useCallback(
        async (offset: number = 0) => {
            if (!chat) return

            try {
                const params = { washima_id: washima.id, chat_id: chat.id._serialized, is_group: chat.isGroup, offset }
                console.log(offset)
                const response = await api.get("/washima/chat", { params: params })
                const data = response.data as { messages: WashimaMessage[]; profilePic: string; group_updates?: WashimaGroupUpdate[] }
                if (data.messages && data.messages.every((message) => message.chat_id === chat.id._serialized)) {
                    addMessages(data.messages)
                }
                setGroupUpdates(data.group_updates || [])
            } catch (error) {
                console.log(error)
            }
        },
        [chat]
    )

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
            const element = document.getElementById(`message:${washima.id}_${loadingMessageId}`)
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
        if (chat?.lastMessage && chat.lastMessage.type !== "e2e_notification" && chat.lastMessage.type !== "notification_template") {
            setLoadingMessageId(chat.lastMessage.id.id)
        }
    }, [chat?.lastMessage])

    useEffect(() => {
        io.on("washima:message:update", (updated_message: WashimaMessage, updated_chat_id: string) => {
            if (!updated_message) return
            const index = messages.findIndex((item) => item.sid === updated_message.sid)
            if (chat?.id._serialized === updated_chat_id && index > -1) {
                setMessages((messages) => {
                    const new_messages = [...messages]
                    new_messages[index] = updated_message
                    return new_messages
                })
            }
        })

        io.on("washima:message", (data: { chat: Chat; message: WashimaMessage }) => {
            setMessages((values) => [...values.filter((item) => item.sid !== data.message.sid), data.message])
            if (data.message.fromMe) {
                messagesBoxRef.current?.scrollTo({ top: 0, behavior: "smooth" })
            }
        })

        return () => {
            io.off("washima:message:update")
            io.off("washima:message")
        }
    }, [chat, messages, setMessages])

    useEffect(() => {
        setContactName("")

        if (!isInContacts && !!chat) {
            io.emit("washima:author", washima.id, chat.id._serialized, (contact: string) => {
                console.log({ contact })
                const { author_name, author_phone } = getAuthorName(contact)
                setContactName(author_name)
                setContactPhone(author_phone)
            })
        }

        if (isInContacts && !!chat) {
            setContactName(chat.name)
        }
    }, [chat, isInContacts])

    useEffect(() => {
        console.log({ chat })
        reset()
        if (chat) {
            setLoading(true)
            fetchChat()

            io.on("washima:group:update", (update: WashimaGroupUpdate) => {
                if (update.chat_id === chat.id._serialized) {
                    console.log(update)
                    setGroupUpdates((values) => [...values.filter((item) => item.sid !== update.sid), update])
                    if (update.type === "picture") {
                        fetchProfilePic()
                    }
                }
            })

            io.emit("washima:channel:join", chat.id._serialized)

            return () => {
                io.emit("washima:channel:leave", chat.id._serialized)

                io.off("washima:group:update")
            }
        }
    }, [chat])

    useEffect(() => {
        console.log({ isScrolled })
    }, [isScrolled])

    return chat ? (
        <Paper
            elevation={inBoards ? 0 : undefined}
            sx={{
                flex: 1,
                justifyContent: isMobile ? "flex-end" : undefined,
                bgcolor: inBoards ? "transparent" : darkMode ? "background.paper" : custom_colors.lightMode_chatWrapper,
                // height: isMobile ? "77vh" : "90vh",
                padding: inBoards ? 0 : isMobile ? "5vw" : "1vw",
                color: "text.secondary",
                gap: isMobile ? "5vw" : "1vw",
                flexDirection: "column",
                overflow: "hidden",
                position: "relative",
                width: 0,
            }}
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
                    {!profilePic && loading ? (
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
                    <Box sx={{ flex: 1, alignItems: "center", gap: "0.5vw" }}>
                        <Typography
                            sx={{
                                fontWeight: "bold",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                maxWidth: isInContacts ? "70%" : "55%",
                                fontSize: "1vw",
                            }}
                            title={contactName}
                        >
                            {!isInContacts && "~ "}
                            {contactName}
                        </Typography>
                        {!isInContacts && <Typography sx={{ fontSize: "0.8vw" }}>{contactPhone}</Typography>}
                    </Box>
                    {!!chat && (
                        <Box sx={{ marginLeft: "auto", alignItems: "center" }}>
                            <ChatSearch washima_id={washima.id} chat_id={chat.id._serialized} onMessageClick={setLoadingMessageId} />
                            <BotActivity chat_id={chat.id._serialized} />
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
                    height: inBoards ? "20vw" : isMobile ? "60vh" : washimaInput.replyMessage ? "45vh" : "55vh",
                    bgcolor: darkMode ? "background.default" : custom_colors.lightMode_chatBackground,
                    border: darkMode ? `1px solid ${custom_colors.darkMode_border}` : `1px solid ${custom_colors.lightMode_border}`,
                    boxShadow: darkMode ? undefined : `inset 0 0 5px ${custom_colors.lightMode_border}`,
                    overflowY: "auto",
                    borderRadius: isMobile ? "2vw" : "4px",
                    padding: inBoards ? (isMobile ? "5vw" : "1vw") : isMobile ? "4vw" : "2vw",
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
                    bottom: washimaInput.replyMessage
                        ? inBoards
                            ? "9vw"
                            : isMobile
                            ? "23vw"
                            : "11vw"
                        : inBoards
                        ? "5vw"
                        : isMobile
                        ? "23vw"
                        : "7vw",
                    right: isMobile ? "5vw" : inBoards ? "1vw" : "2vw",
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
