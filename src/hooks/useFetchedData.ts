import { useEffect, useState } from "react"
import { FetchOptions, useApi } from "./useApi"

export type FetchedDataKey = "washimas" | "users" | "departments" | "boards" | "nagazaps" | "companies"

export const useFetchedData = <T>(
    key: FetchedDataKey,
    options?: FetchOptions
): [T[], React.Dispatch<React.SetStateAction<T[]>>, { refresh: () => Promise<void>; loading: boolean }] => {
    const api = useApi()

    const [data, setData] = useState<T[]>([])

    const fetcher: { [key in FetchedDataKey]: (options?: FetchOptions) => Promise<any> } = {
        washimas: api.fetchWashima,
        users: api.fetchUsers,
        departments: api.fetchDepartments,
        boards: api.fetchBoards,
        nagazaps: api.fetchNagazaps,
        companies: api.admin.fetchCompanies,
    }

    const fetchData = async () => {
        setData(await fetcher[key](options))
    }

    useEffect(() => {
        fetchData()
    }, [key])

    return [data, setData, { refresh: fetchData, loading: api.loading }]
}
