<template>
    <div v-if="activePurchase" class="offcanvas offcanvas-end" tabindex="-1" id="purchaseInfoModal"
        aria-labelledby="purchaseInfoModalLabel">
        <div class="offcanvas-header p-2 w-100 d-flex justify-content-between align-items-center bg-light border-bottom">
            <i class="bi bi-chevron-left pe-3" data-bs-dismiss="offcanvas" data-bs-target="#purchaseInfoModal"
                aria-label="Close"></i>
            <div class="d-flex flex-fill flex-column">
                <span class="fw-bold">{{ activePurchase.product_code }} | {{ activePurchase.quantity }} pcs.</span>
                <span class="small">Due Before: <strong>{{ activePurchase.expected_at }}</strong></span>
            </div>
        </div>

        <div class="offcanvas-body p-0">
            <div class="card rounded-0 border-0">
                <div class="card-header text-bg-dark rounded-0">
                    {{ activePurchase.product_name }}
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-6 mb-3" v-for="(item, itemIndex) in activePurchase.items" :key="itemIndex">
                            <div class="d-flex">
                                <img :src="item.stock.image" style="width: 60px; object-fit: cover;">
                                <div class="flex-fill d-flex flex-column ps-2">
                                    <span class="text-capitalize">
                                        {{ item.stock.option_name }}
                                    </span>
                                    <span>₹ {{ activePurchase.fab_rate }}/pc</span>
                                    <span>{{ item.quantity }} pcs.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="activePurchase.message" class="form-floating mb-3">
                        <input type="text" class="form-control" :value="activePurchase.message" disabled>
                        <label for="floatingInput">Order Note:</label>
                    </div>

                    <textarea class="form-control" v-model="message"
                        placeholder="Enter Reject Reason Or Accept Condition"></textarea>
                    <p v-if="error" class="alert alert-danger my-2">{{ error }}</p>
                    <div class="btn-group d-flex w-100 mt-3" data-bs-dismiss="offcanvas">
                        <button class="flex-fill btn btn-outline-danger rounded-0"
                            @click="orderAction(activePurchase, 'rejected')">
                            <div class="d-flex justify-content-around align-items-center">
                                <span class="">Reject Order</span>
                                <i class="bi bi-x-lg fs-5"></i>
                            </div>
                        </button>
                        <button class="flex-fill btn btn-success rounded-0" @click="orderAction(activePurchase, 'accepted')">
                            <div class="d-flex justify-content-around align-items-center">
                                <span class="">Accept Order</span>
                                <i class="bi bi-check2 fs-5"></i>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    name: "OrderCard",
    props: ['purchases'],
    data() {
        return {
            activePurchase: {}
        };
    },
    async mounted() {
        this.loadActiveOrder();
    },
    methods: {
        loadActiveOrder() {
            const purchaseInfoModal = document.getElementById('purchaseInfoModal')
            if (purchaseInfoModal) {
                purchaseInfoModal.addEventListener('show.bs.offcanvas', event => {
                    const button = event.relatedTarget
                    const purchasesid = button.getAttribute('data-bs-purchasesid');
                    this.activePurchase = this.purchases.find(order => order.sid === purchasesid);
                });
            }
        },
        orderAction(order, status) {
            if (status === 'rejected' && this.message === '') {
                this.error = "Message is required to reject order.";
                return;
            }
            this.$store.dispatch('orderAction', {
                status: status,
                sid: order.sid,
                message: this.message,
                expected_at: order.expected_at
            })
        },
    }
}
</script> 
