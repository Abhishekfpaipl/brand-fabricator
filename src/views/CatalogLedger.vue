<template>
    <div class="container pb-5">
        <div v-for="(entry, index) in ledger" :key="index" class=" my-2">
            <div class="border">
                <div class="p-1 d-flex justify-content-between border-bottom mb-2">
                    <div class="fw-bold text-center" style="width: 100px;">Date</div>
                    <div class="fw-bold text-center" style="width: 100px;">Order</div>
                    <div class="fw-bold text-center" style="width: 100px;">Ready</div>
                    <div class="fw-bold text-center" style="width: 100px;">Demand</div>
                </div>

                <div v-for="(order, orderIndex) in entry.LedgerItems.LedgerItems" :key="orderIndex"
                    @click="showActiveEntry(order)" class="d-flex justify-content-between border-bottom p-1">
                    <div v-if="order.model === 'Order'"
                        :class="{ 'text-center': true, 'text-primary': order.status === 'issued', 'bg-white': order.status === 'accepted' }"
                        style="width: 100px;" class="text-center">{{
                            formatDate(order.created_at) }}</div>
                    <div v-if="order.model === 'Order'"
                        :class="{ 'text-center': true, 'text-primary': order.status === 'issued', 'bg-white': order.status === 'accepted' }"
                        style="width: 100px;" class="text-center">{{ order.quantity }}</div>
                    <div v-if="order.model === 'Order'" style="width: 100px;"></div>
                    <div v-if="order.model === 'Order'" style="width: 100px;"></div>

                    <div v-if="order.model === 'Ready'" style="width: 100px;" class="text-center">{{
                        formatDate(order.created_at) }}</div>
                    <div v-if="order.model === 'Ready'" style="width: 100px;"></div>
                    <div v-if="order.model === 'Ready'" style="width: 100px;" class="text-center">{{ order.quantity }}</div>
                    <div v-if="order.model === 'Ready'" style="width: 100px;"></div>

                    <div v-if="order.model === 'Demand'" style="width: 100px;" class="text-center">{{
                        formatDate(order.created_at) }}</div>
                    <div v-if="order.model === 'Demand'" style="width: 100px;"></div>
                    <div v-if="order.model === 'Demand'" style="width: 100px;"></div>
                    <div v-if="order.model === 'Demand'" style="width: 100px;" class="text-center">{{ order.quantity }}
                    </div>

                    <div v-if="order.model === 'LedgerAdjustment'" style="width: 100px;" class="text-center text-danger">{{
                        formatDate(order.created_at) }}</div>
                    <div v-if="order.model === 'LedgerAdjustment'" style="width: 100px;" class="text-danger text-center">{{
                        order.order_qty }}</div>
                    <div v-if="order.model === 'LedgerAdjustment'" style="width: 100px;" class="text-danger text-center">{{
                        order.ready_qty }}</div>
                    <div v-if="order.model === 'LedgerAdjustment'" style="width: 100px;" class="text-center text-danger">{{
                        order.demand_qty }}
                    </div>

                </div>
                <!-- <div v-for="(adjust, orderIndex) in entry.adjustments" :key="orderIndex"
                    class="d-flex justify-content-between border-bottom mb-2">
                    <div style="width: 100px;" class="text-center">{{
                        formatDate(adjust.created_at) }}</div>
                    <div style="width: 100px;" class="text-center bg-danger">{{ adjust.order_qty }}</div>
                    <div style="width: 100px;" class="text-center bg-danger">{{ adjust.ready_qty }}</div>
                    <div style="width: 100px;" class="text-center bg-danger">{{ adjust.demand_qty }}</div>
                </div> -->

                <div class="d-flex justify-content-between bg-light p-1">
                    <p class="text-center mb-0 fw-bold" style="width:100px">Total</p>
                    <p class="text-center mb-0" style="width:100px">{{ calculateTotal('Order',
                        entry.LedgerItems.LedgerItems) }}</p>
                    <p class="text-center mb-0" style="width:100px">{{ calculateTotal('Ready',
                        entry.LedgerItems.LedgerItems) }}</p>
                    <p class="text-center mb-0" style="width:100px">{{ calculateTotal('Demand',
                        entry.LedgerItems.LedgerItems) }}</p>
                </div>
            </div>
            <div class="top-brand p-2 my-2 d-flex justify-content-between fw-bold">
                <p class="mb-0 fw-bold">Demandable Qty</p>
                <p class="mb-0">{{ entry.demandable_qty.toLocaleString() }}</p>
            </div>
            <div class="top-brand p-2 my-2 d-flex justify-content-between fw-bold">
                <p class="mb-0 fw-bold">Balance Qty</p>
                <p class="mb-0">{{ entry.balance_qty.toLocaleString() }}</p>
            </div>
        </div>
        <div v-if="Object.keys(activeEntry).length">
            <div class="custom-offcanvas-overlay" @click="hideActiveEntry()"></div>
            <div class="offcanvas offcanvas-end show" style="">

                <div class="top-brand d-flex justify-content-between align-items-center p-2 border-bottom">
                    <b class="">Details</b> <i class="bi bi-x fs-3" @click="hideActiveEntry()"></i>
                </div>
                <div class="offcanvas-body">
                    <div>
                        <table class="table table-striped table-bordered">
                            <tbody>
                                <tr>
                                    <th v-if="activeEntry.model === 'Order'" colspan="2" class="text-center">Order</th>
                                    <th v-if="activeEntry.model === 'Ready'" colspan="2" class="text-center">Ready</th>
                                    <th v-if="activeEntry.model === 'Demand'" colspan="2" class="text-center">Demand</th>
                                </tr>
                                <tr>
                                    <th scope="col" class="w-50 text-center">Color</th>
                                    <th scope="col" class="w-50 text-center">Qty</th>
                                </tr>
                                <tr v-for="(item, itemIndex) in activeEntry.items" :key="itemIndex">
                                    <td class="text-center">
                                        <img :src="item.stock_id.image" style="height:60px;width:60px;object-fit: fill;">
                                        {{ item.stock_id.product_option_sid }}
                                    </td>
                                    <td class="text-center">{{ item.quantity }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="top-brand p-2 my-2 d-flex justify-content-between">
                            <b>Total</b>
                            <p class="mb-0">{{ totalQty }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="">
            <div class=" d-flex justify-content-center align-items-center my-3 w-100" style="bottom: 60px;">
                <button class="btn top-brand rounded-pill" data-bs-toggle="collapse" href="#collapseExample" role="button"
                    aria-expanded="false" aria-controls="collapseExample" type="button">
                    Add Ready Qty
                </button>
                <button class="btn top-brand rounded-pill mx-2" disabled>
                    Disptach
                </button>
            </div>
            <div class="collapse" id="collapseExample">
                <div class="card card-body">
                    <div style="padding-bottom: 80px;">
                        <div class="tab-content" id="myTabContent">
                            <form @submit.prevent="postReady()" method="post">
                                <div class="form-floating mb-3">
                                    <textarea class="form-control as" v-model="message" id="floatingTextarea"></textarea>
                                    <label for="floatingTextarea">Message</label>
                                </div>
                                <div class="my-3">
                                    <div class="d-flex">
                                        <p class="m-0 fs-5 mt-3 mb-2">Colors</p>
                                    </div>
                                    <div v-if="stock.product" class="d-flex flex-wrap gap-2 mb-2">
                                        <div class="d-flex" v-for="(color, index) in stock.product.options" :key="index">
                                            <img :src="color.image" class="rounded me-2 p-1"
                                                style="width: 60px; height: 58px; object-fit: cover; border:2px solid black ;">
                                            <div class="form-floating">
                                                <input type="number" class="form-control" :id="'colorQuantity_' + color.sid"
                                                    v-model="color.quantity" />
                                                <label :for="'colorQuantity_' + color.sid">{{ color.name }} Quantity</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="my-4">
                                        <p class=" fs-5 bill text-center"><span>~ Total Ready Qty ~</span></p>
                                        <div class="d-flex justify-content-between mb-3">
                                            <div class="d-flex justify-content-between border container py-2 mx-1"
                                                style="background-color: #E8FFCE;">
                                                <p class="fw-bold text-center mb-0">{{
                                                    totalColorInputAmount.toLocaleString() }} pcs</p>
                                                <p class="mb-0">Total</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-center mt-3">
                                        <button class="btn top-brand w-100" type="submit">Submit</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <CommonChat :dataset="ledger" />

    </div>
</template>

<script>
import axios from 'axios';
import pusherApi from '@/mixins/pusherApi';

import CommonChat from '@/components/CommonChat';
export default {
    name: 'CatalogLedger',
    mixins: [pusherApi],
    components: {
        CommonChat
    },
    data() {
        return {
            catalogId: '',
            orderQty: 0,
            message: '',
            selectedLedgerId: null,
        }
    },
    created() {
        this.catalogId = this.$route.params.catalogId;
        this.$store.dispatch('fetchStock', this.catalogId)
            // .then(() => {
            //     console.log('created successfully');
            //     // Adding a delay of 2 seconds before proceeding to the mounted hook
            //     return new Promise(resolve => setTimeout(resolve, 1000));
            // })
            .then(() => {
                // const productSid = this.stock.product.sid;
                // this.$store.dispatch('fetchLedgers', this.catalogId)
                // this.connect('fetchLedgers', this.catalogId)
            })
            .catch((error) => {
                console.error('Error fetching stock:', error);
            });

        this.$store.dispatch('fetchLedgers', this.catalogId)
        this.connect('fetchLedgers', this.catalogId)
        if (this.ledger.length > 0) {
            this.selectedLedgerId = this.ledger[0].sid;
        }
    },
    mounted() {
        this.catalogId = this.$route.params.catalogId;
        this.connect('fetchLedgers', this.catalogId)
    },
    computed: {
        stock() {
            return this.$store.getters.getStock
        },
        ledger() {
            return this.$store.getters.getLedgers
        },
        activeEntry() {
            return this.$store.getters.getActiveEntry
        },
        totalColorInputAmount() {
            if (this.stock.product) {
                return this.stock.product.options.reduce((total, color) => total + parseInt(color.quantity || 0), 0);
            }
            return 0;
        },
        totalQty() {
            return this.activeEntry.items.reduce((total, item) => total + item.quantity, 0);
        }
    },
    methods: {
        // formatDate(dateTimeString) {
        //     const date = new Date(dateTimeString);
        //     return date.toISOString().split('T')[0]; // Extracts the date portion
        // },
        calculateTotal(model, ledgerItems) {
            return ledgerItems
                .filter((order) => order.model === model)
                .reduce((total, order) => total + order.quantity, 0);
        },
        formatDate(dateTimeString) {
            const options = {
                month: 'short',
                day: 'numeric',
            };
            const formattedTime = new Date(dateTimeString).toLocaleDateString('en-US', options);
            return formattedTime;
        },
        showActiveEntry(entry) {
            this.$store.dispatch('showActiveEntry', entry)
        },
        hideActiveEntry(entry) {
            this.$store.dispatch('hideActiveEntry', entry)
        },
        postReady() {
            if (this.totalColorInputAmount > 0) {
                const token = localStorage.getItem('token');

                const quantities = this.stock.product.options.map(color => {
                    const key = `${color.sid}_free`;
                    const value = color.quantity;
                    return { [key]: value };
                });

                const postData = {
                    // ledger_sid: this.selectedLedgerId,
                    ledger_sid: this.ledger[0].sid,
                    message: this.message,
                    quantities: JSON.stringify(quantities),
                };

                // proceed only if quantity total > 0
                axios.post('http://192.168.1.133:8001/api/readies', postData, {
                    headers: { "Authorization": `Bearer ${token}` },
                })
                    .then((response) => {
                        console.log('Data posted', response.data);
                        this.message = '';
                        // Reset color.quantity for each color
                        this.stock.product.options.forEach(color => {
                            color.quantity = 0;
                        });
                    })
                    .catch((error) => {
                        console.error('Error posting data', error);
                    });
            } else {
                console.log('Quantity total is 0 or less. Skipping post request.');
            }
        }

    },
}
</script>

<style  scoped>
.custom-offcanvas-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1045;
}
</style>