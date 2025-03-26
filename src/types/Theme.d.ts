export interface Theme {
    id: number
    name: string
    timestamp: string
    primary: string
    secondary: string
    terciary: string
    success: string
    warning: string
    background: {
        primary: string
        secondary?: string
    }
    text: {
        primary: string
        secondary: string
        terciary: string
    }

    user?: User
}

export interface ThemeDB {
    id: number
    name: string
    primary: string
    secondary: string
    terciary: string
    success: string
    warning: string
    background_primary: string
    background_secondary: string
    text_primary: string
    text_secondary: string
    text_terciary: string
    timestamp: string
    user: User
}
