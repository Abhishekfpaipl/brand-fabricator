<template>
    <DashboardNav />
    <div class="container">
        <div class="row g-3">
            <div class="col-6" v-for="(dashboard, dashboardIndex) in dashboardData.cards" :key="dashboardIndex">
                <DashboardCard :dashboard="dashboard" />
            </div>
            <div v-for="(chart, chartIndex) in dashboardData.charts" :key="chartIndex" class="col-lg-6">
                <ChartView :chart="chart" :chartIndex="chartIndex" />
            </div>
        </div>
    </div>
</template>

<script>
import DashboardCard from '@/components/DashboardCard.vue';
import DashboardNav from '@/components/DashboardNav.vue';
import ChartView from '@/components/charts/ChartView.vue';
export default {
    name: 'MyDashboard',
    components: {
        DashboardCard,
        DashboardNav,
        ChartView
    },
    data() {
        return {
            links: [
                {
                    route: '/new-orders',
                    title: 'Orders',
                    icon: 'bi-cart2',
                    border: 'red',
                    bg: '#ea000020',
                    value: 45
                }
            ]
        }
    },
    mounted() {
        this.$store.dispatch('fetchDashboard')
    },
    computed: {
        dashboardData() {
            return this.$store.getters.getDashboard
        }
    },
}
</script>

<style lang="scss" scoped></style>