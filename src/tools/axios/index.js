import axios from 'axios'
const AuthAxios = axios.create({
    baseURL: 'http://192.168.2.18:8080'
})
const token = window.localStorage.getItem('token')
AuthAxios.defaults.headers.common['Authorization'] = `${token}`

export default AuthAxios