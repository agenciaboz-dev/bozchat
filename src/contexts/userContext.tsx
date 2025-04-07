import { createContext, useEffect, useMemo, useState } from "react"
import React from "react"
import { useIo } from "../hooks/useIo"
import { User, UserNotification } from "../types/server/class/User"
import { useNotification } from "../hooks/useNotification"
import { nagazap_notifications, washima_notifications } from "../pages/Settings/notifications_list"
import { Company } from "../types/server/class/Company"

interface UserContextValue {
    user: User | null
    setUser: (user: User | null) => void
    setTimestamp: React.Dispatch<React.SetStateAction<number>>

    company: Company | null
    setCompany: React.Dispatch<React.SetStateAction<Company | null>>

    boz: boolean
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
    const [company, setCompany] = useState<Company | null>(null)

    const boz = useMemo(
        () => company?.id === "1ce602ff-7ebe-4e43-ab9a-7758fe7020f8" || company?.id === "6e668524-7f7c-4ee8-97c1-87a9ab7a43ca",
        [company]
    )

    useEffect(() => {
        if (user) {
            const subscribed_notifications = [...washima_notifications, ...nagazap_notifications].filter((item) => {
                const subscribed = localStorage.getItem(item.event)
                return !!(!subscribed || JSON.parse(subscribed))
            })

            subscribed_notifications.forEach((notification) =>
                io.on(`user:${user.id}:notify:${notification.event}`, (data: UserNotification) => {
                    notify({
                        title: data.title,
                        body: data.body,
                        audio_src: notification.audio_src,
                        icon_url: "/logos/1.png",
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
                company,
                setCompany,
                boz,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}
