export interface Menu {
    id: number
    name: string
    path: string
    icon: React.ReactElement
    onClick: (data?: any) => void

    admin?: boolean
    submenus?: Menu[]
}
