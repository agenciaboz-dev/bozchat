import React, { useEffect, useState } from "react"
import { Box, Button, CircularProgress, Grid, IconButton, MenuItem, TextField } from "@mui/material"
import { backgroundStyle } from "../../style/background"
import { useFormik } from "formik"
import { UserForm } from "../../types/server/class/User"
import { textFieldStyle } from "../../style/textfield"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useColors } from "../../hooks/useColors"
import { api } from "../../api"
import { useUser } from "../../hooks/useUser"
import { CompanyForm } from "../../types/server/class/Company"
import { Title2 } from "../../components/Title"
import MaskedInputComponent from "../../components/MaskedInput"
import { estados } from "../../tools/estadosBrasil"
import axios from "axios"
import { CepResult } from "../../types/CepResult"

interface SignupProps {}

export const Signup: React.FC<SignupProps> = ({}) => {
    const colors = useColors()
    const { onLogin } = useUser()

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
        <Box sx={{ ...backgroundStyle, justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <img src={"/logos/1.png"} alt="logo" style={{ aspectRatio: "2/1", width: "24vw" }} draggable={false} />
            <Box
                sx={{
                    padding: "3vw",
                    width: "80vw",
                    backgroundColor: "background.default",
                    borderRadius: "2.5vw",
                    flexDirection: "column",
                    gap: "1vw",
                }}
            >
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
                                        required
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
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    color: "secondary.main",
                                    fontWeight: "bold",
                                    flex: 1,
                                }}
                            >
                                {loading ? <CircularProgress size="1.5rem" color="secondary" /> : "cadastrar"}
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Box>
    )
}
