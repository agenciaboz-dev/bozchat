import React, { useEffect, useState } from "react"
import { Avatar, Box, Typography, useMediaQuery } from "@mui/material"
import { WashimaMessage } from "../../types/server/class/Washima/WashimaMessage"

interface ContactCardProps {
    message?: WashimaMessage
}

export const ContactCard: React.FC<ContactCardProps> = ({ message }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")

    //todo Chamar função na API que busca a foto pelo número

    // const [contactPicUrl, setContactPicUrl] = useState("")

    // const fetchContactPic = async () => {
    //     try {
    //         const response = await api.get("...")
    //         const data = response.data
    //         setContactPicUrl(data.url)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // useEffect(() => {
    // fetchContactPic()
    // }, [])

    //todo Fazer botões para adicionar contato / ligar / conversar ? (Precisa do painel de contatos primeiro)

    return (
        <Box sx={{ flexDirection: "row", alignItems: "center", display: "flex" }}>
            <Avatar
                sx={{
                    width: isMobile ? "12vw" : "3vw",
                    height: isMobile ? "12vw" : "3vw",
                    objectFit: "contain",
                    borderRadius: "50%",
                    margin: isMobile ? "2vw 2vw 2vw 0" : "0.3vw 0.5vw 0.3vw 0",
                    color: "text.secondary",
                }}
                alt="ícone"
                // src={contactPicUrl}
            />
            <Box sx={{ flexDirection: "column", alignItems: "center" }}>
                <Typography sx={{ textAlign: "center" }}>{message?.body.match(/FN:(.+)/)?.[1] ?? "Contato"}</Typography>
                <Typography sx={{ textAlign: "center" }}>{message?.body.match(/TEL[^:]*:(.+)/)?.[1] ?? "Telefone"}</Typography>
            </Box>
        </Box>
    )
}
