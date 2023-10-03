import { createWebHashHistory, createRouter } from 'vue-router'
import Home from '../views/Home.vue'
import Project from '../views/Project.vue'
import Server from '../views/Server.vue';
import DashBoard from '../views/Home/DashBoard.vue';
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/home/dashboard'
        },
        {
            path: '/home',
            component: Home,
            children: [
                {
                    path: "dashboard",
                    component: DashBoard
                },
                {
                    path: 'project',
                    component: Project,
                },
            ]
        },
        {
            path: "/server",
            component: Server
        }
    ]
})

export default router;