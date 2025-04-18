import React, { useEffect } from "react"
import { Box, Switch } from "@mui/material"
import { useLocalStorage } from "@mantine/hooks"
import { useUser } from "../../hooks/useUser"

interface NotificationSwitchProps {
    notification: { event: string; label: string }
}

export const NotificationSwitch: React.FC<NotificationSwitchProps> = ({ notification }) => {
    const [subscribed, setSubscribed] = useLocalStorage({ key: notification.event, defaultValue: true })

    const { setTimestamp } = useUser()

    useEffect(() => {
        setTimestamp(new Date().getTime())
    }, [subscribed])

    return (
        <Box sx={{ gap: "0.5vw", alignItems: "center", color: "text.secondary" }}>
            {notification.label}
            <Switch checked={subscribed} onChange={(_, value) => setSubscribed(value)} />
        </Box>
    )
}
