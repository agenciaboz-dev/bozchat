import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Avatar, Box, IconButton, LinearProgress, Paper, Skeleton, useMediaQuery } from "@mui/material"
import { Washima, WashimaMediaForm, WashimaProfilePic } from "../../../types/server/class/Washima/Washima"
import CancelIcon from "@mui/icons-material/Cancel"
import { api } from "../../../api"
import { Message } from "../../Zap/Message"
import { useIo } from "../../../hooks/useIo"
import { WashimaInput } from "../WashimaInput"
import { CopyAll, KeyboardDoubleArrowDown, Lock } from "@mui/icons-material"
import { WhatsappWebSvg } from "../WhatsappWebSvg"
import { WashimaMessage } from "../../../types/server/class/Washima/WashimaMessage"
import { WashimaGroupUpdate } from "../../../types/server/class/Washima/WashimaGroupUpdate"
import { GroupUpdateItem } from "./GroupUpdateItem"
import { Chat } from "../../../types/Chat"

interface WashimaChatProps {
    washima: Washima
    chat: Chat | null
    onClose: () => void
}

interface AlwaysScrollToBottomProps {
    loading: boolean
    shouldScroll: React.MutableRefObject<boolean>
}

const AlwaysScrollToBottom: React.FC<AlwaysScrollToBottomProps> = ({ loading, shouldScroll }) => {
    const elementRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!loading) {
            elementRef.current?.scrollIntoView()
        }
    }, [loading])

    useEffect(() => {
        if (shouldScroll.current) {
            elementRef.current?.scrollIntoView({ behavior: "smooth" })
            shouldScroll.current = false
        }
    }, [shouldScroll.current])

    return <div ref={elementRef} />
}

