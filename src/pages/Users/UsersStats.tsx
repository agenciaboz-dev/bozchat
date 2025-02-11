import React from "react"
import { Box, CircularProgress, IconButton } from "@mui/material"
import { GeneralStat } from "../../types/GeneralStat"
import { Groups, MilitaryTech, PersonOff, Replay } from "@mui/icons-material"
import { Title2 } from "../../components/Title"
import { GeneralStatsList } from "../Home/GeneralStatsList"
import { User } from "../../types/server/class/User"

interface UsersStatsProps {
    users: User[]
    fetching?: boolean
    fetchUsers: () => void
}

export const UsersStats: React.FC<UsersStatsProps> = (props) => {
    const list: GeneralStat[] = [
        { title: "Total de usuários", icon: Groups, value: props.users.length, loading: props.fetching },
        { title: "Administradores", icon: MilitaryTech, value: props.users.filter((user) => user.admin).length, loading: props.fetching },
        { title: "Usuários inativos", icon: PersonOff, value: props.users.filter((user) => !user.active).length, loading: props.fetching },
    ]

    return (
        <Box sx={{ flexDirection: "column", flex: 1, gap: "1vw" }}>
            <Title2
                name="Usuários"
                right={
                    <IconButton onClick={props.fetchUsers}>
                        {props.fetching ? <CircularProgress size="1.5rem" color="secondary" /> : <Replay />}
                    </IconButton>
                }
            />

            <GeneralStatsList list={list} />
        </Box>
    )
}
