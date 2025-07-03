import React, { useEffect, useState } from "react"
import { Autocomplete, Box, Button, CircularProgress, TextField, useMediaQuery } from "@mui/material"
import { Department, DepartmentForm } from "../../types/server/class/Department"
import { useFormik } from "formik"
import { api } from "../../api"
import { useUser } from "../../hooks/useUser"
import { useSnackbar } from "burgos-snackbar"
import { textFieldStyle } from "../../style/textfield"
import { User } from "../../types/server/class/User"
import { useDarkMode } from "../../hooks/useDarkMode"

interface DepartmentFormComponentProps {
    onSubmit: (department: Department) => void
    users: User[]
}

export const DepartmentFormComponent: React.FC<DepartmentFormComponentProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()
    const { company, user } = useUser()
    const { snackbar } = useSnackbar()

    const [loading, setLoading] = useState(false)

    const formik = useFormik<DepartmentForm>({
        initialValues: {
            name: "",
            users: [],
        },
        async onSubmit(values, formikHelpers) {
            if (loading) return

            setLoading(true)
            try {
                console.log(values)
                const response = await api.post("/company/departments", values, { params: { user_id: user?.id, company_id: company?.id } })
                props.onSubmit(response.data)
                snackbar({ severity: "success", text: "Salvo!" })
                formik.resetForm()
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        },
    })

    return (
        <Box
            sx={{
                bgcolor: "background.default",
                flexDirection: "column",
                flex: 1,
                gap: isMobile ? "5vw" : "1vw",
                padding: isMobile ? "5vw" : "1.5vw",
                paddingTop: 0,
            }}
        >
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    required
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    name="name"
                    label="Nome"
                    sx={textFieldStyle({ darkMode })}
                />

                <Autocomplete
                    options={props.users}
                    getOptionLabel={(option) => option.name}
                    value={formik.values.users}
                    multiple
                    onChange={(_, users) => formik.setFieldValue("users", users)}
                    disableCloseOnSelect
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Usuários"
                            multiline
                            sx={{
                                ...textFieldStyle({ darkMode }),
                                "& .MuiInputBase-root": {
                                    flexWrap: "wrap",
                                    alignItems: "flex-start",
                                },
                            }}
                        />
                    )}
                    ChipProps={{ size: "small", color: "primary" }}
                />

                <Box sx={{ justifyContent: "flex-end" }}>
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
