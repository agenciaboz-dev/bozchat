export interface Menu {
    name: string
    path: string
    icon: React.ReactElement
    onClick: (data?: any) => void

    admin?: boolean
    submenus?: Menu[]
}
