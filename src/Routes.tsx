import { Route, Routes as ReactRoutes } from "react-router-dom"
import { Home } from "./pages/Home/Home"
import { WildCard } from "./pages/WildCard"
import { WashimaPage } from "./pages/Washima/Washima"
import { NagazapScreen } from "./pages/Nagazap/Nagazap"
import { Login } from "./pages/Login"
import { Signup } from "./pages/Signup/Signup"
import { useUser } from "./hooks/useUser"
import { DeleteAccount } from "./pages/DeleteAccount/DeleteAccount"
import { PrivacyTerms } from "./pages/PrivacyTerms/PrivacyTerms"
import { Settings } from "./pages/Settings/Settings"
import { Users } from "./pages/Users/Users"
import { Bots } from "./pages/Bots/Bots"
import { Logs } from "./pages/Logs/Logs"
import { Departments } from "./pages/Departments/Departments"
import { Boards } from "./pages/Boards/Boards"
import { Admin } from "./pages/Admin/Admin"

interface RoutesProps {}

export const Routes: React.FC<RoutesProps> = ({}) => {
    const { user, boz } = useUser()

    return user ? (
        <ReactRoutes>
            <Route index element={<Home />} />
            <Route index path="/business/*" element={<WashimaPage />} />
            <Route path="/broadcast/*" element={<NagazapScreen />} />
            <Route path="/settings/*" element={<Settings />} />
            <Route path="/users/*" element={<Users />} />
            <Route path="/departments/*" element={<Departments />} />
            <Route path="/bots/*" element={<Bots />} />
            <Route path="/logs/*" element={<Logs />} />
            <Route path="/boards/*" element={<Boards />} />
            {boz && <Route path="/admin/*" element={<Admin />} />}
            <Route path="*" element={<WildCard />} />
        </ReactRoutes>
    ) : (
        <ReactRoutes>
            <Route index element={<Login />} />
            <Route path="/signup/*" element={<Signup />} />
            <Route path="/deletar-conta" element={<DeleteAccount />} />
            <Route path="/termos-privacidade" element={<PrivacyTerms />} />
            <Route path="*" element={<Login />} />
        </ReactRoutes>
    )
}
