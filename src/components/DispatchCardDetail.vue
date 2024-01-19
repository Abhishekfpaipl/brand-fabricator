<template>
    <div v-if="activeDispatch" class="offcanvas offcanvas-end" tabindex="-1" id="dispatchOrderModal"
        aria-labelledby="dispatchOrderModalLabel">
        <div class="offcanvas-header w-100 d-flex justify-content-between align-items-center bg-light border-bottom">
            <div class="d-flex flex-fill justify-content-start gap-2 align-items-center">
                <i class="bi bi-chevron-left" data-bs-dismiss="offcanvas" data-bs-target="#dispatchOrderModal"
                    aria-label="Close"></i>

                <div class="text-uppercase" id="dispatchOrderModal">
                    {{ activeDispatch.doc_date }} Details
                </div>
            </div>
            <span class="">{{ activeDispatch.quantity }}</span>
        </div>

        <div class="offcanvas-body p-2">
            <div class="card-body">
                <div class=" w-100 my-2" v-for="(item, itemIndex) in activeDispatch.items" :key="itemIndex">
                    <div class="d-flex">
                        <img :src="item.stock.image" style="width: 60px; object-fit: cover;">
                        <div class="flex-fill ps-2">
                            <span class="flex-fill text-capitalize">
                                {{ item.stock.option_name }}
                            </span>
                            <div class="d-flex justify-content-between">
                                <div class="d-flex gap-2">
                                    <span>Sent Qty</span>
                                    <strong>{{ item.sent_quantity }}</strong> pcs.
                                </div>
                                <div class="d-flex gap-2">
                                    <span>Billed Qty</span>
                                    <strong>{{ item.billed_quantity }}</strong> pcs.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <p class="my-2 fw-bold">Dispatch Chat</p>
                <div v-for="(note, noteIndex) in activeDispatch.note" :key="noteIndex"
                    class="d-flex flex-column alert alert-primary">
                    <small>@{{ note.sender_id.name }}</small>
                    <span>{{ note.message }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DispatchCardDetail',
    props: ['dispatches'],
    data() {
        return {
            activeDispatch: {}
        };
    },
    async mounted() {
        this.loadActiveSale();
    },
    methods: {
        loadActiveSale() {
            const dispatchOrderModal = document.getElementById('dispatchOrderModal')
            if (dispatchOrderModal) {
                dispatchOrderModal.addEventListener('show.bs.offcanvas', event => {
                    const button = event.relatedTarget
                    const dispatchId = button.getAttribute('data-bs-dispatchId');
                    this.activeDispatch = this.dispatches.find(dispatch => dispatch.id == dispatchId);
                });
            }
        },
    }
}
</script>

<style lang="scss" scoped></style>