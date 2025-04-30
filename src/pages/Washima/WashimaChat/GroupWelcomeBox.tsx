import React from "react"
import { Avatar, Box, Button, Paper } from "@mui/material"
import { DateChip } from "./DateChip"
import { WashimaGroupUpdate } from "../../../types/server/class/Washima/WashimaGroupUpdate"
import { ErrorOutline } from "@mui/icons-material"
import { Chat } from "../../../types/Chat"

interface GroupWelcomeBoxProps {
    chat: Chat
    update: WashimaGroupUpdate
    profilePic?: string
}

const AVATAR_SIZE = "6vw"

export const GroupWelcomeBox: React.FC<GroupWelcomeBoxProps> = ({ chat, profilePic, update }) => {
    return (
        <>
            <DateChip timestamp={chat.timestamp * 1000} />
            <Paper
                elevation={5}
                sx={{
                    width: "60%",
                    gap: "1vw",
                    padding: "2vw",
                    borderRadius: "2vw",
                    flexDirection: "column",
                    alignItems: "center",
                    alignSelf: "center",
                    color: "text.secondary",
                }}
            >
                <Avatar
                    src={profilePic}
                    sx={{ width: AVATAR_SIZE, height: AVATAR_SIZE, bgcolor: "primary.main", cursor: "pointer" }}
                    imgProps={{ draggable: false }}
                    // onClick={() => picture.open(profilePic || "")}
                />

                <Box sx={{ flexDirection: "column", alignItems: "center" }}>
                    <Box sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>{update.author} adicionou você</Box>
                    <Box sx={{ fontSize: "0.8rem" }}>Grupo • {chat.groupMetadata?.participants.length} membros</Box>
                </Box>

                <Button startIcon={<ErrorOutline />} variant="outlined" sx={{ borderRadius: "5vw", textTransform: "none" }}>
                    Informações do grupo
                </Button>
            </Paper>
        </>
    )
}
