import React from 'react'
import {Box} from '@mui/material'
import { useUser } from '../../hooks/useUser'

interface CompanyCardProps {
    
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ }) => {
    const {company, user} = useUser()
    
    return (
        <Box sx={{flexDirection: 'column', padding: '1vw', color: "secondary.main", fontSize: "0.8rem"}}>
            <Box>Usuário: {user?.name}</Box>
            <Box>Empresa: {company?.business_name}</Box>
            
        </Box>
    )
}