import { SvgIconTypeMap } from "@mui/material"
import { OverridableComponent } from "@mui/material/OverridableComponent"
import { ReactNode } from "react"

export interface GeneralStat {
    title: string
    value?: ReactNode
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
        muiName: string
    }
    loading?: boolean
}
