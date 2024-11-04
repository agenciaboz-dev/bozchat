import { SxProps } from "@mui/material"

export const selectMenuStyle: SxProps = {
    "& .MuiList-root": {
        bgcolor: "background.default",
    },
    "&& .Mui-selected": {
        bgcolor: "background.paper",
        color: "secondary.main",
    },
}
