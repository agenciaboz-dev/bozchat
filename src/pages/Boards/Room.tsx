import React, { useState } from "react"
import { Box, Chip, IconButton, Menu, MenuItem, Paper, Typography } from "@mui/material"
import { Room } from "../../types/server/class/Board/Room"
import { BoardChat } from "./Chat"
import { Droppable } from "@hello-pangea/dnd"
import { RoomNameInput } from "./RoomNameInput"
import { Board } from "../../types/server/class/Board/Board"
import { useSnackbar } from "burgos-snackbar"
import { WithoutFunctions } from "../../types/server/class/helpers"
import { More, MoreHoriz } from "@mui/icons-material"
import { useConfirmDialog } from "burgos-confirm"

interface KanbanColumnProps {
    room: Room
    editMode: boolean
    updateRoom: (index: number, room: Room) => void
    board: WithoutFunctions<Board>
    index: number
    deleteRoom: (room_id: string) => void
}

export const BoardRoom: React.FC<KanbanColumnProps> = (props) => {
    const { snackbar } = useSnackbar()
    const { confirm } = useConfirmDialog()

    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)

    const editRoomName = (index: number, name: string) => {
        if (props.board.rooms.find((item) => item.name === name)) {
            snackbar({ severity: "error", text: "Já existe uma sala com esse nome" })
            return false
        }

        const room = props.board.rooms[index]
        room.name = name
        props.updateRoom(index, room)

        return true
    }

    const deleteRoom = () => {
        confirm({
            title: "Deletar sala",
            content: `Tem certeza que deseja deletar essa sala? Essa ação é permanente e irreversível.
            ${props.room.chats.length > 0 ? 'As conversas serão transferidas para a sala inicial do quadros' : ''}
            `,
            onConfirm: () => props.deleteRoom(props.room.id),
        })
    }

    const onMenuClose = () => {
        setMenuAnchorEl(null)
    }

    return (
        <Paper sx={{ flexDirection: "column", width: "25vw", padding: "1vw", gap: "1vw", overflow: "auto", height: "73vh" }}>
            {props.editMode ? (
                <Box sx={{ flexDirection: "column", marginBottom: "0.2vw" }}>
                    <Box sx={{ justifyContent: "space-between" }}>
                        <Chip label={props.index + 1} />
                        <IconButton onClick={(ev) => setMenuAnchorEl(ev.currentTarget)}>
                            <MoreHoriz />
                        </IconButton>
                    </Box>
                    <RoomNameInput onSubmit={(name) => editRoomName(props.index, name)} currentName={props.room.name} />
                </Box>
            ) : (
                <Typography sx={{ color: "secondary.main", fontWeight: "bold" }}>{props.room.name}</Typography>
            )}

            <Droppable droppableId={props.room.id} type="chat" direction="vertical">
                {(provided) => (
                    <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                            flexDirection: "column",
                            gap: "1vw",
                            flex: 1,
                            opacity: props.editMode ? 0.45 : 1,
                            pointerEvents: props.editMode ? "none" : undefined,
                        }}
                    >
                        {props.room.chats.length === 0 ? (
                            <Box sx={{ justifyContent: "center", alignItems: "center", height: "100%" }}>
                                <Typography sx={{ color: "secondary.main", alignSelf: "center" }}>Nenhuma conversa</Typography>
                            </Box>
                        ) : (
                            props.room.chats.map((chat, index) => <BoardChat key={chat.id} chat={chat} index={index} />)
                        )}
                        {provided.placeholder}
                    </Box>
                )}
            </Droppable>

            <Menu open={!!menuAnchorEl} anchorEl={menuAnchorEl} onClose={onMenuClose}>
                <MenuItem disabled={props.room.entry_point} onClick={deleteRoom}>
                    Deletar
                </MenuItem>
            </Menu>
        </Paper>
    )
}
