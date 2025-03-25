import React, { useState } from "react"
import { Box, IconButton, TextField } from "@mui/material"
import { textFieldStyle } from "../../style/textfield"
import { Close, Search } from "@mui/icons-material"
import { string } from "yup"
import { FormikErrors, FormikTouched } from "formik"
import { useDarkMode } from "../../hooks/useDarkMode"

interface WashimaSearchProps {
    handleSearch: (value: string) => void
}

export const WashimaSearch: React.FC<WashimaSearchProps> = ({ handleSearch }) => {
    const { darkMode } = useDarkMode()

    const [value, setValue] = useState("")

    const onChange = (text: string) => {
        setValue(text)
        handleSearch(text)
    }

    const clearSearch = () => {
        setValue("")
        handleSearch("")
    }

    return (
        <TextField
            sx={textFieldStyle({ darkMode })}
            value={value}
            onChange={(ev) => onChange(ev.target.value)}
            placeholder="Pesquisar chat ou mensagem"
            InputProps={{
                sx: { gap: "0.5vw" },
                startAdornment: <Search />,
                endAdornment: (
                    <IconButton sx={{ padding: 0 }} onClick={clearSearch}>
                        <Close />
                    </IconButton>
                ),
            }}
        />
    )
}
