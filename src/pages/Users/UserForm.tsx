import React, { useState } from "react"
import { Autocomplete, Box, Button, CircularProgress, FormControlLabel, FormLabel, IconButton, Switch, TextField } from "@mui/material"
import { User, UserForm as UserFormType } from "../../types/server/class/User"
import { textFieldStyle } from "../../style/textfield"
import { useFormik } from "formik"
import { useUser } from "../../hooks/useUser"
import { Key, Visibility, VisibilityOff } from "@mui/icons-material"
import { api } from "../../api"
import { useConfirmDialog } from "burgos-confirm"
import { useSnackbar } from "burgos-snackbar"

interface UserFormProps {
    loading?: boolean
    onSubmit: (user: User) => void
}

export const UserForm: React.FC<UserFormProps> = (props) => {
    const { company, user } = useUser()
    const { confirm } = useConfirmDialog()
    const { snackbar } = useSnackbar()

    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const formik = useFormik<UserFormType>({
        initialValues: {
            name: "",
            admin: false,
            company_id: company!.id,
            email: "",
            owner: false,
            password: "",
            active: true,
        },
        async onSubmit(values, formikHelpers) {
            if (loading) return

            setLoading(true)
            try {
                console.log(values)
                const response = await api.post("/user", values, { params: { user_id: user?.id } })
                props.onSubmit(response.data)
                snackbar({ severity: "success", text: "Salvo!" })
                formik.resetForm()
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        },
        enableReinitialize: true,
    })

    return (
        <Box sx={{ flexDirection: "column", flex: 1, gap: "1vw", padding: "1vw" }}>
            <form onSubmit={formik.handleSubmit}>
                <TextField required value={formik.values.name} onChange={formik.handleChange} name="name" label="Nome" sx={textFieldStyle} />
                <TextField required value={formik.values.email} onChange={formik.handleChange} name="email" label="E-mail" sx={textFieldStyle} />
                <TextField
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    name="password"
                    label="Senha"
                    sx={{ ...textFieldStyle }}
                    autoComplete="off"
                    required
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                        endAdornment: (
                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                {!showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        ),
                    }}
                />

                <Box sx={{ gap: "1vw", flexDirection: "row-reverse" }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            color: "secondary.main",
                            fontWeight: "bold",
                        }}
                    >
                        {loading ? <CircularProgress size="1.5rem" color="secondary" /> : "cadastrar"}
                    </Button>
                </Box>
            </form>
        </Box>
    )
}
