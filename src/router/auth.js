const routes = [
    {
        path: "/login",
        name: "LoginPage",
        component: () => import('@/views/auths/LoginPage.vue')
    }
]
export default routes;