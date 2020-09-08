<template>

  <el-container class="container">
    <!-- 头部区域 -->
    <el-header style="height: 80px">
      <div>
        <img style="border-radius: 20px" src="../assets/sunset.png" alt="">
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <Aside></Aside>
      <!-- 主区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from './admin/Aside.vue'
export default {
  name: 'Home',
  components: {Aside},
  // data () {
  //   return {
  //     menuList: []
  //   }
  // },
  // created () {
  //   this.getMenuList()
  // },
  methods: {
    logout: function () {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  height: 100%;
}
.el-header {
  background-color: #2d2d2d;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #efeddb;
  font-size: 22px;
  >div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #f6f1f1;
  border-right: none;
}
.el-main {
  background-color: #eaedf1;
}
</style>
