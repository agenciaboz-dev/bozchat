import React, { useCallback, useMemo, useRef, useState } from "react"
import { Box, debounce, IconButton, LinearProgress, MenuItem, TextField, Tooltip, Typography } from "@mui/material"
import { WashimaMessage } from "../../../types/server/class/Washima/WashimaMessage"
import { Search } from "@mui/icons-material"
import { api } from "../../../api"
import { MessageAuthor } from "../../Zap/MessageAuthor"
import { useFormatMessageTime } from "../../../hooks/useFormatMessageTime"

interface ChatSearchProps {
    washima_id: string
    chat_id?: string
    onMessageClick: (id: string) => void
}

interface MessageContainerProps {
    message: WashimaMessage
    onMessageClick: (id: string) => void
}

const MessageContainer: React.FC<MessageContainerProps> = ({ message, onMessageClick }) => {
    const formatTime = useFormatMessageTime()
    return (
        <MenuItem
            sx={{ whiteSpace: "normal", flexDirection: "column", alignItems: "flex-start", padding: 0 }}
            onClick={() => onMessageClick(message.id.id)}
        >
            <MessageAuthor contact_id={message.fromMe ? "Você" : message.author} />
            <Typography>{message.body}</Typography>
            <Typography sx={{ fontSize: "0.65rem", opacity: 0.7 }}>{formatTime(new Date(message.timestamp * 1000), "date-only")}</Typography>
        </MenuItem>
    )
}

export const ChatSearch: React.FC<ChatSearchProps> = (props) => {
    const searchInput = useRef<HTMLInputElement>(null)

    const [showSearchField, setShowSearchField] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [searching, setSearching] = useState(false)
    const [searchResult, setSearchResult] = useState<WashimaMessage[]>([])

    const showSearchMenu = useMemo(() => !!searchValue, [searchValue])

    const openSearch = () => {
        setShowSearchField(true)
        searchInput.current?.focus()
    }

    const handleSearch = async (value: string) => {
        setSearchValue(value)
        if (value) {
            await debouncedSearch(value)
        } else {
            setSearchResult([])
        }
    }

    const searchMessages = async (value: string) => {
        console.log("aaaa")
        setSearching(true)
        try {
            const response = await api.get("/washima/search", {
                params: { washima_id: props.washima_id, search: value, chat_id: props.chat_id, target: "messages" },
            })
            const messages = response.data as WashimaMessage[]
            setSearchResult(messages)
        } catch (error) {
            console.log(error)
        } finally {
            setSearching(false)
        }
    }

    const debouncedSearch = useCallback(debounce(searchMessages, 500), [props.chat_id])

    const onMessageClick = (id: string) => {
        props.onMessageClick(id)
    }

    const reset = () => {
        searchInput.current?.blur()
        setShowSearchField(false)
        setSearchResult([])
        setSearchValue("")
    }

    return (
        <Tooltip
            open={showSearchMenu}
            arrow
            title={
                <Box sx={{ flexDirection: "column", gap: "0.25vw", maxHeight: "70vh", overflow: "auto" }}>
                    <Typography>Busca:</Typography>
                    {searching ? <LinearProgress variant="indeterminate" sx={{ width: "10vw" }} /> : null}
                    {searchResult
                        .sort((a, b) => b.timestamp - a.timestamp)
                        .map((message) => (
                            <MessageContainer key={message.sid} message={message} onMessageClick={onMessageClick} />
                        ))}
                </Box>
            }
        >
            <TextField
                inputRef={searchInput}
                placeholder={showSearchField ? "Digite para buscar" : undefined}
                value={searchValue}
                onChange={(ev) => handleSearch(ev.target.value)}
                sx={{
                    transition: "0.5s",
                    width: showSearchField ? "15vw" : "2.5vw",
                    minWidth: 0,
                    "& .MuiInput-underline::before": { display: showSearchField ? undefined : "none" },
                }}
                variant="standard"
                InputProps={{
                    startAdornment: (
                        <IconButton onClick={openSearch} sx={{ pointerEvents: showSearchField ? "none" : undefined }}>
                            <Search />
                        </IconButton>
                    ),
                }}
                onClick={openSearch}
                onBlur={() => setTimeout(() => reset(), 500)}
            />
        </Tooltip>
    )
}
