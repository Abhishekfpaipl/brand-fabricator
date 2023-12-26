<template>
    <nav class="navbar border-bottom navbar-expand-lg" style="background-color: #25C297;">
        <div class="container-fluid">
            <router-link to="/saleOrder/list" class="ps-1 pe-3 text-white">
                <i class="bi bi-chevron-left"></i>
            </router-link>
            <div class="navbar-brand flex-fill d-flex align-items-center gap-2 text-white">
                <span>Sale Order</span>
                <i class="bi bi-arrow-right"></i>
                <small>{{ this.purchaseId }}</small>
            </div>
            <!-- <div class="navbar-brand text-white">{{ this.purchaseId }}</div> -->
        </div>
    </nav>
    <div class="container" style="padding-bottom:80px ;">
        <p class="my-3 text-center fs-5 bill"><span>~ Catalog ~</span></p>
        <div class="card">
            <div class="row g-1">
                <div class="col-4 col-md-3 d-flex align-items-center justify-content-start p-2">
                    <img v-if="dataset.product" :src="dataset.product.colors[0].image" style="object-fit: cover"
                        class="w-100">
                </div>
                <div class="col-8 col-md-9">
                    <div v-if="dataset.product" class="text-start mt-2">
                        <p class="mb-0">{{ dataset.product.id }}</p>
                    </div>
                    <div v-if="dataset.product" class="text-start">
                        <p class="ss mb-0">{{ dataset.product.name }} Long Gathered Sheer Cami Dress</p>
                    </div>
                </div>
            </div>
        </div>

        <table v-if="this.dataset.quantities" class="table table-responsive mt-3">
            <thead class="table-secondary">
                <tr class="text-center">
                    <th>Colors</th>
                    <th>Qty</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(color, colorIndex) in dataset.product.colors" :key="colorIndex">
                    <td class="text-center">
                        <img :src="color.image" class="rounded-circle" style="width: 60px; height: 60px; object-fit: cover;"
                            alt="">
                    </td>
                    <td>
                        <input type="number" class="form-control text-center" value="3000">
                    </td>
                </tr>
            </tbody>
        </table>


        <div class="d-flex justify-content-between p-2 px-3 bg-light">
            <p class="mb-0 fw-bold">Final Quantity</p>
            <p class="mb-0 fw-bold">{{ calculateFinalQty }} pcs</p>
        </div>


        <div class="mt-3">
            <div class="d-flex align-items-center">
                <div class="border p-2 py-3 ps-4 rounded-top  text-white w-100" style="background-color: #25C297 ;"
                    data-bs-toggle="collapse" data-bs-target="#collapseExampleNew" aria-expanded="false"
                    aria-controls="collapseExampleNew">
                    Chat
                </div>
            </div>
            <div class="collapse show bg-light p-2 border" id="collapseExampleNew">
                <div v-for="(message, index) in dataset.message" :key="index">
                    <div class="message mt-3 mb-2  w-100 ">
                        <div class="message-content border w-100 bg-white"
                            style="word-wrap: break-word; padding: 10px !important; border-radius: 8px; border-top-right-radius: 15px; border-bottom-left-radius: 15px; border-bottom-right-radius: 0px !important; ">
                            <small class="fw-bold text-primary">@ {{ message.username }}</small>
                            <p class="mb-0">
                                <strong>{{ message.title }}</strong>: {{ message.body }}
                            </p>
                        </div>
                        <div class="text-end text-muted" style="font-size: 10px;">{{ formatMessageTime(message.time) }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="pb-2">
                <div class="form-check border-bottom py-2 " v-for="(action_name, index) in inputList" :key="index">
                    <div class="d-flex align-items-center ">
                        <input class="form-check-input" :ID="'radio' + index" type="radio" :value="action_name"
                            v-model="actionName">
                        <label class="form-check-label w-100" :for="'radio' + index">
                            <span><i :class="action_name.icon" class="fs-4 mx-3"></i></span>
                            <span class="text-capitalize">{{ action_name.title }}</span>
                        </label>
                    </div>
                </div>

                <div class=" d-flex bg-light p-2 align-items-center">
                    <input v-model="body" type="text" class="form-control" placeholder="Type your message..." required />
                    <div @click="sendMessage" class="ms-2 "><i class="bi bi-telegram fs-1   p-3"
                            style="color: #25C297;"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import pusherApi from '@/mixins/pusherApi';
export default {
    mixins: [pusherApi],
    data() {
        return {
            // dataset: {},
            purchaseId: '',
            messages: [],
            message: '',
            inputList: [
                {
                    title: 'Ready Quantity',
                    icon: 'bi bi-check2'
                },
                {
                    title: 'Dispatched Quantity',
                    icon: 'bi bi-truck'
                },
                {
                    title: 'Chat Message',
                    icon: 'bi bi-chat-dots'
                },
            ],
            chats: {},
            actionName: [],
            body: '',
            chatMessage: []
        };
    },
    mounted() {
        this.purchaseId = this.$route.params.purchaseId;
        this.$store.dispatch('fetchPurchase', this.purchaseId)
    },
    created() {
        this.connect('fetchPurchase', this.purchaseId)
        // axios.get('http://192.168.1.133:8001/api/purchases/' + this.purchaseId)
        //     .then(response => {
        //         if (response.data.status === 'ok') {
        //             this.dataset = response.data.data;
        //         } else if (response.data.status === 'error') {
        //             alert(response.data.message)
        //         } else {
        //             alert('Something went wrong! Please try again')
        //         }
        //     })
        //     .catch((error) => { console.error('error getting data', error) })
    },
    computed: {
        skuCount() {
            return this.dataset.product.colors ? this.dataset.product.colors.length * this.dataset.product.sizes.length : 0;
        },
        dataset() {
            return this.$store.getters.purchase
        },
        calculateFinalQty() {
            // Calculate the gross total quantity across all sizes and colors
            let totalQty = 0;
            if (this.dataset.product) {
                if (this.dataset.product.colors && this.dataset.product.sizes && this.dataset.quantities) {
                    this.dataset.product.colors.forEach(color => {
                        this.dataset.product.sizes.forEach(size => {
                            const key = `${color.sid}_${size.sid}`;
                            totalQty += this.dataset.quantities[key] || 0;
                        });
                    });
                }
            }

            return totalQty;
        },
    },
    methods: {
        calculateSizesTotal(sizeIndex) {

            const size = this.dataset.product.sizes[sizeIndex];
            let total = 0;

            // Loop through colors to calculate the total for the given size
            for (const color of this.dataset.product.colors) {
                const key = `${color.sid}_${size.sid}`;
                total += this.dataset.quantities[key] || 0;
            }

            return total;

        },
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
        updateStatus() {
            // Create an array to hold the quantities data
            const quantitiesArray = [];
            // Iterate over colors and sizes to build the quantities array
            this.dataset.product.colors.forEach((color) => {
                this.dataset.product.sizes.forEach((size) => {
                    const key = `${color.sid}_${size.sid}`;

                    // Create an object with the color and size combination
                    const quantityObject = {};
                    quantityObject[key] = this.dataset.quantities[key] || 0; // Use 0 if the quantity is undefined

                    quantitiesArray.push(quantityObject);
                });
            });
            const message = {
                title: this.actionName.title,
                body: this.body,
            };

            this.messages.push(message);

            this.actionName = '';
            this.body = '';
            axios.put('http://192.168.1.133:8001/api/purchases/' + this.purchaseId, {
                status: 'next',
                quantities: JSON.stringify(quantitiesArray),
                message: JSON.stringify(message)
            }).then(response => {
                if (response.success) {
                    this.$router.push('/finishing-department')
                }
            })
        },
        sendMessage() {
            if (this.body.trim() !== '') {
                const message = {
                    title: this.actionName.title,
                    body: this.body,
                };
                this.messages.push(message);
                this.actionName = '';
                this.body = '';

                axios.put('http://192.168.1.133:8001/api/purchases/' + this.purchaseId, {
                    message: JSON.stringify(message)
                })
                    .then(response => {
                        console.log('Response from the API:', response.data);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        },
    }
}
</script>
<style scoped>
textarea {
    height: auto;
    min-height: 50px;
    overflow-y: hidden;
    resize: none;
}
</style>