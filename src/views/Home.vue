<template>
  <div class="homeBox">
    <el-container>
      <el-header>
        <!-- //左边 -->
        <div class="left">
          <img
            src="@/assets/jingling_logo.0ada255b.png"
            @click="goHome"
            alt=""
          />
          <span>精灵购物平台管理系统</span>
        </div>
        <!-- //右边 -->
        <div class="right">
          <el-popconfirm title="确定退出登录吗?" @confirm="loginOut">
            <i
              slot="reference"
              style="font-size: 35px; color: white"
              class="el-icon-switch-button"
            ></i>
          </el-popconfirm>
        </div>
      </el-header>
      <el-container class="main">
        <el-aside :width="isCollapse?'64px':'200px'" style='transition: all linear .15s' >
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- 侧边栏 -->
          <el-menu
            :default-active="activePath"
            class="el-menu-vertical-demo"
            background-color="#303641"
            text-color="#fff"
            active-text-color="#409eff"
            unique-opened
            router
            :collapse='isCollapse'
            :collapse-transition='false'
            
          >
            <!-- 一级菜单 -->
            <el-submenu
              :index="item.id.toString()"
              v-for="(item, index) in menuList"
              :key="item.id"
            >
              <template slot="title">
                <i :class="icons[index]"></i>
                <!-- 文本 -->
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="childItem.id.toString()"
                v-for="childItem in item.children"
                :key="childItem.id"
                :route="{ path: '/home/' + childItem.path }"
                @click="saveNavState(childItem.path.toString())"
              >
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                {{ childItem.authName }}</el-menu-item
              >
            </el-submenu>
          </el-menu>
          <!-- 右侧主体部分 -->
        </el-aside>
        <!-- 路由占位符 出口 -->
        <el-main>
          <router-view> </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      menuList: [],
      icons: [
        "el-icon-s-goods",
        "el-icon-s-help",
        "el-icon-s-cooperation",
        "el-icon-s-shop",
        "el-icon-s-claim",
      ],
      isCollapse:false,
      // 被激活的链接地址
      activePath:''
    };
  },
  created () {
    this.activePath=sessionStorage.getItem("activePath");
  },
  methods: {
    goHome() {
      console.log("chufa ");
      this.$router.push("/home").catch((erro) => {});
    },
    loginOut() {
      // console.log('确定退出');
      sessionStorage.removeItem("token");
      this.$router.push("/login").catch((erro) => {});
    },
    // 获取菜单
    async getMenus() {
      let res = await this.axios.get("/menus");
      // console.log(res);
      this.menuList = res.data;
    },

    toggleCollapse(){
      this.isCollapse=!this.isCollapse
    },
    // 保存链接注释状态
    saveNavState(activePath) {
      // console.log(id);
      sessionStorage.setItem("activePath", activePath);
      // this.activePath=activePath;
    },

  },
  components: {},
  mounted() {
    this.getMenus();
  },
};
</script>

<style scoped lang="less">
.homeBox {
  width: 100%;
  height: 100%;
  background-color: #d2c3c3;

  .el-container {
    height: 100%;

    .el-header {
      background-color: #353c3e;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        img {
          width: 50px;
        }
        img:hover {
          cursor: pointer;
        }
        span {
          font-size: 20px;
          color: white;
          letter-spacing: 3px;
          margin-left: 20px;
          &:hover {
            cursor: default;
          }
        }
      }
      .right {
        width: 50px;
        height: 50px;
        // background-color:#d2c3c3;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .main {
      width: 100%;
      height: 100%;
      // background-color: pink;
      background: url("@/assets/bj.jpg") no-repeat;

      .el-aside {
        background-color: #303641;
        .toggle-button {
          background-color: #4a5064;
          color: #fff;
          text-align: center;
          font-size: 10px;
          line-height: 24px;
          letter-spacing: 0.2em;
          // user-select: none;
          cursor: pointer;
        }
        .el-menu {
          border: none;
        }
      }
    }
  }
}
</style>
