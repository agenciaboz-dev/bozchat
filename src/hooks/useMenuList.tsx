import HomeIcon from "@mui/icons-material/Home"
import WhatsAppIcon from "@mui/icons-material/WhatsApp"
import { useNavigate } from "react-router-dom"
import { useUser } from "./useUser"
import { Badge, BadgeProps, styled } from "@mui/material"
import { Engineering, Hub, List, People, SafetyDivider, Settings, ViewWeek, Tune, Token, Extension } from "@mui/icons-material"
import { Menu } from "../types/Menu"
import { useMemo } from "react"

export const useMenuList = () => {
    const navigate = useNavigate()

    const { boz, user } = useUser()

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

    const menus: Menu[] = useMemo(() => {
        const list = [
            {
                name: "Início",
                path: "/",
                icon: <HomeIcon />,
                onClick: () => navigate("/"),
            },
            {
                icon: <Token />,
                name: "Módulos",
                path: "/",
                onClick: () => {},
                submenus: [
                    {
                        name: "Business",
                        path: "/business",
                        icon: <WhatsAppIcon />,
                        onClick: () => navigate("/business"),
                    },
                    {
                        icon: <Hub />,
                        name: "Broadcast",
                        path: "/broadcast",
                        onClick: () => navigate("/broadcast/"),
                        admin: true,
                    },
                ],
            },
            {
                icon: <Extension />,
                name: "Complementos",
                path: "/",
                onClick: () => {},
                submenus: [
                    {
                        icon: <Engineering />,
                        name: "Chatbots",
                        path: "/bots",
                        onClick: () => navigate("/bots/"),
                        admin: true,
                    },
                    {
                        icon: <ViewWeek />,
                        name: "Quadros",
                        path: "/boards",
                        onClick: () => navigate("/boards/"),
                    },
                ],
            },
            {
                icon: <Settings />,
                name: "Configurações",
                path: "/",
                onClick: () => {},
                submenus: [
                    {
                        icon: <People />,
                        name: "Usuários",
                        path: "/users",
                        onClick: () => navigate("/users/"),
                        admin: true,
                    },
                    {
                        icon: <SafetyDivider />,
                        name: "Setores",
                        path: "/departments",
                        onClick: () => navigate("/departments/"),
                        admin: true,
                    },
                    {
                        icon: <List />,
                        name: "Logs",
                        path: "/logs",
                        onClick: () => navigate("/logs/"),
                        admin: true,
                    },
                    {
                        icon: <Tune />,
                        name: "Opções",
                        path: "/options",
                        onClick: () => navigate("/options/"),
                    },
                ],
            },
        ]

        return list
    }, [boz])

    return menus
}
