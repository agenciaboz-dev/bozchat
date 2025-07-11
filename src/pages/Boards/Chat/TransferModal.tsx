import React, { useEffect, useMemo, useState } from "react"
import { Autocomplete, Box, Button, CircularProgress, Dialog, IconButton, LinearProgress, TextField, Typography, useMediaQuery } from "@mui/material"
import { Chat } from "../../../types/server/class/Board/Chat"
import { Title2 } from "../../../components/Title"
import { Close } from "@mui/icons-material"
import { useFetchedData } from "../../../hooks/useFetchedData"
import { Board, TransferChatForm } from "../../../types/server/class/Board/Board"
import { WithoutFunctions } from "../../../types/server/class/helpers"
import { api } from "../../../api"
import { useUser } from "../../../hooks/useUser"
import { useSnackbar } from "burgos-snackbar"
import { Room } from "../../../types/server/class/Board/Room"

interface TransferModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (board: Board) => void
    board: WithoutFunctions<Board>
    room_id: string
    chat: Chat
    action: "transfer" | "copy" | null
}

export const TransferModal: React.FC<TransferModalProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { user, company } = useUser()
    const { snackbar } = useSnackbar()

    const [fetchedBoards, _, { loading: fetchingBoards }] = useFetchedData<Board>("boards", { params: { all: true } })
    const [destinationBoard, setDestinationBoard] = useState<Board | null>(null)
    const [destinationRoom, setDestinationRoom] = useState<Room | null>(null)
    const [loading, setLoading] = useState(false)

    const boards = useMemo(() => fetchedBoards.filter((item) => item.id !== props.board.id), [fetchedBoards])

    const rooms = useMemo(() => destinationBoard?.rooms || [], [destinationBoard])

    const onSubmitPress = async () => {
        if (loading || !destinationBoard || !destinationRoom) return

        setLoading(true)
        try {
            const data: TransferChatForm = {
                chat_id: props.chat.id,
                destination_board_id: destinationBoard.id,
                destination_room_id: destinationRoom.id,
                copy: props.action === "copy" ? true : false,
            }
            const response = await api.post("/company/boards/transfer", data, {
                params: {
                    board_id: props.board.id,
                    user_id: user?.id,
                    company_id: company?.id,
                },
            })

            props.onSubmit(response.data)
            handleClose()
            snackbar({ severity: "success", text: "Conversa transferida" })
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        props.onClose()
        setDestinationBoard(null)
        setDestinationRoom(null)
    }

    useEffect(() => {
        if (destinationBoard) {
            setDestinationRoom(destinationBoard.rooms[destinationBoard.entry_room_index])
        }
    }, [destinationBoard])

    return (
        <Dialog
            open={props.open}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    maxWidth: isMobile ? "90vw" : "60vw",
                },
            }}
        >
            <Box
                sx={{
                    padding: isMobile ? "5vw" : "2vw",
                    bgcolor: "background.default",
                    flexDirection: "column",
                    gap: isMobile ? "5vw" : "1vw",
                }}
            >
                <Box sx={{ flexDirection: "column" }}>
                    <Title2
                        name={props.action === "copy" ? "Copiar conversa" : "Transferir conversa"}
                        right={
                            <IconButton onClick={handleClose}>
                                <Close />
                            </IconButton>
                        }
                    />
                    <Typography color={"text.secondary"}>
                        Escolha o quadro e a sala para onde vai {props.action === "copy" ? "copiar" : "transferir"} esta conversa
                    </Typography>
                </Box>
                {fetchingBoards ? (
                    <Box sx={{ flexDirection: "column" }}>
                        <Typography sx={{ fontSize: "0.85vw" }}>Carregando quadros</Typography>
                        <LinearProgress variant="indeterminate" />
                    </Box>
                ) : (
                    <Box sx={{ flexDirection: isMobile ? "column" : "row", gap: isMobile ? "5vw" : "1vw" }}>
                        <Autocomplete
                            options={boards}
                            value={destinationBoard}
                            onChange={(_, value) => setDestinationBoard(value)}
                            renderInput={(params) => <TextField {...params} label="Quadro" />}
                            fullWidth
                            getOptionLabel={(option) => option.name}
                            getOptionKey={(option) => option.id}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                        />
                        <Autocomplete
                            options={rooms}
                            value={destinationRoom}
                            onChange={(_, value) => setDestinationRoom(value)}
                            renderInput={(params) => <TextField {...params} label="Sala" />}
                            fullWidth
                            getOptionLabel={(option) => option.name}
                            getOptionKey={(option) => option.id}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                        />
                    </Box>
                )}
                <Button
                    sx={{ alignSelf: "flex-end" }}
                    variant="contained"
                    onClick={onSubmitPress}
                    disabled={!destinationBoard || !destinationRoom || destinationRoom.id === props.room_id}
                >
                    {loading ? <CircularProgress sx={{ color: "secondary.main" }} /> : props.action === "copy" ? "Copiar" : "Transferir"}
                </Button>
            </Box>
        </Dialog>
    )
}
