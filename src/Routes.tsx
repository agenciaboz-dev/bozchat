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

interface RoutesProps {}

export const Routes: React.FC<RoutesProps> = ({}) => {
    const { user } = useUser()

    return user ? (
        <ReactRoutes>
            <Route index element={<Home />} />
            <Route index path="/washima/*" element={<WashimaPage />} />
            <Route path="/nagazap/*" element={<NagazapScreen />} />
            <Route path="/settings/*" element={<Settings />} />
            <Route path="/users/*" element={<Users />} />
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
