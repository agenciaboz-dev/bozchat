import readXlsxFile from "read-excel-file"

export const getPhonesfromSheet = async (file: File) => {
    const schema = {
        Telefone: {
            prop: "phone",
            type: String,
        },
    }
    const result = await readXlsxFile(file, { schema, sheet: 1 })
    const list = result.rows as { phone: string }[]
    console.log(list)
    return list
}
