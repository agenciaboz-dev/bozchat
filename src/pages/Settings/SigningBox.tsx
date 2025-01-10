import React, { useEffect, useState } from "react"
import { Box, Switch, TextField } from "@mui/material"
import { useLocalStorage } from "@mantine/hooks"

interface SigningBoxProps {}

export const SigningBox: React.FC<SigningBoxProps> = ({}) => {
    const [signing, setSigning] = useLocalStorage({ key: "washima:sign", defaultValue: "" })
    const [showSignBox, setShowSignBox] = useState(!!signing)

    useEffect(() => {
        if (!showSignBox) setSigning("")
    }, [showSignBox])

    return (
        <Box sx={{ gap: "0.5vw", alignItems: "center", color: "secondary.main" }}>
            Assinar
            <Switch checked={showSignBox} onChange={(_, value) => setShowSignBox(value)} />
            {showSignBox && <TextField value={signing} onChange={(ev) => setSigning(ev.target.value)} />}
        </Box>
    )
}
