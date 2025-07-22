import React, { useEffect, useMemo, useRef, useState } from "react"
import { Box, Button, ClickAwayListener, Divider, IconButton, LinearProgress, Paper, Popper, Tooltip, Typography } from "@mui/material"
import { Android, Circle, Close } from "@mui/icons-material"
import { Bot, PauseBotForm } from "../../../../types/server/class/Bot/Bot"
import { api } from "../../../../api"
import { useUser } from "../../../../hooks/useUser"
import { useIo } from "../../../../hooks/useIo"
import { Title2 } from "../../../../components/Title"
import { DateTimePicker, MobileDateTimePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { PickerValue } from "@mui/x-date-pickers/internals"

interface BotActivityProps {
    chat_id: string
}

export const BotActivity: React.FC<BotActivityProps> = (props) => {
    const { user, company } = useUser()
    const io = useIo()
    const datetimeAnchorRef = useRef<HTMLDivElement>(null)

    const [loading, setLoading] = useState(false)
    const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null)
    const [bot, setBot] = useState<Bot | null>(null)
    const [datepicker, setDatepicker] = useState(false)

    const botStatus = useMemo(
        () =>
            bot
                ? bot.active_on.find((active_chat) => active_chat.chat_id === props.chat_id)
                    ? "active"
                    : bot.paused_chats.get(props.chat_id)
                    ? "paused"
                    : "bugged"
                : "unactive",
        [bot, props.chat_id]
    )

    const botLabel = useMemo(
        () =>
            bot
                ? botStatus === "active"
                    ? `Bot ativo agora: ${bot.name}`
                    : botStatus === "paused"
                    ? `Bot interrompido ${
                          bot.paused_chats.get(props.chat_id)?.expiry
                              ? `até ${new Date(bot.paused_chats.get(props.chat_id)!.expiry!).toLocaleString("pt-br")}`
                              : "indefinidamente"
                      }`
                    : `Bot com status bugado ${bot.name}`
                : "Nenhum bot ativo nesta conversa",
        [botStatus, bot]
    )

    const params = { company_id: company?.id, user_id: user?.id, chat_id: props.chat_id, bot_id: bot?.id }

    const parseBot = (bot?: Bot) => {
        if (bot) {
            bot.active_on = eval("(" + bot.active_on + ")")
            bot.paused_chats = eval("(" + bot.paused_chats + ")")
            setBot(bot)
        } else {
            setBot(null)
        }
    }

    const fetchCurrentBot = async () => {
        setLoading(true)
        try {
            const response = await api.get("/company/bots/active-on", {
                params: { company_id: company?.id, user_id: user?.id, chat_id: props.chat_id },
            })
            parseBot(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setTimeout(() => setLoading(false), 1000)
        }
    }

    const pauseBot = async (until?: PickerValue) => {
        try {
            setLoading(true)
            const data: PauseBotForm = { chat_id: props.chat_id, until: until?.toDate().getTime() }
            const response = await api.post("/company/bots/pause", data, { params })

            parseBot(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const resumeBots = async () => {
        try {
            setLoading(true)
            const response = await api.post("/company/bots/resume", null, { params })
            setBot(null)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        console.log(bot)
    }, [bot])

    useEffect(() => {
        fetchCurrentBot()

        // io.on(`bot:activity:${props.chat_id}`, (bot) => {
        //     setActiveBot(bot)
        // })

        // io.on(`bot:paused:${props.chat_id}`, (bot) => {
        //     setPausedBot(bot)
        // })

        if (menuAnchor) {
            return () => {
                setDatepicker(false)
            }
        }

        return () => {
            io.off(`bot:activity:${props.chat_id}`)
            io.off(`bot:paused:${props.chat_id}`)
        }
    }, [props.chat_id, menuAnchor])

    return (
        <Box>
            <Tooltip title={"Ver ou alterar status do Bot neste contato"} arrow>
                <IconButton onClick={(ev) => setMenuAnchor(ev.currentTarget)}>
                    <Android />
                </IconButton>
            </Tooltip>

            <Popper open={!!menuAnchor} anchorEl={menuAnchor} placement="bottom-start">
                <ClickAwayListener onClickAway={() => setMenuAnchor(null)}>
                    <Paper sx={{ bgcolor: "background.default", padding: 2, flexDirection: "column", gap: 1 }} elevation={5} ref={datetimeAnchorRef}>
                        <Title2
                            name="Atividade do Bot"
                            right={
                                <IconButton onClick={() => setMenuAnchor(null)}>
                                    <Close />
                                </IconButton>
                            }
                        />

                        {loading && <LinearProgress variant="indeterminate" />}
                        {!loading && (
                            <Box sx={{ alignItems: "center", gap: 1 }}>
                                <Circle
                                    fontSize="small"
                                    color={
                                        bot
                                            ? botStatus === "active"
                                                ? "success"
                                                : botStatus === "paused"
                                                ? bot.paused_chats.get(props.chat_id)?.expiry
                                                    ? "warning"
                                                    : "error"
                                                : "error"
                                            : "disabled"
                                    }
                                />
                                <Typography color={"secondary"}>{botLabel}</Typography>
                            </Box>
                        )}

                        <Divider />
                        <Typography color="secondary" variant="subtitle2">
                            Você pode interromper e retomar qualquer interação dos bots com este contato pelos botões abaixo
                        </Typography>

                        <Box sx={{ justifyContent: "flex-end", gap: 1 }}>
                            {botStatus === "paused" ? (
                                <Button disabled={loading} variant="contained" onClick={() => resumeBots()}>
                                    Retomar
                                </Button>
                            ) : (
                                <>
                                    <Button disabled={loading} variant="outlined" onClick={() => pauseBot()} color="error">
                                        Interromper indefinidamente
                                    </Button>
                                    <Button disabled={loading} variant="contained" onClick={() => setDatepicker(true)}>
                                        Interromper provisoriamente
                                    </Button>
                                </>
                            )}
                        </Box>
                        <DateTimePicker
                            open={datepicker}
                            onOpen={() => setDatepicker(true)}
                            onClose={() => setDatepicker(false)}
                            label="Data e hora"
                            slotProps={{
                                textField: { size: "small", sx: { display: "none" } },
                                desktopPaper: { sx: { bgcolor: "background.default" } },
                                mobilePaper: { sx: { bgcolor: "background.default" } },
                                popper: {
                                    anchorEl: datetimeAnchorRef.current,
                                    placement: "bottom-end",
                                },
                            }}
                            // onChange={(value) => console.log(value?.toDate())}
                            defaultValue={dayjs()}
                            onAccept={(value) => pauseBot(value)}
                            ampm={false}
                            disablePast
                            // orientation="portrait"
                        />
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </Box>
    )
}
