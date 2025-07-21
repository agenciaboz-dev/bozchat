import React from "react"
import { Box, CircularProgress, IconButton, InputAdornment, styled, TextField, Toolbar, Tooltip, Typography } from "@mui/material"
import { Add, Cancel, Refresh, Search } from "@mui/icons-material"
import { QuickFilter, QuickFilterClear, QuickFilterControl, QuickFilterTrigger, ToolbarButton } from "@mui/x-data-grid"

interface DataGridToolbarProps {
    title?: string
    refresh?: () => void
    add?: () => void
    loading?: boolean
    left?: React.ReactNode
}

type OwnerState = {
    expanded: boolean
}
const StyledQuickFilter = styled(QuickFilter)({
    display: "grid",
    alignItems: "center",
})

const StyledToolbarButton = styled(ToolbarButton as any)<{ ownerState: OwnerState }>(({ theme, ownerState }) => ({
    gridArea: "1 / 1",
    width: "min-content",
    height: "min-content",
    zIndex: 1,
    opacity: ownerState.expanded ? 0 : 1,
    pointerEvents: ownerState.expanded ? "none" : "auto",
    transition: theme.transitions.create(["opacity"]),
}))

const StyledTextField = styled(TextField)<{
    ownerState: OwnerState
}>(({ theme, ownerState }) => ({
    gridArea: "1 / 1",
    overflowX: "clip",
    width: ownerState.expanded ? 150 : "var(--trigger-width)",
    opacity: ownerState.expanded ? 1 : 0,
    transition: theme.transitions.create(["width", "opacity"]),
}))

export const toolbar_style: React.CSSProperties = { padding: 8, justifyContent: "space-between", flexDirection: "row", display: "flex" }

export const DataGridToolbar: React.FC<DataGridToolbarProps> = (props) => {
    return (
        <>
            {!!props.title && (
                <Typography color="primary" variant="h6">
                    {props.title}
                </Typography>
            )}
            {props.left}
            <Box sx={{ display: "flex", marginLeft: "auto" }}>
                {props.add && (
                    <Tooltip title="Adicionar" enterDelay={0}>
                        <IconButton onClick={() => props.add?.()}>
                            <Add fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
                {props.refresh && (
                    <Tooltip title="Atualizar" enterDelay={0}>
                        <IconButton onClick={() => props.refresh?.()}>
                            {props.loading ? <CircularProgress size={"1.25rem"} /> : <Refresh fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                )}
                <StyledQuickFilter>
                    <QuickFilterTrigger
                        render={(triggerProps, state) => (
                            <Tooltip title="Buscar" enterDelay={0}>
                                <StyledToolbarButton
                                    {...triggerProps}
                                    ownerState={{ expanded: state.expanded }}
                                    color="default"
                                    aria-disabled={state.expanded}
                                >
                                    <Search fontSize="small" />
                                </StyledToolbarButton>
                            </Tooltip>
                        )}
                    />
                    <QuickFilterControl
                        render={({ ref, ...controlProps }, state) => (
                            <StyledTextField
                                {...controlProps}
                                ownerState={{ expanded: state.expanded }}
                                inputRef={ref}
                                aria-label="Search"
                                placeholder="Search..."
                                size="small"
                                // onChange={(ev) => {
                                //     controlProps.onChange?.(ev)
                                //     onSearch(state.value)
                                // }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search fontSize="small" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: state.value ? (
                                        <InputAdornment position="end">
                                            <QuickFilterClear
                                                edge="end"
                                                size="small"
                                                aria-label="Clear search"
                                                material={{ sx: { marginRight: -0.75 } }}
                                                // onClick={() => onSearch("")}
                                            >
                                                <Cancel fontSize="small" />
                                            </QuickFilterClear>
                                        </InputAdornment>
                                    ) : null,
                                    ...controlProps.slotProps?.input,
                                }}
                            />
                        )}
                    />
                </StyledQuickFilter>
            </Box>
        </>
    )
}
