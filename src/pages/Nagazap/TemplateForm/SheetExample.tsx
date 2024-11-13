import React from "react"
import { Box, Typography } from "@mui/material"

interface SheetExampleProps {}

const SheetColumn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <Box sx={{ width: "50%", display: "flex", flexDirection: "column", border: "2px solid" }}>{children}</Box>
}

const SheetLine: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Box sx={{ padding: "5px", border: "solid ", borderWidth: "1px 0" }}>
            <Typography color="secondary.main">{children}</Typography>
        </Box>
    )
}

export const SheetExample: React.FC<SheetExampleProps> = ({}) => {
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
                <SheetLine>Nome:</SheetLine>
                <SheetLine>João</SheetLine>
                <SheetLine>Maria</SheetLine>
                <SheetLine>José</SheetLine>
            </SheetColumn>
            <SheetColumn>
                <SheetLine>Telefone:</SheetLine>
                <SheetLine>(41) 00000-0000</SheetLine>
                <SheetLine>(11) 11111-1111</SheetLine>
                <SheetLine>(91) 22222-2222</SheetLine>
            </SheetColumn>
        </Box>
    )
}
