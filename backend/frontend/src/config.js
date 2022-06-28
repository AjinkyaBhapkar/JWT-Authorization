import axios from "axios"

 const axiosInstance = axios.create({
    baseURL:'https://jwt--auth.herokuapp.com'
})
export default axiosInstance