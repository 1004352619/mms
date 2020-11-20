import axios from 'axios'

// 默认找到publish下面的资源
// axios.get('/db.json').then(response =>{
//     const data =  response.data
//     console.log(data)

// })

const request =axios.create({
    // baseURL:'/dev-api',
    baseURL:process.env.VUE_APP_BASE_API,
    // baseURL:'/',
    timeout:5000 // 请求超时，5000毫秒
})

// request.get('/db.json').then(response =>{
//     console.log(response.data)
// })


// 请求拦截器
request.interceptors.request.use(config=>{
    // 请求拦截
    return config
},error =>{
    // 出现异常
    return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(response=>{
    // response.data
    return response
},error=>{
    return Promise.reject(error)
})

export default request //导出自定义创建