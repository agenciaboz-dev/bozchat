import { Route, Routes as ReactRoutes } from "react-router-dom"
import { Home } from "./pages/Home"
import { WildCard } from "./pages/WildCard"
import { WashimaPage } from "./pages/Washima/Washima"
import { NagazapScreen } from "./pages/Nagazap/Nagazap"

interface RoutesProps {}

export const Routes: React.FC<RoutesProps> = ({}) => {

    return   ( <ReactRoutes>
                <Route index element={<Home  />} />
                <Route path="/washima/*" element={<WashimaPage />} />
                <Route path="/nagazap/*" element={<NagazapScreen />} />
                <Route path="*" element={<WildCard />} />
            </ReactRoutes>)
}
