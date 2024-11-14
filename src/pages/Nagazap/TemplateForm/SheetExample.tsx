import React from "react"
import { Box, Typography, useMediaQuery } from "@mui/material"

interface SheetExampleProps {}

const SheetColumn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <Box sx={{ width: "50%", display: "flex", flexDirection: "column", border: "1px solid" }}>{children}</Box>
}

const SheetLine: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Box sx={{ padding: "5px", border: "solid ", borderWidth: "1px 0" }}>
            <Typography color="secondary.main" fontSize={"0.85rem"}>
                {children}
            </Typography>
        </Box>
    )
}

export const SheetExample: React.FC<SheetExampleProps> = ({}) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                backgroundColor: "background.main",
            }}
        >
            <SheetColumn>
                <SheetLine>outras colunas</SheetLine>
                <SheetLine>...</SheetLine>
                <SheetLine>...</SheetLine>
                <SheetLine>...</SheetLine>
            </SheetColumn>
            <SheetColumn>
                <SheetLine>Telefone</SheetLine>
                <SheetLine>(41) 0 0000-0000</SheetLine>
                <SheetLine>41 00000 0000</SheetLine>
                <SheetLine>41000000000</SheetLine>
            </SheetColumn>
        </Box>
    )
}
