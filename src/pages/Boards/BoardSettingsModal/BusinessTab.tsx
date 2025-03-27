import React, { useMemo, useState } from "react"
import { Box, Chip, Typography } from "@mui/material"
import { Washima } from "../../../types/server/class/Washima/Washima"
import { WithoutFunctions } from "../../../types/server/class/helpers"
import { Board, BoardWashimaSettings } from "../../../types/server/class/Board/Board"
import { IntegrationContainer } from "./IntegrationContainer"

interface BusinessTabProps {
    washimas: Washima[]
    board: WithoutFunctions<Board>
    selectedWashimas: BoardWashimaSettings[]
    setSelectedWashimas: React.Dispatch<React.SetStateAction<BoardWashimaSettings[]>>
}

export const BusinessTab: React.FC<BusinessTabProps> = (props) => {
    const remainingWashimas = useMemo(
        () => props.washimas.filter((washima) => !props.board.washima_settings.find((item) => item.washima_id === washima.id)),
        [props.washimas, props.board]
    )

    const syncedWashimas = useMemo(
        () => props.washimas.filter((washima) => props.board.washima_settings.find((item) => item.washima_id === washima.id)),
        [props.washimas, props.board]
    )

    const onWashimaClick = (washima_id: string, setting?: BoardWashimaSettings) => {
        props.setSelectedWashimas((washimas) => {
            const filtered = washimas.filter((item) => item.washima_id !== washima_id)
            if (setting) {
                return [...filtered, setting]
            } else {
                return filtered
            }
        })
    }

    return (
        <Box sx={{ flexDirection: "column", gap: "1vw", flex: 1 }}>
            <Box sx={{ alignItems: "center", gap: "1vw" }} color="secondary.main">
                <Typography>Atualmente sincronizado com:</Typography>
                <Chip label={props.board.washima_settings.length} size="small" />
            </Box>
            <Box sx={{ flexDirection: "column", gap: "1vw" }}>
                {syncedWashimas.map((washima) => {
                    const setting = props.selectedWashimas.find((item) => item.washima_id === washima.id)
                    return (
                        <IntegrationContainer
                            integration={washima}
                            key={washima.id}
                            checked={!!setting}
                            onChange={onWashimaClick}
                            board={props.board}
                            room={props.board.rooms.find((room) => room.id === setting?.room_id)}
                            type='washima'
                        />
                    )
                })}
            </Box>

            <Box sx={{ flexDirection: "column", gap: "1vw" }} color="secondary.main">
                <Typography>Não sincronizados:</Typography>

                {remainingWashimas.map((washima) => {
                    const setting = props.selectedWashimas.find((item) => item.washima_id === washima.id)
                    return (
                        <IntegrationContainer
                            integration={washima}
                            key={washima.id}
                            checked={!!setting}
                            onChange={onWashimaClick}
                            board={props.board}
                            room={props.board.rooms.find((room) => room.id === setting?.room_id)}
                            type='washima'
                        />
                    )
                })}
            </Box>
        </Box>
    )
}
