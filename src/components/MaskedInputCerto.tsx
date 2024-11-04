import React, { ForwardedRef } from "react"
import Masked, { MaskedInputProps } from "react-text-mask"

interface IMaskedInputProps extends MaskedInputProps {
    // Include any additional props here if needed.
}

// Using React.forwardRef with TypeScript requires generic parameters for props and ref types.
const MaskedInputCerto = React.forwardRef<HTMLElement, IMaskedInputProps>((props, ref: ForwardedRef<HTMLElement>) => {
    // This callback function is used to pass the ref down to the actual input element.
    const inputRef = (instance: any) => {
        if (instance && ref && typeof ref === "function") {
            // Call the ref callback with the input element.
            ref(instance.inputElement)
        } else if (ref) {
            // If ref is a ref object, assign the input element to its current value.
            ;(ref as React.MutableRefObject<HTMLElement | null>).current = instance ? instance.inputElement : null
        }
    }

    // Spread the props onto the Masked component and attach the ref callback.
    return <Masked {...props} ref={inputRef} guide={false} />
})

export default MaskedInputCerto
