import React, { useEffect, useState } from "react"
import { Autocomplete, Avatar, Box, Checkbox, Paper, TextField, Typography } from "@mui/material"
import { Washima, WashimaProfilePic } from "../../../types/server/class/Washima/Washima"
import { useApi } from "../../../hooks/useApi"
import { WithoutFunctions } from "../../../types/server/class/helpers"
import { Board, BoardWashimaSettings } from "../../../types/server/class/Board/Board"
import { Room } from "../../../types/server/class/Board/Room"

interface BusinessContainerProps {
    board: WithoutFunctions<Board>
    washima: Washima
    checked: boolean
    onChange: (washima_id: string, setting?: BoardWashimaSettings) => void
}

export const BusinessContainer: React.FC<BusinessContainerProps> = (props) => {
    const { fetchWashimaProfilePic } = useApi()

    const [profilePic, setProfilePic] = useState<WashimaProfilePic | null>(null)
    const [selectedRoom, setSelectedRoom] = useState(props.board.rooms[props.board.entry_room_index])

    const onChangeRoom = (room: Room) => {
        props.onChange(props.washima.id, props.checked ? { washima_id: props.washima.id, room_id: room.id } : undefined)
        setSelectedRoom(room)
    }

    const onChangeCheckbox = (value: boolean) => {
        props.onChange(props.washima.id, value ? { washima_id: props.washima.id, room_id: selectedRoom.id } : undefined)
    }

    useEffect(() => {
        fetchWashimaProfilePic({ params: { washima_id: props.washima.id } }).then((data) => setProfilePic(data))
    }, [props.washima])

    return (
        <Paper sx={{ padding: "1vw" }}>
            <Box sx={{ flex: 1, alignItems: "center", gap: "1vw" }}>
                <Checkbox checked={props.checked} onChange={(_, value) => onChangeCheckbox(value)} />
                <Avatar src={profilePic?.url} />
                <Box sx={{ flexDirection: "column" }}>
                    <Typography sx={{ fontWeight: "bold", width: "13vw", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {props.washima.name}
                    </Typography>
                    <Typography sx={{ fontSize: "0.8rem", color: "secondary.main" }}>{props.washima.number}</Typography>
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
                    ListboxProps={{ sx: { width: "100%", bgcolor: "background.default" } }}
                    disableClearable
                />
            </Box>
        </Paper>
    )
}
