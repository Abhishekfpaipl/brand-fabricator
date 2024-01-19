<template>
    <div>
        <nav class="navbar navbar-expand bg-body-tertiary p-0 border-bottom">
            <div class="navbar-collapse d-flex">
                <ul class="navbar-nav ms-auto align-items-center">
                    <li class="nav-item">
                        <a class="nav-link pt-0" href="#" role="button" data-bs-toggle="collapse"
                            data-bs-target="#saleOrdersMenuCollapse" aria-expanded="false"
                            aria-controls="saleOrdersMenuCollapse">
                            <div class="d-flex flex-column justify-content-center align-items-center">
                                <i class="bi bi-chevron-down text-dark fs-5"></i>
                                <span class="small text-muted" style=" font-weight: 500;">Menu</span>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>

        <div class="collapse" id="saleOrdersMenuCollapse">
            <div class="card card-body">
                <div class="form-floating mb-3">
                    <input v-model="tagSearch" type="search" class="form-control" placeholder="Search Stocks" />
                    <label for="floatingInput">Search by name or code</label>
                </div>

                <div class="d-flex flex-column mb-3">
                    <p class="mb-2 fw-bold">Sort By</p>
                    <div class="form-check form-switch" v-for="(sortBy, index) in sortBys" :key="index">
                        <input class="form-check-input" type="checkbox" role="switch" :id="'flexSwitchCheck' + index"
                            :checked="sortBy.selected" @change="updateSelection(index)" />
                        <label class="form-check-label" :for="'flexSwitchCheck' + index">{{ sortBy.selected ? sortBy.name.on
                            : sortBy.name.off }}</label>
                    </div>
                </div>

                <div class="btn-group w-100">
                    <button class="btn btn-outline-dark" type="reset">Reset</button>
                    <button class="btn btn-outline-success">Apply</button>
                </div>
            </div>
        </div>



    </div>
</template>

<script>
export default {
    name: 'SalesFilter',
    data() {
        return {
            tagSearch: '',
            sortBys: [
                { name: { on: 'Highest Quantity', off: 'Lowest Quantity' }, value: 'quantity', selected: true },
                { name: { on: 'Highest Amount', off: 'Lowest Amount' }, value: 'total', selected: false },
            ],
        }
    },
    mounted() {
        this.emitFilters()
    },
    watch: {
        tagSearch(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.emitFilters()
            }
        },
        sortBy(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.emitFilters()
            }
        },
    },
    methods: {
        updateSelection(index) {
            this.sortBys[index].selected = !this.sortBys[index].selected;
        },
        emitFilters() {
            this.$emit('sales-filter-changed', {
                tagSearch: this.tagSearch,
                sortBys: this.sortBys
            });
        },
    }

}
</script>