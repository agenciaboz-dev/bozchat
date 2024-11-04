import { SxProps } from "@mui/material"

export const scrollbar: SxProps = {
    overflowY: "auto",

    "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#888" /* Cor do rastreador */,
        borderRadius: "10px" /* Borda arredondada do rastreador */,
    },

    /* Estilizando o rastreador quando estiver passando o mouse */
    "&::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "#555" /* Cor do rastreador ao passar o mouse */,
    },

    /* Estilizando o rastreador quando estiver ativo (arrastando) */
    "&::-webkit-scrollbar-thumb:active": {
        backgroundColor: "#333" /* Cor do rastreador quando arrastado */,
    },
}
