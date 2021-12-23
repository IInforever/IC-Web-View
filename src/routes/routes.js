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
    }

]

export default routes