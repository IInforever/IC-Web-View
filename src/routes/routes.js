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