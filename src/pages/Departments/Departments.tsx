import React, { useEffect, useState } from "react"
import { Box, CircularProgress, Dialog, IconButton, Typography } from "@mui/material"
import { backgroundStyle } from "../../style/background"
import { Header } from "../../components/Header/Header"
import { useUser } from "../../hooks/useUser"
import { useConfirmDialog } from "burgos-confirm"
import { Department } from "../../types/server/class/Department"
import { api } from "../../api"
import { Title2 } from "../../components/Title"
import { Add, Close, Replay } from "@mui/icons-material"
import { DepartmentsTable } from "./DepartmentsTable"
import { DepartmentFormComponent } from "./DepartmentForm"
import { User } from "../../types/server/class/User"

interface DepartmentsProps {}

export const Departments: React.FC<DepartmentsProps> = ({}) => {
    const { company, user } = useUser()
    const { confirm } = useConfirmDialog()

    const [departments, setDepartments] = useState<Department[]>(company?.departments || [])
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [showDepartmentForm, setShowDepartmentForm] = useState(false)

    const addOrReplaceDepartment = (department: Department) =>
        setDepartments((list) => [...list.filter((item) => item.id !== department.id), department])
    const removeDepartment = (department: Department) => setDepartments((list) => list.filter((item) => item.id !== department.id))

    const fetchData = async () => {
        if (loading || !company) return
        setLoading(true)

        try {
            await fetchUsers()
            await fetchDepartments()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const fetchDepartments = async () => {
        const response = await api.get("/company/departments", { params: { company_id: company?.id } })
        setDepartments(response.data)
    }

    const fetchUsers = async () => {
        const response = await api.get("/company/users", { params: { company_id: company?.id } })
        setUsers(response.data)
    }

    const updateDepartment = async (data: Partial<Department> & { id: string }) => {
        console.log(data)
        try {
            const response = await api.patch("/company/departments", data, {
                params: { user_id: user?.id, company_id: company?.id, department_id: data.id },
            })
            addOrReplaceDepartment(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteDepartment = (data: Department) => {
        if (loading) return

        confirm({
            title: "Deletar setor",
            content: "Tem certeza que deseja deletar esse setor? Esta ação é permanente e irreversível",
            onConfirm: async () => {
                setLoading(true)

                try {
                    const response = await api.delete("/company/departments", {
                        params: { user_id: user?.id, department_id: data.id, company_id: company?.id },
                    })
                    removeDepartment(response.data)
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            },
        })
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <Box sx={{ ...backgroundStyle, overflow: "auto" }}>
            <Header />
            <Box sx={{ flexDirection: "column", flex: 1, gap: "1vw", padding: "2vw" }}>
                <Title2
                    name="Setores"
                    right={
                        <Box sx={{ gap: "0.5vw" }}>
                            <IconButton onClick={() => setShowDepartmentForm(true)}>
                                <Add />
                            </IconButton>
                            <IconButton onClick={fetchDepartments}>
                                {loading ? <CircularProgress size="1.5rem" color="secondary" /> : <Replay />}
                            </IconButton>
                        </Box>
                    }
                />
                <DepartmentsTable
                    loading={loading}
                    departments={departments}
                    users={users}
                    onDeleteDepartment={deleteDepartment}
                    updateDepartment={updateDepartment}
                />
            </Box>

            <Dialog
                open={showDepartmentForm}
                keepMounted
                onClose={() => setShowDepartmentForm(false)}
                PaperProps={{ sx: { bgcolor: "background.default", width: "40vw" }, elevation: 2 }}
            >
                <Box sx={{ padding: "1vw", paddingBottom: 0, justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontWeight: "bold" }}>Adicionar setor</Typography>
                    <IconButton onClick={() => setShowDepartmentForm(false)}>
                        <Close />
                    </IconButton>
                </Box>
                <DepartmentFormComponent
                    users={users}
                    onSubmit={(department) => {
                        addOrReplaceDepartment(department)
                        setShowDepartmentForm(false)
                    }}
                />
            </Dialog>
        </Box>
    )
}
