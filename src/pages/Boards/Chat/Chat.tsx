import React, { useEffect, useMemo, useState } from "react"
import { Avatar, Box, Chip, IconButton, LinearProgress, Paper, Typography, useMediaQuery } from "@mui/material"
import { Chat } from "../../../types/server/class/Board/Chat"
import { Draggable } from "@hello-pangea/dnd"
import { Cancel, MoreHoriz } from "@mui/icons-material"
import { api } from "../../../api"
import { Washima } from "../../../types/server/class/Washima/Washima"
import { Chat as WashimaChatType } from "../../../types/Chat"
import { WashimaChat } from "../../Washima/WashimaChat/WashimaChat"
import { NagaMessage, Nagazap } from "../../../types/server/class/Nagazap"
import WashimaMessage from "../../Zap/Message"
import { Accordion } from "../../../components/Accordion"
import { IntegrationChip } from "../IntegrationChip"
import { WashimaMessage as WashimaMessageType } from "../../../types/server/class/Washima/WashimaMessage"
import { MessageContainer } from "../../Nagazap/Messages/MessageContainer"
import { ChatContainer } from "../../Nagazap/Messages/ChatContainer"
import { useApi } from "../../../hooks/useApi"
import { canRespondNagaChat } from "../../../tools/canRespondNagaChat"
import { ChatMenu } from "./ChatMenu"
import { TransferModal } from "./TransferModal"
import { WithoutFunctions } from "../../../types/server/class/helpers"
import { Board } from "../../../types/server/class/Board/Board"
import { normalizePhonenumber } from "../../../tools/normalize"

interface BoardChatProps {
    chat: Chat
    index: number
    washima?: Washima
    nagazap?: Nagazap
    room_id: string
    board: WithoutFunctions<Board>
    updateBoard: (board: Board) => void
}

