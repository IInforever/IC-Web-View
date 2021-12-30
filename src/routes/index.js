import {createRouter, createWebHistory} from "vue-router"

import routes from "./routes";

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to,from,next)=>{
    if(to.meta.title)
        document.title = to.meta.title
    else
        document.title = "IClipboard"
    next()
})

export default router