import React from "react"
import { Box, Button, useMediaQuery } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { backgroundStyle } from "../style/background"

interface WildCardProps {}

export const WildCard: React.FC<WildCardProps> = ({}) => {
    const isMobile = useMediaQuery('(orientation: portrait)')
    const navigate = useNavigate()

    return (
        <Box
            sx={{...backgroundStyle, justifyContent: 'center',
                alignItems: 'center',
            color: 'warning.main'
            }}
        >
            <p style={{ fontSize: isMobile ? "30vw" : "10vw", fontWeight: "bold", marginTop: isMobile ? "30vw" : "" }}>404</p>
            <p style={{ fontSize: isMobile ? "6vw" : "2vw", fontWeight: "bold" }}>caminho não encontrado</p>

            <p
                onClick={() => navigate("/")}
                className='link'
                style={{ color: "warning.main", fontWeight: "bold", fontSize: isMobile ? "6vw" : "1vw", marginTop: isMobile ? "8vw" : "2vw",  }}
            >
                Voltar para o início
            </p>
        </Box>
    )
}
