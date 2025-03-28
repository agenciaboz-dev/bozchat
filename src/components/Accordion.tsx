import React from "react"
import { Box } from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"

interface AccordionProps {
    expanded: boolean
    titleElement: React.ReactNode
    expandedElement: React.ReactNode
    hideTitle?: boolean
}

export const Accordion: React.FC<AccordionProps> = (props) => {
    const titleVariants = {
        visible: { height: "auto", transition: { duration: 0.3 } },
        hidden: { height: 0, transition: { duration: 0.3 } }, // Scale title to 0 instead of changing height
    }

    const contentVariants = {
        opened: {
            height: "24vw", // Fixed height when expanded
            // opacity: 1,
            transition: { duration: 0.5 },
        },
        closed: {
            height: 0, // Height is 0 when closed
            // opacity: 0,
            transition: { duration: 0.5 },
        },
    }

    return (
        <Box sx={{ overflow: "hidden", width: "100%", flexDirection: "column" }}>
            <AnimatePresence>
                {!props.expanded || !props.hideTitle ? (
                    <motion.div initial="hidden" animate="visible" exit="hidden" variants={titleVariants}>
                        <Box
                            sx={{ cursor: "pointer", bgcolor: "background.default", color: "text.primary" }}
                            onClick={() => (props.expanded ? null : props.hideTitle)}
                        >
                            {props.titleElement}
                        </Box>
                    </motion.div>
                ) : null}
            </AnimatePresence>
            <AnimatePresence>
                {props.expanded && (
                    <motion.div initial="closed" animate={props.expanded ? "opened" : "closed"} exit="closed" variants={contentVariants}>
                        <Box sx={{ color: "text.primary", width: "100%" }}>{props.expandedElement}</Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    )
}
