<template>
    <nav class="navbar top-brand border-bottom">
        <div class="container-fluid">
            <span class="navbar-brand text-white">{{ formattedPageTitle }}</span>
            <router-link to="/profile" class="text-dark">
                <i class="bi bi-person-fill text-white fs-5"></i>
            </router-link>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'BottomNav',
    data() {
        return {
            pageTitle: 'No Title',
        }
    },
    computed: {
        formattedPageTitle() {
            return this.formatTitle(this.pageTitle);
        }
    },
    created() {
        this.setPageTitle(this.$route.name);
    },
    watch: {
        $route(newRoute) {
            this.setPageTitle(newRoute.name);
        },
    },
    methods: {
        setPageTitle(routeName) {
            this.pageTitle = routeName || 'No Title';
        },
        formatTitle(title) {
            // Split camel case and join with spaces
            return title.replace(/([a-z])([A-Z])/g, '$1 $2');
        },
    },
}
</script>
