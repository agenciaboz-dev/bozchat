import React from "react"
import { Avatar, Box, Button, Paper, Typography, useMediaQuery } from "@mui/material"
import { TemplateComponent } from "../../../types/server/Meta/WhatsappBusiness/TemplatesInfo"
import { TrianguloFudido } from "../../Zap/TrianguloFudido"
import { Image, LocalPhone, OpenInNew, Reply } from "@mui/icons-material"

interface TemplatePreviewProps {
    components: TemplateComponent[]
    image?: File
}

const maxSize = "23vw"

const icons = [
    { type: "QUICK_REPLY", icon: <Reply /> },
    { type: "URL", icon: <OpenInNew /> },
    { type: "PHONE_NUMBER", icon: <LocalPhone /> },
]

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({ components, image }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")

    return (
        <Box
            sx={{
                flex: 1,
                overflowY: "auto",
                maxHeight: "36vw",
                flexDirection: "column",
                padding: "1vw",
                margin: "-1vw",
                marginBottom: "-2vw",
                paddingBottom: "2vw",
            }}
        >
            <Paper
                sx={{
                    flexDirection: "column",
                    gap: isMobile ? "2vw" : "1vw",
                    padding: isMobile ? "4vw" : "0.5vw",
                    position: "relative",
                    borderRadius: "0.5vw",
                    borderTopLeftRadius: 0,
                    color: "secondary.main",
                }}
            >
                <TrianguloFudido alignment="left" color="#2a323c" />
                {components.map((component, index) => {
                    if (!component) return null
                    if (component.format == "IMAGE") {
                        const imageSrc = image ? URL.createObjectURL(image) : undefined
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
                                color="#fff"
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
