import axios from "axios"
import { url } from "./backend"

export const api = axios.create({
    baseURL: `http${url}`,
    timeout: 1000 * 30,
})
