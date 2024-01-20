<template>
    <div>
        <nav class="navbar bg-body-tertiary">
            <div class="container-fluid">
                <div class="navbar-brand d-flex align-items-center">
                    <img :src="logo" style="width: 30px;">
                    <span class="fw-bold ms-2">DeshiGirl</span>
                </div>
                <i class="bi bi-person-circle fs-5" data-bs-toggle="offcanvas" data-bs-target="#profileDetails"
                    aria-controls="profileDetails"></i>
            </div>
        </nav>

        <div class="offcanvas offcanvas-end" tabindex="-1" id="profileDetails" aria-labelledby="profileDetailsLabel">
            <div class="offcanvas-header bg-light">
                <h5 class="offcanvas-title" id="profileDetailsLabel">Detail</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <div class="pb-5 mb-5">
                    <ImageUploadBox></ImageUploadBox>
                    <div class="container">
                        <table class="table table-bordered">
                            <tbody class="table-light">
                                <p class="bill fs-5 mt-5"><span>~ Basic Info ~</span></p>
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
                                    <td><button class="btn btn-sm top-brand opacity-75 text-white">Reset Password</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="table table-bordered">
                            <p class="bill fs-5 mt-5"><span>~ Business Info ~</span></p>
                            <tbody class="table-light">
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
                                    <td> B-74, Pocket X, Okhla Phase II, Okhla Industrial Estate, Okhla, New Delhi, Delhi
                                        110020<br>
                                    </td>
                                </tr>
                                <tr>
                                    <th class="table-secondary">Shipping Address</th>
                                    <td> B-74, Pocket X, Okhla Phase II, Okhla Industrial Estate, Okhla, New Delhi, Delhi
                                        110020</td>
                                </tr>

                            </tbody>
                        </table>
                        <div class="d-flex justify-content-center align-items-center m-3">
                            <button class="btn w-100 top-brand" data-bs-toggle="modal" data-bs-target="#exampleModal">Add
                                Address</button>
                        </div>

                        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
                            aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5" id="exampleModalLabel">Add Address</h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <form @submit.prevent="saveAddress()">
                                            <div class="form-floating mb-3">
                                                <input type="email" class="form-control" id="email" placeholder=""
                                                    v-model="email">
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
                                                <input type="text" class="form-control" id="addressLine1" placeholder=""
                                                    v-model="line1" required>
                                                <label for="addressLine1">Address Line 1</label>
                                            </div>
                                            <div class="form-floating mb-3">
                                                <input type="text" class="form-control" id="addressLine2" placeholder=""
                                                    v-model="line2">
                                                <label for="addressLine2">Address Line 2</label>
                                            </div>
                                            <div class="form-floating mb-3">
                                                <input type="text" class="form-control" id="city" placeholder=""
                                                    v-model="city" required>
                                                <label for="city">City</label>
                                            </div>
                                            <div class="d-flex gap-2">
                                                <div class="form-floating mb-3 w-50">
                                                    <input type="text" class="form-control" id="state" placeholder=""
                                                        v-model="state" required>
                                                    <label for="state">State</label>
                                                </div>
                                                <div class="form-floating mb-3 w-50">
                                                    <input type="number" class="form-control" id="pin" placeholder=""
                                                        v-model="pincode" required>
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
                            <button class="btn btn-danger" @click="logout">LogOut</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ImageUploadBox from '@/components/avatar/ImageUploadBox.vue';
export default {
    name: 'DashboardNav',
    components: { ImageUploadBox },
    data() {
        return {
            logo: 'img/deshiLogo.png',
            line1: '',
            line2: '',
            email: '',
            whatsapp: '',
            contact: '',
            city: '',
            state: '',
            pincode: '',
        }
    },
}
</script> 