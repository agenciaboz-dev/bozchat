import { blobToBase64String } from "blob-util"

export const file2base64 = async (file: Blob) => {
    const result = await blobToBase64String(file)
    console.log({ result })
    const splitted = result.split("base64,")
    return splitted.length === 2 ? splitted[1] : result
}
