import Router from 'vue-router'
import Vue from 'vue'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/admin/user/Users'
import Roles from '../components/admin/authority/Roles'
import Rights from '../components/admin/authority/Rights'
Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: [
    {path: '/', redirect: '/login'},
    {path: '/login', name: 'Login', component: Login},
    {path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/welcome',
      children: [
        {path: '/welcome', name: 'Welcome', component: Welcome},
        {path: '/users', name: 'Users', component: Users},
        {path: '/roles', name: 'Roles', component: Roles},
        {path: '/rights', name: 'Rights', component: Rights}
      ]}
  ]
})
// 路由挂载导航守卫
router.beforeEach((to, from, next) => {
  // to 要访问的路径
  // from 从跳转的路径
  // next() 表示放行 next(‘/login’） 表示强制跳转
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
