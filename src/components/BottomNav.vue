<template>
    <nav class="navbar navbar-expand-lg top-brand p-0 border-top">
        <div class="container-fluid">
            <div class="navbar-nav d-flex flex-row w-100 justify-content-around ">
                <div class="nav-item" v-for="(link, linkIndex) in links" :key="linkIndex">
                    <router-link :to="link.path" class="nav-link" :class="{ 'active': isLinkActive(link) }">
                        <div class="d-flex flex-column align-items-center fw-bold">
                            <i class="bi" :class="link.icon"></i>
                            <div style="font-size: 0.75rem;">{{ link.name }}</div>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'ProductionBottomnav',
    data() {
        return {
            links: [
                {
                    path: '/dashboard',
                    icon: ' bi-journals',
                    name: 'Job'
                },
                {
                    path: '/material/accepted',
                    icon: ' bi-stack',
                    name: 'Material'
                },
                {
                    path: '/saleOrder/list',
                    icon: ' bi-send',
                    name: 'Ready'
                },
            ]
        }
    },
    methods: {
        isLinkActive(link) {
            // Check if the current route or any of its ancestors match the link's path
            return this.$route.matched.some((route) => {
                return route.path === link.path || (route.path !== '/' && link.path.startsWith(route.path));
            });
        },
    },
}
</script>
<style>
.router-link-active.router-link-exact-active.nav-link,
.active {
    color: white !important;
}
</style>