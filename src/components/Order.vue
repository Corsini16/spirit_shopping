<template>
  <div>
    <!-- 面包屑导航数据 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }" class="text"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item class="text">订单管理</el-breadcrumb-item>
      <el-breadcrumb-item class="text">订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input clearable placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status == '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-if="scope.row.pay_status == '0'"
              >未付款</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showBox"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showProgressBox"
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

    <!-- 编辑对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="addressDialogClose"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogHandle">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible"
      width="50%"
    >
      <span>这是一段信息</span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./Js/city_data2017_element";
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
      // 列表数据源
      orderList: [],
      //   总数
      total: 0,
      // 对话框的展示
      editDialogVisible: false,
      // 编辑form
      addressForm: {
        address1: [],
        address2: "",
      },
      addressFormRules: {
        address1: [
          { required: true, message: "请选择省市区", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
      cityData,
      progressDialogVisible: false,
      progressInfo: [],
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      let res = await this.axios.get("orders", { params: this.queryInfo });
      if (res.meta.status !== 200) {
        this.$message.error("获取列表数据失败");
      }
      //   console.log(res);
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      // console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    // 点击编辑弹框
    showBox() {
      this.editDialogVisible = true;
    },
    // 点击确定提交对话框
    editDialogHandle() {
      this.editDialogVisible = false;
    },
    // 对话框的关闭重置
    addressDialogClose() {
      this.$refs.addressFormRef.resetFields();
    },
    // 物流进展对话框
    async showProgressBox() {
      // let res = await this.axios.get("/kuaidi/1106975712662");
      // if (res.meta.status != 200) {
      //   this.$message.error("获取物流信息失败");
      // }
      // this.progressInfo = res.data;
      // console.log(this.progressInfo);
      this.progressDialogVisible = true;
    },
    handleChange() {},
  },
  components: {},
};
</script>

<style scoped lang="less">
</style>
