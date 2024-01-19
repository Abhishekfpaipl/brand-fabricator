<template>
    <div v-if="Object.keys(sale).length" class="card rounded-0 mb-2">
        <div class="d-flex border-bottom" data-bs-toggle="offcanvas" data-bs-target="#saleInfoModal"
            :data-bs-saledocId="sale.doc_id" aria-controls="saleInfoModal">
            <div class="flex-fill d-flex">
                <img :src="sale.groups[0].items[0].image[0]" style="width: 100px;">
                <div class="flex-fill p-2">
                    <div class="d-flex justify-content-between">
                        <p class="fw-bold mb-1">Purchase Created At</p>
                        <span>{{ sale.doc_date }}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <p class="fw-bold mb-1">Purchase Id</p>
                        <span>{{ sale.doc_id }}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <p class="fw-bold mb-1">Total Quantity</p>
                        <span>{{ sale.quantity.toLocaleString() }}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <p class="fw-bold mb-1">Total Amount</p>
                        <span>{{ sale.total.toLocaleString() }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SaleCard',
    props: ['sale', 'saleIndex'],
    computed: {
        items() {
            return this.sale.dispatches
        }
    }
}
</script>

<style lang="scss" scoped></style>