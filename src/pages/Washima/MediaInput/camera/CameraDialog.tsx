import React, { useEffect, useRef, useState } from "react"
import { Button, Box, Dialog, DialogContent, Typography, IconButton, TextField } from "@mui/material"
import { Close } from "@mui/icons-material"
import SendIcon from "@mui/icons-material/Send"

interface CameraDialogProps {
    showCam: boolean
    onClose: () => void
}

interface RecordedVideo {
    url: string
    blob: Blob
}

interface SelectedMedia {
    type: "photo" | "video"
    url: string
}

export const CameraDialog: React.FC<CameraDialogProps> = ({ showCam, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const photoRef = useRef<HTMLCanvasElement>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const recordedChunksRef = useRef<Blob[]>([])

    const [capturedPhotos, setCapturedPhotos] = useState<string[]>([])
    const [recordedVideos, setRecordedVideos] = useState<RecordedVideo[]>([])
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
        } catch (err) {
            console.error("Erro ao acessar a câmera: ", err)
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
                const dataURL = photoRef.current.toDataURL("image/png")
                setCapturedPhotos((prev) => [...prev, dataURL])
            }
        }
    }

    const handleDataAvailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data)
        }
    }

    const handleStopRecording = () => {
        if (mediaRecorderRef.current) {
            const mimeType = mediaRecorderRef.current.mimeType
            const blob = new Blob(recordedChunksRef.current, { type: mimeType })
            const url = URL.createObjectURL(blob)
            setRecordedVideos((prev) => [...prev, { url, blob }])
            recordedChunksRef.current = []
        }
    }

    const startRecording = () => {
        if (streamRef.current) {
            recordedChunksRef.current = []
            let options: MediaRecorderOptions = {}

            // Lista de MIME types com codecs de vídeo e áudio
            const mimeTypes = [
                "video/webm; codecs=vp9,opus",
                "video/webm; codecs=vp8,opus",
                "video/webm; codecs=h264,aac",
                "video/mp4; codecs=h264,aac",
                "video/webm",
                "video/mp4",
            ]

            // Encontrar o primeiro MIME type suportado
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
            } catch (e) {
                console.error("Erro ao iniciar a gravação: ", e)
                setError("Erro ao iniciar a gravação. Seu navegador pode não suportar os codecs necessários.")
            }
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
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
        setCapturedPhotos([])
        setRecordedVideos([])
        setIsRecording(false)
        setSelectedMedia(null)
        setError(null)
    }

    const downloadMedia = (type: "photo" | "video", url: string, filename: string) => {
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
    }

    useEffect(() => {
        if (showCam) {
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
    }, [showCam])

    return (
        // <>
        <Dialog
            open={showCam}
            // onClose={handleClose}
            // maxWidth="md"
            // fullWidth
            PaperProps={{
                sx: {
                    padding: "1vw",
                    // borderRadius: "1vw",
                    // gap: "1vw",
                    // flexDirection: "column",
                    bgcolor: "background.default",
                    maxWidth: "53vw",
                    minWidth: "53vw",
                    // overflow: "hidden",
                    // minWidth: "60vw",
                },
            }}
        >
            <Box sx={{ overflow: "hidden", flexDirection: "column", gap: "0.5vw" }}>
                <Box sx={{ justifyContent: "space-between", alignItems: "center" }}>
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
                <Box sx={{ gap: "1vw" }}>
                    <Box sx={{ flexDirection: "column", gap: "1vw" }}>
                        <Box
                            sx={{
                                minWidth: "34.5vw",
                                minHeight: "50vh",
                                border: "red solid 1px",
                            }}
                        >
                            {selectedMedia ? (
                                <Box>
                                    {selectedMedia.type === "photo" ? (
                                        <img src={selectedMedia.url} alt="Foto Capturada" style={{}} />
                                    ) : (
                                        <video src={selectedMedia.url} controls style={{}} />
                                    )}
                                </Box>
                            ) : (
                                <Box sx={{}}>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        style={{
                                            margin: 0,
                                        }}
                                    />
                                </Box>
                            )}
                            <canvas ref={photoRef} style={{ display: "none" }} />
                        </Box>
                        <Box>
                            {selectedMedia ? (
                                <Box sx={{ justifyContent: "space-between", flex: 1 }}>
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
                                    <Box sx={{ marginLeft: "auto", gap: "1vw" }}>
                                        <Button variant="contained" color="error" onClick={() => {}}>
                                            Remover midia
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {
                                                // downloadMedia()
                                            }}
                                        >
                                            Salvar midia
                                        </Button>
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{ marginLeft: "auto", gap: "1vw" }}>
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
                        {/* {capturedPhotos.length > 0 && ( */}
                        <Box sx={{ flexDirection: "column", gap: "0.5vh" }}>
                            <Typography variant="h6" sx={{ textAlign: "center" }}>
                                Fotografias
                            </Typography>
                            <Button
                                sx={{ height: "10vh", width: "7vw", fontSize: "4rem" }}
                                onClick={() => {
                                    setSelectedMedia(null)
                                    getMediaStream()
                                }}
                            >
                                +
                            </Button>
                            <Box sx={{ flexDirection: "column", gap: "0.5vh", overflow: "scroll", maxHeight: "40vh" }}>
                                {capturedPhotos.map((photo, index) => (
                                    <Box sx={{}} key={`photo-${index}`}>
                                        <img
                                            src={photo}
                                            alt={`Foto ${index + 1}`}
                                            style={{
                                                height: "10vh",
                                                width: "7vw",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => setSelectedMedia({ type: "photo", url: photo })}
                                        />
                                        {/* <Box
                                            sx={{
                                                // mt: 1,
                                                textAlign: "center",
                                            }}
                                        >
                                            <Button variant="text" onClick={() => downloadMedia("photo", photo, `foto-${index + 1}.png`)}>
                                                Baixar Foto
                                            </Button>
                                        </Box> */}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                        {/* )} */}
                        {/* {recordedVideos.length > 0 && ( */}
                        <Box sx={{ flexDirection: "column", gap: "0.5vh" }}>
                            <Typography variant="h6" sx={{ textAlign: "center" }}>
                                Vídeos
                            </Typography>
                            <Button sx={{ height: "10vh", width: "7vw", fontSize: "4rem" }}>+</Button>
                            <Box sx={{ flexDirection: "column", gap: "0.5vh", overflow: "scroll", maxHeight: "40vh" }}>
                                {recordedVideos.map((video, index) => (
                                    <Box key={`video-${index}`}>
                                        <video
                                            src={video.url}
                                            style={{
                                                cursor: "pointer",
                                                height: "10vh",
                                                width: "7vw",
                                            }}
                                            onClick={() => setSelectedMedia({ type: "video", url: video.url })}
                                            muted
                                        />
                                        {/* <Box
                                            sx={{
                                                textAlign: "center",
                                            }}
                                        >
                                            <Button variant="text" onClick={() => downloadMedia("video", video.url, `video-${index + 1}.webm`)}>
                                                Baixar Vídeo
                                            </Button>
                                        </Box> */}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                        {/* )} */}
                    </Box>
                </Box>
                <TextField
                    label="Legenda"
                    placeholder="Insira uma legenda"
                    value={caption}
                    onChange={(ev) => setCaption(ev.target.value)}
                    // sx={textFieldStyle}
                    autoComplete="off"
                    InputProps={{
                        sx: { color: "primary.main", bgcolor: "background.default", paddingLeft: "0", paddingRight: "0" },
                        endAdornment: (
                            <Box sx={{ marginRight: "0.5vw" }}>
                                <IconButton
                                    color="primary"
                                    type="submit"
                                    onClick={() => {
                                        // onSubmit()
                                    }}
                                >
                                    {/* {loading > 0 ? <CircularProgress size="1.5rem" /> : <SendIcon />} */}
                                    <SendIcon />
                                </IconButton>
                            </Box>
                        ),
                    }}
                />{" "}
            </Box>
        </Dialog>
    )
}

//     {selectedMedia && (
//         <Box>
//             <DialogTitle>{selectedMedia.type === "photo" ? "Foto Capturada" : "Vídeo Gravado"}</DialogTitle>
//             <DialogContent>
//                 {selectedMedia.type === "photo" ? (
//                     <img src={selectedMedia.url} alt="Foto Capturada" style={{}} />
//                 ) : (
//                     <video src={selectedMedia.url} controls style={{}} />
//                 )}
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={() => setSelectedMedia(null)}>Fechar</Button>
//             </DialogActions>
//         </Box>
//     )}
// </>
