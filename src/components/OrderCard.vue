<template>
    <div v-if="Object.keys(order.items).length" class="card rounded-0 mb-2">
        <div class="d-flex border-bottom">
            <img :src="order.items[0].stock.image" class="border-end" style=" width: 80px; object-fit: fill;">
            <div class="flex-fill d-flex flex-column justify-content-between">
                <div class="p-2">
                    <div class="d-flex justify-content-between fw-bold">
                        <span>{{ order.sid }}</span>
                        <span>{{ order.quantity.toLocaleString() }}</span>
                    </div>
                    <div class="">{{ order.due_date }}</div>
                </div>
                <div class="btn-group" role="group">
                    <button class="d-flex align-items-center justify-content-center btn border-secondary rounded-0"
                        data-bs-toggle="offcanvas" data-bs-target="#orderInfoModal" :data-bs-ordersid="order.sid"
                        aria-controls="orderInfoModal">
                        <span class="me-3">Detail</span>
                        <i class="bi bi-chevron-right"></i>
                    </button>
                    <button class="d-flex align-items-center justify-content-center btn btn-success border-0 rounded-0"
                        @click="orderAction(order, 'accepted')">
                        <span class="me-3">Accept</span>
                        <i class="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>
  
<script>
export default {
    name: "OrderCard",
    props: ['order', 'orderIndex'],
    data() {
        return {
            error: '',
            message: 'Order Accepted',
        };
    },
    methods: {
        orderAction(order, status) {
            this.$store.dispatch('orderAction', {
                status: status,
                sid: order.sid,
                message: this.message,
                expected_at: order.expected_at
            })
        },
    },
}
</script> 
