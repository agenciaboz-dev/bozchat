import { SxProps } from "@mui/material"
import colors, { default_colors } from "./colors"

interface StyleProps {
    darkMode?: boolean
    noBorder?: boolean
}

export const webkitbg = {
    "& .MuiInputBase-input.MuiOutlinedInput-input:-webkit-autofill": {
        "-webkit-box-shadow": ` 0 0 0 100px ${colors.background.primary} inset`,
        borderRadius: "initial",
    },
}

export const lightModeWebkitbg = {
    "& .MuiInputBase-input.MuiOutlinedInput-input:-webkit-autofill": {
        "-webkit-box-shadow": ` 0 0 0 100px ${default_colors.background.primary} inset`,
        borderRadius: "initial",
    },
}

export const textFieldStyle = ({ darkMode = true, noBorder = false }: StyleProps): SxProps => ({
    ...(darkMode ? webkitbg : lightModeWebkitbg),
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
            border: noBorder ? "none" : undefined,
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
        // borderRadius: "1vw",
        "@media (max-width: 600px)": {
            borderRadius: "3vw",
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
    "& .MuiInputBase-input::placeholder": {
        // color: "text.primary",
        opacity: darkMode ? 0.5 : 1,
    },
})

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
        borderRadius: "1vw",
        height: "3vw",
        "@media (max-width: 600px)": {
            borderRadius: "3vw",
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
    