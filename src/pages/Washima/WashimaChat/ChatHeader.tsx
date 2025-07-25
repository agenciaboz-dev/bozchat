import React, { useEffect, useMemo, useState } from "react"
import { Avatar, Box, IconButton, Skeleton, Typography, useMediaQuery } from "@mui/material"
import { Washima, WashimaProfilePic } from "../../../types/server/class/Washima/Washima"
import { Chat } from "../../../types/Chat"
import { api } from "../../../api"
import { useIo } from "../../../hooks/useIo"
import { WashimaGroupUpdate } from "../../../types/server/class/Washima/WashimaGroupUpdate"
import { PhotoProvider, PhotoView } from "react-photo-view"
import { getAuthorName } from "../../Zap/MessageAuthor"
import { ChatSearch } from "./ChatSearch"
import { Cancel } from "@mui/icons-material"
import { BotActivity } from "./WashimaTools/BotActivity"
import { CopyAllButton } from "./WashimaTools/CopyAll"

interface ChatHeaderProps {
    loading: boolean
    washima: Washima
    chat: Chat
    onClose: () => void
    setLoadingMessageId: React.Dispatch<React.SetStateAction<string | null>>
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ loading, washima, chat, onClose, setLoadingMessageId }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const io = useIo()

    const [profilePic, setProfilePic] = useState("")
    const [contactName, setContactName] = useState(chat?.name || "")
    const [contactPhone, setContactPhone] = useState("")

    const isInContacts = !useMemo(() => {
        if (!chat) return false
        // Check if the name contains only valid phone number characters
        const hasValidChars = /^[+\d\s\-()]*$/.test(chat.name)
        const digits = chat.name.replace(/\D/g, "")
        return hasValidChars && digits.length >= 5 && digits.length <= 15
    }, [chat])

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
        if (chat) {
            fetchProfilePic()

            io.on("washima:group:update", (update: WashimaGroupUpdate) => {
                if (update.chat_id === chat.id._serialized) {
                    if (update.type === "picture") {
                        fetchProfilePic()
                    }
                }
            })

            return () => {
                io.off("washima:group:update")
                setProfilePic('')
            }
        }
    }, [chat])

    return (
        <Box
            sx={{
                gap: isMobile ? "3vw" : "2vw",
                alignItems: "center",
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
            <Box
                sx={{
                    flex: 1,
                    alignItems: "center",
                    gap: "0.5vw",
                    flexDirection: isMobile ? "column" : "row",
                    maxWidth: isMobile ? "45%" : undefined,
                }}
            >
                <Typography
                    sx={{
                        fontWeight: "bold",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        maxWidth: isMobile ? "80%" : isInContacts ? "70%" : "55%",
                        fontSize: isMobile ? "1rem" : "1vw",
                    }}
                    title={contactName}
                >
                    {!isInContacts && "~ "}
                    {contactName}
                </Typography>
                {!isInContacts && (
                    <Typography sx={{ fontSize: isMobile ? "0.8rem" : "0.8vw", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                        {contactPhone}
                    </Typography>
                )}
            </Box>
            {!!chat &&
                (isMobile ? (
                    <Box sx={{ marginLeft: "auto", alignItems: "center", flexDirection: "column" }}>
                        <Box>
                            <ChatSearch washima_id={washima.id} chat_id={chat.id._serialized} onMessageClick={setLoadingMessageId} />
                            <IconButton sx={{ color: "text.secondary" }} onClick={onClose}>
                                <Cancel />
                            </IconButton>
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{ marginLeft: "auto", alignItems: "center" }}>
                        <ChatSearch washima_id={washima.id} chat_id={chat.id._serialized} onMessageClick={setLoadingMessageId} />

                        {!chat.isGroup && <BotActivity chat_id={chat.id._serialized} />}
                        <CopyAllButton chat={chat} washima_id={washima.id} />
                        <IconButton sx={{ color: "text.secondary" }} onClick={onClose}>
                            <Cancel />
                        </IconButton>
                    </Box>
                ))}
        </Box>
    )
}
