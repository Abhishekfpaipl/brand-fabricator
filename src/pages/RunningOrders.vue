<template>
    <div class="w-100" style="overflow-x: hidden;">
        <RunningFilter :title="filteredStocks.length + ' / ' + stocks.length" @order-filter-changed="handleFiltersChange" />
        <div class="row row-cols-1 row-cols-md-3 row-cols-xl-4 g-2">
            <div class="col" v-for="(catalog, index) in filteredStocks" :key="index">
                <router-link :to="'/running-orders/' + catalog.ledger_sid" class="text-dark text-decoration-none">
                    <div :id="'productImages' + index" class="carousel slide">
                        <div class="carousel-inner position-relative">
                            <div :id="'cardCarousel' + imgIndex" class="carousel-item" :class="{ active: imgIndex === 0 }"
                                v-for="(image, imgIndex) in catalog.product.options" :key="imgIndex">
                                <img :src="image.preview" class="w-100" style="object-fit: cover;">
                            </div>
                            <div v-if="catalog.balance_qty" style="height:1rem; width: 1rem;"
                                class="position-absolute end-0 rounded-circle m-2" :class="{
                                    'bg-danger': catalog.last_activity === 'Order' && catalog.balance_qty,
                                    'bg-success': catalog.last_activity === 'Ready' && catalog.balance_qty,
                                    'bg-primary': catalog.last_activity === 'Demand' && catalog.balance_qty
                                }">
                            </div>
                        </div>
                        <div class="d-flex my-1 px-1" id="scroll" style="overflow-x: auto;">
                            <button type="button" class="p-0 border me-1 overflow-hidden" style="width: 50px; height: 50px;"
                                :data-bs-target="'#productImages' + index" :data-bs-slide-to="imgIndex"
                                :class="{ active: imgIndex === 0 }" :aria-current="imgIndex === 0 ? true : false"
                                v-for="(image, imgIndex) in catalog.product.options" :key="imgIndex">
                                <img :src="image.image" class="w-100 h-100" style="object-fit: cover; scale: 2; ">
                            </button>
                        </div>
                    </div>
                    <div class="card-footer p-1">
                        <span class="fw-bold">{{ catalog.product_code }}</span>
                        <div class="d-flex justify-content-between">
                            <p class="mb-0"><small>B</small> {{ catalog.balance_qty }}</p>
                            <p class="mb-0"><small>R</small> {{ catalog.readyable_qty }}</p>
                            <p class="mb-0"><small>D</small> {{ catalog.dispatchable_qty }}</p>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import axiosInstance from '@/axiosInstance';
import RunningFilter from '@/components/RunningFilter.vue';
export default {
    name: "RunningOrders",
    components: {
        RunningFilter,
    },
    data() {
        return {
            filters: [],
            page: 1,
            isFetching: false,
            stocks: [],
        };
    },
    mounted() {
        this.loadMore(); // Initial load
        window.addEventListener('scroll', this.handleScroll); // Add scroll event listener
    },
    unmounted() {
        window.removeEventListener('scroll', this.handleScroll); // Clean up the event listener
    },
    computed: {
        filteredStocks() {
            let tempStocks = [];
            if (this.filters.showHighStock) {
                tempStocks = this.stocks.filter(catalog => catalog.balance_qty);
            }
            else {
                tempStocks = this.stocks.filter(catalog => !catalog.balance_qty);
            }
            if (this.filters.tagSearch) {
                const searchTerm = this.filters.tagSearch.toLowerCase();
                tempStocks = tempStocks.filter((stock) => {
                    const stockTags = stock.product.tags.split(',');
                    return stockTags.some(tag => tag.toLowerCase().includes(searchTerm.trim()));
                });
            }
            if (this.filters.filterBy !== 'default') {
                tempStocks = tempStocks.filter(catalog => catalog.last_activity === this.filters.filterBy);
            }
            if (this.filters.sortBys && this.filters.sortBys.length) {
                this.filters.sortBys.forEach(sortBy => {
                    if (sortBy.selected) {
                        switch (sortBy.value) {
                            case 'balance':
                                tempStocks = tempStocks.slice().sort((a, b) => a.balance_qty - b.balance_qty);
                                break;
                            case 'ready':
                                tempStocks = tempStocks.slice().sort((a, b) => a.readyable_qty - b.readyable_qty);
                                break;
                            case 'demand':
                                tempStocks = tempStocks.slice().sort((a, b) => a.demandable_qty - b.demandable_qty);
                                break;
                            case 'disptach':
                                tempStocks = tempStocks.slice().sort((a, b) => a.dispatchable_qty - b.dispatchable_qty);
                                break;
                            default: break;
                        }
                    }
                });
            }
            return tempStocks;
        },
    },
    methods: {
        handleScroll() {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            if (clientHeight + scrollTop >= scrollHeight - 5) { // Check if near bottom
                this.loadMore();
            }
        },
        loadMore() {
            if (this.isFetching)
                return;
            this.isFetching = true;
            const token = localStorage.getItem('token');
            axiosInstance.get(`mystocks?page=${this.page}`, {
                headers: { "Authorization": `Bearer ${token}` }
            }).then((response) => {
                if (response.data.status === 'ok') {
                    this.stocks = [...this.stocks, ...response.data.data.data];
                    this.page++;
                    this.isFetching = false;
                }
                else if (response.data.status === 'error') {
                    this.isFetching = false;
                    alert(response.data.message);
                }
                else {
                    this.isFetching = false;
                    alert('Something went wrong! Please try again');
                }
            });
        },


        handleFiltersChange(filters) {
            this.filters = filters;
        }
    },

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
