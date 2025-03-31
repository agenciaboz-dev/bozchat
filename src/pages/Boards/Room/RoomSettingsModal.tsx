import React, { useEffect, useMemo, useState } from "react"
import { Autocomplete, Box, Button, CircularProgress, Dialog, IconButton, TextField, Typography } from "@mui/material"
import { Title2 } from "../../../components/Title"
import { Room, RoomTrigger } from "../../../types/server/class/Board/Room"
import { Close } from "@mui/icons-material"
import { useFetchedData } from "../../../hooks/useFetchedData"
import { Board } from "../../../types/server/class/Board/Board"
import { WithoutFunctions } from "../../../types/server/class/helpers"
import { api } from "../../../api"
import { useUser } from "../../../hooks/useUser"

interface RoomSettingsModalProps {
    open: boolean
    onClose: () => void
    room: Room
    board: WithoutFunctions<Board>
    updateBoard: (board: Board) => void
}

export const RoomSettingsModal: React.FC<RoomSettingsModalProps> = (props) => {
    const { company, user } = useUser()

    const [boards] = useFetchedData<Board>("boards", { params: { all: true } })
    const [destinationBoard, setDestinationBoard] = useState<Board | null>(null)
    const [destinationRoom, setDestinationRoom] = useState<Room | null>(props.board.rooms[props.board.entry_room_index])
    const [loading, setLoading] = useState(false)

    const rooms = useMemo(() => destinationBoard?.rooms || [], [destinationBoard])

    const onSubmit = async () => {
        if (loading) return
        setLoading(true)

        try {
            const trigger: RoomTrigger | undefined = destinationBoard
                ? { board_id: destinationBoard.id, room_id: destinationRoom?.id, board_name: destinationBoard.name }
                : undefined
            const updated_rooms = [...props.board.rooms]
            const room_index = props.board.rooms.findIndex((room) => room.id === props.room.id)
            updated_rooms[room_index].on_new_chat = trigger

            const response = await api.patch("/company/boards/room", updated_rooms[room_index], {
                params: { company_id: company?.id, user_id: user?.id, board_id: props.board.id, room_id: props.room.id },
            })
            props.updateBoard(response.data)
            props.onClose()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setDestinationRoom(
            destinationBoard?.rooms.find((room) => room.id === props.room.on_new_chat?.room_id) ||
                destinationBoard?.rooms[destinationBoard.entry_room_index] ||
                null
        )
    }, [destinationBoard, props.room.on_new_chat])

    useEffect(() => {
        if (props.room.on_new_chat) {
            setDestinationBoard(boards.find((item) => item.id === props.room.on_new_chat?.board_id) || null)
        }
    }, [boards, props.room.on_new_chat])

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            PaperProps={{ sx: { maxWidth: "70vw", flexDirection: "column", padding: "2vw", gap: "1vw", bgcolor: "background.default" } }}
        >
            <Box sx={{ flexDirection: "column" }}>
                <Title2
                    name={props.room.name}
                    right={
                        <IconButton onClick={props.onClose}>
                            <Close />
                        </IconButton>
                    }
                />
                <Typography color={"secondary.main"}>Clonar conversa para outra sala quando a conversa chegar nesta sala</Typography>
            </Box>

            <Box sx={{ gap: "1vw" }}>
                <Autocomplete
                    options={boards.filter((board) => board.id !== props.board.id)}
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

            <Button sx={{ alignSelf: "flex-end" }} variant="contained" onClick={onSubmit}>
                {loading ? <CircularProgress /> : "Salvar"}
            </Button>
        </Dialog>
    )
}
