import React, { useEffect, useState } from "react"
import { Box, useMediaQuery, useTheme } from "@mui/material"
import Inputmask from "inputmask"
import { washima_colors } from "../../style/colors"

interface MessageAuthorProps {
    author?: string | null
}

const authors_colors: { author: string; color: string }[] = []
const random_colors = washima_colors

export const MessageAuthor: React.FC<MessageAuthorProps> = ({ author }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")

    const theme = useTheme()

    const author_split = author?.split(" - ") || []
    const author_name = author_split?.length > 0 ? (author_split[0] === "undefined" ? "" : author_split[0]) : ""
    const author_phone =
        // @ts-ignore
        author_split?.length > 1 ? new Inputmask({ mask: "+99 (99) 9999-9999", placeholder: "", greedy: false }).format(author_split[1]) : ""

    const [authorColor, setAuthorColor] = useState("")

    useEffect(() => {
        if (author) {
            if (!authors_colors.find((item) => item.author === author)) {
                authors_colors.push({ author: author, color: random_colors[authors_colors.length] })
            }

            const color_index = authors_colors.findIndex((item) => item.author === author)
            setAuthorColor(authors_colors[color_index].color)
        }
    }, [])

    return (
        <Box
            sx={{
                fontSize: "0.85rem",
                gap: isMobile ? "2vw" : "0.5vw",
                fontWeight: "bold",
                alignItems: "center",
            }}
        >
            <Box sx={{ color: authorColor }}>
                {!!author_phone && "~ "}
                {author_name}
            </Box>
            <Box sx={{ color: theme.palette.secondary.dark, fontSize: "0.7rem" }}>{author_phone}</Box>
        </Box>
    )
}
