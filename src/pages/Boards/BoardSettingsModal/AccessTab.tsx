import React, { useEffect, useState } from "react"
import { Autocomplete, Box, TextField } from "@mui/material"
import { WithoutFunctions } from "../../../types/server/class/helpers"
import { Board, BoardAccess } from "../../../types/server/class/Board/Board"
import { useFetchedData } from "../../../hooks/useFetchedData"
import { User } from "../../../types/server/class/User"
import { Department } from "../../../types/server/class/Department"
import { useApi } from "../../../hooks/useApi"

interface AccessTabProps {
    board: WithoutFunctions<Board>
    boardChanges: Partial<Board>
    setBoardChanges: React.Dispatch<React.SetStateAction<Partial<Board>>>
    access: BoardAccess
    setAccess: React.Dispatch<React.SetStateAction<BoardAccess>>
}

export const AccessTab: React.FC<AccessTabProps> = (props) => {
    const api = useApi()

    const [users] = useFetchedData<User>("users")
    const [departments] = useFetchedData<Department>("departments")

    const handleAccessChange = (type: keyof typeof props.access, value: any[]) => {
        console.log({ type, value })
        props.setAccess((access) => {
            return { ...access, [type]: value }
        })
    }

    useEffect(() => {
        api.fetchBoardsAccess({ params: { board_id: props.board.id } }).then((result) => props.setAccess(result))
    }, [])

    return (
        <Box sx={{ flexDirection: "column", gap: "1vw" }}>
            <TextField
                label="Nome do quadro"
                value={props.boardChanges.name}
                onChange={(ev) => props.setBoardChanges((board) => ({ ...board, name: ev.target.value }))}
            />

            <Autocomplete
                fullWidth
                options={users}
                renderInput={(params) => <TextField {...params} label="Usuários" />}
                getOptionKey={(option) => option.id}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                multiple
                value={props.access.users}
                onChange={(_, value) => handleAccessChange("users", value)}
                ChipProps={{ size: "small", color: "primary" }}
                ListboxProps={{ sx: { width: "100%", bgcolor: "background.default" } }}
                disableCloseOnSelect
            />
            <Autocomplete
                fullWidth
                options={departments}
                renderInput={(params) => <TextField {...params} label="Setores" />}
                getOptionKey={(option) => option.id}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                multiple
                value={props.access.departments}
                onChange={(_, value) => handleAccessChange("departments", value)}
                ChipProps={{ size: "small", color: "primary" }}
                ListboxProps={{ sx: { width: "100%", bgcolor: "background.default" } }}
                disableCloseOnSelect
            />
        </Box>
    )
}
