import request from '@/utils/request'

export default{
    // 获取会员列表数据
    getList(){
        return request({
            url:'/member/list',
            method:'get'
        })
    },
    // 分页查询
    // page当前页码，size每页显示条数，searchMap条件
    // 后台要通过page和size统计本次请求响应的数据
    search(page,size,searchMap){
        return request({
            url:`/member/list/search/${page}/${size}`,
            method:'post',
            data:searchMap
        })
    },
    // 新增会员
    add(pojo){
        return request({
            url:`/member`,
            method:'post',
            data:pojo
        })
    },
    // 查询
    getById(id){
        return request({
            url:`/member/${id}`,
            method:'get'
        })
    },
    //更新
    update(pojo){
        return request({
            url:`/member/${pojo.id}`,
            method:'put',//put方式
            data:pojo
        })
    },
    // 删除会员
    deleteById(id){
        return request({
            url:`/member/${id}`,
            method:'delete'
        })
    }
}