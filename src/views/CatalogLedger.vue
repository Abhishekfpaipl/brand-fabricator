<template>
    <nav class="navbar top-brand border-bottom">
        <div class="container-fluid">
            <span class="navbar-brand text-white">{{ pageTitle }}</span>
            <router-link to="/profile" class="text-dark">
                <i class="bi bi-person-fill text-white fs-5"></i>
            </router-link>
        </div>
    </nav>
    <div class="container">
        <table class="table">
            <thead>
                <tr class="text-center">
                    <th scope="col">Date</th>
                    <th scope="col">Order</th>
                    <th scope="col">Rdy.</th>
                    <th scope="col">Req.</th>
                    <th scope="col">Bal.</th>
                </tr>
            </thead>
            <tbody>
                <tr class="text-center" v-for="(entry, index) in calculatedEntries" :key="index">
                    <td>{{ entry.date }}</td>
                    <td>{{ entry.order }}</td>
                    <td>{{ entry.ready }}</td>
                    <td>{{ entry.requested }}</td>
                    <td>{{ entry.balance }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'CatalogLedger',
    data() {
        return {
            pageTitle: 'No Title',
            ledgerEntries: [
                { date: '23 Dec 23', order: 10000, ready: 5000, requested: 4000 },
                { date: '23 Dec 23', order: 10000, ready: 6000, requested: 3000 },
            ]

        }
    },
    computed: {
        calculatedEntries() {
            return this.ledgerEntries.map(entry => {
                return {
                    ...entry,
                    balance: entry.ready - entry.requested
                }
            })
        }
    },
    created() {
        this.setPageTitle(this.$route.name)
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
    },

}
</script>

<style lang="scss" scoped></style>