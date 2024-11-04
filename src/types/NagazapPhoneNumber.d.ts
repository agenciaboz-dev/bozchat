export interface NagazapPhoneNumber {
    code_verification_status: string
    display_phone_number: string
    id: string
    platform_type: string
    quality_rating: string
    verified_name: string

    throughput: {
        level: string
    }

    webhook_configuration: {
        application: string
    }
}
