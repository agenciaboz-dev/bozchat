import { Box, lighten, useMediaQuery } from "@mui/material";
import ApiIcon from "@mui/icons-material/Api"
import { useColors } from "../hooks/useColors";

export const Title: React.FC<{ title: string; children?: React.ReactNode; icon?: React.ReactNode }> = ({ title, children, icon }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")

    return (
        <Box sx={{ flexDirection: "column", gap: "1vw", padding: isMobile ? "5vw 0" : "1vw 0" }}>
            <Box sx={{ alignItems: "center", justifyContent: "center", gap: "0.5vw" }}>
                {icon ? icon : <ApiIcon />}
                <p style={{ textAlign: "center", fontWeight: "800", fontSize: "1.2vw" }}>{title}</p>
            </Box>
            <Box sx={{ flexDirection: "column" }}>{children}</Box>
        </Box>
    )
}
export const Title2: React.FC<{ name: string; right?: React.ReactNode; left?: React.ReactNode }> = ({ name, right, left }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const colors = useColors()
    return (
        <Box
            sx={{
                color: lighten(colors.text.secondary, 0.3),
                fontWeight: "bold",
                borderBottom: "1px solid",
                paddingBottom: isMobile ? "2vw" : "0.5vw",
                width: "100%",
                fontSize: isMobile ? "6vw" : "1.1vw",
                justifyContent: isMobile ? "center" : "space-between",
                alignItems: "center",
            }}
        >
            {left ? <Box sx={{}}>{left}</Box> : null}
            <p
                style={{
                    flex: 1,
                    color: colors.primary,
                    textAlign: "center",
                }}
            >
                {name}
            </p>
            {right}
        </Box>
    )
}