import React, { useState } from "react"
import { Button, Paper, Typography, useMediaQuery } from "@mui/material"
import { Board } from "../../types/server/class/Board/Board"
import { WithoutFunctions } from "../../types/server/class/helpers"
import { Title2 } from "../../components/Title"
import { Archive as ArchiveIcon } from "@mui/icons-material"
import { ArchivedChats } from "./ArchivedChats"

interface ArchiveContainerProps {
    board: WithoutFunctions<Board>
    placeholder: React.ReactNode
    setBoard: React.Dispatch<React.SetStateAction<WithoutFunctions<Board>>>
}

export const ArchiveContainer: React.FC<ArchiveContainerProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const [showChats, setShowChats] = useState(false)

    const closeChatsModal = () => {
        setShowChats(false)
    }

    return (
        <Paper sx={{ flexDirection: "column", width: isMobile ? "90vw" : "25vw", padding: isMobile ? "5vw" : "1vw", gap: isMobile ? "5vw" : "1vw" }}>
            <Title2 name="Arquivo" left={<ArchiveIcon />} />
            <Typography color="text.secondary" variant="subtitle2">
                Conversas que forem soltas aqui serão arquivadas. Você pode recuperá-las a partir do botão abaixo.
            </Typography>

            {props.placeholder}

            <Button variant="outlined" size="small" onClick={() => setShowChats(true)}>
                Ver conversas arquivadas
            </Button>

            <ArchivedChats board={props.board} open={showChats} handleClose={closeChatsModal} onRestoreChat={props.setBoard} />
        </Paper>
    )
}
