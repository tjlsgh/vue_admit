<template>
  <div id="poster">
    <div class="login-box">
      <el-form :model="loginForm" ref="loginFormRef" :rules="LoginFormRules"
               class="login-container" label-position="left"
               label-width="0px">
        <h3 class="login_title">系统登录</h3>
        <el-form-item prop="username">
          <el-input type="text" v-model="loginForm.username"
                    auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password"
                    auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item class="buttons" style="width: 100%">
          <!--        style="width: 25%;background: #f0f1f0;border: none"-->
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      LoginFormRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /* 重置输入 */
    resetLoginForm: function () {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    /* 登录功能 */
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const {data: res} = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败') // 提示登录失败
        this.$message.success('登录成功')
        console.log(res)
        window.sessionStorage.setItem('token', res.data.token)
        await this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
#poster {
  background: url("../assets/friends4.jpg") no-repeat center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}
.login-box {
  width: 450px;
  height: 300px;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.login-container {
  border-radius: 15px;
  background-color: transparent;
  background-clip: padding-box;
  margin: 10px auto;
  padding: 35px 35px 15px 35px;
  border: 1px solid #151414;
  box-shadow: aliceblue;
}
.login_title {
  margin: 0 auto 20px auto;
  text-align: center;
  color: #f6f1f1;
}
.buttons {
  display: flex;
  justify-content: flex-end;
}
</style>
