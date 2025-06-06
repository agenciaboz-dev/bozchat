import React, { useMemo } from "react"
import { Box, Chip, Typography, useMediaQuery } from "@mui/material"
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
    const isMobile = useMediaQuery("(orientation: portrait)")

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

    return (
        <Box sx={{ flexDirection: "column", gap: isMobile ? "5vw" : "1vw", flex: 1 }}>
            <Box sx={{ alignItems: "center", gap: isMobile ? "2vw" : "1vw" }} color="text.secondary">
                <Typography>Atualmente sincronizado com:</Typography>
                <Chip label={props.board.nagazap_settings.length} size="small" />
            </Box>
            <Box sx={{ flexDirection: "column", gap: isMobile ? "5vw" : "1vw" }}>
                {syncedNagazaps.map((nagazap) => {
                    const setting = props.selectedNagazaps.find((item) => item.nagazap_id === nagazap.id)
                    return (
                        <IntegrationContainer
                            type="nagazap"
                            integration={nagazap}
                            key={nagazap.id}
                            checked={!!setting}
                            onChange={onNagazapClick}
                            board={props.board}
                            room={props.board.rooms.find((room) => room.id === setting?.room_id)}
                            unread_only={setting?.unread_only === undefined ? true : setting.unread_only}
                        />
                    )
                })}
            </Box>

            <Box sx={{ flexDirection: "column", gap: isMobile ? "5vw" : "1vw" }} color="text.secondary">
                <Typography>Não sincronizados:</Typography>

                {remainingNagazaps.map((nagazap) => {
                    const setting = props.selectedNagazaps.find((item) => item.nagazap_id === nagazap.id)
                    return (
                        <IntegrationContainer
                            type="nagazap"
                            integration={nagazap}
                            key={nagazap.id}
                            checked={!!setting}
                            onChange={onNagazapClick}
                            board={props.board}
                            room={props.board.rooms.find((room) => room.id === setting?.room_id)}
                            unread_only={setting?.unread_only === undefined ? true : setting.unread_only}
                        />
                    )
                })}
            </Box>
        </Box>
    )
}
