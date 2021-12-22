import Index from '../views/Index.vue'
import Hello from '../views/HelloWorld.vue'
import Login from '../views/Login.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: Index
    },
    {
        path: '/hello',
        component: Hello
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    }


]

export default routes