import { Paper, Typography, useMediaQuery } from "@mui/material"

export const TextInfo: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")

    return (
        <Paper sx={{ borderRadius: isMobile ? "4px" : "0.5vw", padding: isMobile ? "3vw" : "0.5vw 1vw", alignSelf: "center", width: "fit-content" }}>
            <Typography sx={{ fontSize: "0.8rem", color: "text.secondary", textAlign: "center" }}>{children}</Typography>
        </Paper>
    )
}
