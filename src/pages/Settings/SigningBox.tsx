import React, { useEffect, useState } from "react"
import { Box, Switch, TextField } from "@mui/material"
import { useLocalStorage } from "@mantine/hooks"

interface SigningBoxProps {}

export const SigningBox: React.FC<SigningBoxProps> = ({}) => {
    const [signing, setSigning] = useLocalStorage({ key: "washima:sign", defaultValue: "" })
    const [enabledSignBox, setEnableSignBox] = useLocalStorage({ key: "washima:enabled-sign", defaultValue: true })

    useEffect(() => {
        if (!enabledSignBox) setSigning("")
    }, [enabledSignBox])

    return (
        <Box sx={{ gap: "0.5vw", alignItems: "center", color: "text.secondary" }}>
            Assinar
            <Switch checked={enabledSignBox} onChange={(_, value) => setEnableSignBox(value)} />
            <TextField value={signing} onChange={(ev) => setSigning(ev.target.value)} disabled={!enabledSignBox} label="Assinatura" />
        </Box>
    )
}
