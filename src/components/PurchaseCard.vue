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
                    <!-- <button class="d-flex align-items-center justify-content-center btn border-secondary rounded-0"
                    data-bs-toggle="offcanvas" data-bs-target="#purchaseInfoModal"
                        :data-bs-purchasesid="purchase.sid" aria-controls="purchaseInfoModal">
                        <span class="me-3">Detail</span>
                        <i class="bi bi-chevron-down"></i>
                    </button> -->
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

        <!-- <div class="collapse" :id="'orderCardDetail' + purchaseIndex">
            <div class="card rounded-0 border-0">
                <div class="card-body">
                    <div class="row">
                        <div class="col-6" v-for="(item, itemIndex) in purchase.items" :key="itemIndex">
                            <div class="d-flex">
                                <img :src="item.stock.image" style="width: 60px; object-fit: cover;">
                                <div class="d-flex flex-column ps-2">
                                    <span class="flex-fill text-capitalize">
                                        Material Name
                                    </span>
                                    <strong>{{ item.quantity }}</strong> pcs.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="purchase.message" class="fw-bold my-2">{{ purchase.message }}</div>
                   
                    <div class="btn-group d-flex w-100 mt-3">
                        <button 
                            class="flex-fill btn btn-outline-danger rounded-0" 
                            @click="purchaseAction(purchase, 'rejected')"
                            >   
                            <div class="d-flex justify-content-around align-items-center">
                                <span class="">Reject Material</span> 
                                <i class="bi bi-x-lg fs-5"></i>
                            </div>
                        </button>
                        <button 
                        class="flex-fill btn btn-success rounded-0" 
                        @click="purchaseAction(purchase, 'accepted')"
                        >   
                            <div class="d-flex justify-content-around align-items-center">
                                <span class="">Accept Material</span> 
                                <i class="bi bi-check2 fs-5"></i>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div> -->

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