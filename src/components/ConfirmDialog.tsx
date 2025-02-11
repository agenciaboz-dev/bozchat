import React from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { useConfirmDialog } from "burgos-confirm"

interface ConfirmDialogProps {}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({}) => {
    const { open, setOpen, title, content, onConfirm, button, hideCancel } = useConfirmDialog()

    const styles = {
        dialog: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },

        title: {
            display: "flex",
            width: "100%",
            fontSize: "2vw",
            textAlign: "center",
            alignItems: "center",
            gap: "2vw",
            padding: "1vw",
            justifyContent: "center",
        },

        content_container: {
            paddingTop: "1vw!important",
            display: "flex",
            width: "40vw",
            flexDirection: "column",
            form: {
                flexDirection: "column",
                gap: "2vw",
            },
        },

        close_icon: {
            width: "2vw",
            height: "auto",
        },

        text: { textAlign: "justify", fontSize: "7vw" },
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
            sx={styles.dialog}
            PaperProps={{ sx: { bgcolor: "background.default" } }}
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                {!hideCancel && <Button onClick={handleClose}>Cancelar</Button>}
                <Button variant="contained" onClick={confirm} autoFocus sx={{ color: "secondary.main" }}>
                    {button}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
