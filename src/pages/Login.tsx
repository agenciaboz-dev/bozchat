import React, { useEffect, useState } from "react"
import { Box, Button, CircularProgress, IconButton, SxProps, TextField } from "@mui/material"
import { useFormik } from "formik"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import { useUser } from "../hooks/useUser"
import { useColors } from "../hooks/useColors"
import { textFieldStyle } from "../style/textfield"
import { useMediaQuery } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { LoginForm } from "../types/server/LoginForm"
import { api } from "../api"
import { backgroundStyle } from "../style/background"
import { User } from "../types/server/class/User"
import { Company } from "../types/server/class/Company"
import { useDarkMode } from "../hooks/useDarkMode"
import { ThemeSwitch } from "./Settings/ThemeSwitch"

interface LoginProps {}

export const Login: React.FC<LoginProps> = ({}) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const colors = useColors()
    const { darkMode } = useDarkMode()

    const { onLogin } = useUser()
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loginError, setLoginError] = useState("")

    const formik = useFormik<LoginForm>({
        initialValues: { login: "", password: "" },
        async onSubmit(values, formikHelpers) {
            if (loading) return
            setLoading(true)
            setLoginError("")
            try {
                const response = await api.post("/user/login", values)
                const user_and_company = response.data as { user: User; company: Company }
                if (user_and_company) {
                    if (user_and_company.user.active) {
                        onLogin(user_and_company)
                    } else {
                        setLoginError("Esse usuário está desativado. Entre em contato com um administrador da sua empresa")
                    }
                } else {
                    setLoginError("Credenciais inválidas")
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        },
    })

    return (
        <Box sx={{ ...backgroundStyle, justifyContent: "center", alignItems: "center", flexDirection: "column", gap: isMobile ? "10vw" : "0" }}>
            <img src={"/wagazap.svg"} alt="logo" style={{ aspectRatio: "2/1", width: isMobile ? "70vw" : "24vw" }} draggable={false} />
            <form onSubmit={formik.handleSubmit}>
                <Box
                    sx={{
                        padding: isMobile ? "6vw" : "3vw",
                        width: isMobile ? "80vw" : "30vw",
                        backgroundColor: "background.default",
                        borderRadius: isMobile ? "5vw" : "2.5vw",
                        flexDirection: "column",
                        gap: isMobile ? "4vw" : "1vw",
                    }}
                >
                    <TextField
                        label="login"
                        name="login"
                        value={formik.values.login}
                        onChange={formik.handleChange}
                        placeholder="nome de usuário, email ou cpf"
                        autoComplete="off"
                        required
                        sx={textFieldStyle({ darkMode })}
                        error={!!loginError}
                    />
                    <TextField
                        label="senha"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        type={showPassword ? "text" : "password"}
                        autoComplete="off"
                        required
                        sx={textFieldStyle({ darkMode })}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={() => setShowPassword(!showPassword)} color="primary">
                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                            ),
                        }}
                        helperText={loginError}
                        error={!!loginError}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            color: "secondary.main",
                            fontWeight: "bold",
                            // width: "50%",
                            // alignSelf: "flex-end",
                        }}
                    >
                        {loading ? <CircularProgress size="1.5rem" color="secondary" /> : "entrar"}
                    </Button>
                </Box>
            </form>
            <ThemeSwitch />
        </Box>
    )
}
