import React, { useState } from "react"
import { Box, Button, CircularProgress, Dialog, IconButton, Tab, Tabs } from "@mui/material"
import { Board } from "../../../types/server/class/Board/Board"
import { Title2 } from "../../../components/Title"
import { Close } from "@mui/icons-material"
import { BusinessTab } from "./BusinessTab"
import { AccessTab } from "./AccessTab"
import { api } from "../../../api"
import { useUser } from "../../../hooks/useUser"
import { useFetchedData } from "../../../hooks/useFetchedData"
import { Washima } from "../../../types/server/class/Washima/Washima"
import { WithoutFunctions } from "../../../types/server/class/helpers"

interface BoardSettingsModalProps {
    open: boolean
    onClose: () => void
    board: WithoutFunctions<Board>
    onSubmit: (board: Board) => void
}

export const BoardSettingsModal: React.FC<BoardSettingsModalProps> = (props) => {
    const { company, user } = useUser()
    const [washimas] = useFetchedData<Washima>("washimas")

    const [tab, setTab] = useState(0)
    const [loading, setLoading] = useState(false)
    const [selectedWashimas, setSelectedWashimas] = useState(props.board.washima_settings)

    const onSaveClick = async () => {
        if (loading) return

        setLoading(true)
        try {
            const data: Partial<Board> = { washima_settings: selectedWashimas }
            const response = await api.patch("/company/boards", data, {
                params: { company_id: company?.id, user_id: user?.id, board_id: props.board.id },
            })
            props.onSubmit(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            PaperProps={{
                sx: { maxWidth: "80vw", padding: "2vw", bgcolor: "background.default", flexDirection: "column", width: "50vw" },
            }}
        >
            <Title2
                name={props.board.name}
                right={
                    <IconButton onClick={props.onClose}>
                        <Close />
                    </IconButton>
                }
            />
            <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="fullWidth">
                <Tab label="Business" value={0} />
                <Tab label="Broadcast" value={1} />
                <Tab label="Acesso" value={2} />
            </Tabs>

            <Box sx={{ paddingTop: "1vw", height: "30vw", overflow: "auto", flexDirection: "column" }}>
                {tab === 0 && (
                    <BusinessTab
                        board={props.board}
                        washimas={washimas}
                        selectedWashimas={selectedWashimas}
                        setSelectedWashimas={setSelectedWashimas}
                    />
                )}
                {tab === 2 && <AccessTab />}
                <Box sx={{ marginTop: "auto", justifyContent: "flex-end" }}>
                    <Button variant="contained" onClick={() => onSaveClick()}>
                        {loading ? <CircularProgress size={"1.5rem"} color="secondary" /> : "Salvar"}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    )
}
