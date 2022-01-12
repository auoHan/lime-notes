import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
import Login from '@/views/Login'
import NotebookList from '@/views/NotebookList'
import NoteDetail from '@/views/NoteDetail'
import TashDetail from '@/views/TashDetail'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/notebooks',
    name: 'NotebookList',
    component: NotebookList
  },
  {
    path: '/note',
    name: 'NoteDetail',
    component: NoteDetail
  },
  {
    path: '/trash',
    name: 'TashDetail',
    component: TashDetail
  },
]

const router = new VueRouter({
  routes,
})

export default router
