import React, { useEffect, useState } from "react"
import { Autocomplete, Avatar, Box, Checkbox, Paper, TextField, Typography, useMediaQuery } from "@mui/material"
import { Washima, WashimaProfilePic } from "../../../types/server/class/Washima/Washima"
import { useApi } from "../../../hooks/useApi"
import { WithoutFunctions } from "../../../types/server/class/helpers"
import { Board, BoardNagazapSettings, BoardWashimaSettings } from "../../../types/server/class/Board/Board"
import { Room } from "../../../types/server/class/Board/Room"
import { Nagazap } from "../../../types/server/class/Nagazap"

interface BusinessContainerProps {
    board: WithoutFunctions<Board>
    integration: Washima | Nagazap
    checked: boolean
    room?: Room
    onChange: (integration_id: string, setting?: BoardWashimaSettings | BoardNagazapSettings) => void
    type: "washima" | "nagazap"
}

export const IntegrationContainer: React.FC<BusinessContainerProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")

    const { fetchWashimaProfilePic } = useApi()

    const [profilePic, setProfilePic] = useState<WashimaProfilePic | null>(null)
    const [selectedRoom, setSelectedRoom] = useState(props.room || props.board.rooms[props.board.entry_room_index])

    const washima = props.integration as Washima
    const nagazap = props.integration as Nagazap

    const onChangeRoom = (room: Room) => {
        props.onChange(
            props.integration.id,
            props.checked
                ? props.type === "nagazap"
                    ? { nagazap_id: nagazap.id, room_id: room.id, nagazap_name: nagazap.displayName || "" }
                    : { washima_id: props.integration.id, room_id: room.id, washima_name: washima.name }
                : undefined
        )
        setSelectedRoom(room)
    }

    const onChangeCheckbox = (value: boolean) => {
        props.onChange(
            props.integration.id,
            value
                ? props.type === "nagazap"
                    ? { nagazap_id: nagazap.id, room_id: selectedRoom.id, nagazap_name: nagazap.displayName || "" }
                    : { washima_id: props.integration.id, room_id: selectedRoom.id, washima_name: washima.name }
                : undefined
        )
    }

    useEffect(() => {
        fetchWashimaProfilePic({ params: { washima_id: props.integration.id } }).then((data) => setProfilePic(data))
    }, [props.integration])

    return (
        <Paper sx={{ padding: isMobile ? "5vw" : "1vw", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "5vw" : undefined }}>
            <Box sx={{ flex: 1, alignItems: "center", gap: isMobile ? "2vw" : "1vw" }}>
                <Checkbox checked={props.checked} onChange={(_, value) => onChangeCheckbox(value)} sx={{ padding: isMobile ? 0 : undefined }} />
                <Avatar src={profilePic?.url} />
                <Box sx={{ flexDirection: "column" }}>
                    <Typography
                        sx={{
                            fontWeight: "bold",
                            width: isMobile ? "100%" : "13vw",
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

            <Box sx={{ flex: 1 }}>
                <Autocomplete
                    value={selectedRoom}
                    onChange={(_, value) => (value ? onChangeRoom(value) : null)}
                    options={props.board.rooms}
                    renderInput={(params) => <TextField {...params} label="Sala para novas mensagens" variant="standard" />}
                    fullWidth
                    getOptionKey={(option) => option.id}
                    getOptionLabel={(option) => option.name}
                    ChipProps={{ size: "small", color: "primary" }}
                    disableClearable
                />
            </Box>
        </Paper>
    )
}
