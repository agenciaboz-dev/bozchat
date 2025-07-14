import React, { useEffect } from "react"
import { Box, Switch, TextField, useMediaQuery } from "@mui/material"
import { useLocalStorage } from "@mantine/hooks"
import { useUser } from "../../hooks/useUser"

interface SigningBoxProps {}

export const SigningBox: React.FC<SigningBoxProps> = ({}) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { user } = useUser()
    const [signing, setSigning] = useLocalStorage({ key: `washima:sign:${user?.id}`, defaultValue: "" })
    const [enabledSignBox, setEnableSignBox] = useLocalStorage({ key: `washima:enabled-sign:${user?.id}`, defaultValue: true })

    useEffect(() => {
        if (!enabledSignBox) setSigning("")
    }, [enabledSignBox])

    return (
        <Box
            sx={{
                alignItems: isMobile ? "flex-start" : "center",
                gap: isMobile ? "2vw" : "0.5vw",
                color: "text.secondary",
                flexDirection: isMobile ? "column-reverse" : "row",
                marginTop: isMobile ? undefined : "1vw",
            }}
        >
            <Box
                sx={{
                    alignItems: "center",
                    gap: isMobile ? "2vw" : "0.5vw",
                }}
            >
                Assinar
                <Switch checked={enabledSignBox} onChange={(_, value) => setEnableSignBox(value)} />
            </Box>
            <TextField
                variant="standard"
                value={signing}
                onChange={(ev) => setSigning(ev.target.value)}
                disabled={!enabledSignBox}
                label="Assinatura"
                placeholder="Nome"
            />
        </Box>
    )
}
