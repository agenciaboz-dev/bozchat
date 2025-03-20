import { useCallback, useContext, useState } from "react"
import UserContext from "../contexts/userContext"
import { User } from "../types/server/class/User"
import { useNavigate } from "react-router-dom"
import { Company } from "../types/server/class/Company"

export const useUser = () => {
    const userContext = useContext(UserContext)
    const navigate = useNavigate()
    const { user, setUser, setTimestamp, company, setCompany } = userContext

    const firstname = user?.name.split(" ")[0] || ""

    const onLogin = (data: { company: Company; user: User }) => {
        setCompany(data.company)
        setUser(data.user)
        // navigate("/")
    }

    const logout = () => {
        setUser(null)
        navigate("/")
    }

    return {
        user,
        firstname,
        onLogin,
        logout,
        setTimestamp,
        company,
        setCompany,
    }
}
