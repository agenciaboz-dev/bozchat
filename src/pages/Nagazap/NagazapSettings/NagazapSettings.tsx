import React from "react"
import { Box } from "@mui/material"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { Subroute } from "../Subroute"
import { Token } from "./Token"
import { DeleteNagazap } from "./DeleteNagazap"

interface NagazapSettingsProps {
    nagazap: Nagazap
    setNagazap: React.Dispatch<React.SetStateAction<Nagazap | undefined>>
    fetchNagazaps: () => Promise<void>
}

export const NagazapSettings: React.FC<NagazapSettingsProps> = ({ nagazap, setNagazap, fetchNagazaps }) => {
    return (
        <Subroute title="Configurações">
            <Box sx={{ flexDirection: "column", gap: "1vw" }}>
                <Token nagazap={nagazap} />
                <DeleteNagazap nagazap={nagazap} setNagazap={setNagazap} fetchNagazaps={fetchNagazaps} />
            </Box>
        </Subroute>
    )
}
