import React, { useEffect, useMemo, useState } from "react"
import { Box, Chip, IconButton, Menu, MenuItem, Paper, TextField, Tooltip, Typography, useMediaQuery } from "@mui/material"
import { Room } from "../../../types/server/class/Board/Room"
import { BoardChat } from "../Chat/Chat"
import { Draggable, Droppable } from "@hello-pangea/dnd"
import { RoomNameInput } from "./RoomNameInput"
import { Board } from "../../../types/server/class/Board/Board"
import { useSnackbar } from "burgos-snackbar"
import { WithoutFunctions } from "../../../types/server/class/helpers"
import { MoreHoriz } from "@mui/icons-material"
import { useConfirmDialog } from "burgos-confirm"
import { Washima } from "../../../types/server/class/Washima/Washima"
import { IntegrationChip } from "../IntegrationChip"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { EntryRoomIcon } from "./EntryRoomIcon"
import { api } from "../../../api"
import { useUser } from "../../../hooks/useUser"
import { RoomSettingsModal } from "./RoomSettingsModal"
import { SearchIcon } from "./SearchIcon"
import { fuzzy } from "../../../tools/fuzzy"
import { Chat } from "../../../types/server/class/Board/Chat"
import { Virtuoso } from "react-virtuoso"

interface KanbanColumnProps {
    room: Room
    editMode: boolean
    updateRoom: (index: number, room: Room) => void
    board: WithoutFunctions<Board>
    index: number
    deleteRoom: (room_id: string) => void
    washimas: Washima[]
    nagazaps: Nagazap[]
    updateBoard: (board: WithoutFunctions<Board>) => void
    showAllAccordions?: boolean
}

