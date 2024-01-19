<template>
    <div class="row g-0" style="min-height: 100vh;">
        <div class="pt-2 col-md-6 d-flex flex-column justify-content-center align-items-center"
            style="background: linear-gradient(113deg, #1FAB89 31%, #28CC9E 97%);">
            <div class=" rounded-circle d-flex justify-content-center"
                style="height: 150px; width: 150px; background: linear-gradient(113deg, #1FAB89 31%, #28CC9E 97%);">
                <img :src="`${publicPath}${logo}`" style="width: 100%; object-fit: contain;">
            </div>
            <div class="d-flex justify-content-center">
                <p class="mt-2 m-0 fw-bold icon">Fabricator</p>
            </div>
        </div>
        <div class="container d-flex flex-column justify-content-center col-md-6 bg-light pt-2">
            <p class="text-center fs-5">Login Your Account </p>
            <form @submit.prevent="loginAccount()">
                <div class="w-100 p-2 form-floating">
                    <input type="tel" class="form-control" placeholder="Mobile" v-model="mobile">
                    <label for="floatingInput" class="text-muted">Mobile No.</label>
                </div>
                <span>OR</span>
                <div class="w-100 p-2 form-floating">
                    <input type="email" class="form-control" placeholder="Email" v-model="email">
                    <label for="floatingInput" class="text-muted">Email Id.</label>
                </div>
                <div class="w-100 p-2 form-floating">
                    <input type="password" class="form-control" id="floatingInput2" placeholder="Password"
                        v-model="password" required>
                    <label for="floatingInput2" class="text-muted">Password</label>
                </div>
                <div class="d-flex justify-content-center align-items-center w-100 px-2 mt-2">
                    <button type="submit" class="btn text-white py-2 fs-5 w-100"
                        style="padding: 10px 12px !important;background: linear-gradient(113deg, #1FAB89 31%, #28CC9E 97%);">Submit</button>
                </div>
            </form>
            <div class="text-center container my-3">
                <p>By proceeding, you agree to <RouterLink to="/">Terms & Conditions</RouterLink> & <RouterLink to="/">
                        Privacy policy</RouterLink>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
// import axios from 'axios';
import axiosInstance from '@/axiosInstance';
// import Cookies from 'js-cookies';

export default {
    data() {
        return {
            logo: "img/logo.png",
            publicPath: process.env.BASE_URL,
            email: null,
            mobile: null,
            password: "password",
            type: null,
            // type: "fabricator",
        };
    },
    methods: {
        loginAccount() {

            if (this.email && this.email !== '') {
                this.type = 'email';
            }

            if (this.mobile && this.mobile !== '') {
                this.type = 'mobile';
            }

            if (this.type) {
                axiosInstance.post('login', {
                    email: this.email, mobile: this.mobile, password: this.password, type: this.type, device: 'Abhishek'
                }).then((response) => {
                    console.log('data sent', response)
                    const token = response.data.data.token;

                    // Replace localStorage with Cookies.set
                    // Cookies.set('token', token, { expires: 7, path: '/' });
                    localStorage.setItem('token', token)
                    console.log('login successful token stored', token)
                    // this.$router.push('/dashboard');
                }).catch((error) => {
                    console.log('error', error)
                })
            } else {
                alert('Either Mobile or Email is required');
            }
        }
    }
}
</script>

<style scoped>
.icon {
    /* font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif; */
    font-family: Arial, Helvetica, sans-serif;
    font-size: 2rem;
    color: white;
    /* background: -webkit-linear-gradient(113deg, #28CC9E 31%, #1FAB89 97%); */
    padding: 14px 12px;
    /* -webkit-text-fill-color: transparent; */
    background-clip: text;
}
</style>