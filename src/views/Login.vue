<template>
  <div class="loginBox">
    <el-form :model="loginInfo" ref="loginForm" :rules="loginRules">
      <div class="headimg">
        <img src="@/assets/headimg.jpg" alt="">
      </div>
      
      <el-form-item prop="name"
      style="margin-top: 60px;"
      >
        <el-input
          v-model="loginInfo.name"
          placeholder="请输入用户名"
          prefix-icon="el-icon-user"
          @input="checkVaildate('loginForm')"
        ></el-input>
      </el-form-item>

      <el-form-item prop="pwd">
        <el-input
          v-model="loginInfo.pwd"
          placeholder="请输入密码"
          prefix-icon="el-icon-lock"
          show-password
          @input="checkVaildate('loginForm')"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="isDisabled" type="primary" @click="login"
          >登录</el-button
        >
        <el-button @click="resetForm('loginForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 使用图形验证码 -->
    <Vcode :show="isShow" @success="success" @close="close"></Vcode>
  </div>
</template>

<script>
import Vcode from "vue-puzzle-vcode";

export default {
  props: {},
  data() {
    return {
      isDisabled: true,
      isShow: false, // 验证码模态框是否出现
      loginInfo: {
        name: "admin",
        pwd: "123456",
      },
      loginRules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "change" },
          {
            min: 3,
            max: 6,
            message: "长度在 3 到 6 个字符",
            trigger: "change",
          },
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "change" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    checkVaildate(formName) {
      this.$refs[formName].validate((valid) => {
        // console.log(valid);
        if (valid) {
          this.isDisabled = false; //解除登录按钮的禁用
        } else {
          this.isDisabled = true;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 用户通过了验证
    async success(msg) {
      this.isShow = false; // 通过验证后，需要手动隐藏模态框

      // console.log('开始准备登录');

      //调用登录的接口
      let res = await this.axios.post("/login", {
        username: this.loginInfo.name,
        password: this.loginInfo.pwd,
      });

      //判断是否登录成功
      if (res.meta.status == 200) {
        // alert('登录成功')
        // console.log(res.meta.msg);
        sessionStorage.setItem("token", res.data.token);
        this.$message({
          type: "success",
          message: res.meta.msg,
          duration: 1500,

          onClose: () => {
            this.$router.push("/home").catch((error) => {});
          },
        });
      } else {
        // alert('登录失败')
        console.log(res.meta.msg);
        this.$message.error({
          message: res.meta.msg,
          duration: 1000,
        });
      }
      console.log("登陆后的数据", res);
    },
    // 用户点击遮罩层，应该关闭模态框
    close() {
      this.isShow = false;
    },
    login() {
      this.isShow = true;
    },
  },
  components: {
    Vcode,
  },
  mounted() {
    this.checkVaildate("loginForm");
  },
};
</script>

<style scoped lang="less">
.loginBox {
  width: 100%;
  height: 100%;
  background-color: pink;
  background: url("@/assets/bj.jpg") no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;

  .el-form {
    width: 300px;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    position: relative;

    .headimg{
      width: 80px;
      height: 80px;
      border-radius: 50%;
      position: absolute;
     box-shadow: 0 0 10px gray;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 1px solid #fff;
      padding: 5px;
      background-color: #fff;

      img{
        width: 100%;
        height: 100%;
      border-radius: 50%;

      }
    }
    // .el-form-item{
    //   margin-top: 60px;
    // }
   
    //  .el-form-item:nt{
    //   margin-top: 50px;
    // }
  }
}
</style>
