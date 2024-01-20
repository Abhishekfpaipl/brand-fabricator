<template>
    <LedgerFilters :stock="ledger.stock" :readyDone="ledger.total_ready" :dispatchDone="ledger.total_dispatch"
        @ledger-filters-changed="handleFiltersChange" />

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
                <tbody v-if="ledger.items">
                    <tr v-for="(ledgerItem, ledgerItemIndex) in filteredLedgerItems" :key="ledgerItemIndex"
                        v-show="shouldShow(ledgerItem)" data-bs-toggle="offcanvas" data-bs-target="#ledgerInfoModal"
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
                <tfoot v-if="ledger.items">
                    <tr class="table-dark">
                        <td class="ps-3 text-start fw-bold" style="min-width: 90px;">Total</td>
                        <td class="text-start" style="min-width: 90px;">
                            {{ calculateTotal('order').toLocaleString() }}
                        </td>
                        <td class="text-center" style="min-width: 90px;">
                            {{ calculateTotal('ready').toLocaleString() }}
                        </td>
                        <td class="pe-3 text-end" style="min-width: 90px;">
                            {{ calculateTotal('demand').toLocaleString() }}
                        </td>
                    </tr>
                </tfoot>
            </table>
            <nav v-if="ledger.items" aria-label="Page navigation">
                <ul class="pagination">
                    <li class="page-item flex-fill" v-for="link in ledger.items.links" :key="link.label"
                        :class="{ 'disabled': !link.url }">
                        <a class="page-link text-center text-dark" href="#" v-if="link.label.includes('Previous')"
                            @click="loadLedgers(link.url, false)">
                            <i class="bi bi-chevron-left"></i>
                        </a>
                        <a class="page-link text-center text-dark" href="#" v-else-if="link.label.includes('Next')"
                            @click="loadLedgers(link.url, false)">
                            <i class="bi bi-chevron-right"></i>
                        </a>
                        <a href="#" :class="{
                            'text-primary fw-bold': this.activePage == link.label,
                            'text-dark': this.activePage != link.label
                        }" class="page-link text-center" v-else @click="loadLedgers(link.url, false)">
                            {{ link.label }}
                        </a>
                    </li>
                </ul>
            </nav>
        </div>

        <table class="table table-striped table-borderless">
            <tbody>
                <tr>
                    <td class="ps-3 fw-bold">
                        Ready Pending
                        <button class="btn btn-sm btn-outline-dark ms-3" @click="showAddReady">
                            Add Ready Stock
                        </button>
                    </td>
                    <td class="pe-3 text-end">{{ ledger.readyable_qty ? ledger.readyable_qty.toLocaleString() : 0 }} pcs
                    </td>
                </tr>
                <tr>
                    <td class="ps-3 fw-bold text-capitalize">
                        Yet to Dispatch
                        <button class="btn btn-sm btn-outline-dark ms-3" @click="showAddDispatch">
                            Dispatch Stock
                        </button>
                    </td>
                    <td class="pe-3 text-end">{{ ledger.dispatchable_qty ? ledger.dispatchable_qty.toLocaleString() : 0 }}
                        pcs
                    </td>
                </tr>
                <tr>
                    <td class="ps-3 fw-bold">
                        Balance Qty
                        <button class="btn btn-sm btn-outline-dark ms-3" @click="showLedgerSummary">
                            Show Ledger
                        </button>
                    </td>
                    <td class="pe-3 text-end">{{ ledger.balance_qty ? ledger.balance_qty.toLocaleString() : 0 }} pcs
                    </td>

                </tr>
            </tbody>
        </table>

        <div v-if="ledger.balance_qty">
            <form class="px-3" v-if="addReady" @submit.prevent="postReady()" method="post">
                <LedgerReadyDispatchForm :product="ledger.stock.product" :adjustmentCheck=true title="Add Ready Quantity"
                    placeholder="Enter your message ..." @formData="handleFormData" />
                <button class="btn btn-warning fw-bold w-100" type="submit"> Submit </button>
            </form>

            <form class="px-3" v-if="addDispatch" @submit.prevent="postDispatch()" method="post">
                <LedgerReadyDispatchForm :product="ledger.stock.product" :adjustmentCheck=false
                    title="Add Dispatch Quantity" placeholder="Enter Invoice No. & Delivery Challan No."
                    @formData="handleFormData" />
                <button class="btn btn-warning fw-bold w-100" type="submit">Submit</button>
            </form>
        </div>

        <router-link v-else class="btn btn-warning w-100" to="/new-orders">
            Accept the Order First
        </router-link>

        <LedgerInfo :items="ledger.items" />

        <ChatButton />

    </div>
</template>

