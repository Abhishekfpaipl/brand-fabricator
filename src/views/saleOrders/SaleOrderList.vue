<template>
    <div style="padding-bottom: 80px;">
        <p class="p-2 text-center mb-0 bg-light bill border-bottom"><span class="fs-5 ">~ Ready To Send ~</span></p>
        <div class="container">
            <div class="d-flex align-items-center justify-content-between gap-3">

                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        Info <i class="bi bi-info-circle"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li>
                            <div class="dropdown-item d-flex align-items-center gap-1 my-2">
                                <div class="rounded-circle bg-danger" style="height:20px;width: 20px;"></div>
                                <div class="">New Order</div>
                            </div>
                        </li>
                        <li>
                            <div class="dropdown-item d-flex align-items-center gap-1 my-2">
                                <div class="rounded-circle bg-success" style="height:20px;width: 20px;"></div>
                                <div class="">New Ready</div>
                            </div>
                        </li>
                        <li>
                            <div class="dropdown-item d-flex align-items-center gap-1 my-2">
                                <div class="rounded-circle bg-primary" style="height:20px;width: 20px;"></div>
                                <div class="">New Demand</div>
                            </div>
                        </li>
                        <li>
                            <div class="dropdown-item d-flex gap-1">
                                <p class="fw-bold mb-1">R</p>
                                <p class="mb-1">Needs To Be Ready</p>
                            </div>
                            <div class="dropdown-item d-flex gap-1">
                                <p class="fw-bold mb-1">D</p>
                                <p class="mb-1">Demand Pending</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <button class="btn top-brand my-2" @click="sortStock">
                    {{ showHighStock ? 'Show Old Catalogs' : 'Show New Catalogs' }}
                </button>
            </div>

            <div class="collapse" id="infoData">
                <div class="card card-body">
                    <div class=" d-flex justify-content-between">
                        <div class="">


                        </div>
                        <div class="">
                            <div class="d-flex gap-1">
                                <p class="fw-bold mb-1">R</p>
                                <p class="mb-1">Needs To Be Ready</p>
                            </div>
                            <div class="d-flex gap-1">
                                <p class="fw-bold mb-1">D</p>
                                <p class="mb-1">Demand Pending</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-2 my-1">
                <div class="col" v-for="(catalog, index) in filteredStocks" :key="index">
                    <div class="card border rounded-0">
                        <router-link :to="'/saleOrder/catalog-ledger/' + catalog.ledger_sid"
                            class="text-dark text-decoration-none">
                            <div :id="'productImages' + index" class="carousel slide">
                                <div class="carousel-inner position-relative">
                                    <div :id="'cardCarousel' + imgIndex" class="carousel-item"
                                        :class="{ active: imgIndex === 0 }"
                                        v-for="(image, imgIndex) in catalog.product.options" :key="imgIndex">
                                        <img :src="image.image" class="card-img-top rounded-0" alt=""
                                            style="height:200px;  object-fit: fill;">
                                    </div>
                                    <div v-if="catalog.stock" class="position-absolute rounded-circle"
                                        :class="{ 'bg-danger': catalog.last_activity === 'order', 'bg-success': catalog.last_activity === 'ready', 'bg-primary': catalog.last_activity === 'demand' }"
                                        style="height:20px;width: 20px; right: 5px; top: 5px;"></div>
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
                                <p class="mb-0 truncate">{{ catalog.product.name }}</p>
                                <div class="d-flex justify-content-between">
                                    <p class="mb-0"><small>R</small> {{ catalog.ready_balance }}</p>
                                    <p class="mb-0"><small>D</small> {{ catalog.total_demands }}</p>
                                </div>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import pusherApi from '@/mixins/pusherApi';
import sweetAlert from '@/mixins/sweetAlert';
export default {
    name: "FinishingPage",
    mixins: [
        // pusherApi, 
        sweetAlert],
    data() {
        return {
            showHighStock: true
        };
    },
    created() {
        this.connect('fetchStocks')
        this.$store.dispatch('fetchStocks')
    },
    computed: {
        stocks() {
            return this.$store.getters.getStocks
        },
        filteredStocks() {
            if (this.showHighStock) {
                return this.stocks.filter(catalog => catalog.stock > 0)
            } else {
                return this.stocks.filter(catalog => catalog.stock === 0)
            }
        }
    },
    methods: {
        sortStock() {
            this.showHighStock = !this.showHighStock
        }
    }
}
</script> 
<style>
.truncate {
    font-size: 13px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
