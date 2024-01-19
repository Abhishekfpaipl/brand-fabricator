<template>
    <div class="w-100" style="overflow-x: hidden;">

        <nav class="navbar navbar-expand bg-body-tertiary p-0 border-bottom">
            <div class="d-flex flex-column px-3">
                <span style="font-weight: 500">Showing: {{ filteredStocks.length }} / {{ stocks.length }}</span>
                <span class="small">{{ showHighStock ? 'Catelogs having balance order' : 'Catelogs that doesnot have order'
                }}</span>
            </div>
            <div class="navbar-collapse d-flex">
                <ul class="navbar-nav ms-auto align-items-center">
                    <li class="nav-item">
                        <div class="nav-link form-check form-switch" style="width:30px;">
                            <div class="d-flex flex-column justify-content-center align-items-center">
                                <input class="form-check-input" type="checkbox" role="switch" v-model="showHighStock">
                                <span class="small pt-1 text-muted" style="font-weight: 600; margin-left: -2.4rem">
                                    {{ showHighStock ? 'Running' : 'Assigned' }}
                                </span>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item dropstart">
                        <a class="nav-link pt-0" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <div class="d-flex flex-column justify-content-center align-items-center">
                                <i class="bi bi-info-circle text-dark fs-5"></i>
                                <span class="small text-muted" style=" font-weight: 500;">Info</span>
                            </div>
                        </a>
                        <ul class="dropdown-menu">
                            <li v-for="(info, infoIndex) in infos" :key="infoIndex">
                                <div class="dropdown-item">
                                    <div class="d-flex align-items-center py-1">
                                        <div v-if="info.text" class="px-1">{{ info.text }}</div>
                                        <div v-else class="rounded-circle" :class="info.color"
                                            style="height:20px; width: 20px;"></div>
                                        <div class="ps-2">{{ info.name }}</div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link pt-0" href="#" role="button" data-bs-toggle="collapse"
                            data-bs-target="#runningOrdersMenuCollapse" aria-expanded="false"
                            aria-controls="runningOrdersMenuCollapse">
                            <div class="d-flex flex-column justify-content-center align-items-center">
                                <i class="bi bi-chevron-down text-dark fs-5"></i>
                                <span class="small text-muted" style=" font-weight: 500;">Menu</span>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>

        <div class="collapse" id="runningOrdersMenuCollapse">
            <div class="card card-body">
                <div class="form-floating mb-3">
                    <input v-model="tagSearch" type="search" class="form-control" placeholder="Search Stocks" />
                    <label for="floatingInput">Search by name or code</label>
                </div>
                <div class="form-floating mb-3">
                    <select class="form-select" v-model="filterBy" aria-label="Floating label select example">
                        <option selected value="default">Choose order stage</option>
                        <option v-for="(info, index) in filteredInfos" :key="index" :value="info.model">
                            {{ info.name }}
                        </option>
                    </select>
                    <label for="floatingSelect">Filter by order stage</label>
                </div>
                <div class="d-flex flex-column mb-3">
                    <p class="mb-2 fw-bold">Sort By</p>
                    <div class="form-check form-switch" v-for="(sortBy, index) in sortBys" :key="index">
                        <input class="form-check-input" type="checkbox" role="switch" :id="'flexSwitchCheck' + index"
                            :checked="sortBy.selected" @change="updateSelection(index, !sortBy.selected)" />
                        <label class="form-check-label" :for="'flexSwitchCheck' + index">{{ sortBy.selected ? sortBy.name.on : sortBy.name.off }}</label>
                    </div>
                </div>

                <div class="btn-group w-100">
                    <button class="btn btn-outline-dark" type="reset">Reset</button>
                    <button class="btn btn-outline-success">Apply</button>
                </div>
            </div>
        </div>

        <div class="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-2">
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
export default {
    name: "RunningOrders",
    data() {
        return {
            showHighStock: true,
            infos: [
                { filterable: true, model: 'Order', name: 'New Order', color: 'bg-success' },
                { filterable: true, model: 'Ready', name: 'New Ready', color: 'bg-danger' },
                { filterable: true, model: 'Demand', name: 'New Demand', color: 'bg-primary' },
                { filterable: false, name: 'Ready More', text: 'R' },
                { filterable: false, name: 'Dispatch More', text: 'D' },
            ],
            sortBys: [
                { name: { on: 'Latest Order', off: 'Oldest Order' }, value: 'default', selected: true },
                { name: { on: 'Highest Balance', off: 'Lowest Balance' }, value: 'balance', selected: false },
                { name: { on: 'Highest Ready', off: 'Lowest Ready' }, value: 'ready', selected: false },
                { name: { on: 'Highest Demand', off: 'Lowest Demand' }, value: 'demand', selected: false },
                { name: { on: 'Highest Dispatch', off: 'Lowest Dispatch' }, value: 'dispatch', selected: false },
            ],
            tagSearch: '',
            filterBy: 'default',
            sortOrder: 'default',
            selectedFabricator: 'default',
        };
    },
    created() {
        this.$store.dispatch('fetchStocks')
    },
    computed: {
        stocks() {
            return this.$store.getters.getStocks
        },
        filteredInfos() {
            return this.infos.filter(info => info.filterable);
        },
        filteredStocks() {
            let tempStocks = [];

            if (this.showHighStock) {
                tempStocks = this.stocks.filter(catalog => catalog.balance_qty)
            } else {
                tempStocks = this.stocks.filter(catalog => !catalog.balance_qty)
            }

            if (this.tagSearch !== '') {
                const searchTerm = this.tagSearch.toLowerCase();
                tempStocks = tempStocks.filter((stock) => {
                    const stockTags = stock.product.tags.split(',');
                    return stockTags.some(tag => tag.toLowerCase().includes(searchTerm.trim()));
                });
            }

            if (this.filterBy !== 'default') {
                tempStocks = tempStocks.filter(catalog => catalog.last_activity === this.filterBy)

            }

            this.sortBys.forEach(sortBy => {
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

            return tempStocks;
        },

    },
    methods: {
        sortStock() {
            this.showHighStock = !this.showHighStock
        },
        updateSelection(index, isSelected) {
            // Update the selected state of the paragraph
            this.sortBys[index].selected = isSelected;

            // Optionally, if you want to ensure only one paragraph can be 'On' at a time
            // you can reset other paragraphs' selected state
            // this.paragraphs.forEach((p, idx) => {
            //     if (idx !== index) p.selected = false;
            // });
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
