export type ButtonType = "QUICK_REPLY" | "URL" | "PHONE_NUMBER" | "OTP" | "MPM" | "CATALOG" | "FLOW" | "VOICE_CALL" | "APP"
export type TemplateCategory = "AUTHENTICATION" | "MARKETING" | "UTILITY"
export type TemplateStatus = "APPROVED" | "PENDING" | "REJECTED"

export interface TemplateInfo {
    name: string
    components: TemplateComponent[]
    language: "en_US" | "pt_BR"
    status: string
    category: TemplateCategory
    id: string
}

export interface TemplateComponent {
    type: "HEADER" | "FOOTER" | "BODY" | "BUTTONS"
    format?: "IMAGE" | "TEXT"
    text?: string
    buttons?: {
        type: ButtonType
        text: string
        phone_number?: string
        url?: string
    }[]
}

export type TemplateForm = Omit<TemplateInfo, "status" | "id"> & {
    allow_category_change?: boolean
}

export interface TemplateFormResponse {
    id: string
    status: TemplateStatus
    category: TemplateCategory
}
