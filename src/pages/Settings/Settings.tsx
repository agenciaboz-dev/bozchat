import React from "react"
import { Box } from "@mui/material"
import { Header } from "../../components/Header"
import { backgroundStyle } from "../../style/background"
import { Title2 } from "../../components/Title"
import { washima_notifications } from "./notifications_list"
import { NotificationSwitch } from "./NotificationSwitch"

interface SettingsProps {}

export const Settings: React.FC<SettingsProps> = ({}) => {
    return (
        <Box sx={backgroundStyle}>
            <Header />

            <Box sx={{ padding: "2vw", flexDirection: "column", gap: "1vw" }}>
                <Title2 name="Notificações" />
                {washima_notifications.map((item) => (
                    <NotificationSwitch key={item.event} notification={item} />
                ))}
            </Box>
        </Box>
    )
}
