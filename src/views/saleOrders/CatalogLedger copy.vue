<template>
    <TopBrand :stock="stock" />
    <div class="container pb-5">
        <div class="collapse my-2" id="ledgerFilter">
            <div class="card card-body">
                <div class="d-flex gap-2 justify-content-between align-items-center">
                    <div class="mb-3">
                        <label for="startDate" class="form-label">Start Date:</label>
                        <input type="date" v-model="startDate" class="form-control" id="startDate">
                    </div>

                    <div class="mb-3">
                        <label for="endDate" class="form-label">End Date:</label>
                        <input type="date" v-model="endDate" class="form-control" id="endDate">
                    </div>
                </div>
                <div class="">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" v-model="ready" value="" id="ready">
                            <label class="form-check-label" for="ready">
                                Ready
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" v-model="order" value="" id="order">
                            <label class="form-check-label" for="order">
                                Order
                            </label>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" v-model="demand" value="" id="demand">
                            <label class="form-check-label" for="demand">
                                Demand
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" v-model="adjust" value="" id="adjust">
                            <label class="form-check-label" for="adjust">
                                Adjustment
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-for="(entry, index) in filteredLedger" :key="index" class=" my-2">
            <div class="border">
                <div class="p-1 d-flex justify-content-between border-bottom mb-2">
                    <div class="fw-bold text-center" style="min-width: 90px;">Date</div>
                    <div class="fw-bold text-center" style="min-width: 90px;">Order</div>
                    <div class="fw-bold text-center" style="min-width: 90px;">Ready</div>
                    <div class="fw-bold text-center" style="min-width: 90px;">Demand</div>
                </div>

                <div v-for="(order, orderIndex) in entry.LedgerItems" :key="orderIndex" @click="showActiveEntry(order)"
                    class="d-flex justify-content-between">

                    <div class="flex-fill d-flex justify-content-between"
                        v-if="order.model === 'order' && orderCheckboxIsChecked" :class="{ 'd-none': !order }">
                        <div style="min-width: 90px;" class="text-center border-bottom p-1" :class="getActiveClass(order)">
                            {{ formatDate(order.created_at) }}
                        </div>
                        <div style="min-width: 90px;" class="text-center border-bottom p-1" :class="getActiveClass(order)">
                            {{ order.quantity }}
                        </div>
                        <EmptyDiv />
                        <EmptyDiv />
                    </div>
                    <div class="flex-fill d-flex justify-content-between" v-if="order.model === 'ready' && ready"
                        :class="{ 'd-none': !ready }">

                        <div style="min-width: 90px;" class="text-center border-bottom p-1" :class="getActiveClass(order)">
                            {{ formatDate(order.created_at) }}
                        </div>
                        <EmptyDiv />
                        <div style="min-width: 90px;" class="text-center border-bottom p-1" :class="getActiveClass(order)">
                            {{ order.quantity }}
                        </div>
                        <EmptyDiv />
                    </div>
                    <div class="flex-fill d-flex justify-content-between" v-if="order.model === 'demand' && demand"
                        :class="{ 'd-none': !demand }">

                        <div style="min-width: 90px;" class="text-center border-bottom p-1" :class="getActiveClass(order)">
                            {{ formatDate(order.created_at) }}
                        </div>
                        <EmptyDiv />
                        <EmptyDiv />
                        <div style="min-width: 90px;" class="text-center border-bottom p-1" :class="getActiveClass(order)">
                            {{ order.quantity }}
                        </div>
                    </div>

                    <div v-if="order.model === 'adjustment' && adjust" :class="{ 'd-none': !adjust }"
                        class="flex-fill d-flex justify-content-between">
                        <div style="min-width: 90px;" class="text-center border-bottom p-1 text-danger">{{
                            formatDate(order.created_at) }}</div>
                        <div v-if="order.type === 'order'" style="min-width: 90px;"
                            class="text-danger border-bottom p-1 text-center">{{
                                order.quantity }}</div>
                        <EmptyDiv />
                        <div v-if="order.type === 'ready'" style="min-width: 90px;"
                            class="text-danger border-bottom p-1 text-center">{{
                                order.quantity }}</div>
                        <EmptyDiv />
                        <div v-if="order.type === 'demand'" style="min-width: 90px;"
                            class="text-center border-bottom p-1 text-danger">{{
                                order.quantity }}
                        </div>
                    </div>


                </div>
                <div class="d-flex justify-content-between bg-light p-1">
                    <p class="text-center mb-0 fw-bold" style="min-width: 90px;">Total</p>
                    <p class="text-center mb-0" style="min-width: 90px;">{{ calculateTotalOrder('order',
                        entry.LedgerItems, orderCheckboxIsChecked, 'accepted') }}</p>
                    <p class="text-center mb-0" style="min-width: 90px;">{{ calculateTotal('ready', entry.LedgerItems,
                        ready) }}</p>
                    <p class="text-center mb-0" style="min-width: 90px;">{{ calculateTotal('demand', entry.LedgerItems,
                        demand) }}</p>
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
            <div class="top-brand p-2 my-2 d-flex justify-content-between fw-bold">
                <p class="mb-0 fw-bold">Dispatchable Qty</p>
                <p class="mb-0">{{ entry.dispatchable_qty.toLocaleString() }}</p>
            </div>

            <div class="test" v-if="entry.balance_qty > 0">
                <div class="container mt-4">
                    <ul class="nav nav-tabs d-flex justify-content-between">
                        <li class="nav-item w-25 text-center">
                            <a class="nav-link active top-brand text-white" id="tab1" data-bs-toggle="tab"
                                href="#content1">Ready</a>
                        </li>
                        <li class="nav-item w-25 text-center">
                            <a class="nav-link top-brand text-white" id="tab2" data-bs-toggle="tab"
                                href="#content2">Disptach</a>
                        </li>

                    </ul>

                    <div class="tab-content mt-2">
                        <div class="tab-pane fade show active" id="content1">
                            <div class="card card-body text-dark">
                                <form @submit.prevent="postReady()" method="post">
                                    <div class="form-floating mb-3">
                                        <textarea class="form-control as" v-model="message"
                                            id="floatingTextarea"></textarea>
                                        <label for="floatingTextarea">Message</label>
                                    </div>
                                    <div class="my-3">
                                        <div class="d-flex">
                                            <p class="m-0 fs-5 mt-3 mb-2">Colors</p>
                                        </div>
                                        <div v-if="stock.product" class="d-flex flex-wrap gap-2 mb-2">
                                            <div class="d-flex" v-for="(color, index) in stock.product.options"
                                                :key="index">
                                                <img :src="color.image" class="rounded me-2 p-1"
                                                    style="width: 60px; height: 58px; object-fit: cover; border:2px solid black ;">
                                                <div class="form-floating">
                                                    <input type="number" class="form-control"
                                                        :id="'colorQuantity_' + color.sid" v-model="color.quantity"
                                                        @input="handleInput(color)" />
                                                    <label :for="'colorQuantity_' + color.sid">{{ color.name }}
                                                        Quantity</label>
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

                        <div class="tab-pane fade" id="content2">
                            <div class="card card-body text-dark">
                                <form @submit.prevent="postDisptach()" method="post">
                                    <div class="form-floating mb-3">
                                        <textarea class="form-control as" v-model="messageDisptach" id="floatingTextarea"
                                            placeholder="Enter Invoice No. & Delivery Challan"></textarea>
                                        <label for="floatingTextarea">Enter Invoice No. & Delivery Challan</label>
                                    </div>
                                    <div class="my-3">
                                        <div class="d-flex">
                                            <p class="m-0 fs-5 mt-3 mb-2">Colors</p>
                                        </div>
                                        <div v-if="stock.product" class="d-flex flex-wrap gap-2 mb-2">
                                            <div class="d-flex" v-for="(color, index) in stock.product.options"
                                                :key="index">
                                                <img :src="color.image" class="rounded me-2 p-1"
                                                    style="width: 60px; height: 58px; object-fit: cover; border:2px solid black ;">
                                                <div class="form-floating">
                                                    <input type="number" class="form-control"
                                                        :id="'colorQuantity_' + color.sid" v-model="color.quantity" />
                                                    <label :for="'colorQuantity_' + color.sid">{{ color.name }}
                                                        Quantity</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="my-4">
                                            <p class=" fs-5 bill text-center"><span>~ Total Disptach Qty ~</span></p>
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



                <!-- <div class=" d-flex justify-content-center align-items-center my-3 w-100" style="bottom: 60px;">
                    <button class="btn top-brand rounded-pill" data-bs-toggle="collapse" href="#ReadyCollapse" role="button"
                        aria-expanded="false" aria-controls="ReadyCollapse" type="button">
                        Add Ready Qty
                    </button>
                    <button class="btn top-brand rounded-pill mx-2" data-bs-toggle="collapse" href="#disptachCollapse"
                        role="button" aria-expanded="false" aria-controls="disptachCollapse" type="button">
                        Disptach
                    </button>
                </div>
                <div class="collapse" id="ReadyCollapse">
                    <div class="card card-body tab-content" id="myTabContent">
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
                                                v-model="color.quantity" @input="handleInput(color)" />
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


                <div class="collapse" id="disptachCollapse">
                    <div class="card card-body tab-content" id="myTabContent">
                        <form @submit.prevent="postDisptach()" method="post">
                            <div class="mb-3">
                                <label for="floatingTextarea">Message</label>
                                <textarea class="form-control as" v-model="messageDisptach" id="floatingTextarea"
                                    placeholder="Enter Invoice No. & Delivery Challan"></textarea>
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
                                    <p class=" fs-5 bill text-center"><span>~ Total Disptach Qty ~</span></p>
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
                </div> -->
            </div>
            <p class="fw-bold text-center" v-else>Accept the Order First</p>
        </div>

        <ActiveEntryDetails :activeEntry="activeEntry" :totalQty="totalQty" />

        <CommonChat :dataset="ledger" />

    </div>
