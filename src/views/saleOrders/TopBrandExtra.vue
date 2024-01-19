<template>
            <div class="collapse my-2" id="ledgerFilter">
            <div class="card card-body">
                <div class="d-flex gap-2 justify-content-between align-items-center">
                    <div class="mb-3">
                        <label for="startDate" class="form-label">Start Date:</label>
                        <input type="date" v-model="startDate" class="form-control" id="startDate">
                    </div>

                    <div class="mb-3">
                        <label for="endDate" class="form-label">End Date:</label>
                        <input type="date" v-model="endDate" class="form-control" id="endDate">
                    </div>
                </div>
                <div class="">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" v-model="ready" value="" id="ready">
                            <label class="form-check-label" for="ready">
                                Ready
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" v-model="order" value="" id="order">
                            <label class="form-check-label" for="order">
                                Order
                            </label>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" v-model="demand" value="" id="demand">
                            <label class="form-check-label" for="demand">
                                Demand
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" v-model="adjust" value="" id="adjust">
                            <label class="form-check-label" for="adjust">
                                Adjustment
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
    export default {
        name: 'TopBrandExtra'
    }
</script>

<style lang="scss" scoped>

</style>