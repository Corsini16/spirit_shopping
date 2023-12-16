<template>
  <!-- 商品列表 -->
  <div>
    <!-- 面包屑导航数据 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }" class="text"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item class="text">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item class="text">商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
            placeholder="请输入内容"
          >
            <el-button
              @click="getGoodsList"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table :data="goodsList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <!-- 商品名称 -->
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <!-- 价格列 -->
        <el-table-column prop="goods_price" label="商品价格" width="95px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="130px">
          <!-- 操作按钮组 -->
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editDialog(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>

    <!-- 编辑商品的对话框 -->
    <el-dialog
      title="修改商品信息"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form
        :model="editFrom"
        :rules="editFromRules"
        ref="editFromRef"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editFrom.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editFrom.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editFrom.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="add_time">
          <el-input v-model="editFrom.add_time"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogHandle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      // 响应参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      // 数据源
      goodsList: [],
      // 总数
      total: 0,
      // 编辑商品的对话框
      editDialogVisible: false,
      // 编辑用户信息
      editFrom: {},

      // 校验规则
      editFromRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        add_time: [
          { required: true, message: "请输入创建时间", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 根据分页获取参数列表
    async getGoodsList() {
      let res = await this.axios.get("goods", { params: this.queryInfo });
      console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error("获取参数失败");
      }
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      // console.log(this.goodsList);
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getGoodsList();
    },
    handleCurrentChange(newPage) {
      // console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    // 根据Id删除参数
    async removeById(id) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.axios.delete(`goods/${id}`);
          if (res.meta.status != 200) {
            return this.$message.error("获取参数信息错误");
          }
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getGoodsList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 跳转到添加商品页面
    goAddPage() {
      this.$router.push({ name: "add" });
    },
    async editDialog(id) {
      let res = await this.axios.get(`goods/${id}`);
      if (res.meta.status != 200) {
        return this.$message.error("获取失败");
      }
      this.editFrom = res.data;
      // console.log(this.editFrom);
      this.editDialogVisible = true;
    },
    // 编辑商品的提交
    editDialogHandle() {
      this.editDialogVisible = false;
      this.$refs.editFromRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请检查输入的信息");
        }
        let res = await this.axios.put(
          `goods/${this.editFrom.goods_id}`,
          this.editFrom
        );
        // console.log(res);
        if (res.meta.status != 200) {
          return this.$message.error("编辑失败");
        }
        this.getGoodsList();
        this.$message.success("修改成功");
      });
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
</style>