export const WashimaChat: React.FC<WashimaChatProps> = ({ washima, chat, onClose }) => {
    const io = useIo()
    const isMobile = useMediaQuery("(orientation: portrait)")
    const messagesBoxRef = useRef<HTMLDivElement>(null)
    const shouldScroll = useRef<boolean>(true)

    const [messages, setMessages] = useState<WashimaMessage[]>([])
    const [groupUpdates, setGroupUpdates] = useState<WashimaGroupUpdate[]>([])

    const messages_and_group_updates = useMemo(
        () => [...messages, ...groupUpdates]?.sort((a, b) => Number(a.timestamp) - Number(b.timestamp)),
        [messages, groupUpdates]
    )

    const [profilePic, setProfilePic] = useState("")
    const [loading, setLoading] = useState(false)
    const [isScrolled, setIsScrolled] = useState<boolean>(false)

    const handleScroll = () => {
        if (messagesBoxRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messagesBoxRef.current
            const maxScrollTop = scrollHeight - clientHeight

            const isAtBottom = Math.abs(scrollTop - maxScrollTop) < 1 // Allow small margin

            setIsScrolled(!isAtBottom)
        }
    }

    const onSubmit = (message?: string, media?: WashimaMediaForm) => {
        console.log({ message, media })
        if ((message || media) && chat) {
            console.log("mandando")
            io.emit("washima:message", washima.id, chat.id._serialized, message, media)
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
    }

    const copyAllMessages = async () => {
        if (!chat) return

        const texts: string[] = []
        messages.forEach((message) => {
            const text = `${message.fromMe ? "Eu:" : chat.name + ":"} ${message.body}`
            texts.push(text)
        })

        navigator.clipboard.writeText(texts.join("\n"))
    }

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
                    if (!isScrolled) shouldScroll.current = true
                    setMessages((values) => [...values, data.message])
                }
            })

            io.on("washima:group:update", (update: WashimaGroupUpdate) => {
                if (update.chat_id === chat.id._serialized) {
                    console.log(update)
                    if (!isScrolled) shouldScroll.current = true
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
            elevation={5}
            sx={{
                flex: 1,
                justifyContent: isMobile ? "flex-end" : "center",
                bgcolor: "background.paper",
                height: "90vh",
                padding: "1vw",
                color: "secondary.main",
                gap: "1vw",
                flexDirection: "column",
                overflow: "hidden",
                position: "relative",
            }}
        >
            <Box sx={{ gap: "2vw", alignItems: "center", height: isMobile ? "7vh" : "5vh", padding: isMobile ? "2vw" : "" }}>
                {loading ? (
                    <Skeleton variant="circular" animation="wave" sx={{ width: isMobile ? "12vw" : "3vw", height: isMobile ? "12vw" : "3vw" }} />
                ) : (
                    <Avatar
                        src={profilePic}
                        sx={{ width: isMobile ? "12vw" : "3vw", height: isMobile ? "12vw" : "3vw", bgcolor: "primary.main", cursor: "pointer" }}
                        // onClick={() => picture.open(profilePic || "")}
                    />
                )}
                <p style={{ fontWeight: "bold" }}>{chat?.name}</p>
                {!!chat && (
                    <Box sx={{ marginLeft: "auto" }}>
                        <IconButton sx={{ color: "white", padding: isMobile ? "0" : "" }} onClick={copyAllMessages}>
                            <CopyAll />
                        </IconButton>
                        <IconButton sx={{ color: "white", padding: isMobile ? "0" : "" }} onClick={onClose}>
                            <CancelIcon />
                        </IconButton>
                    </Box>
                )}
            </Box>

            <Box
                ref={messagesBoxRef}
                onScroll={handleScroll}
                sx={{
                    width: "100%",
                    height: "70vh",
                    bgcolor: "background.default",
                    overflowY: "auto",
                    borderRadius: isMobile ? "0 3vw 0 3vw" : "0 1.5vw 0 1.5vw",
                    padding: "2vw",
                    color: "text.secondary",
                    flexDirection: "column",
                    gap: isMobile ? "2.5vw" : "0.25vw",
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
                            previousItem={messages_and_group_updates[index - 1]}
                            onVisible={index % 5 === 4 ? () => fetchMessages(messages.length) : undefined}
                        />
                    ) : (
                        <GroupUpdateItem chat={chat} update={item as WashimaGroupUpdate} washima={washima} profilePic={profilePic} />
                    )
                )}
                <AlwaysScrollToBottom loading={loading} shouldScroll={shouldScroll} />
                {loading && <LinearProgress sx={{ position: "absolute", bottom: 0, left: 0, right: 0 }} />}
            </Box>
            <WashimaInput onSubmit={onSubmit} disabled={!chat} washima={washima} chat_id={chat.id._serialized} />
            <Paper
                elevation={5}
                sx={{
                    opacity: isScrolled ? 1 : 0,
                    pointerEvents: isScrolled ? "auto" : "none",
                    position: "absolute",
                    bottom: "7vw",
                    right: "2vw",
                    borderRadius: "100%",
                    transition: "0.5s",
                }}
            >
                <IconButton onClick={() => messagesBoxRef.current?.scrollTo({ behavior: "smooth", top: 987987987 })}>
                    <KeyboardDoubleArrowDown />
                </IconButton>
            </Paper>
        </Paper>
    ) : (
        <Paper
            sx={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "1vw",
                color: "secondary.main",
                padding: "1vw",
            }}
            elevation={5}
        >
            <WhatsappWebSvg />
            <Box sx={{ fontSize: "2rem" }}>Washima Web</Box>
            <Box>Envie e receba mensagens sem precisar do celular conectado a conta.</Box>
            <Box>Use o WhatsApp em quantos dispositivos quiser, ao mesmo tempo.</Box>

            <Box sx={{ position: "absolute", bottom: 0, gap: "0.5vw", paddingBottom: "1vw", alignItems: "center" }}>
                <Lock sx={{ width: "0.7vw", height: "0.7vw" }} />
                <Box fontSize={"0.8rem"}>Suas mensagens não são protegidas com criptografia nenhuma.</Box>
            </Box>
        </Paper>
    )
}
