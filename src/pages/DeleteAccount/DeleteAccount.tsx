import React from "react"
import { Box, useMediaQuery } from "@mui/material"
import { backgroundStyle } from "../../style/background"

interface DeleteAccountProps {}

export const DeleteAccount: React.FC<DeleteAccountProps> = ({}) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    return (
        <Box sx={backgroundStyle}>
            <Box sx={{ color: "secondary.main", flexDirection: "column", padding: "3vw", gap: "0.5vw" }}>
                <img src={"/wagazap.svg"} style={{ width: isMobile ? "25vw" : "10vw", alignSelf: "center" }} draggable={false} />
                <h1>How to delete your account</h1>
                <p>Just send an e-mail to any of our colaborators asking to delete your account.</p>
                <Box style={{ flexDirection: "column", gap: "0.5vw" }}>
                    <strong>Luiz A M Junior:</strong> luiz@agenciaboz.com.br
                    <strong>Fernando Burgos:</strong> fernando@agenciaboz.com.br
                    <strong>Mizael Junior:</strong> mizael@agenciaboz.com.br
                </Box>
            </Box>
        </Box>
    )
}
