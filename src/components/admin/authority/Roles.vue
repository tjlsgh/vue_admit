<template>
  <div>
    <!--  role 导航  -->
    <el-breadcrumb
      separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button
            type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色信息区域 -->
      <el-row>
        <el-table :data="rolesList" stripe border width="170">
          <!-- 角色权限 -->
          <el-table-column type="expand">
            <template v-slot="scope">
              <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                <!-- 一级权限 -->
                <el-col :span="5">
                  <el-tag closable @close="removeRightById(scope.row, item1.id)"> {{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级权限 -->
                <el-col :span="19">
                  <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                    <el-col :span="6">
                      <el-tag closable type="success" @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 三级权限 -->
                    <el-col :span="18">
                      <el-tag closable type="warning" v-for="(item3) in item2.children"
                              :key="item3.id"
                              @close="removeRightById(scope.row, item3.id)">
                        {{item3.authName}}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!-- ID -->
          <el-table-column align="center" label="#" type="index"></el-table-column>
          <!-- 角色名称 -->
          <el-table-column align="center" label="角色名称" prop="roleName"></el-table-column>
          <!-- 角色描述 -->
          <el-table-column align="center" label="角色描述" prop="roleDesc"></el-table-column>
          <!-- 操作区域 -->
          <el-table-column align="center" label="操作" >
            <template v-slot="scope">
              <!-- 编辑 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRole(scope.row.id)"></el-button>
              <!-- 删除 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row.id)"></el-button>
              <!-- 分配权限 -->
              <el-tooltip content="分配权限" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="内容"
      :visible.sync="addRoleDialogVisible"
      width="30%"
      @close="addDialogClosed" center>
      <el-form :model="addForm" status-icon :rules="addFormRules" ref="addFormRef" label-width="90px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" autocomplete="off" placeholder="请输入角色名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" autocomplete="off" placeholder="请输入角色描述" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addRole">确 定</el-button>
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRoleDialogVisible"
      width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editRoleInfo()">确 定</el-button>
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框-->
    <el-dialog
      title="提示"
      :visible.sync="showSetRightDialogVisible"
      @close="SetRightDialogClosed"
      width="50%">
      <el-tree show-checkbox
               default-expand-all
               :default-checked-keys="defKeys"
               node-key="id"
               :data="rightsList"
               ref="treeRef"
               :props="treeProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
      <el-button @click="showSetRightDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      rolesList: [],
      rightsList: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      addRoleDialogVisible: false,
      editRoleDialogVisible: false,
      showSetRightDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      editForm: {
      },
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ]
      },
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ]
      },
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    getRolesList: async function () {
      const {data: res} = await this.$http.get('/roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
      this.$message.success('获取角色列表成功')
      console.log(res)
    },
    // 添加角色
    addRole: function () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('输入错误，请检验')
        // 发起请求
        const {data: res} = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        this.addRoleDialogVisible = false
        await this.getRolesList()
      })
    },
    // 删除角色
    deleteRole: async function (id) {
      const result = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') return this.$message.info('已取消删除操作！')
      const {data: res} = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败！')
      await this.getRolesList()
      this.$message.success('删除角色成功！')
    },
    // 对话框关闭清空输入信息
    addDialogClosed: function () {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed: function () {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑角色
    editRole: async function (id) {
      const {data: res} = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询角色信息失败')
      this.editForm = res.data
      this.editRoleDialogVisible = true
    },
    // 提交编辑的角色信息
    editRoleInfo: function () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('角色信息格式错误，请重新编辑')
        const {data: res} = await this.$http.put('roles/' + this.editForm.roleId, {
          roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc
        })
        if (res.meta.status !== 200) return this.$message.error('修改角色信息失败')
        this.$message.success('修改角色信息成功')
        this.editRoleDialogVisible = false
        await this.getRolesList()
      })
    },
    // 根据Id删除对应的权限
    removeRightById: async function (role, rightId) {
      let result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') return this.$message.info('已取消删除操作')

      const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)

      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }

      this.$message.success('删除权限成功')
      role.children = res.data
    },
    // 展示分配权限
    showSetRightDialog: async function (role) {
      this.roleId = role.id
      const {data: res} = await this.$http.get(`rights/tree`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限失败')
      }
      this.rightsList = res.data
      console.log(this.rightsList)
      // 通过递归获取三级节点的ID
      this.getLeafKeys(role, this.defKeys)
      this.showSetRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的ID，并保存到 defKeys
    getLeafKeys: function (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    SetRightDialogClosed: function () {
      this.defKeys = []
    },
    allotRights: async function () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys)
      const idStr = keys.join(',')
      const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      await this.getRolesList()
      this.showSetRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 8px;
}
 .bdtop {
   border-top: 1px solid #baf1fc;
 }
 .bdbottom {
   border-bottom: 1px solid #baf1fc;
 }
 .vcenter {
   display: flex;
   align-items: center;
 }
</style>
