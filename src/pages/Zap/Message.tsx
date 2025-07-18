import React, { forwardRef, useEffect, useMemo, useState } from "react"
import { Avatar, Box, Checkbox, Chip, CircularProgress, MenuItem, Skeleton, Tooltip, Typography } from "@mui/material"
import { useMuiTheme } from "../../hooks/useMuiTheme"
import { useMediaQuery } from "@mui/material"
import { Washima, WashimaMedia } from "../../types/server/class/Washima/Washima"
import { api } from "../../api"
import { useVisibleCallback } from "burgos-use-visible-callback"
import { ErrorChip, TodoChip } from "../../components/TodoChip"
import { Android, Reply } from "@mui/icons-material"
import { AudioPlayer } from "../Washima/AudioComponents/AudioPlayer"
import { TrianguloFudido } from "./TrianguloFudido"
import { MessageDateContainer } from "./MessageDateContainer"
import { WashimaMessage, WashimaReaction } from "../../types/server/class/Washima/WashimaMessage"
import { formatSize } from "../../tools/formatSize"
import { documentIcon } from "../../tools/documentIcon"
import { WashimaGroupUpdate } from "../../types/server/class/Washima/WashimaGroupUpdate"
import { DateChip } from "../Washima/WashimaChat/DateChip"
import { PhotoView } from "react-photo-view"
import { DeletedMessage } from "./DeletedMessage"
import { MessageAuthor } from "./MessageAuthor"
import { MessageMenu } from "./MessageMenu"
import { QuotedMessage } from "../Washima/QuotedMessage"
import { useDarkMode } from "../../hooks/useDarkMode"
import { PhoneOnly } from "./PhoneOnly"
import { custom_colors } from "../../style/colors"
import { CallInfo } from "./CallInfo"
import { ChatInfoChip } from "../Washima/WashimaChat/GroupUpdateItem"
import { phoneMask } from "../../tools/masks"
import { BotNameChip } from "../Bots/BotNameChip"
import { useWashimaInput } from "../../hooks/useWashimaInput"
import { MessageReactions } from "./MessageReactions"
import { ContactCard } from "../Washima/ContactCard"

interface MessageProps {
    washima: Washima
    message: WashimaMessage
    previousItem?: WashimaMessage | WashimaGroupUpdate
    isGroup?: boolean
    onVisible?: () => void
    scrollTo?: (sid: string) => void
    selectedMessages?: WashimaMessage[]
    setSelectedMessages?: React.Dispatch<React.SetStateAction<WashimaMessage[]>>
    inBoards?: boolean
    noActions?: boolean
}

