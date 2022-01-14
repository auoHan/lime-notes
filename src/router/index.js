import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/',
    name: 'NotebookList',
    alias: '/notebooks',
    component: () => import('@/views/NotebookList.vue')
  },
  {
    path: '/note',
    name: 'NoteDetail',
    component: () => import('@/views/NoteDetail.vue')
  },
  {
    path: '/trash',
    name: 'TashDetail',
    component: () => import('@/views/TrashDetail.vue')
  },
]

const router = new VueRouter({
  routes,
})

export default router
