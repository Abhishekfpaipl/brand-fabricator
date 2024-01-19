<template>
    <div>
        <nav class="navbar navbar-expand bg-body-tertiary p-0 border-bottom">
            <div class="d-flex flex-column px-3">
                <span style="font-weight: 500">Showing: {{ title }}</span>
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
                        <label class="form-check-label" :for="'flexSwitchCheck' + index">{{ sortBy.selected ? sortBy.name.on
                            : sortBy.name.off }}</label>
                    </div>
                </div>

                <div class="btn-group w-100">
                    <button class="btn btn-outline-dark" type="reset">Reset</button>
                    <button class="btn btn-outline-success" @click="emitFilters">Apply</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: 'RunningTopNav',
    props: ["title"],
    data() {
        return {
            showHighStock: true,
            tagSearch: '',
            filterBy: 'default',
            infos: [
                { filterable: true, model: 'Order', name: 'New Order', color: 'bg-success' },
                { filterable: true, model: 'Ready', name: 'New Ready', color: 'bg-danger' },
                { filterable: true, model: 'Demand', name: 'New Demand', color: 'bg-primary' },
                { filterable: false, name: 'Ready More', text: 'R' },
                { filterable: false, name: 'Dispatch More', text: 'D' },
                { filterable: false, name: 'Balance Qty', text: 'B' },
            ],
            sortBys: [
                { name: { on: 'Latest Order', off: 'Oldest Order' }, value: 'default', selected: true },
                { name: { on: 'Highest Balance', off: 'Lowest Balance' }, value: 'balance', selected: false },
                { name: { on: 'Highest Ready', off: 'Lowest Ready' }, value: 'ready', selected: false },
                { name: { on: 'Highest Demand', off: 'Lowest Demand' }, value: 'demand', selected: false },
                { name: { on: 'Highest Dispatch', off: 'Lowest Dispatch' }, value: 'dispatch', selected: false },
            ],
        }
    },
    computed: {
        filteredInfos() {
            return this.infos.filter(info => info.filterable);
        },
    },
    mounted() {
        this.emitFilters()
    },
    watch: {
        showHighStock(newValue, oldValue){
            if (newValue !== oldValue) {
                this.emitFilters();
            }
        },
        tagSearch(newValue, oldValue){
            if (newValue !== oldValue) {
                this.emitFilters();
            }
        },
        filterBy(newValue, oldValue){
            if (newValue !== oldValue) {
                this.emitFilters();
            }
        },
        sortBys(newValue, oldValue){
            if (newValue !== oldValue) {
                this.emitFilters();
            }
        },
    },
    methods: {
        updateSelection(index, isSelected) {
            this.sortBys[index].selected = isSelected;
        },
        emitFilters() {
            this.$emit('order-filter-changed', {
                showHighStock: this.showHighStock,
                tagSearch: this.tagSearch,
                filterBy: this.filterBy,
                sortBys: this.sortBys
            });
        },
    }
}
</script>

<style lang="scss" scoped></style>