<template>
    <div>
        <div class="mt-3">
            <div class="d-flex align-items-center">
                <div class="border p-2 py-3 ps-4 rounded-top  text-white w-100" style="background-color: #25C297 ;"
                    data-bs-toggle="collapse" data-bs-target="#collapseExampleNew" aria-expanded="false"
                    aria-controls="collapseExampleNew">
                    Chat
                </div>
            </div>
            <div class="collapse show p-2 border bg-light" id="collapseExampleNew">
                <div v-for="(test, index) in dataset" :key="index">
                    <div v-for="(message, index) in test.chats" :key="index">
                        <div class="message mt-3 mb-2  w-100 ">
                            <div class="message-content border w-100 bg-white"
                                style="word-wrap: break-word; padding: 10px !important; border-radius: 8px; border-top-right-radius: 15px; border-bottom-left-radius: 15px; border-bottom-right-radius: 0px !important; ">
                                <small>
                                    <small class="text-primary">@ {{ message.sender_id.name }}</small>
                                </small>
                                <p class="mb-0">
                                    {{ message.message }}
                                </p>
                            </div>
                            <div class="text-end text-muted" style="font-size: 10px;">{{
                                formatMessageTime(message.delivered_at) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div class="pb-2 ">
            <div class=" d-flex bg-light p-2 align-items-center">
                <input v-model="body" type="text" class="form-control" placeholder="Type your message..." required />
                <div @click="sendMessage" class="ms-2 "><i class="bi bi-telegram fs-1   p-3" style="color: #25C297;"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import pusherApi from '@/mixins/pusherApi';
export default {
    name: 'ProductionChat',
    props: ['dataset'],
    mixins: [pusherApi],
    data() {
        return {
            purchaseId: '',
            messages: [],
            actionName: [],
            body: '',
            ledgerSid: ''
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
        sendMessage() {
            const token = localStorage.getItem('token');
            axios.post('http://192.168.1.133:8001/api/chats',
                {
                    message: this.body,
                    ledger_sid: this.dataset[0].sid,
                }, {
                headers: { "Authorization": `Bearer ${token}` }
            }).then((res) => {
                console.log(res.data)
                this.body = ''
            });
        },

    },
    // mounted() {
    //     this.purchaseId = this.$route.params.purchaseId;
    //     this.$store.dispatch('fetchPurchase', this.purchaseId)
    // },
    // created() {
    //     this.connect('fetchPurchase', this.purchaseId)
    // }
}
</script>

<style lang="scss" scoped></style>