</template>

<script>
import axios from 'axios';
import pusherApi from '@/mixins/pusherApi';
import 'sweetalert2/dist/sweetalert2.min.css';
import Swal from 'sweetalert2';
import CommonChat from '@/components/CommonChat';
import EmptyDiv from '@/components/EmptyDiv.vue';
import TopBrand from '@/components/TopBrand.vue';
import ActiveEntryDetails from '@/components/ActiveEntryDetails.vue';
export default {
    name: 'CatalogLedger',
    mixins: [pusherApi],
    components: {
        CommonChat,
        EmptyDiv,
        TopBrand,
        ActiveEntryDetails,
    },
    data() {
        const today = new Date();
        const nineDaysAgo = new Date();
        nineDaysAgo.setDate(today.getDate() - 9);

        const oneDayAfter = new Date();
        oneDayAfter.setDate(today.getDate() + 1);
        return {
            catalogId: '',
            message: 'First Message',
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
        this.catalogId = this.$route.params.catalogId;
        this.$store.dispatch('fetchStock', this.catalogId)

        this.$store.dispatch('fetchLedgers', this.catalogId)
        this.connectDetail('fetchLedgers', this.catalogId)
    },
    computed: {
        orderCheckboxIsChecked() {
            return this.order;
        },
        filteredLedger() {
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
            if (this.stock.product) {
                return this.stock.product.options.reduce((total, color) => total + parseInt(color.quantity || 0), 0);
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
            return { 'text-center': true, 'text-primary': order.status === 'issued', 'text-warning': order.status === 'cancelled', 'text-dark': order.status === 'accepted', 'd-none': !order };
        },
        calculateTotal(model, items, isChecked) {
            const filteredItems = items.filter((order) => order.model === model && isChecked);
            return filteredItems.reduce((total, order) => total + order.quantity, 0);
        },
        calculateTotalOrder(model, items, isChecked, status) {
            const filteredItems = items.filter((order) => order.model === model && isChecked && order.status === status);
            return filteredItems.reduce((total, order) => total + order.quantity, 0);
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
            this.$store.dispatch('hideActiveEntry', entry);
        },
        postReady() {
            if (this.ledger && this.ledger.length > 0 && this.stock.product.options && this.totalColorInputAmount > 0) {
                const isQuantityValid = this.totalColorInputAmount <= this.ledger[0].balance_qty;

                if (!isQuantityValid) {
                    // Show SweetAlert popup for invalid quantity
                    console.log('check', isQuantityValid);
                    this.showQtyError('Oops', 'Quantity must be equal or less than Balance Quantity!');
                    this.stock.product.options.forEach(color => {
                        color.quantity = 0;
                    });
                    return; // Do not proceed if quantity is invalid
                }

                const token = localStorage.getItem('token');

                const quantities = this.stock.product.options.map(color => {
                    return this.stock.product.ranges.map(size => {
                        const key = `${color.sid}_${size.sid}`;
                        const value = color.quantity;
                        return { [key]: value };
                    });
                }).flat();

                const postData = {
                    ledger_sid: this.ledger[0].sid,
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
            if (this.ledger && this.ledger.length > 0 && this.stock.product.options && this.totalColorInputAmount > 0) {
                const isQuantityValid = this.totalColorInputAmount <= this.ledger[0].dispatchable_qty;

                if (!isQuantityValid) {
                    console.log('check', isQuantityValid);
                    this.showQtyError('Oops', 'Dispatch Quantity must be equal or less than Dispatchable Quantity!');
                    this.stock.product.options.forEach(color => {
                        color.quantity = 0;
                    });
                    return; // Do not proceed if quantity is invalid
                }

                const token = localStorage.getItem('token');

                const quantities = this.stock.product.options.map(color => {
                    return this.stock.product.ranges.map(size => {
                        const key = `${color.sid}_${size.sid}`;
                        const value = color.quantity;
                        return { [key]: value };
                    });
                }).flat();

                const postData = {
                    ledger_sid: this.ledger[0].sid,
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