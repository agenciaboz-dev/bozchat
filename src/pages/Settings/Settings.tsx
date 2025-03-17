import React from "react"
import { Box, Grid } from "@mui/material"
import { Header } from "../../components/Header/Header"
import { backgroundStyle } from "../../style/background"
import { Title2 } from "../../components/Title"
import { nagazap_notifications, washima_notifications } from "./notifications_list"
import { NotificationSwitch } from "./NotificationSwitch"
import { SigningBox } from "./SigningBox"

interface SettingsProps {}

export const Settings: React.FC<SettingsProps> = ({}) => {
    return (
        <Box sx={backgroundStyle}>
            <Header />

            <Box sx={{ padding: "2vw", flexDirection: "column", gap: "1vw" }}>
                <Grid container columns={2} spacing={"1vw"}>
                    <Grid item xs={1}>
                        <Box sx={{ flexDirection: "column", gap: "1vw" }}>
                            <Box sx={{ flexDirection: "column" }}>
                                <Title2 name="Notificações - Business" />
                                {washima_notifications.map((item) => (
                                    <NotificationSwitch key={item.event} notification={item} />
                                ))}
                            </Box>

                            <Title2 name="Assinatura" />
                            <SigningBox />
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Title2 name="Notificações - Broadcast" />
                        {nagazap_notifications.map((item) => (
                            <NotificationSwitch key={item.event} notification={item} />
                        ))}
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}
