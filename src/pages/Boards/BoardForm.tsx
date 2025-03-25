import React, { useState } from "react"
import { Autocomplete, Box, Button, CircularProgress, TextField } from "@mui/material"
import { useFormik } from "formik"
import { api } from "../../api"
import { useUser } from "../../hooks/useUser"
import { useSnackbar } from "burgos-snackbar"
import { textFieldStyle } from "../../style/textfield"
import { User } from "../../types/server/class/User"
import { Board, BoardForm } from "../../types/server/class/Board/Board"
import { useDarkMode } from "../../hooks/useDarkMode"

interface BoardFormComponentProps {
    onSubmit: (board: Board) => void
    users: User[]
}

export const BoardFormComponent: React.FC<BoardFormComponentProps> = (props) => {
    const { darkMode } = useDarkMode()
    const { company, user } = useUser()
    const { snackbar } = useSnackbar()

    const [loading, setLoading] = useState(false)

    const formik = useFormik<BoardForm>({
        initialValues: {
            name: "",
        },
        async onSubmit(values, formikHelpers) {
            if (loading) return

            setLoading(true)
            try {
                console.log(values)
                const response = await api.post("/company/boards", values, { params: { user_id: user?.id, company_id: company?.id } })
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
        <Box sx={{ flexDirection: "column", flex: 1, gap: "1vw", padding: "1vw" }}>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    required
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    name="name"
                    label="Nome"
                    sx={textFieldStyle({ darkMode })}
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
