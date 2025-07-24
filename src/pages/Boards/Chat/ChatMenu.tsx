import React, { useState } from "react"
import { Box, IconButton, Menu, MenuItem } from "@mui/material"
import { Chat } from "../../../types/server/class/Board/Chat"
import { MoreHoriz } from "@mui/icons-material"

interface ChatMenuProps {
    chat: Chat
    board_id: string
    room_id: string
    onTransfer: (action?: "copy" | "transfer") => void
    onArchive: () => void
}

export const ChatMenu: React.FC<ChatMenuProps> = (props) => {
    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)

    const closeMenu = () => {
        setMenuAnchorEl(null)
    }

    return (
        <Box sx={{}}>
            <IconButton onClick={(ev) => setMenuAnchorEl(ev.currentTarget)}>
                <MoreHoriz />
            </IconButton>

            <Menu open={!!menuAnchorEl} onClose={closeMenu} anchorEl={menuAnchorEl}>
                <MenuItem
                    onClick={() => {
                        closeMenu()
                        props.onTransfer()
                    }}
                >
                    Transferir
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        closeMenu()
                        props.onTransfer("copy")
                    }}
                >
                    Copiar
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        closeMenu()
                        props.onArchive()
                    }}
                >
                    Arquivar
                </MenuItem>
            </Menu>
        </Box>
    )
}
