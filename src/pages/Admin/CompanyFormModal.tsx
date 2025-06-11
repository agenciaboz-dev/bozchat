import React, { useEffect, useState } from "react"
import { Box, Button, CircularProgress, Dialog, Grid, IconButton, MenuItem, TextField, useMediaQuery } from "@mui/material"
import { Company, CompanyForm } from "../../types/server/class/Company"
import { Title2 } from "../../components/Title"
import { Close, Visibility, VisibilityOff } from "@mui/icons-material"
import { Signup } from "../Signup/Signup"
import { useColors } from "../../hooks/useColors"
import { useUser } from "../../hooks/useUser"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import { api } from "../../api"
import axios from "axios"
import { CepResult } from "../../types/CepResult"
import { estados } from "../../tools/estadosBrasil"
import { textFieldStyle } from "../../style/textfield"
import MaskedInputComponent from "../../components/MaskedInput"

interface CompanyFormModalProps {
    open: boolean
    onClose: () => void
    onSave: (company: Company) => void
}

export const CompanyFormModal: React.FC<CompanyFormModalProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const colors = useColors()
    const { onLogin } = useUser()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [searchingCep, setSearchingCep] = useState(false)

    const formik = useFormik<CompanyForm>({
        initialValues: {
            user: { email: "", name: "", password: "", company_id: "", admin: true, owner: true },
            address: {
                cep: "",
                city: "",
                complement: "",
                district: "",
                number: "",
                street: "",
                uf: "",
            },
            business_name: "",
            document: "",
            full_name: "",
        },
        async onSubmit(values, formikHelpers) {
            if (loading) return

            setLoading(true)
            try {
                const response = await api.post("/company", values)
                // onLogin(response.data)
                // navigate("/")
                props.onSave(response.data.company)
                props.onClose()
                formik.resetForm()
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

    const searchCep = async (cep: string) => {
        if (searchingCep) return

        try {
            setSearchingCep(true)
            const response = await axios.get(`https://brasilapi.com.br/api/cep/v1/${cep}`)
            const result = response.data as CepResult

            formik.setFieldValue("address.street", result.street)
            formik.setFieldValue("address.district", result.neighborhood)
            formik.setFieldValue("address.city", result.city)
            const uf = estados.find((item) => item.value.toLowerCase() === result.state.toLowerCase())?.value
            if (uf) {
                formik.setFieldValue("address.uf", uf)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setTimeout(() => {
                setSearchingCep(false)
            }, 200)
        }
    }

    useEffect(() => {
        if (formik.values.address.cep.length === 10) {
            searchCep(formik.values.address.cep)
        }
    }, [formik.values.address.cep])

    return (
        <Dialog open={props.open} onClose={props.onClose} PaperProps={{ sx: { maxWidth: isMobile ? "90vw" : "80vw" } }}>
            <Box
                sx={{
                    padding: isMobile ? "5vw" : "1vw",
                    bgcolor: "background.default",
                    flexDirection: "column",
                    width: isMobile ? "90vw" : "70vw",
                    gap: "1vw",
                }}
            >
                <Title2
                    name={"Cadastrar empresa"}
                    right={
                        <IconButton onClick={props.onClose}>
                            <Close />
                        </IconButton>
                    }
                />
                <form onSubmit={formik.handleSubmit}>
                    <Box sx={{ gap: "1vw" }}>
                        <Box sx={{ flexDirection: "column", gap: "1vw", flex: 1 }}>
                            <Title2 name="Empresa" />
                            <TextField
                                value={formik.values.document}
                                onChange={formik.handleChange}
                                name="document"
                                label="CNPJ"
                                sx={{ ...textFieldStyle, ...webkitbg }}
                                autoComplete="off"
                                required
                                InputProps={{ inputComponent: MaskedInputComponent, inputProps: { mask: "00.000.000/0000-00" } }}
                            />
                            <TextField
                                value={formik.values.full_name}
                                onChange={formik.handleChange}
                                name="full_name"
                                label="Razão Social"
                                sx={{ ...textFieldStyle, ...webkitbg }}
                                autoComplete="off"
                                required
                            />
                            <TextField
                                value={formik.values.business_name}
                                onChange={formik.handleChange}
                                name="business_name"
                                label="Nome Fantasia"
                                sx={{ ...textFieldStyle, ...webkitbg }}
                                autoComplete="off"
                                required
                            />
                        </Box>
                        <Box sx={{ flexDirection: "column", gap: "1vw", flex: 1 }}>
                            <Title2 name="Endereço" />
                            <Grid container columns={2} spacing={"1vw"}>
                                <Grid item xs={1}>
                                    <TextField
                                        value={formik.values.address.cep}
                                        onChange={formik.handleChange}
                                        name="address.cep"
                                        label="CEP"
                                        sx={{ ...textFieldStyle, ...webkitbg }}
                                        required
                                        autoComplete="off"
                                        InputProps={{
                                            inputComponent: MaskedInputComponent,
                                            inputProps: { mask: "00.000-000" },
                                            endAdornment: searchingCep ? <CircularProgress size="1.5rem" /> : null,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <TextField
                                        value={formik.values.address.district}
                                        onChange={formik.handleChange}
                                        name="address.district"
                                        label="Bairro"
                                        sx={{ ...textFieldStyle, ...webkitbg }}
                                        required
                                        autoComplete="off"
                                    />
                                </Grid>

                                <Grid item xs={2}>
                                    <TextField
                                        value={formik.values.address.street}
                                        onChange={formik.handleChange}
                                        name="address.street"
                                        label="Logradouro"
                                        sx={{ ...textFieldStyle, ...webkitbg }}
                                        required
                                        autoComplete="off"
                                    />
                                </Grid>

                                <Grid item xs={1}>
                                    <TextField
                                        value={formik.values.address.complement}
                                        onChange={formik.handleChange}
                                        name="address.complement"
                                        label="Complemento"
                                        sx={{ ...textFieldStyle, ...webkitbg }}
                                        autoComplete="off"
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <TextField
                                        value={formik.values.address.number}
                                        onChange={formik.handleChange}
                                        name="address.number"
                                        label="Número"
                                        sx={{ ...textFieldStyle, ...webkitbg }}
                                        required
                                        autoComplete="off"
                                    />
                                </Grid>

                                <Grid item xs={1}>
                                    <TextField
                                        value={formik.values.address.city}
                                        onChange={formik.handleChange}
                                        name="address.city"
                                        label="Cidade"
                                        sx={{ ...textFieldStyle, ...webkitbg }}
                                        required
                                        autoComplete="off"
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <TextField
                                        value={formik.values.address.uf}
                                        onChange={formik.handleChange}
                                        name="address.uf"
                                        label="UF"
                                        sx={{ ...textFieldStyle, ...webkitbg }}
                                        required
                                        autoComplete="off"
                                        select
                                        SelectProps={{
                                            MenuProps: {
                                                MenuListProps: { sx: { maxHeight: "20vw", bgcolor: "background.default", overflowY: "scroll" } },
                                            },
                                        }}
                                    >
                                        {estados.map((uf) => (
                                            <MenuItem key={uf.value} value={uf.value}>
                                                {uf.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ flexDirection: "column", gap: "1vw", flex: 1 }}>
                            <Title2 name="Usuário" />
                            <TextField
                                value={formik.values.user.name}
                                onChange={formik.handleChange}
                                name="user.name"
                                label="Nome"
                                sx={{ ...textFieldStyle, ...webkitbg }}
                                autoComplete="off"
                                required
                            />
                            <TextField
                                value={formik.values.user.email}
                                onChange={formik.handleChange}
                                name="user.email"
                                label="E-mail"
                                sx={{ ...textFieldStyle, ...webkitbg }}
                                required
                                autoComplete="off"
                            />
                            <TextField
                                value={formik.values.user.password}
                                onChange={formik.handleChange}
                                name="user.password"
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
                        </Box>
                    </Box>
                    <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        color: "secondary.main",
                        fontWeight: "bold",
                        alignSelf: 'flex-end'
                    }}
                >
                    {loading ? <CircularProgress size="1.5rem" color="secondary" /> : "cadastrar"}
                </Button>
                </form>
                
            </Box>
        </Dialog>
    )
}
