import React, { useState } from "react"
import { Avatar, Box, CircularProgress, Dialog, IconButton, Typography, useMediaQuery } from "@mui/material"
import { Board } from "../../types/server/class/Board/Board"
import { WithoutFunctions } from "../../types/server/class/helpers"
import { Title2 } from "../../components/Title"
import { useQuery } from "@tanstack/react-query"
import { Chat } from "../../types/server/class/Board/Chat"
import { api } from "../../api"
import { useUser } from "../../hooks/useUser"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { Close, Refresh, Restore } from "@mui/icons-material"
import { numberMask } from "../../tools/numberMask"

interface ArchivedChatsProps {
    board: WithoutFunctions<Board>
    open: boolean
    handleClose: () => void
    onRestoreChat: (board: Board) => void
}

export const ArchivedChats: React.FC<ArchivedChatsProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const [loading, setLoading] = useState(false)

    const { user, company } = useUser()
    const { data, isFetching, refetch } = useQuery<Chat[]>({
        initialData: [],
        queryKey: ["archivedChats", props.board.id, props.open],
        queryFn: async () =>
            (await api.get("/company/boards/archive", { params: { user_id: user?.id, company_id: company?.id, board_id: props.board.id } })).data,
        refetchOnWindowFocus: false,
    })

    const restoreChat = async (chat_id: string) => {
        setLoading(true)

        try {
            const response = await api.post(
                "/company/boards/archive/restore",
                { chat_id },
                { params: { user_id: user?.id, company_id: company?.id, board_id: props.board.id } }
            )
            await refetch()
            props.onRestoreChat(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const desktopColumns: (GridColDef & { field: keyof Chat | "actions" })[] = [
        {
            field: "profile_pic",
            width: 50,
            align: "center",
            headerName: "",
            sortable: false,
            renderCell(params) {
                return (
                    <Avatar src={params.value || undefined} sx={{ width: 1, height: 30, bgcolor: "background.default", color: "primary.main" }}>
                        {/* <BrokenImage sx={{ width: 1, height: 1 }} /> */}
                    </Avatar>
                )
            },
            display: "flex",
        },
        {
            field: "last_message",
            headerName: "Data e Hora",
            valueFormatter: (_, row) => Number((row as Chat).last_message.timestamp),
            sortComparator: (a, b) => Number(a.last_message?.timestamp) - Number(b.last_message?.timestamp),
            flex: 0.13,
            display: "flex",
            renderCell(params) {
                return (
                    <Typography variant="subtitle2" sx={{ textWrap: "wrap" }}>
                        {new Date(Number((params.row as Chat).last_message.timestamp) * 1000).toLocaleString("pt-br").replace("-", "")}
                    </Typography>
                )
            },
            minWidth: isMobile ? 200 : undefined,
        },
        {
            field: "name",
            headerName: "Nome",
            flex: 0.2,
            display: "flex",
            renderCell(params) {
                return (
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", textWrap: "wrap" }}>
                        {params.value}
                    </Typography>
                )
            },
            minWidth: isMobile ? 200 : undefined,
        },
        {
            field: "phone",
            headerName: "Número",
            flex: 0.2,
            display: "flex",
            renderCell(params) {
                return (
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", textWrap: "wrap" }}>
                        {numberMask(params.value, "(99) 9999 - 9999")}
                    </Typography>
                )
            },
            minWidth: isMobile ? 200 : undefined,
        },
        {
            field: "actions",
            headerName: "Restaurar",
            display: "flex",
            align: "center",
            headerAlign: "center",
            sortable: false,
            renderCell(params) {
                return (
                    <IconButton onClick={() => restoreChat(params.row.id)}>
                        <Restore />
                    </IconButton>
                )
            },
            minWidth: isMobile ? 150 : undefined,
        },
    ]

    return (
        <Dialog open={props.open} onClose={props.handleClose} PaperProps={{ sx: { maxWidth: "90vw" } }}>
            <Box
                sx={{
                    padding: isMobile ? "5vw" : "1.5vw",
                    bgcolor: "background.default",
                    flexDirection: "column",
                    width: isMobile ? "90vw" : "70vw",
                }}
            >
                <Title2
                    name="Conversas arquivadas"
                    right={
                        <Box>
                            <IconButton onClick={() => refetch()} size="small">
                                {isFetching ? <CircularProgress size={"1rem"} /> : <Refresh fontSize="small" />}
                            </IconButton>
                            <IconButton onClick={props.handleClose} size="small">
                                <Close fontSize="small" />
                            </IconButton>
                        </Box>
                    }
                />
                <DataGrid
                    loading={isFetching || loading}
                    rows={data}
                    columns={desktopColumns}
                    initialState={{
                        pagination: { paginationModel: { page: 0, pageSize: 10 } },
                        sorting: { sortModel: [{ field: "last_message", sort: "desc" }] },
                    }}
                    pageSizeOptions={[10, 20, 50]}
                    sx={{ border: 0 }}
                    rowHeight={65}
                    // showToolbar
                    // hideFooterPagination
                    // autoPageSize
                    density="compact"
                />
            </Box>
        </Dialog>
    )
}
