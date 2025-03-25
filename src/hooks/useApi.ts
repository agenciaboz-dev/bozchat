import { useState } from "react"
import { useUser } from "./useUser"
import { api } from "../api"

export interface FetchOptions {
    ignoreLoading?: boolean
    params?: any
}

export const useApi = () => {
    const { user, company } = useUser()

    const [loading, setLoading] = useState(false)

    const get = async (url: string, options?: { ignoreLoading?: boolean; params?: any }) => {
        if (!options?.ignoreLoading) {
            setLoading(true)
        }

        try {
            const response = await api.get(url, { params: { company_id: company?.id, user_id: user?.id, ...options?.params } })
            return response.data
        } catch (error) {
            console.log(error)
        } finally {
            if (!options?.ignoreLoading) {
                setLoading(false)
            }
        }
    }

    const fetchDepartments = async (options?: FetchOptions) => await get("/company/departments", options)
    const fetchUsers = async (options?: FetchOptions) => await get("/company/users", options)
    const fetchBoards = async (options?: FetchOptions) => await get("/company/boards", options)
    const fetchWashima = async (options?: FetchOptions) => await get("/washima", options)
    const fetchWashimaProfilePic = async (options?: FetchOptions) => await get("/washima/profile-pic", options)

    return { loading, setLoading, fetchDepartments, fetchUsers, fetchBoards, fetchWashima, fetchWashimaProfilePic }
}
