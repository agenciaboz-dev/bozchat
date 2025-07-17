import React, { Dispatch, SetStateAction, useState } from "react"
import { Box, Button, Chip, CircularProgress, Grid, IconButton, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"
import { Subroute } from "./Subroute"
import { useFormik } from "formik"
import { Nagazap, NagazapForm as NagazapFormType } from "../../types/server/class/Nagazap"
import { useUser } from "../../hooks/useUser"
import { textFieldStyle } from "../../style/textfield"
import { api } from "../../api"
import { AxiosError } from "axios"
import { HandledError } from "../../types/server/class/HandledError"
import { ArrowBack, CopyAll } from "@mui/icons-material"
import { useDarkMode } from "../../hooks/useDarkMode"
import { InlineTypography } from "../../components/InlineTypography"
import { useClipboard } from "@mantine/hooks"
import { useSnackbar } from "burgos-snackbar"

interface NagazapFormProps {
    onSuccess: (nagazap: Nagazap) => void
    setShowInformations: Dispatch<SetStateAction<boolean>>
}

const urls = {
    webhook: "https://apichat.boz.app.br/nagazap/webhook/messages",
    system_users: "https://business.facebook.com/settings/system-users",
    accounts: "https://business.facebook.com/settings/whatsapp-business-accounts/",
    facebook_developers: "https://developers.facebook.com/apps/",
}

const webhooks = [
    "message_template_quality_update",
    "message_template_status_update",
    "messages",
    "phone_number_name_update",
    "phone_number_quality_update",
    "template_category_update",
]

export const NagazapForm: React.FC<NagazapFormProps> = ({ onSuccess, setShowInformations }) => {
    const { darkMode } = useDarkMode()
    const { company, user } = useUser()
    const theme = useTheme()
    const isMobile = useMediaQuery("(orientation: portrait)")
    const clipboard = useClipboard({ timeout: 1000 })
    const { snackbar } = useSnackbar()

    const copy = (text: string) => {
        clipboard.copy(text)
        snackbar({ severity: "success", text: "copiado" })
    }

    const PrimaryText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <span style={{ color: theme.palette.primary.main }}>{children}</span>
    )

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const formik = useFormik<NagazapFormType>({
        initialValues: { appId: "", businessId: "", companyId: company?.id || "", phoneId: "", token: "" },
        async onSubmit(values, formikHelpers) {
            if (loading) return
            setLoading(true)
            setError("")

            try {
                const response = await api.post("/nagazap", values, { params: { user_id: user?.id } })
                onSuccess(response.data)
            } catch (error) {
                // console.log(error)
                if (error instanceof AxiosError && error.response?.status === 400) {
                    const handled_error = error.response?.data as HandledError
                    setError(handled_error.text)
                }
            } finally {
                setLoading(false)
            }
        },
    })

    return (
        <Subroute
            title="Adicionar conta"
            left={
                isMobile ? (
                    <IconButton
                        onClick={() => {
                            setShowInformations(false)
                        }}
                    >
                        <ArrowBack />
                    </IconButton>
                ) : undefined
            }
        >
            <Box sx={{ flex: 1, flexDirection: "column", gap: 3, color: "text.secondary" }}>
                <p>
                    Para cadastrar uma conta no Broadcast, é preciso ter uma <PrimaryText>MBA (Meta Business Account)</PrimaryText> ativa com um App
                    adicionado e configurado para usar o Whatsapp. Todos os IDs abaixo podem ser coletados do painel do App no Meta.
                </p>
                <p>App ID: localizado no canto superior esquerdo, no painel do App.</p>
                <p>
                    Token, Phone ID, Business ID: No painel do App, no menu a esquerda. Expanda <PrimaryText>Whatsapp</PrimaryText> e selecione{" "}
                    <PrimaryText>configuração da API</PrimaryText>. O Token é gerado na primeira seção dessa página, e logo abaixo estão os IDs que
                    faltam.
                </p>

                <Typography sx={{ fontWeight: "bold", color: "primary.main" }}>Token permanente</Typography>
                <Typography>
                    1. Adicione um usuário do sistema ao seu aplicativo do Facebook se ele ainda não existir. Certifique-se de que ele tenha a função
                    de administrador.
                    <InlineTypography url={urls.system_users}>({urls.system_users})</InlineTypography>
                </Typography>

                <Typography>
                    2. Na mesma página, na seção <InlineTypography highlight>Ativos atribuídos</InlineTypography> ou{" "}
                    <InlineTypography highlight>Assigned Assets</InlineTypography>, verifique se seu aplicativo está listado aqui. Caso contrário,
                    adicione seu aplicativo por meio do botão <InlineTypography highlight>Adicionar ativo</InlineTypography> ou{" "}
                    <InlineTypography highlight>Add asset</InlineTypography>, concedendo <InlineTypography highlight>Controle total</InlineTypography>{" "}
                    sobre seu aplicativo.
                </Typography>
                <Typography>
                    3. Adicione o usuário do sistema à sua conta do Whatsapp na seção <InlineTypography highlight>Pessoas</InlineTypography>,
                    concedendo <InlineTypography highlight>Controle total</InlineTypography> sobre sua conta do Whatsapp.{" "}
                    <InlineTypography url={urls.accounts}>({urls.accounts})</InlineTypography>
                </Typography>
                <Typography>
                    4. Agora clique no botão <InlineTypography highlight>Gerar novo token</InlineTypography> para o usuário do sistema criado acima,
                    que revela um pop-up <InlineTypography highlight>Gerar token</InlineTypography>. Selecione as 2 permissões{" "}
                    <InlineTypography highlight>whatsapp_business_management</InlineTypography> e{" "}
                    <InlineTypography highlight>whatsapp_business_messaging</InlineTypography> e confirme.
                </Typography>

                <Typography>
                    5. Um novo token de acesso é apresentado a você como um link. Clique nele e armazene o token gerado com segurança, pois ele não
                    será armazenado para você pelo Facebook. Este token não expirará.
                </Typography>

                <Typography sx={{ fontWeight: "bold", color: "primary.main" }}>Configurar webhooks</Typography>
                <Typography>
                    1. Acesse o site do Facebook for Developers. Vá para:{" "}
                    <InlineTypography url={urls.facebook_developers}>{urls.facebook_developers}</InlineTypography>
                </Typography>

                <Typography>2. Selecione o seu aplicativo. Na lista de aplicativos, clique no nome do app que você quer configurar.</Typography>

                <Typography>
                    3. Acesse as configurações do WhatsApp. No menu lateral esquerdo: Clique em{" "}
                    <InlineTypography highlight>WhatsApp</InlineTypography>. Em seguida, selecione{" "}
                    <InlineTypography highlight>Configurações</InlineTypography> (ou <InlineTypography highlight>Configuration</InlineTypography>).
                </Typography>

                <Box sx={{ alignItems: "center", gap: "1vw", margin: "-0.5vw 0" }}>
                    <Typography sx={{}}>4. Configure o webhook. No campo Callback URL, insira a seguinte URL: </Typography>
                    <TextField
                        value={urls.webhook}
                        sx={{ flex: 0.7 }}
                        variant="standard"
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={() => copy(urls.webhook)}>
                                    <CopyAll />
                                </IconButton>
                            ),
                        }}
                    />
                </Box>

                <Typography>
                    5. No campo Token de Verificação, insira o CNPJ da sua empresa (o mesmo usado no cadastro), sem pontos, traços ou espaços.
                    Exemplo: 12345678000199
                </Typography>

                <Typography>
                    6. Salve as alterações. Após preencher os campos, clique em <InlineTypography highlight>Verificar</InlineTypography> e{" "}
                    <InlineTypography highlight>Salvar</InlineTypography> ou o botão correspondente na interface.
                </Typography>

                <Typography>
                    7. Ainda na seção de Webhook, você verá uma lista chamada{" "}
                    <InlineTypography highlight>Campos de Webhook (Webhook Fields)</InlineTypography>. Marque os seguintes campos:{" "}
                    {webhooks.map((hook) => (
                        <Chip label={hook} key={hook} size="small" sx={{ marginRight: "0.5vw" }} onClick={() => copy(hook)} />
                    ))}
                </Typography>

                <form onSubmit={formik.handleSubmit}>
                    <Box sx={{ fontWeight: "bold", color: "primary.main" }}>Formulário</Box>
                    <Grid container columns={isMobile ? 1 : 3} spacing={3}>
                        <Grid item xs={1}>
                            <TextField
                                label="Business Id"
                                name="businessId"
                                value={formik.values.businessId}
                                onChange={formik.handleChange}
                                sx={textFieldStyle({ darkMode })}
                                required
                                error={!!error}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <TextField
                                label="App Id"
                                name="appId"
                                value={formik.values.appId}
                                onChange={formik.handleChange}
                                sx={textFieldStyle({ darkMode })}
                                required
                                error={!!error}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <TextField
                                label="Phone Id"
                                name="phoneId"
                                value={formik.values.phoneId}
                                onChange={formik.handleChange}
                                sx={textFieldStyle({ darkMode })}
                                required
                                error={!!error}
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        label="Token"
                        name="token"
                        value={formik.values.token}
                        onChange={formik.handleChange}
                        sx={textFieldStyle({ darkMode })}
                        required
                        error={!!error}
                        helperText={error}
                        multiline
                        maxRows={2}
                        minRows={2}
                    />

                    <Button variant="contained" sx={{ alignSelf: "flex-end", color: "secondary.main" }} type="submit">
                        {loading ? <CircularProgress size="1.5rem" color="secondary" /> : "Enviar"}
                    </Button>
                </form>
            </Box>
        </Subroute>
    )
}
