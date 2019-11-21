import axios from 'axios'
const AuthAxios = axios.create({
    baseURL: 'http://34.87.24.184:8080'
})
const token = window.localStorage.getItem('token')
AuthAxios.defaults.headers.common['Authorization'] = `${token}`

export default AuthAxios