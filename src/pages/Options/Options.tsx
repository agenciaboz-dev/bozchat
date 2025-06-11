import React from "react"
import { Box, Grid, useMediaQuery } from "@mui/material"
import { Header } from "../../components/Header/Header"
import { backgroundStyle } from "../../style/background"
import { Title2 } from "../../components/Title"
import { nagazap_notifications, washima_notifications } from "./notifications_list"
import { NotificationSwitch } from "./NotificationSwitch"
import { SigningBox } from "./SigningBox"
import { useUser } from "../../hooks/useUser"

interface OptionsProps {}

export const Options: React.FC<OptionsProps> = ({}) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { user } = useUser()

    return (
        <Box sx={{ ...backgroundStyle, overflow: isMobile ? "auto" : "hidden" }}>
            <Header />

            <Box sx={{ padding: "2vw", flexDirection: "column", gap: "1vw" }}>
                <Grid container columns={2} spacing={"1vw"}>
                    <Grid item xs={1}>
                        <Box sx={{ flexDirection: "column", gap: "1vw" }}>
                            <Box sx={{ flexDirection: "column" }}>
                                <Title2 name="Notificações" />
                                {washima_notifications.map((item) => (
                                    <NotificationSwitch key={item.event} notification={item} />
                                ))}
                                {user?.admin && nagazap_notifications.map((item) => <NotificationSwitch key={item.event} notification={item} />)}
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Title2 name="Assinatura" />
                        <SigningBox />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}
