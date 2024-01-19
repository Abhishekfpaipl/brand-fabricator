<template>

    <LedgerFilters :stock="ledger.stock" @filters-changed="handleFiltersChange" />

    <div class="pb-5">

        <div v-if="!addReady && !addDispatch" class="border">
            <table class="table table-striped table-borderless mb-0" style="font-weight: 500;">
                <thead>
                    <tr class="table-dark">
                        <th class="ps-3 fw-bold text-start">Date</th>
                        <th class="fw-bold text-start">Order</th>
                        <th class="fw-bold text-center">Ready</th>
                        <th class="pe-3 fw-bold text-end">Demand</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(ledgerItem, ledgerItemIndex) in ledger.items" :key="ledgerItemIndex"
                        v-show="filters[ledgerItem.model]" data-bs-toggle="offcanvas" data-bs-target="#ledgerInfoModal"
                        :data-bs-ledgermodelsid="ledgerItem.model_sid" aria-controls="ledgerInfoModal">
                        <td class="ps-3 text-start">{{ formatDate(ledgerItem.created_at) }}</td>
                        <td colspan="3" class="pe-3" :class="[
                            getTableDataClass(ledgerItem),
                            getActiveClass(ledgerItem),
                            { 'text-danger': ledgerItem.model === 'adjustment' }
                        ]">
                            {{ ledgerItem.quantity.toLocaleString() }}
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr class="table-dark">
                        <td class="ps-3 text-start fw-bold" style="min-width: 90px;">Total</td>
                        <td class="text-start" style="min-width: 90px;">
                            {{ calculateTotalOrder('order', ledger.items, 'accepted').toLocaleString() }}
                        </td>
                        <td class="text-center" style="min-width: 90px;">
                            {{ calculateTotal('ready', ledger.items).toLocaleString() }}
                        </td>
                        <td class="pe-3 text-end" style="min-width: 90px;">
                            {{ calculateTotal('demand', ledger.items).toLocaleString() }}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <table class="table table-striped table-borderless">
            <tbody>
                <tr>
                    <td class="ps-3 fw-bold">
                        Demandable Qty
                        <button class="btn btn-sm btn-outline-dark ms-3" @click="showLedgerSummary">
                            Show Ledger Summary
                        </button>
                    </td>
                    <td class="pe-3 text-end">{{ ledger.demandable_qty ? ledger.demandable_qty.toLocaleString() : 0 }}</td>
                </tr>
                <tr>
                    <td class="ps-3 fw-bold">
                        Balance Qty
                        <button class="btn btn-sm btn-outline-dark ms-3" @click="showAddReady">
                            Add Ready Stock
                        </button>
                    </td>
                    <td class="pe-3 text-end">{{ ledger.balance_qty ? ledger.balance_qty.toLocaleString() : 0 }}</td>
                </tr>
                <tr>
                    <td class="ps-3 fw-bold">
                        Dispatchable Qty
                        <button class="btn btn-sm btn-outline-dark ms-3" @click="showAddDispatch">
                            Dispatch Stock
                        </button>
                    </td>
                    <td class="pe-3 text-end">{{ ledger.dispatchable_qty ? ledger.dispatchable_qty.toLocaleString() : 0 }}
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="ledger.balance_qty">

            <form class="px-3" v-if="addReady" @submit.prevent="postReady()" method="post">

                <div class="text-center mb-3 text-bg-dark p-1">Add Ready Quantity</div>

                <textarea class="form-control" v-model="message" placeholder="Enter your message ..."></textarea>

                <div v-if="ledger.stock.product" class="d-flex flex-wrap gap-2 mb-2">
                    <div class="d-flex w-100" v-for="(color, index) in ledger.stock.product.options" :key="index">
                        <button class="btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            <img :src="color.image" class="rounded me-2" style="height: 60px; object-fit: cover">
                        </button>
                        <div class="flex-fill form-floating overflow-hidden">
                            <input type="number" class="form-control" :id="'colorQuantity_' + color.sid"
                                v-model="color.quantity" @input="handleInput(color)" />
                            <label class="text-capitalize" :for="'colorQuantity_' + color.sid">
                                {{ color.name }} Color
                            </label>
                        </div>
                        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
                            aria-hidden="true">
                            <div class="modal-dialog modal-fullscreen">
                                <div class="modal-content">
                                    <button class="btn h-100" data-bs-dismiss="modal" aria-label="Close">
                                        <img :src="color.image" class="h-100"
                                            style="object-fit: cover; object-position: center;">
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button class="btn btn-warning fw-bold w-100" type="submit">
                    <div class="d-flex justify-content-around">
                        <span>Submit</span>
                        <span>{{ totalColorInputAmount.toLocaleString() }} pcs</span>
                    </div>
                </button>

            </form>

            <form class="px-3" v-if="addDispatch" @submit.prevent="postDisptach()" method="post">

                <div class="text-center mb-3 text-bg-dark p-1">Add Dispatch Quantity</div>

                <textarea class="form-control" v-model="message"
                    placeholder="Enter Invoice No. & Delivery Challan No."></textarea>

                <div v-if="ledger.stock.product" class="d-flex flex-wrap gap-2 mb-2">
                    <div class="d-flex w-100" v-for="(color, index) in ledger.stock.product.options" :key="index">
                        <button class="btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            <img :src="color.image" class="rounded me-2" style="height: 60px; object-fit: cover">
                        </button>
                        <div class="flex-fill form-floating overflow-hidden">
                            <input type="number" class="form-control" :id="'colorQuantity_' + color.sid"
                                v-model="color.quantity" @input="handleInput(color)" />
                            <label class="text-capitalize" :for="'colorQuantity_' + color.sid">
                                {{ color.name }} Color
                            </label>
                        </div>
                        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
                            aria-hidden="true">
                            <div class="modal-dialog modal-fullscreen">
                                <div class="modal-content">
                                    <button class="btn h-100" data-bs-dismiss="modal" aria-label="Close">
                                        <img :src="color.image" class="h-100"
                                            style="object-fit: cover; object-position: center;">
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button class="btn btn-warning fw-bold w-100" type="submit">
                    <div class="d-flex justify-content-around">
                        <span>Submit</span>
                        <span>{{ totalColorInputAmount.toLocaleString() }} pcs</span>
                    </div>
                </button>

            </form>

        </div>

        <router-link v-else to="/dashboard">
            Accept the Order First
        </router-link>

        <LedgerInfo :items="ledger.items"/>

        <ChatButton />
        <ChatModel :dataset="ledger" />

    </div>

