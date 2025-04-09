import { Paper, Typography } from "@mui/material";

export const TextInfo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Paper sx={{ borderRadius: "0.5vw", padding: "0.5vw 1vw", alignSelf: "center", width: "fit-content" }}>
        <Typography sx={{ fontSize: "0.8rem", color: "text.secondary", textAlign: "center" }}>{children}</Typography>
    </Paper>
)