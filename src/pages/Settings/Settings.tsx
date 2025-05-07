import React from "react"
import { Route, Routes } from "react-router-dom"
import { Users } from "../Users/Users"
import { Departments } from "../Departments/Departments"
import { Logs } from "../Logs/Logs"
import { Options } from "../Options/Options"

interface SettingsProps {}

export const Settings: React.FC<SettingsProps> = ({}) => {
    return (
        <Routes>
            <Route path="/users/*" element={<Users />} />
            <Route path="/departments/*" element={<Departments />} />
            <Route path="/logs/*" element={<Logs />} />
            <Route path="/options/*" element={<Options />} />
        </Routes>
    )
}
