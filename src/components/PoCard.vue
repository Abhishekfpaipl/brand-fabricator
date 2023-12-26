<template>
    <div class="list-group list-group-flush border-bottom">
        <div class="list-group-item d-flex align-items-center">
            <!-- <img v-if="po.stock_id" :src="po.stock_id.image" class="rounded-circle" style="height:60px;width:60px;object-fit: fill;"> -->
            <div class="d-flex flex-fill flex-column ms-3">
                <span class="fw-bold">#{{ po.sid }}</span>
                <span>Order Qty : {{ po.quantity }}</span>
            </div>
            <button v-if="po.status === 'issued' && !buttonDisabled && !hideButton"
                :disabled="action === 'Accepted' || action === 'Accepting'" @click="acceptPurchaseOrder(po.sid)"
                class="w-25 btn top-brand">{{ action }}</button>
            <button v-else class="w-25 btn border" disabled>Accepted</button>
            <!-- <i v-else class="text-success bi bi-check-circle-fill fs-4"></i> -->
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import pusherApi from '@/mixins/pusherApi';
import sweetAlert from '@/mixins/sweetAlert';
export default {
    mixins: [pusherApi, sweetAlert],
    name: 'PoCard',
    props: ['po'],
    data() {
        return {
            buttonDisabled: false,
            hideButton: false,
            action: 'Accept'
        };
    },
    methods: {
        showSuccessAlert() {
            this.showSweetAlert('Yay', 'Order has been accepted');
        },
        showErrorAlert() {
            this.showSweetError('Oops', 'Something went wrong');
        },
        acceptPurchaseOrder(orderId) {
            const token = localStorage.getItem('token');
            this.buttonDisabled = true;
            this.action = 'Accepting'
            axios
                .put(
                    `http://192.168.1.133:8001/api/orders/${orderId}`,
                    {
                        status: 'accepted',
                        expected_at: this.po ? this.po.expected_at : null, // Make sure this.po is defined
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((response) => {
                    if (response.status === 'pending') {
                        console.log('hi')
                        this.action = 'Pending'
                        console.log('status changed', response.data);
                    }
                    this.showSuccessAlert();
                    this.hideButton = true;
                })
                .catch((error) => {
                    console.error('acceptPurchaseOrder:', error);
                    this.showErrorAlert();
                    this.action = 'Accept'
                })
                .finally(() => {
                    this.buttonDisabled = false;
                });
        },

    },
}
</script> 
