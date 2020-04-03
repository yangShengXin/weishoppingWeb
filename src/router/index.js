import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '@/components/login.vue'
// import Home from '@/components/home.vue'
// import Welcome from '@/components/welcome.vue'
const Login   = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/login.vue');
const Home    = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/home.vue');
const welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/welcome.vue');


// import User from '@/components/user.vue'
// import Rights from '@/components/rights.vue'
// import Roles from '@/components/roles.vue'
const User   = () => import(/* webpackChunkName: "User_rights_roles" */ '@/components/user.vue');
const Rights = () => import(/* webpackChunkName: "User_rights_roles" */ '@/components/rights.vue');
const Roles  = () => import(/* webpackChunkName: "User_rights_roles" */ '@/components/roles.vue');


// import Cate from '@/components/cate.vue'
// import Params from '@/components/params.vue'
const Cate   = () => import(/* webpackChunkName: "Cate_Params" */ '@/components/cate.vue');
const Params   = () => import(/* webpackChunkName: "Cate_Params" */ '@/components/params.vue');


// import List from '@/components/list.vue'
// import Add from '@/components/add.vue'
const List   = () => import(/* webpackChunkName: "List_Add" */ '@/components/list.vue');
const Add   = () => import(/* webpackChunkName: "List_Add" */ '@/components/add.vue');


// import Order from '@/components/order.vue'
// import Report from '@/components/report.vue'
const Order   = () => import(/* webpackChunkName: "Order_Report" */ '@/components/order.vue');
const Report   = () => import(/* webpackChunkName: "Order_Report" */ '@/components/report.vue');


Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect:"/welcome",
    children:[
      {
        path:'/welcome',
        component:welcome
      },
      {
        path:'/users',
        component:User
      },
      {
        path:'/rights',
        component:Rights
      },
      {
        path:'/roles',
        component:Roles
      },
      {
        path:'/categories',
        component:Cate
      },
      {
        path:'/params',
        component:Params
      },
      {
        path:'/goods',
        component:List
      },
      {
        path:'/goods/add',
        component:Add
      },
      {
        path:'/orders',
        component:Order
      },
      {
        path:'/reports',
        component:Report
      },
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

//挂在路由导航守卫
//1.将登录成功之后的token,保存到客户端的sessionStorage中
//2.项目中除了登录之外的其他有权限的接口，通过token来身份验证访问；
//3.token值应该只在当前网站打开期间生效，所以保存在sessionStorage(会话期间)中合适.localStorage(持久性的)
/*router.beforeEach((to,from,next)=>{

//   //to 将要访问的路径,from 从哪个路劲跳转过来,next()放行 next('/login') 强制跳转
  if(to.path === '/login') return next();
  const token = sessionStorage.getItem('token');
  if(!token) return next('/login');
  next();

})*/

export default router
