import React from "react"
import { Box, TextField } from "@mui/material"
import { textFieldStyle } from "../../style/textfield"
import { Search } from "@mui/icons-material"
import { string } from "yup"
import { FormikErrors, FormikTouched } from "formik"

interface WashimaSearchProps {
    searchFormik: {
        values: { washima_id: string; search: string }
        initialValues: { washima_id: string; search: string }
        errors: FormikErrors<{ washima_id: string; search: string }>
        touched: FormikTouched<{ washima_id: string; search: string }>
        handleChange: (e: React.ChangeEvent<any>) => void
        handleBlur: {
            (e: React.FocusEvent<any, Element>): void
            <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void
        }
        setFieldValue: (
            field: string,
            value: any,
            shouldValidate?: boolean | undefined
        ) => Promise<void> | Promise<FormikErrors<{ washima_id: string; search: string }>>
    }
}

export const WashimaSearch: React.FC<WashimaSearchProps> = ({ searchFormik }) => {
    return (
        <TextField
            sx={textFieldStyle}
            value={searchFormik.values.search}
            onChange={(ev) => searchFormik.setFieldValue("search", ev.target.value)}
            placeholder="Pesquisar chat ou mensagem"
            InputProps={{ sx: { gap: "0.5vw" }, startAdornment: <Search /> }}
        />
    )
}
