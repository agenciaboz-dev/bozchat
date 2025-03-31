import React, { useEffect, useMemo, useState } from "react"
import { Autocomplete, Box, Button, CircularProgress, Dialog, IconButton, TextField, Typography } from "@mui/material"
import { Chat } from "../../../types/server/class/Board/Chat"
import { Title2 } from "../../../components/Title"
import { Close } from "@mui/icons-material"
import { useFetchedData } from "../../../hooks/useFetchedData"
import { Board, TransferChatForm } from "../../../types/server/class/Board/Board"
import { WithoutFunctions } from "../../../types/server/class/helpers"
import { api } from "../../../api"
import { useUser } from "../../../hooks/useUser"
import { useSnackbar } from "burgos-snackbar"

interface TransferModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (board: Board) => void
    board: WithoutFunctions<Board>
    room_id: string
    chat_id: string
}

export const TransferModal: React.FC<TransferModalProps> = (props) => {
    const {user, company} = useUser()
    const { snackbar } = useSnackbar()

    const [boards] = useFetchedData<Board>("boards", { params: { all: true } })
    const [destinationBoard, setDestinationBoard] = useState(props.board)
    const [destinationRoom, setDestinationRoom] = useState(props.board.rooms[props.board.entry_room_index])
    const [loading, setLoading] = useState(false)

    const rooms = useMemo(() => destinationBoard.rooms, [destinationBoard])

    const onSubmitPress = async () => {
        if (loading) return

        setLoading(true)
        try {
            const data: TransferChatForm = {
                chat_id: props.chat_id,
                destination_board_id: destinationBoard.id,
                destination_room_id: destinationRoom.id
            }
            const response = await api.post("/company/boards/transfer", data, {
                params: {
                board_id: props.board.id,
                user_id: user?.id,
                company_id: company?.id
            }})

            props.onSubmit(response.data)
            props.onClose()
            snackbar({severity: 'success', text: 'Conversa transferida'})
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setDestinationRoom(destinationBoard.rooms[destinationBoard.entry_room_index])
    }, [destinationBoard])

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            PaperProps={{ sx: { padding: "2vw", bgcolor: "background.default", maxWidth: "60vw", flexDirection: "column", gap: "1vw" } }}
        >
            <Box sx={{ flexDirection: "column" }}>
                <Title2
                    name="Transferir conversa"
                    right={
                        <IconButton onClick={props.onClose}>
                            <Close />
                        </IconButton>
                    }
                />
                <Typography color={"secondary.main"}>Escolha o quadro e a sala para onde vai transferir esta conversa</Typography>
            </Box>

            <Box sx={{ gap: "1vw" }}>
                <Autocomplete
                    options={boards}
                    value={destinationBoard}
                    onChange={(_, value) => setDestinationBoard(value || props.board)}
                    renderInput={(params) => <TextField {...params} label="Quadro" />}
                    fullWidth
                    getOptionLabel={(option) => option.name}
                    getOptionKey={(option) => option.id}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                />
                <Autocomplete
                    options={rooms}
                    value={destinationRoom}
                    onChange={(_, value) => setDestinationRoom(value || destinationBoard.rooms[destinationBoard.entry_room_index])}
                    renderInput={(params) => <TextField {...params} label="Sala" />}
                    fullWidth
                    getOptionLabel={(option) => option.name}
                    getOptionKey={(option) => option.id}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                />
            </Box>

            <Button sx={{ alignSelf: "flex-end" }} variant="contained" onClick={onSubmitPress} disabled={destinationRoom.id === props.room_id}>
                {loading ? <CircularProgress /> : "Transferir"}
            </Button>
        </Dialog>
    )
}
