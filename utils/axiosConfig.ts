import axios from "axios";
import Cookies from "js-cookie";

const base_url = process.env.NEXT_PUBLIC_BASE_URL
console.log({base_url})

const instance = axios.create({
    baseURL: base_url
})

instance.interceptors.request.use(
    function (config) {
        const token = Cookies.get('token')
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    },
    function (err) {
        return Promise.reject(err)
    }
)

export default instance;