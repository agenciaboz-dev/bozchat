import { SxProps } from "@mui/material"
import { useDarkMode } from "../hooks/useDarkMode"

export const textFieldStyle: SxProps = {
    "& .MuiInputLabel-root": {
        color: "grey",
        fontSize: "0.8rem",

        "@media (max-width: 600px)": {
            fontSize: "0.8rem",
        },
    },

    // não funciona
    "& .MuiInputLabel-root:focus": {
        color: "primary.main",
    },

    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            // bgcolor: "background.default",
            // borderColor: "primary.main",
        },
        fontSize: "1vw",

        "@media (max-width: 600px)": {
            fontSize: "3.75vw",
        },
    },

    "& .MuiInput-root": {
        "&::before": {
            borderColor: "secondary.main",
        },
    },
    "& .MuiInput-root:hover": {
        "&::before": {
            borderColor: "secondary.main",
        },
    },

    "& .MuiInputBase-root": {
        // borderRadius: "0 1vw 0vw 1vw",

        "@media (max-width: 600px)": {
            borderRadius: "0 3vw 0vw 3vw",
            height: "12vw",
        },
    },

    "& .MuiInputBase-root:not(.MuiInputBase-multiline)": {
        height: "3rem",
    },

    "& .MuiInputLabel-shrink": {
        fontSize: "1vw", // Tamanho da fonte do label quando dentro do input

        "@media (max-width: 600px)": {
            fontSize: "4vw",
        },
    },
}

export const textAreaField: SxProps = {
    "& .MuiInputLabel-root": {
        color: "grey",
        fontSize: "0.8vw",

        "@media (max-width: 600px)": {
            fontSize: "5vw",
        },
    },

    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            // bgcolor: "background.default",
            // borderColor: "primary.main",
        },
        fontSize: "1vw",

        "@media (max-width: 600px)": {
            fontSize: "3.75vw",
        },
    },

    "& .MuiInput-root": {
        "&::before": {
            borderColor: "secondary.main",
        },
        height: "10vw",
    },
    "& .MuiInput-root:hover": {
        "&::before": {
            borderColor: "secondary.main",
        },
    },
    "& .MuiInputBase-root": {
        borderRadius: "0 1vw 0vw 1vw",
        height: "3vw",

        "@media (max-width: 600px)": {
            borderRadius: "0 3vw 0vw 3vw",
            height: "12vw",
        },
    },

    "& .MuiInputLabel-shrink": {
        fontSize: "1vw", // Tamanho da fonte do label quando dentro do input

        "@media (max-width: 600px)": {
            fontSize: "4vw",
        },
    },
}
