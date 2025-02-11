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
    users: User[]
    loading?: boolean
    onSubmit: (user: User) => void
    onDelete: (user: User) => void
}

export const UserForm: React.FC<UserFormProps> = (props) => {
    const { company } = useUser()
    const { confirm } = useConfirmDialog()
    const { snackbar } = useSnackbar()

    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const formik = useFormik<UserFormType>({
        initialValues: selectedUser || {
            name: "",
            admin: false,
            company_id: company!.id,
            email: "",
            owner: false,
            password: "",
            active: true,
        },
        async onSubmit(values, formikHelpers) {
            if (loading || selectedUser?.owner) return

            setLoading(true)
            try {
                console.log(values)
                const response = selectedUser ? await api.patch("/user", values) : await api.post("/user", values)
                props.onSubmit(response.data)
                setSelectedUser(response.data)
                snackbar({ severity: "success", text: "Salvo!" })
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        },
        enableReinitialize: true,
    })

    const onDeleteClick = () => {
        if (!selectedUser || deleting) return
        confirm({
            title: "Deletar usuário",
            content: `Tem certeza que deseja deletar ${selectedUser.name}? Esta ação é permanente!`,
            onConfirm: async () => {
                setDeleting(true)
                try {
                    const response = await api.delete("/user", { params: { user_id: selectedUser.id } })
                    props.onDelete(response.data)
                    setSelectedUser(null)
                } catch (error) {
                    console.log(error)
                } finally {
                    setDeleting(false)
                }
            },
        })
    }

    return (
        <Box sx={{ flexDirection: "column", flex: 1, gap: "1vw" }}>
            <form onSubmit={formik.handleSubmit}>
                <Autocomplete
                    value={selectedUser}
                    onChange={(_, value) => setSelectedUser(value)}
                    //   disablePortal
                    options={props.users}
                    //   sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Selecionar usuário" fullWidth sx={textFieldStyle} />}
                    getOptionLabel={(option) => option.name}
                    ListboxProps={{ sx: { bgcolor: "background.default", width: 1 } }}
                />

                <TextField
                    required
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    name="name"
                    label="Nome"
                    sx={textFieldStyle}
                    disabled={selectedUser?.owner}
                />
                <TextField
                    required
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    name="email"
                    label="E-mail"
                    sx={textFieldStyle}
                    disabled={selectedUser?.owner}
                />
                <TextField
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    name="password"
                    label="Senha"
                    sx={{ ...textFieldStyle }}
                    type={showPassword && !selectedUser?.owner ? "text" : "password"}
                    autoComplete="off"
                    required
                    InputProps={{
                        endAdornment: (
                            <IconButton onClick={() => setShowPassword(!showPassword)} color="primary" disabled={selectedUser?.owner}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        ),
                    }}
                    disabled={selectedUser?.owner}
                />

                <FormControlLabel
                    control={
                        <Switch
                            checked={formik.values.admin}
                            onChange={(_, value) => formik.setFieldValue("admin", value)}
                            disabled={selectedUser?.owner}
                        />
                    }
                    label="Administrador"
                    componentsProps={{ typography: { sx: { color: "secondary.main" } } }}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={formik.values.active}
                            onChange={(_, value) => formik.setFieldValue("active", value)}
                            disabled={selectedUser?.owner}
                        />
                    }
                    label="Ativo"
                    componentsProps={{ typography: { sx: { color: "secondary.main" } } }}
                />

                <Box sx={{ gap: "1vw", flexDirection: "row-reverse" }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            color: "secondary.main",
                            fontWeight: "bold",
                        }}
                        disabled={
                            selectedUser?.owner ||
                            (!!selectedUser &&
                                Object.entries(formik.values).every(([key, value]) => formik.initialValues[key as keyof UserFormType] === value))
                        }
                    >
                        {loading ? <CircularProgress size="1.5rem" color="secondary" /> : selectedUser ? "atualizar" : "cadastrar"}
                    </Button>
                    {!!selectedUser && (
                        <Button disabled={selectedUser?.owner} color="error" onClick={onDeleteClick}>
                            {deleting ? <CircularProgress size="1.5rem" color="error" /> : "Deletar"}
                        </Button>
                    )}
                </Box>
            </form>
        </Box>
    )
}
