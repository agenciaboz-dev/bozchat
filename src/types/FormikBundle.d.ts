import { FormikErrors, FormikTouched } from "formik"

export interface FormikBundle<T> {
    values: T
    initialValues: T
    errors: FormikErrors<T>
    touched: FormikTouched<T>
    handleChange: (e: React.ChangeEvent<any>) => void
    handleBlur: {
        (e: React.FocusEvent<any, Element>): void
        <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void
    }
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void> | Promise<FormikErrors<T>>
    setFieldTouched: (field: string, touched?: boolean, shouldValidate?: boolean) => Promise<FormikErrors<T>> | Promise<void>
    setFieldError: (field: string, value: string | undefined) => void
    handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void
}
