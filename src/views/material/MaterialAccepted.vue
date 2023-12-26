<template>
    <p class="p-2 text-center mb-0 bg-light border-bottom bill"><span class="fs-5">~ Material PO ~</span></p>
    <div v-for="(po, poIndex) in acceptedPo" :key="poIndex" class="list-group list-group-flush border-bottom">
        <!-- <router-link class="text-decoration-none text-dark" :to="'/material/procurement/' + po.sid"> -->
        <div class="list-group-item d-flex align-items-center">
            <div class="d-flex flex-fill flex-column ms-3">
                <span class="fw-bold">#{{ po.sid }}</span>
                <span>Order Qty : {{ po.quantity }}</span>
            </div>
            <!-- <button @click="procurePo(po.sid)" class="w-25 btn top-brand" :disabled="action === 'procured'">
                {{ action }}
            </button> -->
            <button @click="procurePo(po.sid)" class="w-25 btn top-brand"
                :disabled="action === 'Procured' || action === 'Procuring'">
                {{ action }}
            </button>

        </div>
        <!-- </router-link> -->
    </div>
</template>

<script>
import pusherApi from '@/mixins/pusherApi';
import axios from 'axios';
export default {
    name: "FabricPage",
    mixins: [pusherApi],
    data() {
        return {
            action: 'Procure'
        }
    },
    computed: {
        pos() {
            return this.$store.getters.getpurchaseOrders
        },
        acceptedPo() {
            return this.pos.filter(po => po.status === 'accepted')
        }
    },
    created() {
        this.connect('fetchpurchaseOrders');
    },
    mounted() {
        this.$store.dispatch('fetchpurchaseOrders')
    },
    methods: {
        procurePo(poSid) {
            const token = localStorage.getItem('token');
            const postData = { order_sid: poSid };
            this.action = 'Procuring';

            axios.post('http://192.168.1.133:8001/api/procurement/check', postData, {
                headers: { "Authorization": `Bearer ${token}` }
            }).then((response) => {
                if (response.data.status) {
                    this.action = 'Procured';
                }
            }).catch((error) => {
                console.error("Error during procurement check:", error);
                this.action = 'Procure';
            });
        }
    }

}
</script>
