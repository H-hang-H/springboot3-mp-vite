import axios from 'axios';

const http = axios.create({
    baseURL:'/api',
    timeout:5000
})
// 请求拦截器
http.interceptors.request.use(config=>{
    return config
},e=>{
    return new Promise.reject(e)
})

// 响应拦截器
http.interceptors.response.use(res=>{
    return res.data
},e=>{
    return new Promise.reject(e);
})
export default http;