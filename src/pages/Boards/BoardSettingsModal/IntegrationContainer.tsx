import React, { useEffect, useState } from "react"
import {
    Autocomplete,
    Avatar,
    Box,
    Checkbox,
    FormControlLabel,
    IconButton,
    Paper,
    Switch,
    TextField,
    Tooltip,
    Typography,
    useMediaQuery,
} from "@mui/material"
import { Washima, WashimaProfilePic } from "../../../types/server/class/Washima/Washima"
import { useApi } from "../../../hooks/useApi"
import { WithoutFunctions } from "../../../types/server/class/helpers"
import { Board, BoardNagazapSettings, BoardWashimaSettings } from "../../../types/server/class/Board/Board"
import { Room } from "../../../types/server/class/Board/Room"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { useDarkMode } from "../../../hooks/useDarkMode"
import { custom_colors } from "../../../style/colors"
import { Warning } from "@mui/icons-material"

interface BusinessContainerProps {
    board: WithoutFunctions<Board>
    integration: Washima | Nagazap
    checked: boolean
    room?: Room
    onChange: (integration_id: string, setting?: BoardWashimaSettings | BoardNagazapSettings) => void
    type: "washima" | "nagazap"
    unread_only: boolean
}

export const IntegrationContainer: React.FC<BusinessContainerProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()

    const { fetchWashimaProfilePic } = useApi()

    const [profilePic, setProfilePic] = useState<WashimaProfilePic | null>(null)
    const [selectedRoom, setSelectedRoom] = useState(props.room || props.board.rooms[props.board.entry_room_index])
    const [unreadOnly, setUnreadOnly] = useState(props.unread_only)

    const washima = props.integration as Washima
    const nagazap = props.integration as Nagazap

    const washimaStopped = props.type === "washima" && washima.status === "stopped"

    const onChangeRoom = (room: Room) => {
        props.onChange(
            props.integration.id,
            props.checked
                ? props.type === "nagazap"
                    ? { nagazap_id: nagazap.id, room_id: room.id, nagazap_name: nagazap.displayName || "", unread_only: props.unread_only }
                    : { washima_id: props.integration.id, room_id: room.id, washima_name: washima.name, unread_only: props.unread_only }
                : undefined
        )
        setSelectedRoom(room)
    }

    const onChangeCheckbox = (value: boolean) => {
        props.onChange(
            props.integration.id,
            value
                ? props.type === "nagazap"
                    ? { nagazap_id: nagazap.id, room_id: selectedRoom.id, nagazap_name: nagazap.displayName || "", unread_only: unreadOnly }
                    : { washima_id: props.integration.id, room_id: selectedRoom.id, washima_name: washima.name, unread_only: unreadOnly }
                : undefined
        )
    }

    useEffect(() => {
        fetchWashimaProfilePic({ params: { washima_id: props.integration.id } }).then((data) => setProfilePic(data))
    }, [props.integration])

    return (
        <Paper
            sx={{
                border: darkMode ? undefined : `1px solid ${custom_colors.lightMode_border}`,
                boxShadow: darkMode ? undefined : `inset 0 0 5px ${custom_colors.lightMode_border}`,
                padding: isMobile ? "5vw" : "1vw",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? "5vw" : undefined,
            }}
        >
            <Box sx={{ flex: 1, alignItems: "center", gap: isMobile ? "2vw" : "1vw" }}>
                {washimaStopped ? (
                    <Tooltip title={`Essa instância está parada e não pode ser sincronizada.`}>
                        <IconButton color="warning">
                            <Warning />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Checkbox checked={props.checked} onChange={(_, value) => onChangeCheckbox(value)} sx={{ padding: isMobile ? 0 : undefined }} />
                )}
                <Avatar src={profilePic?.url} />
                <Box sx={{ flexDirection: "column" }}>
                    <Typography
                        sx={{
                            fontWeight: "bold",
                            width: isMobile ? "50vw" : "13vw",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {washima.name || nagazap.displayName || ""}
                    </Typography>
                    <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>{washima.number || nagazap.displayPhone}</Typography>
                </Box>
            </Box>

            <Box sx={{ flex: 1, alignItems: "center" }}>
                <Autocomplete
                    value={selectedRoom}
                    onChange={(_, value) => (value ? onChangeRoom(value) : null)}
                    options={props.board.rooms}
                    renderInput={(params) => <TextField {...params} label="Sala para novas mensagens" variant="standard" />}
                    getOptionKey={(option) => option.id}
                    getOptionLabel={(option) => option.name}
                    ChipProps={{ size: "small", color: "primary" }}
                    disableClearable
                    disabled={washimaStopped || props.checked}
                    sx={{ flex: 1 }}
                />
                <FormControlLabel
                    sx={{ flex: 0.4 }}
                    labelPlacement="top"
                    componentsProps={{ typography: { sx: { fontSize: "0.7rem", color: "text.secondary" } } }}
                    control={<Switch checked={unreadOnly} onChange={(_, value) => setUnreadOnly(value)} disabled={washimaStopped || props.checked} />}
                    label={unreadOnly ? "Não lidas" : "Todas conversas"}
                />
            </Box>
        </Paper>
    )
}
