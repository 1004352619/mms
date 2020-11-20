<template>
  <div class="login-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="login-form">
      <h2 class="login-title">会员管理系统</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>



<script>
import { login, getUserInfo } from "@/api/login";
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" },
          // {min:3,max:5,message:'账号长度在3-5个字符',trigger:'blur'}
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        //  console.log(valid)
        if (valid) {
          //提交表单给后台验证
          login(this.form.username, this.form.password).then((response) => {
            const resp = response.data;
            console.log(resp, resp.data.token);
            if (resp.flag) {
              // 验证成功，通过token去获取用户信息
              getUserInfo(resp.data.token).then((response) => {
                // 获取到了用户的数据
                const respUser = response.data;
                if (respUser.flag) {
                  console.log("userinfo", respUser.data);
                  // 1,保存用户信息，token
                  localStorage.setItem(
                    "msm-user",
                    JSON.stringify(respUser.data)
                  ),
                    localStorage.setItem("msm-token", resp.data.token);
                  // 前往首页
                  this.$router.push("/");
                } else {
                  // 未通过，弹出警告
                  this.$message({
                    message: respUser.message,
                    type: "warning",
                  });
                }
              });
            } else {
              // 未通过，弹出警告
              // alert(resp.message)
              this.$message({
                message: resp.message,
                type: "warning",
              });
            }
          });
          // console.log(this.form.username,this.form.password)
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.login-form {
  width: 350px;
  margin: 160px auto;
  background-color: rgb(255, 255, 255, 0.8);
  padding: 28px;
  border-radius: 20px;
}
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../../assets/login2.png");
  background-size: cover;
}
.login-title {
  color: red;
  text-align: center;
}
</style>