export const Message: React.ForwardRefRenderFunction<HTMLDivElement, MessageProps> = (
    { message, isGroup, washima, previousItem, onVisible, scrollTo, selectedMessages, setSelectedMessages, inBoards, noActions },
    ref
) => {
    const visibleCallbackRef = useVisibleCallback(() => {
        setComponentIsOnScreen(true)
        fetchMedia()
        if (onVisible) onVisible()
    }, {})
    const isMobile = useMediaQuery("(orientation: portrait)")
    const theme = useMuiTheme()
    const washima_input = useWashimaInput()
    const { darkMode } = useDarkMode()

    const reactions = useMemo(() => {
        console.log({ reactions: message.reactions })
        try {
            const set = new Set<string>()
            Object.entries(message?.reactions as unknown as Record<string, WashimaReaction>).forEach(([_, reaction]) => {
                if (reaction?.reaction) set.add(reaction.reaction)
            })
            return Array.from(set)
        } catch (error) {
            return []
        }
    }, [message.reactions])

    const same_as_previous = !!previousItem && (previousItem as WashimaMessage).contact_id === message.contact_id
    const day_changing =
        !previousItem || new Date(previousItem.timestamp * 1000).toLocaleDateString() !== new Date(message.timestamp * 1000).toLocaleDateString()
    const show_triangle = !same_as_previous || day_changing

    const from_me = message.contact_id === washima.info?.wid?._serialized
    const show_author = (!same_as_previous || day_changing) && isGroup && !from_me

    const [mediaObj, setMediaObj] = useState<{ source: string; ext: string; size: string }>()
    const [attachmendMetaData, setAttachmendMetaData] = useState<WashimaMedia | null>(null)
    const [loading, setLoading] = useState(message.hasMedia)
    const [hovering, setHovering] = useState(false)
    const [componentIsOnScreen, setComponentIsOnScreen] = useState(false)

    const is_selected = useMemo(() => !!selectedMessages?.find((item) => item.sid === message.sid), [selectedMessages])
    const is_selecting = useMemo(() => (selectedMessages ? selectedMessages.length > 0 : false), [selectedMessages])

    const valid_types = ["video", "image", "ptt", "audio", "document", "sticker"]
    const is_audio = message.type === "ptt" || message.type === "audio"
    const is_image = message.type === "image"
    const is_video = message.type === "video"
    const is_document = message.type === "document"
    const is_sticker = message.type === "sticker"
    const is_deleted = message.type === "revoked" || message.deleted
    const is_info = message.type === "e2e_notification" || message.type === "notification_template"
    const is_vcard = message.type === "vcard"

    function isURL(str: string): boolean {
        if (!str.toLowerCase().includes("http")) return false

        try {
            // Use the URL constructor which is more reliable
            const url = new URL(str)
            return ["http:", "https:"].includes(url.protocol)
        } catch (e) {
            return false
        }
    }
    const isLink = isURL(message.body)

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

    const onSelect = () => {
        if (washima_input.deleting && !from_me) return
        setSelectedMessages?.((selectedMessages) =>
            is_selected ? selectedMessages.filter((item) => item.sid !== message.sid) : [...selectedMessages, message]
        )
    }

    useEffect(() => {
        if (hovering) {
            // console.log(message)
        }
    }, [hovering])

    return (
        <Box
            sx={{ flexDirection: "column" }}
            onPointerEnter={() => setHovering(true)}
            onPointerLeave={() => setHovering(false)}
            onClick={() => console.log(message)}
        >
            {/*//* DATE CHIP */}
            {day_changing && !noActions && <DateChip timestamp={message.timestamp * 1000} />}
            {is_info ? (
                <ChatInfoChip
                    label={
                        message.type === "e2e_notification"
                            ? `Seu código de segurança com este contato mudou.`
                            : "Esta empresa agora usa um serviço seguro da Meta para gerenciar esta conversa."
                    }
                    no_margin={day_changing}
                />
            ) : (
                <Box
                    ref={ref}
                    id={`message:${washima.id}_${message.id.id}`}
                    sx={{ flexDirection: from_me ? "row-reverse" : "row", alignItems: "center", gap: "1vw", position: "relative" }}
                >
                    {/* //* HOVERING OVERLAY */}
                    {(is_selected || (is_selecting && hovering)) && !(washima_input.deleting && !from_me) && (
                        <Box
                            sx={{
                                position: "absolute",
                                top: "-0.125vw",
                                left: 0,
                                right: 0,
                                bottom: "-0.125vw",
                                bgcolor: "white",
                                opacity: 0.1,
                                marginLeft: "-2vw",
                                marginRight: "-2vw",
                                marginTop: !same_as_previous && !day_changing ? (isMobile ? "2vw" : "0.5vw") : undefined,
                                cursor: "pointer",
                                zIndex: 5,
                            }}
                            onClick={onSelect}
                        />
                    )}

                    {is_selecting && (
                        <Checkbox
                            checked={is_selected}
                            sx={{
                                position: "absolute",
                                left: 0,
                                opacity: washima_input.deleting && !from_me ? 0.3 : undefined,
                                pointerEvents: washima_input.deleting && !from_me ? "none" : undefined,
                            }}
                        />
                    )}

                    <Box
                        ref={visibleCallbackRef}
                        sx={{
                            flexDirection: "column",
                            maxWidth: inBoards
                                ? isMobile
                                    ? "100%"
                                    : "90%"
                                : message.hasMedia && is_document
                                ? isMobile
                                    ? "100%"
                                    : "25vw"
                                : message.hasMedia
                                ? "100%"
                                : isMobile
                                ? "90%"
                                : "75%",
                        }}
                    >
                        {/* //* MESSAGE CONTAINER */}
                        <Box
                            sx={{
                                position: "relative",
                                padding: isMobile ? "3vw" : `${is_image || is_video ? "0.25vw" : "0.5vw"}`,
                                marginLeft: !from_me && is_selecting ? "5vw" : undefined,
                                // marginRight: from_me && is_selecting ? "1vw" : undefined,
                                flexDirection: "column",
                                alignSelf: from_me ? "flex-end" : "flex-start",
                                textAlign: from_me ? "end" : "start",
                                borderRadius: isMobile ? "3vw" : "0.75vw",
                                borderTopRightRadius: show_triangle && from_me ? "0" : undefined,
                                borderTopLeftRadius: show_triangle && !from_me ? "0" : undefined,
                                bgcolor: is_sticker
                                    ? "transparent"
                                    : from_me
                                    ? darkMode
                                        ? custom_colors.darkMode_emittedMsg
                                        : custom_colors.lightMode_emittedMsg
                                    : darkMode
                                    ? custom_colors.darkMode_receivedMsg
                                    : custom_colors.lightMode_receivedMsg,
                                marginTop: !same_as_previous && !day_changing ? (isMobile ? "2vw" : "0.5vw") : undefined,
                                marginBottom: !!reactions.length ? "1.5vw" : undefined,
                                opacity: is_deleted || message.phone_only ? 0.6 : undefined,
                                transition: "0.5s",
                                width: "100%",
                            }}
                        >
                            {show_triangle && (
                                <TrianguloFudido
                                    color={
                                        is_sticker
                                            ? "transparent"
                                            : from_me
                                            ? darkMode
                                                ? custom_colors.darkMode_emittedMsg
                                                : custom_colors.lightMode_emittedMsg
                                            : darkMode
                                            ? custom_colors.darkMode_receivedMsg
                                            : custom_colors.lightMode_receivedMsg
                                    }
                                    alignment={from_me ? "right" : "left"}
                                />
                            )}

                            {/*//* MENSAGEM ENCAMINHADA */}
                            {message.forwarded && (
                                <Box sx={{ gap: "0.3vw", alignItems: "center" }}>
                                    <Reply fontSize="small" sx={{ transform: "scaleX(-1)", opacity: 0.3 }} />
                                    <Typography sx={{ fontStyle: "italic", fontSize: "0.8rem", opacity: 0.5 }}>Encaminhada</Typography>
                                </Box>
                            )}

                            {/*//* MESSAGE AUTHOR  */}
                            {show_author && <MessageAuthor washima_id={washima.id} contact_id={message.contact_id} />}

                            {/* //* BOT CHIP */}
                            {message.from_bot && <BotNameChip name={message.from_bot} />}

                            {/* //* QUOTED MESSAGE COMPONENT */}
                            {message.replied_to && !is_deleted && (
                                <MenuItem
                                    sx={{
                                        padding: 0,
                                        marginBottom: "0.5vw",
                                        maxWidth: "25vw",
                                        pointerEvents: noActions ? "none" : undefined,
                                    }}
                                    onClick={() => scrollTo?.(message.replied_to!.sid)}
                                >
                                    <QuotedMessage message={message.replied_to} />
                                </MenuItem>
                            )}

                            <Box
                                sx={{
                                    flexDirection: "column",
                                    gap: is_document ? (isMobile ? "3vw" : "0.5vw") : is_sticker ? "0.2vw" : undefined,
                                    alignItems: is_document ? "center" : undefined,
                                    paddingX: is_document ? (isMobile ? "3vw" : "0.5vw") : undefined,
                                }}
                            >
                                {is_deleted && <DeletedMessage />}
                                {message.call && <CallInfo call={message.call} from_me={from_me} />}
                                {message.phone_only && <PhoneOnly />}
                                {message.hasMedia && (
                                    <Box sx={{}}>
                                        {is_image &&
                                            (loading ? (
                                                <Skeleton
                                                    variant="rounded"
                                                    animation="wave"
                                                    sx={{
                                                        width: inBoards ? "15vw" : isMobile ? "60vw" : "20vw",
                                                        height: inBoards ? "15vw" : isMobile ? "70vw" : "20vw",
                                                        borderRadius: "1vw",
                                                    }}
                                                />
                                            ) : (
                                                <PhotoView src={mediaObj?.source} triggers={noActions ? ["onDoubleClick"] : undefined}>
                                                    <MenuItem sx={{ padding: 0, borderRadius: "0.75vw" }}>
                                                        <img
                                                            style={{
                                                                width: inBoards ? "15vw" : isMobile ? "60vw" : "20vw",
                                                                maxHeight: inBoards ? "15vw" : isMobile ? "70vw" : "20vw",
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
                                                <CircularProgress
                                                    size={inBoards ? "5vw" : isMobile ? "30vw" : "10vw"}
                                                    sx={{ color: "text.secondary" }}
                                                />
                                            ) : (
                                                <img
                                                    style={{
                                                        width: inBoards ? "5vw" : isMobile ? "30vw" : "10vw",
                                                        height: inBoards ? "5vw" : isMobile ? "30vw" : "10vw",
                                                        objectFit: "contain",
                                                        borderRadius: "0.75vw",
                                                    }}
                                                    // onClick={() => picture.open(mediaObj?.source || "")}
                                                    src={mediaObj?.source}
                                                    draggable={false}
                                                />
                                            ))}

                                        {is_video &&
                                            (loading ? (
                                                <Skeleton
                                                    variant="rounded"
                                                    animation="wave"
                                                    sx={{
                                                        width: inBoards ? "15vw" : isMobile ? "60vw" : "20vw",
                                                        height: inBoards ? "15vw" : isMobile ? "70vw" : "20vw",
                                                        borderRadius: "1vw",
                                                    }}
                                                />
                                            ) : mediaObj ? (
                                                <video
                                                    style={{
                                                        width: inBoards ? "15vw" : isMobile ? "60vw" : "20vw",
                                                        height: inBoards ? "15vw" : isMobile ? "70vw" : "20vw",
                                                    }}
                                                    src={mediaObj.source}
                                                    controls
                                                    muted={false}
                                                />
                                            ) : (
                                                <Box sx={{ flexDirection: "column", alignItems: "center", color: "error.main" }}>
                                                    Erro ao baixar vídeo
                                                    <ErrorChip />
                                                </Box>
                                            ))}
                                        {is_audio && (
                                            <AudioPlayer
                                                loading={loading}
                                                media={mediaObj}
                                                washima={washima}
                                                chat_id={message.from}
                                                message={message}
                                                inBoards={inBoards}
                                            />
                                        )}
                                        {is_document &&
                                            (loading ? (
                                                <Skeleton
                                                    variant="rounded"
                                                    animation="wave"
                                                    sx={{
                                                        width: isMobile ? "10vw" : "3vw",
                                                        height: isMobile ? "10vw" : "3.42vw",
                                                        borderRadius: "0.2vw",
                                                        flexDirection: "row",
                                                    }}
                                                />
                                            ) : (
                                                <Avatar
                                                    sx={{
                                                        width: isMobile ? "10vw" : "3vw",
                                                        height: "auto",
                                                        objectFit: "contain",
                                                        borderRadius: 0,
                                                    }}
                                                    imgProps={{ draggable: false }}
                                                    alt="ícone"
                                                    src={
                                                        documentIcon(attachmendMetaData?.filename?.split(".").pop()) ||
                                                        "/icones-documentos-washima/icon-generic.svg"
                                                    }
                                                />
                                            ))}
                                        {!valid_types.includes(message.type) && (
                                            <Box sx={{ flexDirection: "column", alignItems: "center", color: "warning.main", margin: "auto" }}>
                                                Mídia não suportada
                                                <TodoChip />
                                            </Box>
                                        )}
                                    </Box>
                                )}
                                {is_vcard ? (
                                    /*//* CONTACT CARD */
                                    <ContactCard message={message} />
                                ) : (
                                    /*//* MESSAGE BODY TEXT */
                                    <Box sx={{ flexDirection: "column" }}>
                                        <p
                                            className={isLink ? "link" : undefined}
                                            style={{
                                                padding: is_image ? "0.25vw 0.25vw 0" : undefined,
                                                wordBreak: "break-word",
                                                whiteSpace: noActions ? undefined : isMobile && is_document ? "nowrap" : "pre-line",
                                                color: isLink ? theme.palette.success.light : undefined,
                                                textAlign: "left",
                                                WebkitLineClamp: noActions ? 12 : 2,
                                                display: noActions ? "-webkit-box" : undefined,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                width: is_document ? (isMobile ? "47vw" : "16vw") : undefined,
                                            }}
                                            onClick={isLink ? () => window.open(message.body, "_new") : undefined}
                                        >
                                            {attachmendMetaData ? attachmendMetaData.filename : message.body}
                                        </p>
                                        {attachmendMetaData && <p style={{ textAlign: "left" }}>{attachmendMetaData.size}</p>}
                                    </Box>
                                )}
                            </Box>
                            {/*//* TIME */}
                            <MessageDateContainer
                                message={message}
                                is_audio={is_audio}
                                is_image={is_image}
                                is_document={is_document}
                                from_me={from_me}
                            />

                            <MessageReactions
                                reactions={reactions}
                                length={
                                    Array.from((message.reactions || []) as unknown as WashimaReaction[]).filter((item) => !!item.reaction).length
                                }
                                from_me={from_me}
                            />

                            {/* //* MENU BUTTON */}
                            {hovering && !is_deleted && !noActions && !is_selecting && (
                                <MessageMenu
                                    from_me={from_me}
                                    onClose={() => setHovering(false)}
                                    message={message}
                                    onSelect={onSelect}
                                    washima={washima}
                                />
                            )}
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    )
}

export default forwardRef(Message)
