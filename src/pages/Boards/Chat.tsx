import React, { useEffect, useMemo, useState } from "react"
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, IconButton, Paper, Typography } from "@mui/material"
import { Chat } from "../../types/server/class/Board/Chat"
import { Draggable } from "@hello-pangea/dnd"
import { ExpandMore, MoreHoriz, Send } from "@mui/icons-material"
import { api } from "../../api"
import { MediaChip } from "../../components/MediaChip"
import { Washima } from "../../types/server/class/Washima/Washima"
import { Chat as WashimaChat } from "../../types/Chat"

interface BoardChatProps {
    chat: Chat
    index: number
    washima?: Washima
}

export const BoardChat: React.FC<BoardChatProps> = (props) => {
    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)
    const [mediaMetaData, setMediaMetaData] = useState<{
        mimetype: string | undefined
        filename: string | undefined
        message_id: string
    }>()
    const [expandedChat, setExpandedChat] = useState(false)

    const washimaChat = useMemo(
        () => (props.washima ? (props.washima.chats.find((chat) => chat.id === props.chat.washima_chat_id) as WashimaChat | null) : null),
        [props.washima]
    )

    const fetchMediaMetadata = async () => {
        try {
            const response = await api.get("/washima/media-metadata", {
                params: { washima_id: props.chat.washima_id, message_id: props.chat.last_message.sid },
            })
            setMediaMetaData(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (props.chat.last_message?.hasMedia) {
            fetchMediaMetadata()
        }
    }, [])

    useEffect(() => {
        console.log(mediaMetaData)
    }, [mediaMetaData])

    return (
        <Draggable draggableId={props.chat.id} index={props.index}>
            {(provided, snapshot) => (
                <Paper
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    sx={{ padding: "1vw", flexDirection: "column", height: "10vw", overflow: "hidden", gap: "1vw" }}
                >
                    <Box sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box sx={{ gap: "1vw" }} color={"secondary.main"}>
                            <Avatar src={props.chat.profile_pic} sx={{ width: "3vw", height: "3vw" }} />
                            <Box sx={{ flexDirection: "column", alignSelf: "center" }}>
                                <Typography
                                    sx={{ fontWeight: "bold", width: "13vw", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}
                                >
                                    {props.chat.name}
                                </Typography>
                                <Typography sx={{ fontSize: "0.8rem" }}>
                                    {new Date(props.chat.last_message.timestamp * 1000).toLocaleString("pt-br", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </Typography>
                            </Box>
                        </Box>
                        <IconButton onClick={(ev) => setMenuAnchorEl(ev.currentTarget)}>
                            <MoreHoriz />
                        </IconButton>
                    </Box>

                    {!expandedChat && <hr />}

                    <Accordion expanded={expandedChat} onChange={(_, value) => setExpandedChat(value)}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Box sx={{ alignItems: "center", justifyContent: "space-between" }}>
                                <Typography
                                    sx={{
                                        width: "18vw",
                                        overflow: "hidden",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {props.chat.last_message.body}
                                    {props.chat.last_message.hasMedia && mediaMetaData?.mimetype && <MediaChip mimetype={mediaMetaData.mimetype} />}
                                </Typography>
                                <IconButton onClick={(ev) => setMenuAnchorEl(ev.currentTarget)}>
                                    <Send />
                                </IconButton>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>Teste</Typography>
                        </AccordionDetails>
                    </Accordion>
                </Paper>
            )}
        </Draggable>
    )
}
