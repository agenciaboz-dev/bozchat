import React, { useState } from "react"
import { Box, IconButton, TextField } from "@mui/material"
import { Add, Save } from "@mui/icons-material"

interface RoomNameInputProps {
    onSubmit: (name: string) => boolean
    currentName?: string
}

export const RoomNameInput: React.FC<RoomNameInputProps> = (props) => {
    const [name, setName] = useState(props.currentName)

    const onSavePress = () => {
        if (!name) {
            return
        }

        const result = props.onSubmit(name)
        if (result) {
        }
    }

    return <TextField
    variant="standard"
    value={name}
    onChange={(ev) => setName(ev.target.value)}
    onKeyDown={(ev) => {
        if (ev.code === "Enter") onSavePress()
    }}
    label={props.currentName ? 'Nome' :"Nova sala"}
    InputProps={{
        endAdornment: (
            <IconButton onClick={onSavePress} disabled={props.currentName === name}>
                {props.currentName ? <Save /> :<Add />}
            </IconButton>
        ),
    }}
/>
}
