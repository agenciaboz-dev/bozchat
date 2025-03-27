import React, { useEffect, useMemo, useState } from "react"
import { AccordionDetails, AccordionSummary, Avatar, Box, Chip, IconButton, MenuItem, Paper, Typography } from "@mui/material"
import { Chat } from "../../types/server/class/Board/Chat"
import { Draggable } from "@hello-pangea/dnd"
import { Cancel, ChatBubble, ExpandMore, MoreHoriz, Send } from "@mui/icons-material"
import { api } from "../../api"
import { MediaChip } from "../../components/MediaChip"
import { Washima } from "../../types/server/class/Washima/Washima"
import { Chat as WashimaChatType } from "../../types/Chat"
import { WashimaChat } from "../Washima/WashimaChat/WashimaChat"
import { Nagazap } from "../../types/server/class/Nagazap"
import Message from "../Zap/Message"
import formatDate from "../../tools/formatDate"
import { Accordion } from "../../components/Accordion"
import { IntegrationChip } from "./IntegrationChip"

interface BoardChatProps {
    chat: Chat
    index: number
    washima?: Washima
    nagazap?: Nagazap
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
        () =>
            props.washima ? (props.washima.chats.find((chat) => chat.id._serialized === props.chat.washima_chat_id) as WashimaChatType | null) : null,
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
                    sx={{ padding: "1vw", flexDirection: "column", overflow: "hidden", gap: "1vw" }}
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
                                <Box sx={{ gap: "0.5vw", alignItems: "center" }}>
                                    <Chip
                                        size="small"
                                        label={
                                            <>
                                                {formatDate.weekDay(new Date(props.chat.last_message.timestamp * 1000).getDay(), true)} -{" "}
                                                {new Date(props.chat.last_message.timestamp * 1000).toLocaleDateString("pt-br")}
                                            </>
                                        }
                                    />
                                    <IntegrationChip washima={props.washima} chatVariant />
                                </Box>
                            </Box>
                        </Box>
                        <IconButton onClick={(ev) => setMenuAnchorEl(ev.currentTarget)}>
                            <MoreHoriz />
                        </IconButton>
                    </Box>

                    {/* <Accordion
                        expanded={expandedChat}
                        titleElement={<div onClick={() => setExpandedChat((value) => !value)}>Click to Expand</div>}
                        expandedElement={<div>Expanded Content Goes Here</div>}
                        hideTitle
                    /> */}

                    {washimaChat && props.washima ? (
                        <Accordion
                            expanded={expandedChat}
                            titleElement={
                                <Paper
                                    onClick={() => setExpandedChat((value) => !value)}
                                    elevation={0}
                                    sx={{
                                        bgcolor: "background.default",
                                        flexDirection: "column",
                                        padding: "1vw",
                                        position: "relative",
                                        color: "secondary.main",
                                        flex: 1,
                                    }}
                                >
                                    {!expandedChat && props.washima && (
                                        <Message
                                            message={props.chat.last_message}
                                            washima={props.washima}
                                            inBoards
                                            isGroup={props.chat.is_group}
                                            noActions
                                        />
                                    )}
                                </Paper>
                            }
                            expandedElement={
                                <Box sx={{ position: "relative", flex: 1 }}>
                                    <WashimaChat inBoards chat={washimaChat} washima={props.washima} onClose={() => setExpandedChat(false)} />
                                    <IconButton sx={{ position: "absolute", top: "0", right: "0" }} onClick={() => setExpandedChat(false)}>
                                        <Cancel />
                                    </IconButton>
                                </Box>
                            }
                            hideTitle
                        />
                    ) : (
                        <Box>
                            <Typography>Business indisponível</Typography>
                        </Box>
                    )}

                    {/* <Accordion
                        expanded={expandedChat}
                        onChange={(_, value) => setExpandedChat(value)}
                        slotProps={{ transition: { unmountOnExit: true } }}
                        sx={{
                            flexDirection: "column",
                            boxShadow: "none",
                            background: "transparent",
                            border: "none",
                            "&:before": { display: "none" },
                            "&.Mui-expanded": {
                                margin: 0,
                            },
                            position: "relative",
                        }}
                        disableGutters
                    >
                        <AccordionSummary>
                            <Paper
                                elevation={0}
                                sx={{
                                    bgcolor: "background.default",
                                    flex: 1,
                                    flexDirection: "column",
                                    margin: "-1vw",
                                    padding: "1vw",
                                    position: "relative",
                                    color: "secondary.main",
                                }}
                            >
                                {!expandedChat && props.washima && (
                                    <Message
                                        message={props.chat.last_message}
                                        washima={props.washima}
                                        inBoards
                                        isGroup={props.chat.is_group}
                                        noActions
                                    />
                                )}
                            </Paper>
                        </AccordionSummary>
                        <AccordionDetails>
                            {washimaChat && props.washima && (
                                <Box sx={{ margin: "-2vw", marginTop: "-4vw", position: "relative" }}>
                                    <WashimaChat inBoards chat={washimaChat} washima={props.washima} onClose={() => setExpandedChat(false)} />
                                    <IconButton sx={{ position: "absolute", top: "1vw", right: "1vw" }} onClick={() => setExpandedChat(false)}>
                                        <Cancel />
                                    </IconButton>
                                </Box>
                            )}
                        </AccordionDetails>
                    </Accordion> */}
                </Paper>
            )}
        </Draggable>
    )
}
