import React, { useEffect, useState } from "react"
import { Box, Button, CircularProgress, IconButton, Paper, SxProps, TextField, Typography } from "@mui/material"
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
import { ThemeSwitch } from "../components/ThemeSwitch"

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

    return isMobile ? (
        <Box sx={{ ...backgroundStyle, justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "10vw" }}>
            <img src={"/logos/1.png"} alt="logo" style={{ aspectRatio: "2/1", width: "70vw" }} draggable={false} />
            <Typography variant="h2" component="h2" fontWeight={"bold"} fontSize={"2rem"} color={"text.secondary"} sx={{ alignSelf: "center" }}>
                Login
            </Typography>
            <form onSubmit={formik.handleSubmit}>
                <Box
                    sx={{
                        padding: "6vw",
                        width: "100%",
                        backgroundColor: "background.default",
                        flexDirection: "column",
                        gap: "4vw",
                    }}
                >
                    <Box
                        sx={{
                            flexDirection: "column",
                            gap: "3px",
                        }}
                    >
                        <Typography component="label" fontWeight={"bold"} fontSize={"1rem"} color={"text.secondary"}>
                            Nome de usuário, e-mail ou CPF
                        </Typography>
                        <TextField
                            name="login"
                            value={formik.values.login}
                            onChange={formik.handleChange}
                            placeholder="Digite seu login"
                            autoComplete="off"
                            required
                            sx={textFieldStyle({ darkMode })}
                            error={!!loginError}
                        />
                    </Box>
                    <Box
                        sx={{
                            flexDirection: "column",
                            gap: "3px",
                        }}
                    >
                        <Typography component="label" fontWeight={"bold"} fontSize={"1rem"} color={"text.secondary"}>
                            Senha
                        </Typography>
                        <TextField
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            placeholder="Digite sua senha"
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
                    </Box>
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
            <ThemeSwitch sx={{ marginTop: undefined, position: "absolute", bottom: "5vw" }} />
        </Box>
    ) : (
        <Box sx={{ height: "100%", bgcolor: "background.default" }}>
            <Paper
                sx={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: darkMode ? "background.paper" : "primary.main",
                    height: "100%",
                    flex: 0.5,
                }}
            >
                <form onSubmit={formik.handleSubmit}>
                    <Box
                        sx={{
                            padding: "1vw",
                            width: "25vw",
                            flexDirection: "column",
                            gap: "2vw",
                        }}
                    >
                        <Typography variant="h2" component="h2" fontWeight={"bold"} fontSize={"3.4rem"} color={"secondary.main"}>
                            Login
                        </Typography>
                        <Box
                            sx={{
                                flexDirection: "column",
                                gap: "5px",
                            }}
                        >
                            <Typography component="label" fontWeight={"bold"} fontSize={"1.4rem"} color={"secondary.main"}>
                                Nome de usuário, e-mail ou CPF
                            </Typography>
                            <TextField
                                name="login"
                                value={formik.values.login}
                                onChange={formik.handleChange}
                                placeholder="Digite seu login"
                                autoComplete="off"
                                required
                                sx={{
                                    ...textFieldStyle({ darkMode }),
                                    "& .MuiInputBase-root:not(.MuiInputBase-multiline)": {
                                        height: undefined,
                                    },
                                }}
                                InputProps={{
                                    sx: { bgcolor: "background.default" },
                                }}
                                error={!!loginError}
                            />
                        </Box>
                        <Box
                            sx={{
                                flexDirection: "column",
                                gap: "5px",
                            }}
                        >
                            <Typography component="label" fontWeight={"bold"} fontSize={"1.4rem"} color={"secondary.main"}>
                                Senha
                            </Typography>
                            <TextField
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                placeholder="Digite sua senha"
                                type={showPassword ? "text" : "password"}
                                autoComplete="off"
                                required
                                sx={{
                                    ...textFieldStyle({ darkMode }),
                                    "& .MuiInputBase-root:not(.MuiInputBase-multiline)": {
                                        height: undefined,
                                    },
                                }}
                                InputProps={{
                                    sx: { bgcolor: "background.default" },
                                    endAdornment: (
                                        <IconButton onClick={() => setShowPassword(!showPassword)} color="primary">
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    ),
                                }}
                                helperText={loginError}
                                error={!!loginError}
                            />
                        </Box>
                        <Button
                            type="submit"
                            variant="contained"
                            // color={darkMode ? "primary" : "secondary"}
                            sx={{
                                fontWeight: "bold",
                                alignSelf: "flex-end",
                                bgcolor: darkMode ? "primary.dark" : "background.default",
                                color: darkMode ? "secondary.main" : "text.secondary",
                                "&:hover": {
                                    bgcolor: darkMode ? "primary.main" : "secondary.main",
                                },
                            }}
                        >
                            {loading ? <CircularProgress size="1.5rem" sx={{ color: "text.secondary" }} /> : "entrar"}
                        </Button>
                    </Box>
                </form>
            </Paper>
            <Box
                sx={
                    darkMode
                        ? { ...backgroundStyle, justifyContent: "center", alignItems: "center" }
                        : {
                              display: "flex",
                              flexDirection: "column",
                              flex: 1,
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "white",
                          }
                }
            >
                <Box sx={{ flexDirection: "column", gap: "2vw", color: "text.secondary", maxWidth: "85%" }}>
                    <img src={"/logos/1.png"} alt="logo" style={{ width: "8vw" }} draggable={false} />
                    <Typography variant="h2" component="h2" fontWeight={"bold"} fontSize={"3.4rem"}>
                        Acesse seu perfil!
                    </Typography>
                    <Typography component="p" fontSize={"1.4rem"}>
                        Faça login para acessar sua conta e aproveitar todos os recursos do ChatBoz. Gerencie seus números, personalize suas
                        configurações e acompanhe o desenvolvimento dos seus projetos com facilidade.
                    </Typography>
                </Box>
                <Box
                    sx={{
                        position: "absolute",
                        top: "1vw",
                        right: "1vw",
                        alignItems: "center",
                    }}
                >
                    <ThemeSwitch sx={{ marginTop: undefined }} />
                </Box>
            </Box>
        </Box>
    )
}
