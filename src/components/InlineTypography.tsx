import React from "react"
import { Box, Typography, TypographyProps } from "@mui/material"

interface InlineTypographyProps extends TypographyProps {
    url?: string
    highlight?: boolean
}

export const InlineTypography: React.FC<InlineTypographyProps> = (props) => {
    return (
        <Typography
            sx={{
                display: "inline-flex",
                color: props.url ? "success.main" : props.highlight ? "primary.main" : undefined,
                cursor: props.url ? "pointer" : undefined,
                "&:hover": props.url
                    ? {
                          textDecoration: "underline",
                      }
                    : undefined,
                ...props.sx,
            }}
            onClick={props.url ? () => window.open(props.url, "_new") : undefined}
            {...props}
        />
    )
}