export const BoardRoom: React.FC<KanbanColumnProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { user, company } = useUser()
    const { snackbar } = useSnackbar()
    const { confirm } = useConfirmDialog()

    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)
    const [showSettingsModal, setShowSettingsModal] = useState(false)
    const [showSearchBar, setShowSearchBar] = useState(false)
    const [filterText, setFilterText] = useState("")

    const filteredChats = useMemo(
        () => (filterText ? fuzzy<Chat>({ keys: ["name", "phone"], list: props.room.chats, text: filterText }) : props.room.chats),
        [props.room.chats, filterText]
    )

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
            return setting.room_id === props.room.id ? <IntegrationChip key={washima?.id} washima={washima} /> : null
        }),
        ...props.board.nagazap_settings.map((setting) => {
            const nagazap = props.nagazaps.find((nagazap) => nagazap.id === setting.nagazap_id)
            return setting.room_id === props.room.id ? <IntegrationChip key={nagazap?.id} nagazap={nagazap} /> : null
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

    const HeightPreservingItem: React.FC<any> = React.useCallback(({ children, ...props }) => {
        const [size, setSize] = useState(0)
        const knownSize = props["data-known-size"]
        useEffect(() => {
            setSize((prevSize) => {
                return knownSize == 0 ? prevSize : knownSize
            })
        }, [knownSize])
        // check style.css for the height-preserving-container rule
        return (
            <div
                {...props}
                className="height-preserving-container"
                style={{
                    "--child-height": `${size}px`,
                }}
            >
                {children}
            </div>
        )
    }, [])

    return (
        <Tooltip
            arrow
            placement="top"
            title={
                <Box sx={{ padding: isMobile ? "3vw 2vw" : "1vw 0.5vw" }}>
                    <TextField
                        label="Filtrar"
                        placeholder="Nome ou telefone"
                        variant="standard"
                        value={filterText}
                        onChange={(ev) => setFilterText(ev.target.value)}
                        InputLabelProps={{
                            style: { color: "white" },
                        }}
                        InputProps={{
                            style: { color: "white" },
                        }}
                    />
                </Box>
            }
            open={showSearchBar}
        >
            <Paper
                sx={{
                    flexDirection: "column",
                    width: isMobile ? "90vw" : "25vw",
                    padding: isMobile ? "5vw" : "1vw",
                    gap: isMobile ? "5vw" : "1vw",
                    height: 1,
                    // overflow: "scroll",
                }}
            >
                {props.editMode ? (
                    <Box sx={{ flexDirection: "column", marginBottom: isMobile ? "2vw" : "0.2vw" }}>
                        <Box sx={{ justifyContent: "space-between" }}>
                            <Box sx={{ alignItems: "center", gap: isMobile ? "2vw" : "1vw", flexWrap: "wrap" }}>
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
                    <Box sx={{ flexDirection: "column" }}>
                        <Box sx={{ alignItems: "center", gap: isMobile ? "2vw" : "0.5vw" }}>
                            <Typography sx={{ color: "text.secondary", fontWeight: "bold", whiteSpace: "nowrap" }}>{props.room.name}</Typography>
                            <Tooltip title={`Existem ${props.room.chats.length} conversas nesta sala`} arrow>
                                <Chip label={`${props.room.chats.length}`} size="small" color="primary" />
                            </Tooltip>
                            {props.room.entry_point && <EntryRoomIcon />}
                            <SearchIcon setShowSearchBar={setShowSearchBar} showSearchBar={showSearchBar} />
                        </Box>
                        <Box sx={{ flexWrap: "wrap", alignItems: "center", gap: isMobile ? "2vw" : "0.5vw" }}>
                            {!!props.washimas.length && syncedIntegrations}
                        </Box>
                    </Box>
                )}

                <Droppable
                    droppableId={props.room.id}
                    type="chat"
                    direction="vertical"
                    mode="virtual"
                    renderClone={(provided, snapshot, rubric) => (
                        <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <BoardChat
                                chat={filteredChats[rubric.source.index]}
                                index={rubric.source.index}
                                washima={props.washimas.find((w) => w.id === filteredChats[rubric.source.index].washima_id)}
                                nagazap={props.nagazaps.find((n) => n.id === filteredChats[rubric.source.index].nagazap_id)}
                                board={props.board}
                                room_id={props.room.id}
                                updateBoard={props.updateBoard}
                                showAllAccordions={true}
                                isDragging
                            />
                        </Box>
                    )}
                >
                    {(provided, snapshot) => (
                        <Box
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            sx={{
                                height: "50vh",
                                overflow: "scroll",
                                position: "relative",
                                bgcolor: snapshot.isDraggingOver ? "action.hover" : "background.paper",
                                transition: "background-color 0.3s ease",
                            }}
                        >
                            {filteredChats.length === 0 ? (
                                <Box sx={{ justifyContent: "center", alignItems: "center", height: "100%" }}>
                                    <Typography sx={{ color: "text.secondary" }}>Nenhuma conversa</Typography>
                                </Box>
                            ) : (
                                <Virtuoso
                                    style={{ height: "50vh", width: "100%", flexDirection: "column" }}
                                    data={filteredChats}
                                    components={{ Item: HeightPreservingItem }}
                                    // @ts-ignore
                                    scrollerRef={provided.innerRef}
                                    itemContent={(index, chat) => (
                                        <Draggable draggableId={chat.id} index={index} key={chat.id}>
                                            {(provided, snapshot) => (
                                                <Box
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                        ...provided.draggableProps.style,
                                                        marginBottom: isMobile ? "5vw" : "1vw",
                                                        // zIndex: snapshot.isDragging ? 9999 : "auto",
                                                    }}
                                                    // sx={{
                                                    //     width: 1,
                                                    //     transform: snapshot.isDragging ? "scale(1.05)" : "none",
                                                    //     opacity: snapshot.isDragging ? 0.8 : 1,
                                                    //     transition: "transform 0.2s, opacity 0.2s",
                                                    //     flexDirection: "column",
                                                    // }}
                                                >
                                                    <BoardChat
                                                        chat={chat}
                                                        index={index}
                                                        washima={props.washimas.find((w) => w.id === chat.washima_id)}
                                                        nagazap={props.nagazaps.find((n) => n.id === chat.nagazap_id)}
                                                        board={props.board}
                                                        room_id={props.room.id}
                                                        updateBoard={props.updateBoard}
                                                        showAllAccordions={props.showAllAccordions}
                                                        isDragging={snapshot.isDragging}
                                                    />
                                                </Box>
                                            )}
                                        </Draggable>
                                    )}
                                />
                            )}
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
                    <MenuItem
                        onClick={() => {
                            onMenuClose()
                            setShowSettingsModal(true)
                        }}
                    >
                        Configurações
                    </MenuItem>
                </Menu>

                <RoomSettingsModal
                    open={showSettingsModal}
                    onClose={() => setShowSettingsModal(false)}
                    room={props.room}
                    board={props.board}
                    updateBoard={props.updateBoard}
                />
            </Paper>
        </Tooltip>
    )
}
