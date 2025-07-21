export const numberMask = (number: string | number, mask?: string) => {
    if (!mask) return number

    let result = ""
    let numIndex = 0
    const cleanNumber = number.toString().replace(/\D/g, "") // Strip non-digit characters

    for (let i = 0; i < mask.length && numIndex < cleanNumber.length; i++) {
        if (mask[i] === "9") {
            result += cleanNumber[numIndex++]
        } else {
            result += mask[i]
        }
    }

    return result
}
