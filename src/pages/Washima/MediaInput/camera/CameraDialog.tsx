import React, { useEffect, useRef, useState } from "react"
import { Button, Box, Dialog, Typography, IconButton, TextField, CircularProgress } from "@mui/material"
import { Close } from "@mui/icons-material"
import SendIcon from "@mui/icons-material/Send"
import { MediaListItem } from "../MediaListItem"
import { Washima, WashimaMediaForm } from "../../../../types/server/class/Washima/Washima"
import { file2base64 } from "../../../../tools/toBase64"
import { useIo } from "../../../../hooks/useIo"

interface CameraDialogProps {
    showCam: boolean
    onClose: () => void
    washima: Washima
    chat_id: string
}

interface SelectedMedia {
    type: "photo" | "video"
    file: File
    url: string
}

export const CameraDialog: React.FC<CameraDialogProps> = ({ showCam, onClose, washima, chat_id }) => {
    const io = useIo()

    const videoRef = useRef<HTMLVideoElement>(null)
    const photoRef = useRef<HTMLCanvasElement>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const recordedChunksRef = useRef<Blob[]>([])

    const [loading, setLoading] = useState(-1)
    const [mediaFiles, setMediaFiles] = useState<File[]>([])
    const [isRecording, setIsRecording] = useState<boolean>(false)
    const [selectedMedia, setSelectedMedia] = useState<SelectedMedia | null>(null)
    const [error, setError] = useState<string | null>(null)

    const [caption, setCaption] = useState("")

    const getMediaStream = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            })
            streamRef.current = mediaStream
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
        } catch (error) {
            console.error("Erro ao acessar a câmera: ", error)
            setError("Não foi possível acessar a câmera e o microfone.")
        }
    }

    const takePhoto = () => {
        if (videoRef.current && photoRef.current) {
            const width = videoRef.current.videoWidth
            const height = videoRef.current.videoHeight

            photoRef.current.width = width
            photoRef.current.height = height

            const ctx = photoRef.current.getContext("2d")
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0, width, height)
                photoRef.current.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], `photo-${Date.now()}.png`, { type: "image/png" })
                        setMediaFiles((prev) => [...prev, file])
                    }
                }, "image/png")
            }
        }
    }

    const handleDataAvailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data)
        }
    }

    const startRecording = () => {
        if (streamRef.current) {
            recordedChunksRef.current = []
            let options: MediaRecorderOptions = {}

            const mimeTypes = [
                "video/webm; codecs=vp9,opus",
                "video/webm; codecs=vp8,opus",
                "video/webm; codecs=h264,aac",
                "video/mp4; codecs=h264,aac",
                "video/webm",
                "video/mp4",
            ]

            for (const mimeType of mimeTypes) {
                if (MediaRecorder.isTypeSupported(mimeType)) {
                    options.mimeType = mimeType
                    console.log(`Usando MIME type: ${mimeType}`)
                    break
                }
            }

            if (!options.mimeType) {
                console.error("Nenhum MIME type suportado encontrado para MediaRecorder")
                setError("Seu navegador não suporta gravação de vídeo com MediaRecorder.")
                return
            }

            try {
                const mediaRecorder = new MediaRecorder(streamRef.current, options)
                mediaRecorder.ondataavailable = handleDataAvailable
                mediaRecorder.onstop = handleStopRecording
                mediaRecorder.start()
                mediaRecorderRef.current = mediaRecorder
                setIsRecording(true)
                console.log("Gravação iniciada")
            } catch (error) {
                console.error("Erro ao iniciar a gravação: ", error)
                setError("Erro ao iniciar a gravação. Seu navegador pode não suportar os codecs necessários.")
            }
        } else {
            console.error("Stream de mídia não está disponível")
            setError("Stream de mídia não está disponível.")
        }
    }

    const stopRecording = () => {
        console.log("Botão 'Parar Gravação' clicado")
        if (mediaRecorderRef.current && isRecording) {
            console.log("Parando a gravação")
            mediaRecorderRef.current.stop()
        } else {
            console.log("MediaRecorder não está em gravação ou não está definido")
        }
    }

    const handleStopRecording = () => {
        console.log("Evento 'onstop' do MediaRecorder disparado")
        if (mediaRecorderRef.current) {
            const mimeType = mediaRecorderRef.current.mimeType
            const blob = new Blob(recordedChunksRef.current, { type: mimeType })
            const extension = mimeType.split("/")[1].split(";")[0] // Extrai a extensão correta
            const file = new File([blob], `video-${Date.now()}.${extension}`, { type: mimeType })
            setMediaFiles((prev) => [...prev, file])
            recordedChunksRef.current = []
            setIsRecording(false)
            console.log("Arquivo de vídeo adicionado à lista de mídias")
        }
    }

    const handleClose = () => {
        onClose()
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop())
            streamRef.current = null
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null
        }
        setMediaFiles([])
        setIsRecording(false)
        setSelectedMedia(null)
        setError(null)
        setLoading(-1)
    }

    const downloadMedia = (file: File) => {
        const url = URL.createObjectURL(file)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = file.name
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
    }

    const removeMedia = (fileToRemove: File) => {
        setMediaFiles((prev) => prev.filter((file) => file !== fileToRemove))
    }

    // const handleDownload = (file: File) => {
    //     downloadMedia(file)
    // }

    // const handleRemove = (file: File) => {
    //     removeMedia(file)
    // }

    const onSubmit = async () => {
        if (loading > 0) return
        setLoading(1)

        const medias: WashimaMediaForm[] = await Promise.all(
            mediaFiles.map(async (file, index) => {
                const base64 = await file2base64(file)
                const data: WashimaMediaForm = { base64, mimetype: file.type, name: file.name, size: file.size }
                return data
            })
        )

        setLoading(medias.length)

        if (medias.length === 1) {
            io.emit("washima:message", washima.id, chat_id, caption, medias[0])
            return
        }

        medias.forEach((media) => {
            io.emit("washima:message", washima.id, chat_id, undefined, media)
        })

        if (caption) {
            io.emit("washima:message", washima.id, chat_id, caption)
            setCaption("")
        }

        handleClose()
    }

    const handleSelect = (file: File) => {
        if (isRecording) {
            stopRecording()
        }
        const url = URL.createObjectURL(file)
        setSelectedMedia({ type: file.type.startsWith("image/") ? "photo" : "video", file, url })
    }

    useEffect(() => {
        return () => {
            if (selectedMedia?.url) {
                URL.revokeObjectURL(selectedMedia.url)
            }
        }
    }, [selectedMedia])

    useEffect(() => {
        if (showCam && !selectedMedia) {
            getMediaStream()
        }

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop())
                streamRef.current = null
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null
            }
            setIsRecording(false)
            setError(null)
        }
    }, [showCam, selectedMedia])

    useEffect(() => {
        if (selectedMedia && streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop())
            streamRef.current = null
            if (videoRef.current) {
                videoRef.current.srcObject = null
            }
        }
    }, [selectedMedia])

    return (
        <Dialog
            open={showCam}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    padding: "1vw",
                    bgcolor: "background.default",
                    maxWidth: "60vw",
                    minWidth: "60vw",
                },
            }}
        >
            <Box sx={{ overflow: "hidden", flexDirection: "column", gap: "0.5vw" }}>
                <Box sx={{ justifyContent: "space-between", alignItems: "center", display: "flex" }}>
                    <Typography variant={"h6"}>Câmera</Typography>
                    <IconButton onClick={handleClose}>
                        <Close color="primary" />
                    </IconButton>
                </Box>
                {error && (
                    <Box>
                        <Typography color="error">{error}</Typography>
                    </Box>
                )}
                <Box sx={{ flexDirection: "column", gap: "1vw" }}>
                    <Box sx={{ flexDirection: "column", gap: "1vw" }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "auto",
                                height: "60vh",
                                objectFit: "contain",
                            }}
                        >
                            {selectedMedia ? (
                                <Box>
                                    {selectedMedia.type === "photo" ? (
                                        <img src={selectedMedia.url} alt="Foto Capturada" style={{ maxWidth: "100%", maxHeight: "100%" }} />
                                    ) : (
                                        <video key="selectedVideo" src={selectedMedia.url} controls style={{ maxWidth: "100%", maxHeight: "100%" }} />
                                    )}
                                </Box>
                            ) : (
                                <Box sx={{ width: "100%", height: "100%" }}>
                                    <video
                                        key="liveVideo"
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                </Box>
                            )}
                            <canvas ref={photoRef} style={{ display: "none" }} />
                        </Box>
                        <Box>
                            {selectedMedia ? (
                                <Box sx={{ justifyContent: "space-between", display: "flex", flex: 1 }}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => {
                                            setSelectedMedia(null)
                                            getMediaStream()
                                        }}
                                    >
                                        Câmera
                                    </Button>
                                    <Box sx={{ display: "flex", marginLeft: "auto", gap: "1vw" }}>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => {
                                                removeMedia(selectedMedia.file)
                                                if (selectedMedia) {
                                                    setSelectedMedia(null)
                                                    getMediaStream()
                                                }
                                            }}
                                        >
                                            Remover Mídia
                                        </Button>
                                        <Button variant="contained" color="primary" onClick={() => downloadMedia(selectedMedia.file)}>
                                            Salvar Mídia
                                        </Button>
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{ display: "flex", marginLeft: "auto", gap: "1vw" }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={takePhoto}
                                        // disabled={!streamRef.current}
                                    >
                                        Tirar Foto
                                    </Button>
                                    {!isRecording ? (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={startRecording}
                                            // disabled={!streamRef.current}
                                        >
                                            Iniciar Gravação
                                        </Button>
                                    ) : (
                                        <Button variant="contained" color="secondary" onClick={stopRecording}>
                                            Parar Gravação
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </Box>
                    <Box sx={{ gap: "1vw" }}>
                        <Box
                            sx={{
                                gap: "0.5vh",
                                maxWidth: "55vw",
                                minWidth: "55vw",
                                height: "10vh",
                            }}
                        >
                            <Button
                                sx={{ height: "10vh", width: "7vw", fontSize: "4rem" }}
                                onClick={() => {
                                    setSelectedMedia(null)
                                    getMediaStream()
                                }}
                            >
                                +
                            </Button>
                            <Box
                                sx={{
                                    gap: "0.5vh",
                                    overflow: "auto",
                                    height: "10vh",
                                    width: "48vw",
                                }}
                            >
                                {mediaFiles.map((file, index) => (
                                    <MediaListItem
                                        key={`media-${index}`}
                                        file={file}
                                        onClick={() => {
                                            if (file) {
                                                handleSelect(file)
                                            }
                                        }}
                                        onDelete={() => {
                                            removeMedia(file)
                                            setSelectedMedia(null)
                                            getMediaStream()
                                        }}
                                        is_current={selectedMedia?.file === file}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <TextField
                    label="Legenda"
                    placeholder="Insira uma legenda"
                    value={caption}
                    onChange={(ev) => setCaption(ev.target.value)}
                    autoComplete="off"
                    InputProps={{
                        sx: { color: "primary.main", bgcolor: "background.default", paddingLeft: "0", paddingRight: "0" },
                        endAdornment: (
                            <Box sx={{ marginRight: "0.5vw" }}>
                                <IconButton
                                    color="primary"
                                    type="submit"
                                    onClick={() => {
                                        onSubmit()
                                    }}
                                >
                                    {loading > 0 ? <CircularProgress size="1.5rem" /> : <SendIcon />}
                                </IconButton>
                            </Box>
                        ),
                    }}
                />
            </Box>
        </Dialog>
    )
}