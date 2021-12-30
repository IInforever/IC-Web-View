const routes = [
    {
        path: '/',
        name: 'index',
        component: () => import('../views/Index.vue'),
        meta: {
            title: 'IClipboard by IInforever'
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue'),
        meta: {
            title: 'Login'
        }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/Register.vue'),
        meta: {
            title: 'Sign up'
        }
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('../views/Home.vue'),
        meta: {
            title: 'Home page'
        }
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import('../views/Admin.vue'),
        meta: {
          title: 'Admin'
        },
        children: [
            {
                path: 'stat',
                name: 'admin-stat',
                component: () => import('../views/admin/Stat.vue')

            },
            {
                path: 'users',
                name: 'admin-users',
                component: () => import('../views/admin/Users.vue')

            },
            {
                path: '',
                name: 'admin-index',
                component: () => import('../views/admin/Index.vue')
            },
        ]
    }
]

export default routes