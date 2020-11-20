import Vue from "vue";
import Router from "vue-router";
// import Login from './views/login/index.vue'
// 下面情况，会默认导入 ./views/login目录下的index.vue组件
import Login from './views/login'
import Layout from '@/components/Layout.vue'

Vue.use(Router);

export default new Router({
    routes:[
        {
            path:'/login',
            name:'login',//路由名称
            component:Login//组件对象
        },
        {
            path:'/',
            name:'layout',//路由名称
            component:Layout//组件对象
        }
    ]
})