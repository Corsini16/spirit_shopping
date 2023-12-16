<template>
  <!-- 分类参数 -->
  <div>
    <!-- 面包屑导航数据 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }" class="text"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item class="text">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item class="text">参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 警告区域 -->
      <el-alert
        show-icon
        :closable="false"
        title="注意！只允许为第三级分类设置相关参数！"
        type="warning"
      ></el-alert>
      <!-- 商品分类 -->
      <el-row style="margin: 15px">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 获取商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            expand-trigger="hover"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab组件切换 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisable"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >
                  {{ item }}</el-tag
                >
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="delDialog(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisable"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >
                  {{ item }}</el-tag
                >
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="delDialog(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- <p style="user-select: none;">文字不被选中</p> -->
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleTex"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 带验证的表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleTex" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数的对话框 -->
    <el-dialog
      :title="'修改' + titleTex"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <!-- 带验证的表单 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleTex" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      // 数据列表
      cateList: [],
      // 级联选择框配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 级联选择框双向绑定的数组
      selectedCateKeys: [],
      // 被激活的页签名称
      activeName: "many",
      // 动态参数的数据
      manyTableData: [],
      // 静态参数的数据
      onlyTableData: [],
      addDialogVisible: false,

      // 添加表单的数据
      addForm: {
        attr_name: "",
      },
      addFormRules: {
        attr_name: [{ required: true, message: "请输入参数", trigger: "blur" }],
      },
      // 控制编辑弹框的出现与隐藏
      editDialogVisible: false,
      // 修改的表单数据
      editForm: {},
      // 修改表单的验证对象
      editFormRules: {
        attr_name: [{ required: true, message: "请输入参数", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      let res = await this.axios.get("categories");
      // console.log(res);
      if (res.meta.status != 200) {
        return this.meta.status("获取商品列表失败");
      }
      this.cateList = res.data;
      // console.log(this.cateList);
    },
    // 级联选择框中数据变换会触发这个数组
    async handleChange() {
      this.getParamsData();
    },
    // tab页签点击事件的处理函数
    handleTabClick() {
      this.getParamsData();
      // console.log(this.activeName);
    },
    // 获取参数的列表数据
    async getParamsData() {
      if (this.selectedCateKeys.length != 3) {
        this.$message.error("只允许为第三级分类设置相关参数！");
        this.selectedCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      // console.log(this.selectedCateKeys);
      // 根据所选分类的id，和当前所处的面板，获取对应的参数
      let res = await this.axios.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数失败！");
      }

      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        // 控制文本框的显示与隐藏
        item.inputVisible = false;
        // 文本框输入的值
        item.inputValue = "";
      });
      console.log(res.data);

      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    // 监听对话框的关闭
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    // 监听重置编辑对话框的关闭
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    // 点击确定添加信息
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (valid) {
          let res = await this.axios.post(
            `categories/${this.cateId}/attributes`,
            { attr_name: this.addForm.attr_name, attr_sel: this.activeName }
          );
          if (res.meta.status !== 201) {
            return this.$message.error("添加参数失败！");
          }
          this.$message.success("添加参数成功！");
          this.addDialogVisible = false;
          this.getParamsData();
        } else {
          return this.$message.error("请检查输入的数据！");
        }
      });
    },
    // 点击编辑修改对话框
    async editDialog(attr_id) {
      let res = await this.axios.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: { attr_sel: this.activeName },
        }
      );
      if (res.meta.status != 200) {
        return this.$message.error("编辑表单失败");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 确定编辑按钮
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (valid) {
          let res = await this.axios.put(
            `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
            { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
          );
          if (res.meta.status !== 200) {
            return this.$message.error("修改参数失败！");
          }
          this.$message.success("修改参数成功！");
          this.editDialogVisible = false;
          this.getParamsData();
        } else {
          return this.$message.error("请检查输入的数据！");
        }
      });
    },
    // 根据id删除参数
    async delDialog(attr_id) {
      let confim = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          let res = await this.axios.delete(
            `categories/${this.cateId}/attributes/${attr_id}`
          );
          if (res.meta.status != 200) {
            return this.$message.error("获取删除数据失败");
          }
          this.getParamsData();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 文本失去焦点,或者按下了
    async handleInputConfirm(row) {
      // console.log("ok");
      if (row.inputValue.trim().length == 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      //
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      this.saveattrValues(row);
    },
    // 将attr_vals操作保存到数据库
    async saveattrValues(row) {
      // 发起请求保存到数据库中
      let res = await this.axios.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (res.meta.status != 200) {
        return this.$message.error("修改失败");
      }
      this.$message.success("添加成功");
    },
    //点击按钮展示文本输入
    showInput(row) {
      row.inputVisible = true;
      // 让文本框自动获取焦点
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除tag标签
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      // this.saveattrValues(row);
    },
  },
  components: {},
  computed: {
    isBtnDisable() {
      if (this.selectedCateKeys.length != 3) {
        return true;
      }
      return false;
    },
    // 当前选择的三级标题
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    // 动态计算标题名称
    titleTex() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
};
</script>

<style scoped lang="less">
.el-tag {
  margin: 10px;
}
.el-tag:nth-of-type(1) {
  margin-left: 50px;
}
.input-new-tag {
  width: 100px;
}
</style>
