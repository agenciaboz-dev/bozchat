import React from 'react'
import {Box, Tooltip} from '@mui/material'
import { Home } from '@mui/icons-material'

interface EntryRoomIconProps {
    
}

export const EntryRoomIcon:React.FC<EntryRoomIconProps> = (props) => {
    
    return (
        <Tooltip title='Esta é a sala inicial do quadro'>
            <Home />
        </Tooltip>
    )
}