import React, { useEffect, useMemo, useState } from "react"
import { Avatar, Badge, Box, Chip, MenuItem, Paper, Typography, useTheme } from "@mui/material"
import { useFormatMessageTime } from "../../hooks/useFormatMessageTime"
import { useMediaQuery } from "@mui/material"
import { api } from "../../api"
import { Washima, WashimaProfilePic } from "../../types/server/class/Washima/Washima"
import { useVisibleCallback } from "burgos-use-visible-callback"
import { AttachFile, Call, Headphones, PhotoCamera, Videocam } from "@mui/icons-material"
import { MessageAck } from "../Zap/MessageAck"
import { Chat } from "../../types/Chat"
import { DeletedMessage } from "../Zap/DeletedMessage"
import { WashimaMessage } from "../../types/server/class/Washima/WashimaMessage"
import { MediaChip } from "../../components/MediaChip"
import { useIo } from "../../hooks/useIo"
import { getAuthorName } from "../Zap/MessageAuthor"

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
    const io = useIo()

    const ref = useVisibleCallback(() => {
        if (onVisible) {
            onVisible()
        }
        if (chat.lastMessage?.hasMedia) {
            fetchMediaMetadata()
        }
    }, {})

    const [contactName, setContactName] = useState(chat.name)
    const [contactPhone, setContactPhone] = useState("")
    const [profilePic, setProfilePic] = useState("")
    const [mediaMetaData, setMediaMetaData] = useState<{
        mimetype: string | undefined
        filename: string | undefined
        message_id: string
    }>()

    const isInContacts = !useMemo(() => {
        // Check if the name contains only valid phone number characters
        const hasValidChars = /^[+\d\s\-()]*$/.test(chat.name)
        // Extract all digits from the name
        const digits = chat.name.replace(/\D/g, "")
        // Ensure the number of digits is within a valid range (adjust min/max as needed)
        return hasValidChars && digits.length >= 5 && digits.length <= 15
    }, [chat])

    const mocked_last_message: WashimaMessage = {
        ...chat.lastMessage,
        chat_id: chat.id._serialized,
        sid: chat.lastMessage?.id._serialized || "",
        washima_id: washima.id,
        deleted: false,
        edited: false,
        forwarded: false,
        phone_only: false,
        call: null,
        contact_id: "",
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

    useEffect(() => {
        fetchProfilePic()
    }, [chat])

    useEffect(() => {
        if (!isInContacts) {
            io.emit("washima:author", washima.id, chat.id._serialized, (contact: string) => {
                console.log({ contact })
                const { author_name, author_phone } = getAuthorName(contact)
                setContactName(author_name)
                setContactPhone(author_phone)
            })
        }
    }, [chat, isInContacts])

    return (
        <MenuItem
            // elevation={3}
            ref={ref}
            disabled={chat.isReadOnly}
            sx={{
                padding: isMobile ? "2vw 1vw" : "1vw",
                alignItems: "center",
                backgroundColor: active ? "action.hover" : "background.default",
                gap: isMobile ? "3vw" : "1vw",
                height: isMobile ? "20vw" : "5vw",
                cursor: "pointer",
                borderRadius: isMobile ? "3vw" : "0.5vw",

                "&:hover": {
                    // outline: "2px solid",
                },
                width: isMobile ? "90vw" : "100%",
                flex: 1,
            }}
            onClick={handleClick}
        >
            <Paper elevation={2} sx={{ borderRadius: "100%" }}>
                <Avatar
                    src={profilePic}
                    sx={{ width: isMobile ? "15vw" : "3vw", height: isMobile ? "15vw" : "3vw" }}
                    onClick={() => console.log(profilePic)}
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
                <Box sx={{ justifyContent: "space-between", alignItems: "center", width: "100%", color: "text.secondary" }}>
                    <Box
                        sx={{
                            flex: 1,
                            alignItems: "center",
                            gap: "0.5vw",
                            maxWidth: isMobile ? "65%" : undefined,
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: "bold",
                                fontSize: isMobile ? "1rem" : "0.8vw",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                maxWidth: isMobile ? undefined : isInContacts ? "70%" : "55%",
                            }}
                            title={contactName}
                        >
                            {!isInContacts && "~ "}
                            {contactName}
                        </Typography>
                        {!isInContacts && (
                            <Typography
                                sx={{
                                    fontSize: isMobile ? "0.8rem" : "0.6vw",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {contactPhone}
                            </Typography>
                        )}
                    </Box>
                    {chat.lastMessage && (
                        <Box
                            sx={{
                                fontSize: isMobile ? "3.5vw" : "0.65vw",
                                wordWrap: "break-word",
                                color: !!chat.unreadCount ? "warning.main" : undefined,
                                fontWeight: !!chat.unreadCount ? "bold" : undefined,
                            }}
                        >
                            {formatTime(new Date(chat.lastMessage.timestamp * 1000))}
                        </Box>
                    )}
                </Box>

                {/*//* message and unread count */}
                <Box
                    sx={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        width: "100%",
                        overflow: "hidden",
                        fontSize: isMobile ? "4vw" : "0.8vw",
                        gap: "0.5vw",
                        alignItems: "center",
                        color: "text.secondary",
                    }}
                    title={chat.lastMessage?.body}
                >
                    {chat.lastMessage && <MessageAck message={mocked_last_message} />}
                    {chat.lastMessage?.hasMedia && mediaMetaData?.mimetype && <MediaChip mimetype={mediaMetaData.mimetype} />}
                    {chat.lastMessage?.type === "call_log" && (
                        <Chip icon={<Call />} sx={{ color: "text.secondary" }} label="Ligação de voz" size="small" />
                    )}
                    {chat.lastMessage?.type === "revoked" ? (
                        <DeletedMessage />
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
                                borderRadius: isMobile ? "2vw" : "0.7vw",
                                padding: isMobile ? "1vw" : "0.3vw",
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
