import React, { useEffect, useState } from "react"
import { Avatar, Badge, Box, Chip, MenuItem, Paper, useTheme } from "@mui/material"
import { useFormatMessageTime } from "../../hooks/useFormatMessageTime"
import { useMediaQuery } from "@mui/material"
import { api } from "../../api"
import { Washima, WashimaProfilePic } from "../../types/server/class/Washima/Washima"
import { useVisibleCallback } from "burgos-use-visible-callback"
import { AttachFile, Headphones, PhotoCamera, Videocam } from "@mui/icons-material"
import { MessageAck } from "../Zap/MessageAck"
import { Chat } from "../../types/Chat"
import { DeletedMessage } from "../Zap/DeletedMessage"
import { WashimaMessage } from "../../types/server/class/Washima/WashimaMessage"

interface ChatProps {
    washima: Washima
    chat: Chat
    onChatClick: (chat: Chat) => void
    active?: boolean
    onVisible?: () => void
}

export const ChatContainer: React.FC<ChatProps> = ({ chat, onChatClick, washima, active, onVisible }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const formatTime = useFormatMessageTime()

    const ref = useVisibleCallback(() => {
        if (onVisible) {
            onVisible()
            console.log(chat)
        }
        if (chat.lastMessage.hasMedia) {
            fetchMediaMetadata()
        }
    }, {})

    const [profilePic, setProfilePic] = useState("")
    const [mediaMetaData, setMediaMetaData] = useState<{
        mimetype: string | undefined
        filename: string | undefined
        message_id: string
    }>()
    const [formattedMediaType, setFormattedMediaType] = useState("")
    const [MediaIcon, setMediaIcon] = useState<React.ReactElement | null>(null)

    const mocked_last_message: WashimaMessage = {
        ...chat.lastMessage,
        chat_id: chat.id._serialized,
        sid: chat.lastMessage.id._serialized,
        washima_id: washima.id,
        deleted: false,
        edited: false,
    }

    const handleClick = () => {
        onChatClick(chat)
    }

    const fetchMediaMetadata = async () => {
        try {
            const response = await api.get("/washima/media-metadata", {
                params: { washima_id: washima.id, message_id: chat.lastMessage.id._serialized },
            })
            setMediaMetaData(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchProfilePic = async () => {
        try {
            const response = await api.get("/washima/profile-pic", { params: { washima_id: washima.id, chat_id: chat.id._serialized } })
            const data = response.data as WashimaProfilePic
            setProfilePic(data.url)
        } catch (error) {
            console.log(error)
        }
    }

    const formatMediaType = (mimetype: string) => {
        const icon_style = { width: "1vw", height: "1vw" }
        const values = {
            image: { label: "Imagem", icon: <PhotoCamera sx={icon_style} /> },
            video: { label: "Vídeo", icon: <Videocam sx={icon_style} /> },
            audio: { label: "Áudio", icon: <Headphones sx={icon_style} /> },
        }
        const type = mimetype.split("/")[0]

        const match = Object.entries(values).find(([key, value]) => key === type)
        if (match) {
            setFormattedMediaType(match[1].label)
            setMediaIcon(match[1].icon)
            return
        }

        setFormattedMediaType("mídia")
        setMediaIcon(<AttachFile sx={icon_style} />)
    }

    useEffect(() => {
        if (mediaMetaData?.mimetype) {
            formatMediaType(mediaMetaData.mimetype)
        }
    }, [mediaMetaData])

    useEffect(() => {
        fetchProfilePic()
    }, [chat])

    return (
        <MenuItem
            // elevation={3}
            ref={ref}
            disabled={chat.isReadOnly}
            sx={{
                padding: isMobile ? "2vw 0" : "1vw",
                alignItems: "center",
                backgroundColor: active ? "action.hover" : "background.default",
                gap: isMobile ? "3vw" : "1vw",
                height: isMobile ? "20vw" : "5vw",
                cursor: "pointer",
                borderRadius: isMobile ? "3vw" : "0.5vw",
                borderBottom: "2px solid",
                borderColor: chat.isReadOnly ? "warning.main" : undefined,
                // borderRight: "1px solid",
                // boxShadow: "0px 5px 7px rgba(0, 0, 0, 0.2)",

                "&:hover": {
                    // outline: "2px solid",
                },
                width: isMobile ? "95vw" : "100%",
                flex: 1,
            }}
            onClick={handleClick}
        >
            <Paper elevation={2} sx={{ borderRadius: "100%" }}>
                <Avatar
                    src={profilePic}
                    sx={{ width: isMobile ? "15vw" : "3vw", height: isMobile ? "15vw" : "3vw" }}
                    // onClick={() => picture.open(profilePic || "")}
                    imgProps={{ draggable: false }}
                />
            </Paper>
            <Box
                sx={{
                    flexDirection: "column",
                    justifyContent: isMobile ? "center" : "space-between",
                    height: "100%",
                    overflow: "hidden",
                    color: chat.isReadOnly ? "warning.main" : "primary.main",
                    fontSize: isMobile ? "4vw" : "0.8vw",
                    flex: 1,
                }}
            >
                {/*//*  title and date */}
                <Box sx={{ justifyContent: "space-between", alignItems: "center", width: "100%", color: "secondary.main" }}>
                    <p
                        style={{ fontWeight: "bold", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", width: "75%" }}
                        title={chat.name}
                    >
                        {chat.name}
                    </p>
                    <Box
                        sx={{
                            fontSize: isMobile ? "3.5vw" : "0.65vw",
                            wordWrap: "break-word",
                            color: !!chat.unreadCount ? "warning.main" : undefined,
                            fontWeight: !!chat.unreadCount ? "bold" : undefined,
                        }}
                    >
                        {formatTime(new Date((chat.lastMessage?.timestamp || 0) * 1000))}
                    </Box>
                </Box>

                {/*//* message and unread count */}
                <Box
                    sx={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        width: isMobile ? "100%" : "100%",
                        overflow: "hidden",
                        fontSize: isMobile ? "4vw" : "0.8vw",
                        gap: "0.5vw",
                        alignItems: "center",
                        color: "secondary.main",
                    }}
                    title={chat.lastMessage?.body}
                >
                    {chat.lastMessage && <MessageAck message={mocked_last_message} />}
                    {chat.lastMessage?.hasMedia && (
                        <Chip
                            sx={{
                                // marginLeft: chat.lastMessage?.body ? "1vw" : undefined,
                                padding: "0.2vw",
                                height: "auto",
                                color: "inherit",
                                "& .MuiChip-label": {
                                    display: "block",
                                    whiteSpace: "normal",
                                },
                            }}
                            label={formattedMediaType || `Mídia`}
                            color="default"
                            // @ts-ignore
                            icon={MediaIcon}
                        />
                    )}
                    {chat.lastMessage?.type === "revoked" ? (
                        <DeletedMessage message={{ ...mocked_last_message, deleted: true }} />
                    ) : (
                        <p
                            style={{
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                width: isMobile ? "100%" : chat.lastMessage?.hasMedia ? "13vw" : !!chat.unreadCount ? "19vw" : "21vw",
                                overflow: "hidden",
                            }}
                            title={chat.lastMessage?.body}
                        >
                            {!chat.isReadOnly ? chat.lastMessage?.body : "Você não faz parte do grupo"}
                        </p>
                    )}

                    {!!chat.unreadCount && (
                        <Box
                            color={"secondary.main"}
                            sx={{
                                bgcolor: "warning.main",
                                borderRadius: "0.7vw",
                                padding: "0.3vw",
                                fontSize: isMobile ? "4vw" : "0.7vw",
                                fontWeight: "bold",
                                minWidth: isMobile ? "8vw" : "1.5vw",
                                height: isMobile ? "8vw" : "1.5vw",
                                justifyContent: "center",
                                alignItems: "center",
                                marginLeft: "auto",
                            }}
                        >
                            {chat.unreadCount}
                        </Box>
                    )}
                </Box>
            </Box>
        </MenuItem>
    )
}