</template>

<script> 
import axiosInstance from '@/axiosInstance';
// import pusherApi from '@/mixins/pusherApi';
import 'sweetalert2/dist/sweetalert2.min.css';
import Swal from 'sweetalert2';
import LedgerFilters from '@/components/LedgerFilters.vue';
import ChatButton from '@/components/ChatButton.vue';
import ChatModel from '@/components/ChatModel.vue';
import LedgerInfo from '@/components/LedgerInfo.vue';
export default {
    name: 'CatalogLedger',
    // mixins: [pusherApi],
    components: {
        LedgerFilters,
        ChatButton,
        ChatModel,
        LedgerInfo,
    },
    data() {
        return {
            filters: [

            ],
            addReady: false,
            addDispatch: false,
            ledgerSid: '',
            message: '',
            messageDisptach: null,
            entryVisible: true,
        }
    },
    created() {
        this.ledgerSid = this.$route.params.ledger_sid;
        this.$store.dispatch('fetchLedgers', this.ledgerSid)
        this.connectDetail('fetchLedgers', this.ledgerSid)
    },
    computed: {
        ledger() {
            return this.$store.getters.getLedgers
        },
        activeEntry() {
            return this.$store.getters.getActiveEntry
        },
        totalColorInputAmount() {
            if (this.ledger.stock.product) {
                return this.ledger.stock.product.options.reduce((total, color) => total + parseInt(color.quantity || 0), 0);
            }
            return 0;
        },
    },
    methods: {
        showAddReady() {
            this.addDispatch = false;
            this.addReady = true;
        },
        showAddDispatch() {
            this.addReady = false;
            this.addDispatch = true;
        },
        showLedgerSummary() {
            this.addDispatch = false;
            this.addReady = false;
        },
        getTableDataClass(order) {
            switch (order.model) {
                case 'order': return this.filters.order ? 'text-start' : 'text-danger';
                case 'ready': return this.filters.ready ? 'text-center' : 'text-danger';
                case 'demand': return this.filters.demand ? 'text-end' : 'text-danger';
                case 'adjustment': return this.againTry(order);
                default: return 'text-end';
            }
        },
        againTry(order) {
            switch (order.type) {
                case 'order': return this.filters.adjustment ? 'text-start' : 'text-danger';
                case 'ready': return this.filters.adjustment ? 'text-center' : 'text-danger';
                case 'demand': return this.filters.adjustment ? 'text-end' : 'text-danger';
            }
        },
        handleInput(color) {
            if (color && typeof color === 'object') {
                // Ensure the color object and quantity property are defined
                if (color.quantity === undefined) {
                    this.$set(color, 'quantity', 0); // Set a default value if quantity is undefined
                }

                // Ensure the entered value is not less than 0
                color.quantity = Math.max(0, color.quantity);
            }
        },
        getActiveClass(order) {
            return {
                'text-primary': order.status === 'issued',
                'text-warning': order.status === 'cancelled',
                'text-dark': order.status === 'accepted',
            };
        },
        calculateTotal(model, items) {
            if (items && Array.isArray(items)) {
                const filteredItems = items.filter((order) => order.model === model && this.filters[model]);
                return filteredItems.reduce((total, order) => total + order.quantity, 0);
            } else {
                return 0;
            }
        },
        calculateTotalOrder(model, items, status) {
            if (items && Array.isArray(items)) {
                const filteredItems = items.filter((order) => (order.model === model) && this.filters[model] && (order.status === status));
                return filteredItems.reduce((total, order) => total + order.quantity, 0);
            } else {
                return 0;
            }
        },
        formatDate(dateTimeString) {
            const options = {
                weekday: 'short',
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
            this.$store.dispatch('hideActiveEntry', entry);
        },
        postReady() {
            if (this.ledger.stock.product.options && this.totalColorInputAmount > 0) {
                const isQuantityValid = this.totalColorInputAmount <= this.ledger.balance_qty;

                if (!isQuantityValid) {
                    // Show SweetAlert popup for invalid quantity
                    console.log('check', isQuantityValid);
                    this.showQtyError('Oops', 'Quantity must be equal or less than Balance Quantity!');
                    this.ledger.stock.product.options.forEach(color => {
                        color.quantity = 0;
                    });
                    return; // Do not proceed if quantity is invalid
                }

                const token = localStorage.getItem('token');

                const quantities = this.ledger.stock.product.options.map(color => {
                    return this.ledger.stock.product.ranges.map(size => {
                        const key = `${color.sid}_${size.sid}`;
                        const value = color.quantity;
                        return { [key]: value };
                    });
                }).flat();

                const postData = {
                    ledger_sid: this.ledger.sid,
                    message: this.message,
                    quantities: JSON.stringify(quantities),
                };

                // proceed only if quantity total > 0
                axiosInstance.post('readies', postData, {
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
                console.log('Quantity total is 0 or less or ledger is empty. Skipping post request.');
            }
        },
        postDisptach() {
            if (this.ledger.stock.product.options && this.totalColorInputAmount > 0) {
                const isQuantityValid = this.totalColorInputAmount <= this.ledger.dispatchable_qty;

                if (!isQuantityValid) {
                    console.log('check', isQuantityValid);
                    this.showQtyError('Oops', 'Dispatch Quantity must be equal or less than Dispatchable Quantity!');
                    this.ledger.stock.product.options.forEach(color => {
                        color.quantity = 0;
                    });
                    return; // Do not proceed if quantity is invalid
                }

                const token = localStorage.getItem('token');

                const quantities = this.ledger.stock.product.options.map(color => {
                    return this.ledger.stock.product.ranges.map(size => {
                        const key = `${color.sid}_${size.sid}`;
                        const value = color.quantity;
                        return { [key]: value };
                    });
                }).flat();

                const postData = {
                    ledger_sid: this.ledger.sid,
                    message: this.messageDisptach,
                    quantities: JSON.stringify(quantities),
                };

                // proceed only if quantity total > 0
                axiosInstance.post('dispatches', postData, {
                    headers: { "Authorization": `Bearer ${token}` },
                })
                    .then((response) => {
                        console.log('Data posted', response.data);
                        this.messageDisptach = '';
                        // Reset color.quantity for each color
                        this.stock.product.options.forEach(color => {
                            color.quantity = 0;
                        });
                    })
                    .catch((error) => {
                        console.error('Error posting data', error);
                    });
            } else {
                console.log('Quantity total is 0 or less or ledger is empty. Skipping post request.');
            }
        },
        showQtyError(title, message) {
            Swal.fire({
                icon: 'error',
                title: title,
                text: message,
            });
        },
        handleFiltersChange(filters) {
            this.filters = filters;
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

.nav-link.active {
    color: #fff;
    /* background-color: #28CC9E; */
    background-color: #000;
}
</style>