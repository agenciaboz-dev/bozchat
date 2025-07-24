import React, { useEffect, useState } from "react"
import { Box, CircularProgress, Dialog, IconButton, Typography, useMediaQuery } from "@mui/material"
import { useUser } from "../../hooks/useUser"
import { useConfirmDialog } from "burgos-confirm"
import { Board } from "../../types/server/class/Board/Board"
import { User } from "../../types/server/class/User"
import { backgroundStyle } from "../../style/background"
import { Header } from "../../components/Header/Header"
import { Title2 } from "../../components/Title"
import { Add, Close, Refresh } from "@mui/icons-material"
import { BoardsTable } from "./BoardsTable"
import { BoardFormComponent } from "./BoardForm"
import { Route, Routes, useNavigate } from "react-router-dom"
import { useApi } from "../../hooks/useApi"
import { api } from "../../api"
import { useFetchedData } from "../../hooks/useFetchedData"
import { BoardSettingsModal } from "./BoardSettingsModal/BoardSettingsModal"
import { BoardPage } from "./Kanban"

interface BoardsProps {}

export const Boards: React.FC<BoardsProps> = ({}) => {
    const isMobile = useMediaQuery("(orientation: portrait)")

    const { company, user, boz } = useUser()
    const { confirm } = useConfirmDialog()
    const navigate = useNavigate()
    const { fetchBoards, loading, setLoading } = useApi()

    const [boards, setBoards] = useFetchedData<Board>("boards")
    const [users, setUsers] = useFetchedData<User>("users")
    const [showBoardForm, setShowBoardForm] = useState(false)
    const [selectedBoard, setSelectedBoard] = useState<Board | null>(null)
    const [showBoardSettings, setShowBoardSettings] = useState(false)

    const addOrReplaceBoard = (board: Board) => setBoards((list) => [...list.filter((item) => item.id !== board.id), board])

    const removeBoard = (board: Board) => setBoards((list) => list.filter((item) => item.id !== board.id))

    const closeBoardSettings = () => {
        setSelectedBoard(null)
        setShowBoardSettings(false)
    }

    const openBoardSettings = (board: Board) => {
        console.log(board)
        setSelectedBoard(board)
        setShowBoardSettings(true)
    }

    const fetchData = async () => {
        setBoards(await fetchBoards({ params: { all: boz && user?.admin ? true : undefined } }))
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

    const navigateBack = () => {
        setLoading(false)
        fetchData()
        navigate("/boards")
        setSelectedBoard(null)
    }

    useEffect(() => {
        fetchData()

        if (!selectedBoard) navigateBack()
    }, [])

    return (
        <Box sx={{ ...backgroundStyle, overflow: isMobile ? "auto" : "hidden" }}>
            <Header />
            <Routes>
                <Route
                    index
                    path="/"
                    element={
                        <Box sx={{ flexDirection: "column", flex: 1, gap: isMobile ? 0 : "1vw", padding: isMobile ? "5vw" : "2vw" }}>
                            <Title2
                                name="Quadros"
                                right={
                                    <Box sx={{ gap: "0.5vw" }}>
                                        {user?.admin && (
                                            <IconButton onClick={() => setShowBoardForm(true)}>
                                                <Add />
                                            </IconButton>
                                        )}
                                        <IconButton onClick={fetchData}>
                                            {loading ? <CircularProgress size="1.5rem" color="inherit" /> : <Refresh />}
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
                                openBoardSettings={openBoardSettings}
                                setSelectedBoard={setSelectedBoard}
                                setLoading={setLoading}
                            />
                        </Box>
                    }
                />

                {selectedBoard && <Route path="*" element={<BoardPage board={selectedBoard} navigateBack={navigateBack} />} />}
            </Routes>
            <Dialog
                open={showBoardForm}
                keepMounted
                onClose={closeBoardSettings}
                PaperProps={{ sx: { width: isMobile ? "80vw" : "40vw" }, elevation: 2 }}
            >
                <Box
                    sx={{
                        bgcolor: "background.default",
                        padding: isMobile ? "5vw" : "1.5vw",
                        paddingBottom: "1vw",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography sx={{ fontWeight: "bold" }}>Novo quadro</Typography>
                    <IconButton onClick={closeBoardSettings}>
                        <Close />
                    </IconButton>
                </Box>
                <BoardFormComponent
                    users={users}
                    onSubmit={(board) => {
                        addOrReplaceBoard(board)
                        closeBoardSettings()
                    }}
                />
            </Dialog>

            {showBoardSettings && selectedBoard && (
                <BoardSettingsModal board={selectedBoard} open={showBoardSettings} onClose={closeBoardSettings} onSubmit={addOrReplaceBoard} />
            )}
        </Box>
    )
}
