import React, { useEffect, useState } from "react"
import { Avatar, Box, Chip, CircularProgress, Icon, IconButton, MenuItem, Skeleton, alpha } from "@mui/material"
import { useMuiTheme } from "../../hooks/useMuiTheme"
import { useMediaQuery } from "@mui/material"
import { Washima, WashimaMedia } from "../../types/server/class/Washima/Washima"
import { api } from "../../api"
import { useVisibleCallback } from "burgos-use-visible-callback"
import { ErrorChip, TodoChip } from "../../components/TodoChip"
import { Delete, Download } from "@mui/icons-material"
import { saveAs } from "file-saver"
import { AudioPlayer } from "../Washima/AudioComponents/AudioPlayer"
import { TrianguloFudido } from "./TrianguloFudido"
import { washima_colors } from "../../style/colors"
import { MessageDateContainer } from "./MessageDateContainer"
import { WashimaMessage } from "../../types/server/class/Washima/WashimaMessage"
import { formatSize } from "../../tools/formatSize"
import { documentIcon } from "../../tools/documentIcon"
import { WashimaGroupUpdate } from "../../types/server/class/Washima/WashimaGroupUpdate"
import { DateChip } from "../Washima/WashimaChat/DateChip"
import { PhotoView } from "react-photo-view"
import { DeletedMessage } from "./DeletedMessage"
import { MessageAuthor } from "./MessageAuthor"

interface MessageProps {
    washima: Washima
    message: WashimaMessage
    previousItem?: WashimaMessage | WashimaGroupUpdate
    isGroup?: boolean
    onVisible?: () => void
}

