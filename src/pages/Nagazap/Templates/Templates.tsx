import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { AlertColor, Box, Chip, CircularProgress, IconButton, Menu, MenuItem, Paper } from "@mui/material"
import { NagaTemplate, Nagazap } from "../../../types/server/class/Nagazap"
import { Subroute } from "../Subroute"
import { TemplateInfo, TemplateStatus } from "../../../types/server/Meta/WhatsappBusiness/TemplatesInfo"
import { api } from "../../../api"
import { useUser } from "../../../hooks/useUser"
import {
    Add,
    ArrowBack,
    Check,
    CopyAll,
    Delete,
    Download,
    Edit,
    Error,
    HourglassFull,
    MoreHoriz,
    Refresh,
    Send,
    WatchLater,
} from "@mui/icons-material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useClipboard, useMediaQuery } from "@mantine/hooks"
import { useSnackbar } from "burgos-snackbar"
import { TemplateModal } from "./TemplateModal"
import { useIo } from "../../../hooks/useIo"
import { useNavigate } from "react-router-dom"
import { DownloadTemplateSheetModal } from "./DownloadTemplateSheetModal"
import { useConfirmDialog } from "burgos-confirm"

interface TemplatesProps {
    nagazap: Nagazap
    setShowInformations: Dispatch<SetStateAction<boolean>>
}

const status_options: { [key: string]: { label: string; color: AlertColor; icon: typeof Check } } = {
    APPROVED: { label: "aprovado", color: "success", icon: Check },
    PENDING: { label: "pendente", color: "warning", icon: WatchLater },
    REJECTED: { label: "rejeitado", color: "error", icon: Error },
    PAUSED: { label: "pausado", color: "warning", icon: HourglassFull },
}

const category_options = {
    MARKETING: "Marketing",
    UTILITY: "Utilidade",
    AUTHENTICATION: "Autenticação",
}

