import Router from 'vue-router'
import Vue from 'vue'
import Login from '../components/Login'
import Home from '../components/Home'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: [
    {path: '/', redirect: '/login'},
    {path: '/login', name: 'Login', component: Login},
    {path: '/home', name: 'Home', component: Home}
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
