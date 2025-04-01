import React, { useEffect, useState } from "react"
import { Box, useMediaQuery } from "@mui/material"
import Inputmask from "inputmask"
import { washima_colors } from "../../style/colors"

interface MessageAuthorProps {
    author?: string | null
    small?: boolean
}

const authors_colors: { author: string; color: string }[] = []
const random_colors = washima_colors

export const getAuthorName = (author?: string | null) => {
    const author_split = author?.split(" - ") || []
    const author_name = author_split?.length > 0 ? (author_split[0] === "undefined" ? "" : author_split[0]) : ""
    const author_phone =
        author_split?.length > 1
            ? // @ts-ignore
              new Inputmask({ mask: "+99 (99) 9999-9999", placeholder: "", greedy: false }).format(
                  author_split[1].length === 10 ? "55" + author_split[1] : author_split[1]
              )
            : ""
    return { author_name, author_phone }
}

export const MessageAuthor: React.FC<MessageAuthorProps> = ({ author, small }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")

    const { author_name, author_phone } = getAuthorName(author)

    const [authorColor, setAuthorColor] = useState("")

    useEffect(() => {
        if (author) {
            if (!authors_colors.find((item) => item.author === author)) {
                const newColor = random_colors[authors_colors.length % random_colors.length] // Use modulo to cycle through colors
                authors_colors.push({ author: author, color: newColor })
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
            <Box
                sx={{
                    color: authorColor,
                    maxWidth: isMobile ? "25vw" : small ? "15vw" : undefined,
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                }}
            >
                {!!author_phone && "~ "}
                {author_name}
            </Box>
            <Box sx={{ color: "text.secondary", fontSize: "0.7rem" }}>{author_phone}</Box>
        </Box>
    )
}
