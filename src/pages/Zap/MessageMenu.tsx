import React, { useState } from "react"
import { Box, CircularProgress, IconButton, Menu, MenuItem, MenuItemProps, Paper, Typography, useMediaQuery } from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { useWashimaInput } from "../../hooks/useWashimaInput"
import { WashimaMessage } from "../../types/server/class/Washima/WashimaMessage"
import { api } from "../../api"
import { saveAs } from "file-saver"
import { motion } from "framer-motion"
import { animationVariants } from "../../tools/animationVariants"
import { useDarkMode } from "../../hooks/useDarkMode"
import { custom_colors } from "../../style/colors"

const MessageMenuButton: React.FC<{ onClick: (event: React.MouseEvent<HTMLElement>) => void }> = ({ onClick }) => {
    return (
        <IconButton
            onClick={onClick}
            sx={{
                padding: "0",
                margin: "0.2vw",
            }}
        >
            <ExpandMoreIcon sx={{ width: "2vw", height: "2vw" }} />
        </IconButton>
    )
}

const MessageMenuItem: React.FC<MenuItemProps> = (props) => {
    return (
        <MenuItem onClick={props.onClick}>
            <Typography
                sx={{
                    color: "text.secondary",
                }}
            >
                {props.children}
            </Typography>
        </MenuItem>
    )
}

interface MessageMenuProps {
    from_me?: boolean
    onClose: () => void
    message: WashimaMessage
    onSelect: () => void
}

export const MessageMenu: React.FC<MessageMenuProps> = ({ from_me, onClose, message, onSelect }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()
    const washimaInput = useWashimaInput()
    const is_deleted = message.type === "revoked" || message.deleted

    const [menuIsOpen, setMenuIsOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [downloading, setDownloading] = useState(false)

    const handleToggleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
        setMenuIsOpen(!menuIsOpen)
        console.log(message)
    }

    const handleCloseMenu = () => {
        setMenuIsOpen(false)
        onClose()
    }

    const onReplyPress = () => {
        washimaInput.setReplyMessage(message)
        handleCloseMenu()
    }

    const onForwardPress = () => {
        washimaInput.setDeleting(false)
        onSelect()
        handleCloseMenu()
    }

    const onDeletePress = (everyone: boolean | "everyone") => {
        onSelect()
        handleCloseMenu()
        washimaInput.setDeleting(everyone)
    }

    const downloadMedia = async () => {
        if (!message.hasMedia || downloading || is_deleted) return

        try {
            setDownloading(true)

            const response = await api.get("/washima/media", {
                params: { washima_id: message.washima_id, message_id: message.sid },
                responseType: "blob",
            })
            const blob = response.data
            saveAs(blob, message.id.id + "." + response.headers["content-type"].split("/")[1])
        } catch (error) {
            console.log(error)
        } finally {
            setDownloading(false)
        }
    }

    return (
        <motion.div initial="initial" animate={"animate"} variants={animationVariants({ opacityOnly: true })}>
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: from_me ? (isMobile ? "-15vw" : "-2.5vw") : undefined,
                    right: !from_me ? (isMobile ? "-15vw" : "-2.5vw") : undefined,
                }}
            >
                <MessageMenuButton onClick={handleToggleMenu} />

                <Menu
                    anchorEl={anchorEl}
                    open={menuIsOpen}
                    onClose={handleCloseMenu}
                    MenuListProps={{
                        sx: {
                            bgcolor: darkMode ? custom_colors.darkMode_messageMenuBg : custom_colors.lightMode_messageMenuBg,
                        },
                    }}
                >
                    <MessageMenuItem onClick={onReplyPress}>Responder</MessageMenuItem>
                    {message.hasMedia && (
                        <MessageMenuItem onClick={downloadMedia}>
                            {downloading ? <CircularProgress size={"1rem"} sx={{ color: "text.secondary" }} /> : "Baixar"}
                        </MessageMenuItem>
                    )}
                    <MessageMenuItem onClick={onForwardPress}>Encaminhar</MessageMenuItem>
                    {from_me && <MessageMenuItem onClick={() => onDeletePress("everyone")}>Deletar para todos</MessageMenuItem>}
                </Menu>
            </Box>
        </motion.div>
    )
}
