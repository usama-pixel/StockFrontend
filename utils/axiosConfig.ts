import axios from "axios";

const base_url = process.env.NEXT_PUBLIC_BASE_URL
console.log({base_url})

const instance = axios.create({
    baseURL: base_url
})

export default instance;