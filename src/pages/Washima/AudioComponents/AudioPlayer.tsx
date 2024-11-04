import React, { useEffect, useRef, useState } from "react"
import { Avatar, Box, CircularProgress, IconButton, Paper, Skeleton, Slider } from "@mui/material"
import { Headphones, Pause, PlayArrow } from "@mui/icons-material"
import { useAudioPlayer, useGlobalAudioPlayer } from "react-use-audio-player"
import { formatTimeDuration } from "../../../tools/formatTimeDuration"
import { api } from "../../../api"
import { Washima, WashimaProfilePic } from "../../../types/server/class/Washima/Washima"
import { WashimaMessage } from "../../../types/server/class/Washima/WashimaMessage"

interface AudioPlayerProps {
    media?: { source: string; ext: string }
    washima?: Washima
    chat_id?: string
    loading?: boolean
    message?: WashimaMessage
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ media, washima, chat_id, loading, message }) => {
    const player = useAudioPlayer()
    const test = useRef(0)

    const [position, setPosition] = useState(0)
    const [profilePicUrl, setProfilePicUrl] = useState("")

    const fetchProfilePic = async () => {
        try {
            const response = await api.get("/washima/profile-pic", { params: { washima_id: washima?.id, chat_id, message_id: message?.sid } })
            const data = response.data as WashimaProfilePic
            setProfilePicUrl(data.url)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (player.isReady) {
        }
    }, [player.isReady])

    useEffect(() => {
        let animationFrameId: number

        const updatePosition = () => {
            setPosition(player.getPosition() || 0)
            test.current = player.getPosition()
            animationFrameId = requestAnimationFrame(updatePosition)
        }

        updatePosition()

        return () => {
            cancelAnimationFrame(animationFrameId)
        }
    }, [player])

    useEffect(() => {
        if (media) {
            player.load(media.source, { autoplay: false, format: media.ext })
            fetchProfilePic()

            return () => {
                player.cleanup()
            }
        }
    }, [media])

    return (
        <Box sx={{ width: "19.5vw", gap: "0.5vw", alignItems: "center" }}>
            <Avatar sx={{ bgcolor: "warning.main", width: "3.5vw", height: "3.5vw" }} src={profilePicUrl}>
                <Headphones sx={{ borderRadius: 100, width: "2vw", height: "2vw" }} color="secondary" />
            </Avatar>
            {/* <CircularProgress size={"3.5vw"} /> */}
            <IconButton size="small" onClick={() => player.togglePlayPause()} disabled={loading}>
                {loading ? (
                    <CircularProgress size="2vw" color="inherit" />
                ) : player.playing ? (
                    <Pause sx={{ width: "2vw", height: "2vw" }} />
                ) : (
                    <PlayArrow sx={{ width: "2vw", height: "2vw" }} />
                )}
            </IconButton>
            <Box sx={{ position: "relative", flex: 1, height: "100%", alignItems: "center" }}>
                {!loading ? (
                    <Slider
                        size="small"
                        max={player.duration}
                        min={0}
                        value={position}
                        sx={{ width: "100%", marginLeft: "0.5vw" }}
                        color="secondary"
                        step={0.01}
                        onChange={(_, value) => player.seek(typeof value === "number" ? value : value[0])}
                        disabled={loading}
                    />
                ) : (
                    <Skeleton variant="rounded" sx={{ width: "100%", height: "0.5vw" }} animation="wave" />
                )}
                <Box sx={{ position: "absolute", bottom: 0, fontSize: "0.6rem" }}>
                    {formatTimeDuration(!player.stopped ? position * 1000 : player.duration * 1000)}
                </Box>
            </Box>
        </Box>
    )
}
