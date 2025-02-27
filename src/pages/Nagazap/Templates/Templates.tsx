import React, { useEffect, useMemo, useState } from "react"
import { Box, Chip, CircularProgress, IconButton, Menu, MenuItem, Paper } from "@mui/material"
import { NagaTemplate, Nagazap } from "../../../types/server/class/Nagazap"
import { Subroute } from "../Subroute"
import { TemplateInfo, TemplateUpdateHook } from "../../../types/server/Meta/WhatsappBusiness/TemplatesInfo"
import { api } from "../../../api"
import { useUser } from "../../../hooks/useUser"
import { Add, Check, CopyAll, Delete, Download, Edit, Error, HourglassFull, MoreHoriz, Refresh, Send, WatchLater } from "@mui/icons-material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useClipboard } from "@mantine/hooks"
import { useSnackbar } from "burgos-snackbar"
import { MuiColor } from "../../../types/server/class/Log"
import { TemplatePreview } from "../TemplateForm/TemplatePreview"
import { TemplateModal } from "./TemplateModal"
import { useIo } from "../../../hooks/useIo"
import { useNavigate } from "react-router-dom"
import { DownloadTemplateSheetModal } from "./DownloadTemplateSheetModal"

interface TemplatesProps {
    nagazap: Nagazap
}

const status_options: { [key: string]: { label: string; color: MuiColor; icon: typeof Check } } = {
    APPROVED: { label: "aprovado", color: "success", icon: Check },
    PENDING: { label: "pendente", color: "warning", icon: WatchLater },
    REJECTED: { label: "rejeitado", color: "error", icon: Error },
    PAUSED: { label: "pausado", color: "warning", icon: HourglassFull },
}

export const Templates: React.FC<TemplatesProps> = ({ nagazap }) => {
    const io = useIo()
    const { user } = useUser()
    const clipboard = useClipboard({ timeout: 1000 })
    const { snackbar } = useSnackbar()
    const navigate = useNavigate()

    const [templates, setTemplates] = useState<NagaTemplate[]>([])
    const [loading, setLoading] = useState(true)
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
    const [selectedTemplate, setSelectedTemplate] = useState<NagaTemplate | null>(null)
    const [openTemplateModal, setOpenTemplateModal] = useState(false)
    const [openDownloadModal, setOpenDownloadModal] = useState(false)

    const mescled_templates = useMemo(() => templates.map((template) => ({ ...template, ...template.info })), [templates])

    const columns: (GridColDef & { field: keyof (TemplateInfo & NagaTemplate) })[] = [
        {
            field: "status",
            headerName: "Situação",
            renderCell: (cell) => {
                const option = status_options[cell.value]
                const Icon = option.icon
                return <Chip label={option.label} color={option.color} size="small" />
            },
        },
        {
            field: "created_at",
            headerName: "Data",
            flex: 0.1,
            renderCell: (cell) => {
                const date = new Date(cell.value)
                return date.toLocaleString("pt-br")
            },
        },
        { field: "name", headerName: "Nome", flex: 0.3 },

        { field: "category", headerName: "Categoria", flex: 0.1 },
        { field: "sent", headerName: "Envios", flex: 0.05 },

        {
            field: "id",
            headerName: "Ações",
            renderCell: (cell) => {
                return (
                    <IconButton onClick={(ev) => setMenuAnchor(ev.currentTarget)}>
                        <MoreHoriz />
                    </IconButton>
                )
            },
            align: "center",
            sortable: false,
            filterable: false,
        },
    ]

    const copyId = () => {
        clipboard.copy(selectedTemplate?.id)
        snackbar({ severity: "success", text: "copiado" })
        setMenuAnchor(null)
    }

    const fetchTemplates = async () => {
        setLoading(true)
        try {
            const response = await api.get("/nagazap/templates", { params: { nagazap_id: nagazap.id, user_id: user?.id } })
            setTemplates(response.data)
            setSelectedTemplate(response.data[0])
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const onSubmitTemplate = () => {
        setOpenTemplateModal(false)
        fetchTemplates()
    }

    const downloadTemplateSheet = async () => {
        setMenuAnchor(null)
        setOpenDownloadModal(true)
    }

    const sendThisTemplate = () => {
        if (!selectedTemplate) return
        setMenuAnchor(null)
        navigate("/nagazap/message-form", { state: { template: selectedTemplate } })
    }

    useEffect(() => {
        fetchTemplates()
    }, [nagazap])

    useEffect(() => {
        console.log(selectedTemplate)
    }, [selectedTemplate])

    useEffect(() => {
        io.on("template:update", (updated_template: TemplateUpdateHook) => {
            const index = templates.findIndex((item) => item.id === updated_template.message_template_id.toString())
            if (index !== -1) {
                const updated_templates = [...templates]
                const template = updated_templates[index]
                template.info.status = updated_template.event
                setTemplates(updated_templates)
            }
        })

        return () => {
            io.off("template:update")
        }
    }, [templates])

    return (
        <Subroute
            title="Templates"
            right={
                <Box sx={{ gap: "0.5vw" }}>
                    <IconButton onClick={() => setOpenTemplateModal(true)}>
                        <Add />
                    </IconButton>
                    <IconButton onClick={fetchTemplates}>{loading ? <CircularProgress size={"1.5rem"} color="secondary" /> : <Refresh />}</IconButton>
                </Box>
            }
        >
            <Box sx={{ gap: "1vw" }}>
                <Paper sx={{ flex: 1 }}>
                    <DataGrid
                        loading={loading}
                        rows={mescled_templates}
                        columns={columns}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: "created_at", sort: "desc" }],
                            },
                            pagination: { paginationModel: { page: 0, pageSize: 10 } },
                        }}
                        pageSizeOptions={[10, 20, 50, 100]}
                        sx={{ border: 0, height: "61vh" }}
                        onRowSelectionModelChange={(params) => {
                            if (params.length === 0) return
                            console.log(params[0])
                            const selected_template = templates.find((template) => template.id === params[0])
                            if (selected_template) {
                                setSelectedTemplate(selected_template)
                            }
                        }}
                    />

                    <Menu
                        open={!!menuAnchor}
                        anchorEl={menuAnchor}
                        onClose={() => setMenuAnchor(null)}
                        MenuListProps={{
                            sx: {
                                ".MuiButtonBase-root": {
                                    gap: "0.5vw",
                                },
                            },
                        }}
                    >
                        <MenuItem onClick={copyId}>
                            <CopyAll />
                            Copiar ID
                        </MenuItem>
                        <MenuItem disabled={selectedTemplate?.info.status !== "APPROVED"} onClick={sendThisTemplate}>
                            <Send />
                            Preparar envio
                        </MenuItem>
                        <MenuItem onClick={downloadTemplateSheet}>
                            <Download />
                            Baixar modelo de planilha
                        </MenuItem>
                        <MenuItem disabled>
                            <Edit /> Editar
                        </MenuItem>
                        <MenuItem disabled>
                            <Delete /> Deletar
                        </MenuItem>
                    </Menu>
                </Paper>
            </Box>

            <TemplateModal nagazap={nagazap} onClose={() => setOpenTemplateModal(false)} open={openTemplateModal} onSubmit={onSubmitTemplate} />
            <DownloadTemplateSheetModal
                nagazap={nagazap}
                onClose={() => setOpenDownloadModal(false)}
                open={openDownloadModal}
                template={selectedTemplate}
            />
        </Subroute>
    )
}
