import React from 'react'
import {Box, IconButton, Paper} from '@mui/material'
import { Menu } from '@mui/icons-material'
import { useMenu } from '../hooks/useMenu'

interface HeaderProps {
    
}

export const Header:React.FC<HeaderProps> = ({  }) => {
    const menu = useMenu()
    
    return (
        <Paper
            sx={{
                height: "10%",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                backgroundColor: "background.default",
                borderRadius: 0,
            }}
        >
            <img src="/wagazap.svg" style={{ width: "3vw", height: "3vw" }} />
            <IconButton sx={{ position: "absolute", left: "2vw" }} onClick={() => menu.drawer.toogle()}>
                <Menu />
            </IconButton>
        </Paper>
    )
}