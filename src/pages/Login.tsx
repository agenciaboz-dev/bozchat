import React, { useEffect, useState } from "react"
import { Box, Button, CircularProgress, IconButton, SxProps, TextField } from "@mui/material"
import { Form, Formik } from "formik"
import logo from "../assets/logo.png"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import { useUser } from "../hooks/useUser"
import { useColors } from "../hooks/useColors"
import { ModeToggler } from "../components/ModeToggler"
import { textFieldStyle } from "../style/textfield"
import { useMediaQuery } from "@mui/material"
import { useLocalStorage } from "../hooks/useLocalStorage"
import { useGoogle } from "../hooks/useGoogle"
import { useIo } from "../hooks/useIo"
import { useConfirmDialog } from "burgos-confirm"
import { useNavigate } from "react-router-dom"
import { useSnackbar } from "burgos-snackbar"
import { version } from "../version"

interface LoginProps {}

export const Login: React.FC<LoginProps> = ({}) => {
    const io = useIo()
    const isMobile = useMediaQuery("(orientation: portrait)")
    const colors = useColors()
    const storage = useLocalStorage()
    const google = useGoogle()
    const navigate = useNavigate()

    const { login, googleLogin } = useUser()
    const { confirm } = useConfirmDialog()
    const { snackbar } = useSnackbar()

    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [electron] = useState(window.electron)

    const webkitbg = {
        "& .MuiInputBase-input.MuiOutlinedInput-input:-webkit-autofill": {
            "-webkit-box-shadow": ` 0 0 0 100px ${colors.background.primary} inset`,
            borderRadius: "initial",
        },
    }

    const initialValues: LoginForm = {
        login: "",
        password: "",
    }

    const handleSubmit = (values: LoginForm) => {
        if (loading) return

        login(values, setLoading)
    }

    const handleGoogleButton = async () => {
        if (loading) return

        setLoading(true)
        try {
            if (electron) {
                const code = await electron.ipcRenderer.invoke("google:auth")
                console.log({ code })
                io.emit("google:exchange", code)
            } else {
                google.login()
            }
        } catch (error) {
            console.log(error)
            snackbar({ severity: "error", text: "não foi possível autenticar com Google" })
            setLoading(false)
        }
    }

    useEffect(() => {
        if (electron) {
            const loginData = storage.get("boz:login")
            if (loginData) {
                login(loginData, setLoading)
            }
        }

        io.on("google:login", (user) => {
            setLoading(false)
            googleLogin(user)
            console.log(user)
        })

        io.on("google:login:first", (user: User) => {
            console.log(user)
            setLoading(false)
            confirm({
                title: "Vincular conta google",
                content: `O e-mail ${user.email} já está cadastrado, deseja vincular essa conta do google a esse usuário?`,
                button: "Vincular",
                onConfirm: () => {
                    googleLogin(user)
                    io.emit("google:link", user)
                },
            })
        })

        io.on("google:signup", (googleUser: People) => {
            google.setPeople(googleUser)
            navigate("/signup", { state: { googleUser } })
        })

        return () => {
            io.off("google:login")
            io.off("google:login:first")
            io.off("google:signup")
        }
    }, [])

    return (
        <Box
            sx={{
                backgroundColor: "background.paper",
                width: "100vw",
                height: "100vh",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: isMobile ? "10vw" : "5vw",
            }}
        >
            <img src={logo} alt="agência boz" style={{ aspectRatio: "2/1", width: isMobile ? "70vw" : "24vw" }} />
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {({ values, handleChange }) => (
                    <Form>
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
                                value={values.login}
                                onChange={handleChange}
                                placeholder="nome de usuário, email ou cpf"
                                autoComplete="off"
                                required
                                sx={{ ...textFieldStyle, ...webkitbg }}
                            />
                            <TextField
                                label="senha"
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                type={showPassword ? "text" : "password"}
                                autoComplete="off"
                                required
                                sx={{ ...textFieldStyle, ...webkitbg }}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton onClick={() => setShowPassword(!showPassword)} color="primary">
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    ),
                                }}
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
                            <Button onClick={handleGoogleButton}>google</Button>
                        </Box>
                    </Form>
                )}
            </Formik>
            <ModeToggler top={0} right={0} />
        </Box>
    )
}
