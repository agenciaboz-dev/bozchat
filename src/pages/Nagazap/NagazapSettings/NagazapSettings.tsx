import React from "react"
import { Box } from "@mui/material"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { Subroute } from "../Subroute"
import { Token } from "../Token"

interface NagazapSettingsProps {
    nagazap: Nagazap
}

export const NagazapSettings: React.FC<NagazapSettingsProps> = ({ nagazap }) => {
    return (
        <Subroute title="Configurações">
            <Token nagazap={nagazap} />
        </Subroute>
    )
}
