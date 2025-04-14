import React, { useEffect, useRef, useState } from "react"
import { Box, Button, CircularProgress, IconButton, MenuItem, Paper, TextField, Tooltip, Typography, useMediaQuery } from "@mui/material"
import { Board } from "../../types/server/class/Board/Board"
import { Title2 } from "../../components/Title"
import { Add, ArrowBack, Edit, EditOff, EditRounded, Refresh, Save, Settings } from "@mui/icons-material"
import { BoardRoom } from "./Room/Room"
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd"
import { WithoutFunctions } from "../../types/server/class/helpers"
import { useIo } from "../../hooks/useIo"
import { uid } from "uid"
import { Room } from "../../types/server/class/Board/Room"
import { useUser } from "../../hooks/useUser"
import { BoardSettingsModal } from "./BoardSettingsModal/BoardSettingsModal"
import { useFetchedData } from "../../hooks/useFetchedData"
import { Washima } from "../../types/server/class/Washima/Washima"
import { Nagazap } from "../../types/server/class/Nagazap"
import { useApi } from "../../hooks/useApi"
import { useSnackbar } from "burgos-snackbar"

interface BoardPageProps {
    board: WithoutFunctions<Board>
    navigateBack: () => void
}

export const BoardPage: React.FC<BoardPageProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const io = useIo()
    const { user } = useUser()
    const api = useApi()
    const { snackbar } = useSnackbar()

    const columnsBoxRef = useRef<HTMLDivElement | null>(null)

    const [washimas] = useFetchedData<Washima>("washimas")
    const [nagazaps] = useFetchedData<Nagazap>("nagazaps")
    const [board, setBoard] = useState(props.board)
    const [editMode, setEditMode] = useState(false)
    const [saving, setSaving] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [syncing, setSyncing] = useState(false)

    const isSame = (result: DropResult<string>) =>
        result.destination?.droppableId === result.source.droppableId && result.destination.index === result.source.index

    const handleChatDrag = (result: DropResult<string>) => {
        let sourceRoomIndex = -1
        const sourceRoom = board.rooms.find((room, index) => {
            if (room.id === result.source.droppableId) {
                sourceRoomIndex = index
                return true
            }
        })
        let destinationRoomIndex = -1
        const destinationRoom = board.rooms.find((room, index) => {
            if (room.id === result.destination?.droppableId) {
                destinationRoomIndex = index
                return true
            }
        })

        if (sourceRoom && destinationRoom && result.destination) {
            const chat = sourceRoom.chats[result.source.index]
            sourceRoom.chats = sourceRoom.chats.filter((item) => item.id !== chat.id)
            destinationRoom.chats = [
                ...destinationRoom.chats.slice(0, result.destination.index),
                chat,
                ...destinationRoom.chats.slice(result.destination.index),
            ]

            setBoard((currentBoard) => {
                const rooms = currentBoard.rooms
                rooms[sourceRoomIndex].chats = sourceRoom.chats
                rooms[destinationRoomIndex].chats = destinationRoom.chats
                const board = { ...currentBoard, rooms }

                save(board)

                if (destinationRoom.on_new_chat) {
                    api.emitRommTrigger(chat, destinationRoom.on_new_chat, "in")
                }

                if (sourceRoom.on_new_chat) {
                    api.emitRommTrigger(chat, sourceRoom.on_new_chat, "out")
                }

                return board
            })
        }
    }

    const handleDragRoom = (result: DropResult<string>) => {
        if (result.destination) {
            setBoard((currentBoard) => {
                const room = currentBoard.rooms[result.source.index]
                let rooms = currentBoard.rooms.filter((item) => item.id !== room.id)
                rooms = [...rooms.slice(0, result.destination!.index), room, ...rooms.slice(result.destination!.index)]
                const board = { ...currentBoard, rooms }
                save(board)
                return board
            })
        }
    }

    const onDragEnd = (result: DropResult<string>) => {
        if (isSame(result)) return

        if (result.type === "chat") {
            handleChatDrag(result)
        }

        if (result.type === "room") {
            handleDragRoom(result)
        }
    }

    const save = (board: WithoutFunctions<Board>) => {
        io.emit("board:update", board)
    }

    const handleEditPress = () => {
        setEditMode((value) => !value)
    }

    const updateRoom = (index: number, room: Room) => {
        setBoard((currentBoard) => {
            const rooms = currentBoard.rooms
            rooms[index] = room
            const board = { ...currentBoard, rooms }
            save(board)

            return board
        })
    }

    const addRoom = () => {
        setBoard((currentBoard) => {
            const rooms = currentBoard.rooms
            rooms.push({ chats: [], id: uid(), name: `Sala ${rooms.length + 1}`, newMessage: async () => {} })
            const board = { ...currentBoard, rooms }
            save(board)

            setTimeout(
                () =>
                    columnsBoxRef.current?.scroll({
                        left: columnsBoxRef.current.scrollWidth - columnsBoxRef.current.clientWidth,
                        behavior: "smooth",
                    }),
                500
            )

            return board
        })
    }

    const deleteRoom = (room_id: string) => {
        setBoard((currentBoard) => {
            const room = currentBoard.rooms.find((item) => item.id === room_id)
            const rooms = currentBoard.rooms.filter((item) => item.id !== room_id)

            if (!!room?.chats.length) {
                const defaultRoomIndex = currentBoard.rooms.findIndex((item) => item.id === currentBoard.entry_room_id)
                rooms[defaultRoomIndex].chats = [...room.chats, ...rooms[defaultRoomIndex].chats]
            }

            for (const [index, setting] of currentBoard.washima_settings.entries()) {
                if (setting.room_id === room_id) {
                    currentBoard.washima_settings[index].room_id = currentBoard.entry_room_id
                }
            }

            const board = { ...currentBoard, rooms }
            save(board)

            return board
        })
    }

    useEffect(() => {
        if (board) {
            console.log(board)
            io.on(`board:update`, (board: Board) => {
                setBoard(board)
            })

            return () => {
                io.off("board:update")
            }
        }
    }, [board])

    useEffect(() => {
        io.emit("board:subscribe", board.id)

        io.on("sync:pending", () => {
            snackbar({ severity: "info", text: "Sincronização iniciada. Você receberá um alerta quando concluída." })
            setSyncing(true)
        })

        io.on("sync:done", () => {
            snackbar({ severity: "info", text: "Sincronização concluída." })
            setSyncing(false)
        })

        return () => {
            io.emit("board:unsubscribe", board.id)

            io.off("sync:pending")
            io.off("sync:done")
        }
    }, [])

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Box sx={{ padding: isMobile ? "5vw" : "2vw", paddingBottom: 0, marginBottom: isMobile ? 0 : "-0.5vw" }}>
                <Title2
                    name={`${props.board.name}`}
                    left={
                        <IconButton onClick={props.navigateBack}>
                            <ArrowBack />
                        </IconButton>
                    }
                    right={
                        <Box sx={{ alignItems: "center" }}>
                            {syncing && (
                                <Tooltip title="Sincronizando" arrow>
                                    <CircularProgress color="success" />
                                </Tooltip>
                            )}
                            {user?.admin && (
                                <>
                                    <IconButton onClick={addRoom}>
                                        <Add />
                                    </IconButton>
                                    <IconButton onClick={() => setShowSettings(true)}>
                                        <Settings />
                                    </IconButton>
                                    <IconButton onClick={handleEditPress}>
                                        {saving ? <CircularProgress size="1.5rem" color="secondary" /> : editMode ? <EditOff /> : <Edit />}
                                    </IconButton>
                                </>
                            )}
                        </Box>
                    }
                />
            </Box>
            <Box
                ref={columnsBoxRef}
                sx={{
                    flexDirection: "column",
                    flex: 1,
                    gap: isMobile ? "5vw" : "1vw",
                    padding: isMobile ? "5vw" : "2vw",
                    width: "100vw",
                    overflow: "auto",
                }}
            >
                <Droppable droppableId={props.board.id} type="room" direction="horizontal">
                    {(provided) => (
                        <Box
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            sx={{
                                flex: 1,
                                gap: isMobile ? "5vw" : "2vw",
                                margin: isMobile ? "0 -5vw" : "0 -2vw",
                                padding: isMobile ? "0 5vw" : "0 2vw",
                                marginBottom: isMobile ? "-5vw" : "-2vw",
                                paddingBottom: isMobile ? "5vw" : "2vw",
                                overflow: "auto",
                            }}
                        >
                            {board.rooms.map((room, index) => (
                                <Draggable key={room.id} draggableId={room.id} index={index} isDragDisabled={!editMode}>
                                    {(provided) => (
                                        <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                            <BoardRoom
                                                key={room.id}
                                                washimas={washimas}
                                                nagazaps={nagazaps}
                                                room={room}
                                                editMode={editMode}
                                                updateRoom={updateRoom}
                                                index={index}
                                                board={board}
                                                deleteRoom={deleteRoom}
                                                updateBoard={(board) => setBoard(board)}
                                            />
                                        </Box>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>

                <BoardSettingsModal board={board} open={showSettings} onClose={() => setShowSettings(false)} onSubmit={setBoard} />
            </Box>
        </DragDropContext>
    )
}
