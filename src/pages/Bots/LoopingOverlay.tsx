import React from "react"
import { Box, Button, Chip, Typography, useMediaQuery } from "@mui/material"
import { Cancel } from "@mui/icons-material"

interface LoopingOverlayProps {
    cancelLoopingSelecting: () => void
}

export const LoopingOverlay: React.FC<LoopingOverlayProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")

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
                sx={{
                    fontSize: isMobile ? "1.2rem" : "2rem",
                    padding: "2vw",
                    borderRadius: isMobile ? "2vw" : "5vw",
                    height: "auto",
                    "& .MuiChip-label": {
                        display: "block",
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                    },
                    "& .MuiChip-deleteIcon": {
                        marginLeft: "2vw",
                    },
                }}
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