export const BoardChat: React.FC<BoardChatProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { fetchNagaMessages } = useApi()

    const [mediaMetaData, setMediaMetaData] = useState<{
        mimetype: string | undefined
        filename: string | undefined
        message_id: string
    }>()
    const [expandedChat, setExpandedChat] = useState(false)
    const [nagazapMessages, setNagazapMessages] = useState<NagaMessage[]>([])
    const [showTranferModal, setShowTranferModal] = useState<null | "transfer" | "copy">(null)
    const nagaChat = useMemo(
        () => ({
            from: props.chat.phone,
            lastMessage: props.chat.last_message as NagaMessage,
            name: props.chat.name,
            messages: nagazapMessages,
        }),
        [props.chat, nagazapMessages]
    )
    const cannotRespondNagazap = useMemo(() => (props.nagazap ? !canRespondNagaChat(nagaChat, props.nagazap) : false), [props.nagazap, nagaChat])

    const datetime = useMemo(
        () =>
            typeof props.chat.last_message.timestamp === "number"
                ? new Date(props.chat.last_message.timestamp * 1000)
                : new Date(Number(props.chat.last_message.timestamp)),
        [props.chat.last_message.timestamp]
    )

    const washimaChat = useMemo(
        () =>
            props.washima ? (props.washima.chats.find((chat) => chat.id._serialized === props.chat.washima_chat_id) as WashimaChatType | null) : null,
        [props.washima]
    )

    const fetchMediaMetadata = async () => {
        try {
            const response = await api.get("/washima/media-metadata", {
                params: { washima_id: props.chat.washima_id, message_id: (props.chat.last_message as WashimaMessageType).sid },
            })
            setMediaMetaData(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const onTransferClick = (action: "transfer" | "copy" = "transfer") => {
        setShowTranferModal(action)
    }

    useEffect(() => {
        if ((props.chat.last_message as WashimaMessageType)?.hasMedia) {
            fetchMediaMetadata()
        }
    }, [])

    useEffect(() => {
        if (props.nagazap) {
            fetchNagaMessages({ params: { nagazap_id: props.nagazap.id, from: normalizePhonenumber(props.chat.last_message.from) } }).then(
                (result) => {
                    setNagazapMessages(result.reverse())
                }
            )
        }
    }, [props.nagazap, props.chat])

    return (
        <Draggable draggableId={props.chat.id} index={props.index}>
            {(provided) => (
                <Paper
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    sx={{ padding: isMobile ? "5vw" : "1vw", flexDirection: "column", overflow: "hidden", gap: isMobile ? "5vw" : "1vw" }}
                    onClick={() =>
                        console.log(props.nagazap, nagazapMessages.length, props.chat, { from: normalizePhonenumber(props.chat.last_message.from) })
                    }
                >
                    <Box sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box sx={{ gap: isMobile ? "2vw" : "1vw", alignItems: "center" }} color={"text.secondary"}>
                            <Avatar src={props.chat.profile_pic} sx={{ width: isMobile ? "9vw" : "3vw", height: isMobile ? "9vw" : "3vw" }} />
                            <Box
                                sx={{
                                    flexDirection: "column",
                                    alignSelf: "center",
                                    gap: isMobile ? "2vw" : "0.2vw",
                                    maxWidth: isMobile ? "50vw" : "13vw",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: "bold",
                                        width: "100%",
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {props.chat.name}
                                </Typography>
                                <Box sx={{ gap: isMobile ? "2vw" : "0.5vw", width: "100%" }}>
                                    <Chip
                                        size="small"
                                        label={<Typography sx={{ fontSize: "0.7rem" }}>{datetime.toLocaleDateString("pt-br")}</Typography>}
                                    />
                                    <IntegrationChip washima={props.washima} chatVariant nagazap={props.nagazap} />
                                </Box>
                            </Box>
                        </Box>

                        <ChatMenu board_id={props.board.id} room_id={props.room_id} chat={props.chat} onTransfer={onTransferClick} />
                        <TransferModal
                            open={!!showTranferModal}
                            onClose={() => setShowTranferModal(null)}
                            onSubmit={(board) => props.updateBoard(board)}
                            board={props.board}
                            room_id={props.room_id}
                            chat={props.chat}
                            action={showTranferModal}
                        />
                    </Box>

                    {props.washima || (props.nagazap && nagazapMessages.length > 0) ? (
                        <Accordion
                            expanded={expandedChat}
                            titleElement={
                                <Paper
                                    onClick={() => setExpandedChat((value) => !value)}
                                    elevation={0}
                                    sx={{
                                        bgcolor: "background.default",
                                        flexDirection: "column",
                                        padding: isMobile ? "5vw" : "1vw",
                                        position: "relative",
                                        color: "text.secondary",
                                        flex: 1,
                                    }}
                                >
                                    {!expandedChat && props.washima && (
                                        <WashimaMessage
                                            message={props.chat.last_message as WashimaMessageType}
                                            washima={props.washima}
                                            inBoards
                                            isGroup={props.chat.is_group}
                                            noActions
                                        />
                                    )}
                                    {!expandedChat && props.nagazap && (
                                        <MessageContainer
                                            message={props.chat.last_message as NagaMessage}
                                            nagazap={props.nagazap}
                                            inBoards
                                            disabledIcon={cannotRespondNagazap}
                                        />
                                    )}
                                </Paper>
                            }
                            expandedElement={
                                <Box sx={{ position: "relative", flex: 1 }}>
                                    {props.washima && (
                                        <WashimaChat inBoards chat={washimaChat} washima={props.washima} onClose={() => setExpandedChat(false)} />
                                    )}
                                    {props.nagazap && (
                                        <ChatContainer
                                            inBoards
                                            nagazap={props.nagazap}
                                            chat={nagaChat}
                                            onClose={() => setExpandedChat(false)}
                                            disabledResponse={cannotRespondNagazap}
                                        />
                                    )}
                                    <IconButton sx={{ position: "absolute", top: "0", right: "0" }} onClick={() => setExpandedChat(false)}>
                                        <Cancel />
                                    </IconButton>
                                </Box>
                            }
                            hideTitle
                        />
                    ) : (
                        <LinearProgress variant="indeterminate" />
                    )}
                </Paper>
            )}
        </Draggable>
    )
}
