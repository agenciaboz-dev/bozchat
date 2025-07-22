import React, { useEffect, useState } from "react"
import { Avatar, Box, Divider, Typography, useMediaQuery } from "@mui/material"
import { WashimaMessage } from "../../types/server/class/Washima/WashimaMessage"
import { Washima } from "../../types/server/class/Washima/Washima"
import { api } from "../../api"

interface ContactCardProps {
    message?: WashimaMessage
    washima?: Washima
    user_id: string | undefined
}

export const ContactCard: React.FC<ContactCardProps> = ({ message, washima, user_id }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const [contactPicUrl, setContactPicUrl] = useState("")
    const [error, setError] = useState<string | null>(null)

    const extractFormattedWaid = (vcard: string): string | undefined => {
        try {
            // Extrai apenas os dígitos:
            const waidMatch = vcard.match(/waid=(\d+)/)
            if (!waidMatch) return undefined

            // Formata com o sufixo legado:
            return `${waidMatch[1]}@c.us`
        } catch (e) {
            console.error("(ContactCard) Erro ao formatar waid:", e)
            return undefined
        }
    }

    const fetchContactPic = async () => {
        setError(null)

        if (!washima?.id) {
            setError("(ContactCard) Washima ID não disponível")
            return
        }

        if (!user_id) {
            setError("(ContactCard) User ID não definido")
            return
        }

        if (!message?.body) {
            setError("(ContactCard) Corpo da mensagem vazio")
            return
        }

        const formattedWaid = extractFormattedWaid(message.body)
        if (!formattedWaid) {
            setError("(ContactCard) WAID não encontrado ou formato inválido no vCard")
            return
        }

        try {
            console.log("(ContactCard) Enviando requisição com waid formatado:", formattedWaid)

            const response = await api.get("/washima/contact/profile-pic", {
                params: {
                    washima_id: washima.id,
                    user_id,
                    contact_id: formattedWaid,
                },
            })

            const url = response.data?.url || response.data
            if (!url) {
                setError("(ContactCard) URL da foto não encontrada na resposta")
                return
            }

            setContactPicUrl(url)
        } catch (e: any) {
            console.error("(ContactCard) Catch:", e)
        }
        console.error("(ContactCard) Erro encontrado:", error)
    }

    useEffect(() => {
        fetchContactPic()
    }, [])

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
                src={contactPicUrl}
            />
            <Box sx={{ flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                <Typography sx={{ textAlign: "center", marginBottom: "-5px" }}>{message?.body.match(/FN:(.+)/)?.[1] ?? "Contato"}</Typography>
                <Divider sx={{ borderWidth: 1, width: "100%" }} />
                <Typography sx={{ textAlign: "center" }}>{message?.body.match(/TEL[^:]*:(.+)/)?.[1] ?? "Telefone"}</Typography>
            </Box>
        </Box>
    )
}