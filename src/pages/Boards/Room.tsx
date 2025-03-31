import React, { useState } from "react"
import { Box, Chip, IconButton, Menu, MenuItem, Paper, Tooltip, Typography } from "@mui/material"
import { Room } from "../../types/server/class/Board/Room"
import { BoardChat } from "./Chat/Chat"
import { Droppable } from "@hello-pangea/dnd"
import { RoomNameInput } from "./RoomNameInput"
import { Board } from "../../types/server/class/Board/Board"
import { useSnackbar } from "burgos-snackbar"
import { WithoutFunctions } from "../../types/server/class/helpers"
import { Home, More, MoreHoriz, WhatsApp } from "@mui/icons-material"
import { useConfirmDialog } from "burgos-confirm"
import { Washima } from "../../types/server/class/Washima/Washima"
import { IntegrationChip } from "./IntegrationChip"
import { Nagazap } from "../../types/server/class/Nagazap"
import { EntryRoomIcon } from "./EntryRoomIcon"
import { api } from "../../api"
import { useUser } from "../../hooks/useUser"

interface KanbanColumnProps {
    room: Room
    editMode: boolean
    updateRoom: (index: number, room: Room) => void
    board: WithoutFunctions<Board>
    index: number
    deleteRoom: (room_id: string) => void
    washimas: Washima[]
    nagazaps: Nagazap[]
    updateBoard: (board: Board) => void
}

export const BoardRoom: React.FC<KanbanColumnProps> = (props) => {
    const { user, company } = useUser()
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
            ${props.room.chats.length > 0 ? "As conversas serão transferidas para a sala inicial do quadros" : ""}
            `,
            onConfirm: () => props.deleteRoom(props.room.id),
        })
    }

    const onMenuClose = () => {
        setMenuAnchorEl(null)
    }

    const syncedIntegrations = [
        ...props.board.washima_settings.map((setting) => {
            const washima = props.washimas.find((washima) => washima.id === setting.washima_id)
            return setting.room_id === props.room.id ? <IntegrationChip washima={washima} /> : null
        }),
        ...props.board.nagazap_settings.map((setting) => {
            const nagazap = props.nagazaps.find((nagazap) => nagazap.id === setting.nagazap_id)
            return setting.room_id === props.room.id ? <IntegrationChip nagazap={nagazap} /> : null
        }),
    ]

    const setEntryRoom = async () => {
        onMenuClose()
        try {
            const rooms = props.board.rooms
            rooms[props.index].entry_point = true
            rooms[props.board.entry_room_index].entry_point = false

            const data: Partial<Board> = { rooms, entry_room_id: props.room.id, entry_room_index: props.index }
            const response = await api.patch("/company/boards", data, {
                params: {
                    user_id: user?.id,
                    company_id: company?.id,
                    board_id: props.board.id,
                },
            })
            props.updateBoard(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Paper sx={{ flexDirection: "column", width: "25vw", padding: "1vw", gap: "1vw", overflow: "auto", height: "74vh" }}>
            {props.editMode ? (
                <Box sx={{ flexDirection: "column", marginBottom: "0.2vw" }}>
                    <Box sx={{ justifyContent: "space-between" }}>
                        <Box sx={{ alignItems: "center", gap: "1vw", flexWrap: "wrap" }}>
                            <Chip label={props.index + 1} color="primary" />
                            {props.room.entry_point && <EntryRoomIcon />}
                            {syncedIntegrations}
                        </Box>
                        <IconButton onClick={(ev) => setMenuAnchorEl(ev.currentTarget)}>
                            <MoreHoriz />
                        </IconButton>
                    </Box>
                    <RoomNameInput onSubmit={(name) => editRoomName(props.index, name)} currentName={props.room.name} />
                </Box>
            ) : (
                <Box sx={{ alignItems: "center", gap: "0.5vw", flexWrap: "wrap" }}>
                    <Typography sx={{ color: "text.secondary", fontWeight: "bold" }}>{props.room.name}</Typography>
                    <Tooltip title={`existem ${props.room.chats.length} conversas nesta sala`} arrow>
                        <Chip label={`${props.room.chats.length}`} size="small" color="primary" />
                    </Tooltip>
                    {props.room.entry_point && <EntryRoomIcon />}
                    {!!props.washimas.length && syncedIntegrations}
                </Box>
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
                                <Typography sx={{ color: "text.secondary", alignSelf: "center" }}>Nenhuma conversa</Typography>
                            </Box>
                        ) : (
                            props.room.chats.map((chat, index) => (
                                <BoardChat
                                    key={chat.id}
                                    chat={chat}
                                    index={index}
                                    washima={props.washimas.find((washima) => washima.id === chat.washima_id)}
                                    nagazap={props.nagazaps.find((nagazap) => nagazap.id === chat.nagazap_id)}
                                    board={props.board}
                                    room_id={props.room.id}
                                    updateBoard={(board) => props.updateBoard(board)}
                                />
                            ))
                        )}
                        {provided.placeholder}
                    </Box>
                )}
            </Droppable>

            <Menu open={!!menuAnchorEl} anchorEl={menuAnchorEl} onClose={onMenuClose}>
                <MenuItem disabled={props.room.entry_point} onClick={deleteRoom}>
                    Deletar
                </MenuItem>
                <MenuItem disabled={props.room.entry_point} onClick={setEntryRoom}>
                    Definir como sala inicial
                </MenuItem>
            </Menu>
        </Paper>
    )
}
