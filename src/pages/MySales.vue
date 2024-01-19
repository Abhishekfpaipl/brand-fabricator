<template>
    <div class="">
        <SalesFilter @sales-filter-changed="handleFiltersChange" />
        <div v-if="Object.keys(filteredSales).length">
            <div v-for="(sale, saleIndex) in filteredSales" :key="saleIndex">
                <SaleCard :sale="sale" :saleIndex="saleIndex" />
            </div>
            <SaleCardDetail :sales="filteredSales" />
        </div>
        <EmptyList v-else title="No Purchase Available"></EmptyList>
    </div>
</template>

<script>

import EmptyList from '@/components/EmptyList.vue';
import SaleCard from '@/components/SaleCard.vue'
import SaleCardDetail from '@/components/SaleCardDetail.vue';
import SalesFilter from '@/components/SalesFilter.vue'
export default {
    name: 'MySales',
    components: {
        SaleCard,
        SaleCardDetail,
        EmptyList,
        SalesFilter
    },
    data() {
        return {
            filters: [],
        }
    },
    mounted() {
        this.$store.dispatch('fetchSales')
    },
    computed: {
        sales() {
            return this.$store.getters.getSales
        },
        filteredSales() {
            let sales = this.sales;
            if (this.filters.tagSearch) {
                const searchTerm = this.filters.tagSearch.toLowerCase();
                sales = sales.filter((sale) => {
                    const stockTags = sale.tags.split(',');
                    return stockTags.some(tag => tag.toLowerCase().includes(searchTerm.trim()));
                });
            }
            if (this.filters.sortBys && this.filters.sortBys.length) {
                this.filters.sortBys.forEach(sortBy => {
                    if (sortBy.selected) {
                        switch (sortBy.value) {
                            case 'quantity':
                                sales = sales.slice().sort((a, b) => a.quantity - b.quantity);
                                break;
                                case 'total':
                                sales = sales.slice().sort((a, b) => a.total - b.total);
                                break;
                            default: break;
                        }
                    }
                });
            }
            return sales;
        },
    },
    methods: {
        handleFiltersChange(filters) {
            this.filters = filters;
        }
    }
}
</script>

<style lang="scss" scoped></style>