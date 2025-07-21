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

interface ProvidersProps {
    children: React.ReactNode
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
    return (
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
    )
}
