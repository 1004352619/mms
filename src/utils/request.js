import axios from 'axios'
import { Loading } from 'element-ui';
import { Message } from 'element-ui';

const loading ={
    loadingInstance:null,//Loading 实例
    // 打开加载
    open:function(){
        // 创建实例并打开加载窗口
        if(this.loadingInstance===null){
            this.loadingInstance=Loading.service({
                target:'.main',
                text:'拼命加载中~~',
                background:'rgba(0,0,0,0.5)',
                
            });   
        }
       
    },
    // 关闭加载
    close:function(){
        // 不为空时，则关闭加载窗口
        if(this.loadingInstance !==null){
            this.loadingInstance.close()
        }
        this.loadingInstance=null
    }
}

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
    // 打开加载窗口
    loading.open()
    return config
},error =>{
    // 关闭窗口
    loading.close()
    // 出现异常
    return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(response=>{
    // response.data
    // 关闭窗口
    loading.close()
    const resp = response.data
   
    // 后台正常响应的状态，如果不是2000，说明后台处理有问题
    if(resp.code!==2000){
        Message({
            message:resp.message || '系统异常',
            type:'warning',
            duration:5*1000
        })
    }


    return response
},error=>{
    // 关闭窗口
    loading.close()
    Message({
        message:error.message,
        type:'error',
        duration:5*1000 
    })
    return Promise.reject(error)
})

export default request //导出自定义创建