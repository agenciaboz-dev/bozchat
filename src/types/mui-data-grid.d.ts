import { ComponentsOverrides, ComponentsProps } from "@mui/material/styles";

declare module '@mui/material/styles' {
  interface Components {
    MuiDataGrid?: {
      styleOverrides?: ComponentsOverrides<Theme>['MuiDataGrid'],
      defaultProps?: ComponentsProps['MuiDataGrid']
    };
  }
}