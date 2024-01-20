<template>
    <div class="row mb-2">
        <div :class="{ 'col-12': !adjustmentCheck }" class="col-6 text-center text-bg-dark p-1">{{ title }}</div>
        <div v-if="adjustmentCheck" class="col-6">
            <label class="btn btn-outline-dark rounded-0 w-100">
                <input type="checkbox" autocomplete="off" v-model="formData.adjustment"> Adjustment
            </label>
        </div>
    </div>
    <textarea class="form-control" v-model="formData.content" :placeholder="placeholder"></textarea>
    <div class="d-flex flex-wrap gap-2 mb-2">
        <div class="d-flex w-100" v-for="(color, index) in product.options" :key="index">
            <button class="btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
                <img :src="color.image" class="rounded me-2" style="height: 60px; object-fit: cover">
            </button>
            <div class="flex-fill form-floating overflow-hidden">
                <input type="number" class="form-control" :id="'colorQuantity_' + color.sid"
                    v-model="formData.quantity[index]" min="1" />
                <label class="text-capitalize" :for="'colorQuantity_' + color.sid">{{ color.name }} Color</label>
            </div>
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content">
                        <button class="btn h-100" data-bs-dismiss="modal" aria-label="Close">
                            <img :src="color.image" class="h-100" style="object-fit: cover; object-position: center;">
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-around p-2 bg-secondary w-100 ">
            <span>Total</span>
            <span>{{ totalColorInputAmount.toLocaleString() }} pcs</span>
        </div>
    </div>
</template>

<script>
export default {
    props: ['adjustmentCheck', 'product', 'title', 'placeholder'],
    emits: ['formData'],
    data() {
        return {
            formData: {
                quantity: [],
                content: '',
                adjustment: false,
            },
        }
    },
    computed: {
        totalColorInputAmount() {
            return this.formData.quantity.reduce((total, qty) => total + parseInt(qty || 0), 0);
        },
    },
    mounted() {
        this.emitData()
    },
    watch: {
        'formData': {
            handler() {
                this.emitData()
            },
            deep: true
        }
    },
    methods: {
        emitData() {
            this.$emit('formData', {
                data: this.formData,
                total: this.totalColorInputAmount
            })
        }
    }

}
</script>

<style lang="scss" scoped></style>