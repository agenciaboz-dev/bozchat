import React, { useState } from "react"
import { Box, Button, CircularProgress, IconButton, TextField } from "@mui/material"
import { backgroundStyle } from "../../style/background"
import { useFormik } from "formik"
import { UserForm } from "../../types/server/class/User"
import { textFieldStyle } from "../../style/textfield"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useColors } from "../../hooks/useColors"
import { api } from "../../api"
import { useUser } from "../../hooks/useUser"

interface SignupProps {}

export const Signup: React.FC<SignupProps> = ({}) => {
    const colors = useColors()
    const { onLogin } = useUser()

    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const formik = useFormik<UserForm>({
        initialValues: { email: "", name: "", password: "" },
        async onSubmit(values, formikHelpers) {
            if (loading) return
            try {
                const response = await api.post("/user", values)
                onLogin(response.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        },
    })

    const webkitbg = {
        "& .MuiInputBase-input.MuiOutlinedInput-input:-webkit-autofill": {
            "-webkit-box-shadow": ` 0 0 0 100px ${colors.background.primary} inset`,
            borderRadius: "initial",
        },
    }

    return (
        <Box sx={{ ...backgroundStyle, justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <img src={"/wagazap.svg"} alt="logo" style={{ aspectRatio: "2/1", width: "24vw" }} draggable={false} />
            <Box
                sx={{
                    padding: "3vw",
                    width: "30vw",
                    backgroundColor: "background.default",
                    borderRadius: "2.5vw",
                    flexDirection: "column",
                    gap: "1vw",
                }}
            >
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        name="name"
                        label="Nome"
                        sx={{ ...textFieldStyle, ...webkitbg }}
                        autoComplete="off"
                        required
                    />
                    <TextField
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        name="email"
                        label="E-mail"
                        sx={{ ...textFieldStyle, ...webkitbg }}
                        required
                        autoComplete="off"
                    />
                    <TextField
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        name="password"
                        label="Senha"
                        sx={{ ...textFieldStyle, ...webkitbg }}
                        type={showPassword ? "text" : "password"}
                        autoComplete="off"
                        required
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={() => setShowPassword(!showPassword)} color="primary">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
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
                        {loading ? <CircularProgress size="1.5rem" color="secondary" /> : "cadastrar"}
                    </Button>
                </form>
            </Box>
        </Box>
    )
}
