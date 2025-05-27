import { light } from "@mui/material/styles/createPalette"
import { Theme } from "../types/Theme"

export const default_colors: Theme = {
    id: 1,
    name: "default_light",
    timestamp: "",
    primary: "#00AFEF",
    secondary: "#ffffff",
    terciary: "#99dff9",
    success: "#34A853",
    warning: "#ffb74d",
    background: {
        primary: "#ededed",
        secondary: "#ffffff50",
    },
    text: {
        primary: "#00AFEF",
        secondary: "#3F3F3F",
        terciary: "#70707090",
    },
}

export const default_dark_colors: Theme = {
    id: 2,
    name: "default_dark",
    timestamp: "",
    primary: "#00AFEF",
    secondary: "#ffffff",
    terciary: "#D9D9D9",
    success: "#34A853",
    warning: "#ffa726",
    background: {
        primary: "#131b26",
        secondary: "#131b2625",
    },
    text: {
        primary: "#00AFEF",
        secondary: "#D9D9D9",
        terciary: "#0078D475",
    },
}

const colors = default_dark_colors

export const custom_colors = {
    darkMode_border: "#3f3f47",
    darkMode_botEmittedMsg: "#287793",
    darkMode_botReceivedMsg: "#2a323c",
    darkMode_chatItemTriangleActive: "#3a3a49",
    darkMode_chatItemTriangleInactive: "#2a323c",
    darkMode_emittedMsg: "#0f6787",
    darkMode_messageMenuBg: "#4a4a4a",
    darkMode_receivedMsg: "#2a323c",
    darkMode_templatePreviewTriangle: "#2a323c",
    darkMode_interactiveMessageBorder: "#e1e1e188",
    darkMode_kanbanOverlay: "#00000025",

    lightMode_border: "#c9c9c9",
    lightMode_botEmittedMsg: "#0f6787",
    lightMode_botReceivedMsg: "#ededed",
    lightMode_botNodeDrawerBackground: "#f5f5f5",
    lightMode_chatBackground: "#f7f7f7",
    lightMode_chatItemTriangle: "#f7f7f7",
    lightMode_chatWrapper: "#f1f1f1",
    lightMode_dataGridColumnHeader: "#e5e5e5",
    lightMode_emittedMsg: "#bbdeff",
    lightMode_messageMenuBg: "#f0f0f0",
    lightMode_receivedMsg: "#e0e0e0",
    lightMode_templatePreviewTriangle: "#f4f4f4",
    lightMode_templatePreOvenTriangle: "#f7f7f7",
    lightMode_interactiveMessageBorder: "#41c1e188",
    lightMode_kanbanOverlay: "#0000000A",
}

export const washima_colors = [
    "#00BCD4", // Cyan 500
    "#43A047", // Green 600
    "#FFC107", // Amber 500
    "#F57C00", // Orange 700
    "#689F38", // Light Green 700
    "#0288D1", // Light Blue 700
    "#009688", // Teal 500
    "#FF335B",
    "#CDDC39", // Lime 500
    "#FF9800", // Orange 500
    "#1976D2", // Blue 700
    "#FFEB3B", // Yellow 500
    "#AFB42B", // Lime 700
    "#E64A19", // Deep Orange 700
    "#4CAF50", // Green 500
    "#039BE5", // Light Blue 600
    "#FFA000", // Amber 700
    "#1E88E5", // Blue 600
    "#00ACC1", // Cyan 600
    "#FF5722", // Deep Orange 500
    "#388E3C", // Green 700
    "#03A9F4", // Light Blue 500
    "#0097A7", // Cyan 700
    "#8BC34A", // Light Green 500
    "#C0CA33", // Lime 600
    "#FBC02D", // Yellow 700
    "#2196F3", // Blue 500
    "#00796B", // Teal 700
    "#FFEB3B", // Yellow 500
    "#5E35B1", // Deep Purple 600
    "#0D47A1", // Blue 900
]

// export const washima_colors = [
//     "#FF5733",
//     "#FF6F33",
//     "#FF8D1A",
//     "#FFAB33",
//     "#FFC300",
//     "#FFE333",
//     "#DAF7A6",
//     "#B6FF33",
//     "#75FF33",
//     "#33FF57",
//     "#33FF76",
//     "#33FF95",
//     "#33FFBD",
//     "#33FFF3",
//     "#33E0FF",
//     "#33C4FF",
//     "#3399FF",
//     "#3375FF",
//     "#3357FF",
//     "#5733FF",
//     "#7633FF",
//     "#9533FF",
//     "#BD33FF",
//     "#E033FF",
//     "#FF33F6",
//     "#FF33D7",
//     "#FF33B8",
//     "#FF3399",
//     "#FF337A",
//     "#FF335B",
// ]

export default colors
