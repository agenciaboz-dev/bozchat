import React, { useCallback, useMemo, useState } from "react"
import { Box, debounce, Dialog, IconButton, Paper, TextField, Typography } from "@mui/material"
import { Chat } from "../../../types/Chat"
import { Close, Search, Send } from "@mui/icons-material"
import { Washima } from "../../../types/server/class/Washima/Washima"
import { ContactItem } from "./ContactItem"
import normalize from "../../../tools/normalize"
import { textFieldStyle } from "../../../style/textfield"
import { useDarkMode } from "../../../hooks/useDarkMode"

interface SelectContactsModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (contactIds: string[]) => void
    title: string
    washima: Washima
}

export const SelectContactsModal: React.FC<SelectContactsModalProps> = (props) => {
    const { darkMode } = useDarkMode()
    const [selectedContactsIds, setSelectedContactsIds] = useState<string[]>([])
    const [searchedValue, setSearchedValue] = useState("")

    const contacts = useMemo(
        () => (props.washima.chats as Chat[]).filter((chat) => normalize(chat?.name || "").includes(normalize(searchedValue))),
        [props.washima, searchedValue]
    )

    const handleClose = () => {
        props.onClose()
        reset()
    }

    const handleSelectContact = (sid: string) =>
        setSelectedContactsIds((list) => (list.includes(sid) ? list.filter((item) => item !== sid) : [...list, sid]))

    const onSearch = (text: string) => setSearchedValue(text)

    const debouncedOnSearch = useCallback(debounce(onSearch, 300), [onSearch])

    const handleSubmit = () => {
        props.onSubmit(selectedContactsIds)
        props.onClose()
        setTimeout(() => reset(), 500)
    }

    const reset = () => {
        setSelectedContactsIds([])
        setSearchedValue("")
    }

    return (
        <Dialog open={props.open} onClose={handleClose} PaperProps={{ sx: { maxWidth: "30vw", width: "30vw" } }}>
            <Box sx={{ flexDirection: "column", bgcolor: "background.default", gap: "0.5vw", padding: "1vw" }}>
                <Box sx={{ alignItems: "center", justifyContent: "space-between" }}>
                    <Typography sx={{ fontWeight: "bold", color: "text.secondary", fontSize: "1.2rem" }}>{props.title}</Typography>
                    <IconButton onClick={handleClose}>
                        <Close />
                    </IconButton>
                </Box>

                <TextField
                    variant="standard"
                    placeholder="Digite o nome do contato"
                    label="Filtrar"
                    onChange={(ev) => debouncedOnSearch(ev.target.value)}
                    InputProps={{
                        startAdornment: <Search />,
                        sx: { gap: "0.5vw" },
                    }}
                    sx={{
                        ...textFieldStyle({ darkMode }),
                        "& .MuiInput-underline:before": {
                            borderBottomColor: "text.disabled",
                        },
                        "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                            borderBottomColor: "text.secondary",
                        },
                        "& .MuiInput-underline:after": {
                            borderBottomColor: "primary.main",
                        },
                    }}
                />

                <Box sx={{ flexDirection: "column", overflowY: "scroll", height: "65vh", margin: "-1vw", marginTop: 0 }}>
                    {contacts
                        // .sort((a, b) =>  )
                        .map((item) => (
                            <ContactItem
                                key={item.id._serialized}
                                chat={item}
                                selected={selectedContactsIds.includes(item.id._serialized)}
                                selectContact={handleSelectContact}
                                washima={props.washima}
                            />
                        ))}
                </Box>

                <Paper sx={{ padding: "1vw", margin: "-1vw", marginTop: "0.5vw", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography sx={{ fontWeight: "bold", color: "text.secondary" }}>
                        {selectedContactsIds.length > 0
                            ? selectedContactsIds.length > 1
                                ? `${selectedContactsIds.length} contatos selecionados`
                                : "1 contato selecionado"
                            : "Nenhum contato selecionado"}
                    </Typography>
                    <IconButton onClick={handleSubmit}>
                        <Send />
                    </IconButton>
                </Paper>
            </Box>
        </Dialog>
    )
}
