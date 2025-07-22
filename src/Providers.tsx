import { ConfirmDialogProvider } from "burgos-confirm"
import { Snackbar, SnackbarProvider } from "burgos-snackbar"
import React from "react"
import { UserProvider } from "./contexts/userContext"
import { MenuProvider } from "./contexts/menuContext"
import { MenuDrawer } from "./components/MenuDrawer/MenuDrawer"
import { MantineProvider } from "@mantine/core"
import { IoProvider } from "./contexts/ioContext"
import { PhotoProvider } from "react-photo-view"
import { WashimaInputContextProvider } from "./contexts/washimaInputContext"
import { ConfirmDialog } from "./components/ConfirmDialog"
import { ReactFlowProvider } from "@xyflow/react"
import { BotProvider } from "./contexts/bot.context"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import "dayjs/locale/pt-br"

interface ProvidersProps {
    children: React.ReactNode
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <MantineProvider>
                <SnackbarProvider>
                    <ConfirmDialogProvider>
                        <WashimaInputContextProvider>
                            <IoProvider>
                                <UserProvider>
                                    <MenuProvider>
                                        <PhotoProvider>
                                            <BotProvider>
                                                <ReactFlowProvider>
                                                    <QueryClientProvider client={new QueryClient()}>
                                                        <MenuDrawer />
                                                        <Snackbar />
                                                        <ConfirmDialog />
                                                        {children}
                                                    </QueryClientProvider>
                                                </ReactFlowProvider>
                                            </BotProvider>
                                        </PhotoProvider>
                                    </MenuProvider>
                                </UserProvider>
                            </IoProvider>
                        </WashimaInputContextProvider>
                    </ConfirmDialogProvider>
                </SnackbarProvider>
            </MantineProvider>
        </LocalizationProvider>
    )
}
