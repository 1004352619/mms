<template>
  <div class="header">
    <a href="#/">
      <img class="logo" src="@/assets/logo.png" width="25px" />
      <span class="msm">会员管理系统</span>
    </a>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
          欢迎 {{name}}
        <!-- {{localStorage.getItem('msm-user')}} -->
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit" command="edit">修改信息</el-dropdown-item>
        <el-dropdown-item icon="el-icon-s-fold" command="exit">退出登陆</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { logout } from "@/api/login";
export default {
  data(){
    return {
      name
    }
    
  },
  mounted() {
    this.name=this.getUserName()
  },
  methods: {
    getUserName() {
      // console.log(localStorage.getItem("msm-user"));
      const json = localStorage.getItem("msm-user")//获取的是json格式的字符串
      const user=JSON.parse(json)//转成 json对象
      return user.name
      // console.log(user.name)
    },
    handleCommand(command) {
      // this.$message(`click ${command}`)
      switch (command) {
        case "edit":
          //编辑信息
          this.$message(`点击修改信息`);
          break;
        case "exit":
          //退出系统
          // this.$message(`退出系统`)
          // const token =localStorage.getItem('msm-token')
          logout(localStorage.getItem("msm-token")).then(response =>{
            const resp =response.data
            if(resp.flag){
              //退出成功
              // 清楚本地数据缓存
              localStorage.removeItem('msm-token')
              localStorage.removeItem('msm-user')
              // 回到登陆页面
              this.$router.push('./login')
            }else{
              this.$message({
                message:resp.message,
                type:'warning',
                duration:1500//弹窗持续时间
              })
            }
          })
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style scoped>
.logo {
  vertical-align: middle;
  padding: 0px 10px 0px 30px;
}
.msm {
  color: white;
  position: absolute;
}
.el-dropdown {
  float: right;
  margin-right: 40px;
}
.el-dropdown-link {
  color: white;
  cursor: pointer;
}
</style>