export const Templates: React.FC<TemplatesProps> = ({ nagazap, setShowInformations }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const io = useIo()
    const { user } = useUser()
    const clipboard = useClipboard({ timeout: 1000 })
    const { snackbar } = useSnackbar()
    const { confirm } = useConfirmDialog()
    const navigate = useNavigate()

    const [templates, setTemplates] = useState<NagaTemplate[]>([])
    const [loading, setLoading] = useState(true)
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
    const [selectedTemplate, setSelectedTemplate] = useState<NagaTemplate | null>(null)
    const [openTemplateModal, setOpenTemplateModal] = useState(false)
    const [openDownloadModal, setOpenDownloadModal] = useState(false)
    const [editingTemplate, setEditingTemplate] = useState<NagaTemplate | null>(null)

    const can_edit = useMemo(
        () =>
            !selectedTemplate
                ? false
                : selectedTemplate.info.status === "REJECTED"
                ? true
                : selectedTemplate.info.status === "PENDING"
                ? false
                : selectedTemplate.last_update !== selectedTemplate.created_at
                ? true
                : new Date().getTime() - selectedTemplate.last_update > 24 * 60 * 60 * 1000,
        [selectedTemplate]
    )

    const mescled_templates = useMemo(() => templates.map((template) => ({ ...template, ...template.info })), [templates])

    const columns: (GridColDef & { field: keyof (TemplateInfo & NagaTemplate) })[] = [
        {
            field: "status",
            headerName: "Situação",
            renderCell: (cell) => {
                if (!cell.value) return "erro"
                const option = status_options[cell.value]
                const Icon = option.icon
                return <Chip label={option.label} color={option.color} size="small" />
            },
            minWidth: isMobile ? 150 : undefined,
        },
        {
            field: "created_at",
            headerName: "Criado em",
            flex: 0.1,
            renderCell: (cell) => {
                const date = new Date(cell.value)
                return date.toLocaleString("pt-br")
            },
            minWidth: isMobile ? 200 : undefined,
        },
        {
            field: "last_update",
            headerName: "Última edição",
            flex: 0.1,
            renderCell: (cell) => {
                const date = new Date(cell.value)
                return date.toLocaleString("pt-br")
            },
            minWidth: isMobile ? 200 : undefined,
        },
        { field: "name", headerName: "Nome", flex: 0.28, minWidth: isMobile ? 250 : undefined },

        {
            field: "category",
            headerName: "Categoria",
            flex: 0.07,
            valueFormatter(value) {
                return category_options[value]
            },
            minWidth: isMobile ? 150 : undefined,
        },
        { field: "sent", headerName: "Envios", flex: 0.05, minWidth: isMobile ? 120 : undefined },

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
            minWidth: isMobile ? 120 : undefined,
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
        navigate("/broadcast/message-form", { state: { template: selectedTemplate } })
    }

    const editTemplate = () => {
        setMenuAnchor(null)
        setEditingTemplate(selectedTemplate)
    }

    const deleteTemplate = () => {
        confirm({
            title: "Deletar template",
            content: "Esta ação é permanente e irreversível. Deseja continuar?",
            onConfirm: async () => {
                if (loading || !selectedTemplate) return
                setLoading(true)
                setMenuAnchor(null)

                try {
                    const response = await api.delete("/nagazap/template", {
                        params: { nagazap_id: nagazap.id, user_id: user?.id, template_id: selectedTemplate.id },
                    })
                    setTemplates((list) => list.filter((item) => item.id !== selectedTemplate.id))
                    setSelectedTemplate(null)
                    snackbar({ severity: "warning", text: "Template deletado" })
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            },
        })
    }

    useEffect(() => {
        fetchTemplates()
    }, [nagazap])

    useEffect(() => {
        io.on("template:update", (updated_template: { id: string; status: TemplateStatus }) => {
            console.log(updated_template)
            const index = templates.findIndex((item) => item.id === updated_template.id)
            if (index !== -1) {
                setTemplates((list) => {
                    const updated_templates = [...list]
                    updated_templates[index].info.status = updated_template.status
                    return updated_templates
                })
            }
        })

        return () => {
            io.off("template:update")
        }
    }, [templates])

    useEffect(() => {
        if (!openTemplateModal) {
            setEditingTemplate(null)
        }
    }, [openTemplateModal])

    useEffect(() => {
        if (editingTemplate) {
            setOpenTemplateModal(true)
        }
    }, [editingTemplate])

    return (
        <Subroute
            title="Templates"
            right={
                <Box sx={{ gap: "0.5vw" }}>
                    <IconButton
                        onClick={() => {
                            setSelectedTemplate(null)
                            setOpenTemplateModal(true)
                        }}
                    >
                        <Add />
                    </IconButton>
                    <IconButton onClick={fetchTemplates}>{loading ? <CircularProgress size={"1.5rem"} color="secondary" /> : <Refresh />}</IconButton>
                </Box>
            }
            left={
                isMobile ? (
                    <IconButton
                        onClick={() => {
                            setShowInformations(false)
                        }}
                    >
                        <ArrowBack />
                    </IconButton>
                ) : null
            }
        >
            <Paper sx={{ flex: 1 }}>
                <DataGrid
                    loading={loading}
                    rows={mescled_templates}
                    columns={columns}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: "last_update", sort: "desc" }],
                        },
                        pagination: { paginationModel: { page: 0, pageSize: 10 } },
                    }}
                    pageSizeOptions={[10, 20, 50, 100]}
                    sx={{ border: 0, height: isMobile ? "100%" : "61vh" }}
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
                    <MenuItem onClick={editTemplate} disabled={!can_edit}>
                        <Edit /> Editar
                    </MenuItem>
                    <MenuItem onClick={deleteTemplate}>
                        <Delete /> Deletar
                    </MenuItem>
                </Menu>
            </Paper>

            <TemplateModal
                nagazap={nagazap}
                onClose={() => setOpenTemplateModal(false)}
                open={openTemplateModal}
                onSubmit={onSubmitTemplate}
                currentTemplate={editingTemplate}
            />
            <DownloadTemplateSheetModal
                nagazap={nagazap}
                onClose={() => setOpenDownloadModal(false)}
                open={openDownloadModal}
                template={selectedTemplate}
            />
        </Subroute>
    )
}
