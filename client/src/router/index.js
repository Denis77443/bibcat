import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/HomePage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: "/admin2",
    name: "admin2",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AdminPage")
  }
]

const router = new VueRouter({
  routes
})

export default router
