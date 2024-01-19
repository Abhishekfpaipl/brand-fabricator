<template>
    <div>
        <nav class="navbar navbar-expand bg-body-tertiary p-0 border-bottom">
            <div class="navbar-collapse d-flex">
                <ul class="navbar-nav ms-auto align-items-center">
                    <li class="nav-item">
                        <button class="btn btn-outline-dark text-capitalize rounded-0" @click="toggleStatus">{{
                            currentStatus }}</button>

                    </li>
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
                            :checked="sortBy.selected" @change="updateSelection(index, !sortBy.selected)" />
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
    name: 'DispatchFilter',
    data() {
        return {
            tagSearch: '',
            sortBys: [
                { name: { on: 'Latest Dispatch', off: 'Oldest Dispatch' }, selected: true },
                { name: { on: 'Highest Quantity', off: 'Lowest Quantity' }, selected: false },
                { name: { on: 'Maximum Dispatch', off: 'Lowest Dispatch' }, selected: false },
            ],
            currentStatus: 'pending'
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
        sortBys(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.emitFilters()
            }
        },
        currentStatus(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.emitFilters()
            }
        },
    },
    methods: {
        updateSelection(index, isSelected) {
            this.sortBys[index].selected = isSelected;
        },
        emitFilters() {
            this.$emit('disptach-filter-changed', {
                tagSearch: this.tagSearch,
                sortBys: this.sortBys,
                currentStatus: this.currentStatus,
            });
        },
        toggleStatus() {
            if (this.currentStatus === 'pending') {
                this.currentStatus = 'received';
            } else {
                this.currentStatus = 'pending';
            }
        },
    }

}
</script>

<style lang="scss" scoped></style>