<template>
    <div v-if="activeSale" class="offcanvas offcanvas-end" tabindex="-1" id="saleInfoModal"
        aria-labelledby="saleInfoModalLabel">
        <div class="offcanvas-header w-100 d-flex justify-content-between align-items-center bg-light border-bottom">
            <div class="d-flex flex-fill justify-content-start gap-2 align-items-center">
                <i class="bi bi-chevron-left" data-bs-dismiss="offcanvas" data-bs-target="#saleInfoModal"
                    aria-label="Close"></i>

                <div class="text-uppercase" id="saleInfoModal">
                    {{ activeSale.doc_date }} Details
                </div>
            </div>
            <span class="">{{ activeSale.quantity }}</span>
        </div>

        <div class="offcanvas-body p-2">
            <div v-for="(group, groupIndex) in activeSale.groups" :key="groupIndex" class="d-flex flex-wrap gap-2 mb-2">
                <div class="card ">
                    <div class="card-header d-flex justify-content-between">
                        <p class="fw-bold mb-1">{{ groupIndex + 1 }} Disptached On</p>
                        <p class="mb-1">{{ group.dispatched_on }}</p>
                    </div>
                    <div v-for="(item, itemIndex) in group.items" :key="itemIndex" class="card-body d-flex w-100 my-1">
                        <img :src="item.image" class="rounded me-2" style="width: 60px; object-fit: fill;">
                        <div class="flex-fill ms-2">
                            <div class="d-flex justify-content-between">
                                <small class="my-1"><strong>Color:</strong> {{ item.option }}</small><br>
                                <small class="my-1"><strong>Size:</strong> {{ item.range }}</small>
                            </div>
                            <div class="d-flex flex-fill">
                                <div class="w-100">
                                    <p class="mb-0 text-start">
                                        Quantity
                                    </p>
                                    <span class="input-group-text rounded-0">{{ item.sent_quantity }}
                                        <span class="badge bg-secondary"
                                            :class="{ 'd-none': adjustDifference(item.billed_quantity, item.sent_quantity) === '' }">
                                            ({{ adjustDifference(item.billed_quantity, item.sent_quantity) }})</span>
                                    </span>
                                </div>
                                <div class="w-100">
                                    <p class="mb-0 text-center">Rate</p>
                                    <span class="input-group-text rounded-0">@{{ item.rate }}</span>
                                </div>
                                <div class="w-100">
                                    <p class="mb-0 text-end">Amount</p>
                                    <input type="text" class="form-control rounded-0" :value="item.amount.toLocaleString()"
                                        disabled>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: 'SaleCard',
    props: ['sales'],
    data() {
        return {
            activeSale: {}
        };
    },
    async mounted() {
        this.loadActiveSale();
    },
    methods: {
        loadActiveSale() {
            const saleInfoModal = document.getElementById('saleInfoModal')
            if (saleInfoModal) {
                saleInfoModal.addEventListener('show.bs.offcanvas', event => {
                    const button = event.relatedTarget
                    const saledocId = button.getAttribute('data-bs-saledocId');
                    this.activeSale = this.sales.find(sale => sale.doc_id === saledocId);
                });
            }
        },
        adjustDifference(billedQuantity, sentQuantity) {
            const difference = billedQuantity - sentQuantity;

            if (difference > 0) {
                return `+${difference}`;
            } else if (difference < 0) {
                return `${difference}`;
            } else {
                return '';
            }
        },
    }
}
</script>

<style lang="scss" scoped></style>