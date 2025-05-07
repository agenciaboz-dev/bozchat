import { createContext, useEffect, useMemo, useRef, useState } from "react"
import React from "react"
import { useIo } from "../hooks/useIo"
import { User, UserNotification } from "../types/server/class/User"
import { useNotification } from "../hooks/useNotification"
import { nagazap_notifications, washima_notifications } from "../pages/Options/notifications_list"
import { Company } from "../types/server/class/Company"
import { useLocalStorage } from "@mantine/hooks"
import { api } from "../api"
import { LoginForm } from "../types/server/LoginForm"

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
    const firstRender = useRef(true)

    const [user, setUser] = useLocalStorage<User | null>({ key: "bozchat:user", defaultValue: null })
    const [timestamp, setTimestamp] = useState(new Date().getTime())
    const [company, setCompany] = useLocalStorage<Company | null>({ key: "bozchat:company", defaultValue: null })
    const [boz, setBoz] = useState(false)

    const refreshCachedUser = async (user: User) => {
        try {
            const data: LoginForm = { login: user.email, password: user.password }
            const response = await api.post("/user/login", data)
            const user_and_company = response.data as { user: User; company: Company }
            setUser(user_and_company.user)
            setCompany(user_and_company.company)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (user && (company?.id === "1ce602ff-7ebe-4e43-ab9a-7758fe7020f8" || company?.id === "6e668524-7f7c-4ee8-97c1-87a9ab7a43ca")) {
            setBoz(true)
        }

        if (!user) {
            setBoz(false)
        }
    }, [company, user])

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

    useEffect(() => {
        if (firstRender.current && user && company) {
            firstRender.current = false
            refreshCachedUser(user)
        }
    }, [user, company, firstRender])

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
