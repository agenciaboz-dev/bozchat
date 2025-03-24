import React, { useState } from "react"
import { Box, IconButton, TextField } from "@mui/material"
import { Add } from "@mui/icons-material"
import { RoomNameInput } from "./RoomNameInput"

interface NewRoomFormProps {
    onAddRoom: (name: string) => boolean
}

export const NewRoomForm: React.FC<NewRoomFormProps> = (props) => {
    const [name, setName] = useState("")

    const onSavePress = () => {
        if (!name) {
            return
        }

        const result = props.onAddRoom(name)
        if (result) {
            setName("")
        }
    }

    return (
        <Box
            sx={{ flexDirection: "column", width: "25vw", height: "73vh", padding: "1vw", border: "1px solid", borderRadius: "0.3vw" }}
            color="secondary.main"
        >
            <RoomNameInput onSubmit={props.onAddRoom} />
        </Box>
    )
}