<script>
import 'sweetalert2/dist/sweetalert2.min.css';
import Swal from 'sweetalert2';
import LedgerFilters from '@/components/LedgerFilters.vue';
import ChatButton from '@/components/ChatButton.vue';
import LedgerInfo from '@/components/LedgerInfo.vue';
import LedgerReadyDispatchForm from '@/components/forms/LedgerReadyDispatch.vue'
export default {
    name: 'RunningOrderLedger',
    components: {
        LedgerFilters,
        ChatButton,
        LedgerInfo,
        LedgerReadyDispatchForm,
    },
    data() {
        return {
            filters: [],
            formData: [],
            addReady: false,
            addDispatch: false,
            total: 0,
            activePage: 1,
        }
    },
    created() {
        this.loadLedgers('', true)
    },
    computed: {
        ledger() {
            return this.$store.getters.getLedgers
        },
        filteredLedgerItems() {
            const startDate = new Date(this.filters.startDate);
            const endDate = new Date(this.filters.endDate);
            return this.ledger.items.data.filter(item => {
                const createdAt = new Date(item.created_at);
                return createdAt >= startDate && createdAt <= endDate;
            });
        },
        activeEntry() {
            return this.$store.getters.getActiveEntry
        },
    },
    methods: {
        loadLedgers(pageurl, firstload) {
            console.log(pageurl)
            this.activePage = 1;
            if (!firstload) {
                this.activePage = pageurl.split('=')[1];
            }
            this.$store.dispatch('fetchStockLedger', {
                ledger_sid: this.$route.params.ledger_sid, page: this.activePage
            })
        },
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
        shouldShow(ledgerItem) {
            let result = this.filters[ledgerItem.model];
            if (ledgerItem.model === 'adjustment') {
                return  result && this.filters[ledgerItem.type];
            } else {
                return result;
            }
        },
        calculateTotal(model) {
            // Check for the necessary conditions using optional chaining
            if (!this.ledger?.items?.data || !Array.isArray(this.ledger.items.data) || !this.filters[model]) {
                return 0;
            }

            // Use reduce directly without a separate filter step
            return this.ledger.items.data.reduce((total, item) => {
                // Add item quantity if the item matches the model or is an adjustment of the same type
                if (item.model === model) {
                    return total + item.quantity;
                } else if(item.model === 'adjustment' && item.type === model && this.filters['adjustment']) {
                    return total - item.quantity;
                }
                return total; // Otherwise, keep the total unchanged
            }, 0);
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
        postReady() {
            if (this.ledger.stock.product.options && this.total > 0) {
                const quantities = this.ledger.stock.product.options.map((color, index) => {
                    return this.ledger.stock.product.ranges.map(size => {
                        const key = `${color.sid}_${size.sid}`;
                        const value = this.formData.quantity[index];
                        return { [key]: value };
                    });
                }).flat();
                if (this.formData.adjustment) {
                    const adjustmentData = {
                        ledger_sid: this.ledger.sid,
                        content: this.formData.content,
                        type: 'ready',
                        quantities: JSON.stringify(quantities),
                    };
                    this.$store.dispatch('postAdjustment', adjustmentData)
                } else {
                    const isQuantityValid = this.total <= this.ledger.readyable_qty;
                    if (!isQuantityValid) {
                        console.log('check', isQuantityValid);
                        this.showQtyError('Oops', 'Quantity must be equal or less than Readyable Quantity!');
                        this.ledger.stock.product.options.forEach((color, index) => {
                            console.log(color)
                            this.testData.quantity[index] = 0;
                        });
                        return;
                    }
                    const orderData = {
                        ledger_sid: this.ledger.sid,
                        content: this.formData.content,
                        quantities: JSON.stringify(quantities),
                    };
                    this.$store.dispatch('postReady', orderData).then(() => {
                        this.formData.content = ''
                    })
                }
            } else {
                console.log('Quantity total is 0 or less or ledger is empty. Skipping post request.');
            }
        },
        postDispatch() {
            if (this.ledger.stock.product.options && this.total > 0) {
                const isQuantityValid = this.total <= this.ledger.dispatchable_qty;

                if (!isQuantityValid) {
                    console.log('check', isQuantityValid);
                    this.showQtyError('Oops', 'Dispatch Quantity must be equal or less than Dispatchable Quantity!');
                    this.ledger.stock.product.options.forEach((color, index) => {
                        console.log(color)
                        this.this.formData.quantity[index] = 0;
                    });
                    return; // Do not proceed if quantity is invalid
                }


                const quantities = this.ledger.stock.product.options.map((color, index) => {
                    return this.ledger.stock.product.ranges.map(size => {
                        const key = `${color.sid}_${size.sid}`;
                        const value = this.formData.quantity[index];
                        return { [key]: value };
                    });
                }).flat();

                const postData = {
                    ledger_sid: this.ledger.sid,
                    content: this.formData.content,
                    quantities: JSON.stringify(quantities),
                };

                this.$store.dispatch('postDispatch', postData)
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
        },
        handleFormData(data) {
            console.log('handling', data)
            this.formData = data.data;
            this.total = data.total;
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