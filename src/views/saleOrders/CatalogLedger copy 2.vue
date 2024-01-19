<template>
    <!-- <TopBrand :stock="stock" /> -->
    <div class="pb-5">

        <!-- <TopBrandExtra /> -->

        <div class="text-center fs-5 top-brand p-2">Ledger Summary</div>

        <div v-if="!addReady && !addDispatch" class="border">
            <table class="table table-striped table-borderless mb-0">
                <thead>
                    <tr class="table-dark">
                        <th class="ps-3 fw-bold text-start">Date</th>
                        <th class="fw-bold text-start">Order</th>
                        <th class="fw-bold text-center">Ready</th>
                        <th class="pe-3 fw-bold text-end">Demand</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(order, orderIndex) in ledger.LedgerItems" :key="orderIndex" @click="showActiveEntry(order)">
                        <td class="ps-3 text-start">{{ formatDate(order.created_at) }}</td>
                        <td colspan="3" class="pe-3" :class="[getTableDataClass(order), getActiveClass(order)]">
                            {{ order.quantity.toLocaleString() }}
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr class="table-dark">
                        <td class="ps-3 text-start fw-bold" style="min-width: 90px;">Total</td>
                        <td class="text-start" style="min-width: 90px;">
                            {{ calculateTotalOrder('order', ledger.LedgerItems, orderCheckboxIsChecked,
                                'accepted').toLocaleString() }}
                        </td>
                        <td class="text-center" style="min-width: 90px;">
                            {{ calculateTotal('ready', ledger.LedgerItems, ready).toLocaleString() }}
                        </td>
                        <td class="pe-3 text-end" style="min-width: 90px;">
                            {{ calculateTotal('demand', ledger.LedgerItems, demand).toLocaleString() }}
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
                    <td class="pe-3 text-end">{{ ledger.demandable_qty.toLocaleString() }}</td>
                </tr>
                <tr>
                    <td class="ps-3 fw-bold">
                        Balance Qty
                        <button class="btn btn-sm btn-outline-dark ms-3" @click="showAddReady">
                            Add Ready Stock
                        </button>
                    </td>
                    <td class="pe-3 text-end">{{ ledger.balance_qty.toLocaleString() }}</td>
                </tr>
                <tr>
                    <td class="ps-3 fw-bold">
                        Dispatchable Qty
                        <button class="btn btn-sm btn-outline-dark ms-3" @click="showAddDispatch">
                            Dispatch Stock
                        </button>
                    </td>
                    <td class="pe-3 text-end">{{ ledger.dispatchable_qty.toLocaleString() }}</td>
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

        <router-link v-else to="-1">
            Accept the Order First
        </router-link>

        <ActiveEntryDetails :activeEntry="activeEntry" :totalQty="totalQty" />

        <CommonChat :dataset="ledger" />

    </div>
</template>

<script>
import axios from 'axios';
import pusherApi from '@/mixins/pusherApi';
import 'sweetalert2/dist/sweetalert2.min.css';
import Swal from 'sweetalert2';
// import EmptyDiv from '@/components/EmptyDiv.vue';
// import TopBrand from '@/components/TopBrand.vue';
import CommonChat from '@/components/CommonChat';
import ActiveEntryDetails from '@/components/ActiveEntryDetails.vue';
export default {
    name: 'CatalogLedger',
    mixins: [pusherApi],
    components: {
        // EmptyDiv,
        // TopBrand,
        CommonChat,
        ActiveEntryDetails,
    },
    data() {
        const today = new Date();
        const nineDaysAgo = new Date();
        nineDaysAgo.setDate(today.getDate() - 9);

        const oneDayAfter = new Date();
        oneDayAfter.setDate(today.getDate() + 1);
        return {
            addReady: false,
            addDispatch: false,
            ledgerSid: '',
            message: '',
            messageDisptach: null,
            ready: true,
            order: true,
            demand: true,
            adjust: true,
            startDate: nineDaysAgo.toISOString().split('T')[0], // Format as 'YYYY-MM-DD'
            endDate: oneDayAfter.toISOString().split('T')[0], // Format as 'YYYY-MM-DD'
            entryVisible: true,
        }
    },
    created() {
        this.ledgerSid = this.$route.params.ledger_sid;
        // this.$store.dispatch('fetchStock', this.ledgerSid)

        this.$store.dispatch('fetchLedgers', this.ledgerSid)
        this.connectDetail('fetchLedgers', this.ledgerSid)
    },
    computed: {
        orderCheckboxIsChecked() {
            return this.order;
        },
        filteredEntries() {
            if (!this.startDate || !this.endDate) {
                console.log('No date range specified. Returning original ledger.');
                return this.ledger;
            }
            // Convert start and end dates to timestamp for comparison
            const startTimestamp = new Date(this.startDate).getTime();
            const endTimestamp = new Date(this.endDate).getTime();

            // Filter entries based on the date range
            const filteredEntries = this.ledger.filter((entry) => {
                return entry.LedgerItems.some((order) => {
                    const orderTimestamp = new Date(order.created_at).getTime();
                    const isInDateRange = orderTimestamp >= startTimestamp && orderTimestamp <= endTimestamp;

                    if (!isInDateRange) {
                        console.log('Excluding order:', order);
                    }

                    return isInDateRange;
                });
            });

            console.log('Filtered ledger:', filteredEntries);

            return filteredEntries;
        },
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
            if (this.ledger.stock.product) {
                return this.ledger.stock.product.options.reduce((total, color) => total + parseInt(color.quantity || 0), 0);
            }
            return 0;
        },
        totalQty() {
            if (this.activeEntry && this.activeEntry.items) {
                return this.activeEntry.items.reduce((total, item) => total + item.quantity, 0);
            } else {
                // Return a default value or handle the case when activeEntry or items is null
                return 0;
            }
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
                case 'order': return this.orderCheckboxIsChecked ? 'text-start' : 'text-danger';
                case 'ready': return this.ready ? 'text-center' : 'text-danger';
                case 'demand': return this.demand ? 'text-end' : 'text-danger';
                case 'adjustment': return this.againTry(order);
                default: return 'text-end';
            }
        },
        againTry(order) {
            switch (order.type) {
                case 'order': return this.adjust ? 'text-start' : 'text-danger';
                case 'ready': return this.adjust ? 'text-center' : 'text-danger';
                case 'demand': return this.adjust ? 'text-end' : 'text-danger';
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
        calculateTotal(model, items, isChecked) {
            const filteredItems = items.filter((order) => order.model === model && isChecked);
            return filteredItems.reduce((total, order) => total + order.quantity, 0);
        },
        // calculateTotalOrder(model, items, isChecked, status) {
        //     if (items && Array.isArray(items)) {
        //         return items
        //             .filter(order => order.model === model && isChecked && order.status === status)
        //             .reduce((total, order) => total + order.quantity, 0);
        //     } else {
        //         // Handle the case when items is undefined or not an array
        //         console.error('Invalid or undefined items array in calculateTotalOrder');
        //         return 0; // or any default value based on your application logic
        //     }
        // },

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
                axios.post('http://192.168.1.183:8000/api/readies', postData, {
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
                axios.post('http://192.168.1.183:8000/api/dispatches', postData, {
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