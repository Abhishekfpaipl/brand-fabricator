<template>
    <div>
        <DispatchFilters @disptach-filter-changed="handleFiltersChange" />
        <div v-if="Object.keys(filteredDispatches).length">
            <div v-for="(dispatch, dispatchIndex) in filteredDispatches" :key="dispatchIndex">
                <transition name="slide" mode="out-in">
                    <DispatchCard :dispatch="dispatch" :dispatchIndex="dispatchIndex" />
                </transition>
            </div>
            <DispatchCardDetail :dispatches="filteredDispatches" />
        </div>
        <EmptyList v-else title="No Dispatch Available"></EmptyList>
    </div>
</template>

<script>
import EmptyList from '@/components/EmptyList.vue';
import DispatchCard from '@/components/DispatchCard.vue';
import DispatchFilters from '@/components/DispatchFilters.vue';
import DispatchCardDetail from '@/components/DispatchCardDetail.vue';
export default {
    name: 'DispatchOrders',
    components: {
        DispatchCard,
        EmptyList,
        DispatchCardDetail,
        DispatchFilters
    },
    data() {
        return {
            filters: [],
        }
    },
    computed: {
        dispatches() {
            return this.$store.getters.getDispatches
        },
        pendingDispatch() {
            return this.dispatches.filter(dispatch => dispatch.status === 'pending')
        },
        filteredDispatches() {
            let dispatches = this.dispatches;
            if (this.filters.tagSearch) {
                const searchTerm = this.filters.tagSearch.toLowerCase();
                dispatches = dispatches.filter((dispatch) => {
                    const stockTags = dispatch.tags.split(',');
                    return stockTags.some(tag => tag.toLowerCase().includes(searchTerm.trim()));
                });
            }
            if (this.filters.currentStatus !== 'pending') {
                dispatches = dispatches.filter(dispatch => dispatch.status === this.filters.currentStatus);
            }

            return dispatches;
        },
    },
    mounted() {
        this.$store.dispatch('fetchDispatches')
    },
    methods: {
        formatMessageTime(time) {
            const options = {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            const formattedTime = new Date(time).toLocaleDateString('en-US', options);
            return formattedTime;
        },
        handleFiltersChange(filters) {
            this.filters = filters;
        },
    },
}
</script>
 