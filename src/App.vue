<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },
  methods: {},
  components: {},
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
html,
body,
#app {
  width: 100%;
  height: 100%;
  min-width: 1366px;
  ::-webkit-scrollbar {
    display: none;
  }
}
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
  font-size: 12px !important;
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
.ql-editor {
  min-height: 300px;
}
</style>
