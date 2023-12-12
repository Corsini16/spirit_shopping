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
      <el-table :data="rightList" border stripe> 
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    // 创建一个数组接收数据
    return {
      rightList: [],
    };
  },
  created() {
    this.getRightList();
  },
  methods: {
    async getRightList() {
      let res = await this.axios.get("rights/list");
      // console.log(res);
      if (res.meta.status != 200) {
        return (this.$message.error = "get数据出错了");
      }
      // this.$message.success('成功')
      
      // 接收数据
      this.rightList = res.data;
      // console.log(this.rightList);
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.box-card {
  margin-top: 15px;
}
</style>
