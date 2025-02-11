import HomeIcon from "@mui/icons-material/Home"
import WhatsAppIcon from "@mui/icons-material/WhatsApp"
import FormatListNumberedRtlIcon from "@mui/icons-material/FormatListNumberedRtl"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"
import SettingsIcon from "@mui/icons-material/Settings"
import Groups3Icon from "@mui/icons-material/Groups3"
import BusinessIcon from "@mui/icons-material/Business"
import CategoryIcon from "@mui/icons-material/Category"
import BarChartIcon from "@mui/icons-material/BarChart"
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner"
import { useNavigate } from "react-router-dom"
import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated"
import NewReleasesIcon from "@mui/icons-material/NewReleases"
import { useUser } from "./useUser"
import { Badge, BadgeProps, styled } from "@mui/material"
import ApiIcon from "@mui/icons-material/Api"
import PaletteIcon from "@mui/icons-material/Palette"
import { AccountTree, Groups, Hub, People, Settings } from "@mui/icons-material"
import { Menu } from "../types/Menu"

export const useMenuList = () => {
    const navigate = useNavigate()

    const { user } = useUser()

    const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
        "& .MuiBadge-badge": {
            right: "0.2vw",
            top: "0.2vw",
            padding: "0 4px",
            minWidth: 0,
            width: "1.1vw",
            height: "1.1vw",
            color: "white",
            fontWeight: "bold",
            fontSize: "0.75vw",
        },
    }))

    const menus: Menu[] = [
        {
            name: "Início",
            path: "/",
            icon: <HomeIcon />,
            onClick: () => navigate("/"),
        },
        {
            name: "Business",
            path: "/washima",
            icon: <WhatsAppIcon />,
            onClick: () => navigate("/washima"),
        },
        {
            icon: <Hub />,
            name: "Broadcast",
            path: "/nagazap",
            onClick: () => navigate("/nagazap/"),
        },
        {
            icon: <People />,
            name: "Usuários",
            path: "/users",
            onClick: () => navigate("/users/"),
        },
        {
            icon: <Settings />,
            name: "Configurações",
            path: "/settings",
            onClick: () => navigate("/settings/"),
        },
    ]
    return menus
}
