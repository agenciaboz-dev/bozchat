import { useEffect, useState } from "react"
import { FetchOptions, useApi } from "./useApi"

export type FetchedDataKey = "washimas" | "users" | "departments" | "boards"

export const useFetchedData = <T>(key: FetchedDataKey, options?: FetchOptions): [T[], React.Dispatch<React.SetStateAction<T[]>>] => {
    const api = useApi()

    const [data, setData] = useState<T[]>([])

    const fetcher: { [key in FetchedDataKey]: (options?: FetchOptions) => Promise<any> } = {
        washimas: api.fetchWashima,
        users: api.fetchUsers,
        departments: api.fetchDepartments,
        boards: api.fetchBoards,
    }

    const fetchData = async () => {
        setData(await fetcher[key](options))
    }

    useEffect(() => {
        fetchData()
    }, [key])

    return [data, setData]
}
