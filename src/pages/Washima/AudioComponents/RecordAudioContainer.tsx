import React, { useEffect, useMemo, useRef, useState } from "react"
import { Box, CircularProgress, IconButton, Paper } from "@mui/material"
import { Delete, Mic, PauseCircleOutline, Send } from "@mui/icons-material"
import { useReactMediaRecorder } from "react-media-recorder"
import { RecordingAudioVisualizer } from "./RecordingAudioVisualizer"
import { WashimaMediaForm } from "../../../types/server/class/Washima/Washima"
import { formatTimeDuration } from "../../../tools/formatTimeDuration"

interface RecordAudioContainerProps {
    onSend: (audio: WashimaMediaForm) => void
    onRecordStart: () => void
    onRecordFinish: () => void
}

export const RecordAudioContainer: React.FC<RecordAudioContainerProps> = ({ onSend, onRecordStart, onRecordFinish }) => {
    const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const shouldSendRef = useRef(false)
    const streamRef = useRef<MediaStream | null>(null)

    const recorder = useReactMediaRecorder({
        audio: true,
        onStop(blobUrl, blob) {
            onRecordFinish()
            if (!!shouldSendRef.current) {
                onStop(blob)
            }
        },
        onStart() {
            shouldSendRef.current = true
            streamRef.current = null
            startCountingDuration()
        },
        // mediaRecorderOptions: { mimeType: "audio/mp3" },
    })

    const [duration, setDuration] = useState(0)
    const [loading, setLoading] = useState(false)

    const startCountingDuration = () => {
        const interval = setInterval(() => setDuration((value) => (value += 1000)), 1000)
        durationIntervalRef.current = interval
    }
    const stopCounter = () => {
        if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current)
        }
    }

    const onPause = () => {
        recorder.pauseRecording()
        stopCounter()
    }

    const onResume = () => {
        recorder.resumeRecording()
        startCountingDuration()
    }

    const onStop = async (blob: Blob) => {
        try {
            setLoading(true)
            // const base64 = await file2base64(blob)
            const media: WashimaMediaForm = {
                base64: "",
                file: new File([blob], blob.type),
                mimetype: blob.type,
                size: blob.size,
                convertToFormat: "mp3",
            }
            onSend(media)
        } catch (error) {
            console.log(error)
        } finally {
            stopCounter()
            setDuration(0)
            setLoading(false)
        }
    }

    const onCancel = () => {
        shouldSendRef.current = false
        recorder.stopRecording()
        stopCounter()
        setDuration(0)
    }

    const startRecording = () => {
        onRecordStart()
        recorder.startRecording()
    }

    useEffect(() => {
        if (recorder.previewAudioStream && !streamRef.current) {
            streamRef.current = recorder.previewAudioStream
        }
    }, [recorder.previewAudioStream])

    return recorder.status !== "stopped" && recorder.status !== "idle" ? (
        <Box sx={{ gap: "0.5vw", alignItems: "center" }}>
            <IconButton onClick={() => onCancel()}>
                <Delete />
            </IconButton>

            <Paper
                elevation={5}
                sx={{
                    borderRadius: "2vw",
                    padding: "0.1vw 0.5vw",
                    width: "15vw",
                    justifyContent: "space-between",
                    gap: "0.5vw",
                    alignItems: "center",
                }}
            >
                <RecordingAudioVisualizer stream={streamRef.current} paused={recorder.status === "paused"} />
                <Box sx={{ width: "3vw" }}>{formatTimeDuration(duration)}</Box>
            </Paper>

            <IconButton color="error" onClick={() => (recorder.status === "paused" ? onResume() : onPause())}>
                {recorder.status === "paused" ? <Mic /> : <PauseCircleOutline />}
            </IconButton>

            <IconButton color="primary" onClick={() => recorder.stopRecording()}>
                <Send />
            </IconButton>
        </Box>
    ) : (
        <IconButton color="primary" onClick={() => startRecording()} disabled={loading}>
            {loading ? <CircularProgress size={"1.5rem"} /> : <Mic />}
        </IconButton>
    )
}
