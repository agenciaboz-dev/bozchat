import { Box, lighten, useMediaQuery } from "@mui/material";
import ApiIcon from "@mui/icons-material/Api"
import { useColors } from "../hooks/useColors";
import { useDarkMode } from "../hooks/useDarkMode"
import colors, { default_colors } from "../style/colors"

export const Title: React.FC<{ title: string; children?: React.ReactNode; icon?: React.ReactNode }> = ({ title, children, icon }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()

    return (
        <Box sx={{ flexDirection: "column", gap: "1vw", padding: isMobile ? "5vw 0" : "1vw 0" }}>
            <Box
                sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    gap: isMobile ? "2vw" : "0.5vw",
                    color: darkMode ? colors.secondary : default_colors.text.secondary,
                }}
            >
                {icon ? icon : <ApiIcon />}
                <p style={{ textAlign: "center", fontWeight: "800", fontSize: isMobile ? "5vw" : "1.2vw" }}>{title}</p>
            </Box>
            <Box sx={{ flexDirection: "column" }}>{children}</Box>
        </Box>
    )
}
export const Title2: React.FC<{ name: string; right?: React.ReactNode; left?: React.ReactNode; space?: boolean; center?: boolean }> = ({
    name,
    right,
    left,
    space,
    center,
}) => {
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
            <Box sx={{ alignItems: "center", gap: "0.5vw" }}>
                {left ? <Box>{left}</Box> : isMobile && !space ? <Box sx={{ flex: 0.1 }}></Box> : null}
                <p
                    style={{
                        flex: isMobile ? 1 : undefined,
                        color: colors.primary,
                        textAlign: center ? undefined : isMobile ? "center" : undefined,
                    }}
                >
                    {name}
                </p>
            </Box>
            {right ? right : isMobile && space ? <Box sx={{ flex: 0.1 }}></Box> : null}
        </Box>
    )
}