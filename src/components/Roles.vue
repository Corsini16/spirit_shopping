<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }" class="text"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item class="text">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item class="text">角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col :span="12">
          <el-button type="primary" @click="dialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="roleList" border stripe style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- 
            {{ scope.row }} -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="showDialogVisible(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-edit"
              @click="removeRolesById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色弹窗 -->
    <el-dialog title="添加角色" :visible.sync="dialogVisible" width="50%">
      <!-- <span>这是一段信息</span> -->
      <el-form
        :model="rolesForm"
        ref="rolesForm"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色弹窗 -->
    <!-- 编辑修改角色弹窗 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="70%"
      @close="editDialogClose"
    >
      <el-form :model="editFrom" ref="editFromRef" label-width="70px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限弹窗 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClose"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightList"
        :props="terrProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      // sliderValue: 0,
      roleList: [],
      // 添加角色弹窗是否关闭
      dialogVisible: false,

      // 编辑角色弹窗是否关闭
      editDialogVisible: false,
      rolesForm: {
        roleName: "",
        roleDesc: "",
      },
      editFrom: {},
      // 分配权限弹窗是否关闭
      setRightDialogVisible: false,
      // 分配权限列表内容
      rightList: [],
      //树形控件
      terrProps: {
        children: "children",
        label: "authName",
      },
      checkedKeys: [],
      // 当前即将分配权限的id
      roleId:'',
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      let res = await this.axios.get("roles");
      //   console.log(res);
      if (res.meta.status != 200) {
        return (this.$message.error = "get数据出错了");
      }
      //   this.$message.success('成功')
      // 接收数据
      this.roleList = res.data;
    },
    // 添加角色
    async addRoles() {
      let res = await this.axios.post("roles", {
        roleName: this.rolesForm.roleName,
        roleDesc: this.rolesForm.roleDesc,
      });
      // console.log(res);
      if (res.meta.status != 201) {
        return this.$message.error("状态码不对");
      }
      this.$message.success("用户添加成功");
      this.dialogVisible = false;
      this.getRoleList();
    },

    // 编辑角色信息
    async showDialogVisible(id) {
      this.editDialogVisible = true;
      let res = await this.axios.get("roles/" + id);
      // console.log(typeof(id));
      if (res.meta.status != 200) {
        this.$message.error("获取用户信息失败");
      } else {
        this.$message.success("查询用户信息成功");
        // console.log(res.meta.status);
        this.editFrom = res.data;
        // console.log(this.editFrom);
      }
    },
    // 编辑角色信息重置
    editDialogClose() {
      this.$refs.editFromRef.resetFields();
    },
    // 编辑角色信息提交
    async editUserInfo() {
      let res = await this.axios.put("roles/" + this.editFrom.roleId, {
        roleName: this.editFrom.roleName,
        roleDesc: this.editFrom.roleDesc,
      });

      // console.log(res);
      // 更新角色列表
      this.getRoleList();
      // 关闭编辑框
      this.editDialogVisible = false;
      this.$message.success("修改成功");
    },
    // 删除角色
    async removeRolesById(id) {
      // console.log(id);
      let removeRoles = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      });
      // console.log(removeRoles);
      if (removeRoles != "confirm") {
        return this.$message.error("删除失败");
      }
      let res = await this.axios.delete("roles/" + id);
      // console.log(res);
      this.$message.success("删除成功");
      this.getRoleList();
    },
    //删除三级标题
    async removeRightById(role, rightId) {
      // console.log(role);
      // console.log("------");
      // console.log(rightId);
      let confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // console.log(confirmResult);
      if (confirmResult != "confirm") {
        return this.$message.info("取消了删除");
      }
      let res = await this.axios.delete(`roles/${role.id}/rights/${rightId}`);
      if (res.meta.status != 200) {
        return this.$message.error("创建失败");
      }
      role.children = res.data;
      console.log(role);
    },
    // 分配权限方法对话框
    async showSetRightDialog(role) {
      // console.log('爱得'+ role.id);
      this.roleId=role.id;
      let res = await this.axios.get("rights/tree");
      // console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error("出错了");
      }

      this.rightList = res.data;
      // console.log(this.rightList);

      //获取递归的三级节点id

      this.getCheckedKeys(role, this.checkedKeys);

      this.setRightDialogVisible = true;

      // console.log(this.checkedKeys);
    },

    // 通过递归的形式，获取角色下所有三级权限的id，并保存到checkedKeys数组中
    getCheckedKeys(data, arry) {
      //如果data节点不包括children属性，则是三级节点
      if (!data.children) {
        return arry.push(data.id);
      }
      data.children.forEach((item) => {
        this.getCheckedKeys(item, arry);
      });
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClose() {
      this.checkedKeys = [];
    },

    // 点击为角色分配权限
    async allotRights() {
      // console.log('11');
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      let idStr=keys.join(",");
      // console.log(idStr);
      let res = await this.axios.post(`roles/${this.roleId}/rights`, {rids:idStr})
      // console.log(res);

      if (res.meta.status != 200) {
        return this.$message.error('分配权限失败');
      }
      this.$message.success('分配权限成功');
      this.getRoleList();
      this.setRightDialogVisible = false;
    },
  },
  components: {},
};
</script>
<style scoped lang="less">
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-row {
  display: flex;
  align-items: center;
  margin-left: 50px;
}
.el-tag {
  margin: 10px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
