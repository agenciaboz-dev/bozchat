import React, { useEffect, useState } from "react"
import { Box, Typography, useMediaQuery } from "@mui/material"
import Inputmask from "inputmask"
import { washima_colors } from "../../style/colors"
import { useIo } from "../../hooks/useIo"
import { ContactId } from "../../types/Chat"

interface MessageAuthorProps {
    contact_id?: string | null
    washima_id?: string | null
    author?: string
    phone?: string
}

const authors_colors: { author: string; color: string }[] = []
const random_colors = washima_colors

const storedAuthors = new Map<string, { author: string; phone: string }>()

const formatPhone = (phone: string) => {
    const formatted_phone = phone
        ? // @ts-ignore
          new Inputmask({ mask: "+99 (99) 9999-9999", placeholder: "", greedy: false }).format(phone.length === 10 ? "55" + phone : phone)
        : ""
    return formatted_phone
}

export const getAuthorName = (author?: string | null) => {
    const contactRegex = /^(.*) - (\d+)$|^(.*)$/
    const match = author?.match(contactRegex)

    const author_name = match ? (match[1] ? match[1].trim() : match[0]) : ""
    const author_phone = match && match[2] ? match[2] : ""
    const formatted_phone = formatPhone(author_phone)

    return { author_name, author_phone: formatted_phone }
}

export const MessageAuthor: React.FC<MessageAuthorProps> = ({ contact_id, washima_id, author, phone }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const io = useIo()

    const [authorName, setAuthorName] = useState(author || "")
    const [authorPhone, setAuthorPhone] = useState(phone || "")

    const [authorColor, setAuthorColor] = useState("")

    const generateColor = (id: string) => {
        if (!authors_colors.find((item) => item.author === id)) {
            const newColor = random_colors[authors_colors.length % random_colors.length] // Use modulo to cycle through colors
            authors_colors.push({ author: id, color: newColor })
        }

        const color_index = authors_colors.findIndex((item) => item.author === id)
        setAuthorColor(authors_colors[color_index].color)
    }

    useEffect(() => {
        if (author) {
            setAuthorName(author)
            setAuthorPhone(phone || "")
        }
    }, [author, phone])

    useEffect(() => {
        if (authorName && contact_id) {
            generateColor(contact_id)
        }
    }, [authorName])

    useEffect(() => {
        if (authorName && authorPhone && !contact_id) {
            setAuthorPhone(formatPhone(authorPhone))
            generateColor(authorPhone)
        }
    }, [authorName, authorPhone, contact_id])

    useEffect(() => {
        if (washima_id && contact_id && !author) {
            const existingAuthor = storedAuthors.get(contact_id)
            if (existingAuthor) {
                setAuthorName(existingAuthor.author)
                setAuthorPhone(existingAuthor.phone)
            } else {
                io.emit("washima:author", washima_id, contact_id, (contact: string) => {
                    console.log({ contact })
                    const { author_name, author_phone } = getAuthorName(contact)
                    storedAuthors.set(contact_id, { author: author_name, phone: author_phone })
                    setAuthorName(author_name)
                    setAuthorPhone(author_phone)
                })
            }
        }
    }, [contact_id, washima_id, author])

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
