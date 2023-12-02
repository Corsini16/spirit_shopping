<template>
  <div>
    <!-- 面包屑导航数据 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }" class="text"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item class="text">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item class="text">用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @keyup.native="getUserList"
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >新增用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe style="width: 100%">
        <!-- 索引 -->
        <el-table-column type="index"> </el-table-column>
        <!-- 列表 -->
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showDialogVisible(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加角色弹窗 -->
    <el-dialog
      title="添加用户"
      @close="addDialogClose"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <!-- <span>这是一段信息</span> -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑修改用户弹窗 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="70%"
      @close="editDialogClose"
    >
      <el-form
        :model="editFrom"
        :rules="editFromRules"
        ref="editFromRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editFrom.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    // 邮箱正则验证
    var checkEmail = (_rule, value, cb) => {
      var regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!regEmail.test(value)) {
        cb(new Error("请输入正确的邮箱地址"));
      } else {
        return cb();
      }
    };
    // 手机号正则验证
    var checkMobile = (_rule, value, cb) => {
      var regMobile = /^1[3|4|5|7|8][0-9]\d{8}$/;
      if (!regMobile.test(value)) {
        cb(new Error("请输入正确的手机号"));
      } else {
        return cb();
      }
    };
    return {
      // 获取列表的参数对象
      queryInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        // 每页显示多少数据
        pagesize: 2,
      },
      userlist: [],
      total: 0,

      // 添加用户是否显示
      dialogVisible: false,
      // 编辑用户是否显示
      editDialogVisible: false,
      // 添加角色表单
      ruleForm: {
        name: "",
        password: "",
        email: "",
        mobile: "",
      },
      //编辑查询用户信息
      editFrom: {},

      // 校验规则
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 编辑用户校验规则
      editFromRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      // console.log("获取用户列表");
      const res = await this.axios.get("users", { params: this.queryInfo });
      if (res.meta.status != 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
      //    console.log(this.total);
      // console.log(res);
    },
    // 每页条数
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 当前页
    handleCurrentChange(newCurrent) {
      // console.log(newCurrent);
      this.queryInfo.pagenum = newCurrent;
      this.getUserList();
    },
    // 用户状态改变\
    async userStateChange(userinfo) {
      console.log(userinfo);
      //          users/:uId/state/:type
      let res = await this.axios.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      // console.log(res)
      if (res.meta.status != 200) {
        this.$message.error("用户状态改变失败");
        userinfo.mg_state = !userinfo.mg_state;
      } else {
        this.$message.success("用户状态改变成功");
      }
    },
    // 用户对话框的重置
    addDialogClose() {
      this.$refs.ruleForm.resetFields();
    },
    //添加用户
    addUser() {
      this.$refs.ruleForm.validate(async (valid) => {
        // console.log(valid);
        if (!valid) {
          return;
        }

        let res = await this.axios.post("users", {
          username: this.ruleForm.name,
          password: this.ruleForm.password,
          email: this.ruleForm.email,
          mobile: this.ruleForm.mobile,
        });
        console.log(res);
        // console.log(this.ruleForm);
        if (res.meta.status != 201) {
          this.$message.error("用户添加失败");
        } else {
          this.$message.success("用户添加成功");
          this.dialogVisible = false;
          this.getUserList();
        }
      });
    },
    // 编辑用户
    async showDialogVisible(id) {
      this.editDialogVisible = true;
      //  console.log(id);
      let res = await this.axios.get("users/" + id);
      //  console.log(res);
      if (res.meta.status != 200) {
        this.$message.error("获取用户信息失败");
      } else {
        this.$message.success("查询用户信息成功");
        // console.log(res.meta.status);
        this.editFrom = res.data;
        console.log(this.editFrom);
      }
    },
    // 编辑用户重置
    editDialogClose() {
      this.$refs.editFromRef.resetFields();
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFromRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) {
          this.$message.error("请填写完整");
          return;
        }
        let res = await this.axios.put("users/" + this.editFrom.id, {
          email: this.editFrom.email,
          mobile: this.editFrom.mobile,
        });
        // 更新用户列表
        this.getUserList();
        // 关闭编辑框
        this.editDialogVisible = false;

        this.$message.success("修改成功");
      });
    },
    // 删除用户
    async removeUserById(id){
      // console.log(id);
   let removeUser= await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
         }).catch(erro=>erro)
        // confirm
        // console.log(removeUser);
        if(removeUser!='confirm'){
          return this.$message.info('删除失败')
        }
        let res = await this.axios.delete("users/" + id);
        this.$message.success("删除成功");
        this.getUserList();

    }
  },
  components: {},
  mounted() {},
};
</script>

<style scoped lang="less">
.text .el-breadcrumb__inner {
  color: #fff !important;
}
.el-breadcrumb {
  margin-bottom: 15px;
  //   .el-breadcrumb__item {
  //     .el-breadcrumb__inner {
  //       color: red !important;
  //     }
  //   }
}
.el-card {
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.15) !important;
  .el-table {
    margin-top: 15px;
  }
  .el-pagination {
    margin-top: 15px;
  }
}
</style>
