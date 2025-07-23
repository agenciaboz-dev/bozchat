import React, { useEffect, useState } from "react"
import { Box, Skeleton, Typography } from "@mui/material"
import { api } from "../../../api"
import { useUser } from "../../../hooks/useUser"

interface PausedChatNameProps {
    chat_id: string
}

export const PausedChatName: React.FC<PausedChatNameProps> = (props) => {
    const { company } = useUser()
    const [name, setName] = useState<string | null>(null)

    const fetchContactInfo = async () => {
        try {
            const response = await api.get("/company/bots/contact-info", { params: { chat_id: props.chat_id, company_id: company?.id } })
            setName(response.data.pushname)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchContactInfo()
    }, [])

    return name === null ? (
        <Skeleton variant="rounded" animation="wave" width={200} />
    ) : (
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", textWrap: "wrap" }}>
            {name}
        </Typography>
    )
}
