<template>
  <!--47 15-->
    <el-aside :width="isCollapsed ? '64px' : '200px'">
      <div class="toggle-button" @click="toggleCollapse">|||</div>
      <el-menu active-text-color="#f17a63"
               text-color="#242424"
               :default-active="$route.path"
               router
               :collapse="isCollapsed"
               :collapse-transition="false">
        <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
          <!-- 一级菜单 -->
          <template slot="title">
            <i :class="iconsList[item.id]"></i>
            <span>{{item.authName}}</span>
          </template>
          <!-- 二级菜单 --> <!-- @click="saveNavState('/' + subItem.path)"-->
          <el-menu-item v-for="subItem in item.children"
                        :index="'/' + subItem.path"
                        :key="subItem.id">
            <i class="el-icon-menu"></i>{{subItem.authName}}
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
</template>

<script>
export default {
  name: 'Aside',
  data () {
    return {
      isCollapsed: false, // 是否折叠
      // NavPath: '', // 动态导航地址
      menuList: [], // 接收菜单
      iconsList: { // 绑定 icon
        '125': 'el-icon-user-solid',
        '103': 'el-icon-s-promotion',
        '101': 'el-icon-goods',
        '102': 'el-icon-document-copy',
        '145': 'el-icon-coin'
      }
    }
  },
  created () {
    this.getMenuList()
    // this.NavPath = window.sessionStorage.getItem('NavPath')
  },
  methods: {
    // 获取菜单
    getMenuList: async function () {
      const {data: res} = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      // console.log(res)
    },
    toggleCollapse: function () {
      this.isCollapsed = !this.isCollapsed
    }
    // saveNavState: function (NavPath) {
    //   window.sessionStorage.setItem('NavPath', NavPath)
    // }
  }
}
</script>

<style lang="less" scoped>
.el-menu {
  background-color: #f6f1f1;
}
.toggle-button {
  background-color: #f1e7da;
  font-size: 10px;
  line-height: 24px;
  color: #eb576d;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
