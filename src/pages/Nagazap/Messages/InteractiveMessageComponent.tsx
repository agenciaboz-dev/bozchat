import React from "react"
import { Box, Button, MenuItem, Tooltip, Typography } from "@mui/material"
import { WhastappButtonAction, WhatsappInteractiveForm, WhatsappListAction } from "../../../types/server/class/Nagazap"
import { List, Reply } from "@mui/icons-material"

interface InteractiveMessageComponentProps {
    interactive: WhatsappInteractiveForm
}

export const InteractiveMessageComponent: React.FC<InteractiveMessageComponentProps> = (props) => {
    const buttons = props.interactive.type === "button" ? (props.interactive.action as WhastappButtonAction).buttons : undefined
    const lists = props.interactive.type === "list" ? (props.interactive.action as WhatsappListAction).sections : undefined

    return (
        <Box sx={{ flexDirection: "column" }}>
            {buttons?.map((button) => (
                <Button
                    key={button.reply.id}
                    variant="text"
                    // fullWidth
                    sx={{
                        textTransform: "none",
                        color: "secondary.main",
                        fontWeight: "bold",
                        borderTop: "1px solid",
                        borderColor: "#e1e1e188",
                        borderRadius: 0,
                        margin: "0 -0.5vw",
                        minWidth: "10vw",
                    }}
                    startIcon={<Reply />}
                >
                    {button.reply.title}
                </Button>
            ))}

            {lists?.map((list, index) => (
                <Tooltip
                    arrow
                    placement="left-end"
                    title={
                        <Box sx={{ flexDirection: "column" }}>
                            <Typography sx={{fontWeight: 'bold', marginBottom: '0.5vw'}}>Opções:</Typography>
                            {list.rows.map((button, button_index) => (
                                <MenuItem key={button.id} sx={{color: 'primary.main', borderTop: "1px solid",
                            borderColor: "#e1e1e188",}}>
                                    <Typography sx={{ color: "secondary.main", fontWeight: "bold", marginRight: "0.5vw" }}>
                                        {button_index + 1}.{" "}
                                    </Typography>
                                    {button.title}
                                </MenuItem>
                            ))}
                        </Box>
                    }
                >
                    <Button
                        key={list.title + index.toString()}
                        variant="text"
                        // fullWidth
                        sx={{
                            textTransform: "none",
                            color: "secondary.main",
                            fontWeight: "bold",
                            borderTop: "1px solid",
                            borderColor: "#e1e1e188",
                            borderRadius: 0,
                            margin: "0 -0.5vw",
                            minWidth: "10vw",
                        }}
                        startIcon={<List />}
                    >
                        {list.title}
                    </Button>
                </Tooltip>
            ))}
        </Box>
    )
}
