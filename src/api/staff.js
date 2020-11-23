import request from '@/utils/request'


export default{
    // 分页查询
    searchStaffList(page,size,searchMap){
        return request({
            url:`/staff/list/search/${page}/${size}`,
            method:'post',
            data:searchMap
        })
    },
    // 新增员工
    addStaff(pojo){
        return request({
            url:`/staff`,
            method:'post',
            data:pojo
        })
    },
    // 通过id查询员工信息
    getStaffById(id){
        return request({
            url:`/staff/${id}`,
            method:'get'
        })
    },
    updateStaff(pojo){
        return request({
            url:`/staff/${pojo.id}`,
            method:'put',
            data:pojo
        })
    },
    deleteStaff(id){
        return request({
            url:`/staff/${id}`,
            method:'delete',
        })
    }
}