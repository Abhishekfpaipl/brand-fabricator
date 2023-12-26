<template>
    <div class="d-flex align-items-center p-2 " style="background-color: #25C297;">
        <router-link to="/saleOrder/list" class="text-white">
            <i class="bi bi-chevron-left fs-4"></i>
        </router-link>
        <div class="flex-fill" data-bs-toggle="collapse" data-bs-target="#productDetail" aria-expanded="false"
            aria-controls="productDetail">
            <div class="d-flex justify-content-between align-items-center text-white p-2">
                <p class="fw-bold mb-0">{{ dataset.sid }} | {{ dataset.quantity }}</p>
                <i class="bi bi-chevron-down text-white px-2"></i>
            </div>
        </div>
    </div>
    <div class="collapse" id="productDetail">
        <div class="d-flex justify-content-center">
            <img v-if="dataset.product" :src="dataset.product.colors[0].image" class=""
                style="height: 250px;object-fit: fill;">
        </div>

        <div class="mb-2 border rounded-bottom">
            <div class="flex-fill d-flex text-muted bg-light border-bottom">
                <div class="px-2 py-1  border-end" style="min-width: 110px; width: fit-content;">Name</div>
                <div v-if="dataset.product" class="px-2 py-1 text-capitalize ">{{ dataset.product.name }}</div>
            </div>
            <div class="flex-fill d-flex text-muted bg-light border-bottom">
                <div class="px-2 py-1  border-end" style="min-width: 110px; width: fit-content;">Search Tags</div>
                <div v-if="dataset.product" class="px-2 py-1 text-capitalize ">{{ dataset.product.tags }}</div>
            </div>
            <div v-if="dataset.product" class="flex-fill d-flex text-muted bg-light
             border-bottom">
                <div class="px-2 py-1  border-end" style="min-width: 110px; width: fit-content;">Color</div>
                <div class="px-2 py-1 text-capitalize ">{{ displayedColors }}</div>
            </div>
            <div v-if="dataset.product" class="flex-fill d-flex text-muted bg-light border-bottom">
                <div class="px-2 py-1  border-end" style="min-width: 110px; width: fit-content;">Size</div>
                <div class="px-2 py-1 text-capitalize ">{{ displayedSizes }}</div>
            </div>
            <div class="flex-fill d-flex text-muted bg-light border-bottom">
                <div class="px-2 py-1  border-end" style="min-width: 110px; width: fit-content;">Created On</div>
                <div v-if="dataset.purchase_order" class="px-2 py-1 text-capitalize ">{{ dataset.purchase_order.created_at
                }}</div>
            </div>
            <div class="flex-fill d-flex bg-light text-muted border-bottom">
                <div class="px-2 py-1 border-end" style="min-width: 110px; width: fit-content;">Expected On</div>
                <div v-if="dataset.purchase_order" class="px-2 py-1 text-capitalize ">{{ dataset.purchase_order.expected_at
                }}</div>
            </div>
        </div>
    </div>
    <div class="container mt-2" style="padding-bottom: 80px;">
        <div class="d-flex flex-column justify-content-center align-items-center text-success">
            <!-- <i class="bi bi-hand-thumbs-up display-1 p-4" :class="{ 'bounce': completedTime }"></i> -->
            <i class="bi bi-hand-thumbs-up display-1 p-4"></i>
            <p v-if="completedTime" class="mb-0">Order is completed on {{ formatDate(completedTime) }}</p>
            <p class="text-center mb-0 fw-bold text-success my-2">Time Duration</p>
            <p v-if="dataset.time_difference >= 0" class="text-center text-success">Early Delivery By {{
                Math.abs(dataset.time_difference) }}
                Days
            </p>
            <p v-else class="text-center text-danger">Late Delivery By {{ Math.abs(dataset.time_difference) }} Days</p>
        </div>


        <button class="btn btn-light border d-flex justify-content-between w-100 rounded-0 py-2 my-1" type="button"
            data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false"
            aria-controls="collapseExample"> <span>Order
                Chats</span><span v-if="dataset.message">{{ dataset.message.length }}</span>
        </button>
        <div class="collapse" id="collapseExample">
            <div class="card card-body rounded-0 border-light bg-light">
                <div v-for="(message, index) in dataset.message" :key="index">
                    <div class="message mt-3 mb-2  w-100">
                        <div class="message-content border w-100 bg-white"
                            style="word-wrap: break-word; padding: 10px !important; border-radius: 8px; border-top-right-radius: 15px; border-bottom-left-radius: 15px; border-bottom-right-radius: 0px !important; ">
                            <small>
                                <small class="text-primary">@ {{ message.username }}</small>
                            </small>
                            <p class="mb-0">
                                <strong>{{ message.title }}</strong>: {{ message.body }}
                            </p>
                        </div>
                        <div class="text-end text-muted" style="font-size: 10px;">{{ message.time }}</div>
                    </div>
                </div>
            </div>
        </div>


        <button class="d-flex justify-content-between btn btn-light border w-100 rounded-0 text-start my-1" @click="toggleOrder"
            type="button" data-bs-toggle="collapse" data-bs-target="#orderSummary" aria-expanded="false"
            aria-controls="collapseExample">
            <span> Show Order Summary</span>
            <span>
                <i :class="iconClassOrder"></i>
            </span>
        </button>

        <div class="collapse" id="orderSummary">
            <div v-if="dataset.log_status_time">
                <ul v-for="(log, logIndex) in dataset.log_status_time" :key="logIndex"
                    class="list-group list-group-flushed rounded-0">
                    <li v-if="log.status === 'po_issued'" class="list-group-item text-capitalize text-dark py-1 px-2 small">
                        <div class="d-flex justify-content-between align-items-center">
                            <p class="mb-0"><i class="bi bi-check2-circle text-success"></i></p>
                            <div class="mb-0 text-end">
                                <p class="mb-0">Order Placed</p>
                                <small class="text-muted">{{ log.time }}</small>
                            </div>
                        </div>
                    </li>
                    <li v-if="log.status === 'po_placed'" class="list-group-item text-capitalize text-dark py-1 px-2 small">
                        <div class="d-flex justify-content-between align-items-center ">
                            <p class="mb-0"><i class="bi bi-check2-circle text-success"></i></p>
                            <div class="mb-0 text-end">
                                <p class="mb-0">Order Accepted By Fabricator</p>
                                <small class="text-muted">{{ log.time }}</small>
                            </div>
                        </div>
                    </li>
                    <li v-if="log.status === 'po_completed'"
                        class="list-group-item text-capitalize text-dark py-1 px-2 small">
                        <div class="d-flex justify-content-between align-items-center ">
                            <p class="mb-0"><i class="bi bi-check2-circle text-success"></i></p>
                            <div class="mb-0 text-end">
                                <p class="mb-0">Order Issued To Cutting</p>
                                <small class="text-muted">{{ log.time }}</small>
                            </div>
                        </div>
                    </li>
                    <li v-if="log.status === 'cutting'" class="list-group-item text-capitalize text-dark py-1 px-2 small">
                        <div class="d-flex justify-content-between align-items-center ">
                            <p class="mb-0"><i class="bi bi-check2-circle text-success"></i></p>
                            <div class="mb-0 text-end">
                                <p class="mb-0">Order Issued To Cutting</p>
                                <small class="text-muted">{{ log.time }}</small>
                            </div>
                        </div>
                    </li>
                    <li v-if="log.status === 'production'"
                        class="list-group-item text-capitalize text-dark py-1 px-2 small">
                        <div class="d-flex justify-content-between align-items-center ">
                            <p class="mb-0"><i class="bi bi-check2-circle text-success"></i></p>
                            <div class="mb-0 text-end">
                                <p class="mb-0">Order Issued To Production</p>
                                <small class="text-muted">{{ log.time }}</small>
                            </div>
                        </div>
                    </li>
                    <li v-if="log.status === 'packing'" class="list-group-item text-capitalize text-dark py-1 px-2 small">
                        <div class="d-flex justify-content-between align-items-center ">
                            <p class="mb-0"><i class="bi bi-check2-circle text-success"></i></p>
                            <div class="mb-0 text-end">
                                <p class="mb-0">Order Issued To Packing</p>
                                <small class="text-muted">{{ log.time }}</small>
                            </div>
                        </div>
                    </li>
                    <li v-if="log.status === 'ready'" class="list-group-item text-capitalize text-dark py-1 px-2 small">
                        <div class="d-flex justify-content-between align-items-center ">
                            <p class="mb-0"><i class="bi bi-check2-circle text-success"></i></p>
                            <div class="mb-0 text-end">
                                <p class="mb-0">Order Ready to Dispatched</p>
                                <small class="text-muted">{{ log.time }}</small>
                            </div>
                        </div>
                    </li>
                    <li v-if="log.status === 'requested'" class="list-group-item text-capitalize text-dark py-1 px-2 small">
                        <div class="d-flex justify-content-between align-items-center ">
                            <p class="mb-0"><i class="bi bi-check2-circle text-success"></i></p>
                            <div class="mb-0 text-end">
                                <p class="mb-0">Order Requested</p>
                                <small class="text-muted">{{ log.time }}</small>
                            </div>
                        </div>
                    </li>
                    <li v-if="log.status === 'completed'" class="list-group-item text-capitalize text-dark py-1 px-2 small">
                        <div class="d-flex justify-content-between align-items-center ">
                            <p class="mb-0"><i class="bi bi-check2-circle text-success"></i></p>
                            <div class="mb-0 text-end">
                                <p class="mb-0">Order Accepted By Brand App</p>
                                <small class="text-muted">{{ log.time }}</small>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <button class="d-flex justify-content-between btn btn-light border w-100 rounded-0 text-start my-1" @click="toggle"
            type="button" data-bs-toggle="collapse" data-bs-target="#orderExtra" aria-expanded="false"
            aria-controls="collapseExample">
            <span> Loss / Exccess Quantities</span>
            <span>
                <i :class="iconClass"></i>
            </span>
        </button>
        <!-- <p class="p-2 text-center mb-0 fw-bold bg-light my-2">Extra Details</p> -->
        <div class="collapse" id="orderExtra">
            <table v-if="this.dataset.loss_quantities" class="table table-responsive">
                <thead class="table-secondary">
                    <tr>
                        <th scope="col">
                            <div class="d-flex flex-column align-items-center">
                                <p class="m-0">{{ skuCount }}</p>
                                <p class="m-0" style="font-size: 12px;">SKU</p>
                            </div>
                        </th>
                        <th scope="col" class="text-center" v-for="(size, index) in dataset.product.sizes" :key="index">
                            <div class="fw-bold">
                                <p class="">{{ size.name }}</p>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(color, colorIndex) in dataset.product.colors" :key="colorIndex">
                        <td class="table-secondary">
                            <img :src="color.image" class="rounded-circle"
                                style="width: 38px; height: 38px; object-fit: cover;" alt="">
                        </td>
                        <td v-for="(size, sizeIndex) in dataset.product.sizes" :key="sizeIndex">
                            <input type="number" class="form-control text-center border-0"
                                v-model="dataset.loss_quantities[`${color.sid}_${size.sid}`]" readonly>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="d-flex justify-content-between mx-3 py-2 px-4 border" style="background-color: #e8e8e8;">
                <p class="mb-0">Loss / Excess Quantities</p>
                <p class="fw-bold text-center mb-0">{{ dataset.loss_quantity }} pcs</p>
            </div>
        </div>
    </div>
