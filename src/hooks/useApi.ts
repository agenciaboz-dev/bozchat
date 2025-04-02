import { useState } from "react"
import { useUser } from "./useUser"
import { api } from "../api"
import { NagaMessage, Nagazap } from "../types/server/class/Nagazap"
import { WashimaProfilePic } from "../types/server/class/Washima/Washima"
import { BoardAccess } from "../types/server/class/Board/Board"
import { Chat } from "../types/server/class/Board/Chat"
import { RoomTrigger } from "../types/server/class/Board/Room"
import { useIo } from "./useIo"
import { useSnackbar } from "burgos-snackbar"

export interface FetchOptions {
    ignoreLoading?: boolean
    params?: any
}

export const useApi = () => {
    const io = useIo()
    const { user, company } = useUser()
    const { snackbar } = useSnackbar()

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

    const patch = async (url: string, data: any, options?: { ignoreLoading?: boolean; params?: any }) => {
        if (!options?.ignoreLoading) {
            setLoading(true)
        }

        try {
            const response = await api.patch(url, data, { params: { company_id: company?.id, user_id: user?.id, ...options?.params } })
            return response.data
        } catch (error) {
            console.log(error)
        } finally {
            if (!options?.ignoreLoading) {
                setLoading(false)
            }
        }
    }

    const emitRommTrigger = (chat: Chat, trigger: RoomTrigger) => {
        io.emit("board:room:chat:clone", chat, trigger)
        snackbar({ severity: "info", text: `Sala copiada para ${trigger.board_name}` })
    }

    const fetchDepartments = async (options?: FetchOptions & { params?: { department_id: string } }) => await get("/company/departments", options)
    const fetchUsers = async (options?: FetchOptions & { params?: { user_id: string } }) => await get("/company/users", options)
    const fetchBoards = async (options?: FetchOptions & { params?: { board_id: string } }) => await get("/company/boards", options)
    const fetchBoardsAccess = async (options?: FetchOptions & { params: { board_id: string } }): Promise<BoardAccess> =>
        await get("/company/boards/access", options)
    const fetchWashima = async (options?: FetchOptions & { params?: { washima_id: string } }) => await get("/washima", options)
    const fetchWashimaProfilePic = async (options?: FetchOptions & { params: { washima_id: string } }): Promise<WashimaProfilePic> =>
        await get("/washima/profile-pic", options)
    const fetchNagazaps = async (options?: FetchOptions & { params?: { nagazap_id: string } }) => await get("/nagazap", options)
    const fetchNagaMessages = async (options: FetchOptions & { params: { nagazap_id: string; from?: string } }): Promise<NagaMessage[]> =>
        await get("/nagazap/messages", options)

    const patchNagazap = async (data: Partial<Nagazap>, options: FetchOptions & { params: { nagazap_id: string } }): Promise<Nagazap> =>
        await patch("/nagazap", data, options)

    return {
        loading,
        setLoading,
        fetchDepartments,
        fetchUsers,
        fetchBoards,
        fetchWashima,
        fetchWashimaProfilePic,
        fetchBoardsAccess,
        fetchNagazaps,
        fetchNagaMessages,
        emitRommTrigger,
        patchNagazap,
    }
}
