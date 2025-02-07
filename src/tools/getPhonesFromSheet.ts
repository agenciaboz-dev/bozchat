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

export const getDataFromSheet = async (file: File, extension: string) => {
    const handler = {
        xlsx: async (file: File) => {
            // Read the file without specifying a schema
            const rows = await readXlsxFile(file, { sheet: 1 })

            if (rows.length === 0) {
                console.log("The sheet is empty.")
                return []
            }

            // The first row is assumed to contain column headers
            const headers = rows.shift() as string[]

            // Transform rows into objects
            const list = rows.map((row) => {
                let obj: { [key: string]: string } = {}
                row.forEach((cell, index) => {
                    obj[headers[index]] = cell.toString()
                })
                return obj
            })

            return list
        },
        csv: async (file: File) => {
            const reader = new FileReader()
            const promise: Promise<
                {
                    [key: string]: string
                }[]
            > = new Promise((resolve, reject) => {
                reader.onload = () => {
                    const text = reader.result as string
                    console.log(text)
                    const fields = text.trim().split("\n")
                    const variables_text = fields.shift()

                    if (variables_text) {
                        const variables = variables_text.split(",")

                        const list = fields.map((text) => {
                            let obj: { [key: string]: string } = {}
                            const values = text.split(",")
                            values.forEach((value, index) => {
                                obj[variables[index]] = value
                            })

                            return obj
                        })

                        resolve(list)
                    } else {
                        reject()
                    }
                }

                reader.onerror = reject
            })

            reader.readAsText(file)
            return promise
        },
    }

    return await handler[extension as keyof typeof handler](file)
}
