import React, { useEffect, useState } from "react"
import { Box } from "@mui/material"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { GeneralStat } from "../../../types/GeneralStat"
import { AlarmOnSharp, Block, Check, Close, DocumentScanner, PendingActions } from "@mui/icons-material"
import { GeneralStatsList } from "../../Home/GeneralStatsList"
import { TemplateInfo } from "../../../types/server/Meta/WhatsappBusiness/TemplatesInfo"
import { api } from "../../../api"

interface GeneralStatisticsProps {
    nagazap: Nagazap
}

export const GeneralStatistics: React.FC<GeneralStatisticsProps> = ({ nagazap }) => {
    const [templates, setTemplates] = useState<TemplateInfo[]>()

    const generalStatistics: GeneralStat[] = [
        {
            title: "Templates Aprovados",
            icon: DocumentScanner,
            value: templates?.filter((template) => template.status === "APPROVED").length,
            loading: templates === undefined,
        },
        {
            title: "Templates Pendentes",
            icon: PendingActions,
            value: templates?.filter((template) => template.status === "PENDING").length,
            loading: templates === undefined,
        },
        { title: "Mensagens enviadas com sucesso", icon: Check, value: nagazap.sentMessages.length },
        { title: "Mensagens não enviadas", icon: Close, value: nagazap.failedMessages.length },
        { title: "Mensagens no forno", icon: AlarmOnSharp, value: nagazap.stack.length },
        { title: "Números na lista negra", icon: Block, value: nagazap.blacklist.length },
    ]

    const fetchTemplates = async () => {
        try {
            const response = await api.get("/nagazap/templates", { params: { nagazap_id: nagazap.id } })
            setTemplates(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setTemplates(undefined)
        fetchTemplates()
    }, [nagazap])

    return (
        <Box sx={{ flex: 1 }}>
            <GeneralStatsList list={generalStatistics} />
        </Box>
    )
}
