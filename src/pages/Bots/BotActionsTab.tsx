import React, { useEffect, useMemo, useState } from "react"
import { Autocomplete, Box, Button, Checkbox, IconButton, Paper, TextField, Tooltip, Typography } from "@mui/material"
import { Accordion } from "../../components/Accordion"
import { NodeAction, ValidAction } from "../../types/server/class/Bot/NodeAction"
import { FlowNode, FlowNodeData } from "../../types/server/class/Bot/Bot"
import { useFetchedData } from "../../hooks/useFetchedData"
import { Board } from "../../types/server/class/Board/Board"
import { Room } from "../../types/server/class/Board/Room"
import { InfoOutlined, Save, Warning } from "@mui/icons-material"
import { useSnackbar } from "burgos-snackbar"
import { TextInfo } from "./TextInfo"

interface BotActionsTabProps {
    data?: FlowNodeData
    updateData: (data: FlowNodeData) => void
    saveNode: (node_id: string, value: FlowNodeData) => void
    node: FlowNode | null
}

interface ActionContainerProps {
    title: string
    description: string
    settingsComponent: React.ReactNode
    checked: boolean
    onCheck: (target: ValidAction) => void
    target: ValidAction
}

const ActionContainer: React.FC<ActionContainerProps> = (props) => {
    return (
        <Accordion
            expanded={props.checked}
            titleElement={
                <Paper
                    sx={{ alignItems: "center", flex: 1, color: props.checked ? "primary.main" : "secondary.main", padding: "0.5vw", justifyContent: 'space-between' }}
                    onClick={() => props.onCheck(props.target)}
                >
                    <Box sx={{alignItems: 'center'}}>
                    <Checkbox checked={props.checked} />
                    <Typography>{props.title}</Typography>
                    </Box>
                    <Tooltip title={props.description}>
                        <IconButton>
                            <InfoOutlined />
                        </IconButton>
                    </Tooltip>
                </Paper>
            }
            expandedElement={
                <Paper sx={{ flexDirection: "column", padding: "1vw", flex: 1, color: "secondary.main", marginTop: "0.5vw" }}>
                    {props.settingsComponent}
                </Paper>
            }
        />
    )
}

export const BotActionsTab: React.FC<BotActionsTabProps> = (props) => {
    const { snackbar } = useSnackbar()

    const [boards] = useFetchedData<Board>("boards", { params: { all: true } })
    const [destinationBoard, setDestinationBoard] = useState<Board | null>(null)
    const [destinationRoom, setDestinationRoom] = useState<Room | null>(null)

    const rooms = useMemo(() => destinationBoard?.rooms || [], [destinationBoard])
    const boardChat = useMemo(() => {
        const action = props.data?.actions?.find((item) => item.target === "board:room:chat:new")
        console.log({ action })

        return action
    }, [props.data])

    const handleCheckPress = (target: ValidAction) => {
        if (!props.data) return
        const exists = props.data.actions?.find((item) => item.target === target)

        const newData: FlowNodeData = exists
            ? { ...props.data, actions: props.data.actions?.filter((item) => item.target !== target) }
            : { ...props.data, actions: [...(props.data.actions || []), { target, settings: {}, run: async () => {} }] }

        console.log({ newData })
        props.updateData(newData)
    }

    const save = () => {
        if (!props.node || !props.data) return
        props.saveNode(props.node.id, props.data)
        snackbar({ severity: "success", text: "Salvo" })
    }

    const updateBoardSettings = (options: { room_id?: string; board_id?: string }) => {
        if (!props.data || !props.data.actions || !boardChat) return

        if (options.board_id) boardChat.settings.board_id = options.board_id
        if (options.room_id) boardChat.settings.room_id = options.room_id
        props.updateData({ ...props.data, actions: [...props.data.actions.filter((item) => item.target !== boardChat.target), boardChat] })
    }

    useEffect(() => {
        setDestinationRoom(
            destinationBoard?.rooms.find((item) => item.id === boardChat?.settings.room_id) ||
                destinationBoard?.rooms[destinationBoard.entry_room_index] ||
                null
        )
    }, [destinationBoard, boardChat])

    useEffect(() => {
        if (boards && boardChat) {
            setDestinationBoard(boards.find((item) => item.id === boardChat.settings.board_id) || null)
        }
    }, [boards, boardChat])

    return (
        <Box sx={{ flexDirection: "column", flex: 1, gap: "1vw" }}>
            <Box sx={{ flexDirection: "column", gap: "1vw", padding: "1vw", bgcolor: "background.default", flex: 1, borderRadius: "0.5vw" }}>
                <TextInfo>As ações marcadas serão executadas quando esta mensagem for enviada</TextInfo>
                <ActionContainer
                    checked={!!boardChat}
                    target={"board:room:chat:new"}
                    title="Enviar para um quadro"
                    description="Copie esta conversa para um quadro e sala configurados abaixo"
                    settingsComponent={
                        <Box sx={{ gap: "1vw", flexDirection: "column" }}>
                            <Autocomplete
                                options={boards}
                                value={destinationBoard}
                                onChange={(_, value) => {
                                    setDestinationBoard(value)
                                    value && updateBoardSettings({ board_id: value.id })
                                }}
                                renderInput={(params) => <TextField {...params} label="Quadro" />}
                                fullWidth
                                getOptionLabel={(option) => option.name}
                                getOptionKey={(option) => option.id}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                            />
                            <Autocomplete
                                options={rooms}
                                value={destinationRoom}
                                onChange={(_, value) => {
                                    setDestinationRoom(value)
                                    value && updateBoardSettings({ room_id: value.id })
                                }}
                                renderInput={(params) => <TextField {...params} label="Sala" />}
                                fullWidth
                                getOptionLabel={(option) => option.name}
                                getOptionKey={(option) => option.id}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                            />
                        </Box>
                    }
                    onCheck={handleCheckPress}
                />
            </Box>
            <Button variant="contained" startIcon={<Save />} sx={{ alignSelf: "flex-end" }} onClick={save}>
                salvar
            </Button>
        </Box>
    )
}
