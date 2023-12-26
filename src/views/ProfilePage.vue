<template>
    <div class="pb-5 mb-5">
        <ImageUploadBox></ImageUploadBox>
        <!-- <div class="text-center">
            <img :src="supplier.image" class="rounded-0" style="width: 100%; height: 300px; object-fit: cover;">
        </div> -->
        <div class="container">
            <table class="table table-bordered">
                <tbody class="table-light">
                    <p class="bill fs-5 mt-5"><span>~ Basic Info ~</span></p>
                    <!-- <tr class="bill"><th colspan="2" class="text-center"><span>~ HE ~</span></th></tr> -->
                    <tr>
                        <th class="table-secondary w-25">Name</th>
                        <td>Test</td>
                    </tr>
                    <tr>
                        <th class="table-secondary">Mobile</th>
                        <td>3265184891</td>
                    </tr>
                    <tr>
                        <th class="table-secondary">Description</th>
                        <td>Lorem, ipsum dolor.</td>
                    </tr>
                    <tr>
                        <th class="table-secondary">Password</th>
                        <td><button class="btn btn-sm top-brand opacity-75 text-white">Reset Password</button></td>
                    </tr>
                </tbody>
            </table>
            <table class="table table-bordered">
                <p class="bill fs-5 mt-5"><span>~ Business Info ~</span></p>
                <tbody class="table-light">
                    <!-- <tr class="table-secondary">
                    <th class=""> Business Details</th>
                    <td class="d-flex align-items-center justify-content-end gap-2 py-3 text-end">
                        <span class="fs-5">Address </span>
                        <i class="bi bi-plus btn btn-outline-dark px-2 py-0 fs-5" data-bs-toggle="modal"
                            data-bs-target="#exampleModal"></i>
                    </td>
                </tr> -->
                    <tr>
                        <th class="table-secondary w-25">Business Name</th>
                        <td>busniess fpaipl</td>
                    </tr>
                    <tr>
                        <th class="table-secondary">Gstin</th>
                        <td>GT546BBHUY225</td>
                    </tr>
                    <tr>
                        <th class="table-secondary">Email</th>
                        <td>fab@fpaipl.com</td>
                    </tr>
                    <tr>
                        <th class="table-secondary">Whatsapp</th>
                        <td>22365478210</td>
                    </tr>
                    <tr>
                        <th class="table-secondary">Contact</th>
                        <td>3365987420</td>
                    </tr>
                    <tr>
                        <th class="table-secondary">Billing Address</th>
                        <td> B-74, Pocket X, Okhla Phase II, Okhla Industrial Estate, Okhla, New Delhi, Delhi 110020<br>
                        </td>
                    </tr>
                    <tr>
                        <th class="table-secondary">Shipping Address</th>
                        <td> B-74, Pocket X, Okhla Phase II, Okhla Industrial Estate, Okhla, New Delhi, Delhi 110020</td>
                    </tr>

                </tbody>
            </table>
            <div class="d-flex justify-content-center align-items-center m-3">
                <button class="btn w-100 top-brand" data-bs-toggle="modal" data-bs-target="#exampleModal">Add
                    Address</button>
            </div>

            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Add Address</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="saveAddress()">
                                <div class="form-floating mb-3">
                                    <input type="email" class="form-control" id="email" placeholder="" v-model="email">
                                    <label for="email">Email</label>
                                </div>
                                <div class="d-flex gap-2">
                                    <div class="form-floating mb-3 w-50">
                                        <input type="number" class="form-control" id="whatsapp" placeholder=""
                                            v-model="whatsapp">
                                        <label for="whatsapp">Whatsapp</label>
                                    </div>
                                    <div class="form-floating mb-3 w-50">
                                        <input type="number" class="form-control" id="contact" placeholder=""
                                            v-model="contact">
                                        <label for="contact">Contact</label>
                                    </div>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control" id="addressLine1" placeholder="" v-model="line1"
                                        required>
                                    <label for="addressLine1">Address Line 1</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control" id="addressLine2" placeholder=""
                                        v-model="line2">
                                    <label for="addressLine2">Address Line 2</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control" id="city" placeholder="" v-model="city"
                                        required>
                                    <label for="city">City</label>
                                </div>
                                <div class="d-flex gap-2">
                                    <div class="form-floating mb-3 w-50">
                                        <input type="text" class="form-control" id="state" placeholder="" v-model="state"
                                            required>
                                        <label for="state">State</label>
                                    </div>
                                    <div class="form-floating mb-3 w-50">
                                        <input type="number" class="form-control" id="pin" placeholder="" v-model="pincode"
                                            required>
                                        <label for="pin">Pin Code</label>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-center align-items-center">
                                    <button type="submit" class="btn btn-primary">Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center">
                <button class="btn btn-danger">LogOut</button>
            </div>
        </div>
    </div>
</template>

<script>
import ImageUploadBox from '@/components/avatar/ImageUploadBox.vue';
import axios from 'axios'
export default {
    name: 'ProfilePage',
    components: { ImageUploadBox },
    data() {
        return {
            supplierId: '',
            line1: '',
            line2: '',
            email: '',
            whatsapp: '',
            contact: '',
            city: '',
            state: '',
            pincode: '',
            isFormVisible: false,
            billingCheckbox: false,
            shippingCheckbox: false,
            bothCheckbox: false
        }
    },
    mounted() {
        this.supplierId = this.$route.params.supplierId
        this.$store.dispatch('fetchSupplier', this.supplierId)
    },
    computed: {
        supplier() {
            return this.$store.getters.getSupplier;
        }
    },
    methods: {
        showForm() {
            this.isFormVisible = true;
        },
        hideForm() {
            this.isFormVisible = false;
            this.addressLine1 = '';
            this.addressLine2 = '';
            this.city = '';
            this.state = '';
            this.zip = '';
        },
        saveAddress() {
            axios.post('http://192.168.1.183:8000/api/suppliers/' + this.supplierId, {
                name: this.supplier.name,
                whatsapp: this.supplier.whatsapp,
                contact: this.supplier.contact,
                mobile: this.supplier.contact,
                email: this.supplier.email,
                line1: this.supplier.shipping.line1,
                line2: this.supplier.shipping.line2,
                city: this.supplier.shipping.city,
                state: this.supplier.shipping.state,
                pincode: this.supplier.shipping.pincode,
            })
                .then(response => {
                    console.log('Data successfully sent:', response.data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }
}
</script>

<style lang="scss" scoped></style>