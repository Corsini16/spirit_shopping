<template>
  <div>
    <!-- 面包屑导航数据 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }" class="text"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item class="text">数据统计</el-breadcrumb-item>
      <el-breadcrumb-item class="text">数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
      <div id="main" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "./Js/echarts";
import _ from "lodash";
export default {
  props: {},
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  methods: {},
  //   此时页面上的元素已经被渲染完毕
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));

    let res = await this.axios.get("reports/type/1");

    if (res.meta.status != 200) {
      return this.$message.error("获取数据错误");
    }

    // 合并
    let result=_.merge(res.data,this.options)

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result);
  },
  components: {},
};
</script>

<style scoped lang="less">
</style>
