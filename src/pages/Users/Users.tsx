import React, { useEffect, useState } from "react"
import { Box, CircularProgress, Dialog, IconButton, Typography, useMediaQuery } from "@mui/material"
import { backgroundStyle } from "../../style/background"
import { Header } from "../../components/Header/Header"
import { UsersStats } from "./UsersStats"
import { User } from "../../types/server/class/User"
import { useUser } from "../../hooks/useUser"
import { api } from "../../api"
import { UserForm } from "./UserForm"
import { UsersTable } from "./UsersTable"
import { Title2 } from "../../components/Title"
import { Add, Close, Replay } from "@mui/icons-material"
import { useConfirmDialog } from "burgos-confirm"
import { Department } from "../../types/server/class/Department"

interface UsersProps {}

export const Users: React.FC<UsersProps> = ({}) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { company, user } = useUser()
    const { confirm } = useConfirmDialog()

    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [showUserForm, setShowUserForm] = useState(false)
    const [departments, setDepartments] = useState<Department[]>([])

    const addOrReplaceUser = (user: User) => setUsers((list) => [...list.filter((item) => item.id !== user.id), user])
    const removeUser = (user: User) => setUsers((list) => list.filter((item) => item.id !== user.id))

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

    const updateUser = async (data: Partial<User> & { id: string }) => {
        console.log(data)
        try {
            const response = await api.patch("/user", data, { params: { user_id: user?.id, company_id: company?.id } })
            addOrReplaceUser(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteUser = (data: User) => {
        if (loading) return

        confirm({
            title: "Deletar usuário",
            content: "Tem certeza que deseja deletar esse usuário? Esta ação é permanente e irreversível",
            onConfirm: async () => {
                setLoading(true)

                try {
                    const response = await api.delete("/user", { params: { user_id: user?.id, deleted_user_id: data.id } })
                    removeUser(response.data)
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
        <Box sx={{ ...backgroundStyle, overflow: isMobile ? "auto" : "hidden" }}>
            <Header />
            <Box sx={{ flexDirection: "column", flex: 1, gap: "1vw", padding: "2vw" }}>
                <Title2
                    name="Usuários"
                    right={
                        <Box sx={{ gap: "0.5vw" }}>
                            {user?.admin && (
                                <IconButton onClick={() => setShowUserForm(true)}>
                                    <Add />
                                </IconButton>
                            )}
                            <IconButton onClick={fetchUsers}>
                                {loading ? <CircularProgress size="1.5rem" sx={{ color: "text.secondary" }} /> : <Replay />}
                            </IconButton>
                        </Box>
                    }
                />
                <UsersStats users={users} fetchUsers={fetchUsers} fetching={loading} />
                <UsersTable users={users} departments={departments} loading={loading} updateUser={updateUser} onDeleteUser={deleteUser} />
            </Box>

            <Dialog open={showUserForm} keepMounted onClose={() => setShowUserForm(false)} PaperProps={{ sx: { width: "40vw" }, elevation: 2 }}>
                <Box sx={{ bgcolor: "background.default", flexDirection: "column", padding: "1.5vw", gap: "1vw" }}>
                    <Box sx={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ fontWeight: "bold" }}>Adicionar usuário</Typography>
                        <IconButton onClick={() => setShowUserForm(false)}>
                            <Close />
                        </IconButton>
                    </Box>
                    <UserForm
                        onSubmit={(user) => {
                            addOrReplaceUser(user)
                            setShowUserForm(false)
                        }}
                    />
                </Box>
            </Dialog>
        </Box>
    )
}
