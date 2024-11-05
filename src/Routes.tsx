import { Route, Routes as ReactRoutes } from "react-router-dom"
import { Home } from "./pages/Home"
import { WildCard } from "./pages/WildCard"
import { WashimaPage } from "./pages/Washima/Washima"
import { NagazapScreen } from "./pages/Nagazap/Nagazap"
import { Login } from "./pages/Login"
import { Signup } from "./pages/Signup/Signup"
import { useUser } from "./hooks/useUser"

interface RoutesProps {}

export const Routes: React.FC<RoutesProps> = ({}) => {
    const { user } = useUser()

    return user ? (
        <ReactRoutes>
            <Route index element={<WashimaPage />} />
            <Route index path="/washima/*" element={<WashimaPage />} />
            <Route path="/nagazap/*" element={<NagazapScreen />} />
            <Route path="*" element={<WildCard />} />
        </ReactRoutes>
    ) : (
        <ReactRoutes>
            <Route index element={<Login />} />
            <Route path="/signup/*" element={<Signup />} />
            <Route path="*" element={<Login />} />
        </ReactRoutes>
    )
}
