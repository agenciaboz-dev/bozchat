import React, { useEffect, useMemo, useState } from "react"
import { Autocomplete, Box, Checkbox, IconButton, Paper, TextField, Tooltip, Typography } from "@mui/material"
import { Accordion } from "../../components/Accordion"
import { NodeAction, ValidAction } from "../../types/server/class/Bot/NodeAction"
import { FlowNode, FlowNodeData } from "../../types/server/class/Bot/Bot"
import { useFetchedData } from "../../hooks/useFetchedData"
import { Board } from "../../types/server/class/Board/Board"
import { Room } from "../../types/server/class/Board/Room"
import { InfoOutlined, Report } from "@mui/icons-material"
import { TextInfo } from "./TextInfo"
import { useDarkMode } from "../../hooks/useDarkMode"
import { custom_colors } from "../../style/colors"

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
    onCheck: (target: ValidAction) => void
    target: ValidAction
    action?: NodeAction
    settingsHeight: string
}

const ActionContainer: React.FC<ActionContainerProps> = (props) => {
    const { darkMode } = useDarkMode()
    return (
        <Accordion
            expanded={!!props.action}
            height={props.settingsHeight}
            titleElement={
                <Paper
                    sx={{
                        boxShadow: darkMode ? undefined : `inset 0 0 5px ${custom_colors.lightMode_border}`,
                        alignItems: "center",
                        flex: 1,
                        color: !!props.action ? "primary.main" : "text.secondary",
                        padding: "0.5vw",
                        justifyContent: "space-between",
                        backgroundColor: darkMode ? undefined : "background.default",
                    }}
                    onClick={() => props.onCheck(props.target)}
                >
                    <Box sx={{ alignItems: "center" }}>
                        <Checkbox checked={!!props.action} />
                        <Typography>{props.title}</Typography>
                    </Box>
                    <Tooltip arrow title={props.action?.settings.misconfigured ? "Essa ação precisa ser reconfigurada" : props.description}>
                        <IconButton onClick={(e) => e.stopPropagation()}>
                            {props.action?.settings.misconfigured ? (
                                <Report
                                    color="secondary"
                                    sx={{
                                        padding: "0.2vw",
                                        bgcolor: "error.main",
                                        borderRadius: "100%",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                />
                            ) : (
                                <InfoOutlined />
                            )}
                        </IconButton>
                    </Tooltip>
                </Paper>
            }
            expandedElement={
                <Paper
                    sx={{
                        flexDirection: "column",
                        padding: "1vw",
                        flex: 1,
                        marginTop: "0.5vw",
                        boxShadow: darkMode ? undefined : `inset 0 0 5px ${custom_colors.lightMode_border}`,
                    }}
                >
                    {props.settingsComponent}
                </Paper>
            }
        />
    )
}

export const BotActionsTab: React.FC<BotActionsTabProps> = (props) => {
    const { darkMode } = useDarkMode()

    const [boards] = useFetchedData<Board>("boards", { params: { all: true } })
    const [destinationBoard, setDestinationBoard] = useState<Board | null>(null)
    const [destinationRoom, setDestinationRoom] = useState<Room | null>(null)

    const rooms = useMemo(() => destinationBoard?.rooms || [], [destinationBoard])
    const sendToBoardAction = useMemo(() => {
        const action = props.data?.actions?.find((item) => item.target === "board:room:chat:new")
        console.log({ action })

        return action
    }, [props.data])

    const pauseAction = useMemo(() => props.data?.actions?.find((item) => item.target === "bot:end"), [props.data])
    const addToBlacklistAction = useMemo(() => props.data?.actions?.find((item) => item.target === "nagazap:blacklist:add"), [props.data])

    const handleCheckPress = (target: ValidAction) => {
        if (!props.data) return
        const exists = props.data.actions?.find((item) => item.target === target)

        const newData: FlowNodeData = exists
            ? { ...props.data, actions: props.data.actions?.filter((item) => item.target !== target) }
            : {
                  ...props.data,
                  actions: [
                      ...(props.data.actions || []),
                      { target, settings: { misconfigured: target === "nagazap:blacklist:add" ? false : true }, run: async () => {} },
                  ],
              }

        console.log({ newData })
        props.updateData(newData)
    }

    const updateBoardSettings = (options: { room_id?: string | null; board_id?: string | null }) => {
        if (!props.data || !props.data.actions || !sendToBoardAction) return

        if (options.board_id !== null) sendToBoardAction.settings.board_id = options.board_id
        if (options.room_id !== null) sendToBoardAction.settings.room_id = options.room_id

        sendToBoardAction.settings.misconfigured = !sendToBoardAction.settings.board_id
        props.updateData({
            ...props.data,
            actions: [...props.data.actions.filter((item) => item.target !== sendToBoardAction.target), sendToBoardAction],
        })
    }

    const updatePauseSettings = (expiry: number) => {
        if (!props.data || !props.data.actions || !pauseAction) return

        pauseAction.settings.expiry = expiry

        pauseAction.settings.misconfigured = !pauseAction.settings.expiry
        props.updateData({
            ...props.data,
            actions: [...props.data.actions.filter((item) => item.target !== pauseAction.target), pauseAction],
        })
    }

    useEffect(() => {
        setDestinationRoom(
            destinationBoard?.rooms.find((item) => item.id === sendToBoardAction?.settings.room_id) ||
                destinationBoard?.rooms[destinationBoard.entry_room_index] ||
                null
        )
    }, [destinationBoard, sendToBoardAction])

    useEffect(() => {
        if (boards && sendToBoardAction) {
            setDestinationBoard(boards.find((item) => item.id === sendToBoardAction.settings.board_id) || null)
        }
    }, [boards, sendToBoardAction])

    return (
        <Box
            sx={{
                flexDirection: "column",
                gap: "1vw",
                padding: "1vw",
                bgcolor: darkMode ? "background.default" : custom_colors.lightMode_botNodeDrawerBackground,
                border: darkMode ? `1px solid ${custom_colors.darkMode_border}` : `1px solid ${custom_colors.lightMode_border}`,
                boxShadow: darkMode ? undefined : `inset 0 0 5px ${custom_colors.lightMode_border}`,
                flex: 1,
                borderRadius: "0.5vw",
            }}
        >
            <TextInfo>As ações marcadas serão executadas quando esta mensagem for enviada</TextInfo>
            <ActionContainer
                action={sendToBoardAction}
                target={"board:room:chat:new"}
                title="Enviar para um quadro"
                description="Copie esta conversa para um quadro"
                settingsHeight="11vw"
                settingsComponent={
                    <Box sx={{ gap: "1vw", flexDirection: "column" }}>
                        <Autocomplete
                            options={boards}
                            value={destinationBoard}
                            onChange={(_, value) => {
                                setDestinationBoard(value)
                                updateBoardSettings({ board_id: value?.id, room_id: null })
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
                                updateBoardSettings({ room_id: value?.id, board_id: null })
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
            <ActionContainer
                action={pauseAction}
                target="bot:end"
                title="Finalizar conversa"
                description="Encerrar a conversa e impedir qualquer interação do bot com o contato, pela duração configurada"
                settingsHeight="8vw"
                settingsComponent={
                    <TextField
                        label="Duração"
                        placeholder="Impedir que o bot interaja por 30 minutos"
                        fullWidth
                        value={pauseAction?.settings.expiry || 0}
                        onChange={(ev) => {
                            const number = Number(ev.target.value.replace(/\D/g, ""))
                            if (number) updatePauseSettings(number)
                            if (ev.target.value === "") updatePauseSettings(0)
                        }}
                        InputProps={{ endAdornment: <Typography>Minutos</Typography> }}
                    />
                }
                onCheck={handleCheckPress}
            />
            <ActionContainer
                action={addToBlacklistAction}
                target="nagazap:blacklist:add"
                title="Broadcast: adicionar à lista negra"
                description="Ao adicionar à lista negra, o broadcast irá ignorar este contato ao enviar mensagens em massa"
                settingsHeight="0vw"
                settingsComponent={null}
                onCheck={handleCheckPress}
            />
        </Box>
    )
}
