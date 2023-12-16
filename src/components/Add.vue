<template>
  <div>
    <!-- 面包屑导航数据 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }" class="text"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item class="text">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item class="text">添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 消息提示 -->
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addFrom"
        :rules="addFromRules"
        ref="addFromRef"
        label-width="100px"
        label-position="top"
      >
        <!-- tabs栏 -->
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addFrom.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addFrom.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addFrom.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addFrom.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addFrom.goods_cat"
                :options="cateList"
                :props="cateProps"
                expand-trigger="hover"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableList"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                ></el-checkbox></el-checkbox-group
            ></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableList"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addFrom.goods_introduce"></quill-editor>
            <el-button type="primary" class="addBtn" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片放大的对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewClass" />
    </el-dialog>
  </div>
</template>
<script>
import _ from "lodash";

export default {
  props: {},
  data() {
    return {
      activeIndex: 0,
      //   添加表单的信息
      addFrom: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属分类数组
        goods_cat: [],
        // 图片数组
        pics: [],
        // 商品详情描述
        goods_introduce: "",
        attrs: [],
      },
      // 表单验证
      addFromRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      // 分类数据
      cateList: [],
      // 级联选择器的props
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      // 动态参数数据
      manyTableList: [],
      // 静态参数数据
      onlyTableList: [],
      // 上传图片的地址
      uploadURL: "http://www.chenfuguo.cn:8899/api/private/v1/upload",
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewPath: "",
      previewVisible: false,
      
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList() {
      const res = await this.$http.get("categories");
      if (res.meta.status != 200) {
        return this.$message.error("获取参数列表失败");
      }
      this.cateList = res.data;
      // console.log(this.cateList);
    },
    // 级联选择器变化会触发这个函数
    handleChange() {
      if (this.addFrom.goods_cat.length !== 3) {
        this.addFrom.goods_cat = [];
      }
    },
    //
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addFrom.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },
    // tabs下面分类切换触发
    async tabClick() {
      if (this.activeIndex === "1") {
        let res = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: "many" },
        });
        if (res.meta.status != 200) {
          return this.$message.error("获取动态参数失败");
        }

        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableList = res.data;
        console.log(this.manyTableList);
      } else if (this.activeIndex === "2") {
        let res = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: "only" },
        });
        if (res.meta.status != 200) {
          return this.$message.error("获取动态参数失败");
        }
        // console.log('dayin');
        this.onlyTableList = res.data;
        console.log(this.onlyTableList);
      }
    },
    // 处理图片预览
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    // 处理移除图片的操作
    handleRemove(file) {
      console.log(file);
      // 获取要删除的临时路径
      let filePath = file.response.data.tmp_path;
      // 找到图片索引值从pics数组
      let i = this.addFrom.pics.findIndex((x) => x.pic === filePath);
      // // 删除数组中的元素
      this.addFrom.pics.splice(i, 1);
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      // console.log(response);
      const picInfo = { pic: response.data.tmp_path };
      this.addFrom.pics.push(picInfo);
    },
    // add 添加
    add() {
      this.$refs.addFromRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("添加失败");
        }
        let form = _.cloneDeep(this.addFrom);
        form.goods_cat = form.goods_cat.join(",");
        //处理动态参数
        this.manyTableList.forEach((item) => {
          let newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addFrom.attrs.push(newInfo);
        });
        //处理静态参数
        console.log(form);
        this.onlyTableList.forEach((item) => {
          let newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addFrom.attrs.push(newInfo);
        });
        form.attrs = this.addFrom.attrs;
        console.log(form);

        // 发起请求添加商品
        // 商品的名称必须是唯一的
        let res = await this.axios.post("goods", form);
        // console.log(res);
        if (res.meta.status != 201) {
          return this.$message.error("添加商品失败");
        }
        this.$message.success("添加成功");
        this.$router.push("goods");
      });
    },
  },
  components: {},
  computed: {
    cateId() {
      if (this.addFrom.goods_cat.length === 3) {
        return this.addFrom.goods_cat[2];
      }
      return null;
    },
  },
};
</script>

<style scoped lang="less">
.el-steps {
  margin: 15px 0;

  .el-step__main {
    font-size: 30px;
  }
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewClass {
  width: 100%;
}
.addBtn {
  margin-top: 15px;
}
</style>
