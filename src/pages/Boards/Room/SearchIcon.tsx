import React from "react"
import { Box, IconButton, TextField, Tooltip, Typography } from "@mui/material"
import { Search } from "@mui/icons-material"

interface SearchIconProps {
    showSearchBar: boolean
    setShowSearchBar: React.Dispatch<React.SetStateAction<boolean>>
}

export const SearchIcon: React.FC<SearchIconProps> = (props) => {
    return (
        <Box sx={{ marginLeft: "auto" }}>
            <IconButton onClick={() => props.setShowSearchBar(value => !value)}>
                <Search color={props.showSearchBar ? 'primary' : 'inherit'} />
            </IconButton>
        </Box>
    )
}
