<template>
    <div style="padding-bottom: 80px;">
        <!-- <div v-if="Object.keys(pos).length"> -->
        <p class="p-2 text-center mb-0 bg-light bill border-bottom"><span class="fs-5 ">~ Ready To Send ~</span></p>
        <!-- <div v-if="Object.keys(readyPo).length"> -->
        <!-- <div v-for="(po, poIndex) in  pOrders" :key="poIndex" class="container">
            <div class="px-3 py-2 border-bottom">
                <router-link class="text-decoration-none text-dark" to="/catalog-ledger">
                    <div class="d-flex align-items-center">
                        <img :src="po.product.image" class="" style="height:60px;width:60px; object-fit: fill;">
                        <div class="d-flex flex-fill flex-column ms-3">
                            <span class="fw-bold">#{{ po.sid }}</span>
                            <span>Order Qty : {{ po.quantity }}</span>
                        </div>
                    </div>
                </router-link>
            </div>

        </div> -->


        <div class="container">
            <!-- <div class="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3 my-1">
                <div class="col" v-for="(po, index) in stocks" :key="index">
                    <div class="card rounded-0">
                        <router-link :to="'/catalog-page/' + po.id" class="text-decoration-none text-dark">
                            <img :src="po.product.image" class="card-img-top rounded-0" alt="" style="min-height:100px;">
                        </router-link>
                        <div class="card-footer">
                            <div v-for="(color, colorIndex) in po.product.options" :key="colorIndex" class=" ">
                                <div class="d-flex">
                                    <img :src="color.image" style="height: 50px; width: 50px;">
                                </div>
                            </div>

                            <span v-if="po.product" class="fw-bold">{{ po.product.name }}</span>
                        </div>
                    </div>
                </div>
            </div> -->
            <div class="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-2 my-1">
                <div class="col" v-for="(catalog, index) in stocks" :key="index">
                    <div class="card border rounded-0">
                        <router-link :to="'/saleOrder/catalog-ledger/' + catalog.product.sid"
                            class="text-dark text-decoration-none">
                            <div :id="'productImages' + index" class="carousel slide">
                                <div class="carousel-inner">
                                    <div :id="'cardCarousel' + imgIndex" class="carousel-item"
                                        :class="{ active: imgIndex === 0 }"
                                        v-for="(image, imgIndex) in catalog.product.options" :key="imgIndex">
                                        <img :src="image.image" class="card-img-top rounded-0" alt=""
                                            style="height:200px;  object-fit: fill;">
                                    </div>
                                </div>
                                <div class="d-flex my-1 px-1" id="scroll" style="overflow-x: auto;">
                                    <button type="button" class="rounded-circle p-0 border me-1"
                                        :data-bs-target="'#productImages' + index" :data-bs-slide-to="imgIndex"
                                        :class="{ active: imgIndex === 0 }" :aria-current="imgIndex === 0 ? true : false"
                                        v-for="(image, imgIndex) in catalog.product.options" :key="imgIndex">
                                        <img :src="image.image" class="" alt=""
                                            style="width: 35px; height: 35px; object-fit: fill;">
                                    </button>
                                </div>
                            </div>
                            <div class="card-footer px-1">
                                <p class="mb-0">{{ catalog.product.name }}</p>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>




        <!-- <div v-for="(po, poIndex) in  stocks" :key="poIndex" class="container">
            <div class="px-3 py-2">
                <router-link class="text-decoration-none text-dark" to="/catalog-ledger">
                    <div class="d-flex flex-column justify-content-center">
                        <img :src="po.product.image" class="" style="height:160px;width:160px; object-fit: fill;">
                        <div class="d-flex flex-fill flex-column ms-3">
                            <span v-if="po.product" class="fw-bold">#{{ po.product.name }}</span>
                            <span>Order Qty : {{ po.quantity }}</span>
                        </div>
                    </div>
                </router-link>
            </div>

        </div> -->



        <!-- </div> -->
        <!-- <no-order v-else /> -->
        <!-- 
            <p class="p-2 text-center mb-0 bg-light bill border-bottom"><span class="fs-5 ">~ Requested To Send ~</span></p>
            <div v-if="Object.keys(requestedPo).length">
                <div v-for="(po, poIndex) in requestedPo" :key="poIndex">
                    <div v-if="po.status === 'requested'" class="px-3 py-2 border-bottom">
                        <div class="d-flex align-items-center">
                            <router-link class="flex-fill d-flex text-decoration-none text-dark"
                                :to="'/saleOrder/preview-page/' + po.sid">
                                <img v-if="po.product" :src="po.product.colors[0].image" class="rounded-circle"
                                    style="height:60px;width:60px; object-fit: fill;">
                                <div class="d-flex flex-fill flex-column ms-3">
                                    <span class="fw-bold">#{{ po.sid }}</span>
                                    <span>Order Qty : {{ po.quantity }}</span>
                                </div>
                            </router-link>
                            <button v-if="!hideButton" class="btn m-3 top-brand" @click="updateStatus(po.sid)"
                                :disabled="buttonDisabled">Disptach</button>
                        </div>
                    </div>
                </div>
            </div>
            <no-order v-else />

            <p class="p-2 text-center mb-0 bg-light bill border-bottom"><span class="fs-5 ">~ Completed Jobs ~</span></p>
            <div v-if="Object.keys(completedPo).length">
                <div v-for="(po, poIndex) in completedPo" :key="poIndex">
                    <div v-if="po.status === 'completed'" class="px-3 py-2 border-bottom">
                        <router-link class="text-decoration-none text-dark" :to="'/saleOrder/detail-page/' + po.sid">
                            <div class="d-flex align-items-center">
                                <img v-if="po.product" :src="po.product.colors[0].image" class="rounded-circle"
                                    style="height:60px;width:60px; object-fit: fill;">
                                <div class="d-flex flex-fill flex-column ms-3">
                                    <span class="fw-bold">#{{ po.sid }}</span>
                                    <span>Order Qty : {{ po.quantity }}</span>
                                </div>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
            <no-order v-else />

            <p class="p-2 text-center mb-0 bg-light bill border-bottom"><span class="fs-5">~ Rejections ~</span></p>
            <div v-if="Object.keys(rejectedPo).length">
                <div v-for="(po, poIndex) in rejectedPo" :key="poIndex">
                    <div v-if="po.status === 'rejected'" class="px-3 py-2 border-bottom ">
                        <router-link class="text-decoration-none text-dark" :to="'/saleOrder/preview-page/' + po.sid">
                            <div class="d-flex align-items-center">
                                <img v-if="po.product" :src="po.product.colors[0].image" class="rounded-circle"
                                    style="height:60px;width:60px; object-fit: fill;">
                                <div class="d-flex flex-fill flex-column ms-3">
                                    <span class="fw-bold">#{{ po.sid }}</span>
                                    <span>Order Qty : {{ po.quantity }}</span>
                                </div>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div> -->
        <!-- <no-order v-else /> -->
        <!-- </div> -->
        <!-- <no-order v-else /> -->
    </div>
