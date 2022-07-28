import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'signin',
    component: () => import('../views/signin.vue')
  },
  {
    path: '/perso',
    name: 'perso',
    component: () => import('../views/perso.vue'),
  },
  {  
    path: '/wall',
    name: 'wall',
    component: () => import('../views/wall.vue')
  },
  {
    path: '/profil',
    name: 'profil',
    component: () => import('../views/profil.vue')
  },
  {
    
    path: '/panelAdmin',
    name: '/panelAdmin',
    component: () => import('../views/panelAdmin'),
    
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const Access = ["/"]
  const pagesVerif = !Access.includes(to.path)
  const loggedIn = store.state.userId/*sessionStorage.getItem("userId")*/
  const sessionToken = store.state.token/*sessionStorage.getItem("token")*/
  if (pagesVerif && !loggedIn && !sessionToken) {
      return next("/")
  }
  next()
})

export default router
