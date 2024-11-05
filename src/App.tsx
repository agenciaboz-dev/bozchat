import "./App.css"
import { BrowserRouter } from "react-router-dom"
import { useMuiTheme } from "./hooks/useMuiTheme"
import { Box, ThemeProvider } from "@mui/material"
import { Providers } from "./Providers"
import { Routes } from "./Routes"
import { DarkModeProvider } from "./contexts/darkModeContext"
import { ThemeProvider as CustomThemeProvider } from "./contexts/themeContext"
import "@mantine/core/styles.css"
import { version } from "./version"
import { Header } from "./components/Header"
import "react-photo-view/dist/react-photo-view.css"


const Themed = () => {
    const theme = useMuiTheme()

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Providers>
                    <Routes />
                    <Box position={"absolute"} bottom={10} right={10} color={"secondary.main"}>
                        v {version}
                    </Box>
                </Providers>
            </BrowserRouter>
        </ThemeProvider>
    )
}

const App = () => {
    Notification.requestPermission()

    return (
        <DarkModeProvider>
            <CustomThemeProvider>
                <Themed />
            </CustomThemeProvider>
        </DarkModeProvider>
    )
}

export default App
