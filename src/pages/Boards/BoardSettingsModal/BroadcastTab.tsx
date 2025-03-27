import React, { useMemo } from "react"
import { Box, Chip, Typography } from "@mui/material"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { WithoutFunctions } from "../../../types/server/class/helpers"
import { Board, BoardNagazapSettings } from "../../../types/server/class/Board/Board"
import { IntegrationContainer } from "./IntegrationContainer"

interface BroadcastTabProps {
    nagazaps: Nagazap[]
    board: WithoutFunctions<Board>
    selectedNagazaps: BoardNagazapSettings[]
    setSelectedNagazaps: React.Dispatch<React.SetStateAction<BoardNagazapSettings[]>>
}

export const BroadcastTab: React.FC<BroadcastTabProps> = (props) => {
    console.log(props.board)
    const remainingNagazaps = useMemo(
        () => props.nagazaps.filter((nagazap) => !props.board.nagazap_settings.find((item) => item.nagazap_id === nagazap.id)),
        [props.nagazaps, props.board]
    )

    const syncedNagazaps = useMemo(
        () => props.nagazaps.filter((nagazap) => props.board.nagazap_settings.find((item) => item.nagazap_id === nagazap.id)),
        [props.nagazaps, props.board]
    )

    const onNagazapClick = (nagazap_id: string, setting?: BoardNagazapSettings) => {
        props.setSelectedNagazaps((nagazaps) => {
            const filtered = nagazaps.filter((item) => item.nagazap_id !== nagazap_id)
            if (setting) {
                return [...filtered, setting]
            } else {
                return filtered
            }
        })
    }

    return <Box sx={{ flexDirection: "column", gap: "1vw", flex: 1 }}>
                <Box sx={{ alignItems: "center", gap: "1vw" }} color="secondary.main">
                    <Typography>Atualmente sincronizado com:</Typography>
                    <Chip label={props.board.nagazap_settings.length} size="small" />
                </Box>
                <Box sx={{ flexDirection: "column", gap: "1vw" }}>
                    {syncedNagazaps.map((nagazap) => {
                        const setting = props.selectedNagazaps.find((item) => item.nagazap_id === nagazap.id)
                        return (
                            <IntegrationContainer
                                type='nagazap'
                                integration={nagazap}
                                key={nagazap.id}
                                checked={!!setting}
                                onChange={onNagazapClick}
                                board={props.board}
                                room={props.board.rooms.find((room) => room.id === setting?.room_id)}
                            />
                        )
                    })}
                </Box>
    
                <Box sx={{ flexDirection: "column", gap: "1vw" }} color="secondary.main">
                    <Typography>Não sincronizados:</Typography>
    
                    {remainingNagazaps.map((nagazap) => {
                        const setting = props.selectedNagazaps.find((item) => item.nagazap_id === nagazap.id)
                        return (
                            <IntegrationContainer
                                type='nagazap'
                                integration={nagazap}
                                key={nagazap.id}
                                checked={!!setting}
                                onChange={onNagazapClick}
                                board={props.board}
                                room={props.board.rooms.find((room) => room.id === setting?.room_id)}
                            />
                        )
                    })}
                </Box>
            </Box>
}
