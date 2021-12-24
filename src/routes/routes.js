const routes = [
    {
        path: '/',
        name: 'home',
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
    }
]

export default routes