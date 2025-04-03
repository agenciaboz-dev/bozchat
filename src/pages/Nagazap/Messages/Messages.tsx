import React, { useCallback, Dispatch, SetStateAction, useEffect, useState, useMemo } from "react"
import { Box, CircularProgress, debounce, IconButton, TextField, useMediaQuery } from "@mui/material"
import { Subroute } from "../Subroute"
import { api } from "../../../api"
import { NagaChat, NagaMessage, Nagazap } from "../../../types/server/class/Nagazap"
import { ArrowBack, Refresh, Search } from "@mui/icons-material"
import { useIo } from "../../../hooks/useIo"
import { ChatItem } from "./ChatItem"
import { ChatContainer } from "./ChatContainer"
import { useUser } from "../../../hooks/useUser"
import { textFieldStyle } from "../../../style/textfield"
import { useDarkMode } from "../../../hooks/useDarkMode"
import { NoChat } from "../../Washima/WashimaChat/NoChat"
import { normalizePhonenumber } from "../../../tools/normalize"

interface MessagesScreenProps {
    nagazap: Nagazap
    setShowInformations: Dispatch<SetStateAction<boolean>>
}

export const MessagesScreen: React.FC<MessagesScreenProps> = ({ nagazap, setShowInformations }) => {
    const { darkMode } = useDarkMode()
    const io = useIo()
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { user } = useUser()

    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState<NagaMessage[]>([])
    const [filter, setFilter] = useState("")
    const [filteredMessages, setFilteredMessages] = useState<NagaMessage[]>(messages)
    const [selectedChat, setSelectedChat] = useState<NagaChat | null>(null)

    const chats = useMemo(() => {
        const chats: NagaChat[] = []

        const conversations = new Map<string, NagaMessage[]>()

        messages.forEach((message) => {
            const normalizedFrom = normalizePhonenumber(message.from)
            if (!conversations.has(normalizedFrom)) {
                conversations.set(normalizedFrom, [])
            }
            conversations.get(normalizedFrom)!.push(message)
        })
        conversations.forEach((messages) => {
            chats.push({
                from: messages[0].from,
                lastMessage: messages[messages.length - 1],
                messages,
                name: messages.find((item) => item.name !== nagazap.displayPhone)?.name || "EITA PREULA",
            })
        })

        return chats
            .map((chat) => ({ ...chat, messages: chat.messages.reverse() }))
            .sort((a, b) => Number(b.lastMessage.timestamp) - Number(a.lastMessage.timestamp))
    }, [filteredMessages])

    const fetchMessages = async () => {
        setLoading(true)

        try {
            const response = await api.get("/nagazap/messages", { params: { nagazap_id: nagazap.id, user_id: user?.id } })
            console.log("a")
            console.log(response.data)
            setMessages(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const onSearch = (value: string) => {
        const text = value.toLowerCase()
        setFilter(text)
    }

    const debouncedSearch = useCallback(debounce(onSearch, 300), [onSearch])

    const onChatClick = (chat: NagaChat) => setSelectedChat(chat)

    useEffect(() => {
        setMessages([])
        setSelectedChat(null)
        fetchMessages()
    }, [nagazap])

    useEffect(() => {
        io.on(`nagazap:${nagazap.id}:message`, (message: NagaMessage) => {
            setMessages((messages) => [...messages, message])

            if (message.from === selectedChat?.from) {
                const messages = selectedChat.messages
                messages.unshift(message)
                setSelectedChat({ ...selectedChat, lastMessage: message, messages })
            }
        })

        return () => {
            io.off(`nagazap:${nagazap.id}:message`)
        }
    }, [nagazap, selectedChat])

    useEffect(() => {
        setFilteredMessages(messages)

        io.on("nagazap:response", (message: NagaMessage) => {
            setMessages((list) => [...list, message])
        })

        return () => {
            io.off("nagazap:response")
        }
    }, [messages])

    useEffect(() => {
        setFilteredMessages(
            messages
                .filter(
                    (message) =>
                        message?.from?.includes(filter) ||
                        message?.name?.toLowerCase()?.includes(filter) ||
                        message?.text?.toLowerCase()?.includes(filter)
                )
                .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
        )
    }, [filter])

    return (
        <Subroute
            title="Mensagens"
            space={isMobile ? true : undefined}
            right={
                <IconButton onClick={fetchMessages} disabled={loading}>
                    {loading ? <CircularProgress size="1.5rem" color="secondary" /> : <Refresh />}
                </IconButton>
            }
            left={
                isMobile ? (
                    <IconButton
                        onClick={() => {
                            setShowInformations(false)
                        }}
                    >
                        <ArrowBack />
                    </IconButton>
                ) : null
            }
        >
            {isMobile ? (
                selectedChat ? (
                    <ChatContainer chat={selectedChat} onClose={() => setSelectedChat(null)} nagazap={nagazap} />
                ) : (
                    <Box sx={{ flexDirection: "column", gap: "5vw" }}>
                        <TextField
                            placeholder="Nome, número ou texto"
                            label="Buscar mensagens"
                            InputProps={{ startAdornment: <Search />, sx: { gap: "2vw" } }}
                            onChange={(ev) => debouncedSearch(ev.target.value)}
                            sx={textFieldStyle({ darkMode })}
                        />
                        <Box
                            sx={{
                                flexDirection: "column",
                                gap: "5vw",
                                margin: "-2vw",
                                padding: "2vw",
                                marginTop: "0",
                                paddingTop: "0",
                            }}
                        >
                            {chats.map((chat) => (
                                <ChatItem key={chat.from} chat={chat} onChatClick={onChatClick} />
                            ))}
                        </Box>
                    </Box>
                )
            ) : (
                <Box sx={{ gap: "1vw", marginTop: "-1vw", flex: 1 }}>
                    <Box sx={{ flexDirection: "column", gap: "1vw" }}>
                        <TextField
                            placeholder="Nome, número ou texto da mensagem"
                            label="Buscar mensagens"
                            InputProps={{ startAdornment: <Search />, sx: { gap: "0.5vw" } }}
                            onChange={(ev) => debouncedSearch(ev.target.value)}
                            sx={textFieldStyle({ darkMode })}
                        />
                        <Box
                            sx={{
                                flexDirection: "column",
                                width: "25vw",
                                gap: "1vw",
                                overflow: "scroll",
                                maxHeight: "30vw",
                                margin: "-1vw",
                                padding: "1vw",
                                marginTop: "0",
                                paddingTop: "0",
                            }}
                        >
                            {chats.map((chat) => (
                                <ChatItem key={chat.from} chat={chat} onChatClick={onChatClick} active={selectedChat?.from === chat.from} />
                            ))}
                        </Box>
                    </Box>
                    {selectedChat ? (
                        <ChatContainer chat={selectedChat} onClose={() => setSelectedChat(null)} nagazap={nagazap} />
                    ) : (
                        <NoChat nagazap />
                    )}
                </Box>
            )}
        </Subroute>
    )
}
