import Fuse, { FuseOptionKey } from "fuse.js"
import normalize from "./normalize"

export interface FuzzyOptions<T> {
    list: T[]
    keys?: (keyof T)[]
    text: string
}

export const fuzzy = <T>(options: FuzzyOptions<T>) => {
    const fuse = new Fuse(options.list, {
        includeScore: true,
        keys: options.keys as string[],
        threshold: 0.1,
        ignoreLocation: true,
        minMatchCharLength: 1,
        ignoreDiacritics: true,
    })

    const result = fuse.search(normalize(options.text)).map((item) => item.item)
    return result
}
