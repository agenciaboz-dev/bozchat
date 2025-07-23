import React, { useEffect, useMemo, useState } from "react"
import { Avatar, Box, Chip, IconButton, Typography } from "@mui/material"
import { Subroute } from "../../Nagazap/Subroute"
import { Bot, PausedInteraction } from "../../../types/server/class/Bot/Bot"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { PlayArrow, Refresh, Replay } from "@mui/icons-material"
import { useUser } from "../../../hooks/useUser"
import { api } from "../../../api"
import { PausedChatAvatar } from "./PausedChatAvatar"
import { PausedChatName } from "./PausedChatName"
import { numberMask } from "../../../tools/numberMask"

interface PausedChatsListProps {
    bots: Bot[]
    fetchBots: (set_loading?: boolean) => Promise<void>
}

type PausedInteractionRow = PausedInteraction & { bot_id: string; bot_name: string; contact_pic?: string; contact_name?: string }

export const PausedChatsList: React.FC<PausedChatsListProps> = (props) => {
    const { user, company } = useUser()

    const [loading, setLoading] = useState(false)

    const pausedChats = useMemo(() => {
        const pausedChats = new Map<string, PausedInteractionRow>()
        for (const bot of props.bots) {
            bot.paused_chats.forEach((chat) => {
                pausedChats.set(chat.chat_id, { ...chat, bot_id: bot.id, bot_name: bot.name })
            })
        }
        return pausedChats
    }, [props.bots])

    const refetchBots = async () => {
        setLoading(true)
        await props.fetchBots(false)
        setLoading(false)
    }

    const resumeBot = async (bot_id: string, chat_id: string) => {
        const params = { company_id: company?.id, user_id: user?.id, chat_id, bot_id }
        try {
            setLoading(true)
            const response = await api.post("/company/bots/resume", null, { params })
            refetchBots()
        } catch (error) {
            console.log(error)
        } finally {
        }
    }

    const desktopColumns: (GridColDef & { field: keyof PausedInteractionRow | "actions" })[] = [
        {
            field: "contact_pic",
            width: 50,
            align: "center",
            headerName: "",
            sortable: false,
            filterable: false,
            renderCell(params) {
                return <PausedChatAvatar chat_id={params.row.chat_id} />
            },
            display: "flex",
        },
        {
            field: "contact_name",
            headerName: "Contato",
            flex: 0.15,
            display: "flex",
            renderCell(params) {
                return <PausedChatName chat_id={params.row.chat_id} />
            },
        },
        {
            field: "chat_id",
            headerName: "Número",
            flex: 0.1,
            valueFormatter: (value) => numberMask((value as string).split("@")[0], "+99 (99) 9999 - 9999"),
        },
        {
            field: "expiry",
            headerName: "Interrompido até",
            flex: 0.05,
            display: "flex",
            renderCell(params) {
                return (
                    <Chip
                        color={params.value ? "warning" : "error"}
                        label={params.value ? new Date(params.value).toLocaleString("pt-br").replace("-", "") : "Tempo indeterminado"}
                        size="small"
                    />
                )
            },
        },

        {
            field: "actions",
            headerName: "Retomar",
            display: "flex",
            align: "center",
            headerAlign: "center",
            sortable: false,
            renderCell(params) {
                return (
                    <IconButton onClick={() => resumeBot(params.row.bot_id, params.row.chat_id)}>
                        <Replay />
                    </IconButton>
                )
            },
        },
    ]

    useEffect(() => {
        console.log(pausedChats)
    }, [pausedChats])

    return (
        <Subroute
            title="Conversas interrompidas"
            right={
                <IconButton onClick={refetchBots}>
                    <Refresh />
                </IconButton>
            }
        >
            <DataGrid
                loading={loading}
                rows={Array.from(pausedChats.values())}
                getRowId={(row) => row.chat_id}
                columns={desktopColumns}
                initialState={{
                    pagination: { paginationModel: { page: 0, pageSize: 10 } },
                    sorting: { sortModel: [{ field: "expiry", sort: "desc" }] },
                }}
                pageSizeOptions={[10, 20, 50]}
                sx={{ border: 0 }}
                rowHeight={65}
                showToolbar
                // hideFooterPagination
                // autoPageSize
                density="compact"
            />
        </Subroute>
    )
}
