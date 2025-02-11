import React, { useEffect, useState } from "react"
import { Box, useMediaQuery } from "@mui/material"
import { backgroundStyle } from "../../style/background"
import { Header } from "../../components/Header"
import { UsersStats } from "./UsersStats"
import { User } from "../../types/server/class/User"
import { useUser } from "../../hooks/useUser"
import { api } from "../../api"
import { UserForm } from "./UserForm"

interface UsersProps {}

export const Users: React.FC<UsersProps> = ({}) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { company, user } = useUser()

    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)

    const addOrReplaceUser = (user: User) => setUsers((list) => [...list.filter((item) => item.id !== user.id), user])
    const removeUser = (user: User) => setUsers((list) => list.filter((item) => item.id !== user.id))

    const fetchUsers = async () => {
        if (loading || !company) return

        setLoading(true)

        try {
            const response = await api.get("/company/users", { params: { company_id: company.id } })
            setUsers(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <Box sx={{ ...backgroundStyle, overflow: "auto" }}>
            <Header />
            <Box
                sx={{
                    flex: 1,
                    gap: "2vw",
                    padding: "2vw",
                    flexDirection: isMobile ? "column" : "row",
                }}
            >
                <UsersStats users={users} fetchUsers={fetchUsers} fetching={loading} />
                {user?.admin && (
                    <UserForm
                        users={users.sort((a, b) => a.name.localeCompare(b.name))}
                        loading={loading}
                        onSubmit={addOrReplaceUser}
                        onDelete={removeUser}
                    />
                )}
            </Box>
        </Box>
    )
}
