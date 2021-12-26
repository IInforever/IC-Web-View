const routes = [
    {
        path: '/',
        name: 'index',
        component: () => import('../views/Index.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/Register.vue')
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import('../views/Admin.vue'),
        children: [
            {
                path: '',
                name: 'admin-index',
                components: {
                    content: () =>import('../views/admin/Index.vue')
                }
            },
            {
                path: 'stat',
                name: 'admin-stat',
                components: {
                    content: () => import('../views/admin/Stat.vue')
                }
            },
            {
                path: 'users',
                name: 'admin-users',
                components: {
                    content: () => import('../views/admin/Users.vue')
                }
            }
        ]
    }
]

export default routes