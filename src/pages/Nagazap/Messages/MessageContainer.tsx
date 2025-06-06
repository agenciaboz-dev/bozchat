import React, { useMemo } from "react"
import { Avatar, Box, MenuItem, Paper, Typography, useMediaQuery } from "@mui/material"
import { NagaMessage, Nagazap } from "../../../types/server/class/Nagazap"
import { TrianguloFudido } from "../../Zap/TrianguloFudido"
import { PhotoView } from "react-photo-view"
import { AudioPlayer } from "../../Washima/AudioComponents/AudioPlayer"
import { useDarkMode } from "../../../hooks/useDarkMode"
import { DeletedMessage } from "../../Zap/DeletedMessage"
import { TemplatePreview } from "../TemplateForm/TemplatePreview"
import { custom_colors } from "../../../style/colors"
import { BotNameChip } from "../../Bots/BotNameChip"
import { InteractiveMessageComponent } from "./InteractiveMessageComponent"

interface MessageContainerProps {
    message: NagaMessage
    nagazap: Nagazap
    inBoards?: boolean
    disabledIcon?: boolean
}

export const MessageContainer: React.FC<MessageContainerProps> = ({ message, nagazap, inBoards, disabledIcon }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()

    const from_me = useMemo(() => message.name === nagazap.displayPhone, [message])

    return (
        <Paper
            elevation={0}
            sx={{
                flexDirection: "column",
                gap: isMobile ? "2vw" : "0.5vw",
                padding: isMobile ? "4vw" : "0.5vw",
                position: "relative",
                borderRadius: "4px",
                borderTopLeftRadius: from_me ? undefined : 0,
                borderTopRightRadius: from_me ? 0 : undefined,
                color: "text.secondary",
                paddingBottom: inBoards ? undefined : message.type === "audio" ? "1vw" : undefined,
                width: "fit-content",
                minWidth: isMobile ? "70%" : "5vw",
                minHeight: "2vw",
                alignSelf: from_me ? "flex-end" : undefined,
                bgcolor:
                    message.type === "sticker"
                        ? "transparent"
                        : from_me
                        ? darkMode
                            ? custom_colors.darkMode_emittedMsg
                            : custom_colors.lightMode_emittedMsg
                        : darkMode
                        ? custom_colors.darkMode_receivedMsg
                        : custom_colors.lightMode_receivedMsg,
                maxWidth: inBoards ? "17vw" : undefined,
                marginBottom: message.type === "sticker" ? "0.5vw" : undefined,
                margin: isMobile ? "1vw 0" : undefined,
            }}
            onClick={() => console.log(message)}
        >
            {/* //* BOT CHIP */}
            {message.from_bot && <BotNameChip name={message.from_bot} />}
            {disabledIcon && <DeletedMessage customText="Tempo de resposta excedido (24 horas)" />}
            {message.media_url && (
                <PhotoView src={message.media_url}>
                    <MenuItem sx={{ padding: 0, justifyContent: "center", pointerEvents: message.type === "sticker" ? "none" : undefined }}>
                        <Avatar
                            variant="rounded"
                            sx={{
                                width:
                                    message.type === "sticker"
                                        ? inBoards
                                            ? "5vw"
                                            : isMobile
                                            ? "33vw"
                                            : "10vw"
                                        : inBoards
                                        ? "15vw"
                                        : isMobile
                                        ? "33vw"
                                        : "20vw",
                                height: "auto",
                                maxHeight: inBoards ? "15vw" : isMobile ? "80vw" : "20vw",
                                borderRadius: message.type === "sticker" ? (isMobile ? "4px" : "0.75vw") : undefined,
                            }}
                            src={message.media_url}
                        />
                    </MenuItem>
                </PhotoView>
            )}
            {/* {(message.type === "text" || message.type === "button" || message.type === "reaction" || message.type === "interactive") && ( */}
            <Typography
                sx={{
                    wordBreak: "break-word",
                    whiteSpace: "pre-line",
                    color: "text.secondary",
                    fontSize: message.type === "reaction" ? "3rem" : undefined,
                    alignSelf: message.type === "reaction" ? "center" : undefined,
                    maxWidth: isMobile ? "100%" : "15vw",
                }}
            >
                {message.text}
            </Typography>
            {/* )} */}

            {message.type === "audio" && (
                <AudioPlayer
                    containerSx={{
                        height: isMobile ? undefined : "3vw",
                        paddingBottom: isMobile ? "4vw" : undefined,
                    }}
                    media={{ source: message.text, ext: message.text.split(".")[message.text.split(".").length - 1] }}
                    inBoards={inBoards}
                />
            )}

            {message.type === "template" && message.template?.components && (
                <Box sx={{ width: inBoards ? "15vw" : "20vw" }}>
                    <TemplatePreview components={message.template.components} realMessage />
                </Box>
            )}

            {message.type === "interactive" && message.template && <InteractiveMessageComponent interactive={message.template} />}

            <Box
                sx={{
                    fontSize: isMobile ? "3vw" : "0.6vw",
                    marginLeft: "auto",
                    position: message.type === "audio" || message.type === "sticker" || message.type === "reaction" ? "absolute" : undefined,
                    right: "0.5vw",
                    bottom: message.type === "sticker" ? "-0.5vw" : "0.5vw",
                    color: "text.secondary",
                }}
            >
                {new Date(Number(message.timestamp)).toLocaleTimeString("pt-br", { hour: "2-digit", minute: "2-digit" })}
            </Box>
            {message.type !== "sticker" && (
                <TrianguloFudido
                    alignment={from_me ? "right" : "left"}
                    color={
                        from_me
                            ? darkMode
                                ? custom_colors.darkMode_emittedMsg
                                : custom_colors.lightMode_emittedMsg
                            : darkMode
                            ? custom_colors.darkMode_receivedMsg
                            : custom_colors.lightMode_receivedMsg
                    }
                />
            )}
        </Paper>
    )
}
