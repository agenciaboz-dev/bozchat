import React, { useEffect, useMemo, useState } from "react"
import { Avatar, Box, Chip, Collapse, IconButton, LinearProgress, Paper, Typography, useMediaQuery } from "@mui/material"
import { Chat } from "../../../types/server/class/Board/Chat"
import { Draggable } from "@hello-pangea/dnd"
import { Cancel, KeyboardArrowDown, KeyboardArrowUp, SpeakerNotes } from "@mui/icons-material"
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
import { custom_colors } from "../../../style/colors"
import { useDarkMode } from "../../../hooks/useDarkMode"
import { useUser } from "../../../hooks/useUser"
import { ChatNotesModal } from "./ChatNotesModal"
import { ArchiveChatForm } from "../../../types/server/class/Board/Archive"
import { useSnackbar } from "burgos-snackbar"

interface BoardChatProps {
    chat: Chat
    index: number
    washima?: Washima
    nagazap?: Nagazap
    room_id: string
    board: WithoutFunctions<Board>
    updateBoard: (board: WithoutFunctions<Board>) => void
    showAllAccordions?: boolean
}

export const BoardChat: React.FC<BoardChatProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()
    const { fetchNagaMessages } = useApi()
    const { user, company } = useUser()
    const { snackbar } = useSnackbar()

    const [mediaMetaData, setMediaMetaData] = useState<{
        mimetype: string | undefined
        filename: string | undefined
        message_id: string
    }>()

    const [expandedChat, setExpandedChat] = useState(false)
    const [nagazapMessages, setNagazapMessages] = useState<NagaMessage[]>([])
    const [showChatNotesModal, setShowChatNotesModal] = useState(false)
    const [showTranferModal, setShowTranferModal] = useState<null | "transfer" | "copy">(null)
    const [showAccordion, setShowAccordion] = useState(props.showAllAccordions || false)

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

    const handleArchive = async () => {
        const archiveData: ArchiveChatForm = { chat_id: props.chat.id }
        try {
            const updatedBoard = { ...props.board }
            for (const room of updatedBoard.rooms) {
                if (room.id === props.room_id) {
                    room.chats = room.chats.filter((chat) => chat.id !== props.chat.id)
                    break
                }
            }
            props.updateBoard(updatedBoard)
            await api.post("/company/boards/archive", archiveData, {
                params: { user_id: user?.id, company_id: company?.id, board_id: props.board.id },
            })
            snackbar({ severity: "info", text: "Conversa arquivada!" })
        } catch (error) {
            console.log(error)
        }
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

    const handleShowAccordion = (e: React.SyntheticEvent) => {
        e.stopPropagation()

        if (expandedChat) {
            setExpandedChat(false)
        }

        setShowAccordion((prev) => !prev)
    }

    useEffect(() => {
        setShowAccordion(!!props.showAllAccordions)
    }, [props.showAllAccordions])

    return (
        <Draggable draggableId={props.chat.id} index={props.index}>
            {(provided) => (
                <Paper
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    sx={{
                        padding: isMobile ? "5vw" : "1vw",
                        paddingBottom: showAccordion ? (isMobile ? "5vw" : "1vw") : 0,
                        flexDirection: "column",
                        overflow: "hidden",
                        gap: isMobile ? "5vw" : "1vw",
                        bgcolor: darkMode ? undefined : custom_colors.lightMode_chatWrapper,
                        opacity: props.washima?.status === "stopped" ? 0.45 : undefined,
                        pointerEvents: props.washima?.status === "stopped" ? "none" : undefined,
                    }}
                    onClick={() =>
                        console.log(props.nagazap, nagazapMessages.length, props.chat, { from: normalizePhonenumber(props.chat.last_message.from) })
                    }
                >
                    <Box sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box sx={{ gap: isMobile ? "2vw" : "1vw", alignItems: "center", width: "100%" }} color={"text.secondary"}>
                            <Avatar src={props.chat.profile_pic} sx={{ width: isMobile ? "9vw" : "3vw", height: isMobile ? "9vw" : "3vw" }} />
                            <Box
                                sx={{
                                    flexDirection: "column",
                                    alignSelf: "center",
                                    gap: isMobile ? "2vw" : "0.2vw",
                                    maxWidth: "50%",
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
                            <Box sx={{ flexDirection: "column", marginLeft: "auto", alignItems: "flex-end" }}>
                                <Box>
                                    <IconButton onClick={() => setShowChatNotesModal(!showChatNotesModal)} aria-label="Anotações da conversa">
                                        <SpeakerNotes />
                                    </IconButton>
                                    {user?.admin && (
                                        <ChatMenu
                                            board_id={props.board.id}
                                            room_id={props.room_id}
                                            chat={props.chat}
                                            onTransfer={onTransferClick}
                                            onArchive={handleArchive}
                                        />
                                    )}
                                </Box>
                                <IconButton onClick={(e) => handleShowAccordion(e)} aria-label={showAccordion ? "Recolher" : "Expandir"}>
                                    {showAccordion ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                </IconButton>
                            </Box>
                        </Box>

                        <ChatNotesModal
                            open={!!showChatNotesModal}
                            onClose={() => setShowChatNotesModal(false)}
                            board_id={props.board.id}
                            chat_id={props.chat.id}
                        />
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

                    <Collapse in={showAccordion}>
                        {props.washima || (props.nagazap && nagazapMessages.length > 0) ? (
                            <Accordion
                                expanded={expandedChat}
                                titleElement={
                                    <Paper
                                        onClick={() => setExpandedChat((value) => !value)}
                                        elevation={0}
                                        sx={{
                                            bgcolor: darkMode ? "background.default" : custom_colors.lightMode_chatBackground,
                                            border: darkMode
                                                ? `1px solid ${custom_colors.darkMode_border}`
                                                : `1px solid ${custom_colors.lightMode_border}`,
                                            borderRadius: 0,
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
                    </Collapse>
                </Paper>
            )}
        </Draggable>
    )
}
