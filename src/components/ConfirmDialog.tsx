import React from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from "@mui/material"
import { useConfirmDialog } from "burgos-confirm"

interface ConfirmDialogProps {}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({}) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { open, setOpen, title, content, onConfirm, button, hideCancel } = useConfirmDialog()

    const styles = {
        dialog: {
            display: "flex",
            gap: isMobile ? "5vw" : "",
            justifyContent: "center",
            padding: isMobile ? "5vw" : "1vw",
            width: isMobile ? "90vw" : "40vw",
        },

        title: {
            fontSize: "1.4rem",
            padding: isMobile ? 0 : "8px",
        },

        container: {
            display: "flex",
            padding: isMobile ? 0 : "8px",
        },

        actions: {
            padding: isMobile ? 0 : "8px",
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
            PaperProps={{ sx: { ...styles.dialog, bgcolor: "background.default" } }}
        >
            <DialogTitle id="alert-dialog-title" sx={styles.title}>
                {title}
            </DialogTitle>
            <DialogContent style={styles.container}>
                <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
            </DialogContent>
            <DialogActions sx={styles.actions}>
                {!hideCancel && <Button onClick={handleClose}>Cancelar</Button>}
                <Button variant="contained" onClick={confirm} autoFocus sx={{ color: "secondary.main" }}>
                    {button}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
