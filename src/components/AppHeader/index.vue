<template>
  <div class="header">
    <a href="#/">
      <img class="logo" src="@/assets/logo.png" width="25px" />
      <span class="msm">会员管理系统</span>
    </a>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        欢迎 {{user.name}}
        <!-- {{localStorage.getItem('msm-user')}} -->
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit" command="edit">修改信息</el-dropdown-item>
        <el-dropdown-item icon="el-icon-s-fold" command="exit">退出登陆</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
        <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="400px">

      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        style="width:300px"
      >
        <el-form-item label="原密码" prop="oldPass" >
          <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="$refs['ruleForm'].resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { logout } from "@/api/login";
import passwordApi from '@/api/password'
export default {
  data() {
    // 在return 上面进行声明自定义校验
    const validateOldPass=(rule,value,callback)=>{
      passwordApi.checkPwd(this.user.id,value).then(response=>{
        const resp = response.data
        if(resp.flag){
          // 验证通过
          callback()
        }else{
          callback(new Error(resp.message))
        }
      })
    }
    // 校验新密码是否一致
    const validatePass=(rule,value,callback)=>{
      // value代表checkPass
      if(value !== this.ruleForm.pass){
        callback(new Error('两次输入的密码不一致'))
      }else{
        // 相等，则通过
        callback()
      }
    }

    // 注意：在return 上面，不能使用逗号结束
    return {
      user:'',
      dialogFormVisible:false,
      ruleForm:{
        oldPass:'',
        pass:'',
        checkPass:''
      },
      rules:{
        oldPass:[
          {required:true,message:"原密码不能为空",trigger:"blur"},
          {validator:validateOldPass,trigger:"blur"}
        ],
        pass:[
          {required:true,message:"新密码不能为空",trigger:"blur"}
        ],
        checkPass:[
          {required:true,message:"确认密码不能为空",trigger:"blur"},
           {validator:validatePass,trigger:"change"}
        ]
      }
    };
  },
  mounted() {
    this.user = this.getUser();
  },
  methods: {
    // 得到登陆的用户名
    getUser() {
      const json = localStorage.getItem("msm-user"); //获取的是json格式的字符串
      const user = JSON.parse(json); //转成 json对象
      return user;
    },
    // 用户选择哪一项
    handleCommand(command) {
      // this.$message(`click ${command}`)
      switch (command) {
        case "edit":
          //打开密码窗口
          // this.$message(`点击修改密码`);
          this.handlePwd()
          break;
        case "exit":
          this.handleLogout();
          break;
        default:
          break;
      }
    },
    // 打开修改密码窗口
    handlePwd(){
      this.dialogFormVisible=true
      this.$nextTick(()=>{
        this.$refs['ruleForm'].resetFields()
      })
    },
    //退出系统 
    handleLogout() {
      // this.$message(`退出系统`)
      // const token =localStorage.getItem('msm-token')
      logout(localStorage.getItem("msm-token")).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          //退出成功
          // 清楚本地数据缓存
          localStorage.removeItem("msm-token");
          localStorage.removeItem("msm-user");
          // 回到登陆页面
          this.$router.push("./login");
        } else {
          this.$message({
            message: resp.message,
            type: "warning",
            duration: 1500, //弹窗持续时间
          });
        }
      });
    },
    // 修改密码提交事件
    submitForm(ruleForm){
      this.$refs[ruleForm].validate(valid=>{
        if(valid){
          // console.log("校验成功")
          passwordApi.updatePwd(this.user.id,this.ruleForm.checkPass).then(response=>{
            const resp = response.data
            this.$message({
              message:resp.message,
              type:resp.flag?'success':'error'
            })
            if(resp.flag){
              // 修改密码成功，退出系统,回到登陆页面
              this.handleLogout()
              this.dialogFormVisible=false
            }
          })
        }else{
          return false
        }
      })
    }
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