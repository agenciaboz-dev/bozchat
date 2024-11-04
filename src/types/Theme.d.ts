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
    name: stirng
    primary: stirng
    secondary: stirng
    terciary: stirng
    success: stirng
    warning: stirng
    background_primary: stirng
    background_secondary: stirng
    text_primary: stirng
    text_secondary: stirng
    text_terciary: stirng
    timestamp: stirng
    user: User
}
