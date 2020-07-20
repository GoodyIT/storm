import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/auth',
      component: () => import('@/views/pages/Index'),
      children: [
        {
          name: 'Login',
          path: 'login',
          component: () => import('@/views/pages/Login'),
          meta: {
            requiresAuth: false
          }
        },
        {
          name: 'Register',
          path: 'register',
          component: () => import('@/views/pages/Register'),
          meta: {
            requiresAuth: false
          }
        },
      ],
    },
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      children: [
        // Dashboard
        {
          name: 'Sites',
          path: '',
          component: () => import('@/views/dashboard/Dashboard'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'Users',
          path: 'users',
          component: () => import('@/views/dashboard/root/Users'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'Root',
          path: 'root/all',
          component: () => import('@/views/dashboard/root/Root'),
          meta: {
            requiresAuth: true
          },
        },
        {
          path: 'root/configure/:id',
          name: 'FLS Configure',
          component: () => import('@/views/dashboard/root/Configure'),
          meta: {
            requiresAuth: true
          },
        },
        {
          name: 'Staff',
          path: 'staff',
          component: () => import('@/views/dashboard/Staff'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'Configure',
          path: 'configure',
          component: () => import('@/views/dashboard/Setting'),
          meta: {
            requiresAuth: true
          }
        },
        // Pages
        {
          name: 'My Profile',
          path: 'myprofile',
          component: () => import('@/views/dashboard/pages/UserProfile'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'Notifications',
          path: 'components/notifications',
          component: () => import('@/views/dashboard/component/Notifications'),
          meta: {
            requiresAuth: true
          }
        },
      ],
    },
    {
      path: '*',
      component: () => import('@/views/pages/Index'),
      children: [
        {
          name: '404 Error',
          path: '',
          component: () => import('@/views/pages/Error'),
          meta: {
            requiresAuth: false
          }
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)) {
        if (localStorage.getItem('jwt') == null || localStorage.getItem('jwt') == 'null') {
            next({
                path: '/auth/login',
                params: { nextUrl: to.fullPath }
            })
        } else {
            let user = {}
            try {
              user = JSON.parse(localStorage.getItem('user'))
            } catch (e) {}
            if(to.matched.some(record => record.meta.is_admin)) {
                if(user.role == 'Admin'){
                    next()
                }
                else{
                    next({ name: 'Dashboard'})
                }
            }else {
                next()
            }
        }
    } else {
        next()
    }
})


export default router