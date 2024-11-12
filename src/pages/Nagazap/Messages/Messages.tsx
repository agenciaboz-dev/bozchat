import React, { useCallback, Dispatch, SetStateAction, useEffect, useState } from "react"
import { Box, CircularProgress, debounce, Grid, IconButton, TextField, ToggleButton, ToggleButtonGroup, useMediaQuery } from "@mui/material"
import { Subroute } from "../Subroute"
import { api } from "../../../api"
import { NagaMessage, Nagazap } from "../../../types/server/class/Nagazap"
import { MessageContainer } from "./MessageContainer"
import { ArrowBack, List, Refresh, Search, ViewList, ViewQuilt } from "@mui/icons-material"
import { useIo } from "../../../hooks/useIo"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { MessageSkeleton } from "./MessageSkeleton"

interface MessagesScreenProps {
    nagazap: Nagazap
    setShowInformations: Dispatch<SetStateAction<boolean>>
}

export const MessagesScreen: React.FC<MessagesScreenProps> = ({ nagazap, setShowInformations }) => {
    const io = useIo()
    const isMobile = useMediaQuery("(orientation: portrait)")

    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState<NagaMessage[]>([])
    const [filter, setFilter] = useState("")
    const [filteredMessages, setFilteredMessages] = useState<NagaMessage[]>(messages)
    const [layoutType, setLayoutType] = useState<"masonry" | "list">(isMobile ? "list" : "masonry")

    const fetchMessages = async () => {
        setLoading(true)

        try {
            const response = await api.get("/nagazap/messages", { params: { nagazap_id: nagazap.id } })
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

    useEffect(() => {
        fetchMessages()
    }, [])

    useEffect(() => {
        io.on(`nagazap:${nagazap.id}:message`, (message) => {
            setMessages((messages) => [...messages, message])
        })

        return () => {
            io.off(`nagazap:${nagazap.id}:message`)
        }
    }, [nagazap])

    useEffect(() => {
        setFilteredMessages(messages)
    }, [messages])

    return (
        <Subroute
            title="Mensagens"
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
            <Box sx={{ gap: "1vw" }}>
                <TextField
                    placeholder="Digite o nome, número ou texto da mensagem"
                    label="Buscar mensagens"
                    InputProps={{ startAdornment: <Search />, sx: { gap: "0.5vw" } }}
                    onChange={(ev) => debouncedSearch(ev.target.value)}
                />
                {!isMobile ? (
                    <ToggleButtonGroup value={layoutType} onChange={(_, value) => setLayoutType(value)} exclusive>
                        <ToggleButton value="masonry">
                            <ViewQuilt />
                        </ToggleButton>
                        <ToggleButton value="list">
                            <ViewList />
                        </ToggleButton>
                    </ToggleButtonGroup>
                ) : null}
            </Box>
            <Masonry
                columnsCount={layoutType === "list" ? 1 : 3}
                gutter="1vw"
                style={{ height: "0vh", gap: "1vw", maxWidth: layoutType === "list" ? "24.5vw" : undefined }}
                sequential
            >
                {/* @ts-ignore */}
                {loading
                    ? new Array(20).fill(1).map((_, index) => <MessageSkeleton key={index} />)
                    : filteredMessages
                          .filter(
                              (message) =>
                                  message?.from?.includes(filter) ||
                                  message?.name?.toLowerCase()?.includes(filter) ||
                                  message?.text?.toLowerCase()?.includes(filter)
                          )
                          .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
                          .map((item) => <MessageContainer key={item.id} message={item} />)}
            </Masonry>
        </Subroute>
    )
}
