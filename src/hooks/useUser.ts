import { useCallback, useContext, useState } from "react"
import UserContext from "../contexts/userContext"

export const useUser = () => {
    const userContext = useContext(UserContext)
    const { user, setUser } = userContext


    const firstname = user?.name.split(" ")[0] || ""


    return {
        user,
        firstname,
    }
}