</template> 

<script>
import axios from 'axios';

export default {
    data() {
        return {
            dataset: {},
            completedTime: null,
            isExpanded: false,
            isExpandedOrder: false,
        }
    },
    mounted() {
        this.purchaseId = this.$route.params.purchaseId;
        axios.get('http://192.168.1.133:8001/api/purchases/' + this.purchaseId)
            .then(response => {
                if (response.data.status === 'ok') {
                    this.dataset = response.data.data;
                    const completedLog = this.dataset.log_status_time.find(log => log.status === 'completed');
                    if (completedLog) {
                        this.completedTime = this.formatDate(completedLog.time); // Update completedTime
                    }
                } else if (response.data.status === 'error') {
                    alert(response.data.message)
                } else {
                    alert('Something went wrong! Please try again')
                }
            })
            .catch((error) => { console.error('error getting data', error) })
    },
    computed: {
        skuCount() {
            return this.dataset.product.colors ? this.dataset.product.colors.length * this.dataset.product.sizes.length : 0;
        },
        displayedColors() {
            if (this.dataset && this.dataset.product && this.dataset.product.colors) {
                return this.dataset.product.colors.map(color => color.name).join(', ');
            }
            return '';
        },
        displayedSizes() {
            if (this.dataset && this.dataset.product && this.dataset.product.sizes) {
                return this.dataset.product.sizes.map(size => size.name).join(',');
            }
            return '';
        },
        iconClass() {
            return this.isExpanded ? "bi bi-chevron-up" : "bi bi-chevron-down";
        },
        iconClassOrder() {
            return this.isExpandedOrder ? "bi bi-chevron-up" : "bi bi-chevron-down";
        },
    },
    methods: {
        formatDate(dateString) {
            const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
            return new Date(dateString).toLocaleDateString('en-US', options);
        },
        toggle() {
            this.isExpanded = !this.isExpanded;
        },
        toggleOrder() {
            this.isExpandedOrder = !this.isExpandedOrder;
        },
        
    },

}
</script>
<style scoped>
/* Add the CSS animation and class here */
@keyframes bounce {

    0%,
    20%,
    50%,
    80%,
    100% {
        transform: translateY(0);
    }

    40% {
        transform: translateY(-30px);
    }

    60% {
        transform: translateY(-15px);
    }
}

.bounce {
    animation: bounce 1s infinite;
}
</style>