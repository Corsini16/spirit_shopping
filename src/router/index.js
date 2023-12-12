import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    redirect: '/home/welcome',

    children: [
      {
        path: 'welcome',
        component: () => import('@/components/Welcome.vue')
      },
      {
        path: 'users',
        meta: {
          title: '用户管理'
        },
        component: () => import('@/components/Users.vue')
      },
      {
        path: 'rights',
        component: () => import('@/components/Rights.vue')
      },
      {
        path: 'roles',
        component: () => import('@/components/Roles.vue')
      }]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  },

]

const router = new VueRouter({
  routes
})

//路由守卫
router.beforeEach((to, from, next) => {
  if (to.path != '/login') {
    let token = sessionStorage.getItem('token')
    if (token) {
      next();
    } else {
      next('/login')
    }
  } else {
    next()
  }
})




export default router
