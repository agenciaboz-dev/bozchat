import axios from "axios"
import { url } from "./backend"

export const api = axios.create({
    // baseURL: "http://localhost:4105/api",
    baseURL: `http${url}`,
    timeout: 1000 * 20,
})
