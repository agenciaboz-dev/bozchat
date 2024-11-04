import React from "react"
import { IMaskInput } from "react-imask"

const MaskedInput = React.forwardRef<HTMLInputElement, any>((props, ref) => {
    return (
        <IMaskInput
            {...props}
            inputRef={ref} // pass ref to IMaskInput
        />
    )
})

export default MaskedInput
