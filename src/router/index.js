import Vue from 'vue'
import VueRouter from 'vue-router'
import Management from '@/views/Management'
import EditDocument from '@/views/EditDocument'
import Demo from '@/views/EditDocument/Demo'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'management',
    component: Management,
    meta: {
      title: '文档管理'
    },
  },
  {
    path: '/editDocument',
    name: 'editDocument',
    component: EditDocument,
    meta: {
      title: '编辑文档'
    },
  },
  {
    path: '/demo',
    name: 'demo',
    component: Demo,
    meta: {
      title: '样例'
    },
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, form, next) => {
  document.title = (to.meta && to.meta.title) || document.title
  next()
})

export default router
