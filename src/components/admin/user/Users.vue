<template>
  <div>
    <!--  user 导航  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索和添加区域 -->
      <el-row :gutter="280">
        <!-- 搜索区域 -->
        <el-col :span="50">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @input="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户 -->
        <el-col :span="6">
          <el-button type="primary" @click="addUserDialogVisible = true">添加用户 <i class="el-icon-circle-plus-outline"></i></el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-row>
        <!-- 用户信息及操作 -->
        <el-table
          :data="usersList" stripe bo rder style="width: 100%">
          <!-- ID -->
          <el-table-column
            type="index"
            label="ID">
          </el-table-column>
          <!-- 用户名 -->
          <el-table-column
            prop="username"
            label="用户名">
          </el-table-column>
          <!-- 角色 -->
          <el-table-column
            prop="role_name"
            label="角色">
          </el-table-column>
          <!-- 电话 -->
          <el-table-column prop="mobile" label="电话">
          </el-table-column>
          <!-- 状态 -->
          <el-table-column prop="mg_state" label="状态">
            <template v-slot="scope">
              <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <!-- 邮箱 -->
          <el-table-column
            prop="email"
            label="邮箱">
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" width="190px">
            <template v-slot="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row.id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
              <el-tooltip content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- 分页区域 -->
      <el-row>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-row>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="内容" :visible.sync="addUserDialogVisible" width="50%" @close="addDialogClosed" center>
      <el-form :model="addForm" status-icon :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" autocomplete="off" placeholder="请输入用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password" autocomplete="off" placeholder="请输入密码" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" autocomplete="off" placeholder="请输入邮箱" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off" placeholder="请输入手机" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addUser">确 定</el-button>
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="editUserDialogVisible"
      width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editUserInfo()">确 定</el-button>
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data () {
    // 验证规则
    // 验证邮箱规则
    let checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 验证手机号
    let checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号码'))
    }

    return {
      // 获取用户列表
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      usersList: [],
      total: 5,
      addUserDialogVisible: false,
      editUserDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    getUserList: async function () {
      const {data: res} = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取用户数据失败')
      // this.$message.success('获取用户数据成功')
      this.usersList = res.data.users
      this.total = res.data.total
    },
    // 更改显示页数
    handleSizeChange: function (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 更改当前页
    handleCurrentChange: function (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 更改用户信息
    userStateChange: async function (userInfo) {
      const {data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户信息失败')
      }
      this.$message.success('更新用户信息成功')
    },
    // 对话框关闭清空输入信息
    addDialogClosed: function () {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed: function () {
      this.$refs.editFormRef.resetFields()
    },
    // 添加用户
    addUser: function () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('输入错误，请检验')
        // 发起请求
        const {data: res} = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addUserDialogVisible = false
        await this.getUserList()
      })
    },
    // 编辑用户
    editUser: async function (id) {
      const {data: res} = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询用户信息失败')
      this.editForm = res.data
      this.editUserDialogVisible = true
    },
    // 提交编辑的用户信息
    editUserInfo: function () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('用户信息格式错误，请重新编辑')
        const {data: res} = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email, mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) return this.$message.error('修改用户信息失败')
        this.$message.success('修改用户信息成功')
        this.editUserDialogVisible = false
        await this.getUserList()
      })
    },
    // 删除用户
    deleteUser: async function (id) {
      const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') return this.$message.info('已取消删除操作！')
      const {data: res} = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败！')
      await this.getUserList()
      this.$message.success('删除用户成功！')
    }
  }
}
</script>

<style>

</style>
