<template>
    <router-link :to="dashboard.route" class="text-decoration-none text-dark">
        <div class="d-flex flex-column p-3 border-start"
            :style="{ 'border-color': dashboard.border + '!important', 'background-color': dashboard.bg }"
            style="height: 100px; border-width: 0.75rem !important">
            <div class="d-flex flex-fill justify-content-between align-items-center fs-1">
                <span class="fw-bold ps-2">{{ dashboard.value }}</span>
                <i class="bi px-2" :class="dashboard.icon"></i>
            </div>
            <div class="d-flex flex-column justify-content-start">
                <span class="fs-5 fw-bold">{{ dashboard.title }}</span>
            </div>
        </div>
    </router-link>
</template>

<script>
export default {
    name: 'DashboardCard',
    props: ['dashboard']
}
</script>

<style lang="scss" scoped></style>