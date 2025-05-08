import React, { useEffect, useState } from "react"
import { Box, Typography, useMediaQuery } from "@mui/material"
import Inputmask from "inputmask"
import { washima_colors } from "../../style/colors"
import { useIo } from "../../hooks/useIo"
import { ContactId } from "../../types/Chat"

interface MessageAuthorProps {
    contact_id?: string | null
    washima_id?: string | null
}

const authors_colors: { author: string; color: string }[] = []
const random_colors = washima_colors

const storedAuthors = new Map<string, { author: string; phone: string }>()

export const getAuthorName = (author?: string | null) => {
    const contactRegex = /^(.*) - (\d+)$|^(.*)$/
    const match = author?.match(contactRegex)

    const author_name = match ? (match[1] ? match[1].trim() : match[0]) : ""
    const author_phone = match && match[2] ? match[2] : ""
    // @ts-ignore
    const formatted_phone = author_phone
        ? new Inputmask({ mask: "+99 (99) 9999-9999", placeholder: "", greedy: false }).format(
              author_phone.length === 10 ? "55" + author_phone : author_phone
          )
        : ""
    console.log(match, formatted_phone)
    return { author_name, author_phone: formatted_phone }
}

export const MessageAuthor: React.FC<MessageAuthorProps> = ({ contact_id, washima_id }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const io = useIo()

    const [authorName, setAuthorName] = useState("")
    const [authorPhone, setAuthorPhone] = useState("")

    const [authorColor, setAuthorColor] = useState("")

    useEffect(() => {
        if (authorName && contact_id) {
            if (!authors_colors.find((item) => item.author === contact_id)) {
                const newColor = random_colors[authors_colors.length % random_colors.length] // Use modulo to cycle through colors
                authors_colors.push({ author: contact_id, color: newColor })
            }

            const color_index = authors_colors.findIndex((item) => item.author === contact_id)
            setAuthorColor(authors_colors[color_index].color)
        }
    }, [authorName])

    useEffect(() => {
        if (washima_id && contact_id) {
            const existingAuthor = storedAuthors.get(contact_id)
            if (existingAuthor) {
                setAuthorName(existingAuthor.author)
                setAuthorPhone(existingAuthor.phone)
            } else {
                io.emit("washima:author", washima_id, contact_id, (author: string) => {
                    console.log({ author })
                    const { author_name, author_phone } = getAuthorName(author)
                    storedAuthors.set(contact_id, { author: author_name, phone: author_phone })
                    setAuthorName(author_name)
                    setAuthorPhone(author_phone)
                })
            }
        }
    }, [contact_id, washima_id])

    return (
        <Box
            sx={{
                fontSize: "0.85rem",
                gap: isMobile ? "2vw" : "0.5vw",
                fontWeight: "bold",
                alignItems: "center",
                width: "100%",
            }}
        >
            <Typography
                sx={{
                    color: authorColor,
                    flex: "1 1 33%",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                }}
            >
                {!!authorPhone && "~ "}
                {authorName}
            </Typography>
            <Box sx={{ color: "text.secondary", fontSize: "0.7rem" }}>{authorPhone}</Box>
        </Box>
    )
}
