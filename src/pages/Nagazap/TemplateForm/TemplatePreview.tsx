import React from "react"
import { Avatar, Box, Button, Paper, Typography, useMediaQuery } from "@mui/material"
import { TemplateComponent } from "../../../types/server/Meta/WhatsappBusiness/TemplatesInfo"
import { TrianguloFudido } from "../../Zap/TrianguloFudido"
import { Image, LocalPhone, OpenInNew, Reply } from "@mui/icons-material"
import { useDarkMode } from "../../../hooks/useDarkMode"
import { custom_colors } from "../../../style/colors"

interface TemplatePreviewProps {
    components: TemplateComponent[]
    image?: File
    realMessage?: boolean
}

const maxSize = "23vw"

const icons = [
    { type: "QUICK_REPLY", icon: <Reply /> },
    { type: "URL", icon: <OpenInNew /> },
    { type: "PHONE_NUMBER", icon: <LocalPhone /> },
]

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({ components, image, realMessage }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()

    return (
        <Box
            sx={{
                flex: 1,
                overflowY: realMessage ? undefined : "auto",
                flexDirection: "column",
                padding: realMessage ? undefined : isMobile ? "2vw" : "1vw",
                margin: realMessage ? undefined : isMobile ? "-2vw" : "-1vw",
                marginBottom: realMessage ? undefined : isMobile ? "-5vw" : "-2vw",
                paddingBottom: realMessage ? undefined : isMobile ? "5vw" : "2vw",
            }}
        >
            <Paper
                sx={{
                    flexDirection: "column",
                    gap: isMobile ? "2vw" : "1vw",
                    padding: realMessage ? undefined : isMobile ? "4vw" : "0.5vw",
                    position: "relative",
                    borderRadius: "0.5vw",
                    borderTopLeftRadius: 0,
                    color: "text.secondary",
                    bgcolor: realMessage ? "transparent" : undefined,
                }}
                elevation={realMessage ? 0 : undefined}
            >
                {!realMessage && (
                    <TrianguloFudido
                        alignment="left"
                        color={darkMode ? custom_colors.darkMode_templatePreviewTriangle : custom_colors.lightMode_templatePreviewTriangle}
                    />
                )}
                {components.map((component, index) => {
                    if (!component) return null
                    if (component.format == "IMAGE") {
                        const imageSrc = realMessage ? component.text : image ? URL.createObjectURL(image) : undefined
                        return (
                            <Box key={index} sx={{ justifyContent: "center" }}>
                                <Avatar
                                    variant="rounded"
                                    src={imageSrc}
                                    sx={{
                                        width: "100%",
                                        maxWidth: isMobile ? undefined : maxSize,
                                        maxHeight: isMobile ? undefined : maxSize,
                                        objectFit: "cover",
                                        height: imageSrc == undefined ? (isMobile ? "60vw" : maxSize) : "auto",
                                        bgcolor: "background.default",
                                        margin: "   ",
                                    }}
                                >
                                    <Image color="primary" sx={{ width: "30%", height: "auto" }} />
                                </Avatar>
                            </Box>
                        )
                    }
                    if (component.text) {
                        return (
                            <Typography
                                key={index}
                                color="text.secondary"
                                sx={{
                                    whiteSpace: "pre-wrap",
                                    fontWeight: component.type == "HEADER" ? "bold" : undefined,
                                    fontSize: component.type == "FOOTER" ? "0.8rem" : undefined,
                                    opacity: component.type == "FOOTER" ? 0.5 : 1,
                                }}
                            >
                                {component.text}
                            </Typography>
                        )
                    }
                    if (component.buttons) {
                        return (
                            <Box key={index} sx={{ gap: "0.5vw", flexDirection: "column" }}>
                                {component.buttons?.map((button, index) => (
                                    <Button
                                        key={`${button.text}-${index}`}
                                        variant="text"
                                        fullWidth
                                        sx={{ textTransform: "none" }}
                                        startIcon={icons.find((item) => item.type === button.type)?.icon}
                                        onClick={() => button.type === "URL" && window.open(button.url, "_blank")}
                                    >
                                        {button.text}
                                    </Button>
                                ))}
                            </Box>
                        )
                    }
                    return null
                })}
            </Paper>
        </Box>
    )
}
