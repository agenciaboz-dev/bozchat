import { ConfirmDialog, ConfirmDialogProvider } from "burgos-confirm"
import { Snackbar, SnackbarProvider } from "burgos-snackbar"
import React from "react"
import { UserProvider } from "./contexts/userContext"
import { MenuProvider } from "./contexts/menuContext"
import { MenuDrawer } from "./components/MenuDrawer/MenuDrawer"
import { MantineProvider } from "@mantine/core"
import { IoProvider } from "./contexts/ioContext"
import { PhotoProvider } from "react-photo-view"

interface ProvidersProps {
    children: React.ReactNode
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
    return (
        <MantineProvider>
            <SnackbarProvider>
                <ConfirmDialogProvider>
                    <IoProvider>
                        <UserProvider>
                            <MenuProvider>
                                <PhotoProvider>
                                    <MenuDrawer />
                                    <Snackbar />
                                    <ConfirmDialog />
                                    {children}
                                </PhotoProvider>
                            </MenuProvider>
                        </UserProvider>
                    </IoProvider>
                </ConfirmDialogProvider>
            </SnackbarProvider>
        </MantineProvider>
    )
}