</template>

<script>
import axios from 'axios';
// import NoOrder from '@/components/NoOrder.vue';
import pusherApi from '@/mixins/pusherApi';
import sweetAlert from '@/mixins/sweetAlert';
export default {
    name: "FinishingPage",
    mixins: [pusherApi, sweetAlert],
    data() {
        return {
            statuses: ["requested", "dispatched", "completed"],
            buttonDisabled: false,
            hideButton: false,
        };
    },
    // components: { NoOrder },
    computed: {
        stocks() {
            return this.$store.getters.getStocks
        },
        pOrders() {
            return this.$store.getters.getpurchaseOrders
        },
        pos() {
            return this.$store.getters.getPurchases
        },
        readyPo() {
            return this.pos.filter(po => po.status === 'ready')
        },
        requestedPo() {
            return this.pos.filter(po => po.status === 'requested')
        },
        completedPo() {
            return this.pos.filter(po => po.status === 'completed')
        },
        rejectedPo() {
            return this.pos.filter(po => po.status === 'rejected')
        },
    },
    created() {
        // this.connect('fetchPurchases')
        this.connect('fetchpurchaseOrders')
        // this.$store.dispatch('fetchpurchaseOrders')
        this.$store.dispatch('fetchStocks')
    },
    methods: {
        showSuccessAlert() {
            this.showSweetAlert('Yay', 'Order disptached & completed');
        },
        showErrorAlert() {
            this.showSweetError('Oops', 'Something went wrong');
        },
        updateStatus(poId) {
            this.buttonDisabled =
                axios.put('http://192.168.1.133:8001/api/purchases/' + poId, {
                    status: 'next'
                }).then(response => {
                    if (response.data.status === 'ok') {
                        this.showSuccessAlert()
                    } else if (response.data.status === 'error') {
                        this.showErrorAlert()
                        alert(response.data.message)
                    } else {
                        this.showErrorAlert()
                        alert('Something went wrong! Please try again')
                    }
                }).catch((error) => {
                    console.error('error creating purchase', error)
                    this.showErrorAlert()
                })
                    .finally(() => {
                        this.buttonDisabled = false;
                        // this.hideButton = true
                    });
        }
    },
}
</script>
<style>
/* .bill {
    overflow: hidden;
    text-align: center;
}

.bill>span {
    position: relative;
    display: inline-block;
    color: #25C297;
}

.bill>span:before,
.bill>span:after {
    content: '';
    position: absolute;
    top: 50%;
    border-bottom: 2px solid #25C297;
    width: 591px;
    margin: 0 20px;
}

.bill>span:before {
    right: 100%;
}

.bill>span:after {
    left: 100%;
} */
</style>
