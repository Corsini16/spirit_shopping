<template>
  <!-- 商品分类 -->
  <div>
    <!-- 面包屑导航数据 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }" class="text"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item class="text">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item class="text">商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        border
        :expand-type="false"
        :show-index="true"
        index-text="#"
        :show-row-hover="false"
      >
        <!-- 分类名称 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            type="success"
            >二级</el-tag
          >
          <el-tag size="mini" v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="Operation" slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="showEditCateDialog(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deletCateDialog(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 7, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户弹框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <el-form
        :model="addCateFrom"
        :rules="addCateFromRules"
        ref="addCateFromRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <!-- change用来指定数据改变后的回调函数 -->
          <!-- change-on-select -->
          <el-cascader
            style="width: 100%"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户弹框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
    >
      <el-form
        :model="editCateForm"
        :rules="editCateFromRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类数据列表，默认为空
      cateList: [],
      // 总数据条数
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示将当前列使用模板名称
          template: "isok",
        },
        {
          label: "排序",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示将当前列使用模板名称
          template: "order",
        },
        {
          label: "操作",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示将当前列使用模板名称
          template: "Operation",
        },
      ],
      addCateDialogVisible: false,
      // 添加分类表单数据对象
      addCateFrom: {
        // 将要添加分类的名称
        cat_name: "",
        // 分类父id
        cat_pid: 0,
        // 分类的等级默认是1级
        cat_level: 0,
      },
      // 添加分类表单验证规则
      addCateFromRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 父级分类数据列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //选中父级分类的id数组
      selectedKeys: [],

      // 编辑用户弹框
      editCateDialogVisible: false,
      // 编辑用户的数据对象
      editCateForm: {
        cat_id: "",
        cat_name: "",
      },
      // 添加表单验证规则
      editCateFromRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取商品分页数据
    async getCateList() {
      let res = await this.axios.get("categories", { params: this.queryInfo });
      // console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error("获取商品列表分类失败");
      }

      // 把数据列表赋值
      this.cateList = res.data.result;
      // 总条数赋值
      this.total = res.data.total;
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听pagenum改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    // 点击添加分类按钮
    showAddCateDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    // 获取父级分类数据列表
    async getParentCateList() {
      let res = await this.axios.get("categories", { params: { type: 2 } });
      // console.log(res.data);
      if (res.meta.status != 200) {
        return this.$message.error("获取父级分类失败失败");
      }
      this.parentCateList = res.data;
    },
    // 选择项发生变化触发这个函数
    parentCateChange() {
      console.log(this.selectedKeys);
      // 如果selectedKeys数组中length>0,则证明选中父级元素
      //反之则没有选中父类

      // 父级分类id
      if (this.selectedKeys.length > 0) {
        this.addCateFrom.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        // 当前分类等级的赋值
        this.addCateFrom.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addCateFrom.cat_pid = 0;
        // 当前分类等级的赋值
        this.addCateFrom.cat_level = 0;
      }
    },
    // 点击确定按钮 添加新的分类
    addCate() {
      console.log(this.addCateFrom);
      this.$refs.addCateFromRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        let res = await this.axios.post("categories", this.addCateFrom);
        if (res.meta.status != 201) {
          return this.$message.error("添加分类失败");
        }
        this.$message.success("添加分类成功");
        this.addCateDialogVisible = false;
        // this.addCateFrom.cat_name = "";
        this.selectedKeys = [];
        this.addCateFrom.cat_pid = 0;
        this.addCateFrom.cat_level = 0;
        this.getCateList();
      });
    },
    //对话框关闭重置
    addCateDialogClose() {
      this.$refs.addCateFromRef.resetFields();
      this.selectedKeys = [];
      this.addCateFrom.cat_level = 0;
      this.addCateFrom.cat_pid = 0;
    },

    // 点击编辑按钮
    async showEditCateDialog(scope) {
      // console.log(scope.cat_id);
      let res = await this.axios.get("categories/" + scope.cat_id);
      // console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error("获取分类信息失败");
      }
      this.editCateForm = res.data;

      this.editCateDialogVisible = true;
    },
    // 点击编辑确定按钮
    async editCate() {
      console.log(this.editCateForm);
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        let res = await this.axios.put(
          "categories/" + this.editCateForm.cat_id,
          this.editCateForm
        );
        if (res.meta.status != 200) {
          return this.$message.error("编辑分类失败");
        }
        this.$message.success("编辑分类成功");
        this.editCateDialogVisible = false;
        this.getCateList();
      });
    },
    // 删除分类弹框
    deletCateDialog(scope){
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
       .then(async () => {
          let res = await this.axios.delete("categories/" + scope.cat_id);
          if (res.meta.status != 200) {
            return this.$message.error("删除分类失败");
          }
          this.$message.success("删除分类成功");
          this.getCateList();
        })
       .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    }
  },
  components: {},
};
</script>

<style scoped lang="less">
.zk-table {
  margin-top: 15px;
}
</style>