export const Message: React.FC<MessageProps> = ({ message, isGroup, washima, previousItem, onVisible }) => {
    const visibleCallbackRef = useVisibleCallback(() => {
        setComponentIsOnScreen(true)
        fetchMedia()
        if (onVisible) onVisible()
    }, {})
    const isMobile = useMediaQuery("(orientation: portrait)")
    const theme = useMuiTheme()
    const primary = "#0f6787"
    const secondary = "#5e5e5e"

    const same_as_previous =
        !!previousItem && (message.author ? previousItem?.author === message.author : (previousItem as WashimaMessage).fromMe === message.fromMe)
    const day_changing =
        !previousItem || new Date(previousItem.timestamp * 1000).toLocaleDateString() !== new Date(message.timestamp * 1000).toLocaleDateString()
    const show_triangle = !same_as_previous || day_changing

    const show_author = (!same_as_previous || day_changing) && isGroup

    const [mediaObj, setMediaObj] = useState<{ source: string; ext: string; size: string }>()
    const [attachmendMetaData, setAttachmendMetaData] = useState<WashimaMedia | null>(null)
    const [loading, setLoading] = useState(message.hasMedia)
    const [downloading, setDownloading] = useState(false)
    const [hovering, setHovering] = useState(false)
    const [componentIsOnScreen, setComponentIsOnScreen] = useState(false)

    const valid_types = ["video", "image", "ptt", "audio", "document", "sticker"]
    const is_audio = message.type === "ptt" || message.type === "audio"
    const is_image = message.type === "image"
    const is_video = message.type === "video"
    const is_document = message.type === "document"
    const is_sticker = message.type === "sticker"
    const is_deleted = message.type === "revoked" || message.deleted

    function isURL(str: string) {
        if (str.split("http").length === 1) return
        const pattern = new RegExp(
            "^(https?:\\/\\/)?" + // protocol
                "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
                "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
                "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
                "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
                "(\\#[-a-z\\d_]*)?$",
            "i"
        ) // fragment locator
        return !!pattern.test(str)
    }
    const isLink = isURL(message.body)

    const downloadMedia = async () => {
        if (!message.hasMedia || downloading || is_deleted) return

        try {
            setDownloading(true)

            const response = await api.get("/washima/media", {
                params: { washima_id: washima.id, message_id: message.id._serialized },
                responseType: "blob",
            })
            const blob = response.data
            saveAs(blob, message.id.id + "." + response.headers["content-type"].split("/")[1])
        } catch (error) {
            console.log(error)
        } finally {
            setDownloading(false)
        }
    }

    const fetchMedia = async () => {
        if (!message.hasMedia || !valid_types.includes(message.type) || is_deleted) return

        const fetchMetadata = async () => {
            const response = await api.get("/washima/media-metadata", { params: { washima_id: washima.id, message_id: message.sid } })
            setAttachmendMetaData(response.data)
            return response.data
        }
        try {
            setLoading(true)

            if (is_document) {
                const meta = await fetchMetadata()
                if (meta) return
            }

            const response = await api.get("/washima/media", {
                params: { washima_id: washima.id, message_id: message.id._serialized },
                responseType: "blob",
            })

            if (is_document) {
                const meta = await fetchMetadata()
                if (meta) return
            }

            const blob = response.data

            const size = formatSize(blob.size)

            const url = URL.createObjectURL(blob)
            setMediaObj({ source: url, ext: response.headers["content-type"].split("/")[1].split(";")[0], size: size })
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (hovering) {
            console.log(attachmendMetaData)
        }
    }, [hovering])

    return (
        <Box sx={{ display: "contents" }} onPointerEnter={() => setHovering(true)} onPointerLeave={() => setHovering(false)}>
            {/*//* DATE CHIP */}
            {day_changing && <DateChip timestamp={message.timestamp * 1000} />}
            <Box sx={{ flexDirection: message.fromMe ? "row-reverse" : "row", alignItems: "center", gap: "1vw" }}>
                <Box
                    ref={visibleCallbackRef}
                    sx={{
                        flexDirection: "column",
                        maxWidth: message.hasMedia && is_document ? "25vw" : message.hasMedia ? "20vw" : isMobile ? "90%" : "75%",
                    }}
                >
                    {/*//* MESSAGE AUTHOR  */}
                    {show_author && is_deleted && <MessageAuthor message={message} />}
                    <Box
                        sx={{
                            position: "relative",
                            padding: isMobile ? "3vw" : `${is_image || is_video ? "0.25vw" : "0.5vw"}`,
                            paddingX: is_document ? "0.5vw" : undefined,
                            flexDirection: is_document ? "row" : "column",
                            alignSelf: message.fromMe ? "flex-end" : "flex-start",
                            textAlign: message.fromMe ? "end" : "start",
                            borderRadius: "0.75vw",
                            borderTopRightRadius: show_triangle && message.fromMe ? "0" : undefined,
                            borderTopLeftRadius: show_triangle && !message.fromMe ? "0" : undefined,
                            bgcolor: is_sticker ? "transparent" : message.fromMe ? primary : secondary,
                            marginTop: !same_as_previous && !day_changing ? "0.5vw" : undefined,
                            gap: is_document ? "0.5vw" : is_sticker ? "0.2vw" : undefined,
                            alignItems: is_document ? "center" : undefined,
                            opacity: is_deleted ? 0.3 : undefined,
                        }}
                    >
                        {show_triangle && (
                            <TrianguloFudido
                                color={is_sticker ? "transparent" : message.fromMe ? primary : secondary}
                                alignment={message.fromMe ? "right" : "left"}
                            />
                        )}

                        {/*//* MESSAGE AUTHOR  */}
                        {show_author && message.type !== "revoked" && <MessageAuthor message={message} />}

                        {is_deleted && <DeletedMessage message={message} />}
                        {message.hasMedia && !is_deleted && (
                            <Box sx={{}}>
                                {is_image &&
                                    (loading ? (
                                        <Skeleton variant="rounded" animation="wave" sx={{ width: "20vw", height: "20vw", borderRadius: "1vw" }} />
                                    ) : (
                                        <PhotoView src={mediaObj?.source}>
                                            <MenuItem sx={{ padding: 0, borderRadius: "0.75vw" }}>
                                                <img
                                                    style={{
                                                        width: "20vw",
                                                        maxHeight: "20vw",
                                                        objectFit: "cover",
                                                        borderRadius: "0.75vw",
                                                    }}
                                                    // onClick={() => picture.open(mediaObj?.source || "")}
                                                    src={mediaObj?.source}
                                                    draggable={false}
                                                />
                                            </MenuItem>
                                        </PhotoView>
                                    ))}
                                {is_sticker &&
                                    (loading ? (
                                        <CircularProgress size={"10vw"} sx={{}} />
                                    ) : (
                                        <img
                                            style={{ width: "10vw", height: "10vw", objectFit: "contain", borderRadius: "0.75vw" }}
                                            // onClick={() => picture.open(mediaObj?.source || "")}
                                            src={mediaObj?.source}
                                            draggable={false}
                                        />
                                    ))}
                                {is_video &&
                                    (loading ? (
                                        <Skeleton variant="rounded" animation="wave" sx={{ width: "20vw", height: "20vw", borderRadius: "1vw" }} />
                                    ) : mediaObj ? (
                                        <video style={{ width: "20vw", height: "20vw" }} src={mediaObj.source} controls muted={false} />
                                    ) : (
                                        <Box sx={{ flexDirection: "column", alignItems: "center", color: "error.main" }}>
                                            erro ao baixar vídeo
                                            <ErrorChip />
                                        </Box>
                                    ))}
                                {is_audio && (
                                    <AudioPlayer
                                        loading={loading || !mediaObj}
                                        media={mediaObj}
                                        washima={washima}
                                        chat_id={message.from}
                                        message={message}
                                    />
                                )}
                                {is_document &&
                                    (loading ? (
                                        <Skeleton
                                            variant="rounded"
                                            animation="wave"
                                            sx={{ width: "3vw", height: "3.42vw", borderRadius: "0.2vw", flexDirection: "row" }}
                                        />
                                    ) : (
                                        <Avatar
                                            sx={{
                                                width: "3vw",
                                                height: "auto",
                                                objectFit: "contain",
                                                borderRadius: 0,
                                            }}
                                            imgProps={{ draggable: false }}
                                            alt="icone"
                                            src={
                                                documentIcon(attachmendMetaData?.filename.split(".").pop()) ||
                                                "/icones-documentos-washima/icon-generic.svg"
                                            }
                                        />
                                    ))}

                                {!valid_types.includes(message.type) && (
                                    <Box sx={{ flexDirection: "column", alignItems: "center", color: "warning.main", margin: "auto" }}>
                                        mídia não suportada
                                        <TodoChip />
                                    </Box>
                                )}
                            </Box>
                        )}

                        {/*//* MESSAGE BODY TEXT */}
                        {!is_deleted && (
                            <Box sx={{ flexDirection: "column" }}>
                                <p
                                    className={isLink ? "link" : undefined}
                                    style={{
                                        padding: is_image ? "0 0.25vw" : undefined,
                                        wordBreak: "break-word",
                                        whiteSpace: "pre-line",
                                        color: isLink ? theme.palette.success.light : undefined,
                                        textAlign: "left",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        width: is_document ? "16vw" : undefined,
                                    }}
                                    onClick={isLink ? () => window.open(message.body, "_new") : undefined}
                                >
                                    {attachmendMetaData ? attachmendMetaData.filename : message.body}
                                </p>
                                {attachmendMetaData && <p style={{ textAlign: "left" }}>{attachmendMetaData.size}</p>}
                            </Box>
                        )}
                        {/*//* TIME */}
                        <MessageDateContainer message={message} is_audio={is_audio} is_image={is_image} is_document={is_document} />

                        {/*//* DOWNLOAD BUTTON */}
                        {hovering && message.hasMedia && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    left: message.fromMe ? "-4vw" : undefined,
                                    right: !message.fromMe ? "-4vw" : undefined,
                                    top: 0,
                                    bottom: 0,
                                    alignItems: "center",
                                }}
                            >
                                <IconButton onClick={downloadMedia}>
                                    {downloading ? <CircularProgress size={"1.5rem"} /> : <Download fontSize="large" />}
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
