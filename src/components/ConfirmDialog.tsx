import React from "react"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from "@mui/material"
import { useConfirmDialog } from "burgos-confirm"

interface ConfirmDialogProps {}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({}) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { open, setOpen, title, content, onConfirm, button, hideCancel } = useConfirmDialog()

    const styles = {
        dialog: {
            width: isMobile ? "90vw" : "40vw",
            borderRadius: "4px",
        },

        wrapperBox: {
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.default",
            gap: isMobile ? "5vw" : "1vw",
            justifyContent: "center",
            padding: isMobile ? "5vw" : "1.5vw",
        },

        title: {
            fontSize: "1.4rem",
            padding: 0,
        },

        container: {
            display: "flex",
            padding: 0,
        },

        actions: {
            padding: 0,
            gap: "1vw",
        },
    }

    const handleClose = () => {
        setOpen(false)
    }

    const confirm = () => {
        onConfirm()
        handleClose()
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{ sx: { ...styles.dialog } }}
        >
            <Box sx={styles.wrapperBox}>
                <DialogTitle id="alert-dialog-title" sx={styles.title}>
                    {title}
                </DialogTitle>
                <DialogContent style={styles.container}>
                    <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
                </DialogContent>
                <DialogActions sx={styles.actions}>
                    {!hideCancel && (
                        <Button onClick={handleClose} sx={{ margin: 0 }}>
                            Cancelar
                        </Button>
                    )}
                    <Button variant="contained" onClick={confirm} autoFocus sx={{ color: "secondary.main" }} style={{ margin: 0 }}>
                        {button}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}
