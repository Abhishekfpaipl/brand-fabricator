<template>
    <div v-if="Object.keys(dispatch.items).length" class="card rounded-0 mb-2">

        <div class="d-flex border-bottom">
            <img :src="dispatch.items[0].stock.image" class="border-end" style=" width: 80px; object-fit: fill;">
            <div class="flex-fill d-flex flex-column justify-content-between">
                <div class="p-2">
                    <div class="d-flex justify-content-between fw-bold">
                        <span>{{ dispatch.sid }}</span>
                        <span>{{ dispatch.quantity.toLocaleString() }}</span>
                    </div>
                    <div class="">{{ dispatch.due_date }}</div>
                </div>
                <div class="btn-group" role="group">
                    <button class="d-flex align-items-center justify-content-center btn border-secondary rounded-0"
                        data-bs-toggle="offcanvas" data-bs-target="#dispatchOrderModal" :data-bs-dispatchId="dispatch.id"
                        aria-controls="dispatchOrderModal">
                        <span class="me-3">Detail</span>
                        <i class="bi bi-chevron-right"></i>
                    </button>
                    <button class="btn border-0 rounded-0 text-capitalize"
                        :class="{ 'btn-success': dispatch.status === 'received', 'btn-warning': dispatch.status === 'pending' }">
                        <i class="bi"
                            :class="{ 'bi-check2': dispatch.status === 'received', 'bi-hourglass': dispatch.status === 'pending' }"></i>
                        <span class="me-3">{{ dispatch.status }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    name: "DispatchCard",
    props: ['dispatch', 'dispatchIndex'],
    data() {
        return {
            error: '',
            message: '',
        };
    },
    methods: {
        dispatchAction(dispatch, status) {
            if (status === 'rejected' && this.message === '') {
                this.error = "Message is required to reject dispatch.";
                return;
            }
            this.$store.dispatch('dispatchAction', {
                status: status,
                sid: dispatch.sid,
                message: this.message,
                expected_at: dispatch.expected_at
            })
        },
    },
}
</script> 
