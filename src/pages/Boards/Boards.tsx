import React, { useEffect, useState } from 'react'
import {Box, CircularProgress, Dialog, IconButton, Typography} from '@mui/material'
import { useUser } from '../../hooks/useUser'
import { useConfirmDialog } from 'burgos-confirm'
import { Department } from '../../types/server/class/Department'
import { Board } from '../../types/server/class/Board/Board'
import { User } from '../../types/server/class/User'
import { api } from '../../api'
import { backgroundStyle } from '../../style/background'
import { Header } from '../../components/Header/Header'
import { Title2 } from '../../components/Title'
import { Add, Close, Replay } from '@mui/icons-material'
import { BoardsTable } from './BoardsTable'
import { BoardFormComponent } from './BoardForm'

interface BoardsProps {
    
}

export const Boards:React.FC<BoardsProps> = ({  }) => {
    const { company, user } = useUser()
    const { confirm } = useConfirmDialog()

    const [boards, setBoards] = useState<Board[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [showBoardForm, setShowBoardForm] = useState(false)

    const addOrReplaceBoard = (board: Board) =>
        setBoards((list) => [...list.filter((item) => item.id !== board.id), board])

    const removeBoard = (board: Board) => setBoards((list) => list.filter((item) => item.id !== board.id))

    const fetchData = async () => {
        if (loading || !company) return
        setLoading(true)

        try {
            // await fetchUsers()
            await fetchBoards()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const fetchBoards = async () => {
        const response = await api.get("/company/boards", { params: { company_id: company?.id, user_id: user?.id } })
        setBoards(response.data)
    }

    const fetchUsers = async () => {
        const response = await api.get("/company/users", { params: { company_id: company?.id } })
        setUsers(response.data)
    }

    const updateBoards = async (data: Partial<Board> & { id: string }) => {
        console.log(data)
        try {
            const response = await api.patch("/company/boards", data, {
                params: { user_id: user?.id, company_id: company?.id, board_id: data.id },
            })
            addOrReplaceBoard(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteBoard = (data: Board) => {
        if (loading) return

        confirm({
            title: "Deletar quadro",
            content: "Tem certeza que deseja deletar esse quadro? Esta ação é permanente e irreversível",
            onConfirm: async () => {
                setLoading(true)

                try {
                    const response = await api.delete("/company/boards", {
                        params: { user_id: user?.id, board_id: data.id, company_id: company?.id },
                    })
                    removeBoard(response.data)
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
                    name="Quadros"
                    right={
                        <Box sx={{ gap: "0.5vw" }}>
                            <IconButton onClick={() => setShowBoardForm(true)}>
                                <Add />
                            </IconButton>
                            <IconButton onClick={fetchData}>
                                {loading ? <CircularProgress size="1.5rem" color="secondary" /> : <Replay />}
                            </IconButton>
                        </Box>
                    }
                />
                <BoardsTable
                    loading={loading}
                    boards={boards}
                    users={users}
                    onDeleteBoard={deleteBoard}
                    updateBoard={updateBoards}
                />
            </Box>

            <Dialog
                open={showBoardForm}
                keepMounted
                onClose={() => setShowBoardForm(false)}
                PaperProps={{ sx: { bgcolor: "background.default", width: "40vw" }, elevation: 2 }}
            >
                <Box sx={{ padding: "1vw", paddingBottom: 0, justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontWeight: "bold" }}>Novo quadro</Typography>
                    <IconButton onClick={() => setShowBoardForm(false)}>
                        <Close />
                    </IconButton>
                </Box>
                <BoardFormComponent
                    users={users}
                    onSubmit={(board) => {
                        addOrReplaceBoard(board)
                        setShowBoardForm(false)
                    }}
                />
            </Dialog>
        </Box>
    )
}