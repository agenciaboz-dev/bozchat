import { createContext, useEffect, useState } from "react"
import React from "react"
import { useIo } from "../hooks/useIo"
import { User, UserNotification } from "../types/server/class/User"
import { useNotification } from "../hooks/useNotification"
import { nagazap_notifications, washima_notifications } from "../pages/Settings/notifications_list"

interface UserContextValue {
    user: User | null
    setUser: (user: User | null) => void
    setTimestamp: React.Dispatch<React.SetStateAction<number>>
}

interface UserProviderProps {
    children: React.ReactNode
}

const UserContext = createContext<UserContextValue>({} as UserContextValue)

export default UserContext

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const io = useIo()
    const notify = useNotification()

    const [user, setUser] = useState<User | null>(null)
    const [timestamp, setTimestamp] = useState(new Date().getTime())

    useEffect(() => {
        if (user) {
            const subscribed_notifications = [...washima_notifications, ...nagazap_notifications].filter((item) => {
                const subscribed = localStorage.getItem(item.event)
                return !!(subscribed && JSON.parse(subscribed))
            })

            subscribed_notifications.forEach((notification) =>
                io.on(`user:${user.id}:notify:${notification.event}`, (data: UserNotification) => {
                    notify({
                        title: data.title,
                        body: data.body,
                        audio_src: notification.audio_src,
                        icon_url: "/logo.png",
                    })
                })
            )

            return () => {
                subscribed_notifications.forEach((notification) => io.off(`user:${user.id}:notify:${notification.event}`))
            }
        }
    }, [user, timestamp])

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                setTimestamp,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}
