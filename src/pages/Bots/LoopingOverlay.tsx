import React from "react"
import { Box, Button, Chip, Typography } from "@mui/material"
import { Cancel } from "@mui/icons-material"

interface LoopingOverlayProps {
    cancelLoopingSelecting: () => void
}

export const LoopingOverlay: React.FC<LoopingOverlayProps> = (props) => {
    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 1,
                justifyContent: "center",
                paddingTop: "1vw",
                pointerEvents: "auto",
                zIndex: 5,
                alignItems: "center",
                gap: "0.5vw",
            }}
        >
            <Chip
                label="Selecione a mensagem que será referenciada"
                sx={{ fontSize: "2rem", padding: "2vw", borderRadius: "5vw" }}
                onDelete={props.cancelLoopingSelecting}
                color="default"
                deleteIcon={<Cancel sx={{ width: "2rem", height: "2rem" }} />}
            />
            {/* <Typography sx={{ fontSize: "2rem", color: "warning.main", pointerEvents: "none" }}>
                Selecione a mensagem que será referenciada ou
            </Typography> */}
            {/* <Button sx={{ fontSize: "2rem" }} color="warning" onClick={props.cancelLoopingSelecting}>
                Cancelar
            </Button> */}
        </Box>
    )
}
