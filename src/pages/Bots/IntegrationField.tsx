import React, { useRef, useState } from "react"
import { Box, Checkbox, Chip, IconButton, Menu, MenuItem, Paper, TextField, useMediaQuery } from "@mui/material"
import { Title2 } from "../../components/Title"
import { FormikBundle } from "../../types/FormikBundle"
import { BotForm } from "../../types/server/class/Bot/Bot"
import { Add, NotInterested } from "@mui/icons-material"
import { useDarkMode } from "../../hooks/useDarkMode"

interface IntegrationWrapperProps {
    title: string
    formik: FormikBundle<BotForm>
    list: { id: string; name: string }[]
    name: "washima_ids" | "nagazap_ids"
}

export const IntegrationField: React.FC<IntegrationWrapperProps> = ({ title, formik, list, name }) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { darkMode } = useDarkMode()
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

    const onItemClick = (id: string) => {
        let current_list = formik.values[name]
        if (current_list.includes(id)) {
            current_list = current_list.filter((item) => item !== id)
        } else {
            current_list.push(id)
        }

        formik.setFieldValue(name, current_list)
    }

    return (
        <Paper
            sx={{
                flex: 1,
                flexDirection: "column",
                padding: isMobile ? "5vw" : "2vw",
                borderRadius: "1vw",
                gap: "1vw",
                height: "max-content",
                paddingTop: isMobile ? "5vw" : "1.2vw",
            }}
        >
            <Title2
                name={title}
                right={
                    <IconButton onClick={(ev) => setAnchorEl(ev.currentTarget)}>
                        <Add />
                    </IconButton>
                }
            />
            <Menu
                open={!!anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorEl={anchorEl}
                MenuListProps={{ sx: { bgcolor: "background.default", maxHeight: "20vw", overflow: "scroll" } }}
            >
                {list.map((item) => (
                    <MenuItem key={item.id} onClick={() => onItemClick(item.id)}>
                        <Checkbox checked={formik.values[name].includes(item.id)} />
                        {item.name}
                    </MenuItem>
                ))}
            </Menu>
            {/* <TextField
                inputRef={input_ref}
                select
                value={formik.values[name]}
                onChange={formik.handleChange}
                name={name}
                label="Selecionar"
                // sx={{ display: "none" }}
                SelectProps={{
                    multiple: true,
                    renderValue: (values: string[]) =>
                        list
                            .filter((item) => values.includes(item.id))
                            .map((item) => item.name)
                            .join(", "),
                    MenuProps: { MenuListProps: { sx: { bgcolor: "background.default", maxHeight: "20vw", overflow: "scroll" } } },
                }}
            >
                {list.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                        <Checkbox checked={formik.values[name].includes(item.id)} />
                        {item.name}
                    </MenuItem>
                ))}
            </TextField> */}
            <Box sx={{ gap: isMobile ? "3vw" : "1vw", flexWrap: "wrap" }}>
                {formik.values[name].length > 0 ? (
                    formik.values[name].map((id) => (
                        <Chip
                            color="primary"
                            label={list.find((item) => item.id === id)?.name}
                            onDelete={() =>
                                formik.setFieldValue(
                                    name,
                                    formik.values[name].filter((item) => item !== id)
                                )
                            }
                        />
                    ))
                ) : (
                    <Box sx={{ justifyContent: "center", alignItems: "center", color: "text.secondary", gap: isMobile ? "2vw" : "0.5vw", flex: 1 }}>
                        <NotInterested color={darkMode ? "secondary" : "action"} sx={{ width: isMobile ? "5vw" : "2vw", height: "auto" }} />
                        Nenhuma conta selecionada
                    </Box>
                )}
            </Box>
        </Paper>
    )
}
