<template>
    <!-- <div>
        <div v-if="Object.keys(dispatches).length">
            <div v-for="(dispatch, dispatchIndex) in newOrders" :key="dispatchIndex">
                <transition name="slide" mode="out-in">
                    <DispatchCard :dispatch="dispatch" :dispatchIndex="dispatchIndex" />
                </transition>
            </div>
        </div>
        <EmptyList v-else title="No Dispatch Available"></EmptyList>
    </div> -->
   <div class="" style="padding-bottom: 80px;">
        <p class="p-2 text-center mb-0 bg-light bill border-bottom"><span class="fs-5">~ Pending Orders ~</span></p>
        <div v-if="Object.keys(dispatches).length" class="container">
            <div v-for="(dispatch, dispatchIndex) in  dispatches " :key="dispatchIndex" class="my-2">
                <transition name="slide" mode="out-in">
                   <div class="card rounded-0" :key="dispatchIndex">
                        <div class="d-flex border-bottom">
                            <img v-if="dispatch.dispatchItems && dispatch.dispatchItems.length"
                                :src="dispatch.dispatchItems[0].stock_id.image" class="border-end"
                                style="width: 80px; object-fit: fill;">
                            <div class="flex-fill d-flex flex-column justify-content-between">
                                <div class="p-2">
                                    <p class="truncate fw-bold mb-0">{{ dispatch.name }}
                                    </p>
                                    <div class="d-flex justify-content-between">
                                        <small class="">{{ dispatch.sid }}</small>
                                        <small class="">{{ dispatch.quantity }}</small>
                                    </div>
                                </div>
                                <div class="btn-group" role="group">
                                    <button
                                        class="d-flex align-items-center justify-content-center gap-2 btn btn-dark rounded-0"
                                        data-bs-toggle="collapse" :data-bs-target="'#collapseExample' + dispatchIndex"
                                        aria-expanded="false"
                                        :aria-controls="'collapseExample' + dispatchIndex"><span>Detail</span> <i
                                            class="bi bi-chevron-down"></i></button>
                                    <button
                                        class="d-flex align-items-center justify-content-center gap-2 btn btn-danger rounded-0"
                                        v-if="dispatch.status === 'pending'"><span>Pending</span> <i
                                            class="bi bi-exclamation-lg"></i></button>
                                    <button class="btn btn-success rounded-0"
                                        v-if="dispatch.status === 'received'">Accepted</button>
                                </div>
                            </div>
                        </div>

                        <div class="collapse" :id="'collapseExample' + dispatchIndex">
                            <div v-for="(item, itemIndex) in dispatch.items" :key="itemIndex"
                                class="card-body border-bottom">
                                <div class="d-flex align-items-center gap-3">
                                    <img :src="item.stock_id.image" style="width: 50px; object-fit: fill;">
                                    <div class="flex-fill d-flex justify-content-between">
                                        <div class="">
                                            <p class="mb-0"> {{ item.stock_id.product_option_sid }}</p>
                                            <p class="mb-0"> {{ item.quantity }} pcs</p>
                                        </div>
                                        <div v-if="item.new_quantity" class="">
                                            <p class="mb-0"> {{ item.stock_id.product_option_sid }}</p>
                                            <p class="mb-0"> {{ item.new_quantity }} pcs</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="container alert alert-success mb-0 rounded-0">
                                <p class="my-1 fw-bold">Message</p>
                                <div v-for="(note, noteIndex) in dispatch.note" :key="noteIndex" class="">
                                    <div class="message w-100 ">
                                        <div class="message-content border w-100 bg-white"
                                            style="word-wrap: break-word; padding: 10px !important; border-radius: 8px; border-top-right-radius: 15px; border-bottom-left-radius: 15px; border-bottom-right-radius: 0px !important; ">
                                            <small>
                                                <small class="text-primary">@ {{ note.sender_id.name }}</small>
                                            </small>
                                            <p class="mb-0">
                                                {{ note.message }}
                                            </p>
                                        </div>
                                        <div class="text-end text-muted" style="font-size: 10px;">{{
                                            formatMessageTime(note.delivered_at) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <DispatchCard :dispatch="dispatch" :dispatchIndex ="dispatchIndex"/> -->
                </transition>
            </div>
        </div>
        <NoOrder v-else></NoOrder>

    </div>
</template>

<script>
// import pusherApi from '@/mixins/pusherApi';
// import DispatchCard from '@/components/DispatchCard.vue';
// import EmptyList from '@/components/EmptyList.vue';
export default {
    name: 'DispatchDetails',
    // mixins:[pusherApi],
    // components: {
    //     DispatchCard,
    //     EmptyList
    // },
    computed: {
        dispatches() {
            return this.$store.getters.getDispatchOrders
        }
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
    },
    // created(){
    //     this.connect('fetchDispatchOrders')
    // },
    mounted() {
        this.$store.dispatch('fetchDispatchOrders')
    }
}
</script>

<style lang="scss" scoped></style>