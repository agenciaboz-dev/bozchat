import { SvgIconTypeMap } from "@mui/material"
import { OverridableComponent } from "@mui/material/OverridableComponent"

export interface GeneralStat {
    title: string
    value: string | number
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
        muiName: string
    }
    loading?: boolean
}
