import React, { Ref, RefObject, useEffect, useState } from "react"
import { Box, ExtendButtonBase, IconButton, IconButtonProps, IconButtonTypeMap } from "@mui/material"
import { ArrowLeft, ChevronLeft, ChevronRight } from "@mui/icons-material"
import { AnimatePresence, motion } from "framer-motion"

interface ScrollOverlayProps {
    scrollRef: RefObject<HTMLDivElement | null>
}

const icon_size = "5vw"

const scrollAmount = 150

const arrowVariants = {
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    hidden: { opacity: 0, x: 50, transition: { duration: 0.3 } },
}

const ArrowButton: React.FC<{ arrow: "left" | "right"; buttonProps?: IconButtonProps; visible?: boolean }> = ({ arrow, buttonProps }) => {
    const Icon = arrow === "left" ? ChevronLeft : ChevronRight
    return (
        <motion.div
            initial="hidden"
            exit={"hidden"}
            animate={"visible"}
            variants={arrowVariants}
            style={{ marginRight: arrow === "left" ? "auto" : undefined, marginLeft: arrow === "right" ? "auto" : undefined }}
        >
            <IconButton {...buttonProps} sx={{}}>
                <Icon sx={{ width: icon_size, height: icon_size, pointerEvents: "auto" }} />
            </IconButton>
        </motion.div>
    )
}

export const ScrollOverlay: React.FC<ScrollOverlayProps> = (props) => {
    const [showLeftArrow, setShowLeftArrow] = useState(false)
    const [showRightArrow, setShowRightArrow] = useState(false)

    const [hoveringRight, setHoveringRight] = useState(false)
    const [hoveringLeft, setHoveringLeft] = useState(false)

    const [intervalId, setIntervalId] = useState<number | null>(null)

    const startScrolling = (direction: "left" | "right") => {
        stopScrolling() // Ensure no existing intervals are running
        const id = window.setInterval(() => {
            if (props.scrollRef.current) {
                props.scrollRef.current.scrollBy({ left: direction === "right" ? scrollAmount : -scrollAmount, behavior: "smooth" })
                window.dispatchEvent(new Event('resize'));
            }
        }, 100) // Adjust interval rate as needed
        setIntervalId(id)
    }

    const stopScrolling = () => {
        if (intervalId) {
            clearInterval(intervalId)
            setIntervalId(null)
        }
    }

    const checkScroll = () => {
        if (props.scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = props.scrollRef.current
            setShowLeftArrow(scrollLeft > 0) // There is content to the left
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth) // There is content to the right
        }
    }

    useEffect(() => {
        const scrollContainer = props.scrollRef.current
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", checkScroll, { passive: true })
            checkScroll() // Initial check on mount
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener("scroll", checkScroll)
            }
        }
    }, [props.scrollRef])

    // useEffect(() => {
    //     if (props.scrollRef.current) {
    //         if (hoveringRight) {
    //             // keep scrolling while mouse is hovering the right arrow
    //         }

    //         if (hoveringLeft) {
    //             // keep scrolling while mouse is hovering the left arrow

    //         }
    //     }
    // }, [props.scrollRef.current, hoveringLeft, hoveringRight])

    return (
        <Box sx={{ position: "absolute", top: 0, left: 0, width: 1, height: 1, opacity: 0.5, alignItems: "center", pointerEvents: "none" }}>
            <AnimatePresence>
                {showLeftArrow && (
                    <ArrowButton arrow="left" buttonProps={{ onMouseEnter: () => startScrolling("left"), onMouseLeave: stopScrolling }} />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showRightArrow && (
                    <ArrowButton arrow="right" buttonProps={{ onMouseEnter: () => startScrolling("right"), onMouseLeave: stopScrolling }} />
                )}
            </AnimatePresence>
        </Box>
    )
}
