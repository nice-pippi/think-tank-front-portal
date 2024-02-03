import { createRouter, createWebHashHistory, RouteRecordRaw, createWebHistory } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../views/ContainerTemplate.vue'),
    redirect: 'Index',
    children: [
      {
        path: 'Index',
        name: 'Index',
        component: () => import('../views/modules/Index.vue')
      },
      {
        path: 'BlockIndex/:id',
        name: 'BlockIndex',
        component: () => import('../views/modules/BlockIndex.vue')
      },
      {
        path: 'PostIndex/:blockId/:postId',
        name: 'PostIndex',
        component: () => import('../views/modules/PostIndex.vue')
      },
      {
        path: 'Publish/:id',
        name: 'Publish',
        component: () => import('../views/modules/Publish.vue')
      },
      {
        path: 'PersonCenter/:id',
        name: 'PersonCenter',
        component: () => import('../views/modules/PersonCenter.vue')
      },
      {
        path: 'MyInfoDetail',
        name: 'MyInfoDetail',
        component: () => import('../views/modules/MyInfoDetail.vue')
      },
      {
        path: 'Message',
        name: 'Message',
        component: () => import('../views/modules/Message.vue')
      },
      {
        path: 'HotPostIndex',
        name: 'HotPostIndex',
        component: () => import('../views/modules/HotPostIndex.vue')
      },
      {
        path: 'BlockClassifyIndex',
        name: 'BlockClassifyIndex',
        component: () => import('../views/modules/BlockClassifyIndex.vue')
      },
      {
        path: 'BlockMasterDetail/:id',
        name: 'BlockMasterDetail',
        component: () => import('../views/modules/BlockMasterDetail.vue')
      },
      {
        path: 'SearchIndex',
        name: 'SearchIndex',
        component: () => import('../views/modules/SearchIndex.vue')
      },
      {
        path: 'ResetPassword',
        name: 'ResetPassword',
        component: () => import('../views/modules/ResetPassword.vue')
      }
    ]
  },
  {
    path: '/Register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/Result',
    name: 'Result',
    component: () => import('../views/Result.vue')
  }
]

const router = createRouter({
  // history: createWebHashHistory(),
  history: createWebHistory(),
  routes
})

export default router
