import React, { useState } from "react"
import { Box, Button, CircularProgress, Switch, TextField, useMediaQuery } from "@mui/material"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { Lock, LockOpen } from "@mui/icons-material"
import { FormikBundle } from "../../../types/FormikBundle"

interface TokenProps {
    nagazap: Nagazap
    formik: FormikBundle<Partial<Nagazap>>
}

export const Token: React.FC<TokenProps> = ({ nagazap, formik }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const [locked, setLocked] = useState(true)
    

    return (
        <Box sx={{ flexDirection: "column", gap: "1vw" }}>
            <Box sx={{ fontWeight: "bold", color: "text.secondary", alignItems: "center" }}>
                Token
                <Switch
                    checked={locked}
                    color={locked ? "success" : "warning"}
                    onChange={(_, value) => setLocked(value)}
                    checkedIcon={<Lock />}
                    icon={<LockOpen />}
                />
            </Box>
                <TextField
                    label={new Date(Number(nagazap.lastUpdated)).toLocaleString("pt-br")}
                    name="token"
                    value={formik.values.token}
                    onChange={formik.handleChange}
                    multiline
                    maxRows={isMobile ? 7 : 2}
                    disabled={locked}
                />
            
        </Box>
    )
}
