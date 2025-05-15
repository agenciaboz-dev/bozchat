import React, { useMemo } from "react"
import { Box, TextField, Typography } from "@mui/material"

interface PairingCodeCharacterProps {
    character: string
}

const PairingCodeCharacter: React.FC<PairingCodeCharacterProps> = ({ character }) => (
    <TextField
        value={character}
        InputProps={{
            readOnly: true,
            sx: {
                fontSize: "1.5vw",
                fontWeight: "bold",
                "& .MuiInputBase-input": {
                    textAlign: "center",
                },
            },
        }}
    />
)

interface PairingCodeProps {
    code: string
}

export const PairingCode: React.FC<PairingCodeProps> = (props) => {
    // const codeArray = useMemo(() => Array.from(props.code), [props.code])

    return (
        <Box sx={{ gap: "0.5vw", alignItems: "center" }}>
            {/* {codeArray.slice(0, 4).map((char, index) => (
                <PairingCodeCharacter key={index} character={char} />
            ))}
            <Typography sx={{ fontSize: "2.5vw" }}>–</Typography>
            {codeArray.slice(4).map((char, index) => (
                <PairingCodeCharacter key={index} character={char} />
            ))} */}
            <Typography sx={{ fontSize: "3rem", alignSelf: "center", fontWeight: 'bold', }}>
                {props.code.slice(0, 4)} – {props.code.slice(4)}
            </Typography>
        </Box>
    )
}
