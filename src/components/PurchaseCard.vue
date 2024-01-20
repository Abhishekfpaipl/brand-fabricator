<template>
    <div v-if="Object.keys(purchase.items).length" class="card rounded-0 mb-2">

        <div class="d-flex border-bottom">
            <img :src="purchase.items[0].stock.image" class="border-end" style=" width: 80px; object-fit: fill;">
            <div class="flex-fill d-flex flex-column justify-content-between">
                <div class="p-2">
                    <div class="d-flex justify-content-between fw-bold">
                        <span>{{ purchase.sid }}</span>
                        <span>{{ purchase.quantity.toLocaleString() }}</span>
                    </div>
                    <div class="">{{ purchase.due_date }}</div>
                </div>
                <div class="btn-group" role="group"> 
                    <button class="d-flex align-items-center justify-content-center btn border-secondary rounded-0"
                        data-bs-toggle="offcanvas" data-bs-target="#purchaseInfoModal" :data-bs-purchasesid="purchase.sid"
                        aria-controls="purchaseInfoModal">
                        <span class="me-3">Detail</span>
                        <i class="bi bi-chevron-right"></i>
                    </button>
                    <div class="btn btn-success border-0 rounded-0 text-capitalize">
                        {{ purchase.procured ? 'Procured' : 'Pending' }}
                    </div>
                </div>
            </div>
        </div>
 </div>
</template>
<script>
export default {
    name: 'PurchaseCard',
    props: ['purchase', 'purchaseIndex'],
    methods: {
        purchaseAction(purchase, status) {
            console.log(purchase)
            alert('Purchase: ' + status)
        }
    }
}
</script>

<style lang="scss" scoped></style>