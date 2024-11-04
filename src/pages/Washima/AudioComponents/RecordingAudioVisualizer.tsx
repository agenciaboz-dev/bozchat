import React, { memo, useEffect, useRef } from "react"
import { Box, lighten, useTheme } from "@mui/material"

interface RecordingAudioVisualizerProps {
    stream: MediaStream | null
    paused?: boolean
}

const WIDTH = 10 * (window.innerWidth / 100)
const HEIGHT = 1.5 * (window.innerWidth / 100)

export const RecordingAudioVisualizer: React.FC<RecordingAudioVisualizerProps> = ({ stream, paused }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const theme = useTheme()

    useEffect(() => {
        if (!stream) return

        console.log("Visualizer effect triggered")
        const audioContext = new AudioContext()
        const analyser = audioContext.createAnalyser()
        const source = audioContext.createMediaStreamSource(stream)
        source.connect(analyser)
        analyser.fftSize = 2048
        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        const canvas = canvasRef.current
        if (!canvas) return

        const canvasCtx = canvas.getContext("2d")
        if (!canvasCtx) return

        canvasCtx.clearRect(0, 0, WIDTH, 100)
        const centerY = HEIGHT / 2 // Define center line
        const centerX = WIDTH / 2 // Define center of the canvas

        const draw = () => {
            const drawVisual = requestAnimationFrame(draw)
            analyser.getByteFrequencyData(dataArray)
            canvasCtx.fillStyle = lighten(theme.palette.background.paper, 0.1)
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)
            const barWidth = (WIDTH / bufferLength) * 2.5
            let x = 0
            for (let i = 0; i < bufferLength; i++) {
                // Map low frequencies to center and high frequencies to edges
                const index = i

                const normalizedValue = dataArray[index] / 255
                const barHeight = normalizedValue * (HEIGHT / 2)

                canvasCtx.fillStyle = theme.palette.primary.main

                // Left side bars
                canvasCtx.fillRect(centerX - x - barWidth, centerY - barHeight, barWidth, barHeight)
                canvasCtx.fillRect(centerX - x - barWidth, centerY, barWidth, barHeight)

                // Right side bars
                canvasCtx.fillRect(centerX + x, centerY - barHeight, barWidth, barHeight)
                canvasCtx.fillRect(centerX + x, centerY, barWidth, barHeight)

                x += barWidth + 1
            }
        }

        draw()
    }, [stream])

    return <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={{ width: "100%", height: "auto" }} />
}
