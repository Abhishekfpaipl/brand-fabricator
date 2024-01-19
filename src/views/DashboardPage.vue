<template>
  <div class="" style="padding-bottom: 80px;">
    <p class="p-2 text-center mb-0 bg-light bill border-bottom"><span class="fs-5">~ Pending Orders ~</span></p>
    <div v-if="Object.keys(issuedPo).length" class="container">
      <div v-for="(po, poIndex) in issuedPo" :key="poIndex" class="my-2">
        <transition name="slide" mode="out-in">
          <div v-if="po.status === 'issued' && !po.reject" class="card rounded-0" :key="poIndex">
            <div class="d-flex border-bottom">
              <img v-if="po.orderItems && po.orderItems.length" :src="po.orderItems[0].stock.image" class="border-end"
                style=" width: 80px; object-fit: fill;">
              <div v-if="po.orderItems" class="flex-fill d-flex flex-column justify-content-between">
                <div class="p-2">
                  <p class="truncate fw-bold mb-0" v-if="po.orderItems && po.orderItems.length">{{
                    po.orderItems[0].stock.name }}
                  </p>
                  <div class="d-flex justify-content-between">
                    <small class="">{{ po.sid }}</small>
                    <small class="">{{ po.quantity }}</small>
                  </div>
                </div>
                <div class="btn-group" role="group">
                  <button class="d-flex align-items-center justify-content-center gap-2 btn btn-dark rounded-0"
                    data-bs-toggle="collapse" :data-bs-target="'#collapseExample' + poIndex" aria-expanded="false"
                    :aria-controls="'collapseExample' + poIndex"><span>Detail</span> <i
                      class="bi bi-chevron-down"></i></button>
                  <button class="d-flex align-items-center justify-content-center gap-2 btn top-brand rounded-0"
                    v-if="po.status === 'issued'" @click="acceptPurchaseOrder(po)"><span>Accept</span> <i
                      class="bi bi-chevron-right"></i></button>
                </div>
              </div>
            </div>

            <div class="collapse" :id="'collapseExample' + poIndex">
              <div v-for="(item, itemIndex) in po.orderItems" :key="itemIndex" class="card-body border-bottom">
                <div class="d-flex align-items-center gap-3">
                  <img :src="item.stock.image" style="width: 50px; object-fit: fill;">
                  <div class="">
                    <p class="mb-0"> {{ item.stock.product_option_sid }}</p>
                    <p class="mb-0"> {{ item.quantity }} pcs</p>
                  </div>
                </div>
              </div>
              <div class="card-body p-2">
                <div class="d-flex justify-content-between align-items-center">
                  <p class="mb-0 fw-bold">Expected At</p>
                  <p class="mb-0">{{ po.expected_at }}</p>
                </div>
                <div v-for="(chat, chatIndex) in po.note" :key="chatIndex" class="p-2 alert alert-primary my-1">
                  <p class="mb-0">Order Note:-</p>
                  <p class="mb-0">{{ chat.message }}</p>
                </div>
                <div class="my-1">
                  <label for="floatingTextarea" class="fw-bold">Reason</label>
                  <textarea class="form-control as" v-model="message" id="floatingTextarea"
                    placeholder="Enter Reject Reason Or Accept Condition"></textarea>
                </div>
              </div>
              <div v-if="po.status === 'issued'" class="btn-group d-flex">
                <button class="btn btn-danger rounded-0" @click="rejectPurchaseOrder(po)"><span>Reject</span> <i
                    class="bi bi-x"></i></button>
                <button class="btn top-brand rounded-0" v-if="po.status === 'issued'"
                  @click="acceptPurchaseOrder(po)"><span>Accept</span> <i class="bi bi-check"></i></button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <NoOrder v-else></NoOrder>

  </div>
</template>

<script>
// import axios from 'axios';
import sweetAlert from '@/mixins/sweetAlert';
// import Pusher from 'pusher-js'
import NoOrder from '@/components/NoOrder.vue';
import axiosInstance from '@/axiosInstance';
// import pusherApi from '@/mixins/pusherApi.js';
export default {
  name: "DashboardPage",
  data() {
    return {
      message: '',
    };
  },
  components: { NoOrder },
  mixins: [sweetAlert],
  created() {
    // this.connect('fetchpurchaseOrders');
    this.$store.dispatch('fetchpurchaseOrders');
  },
  mounted() {
  },
  computed: {
    pos() {
      return this.$store.getters.getpurchaseOrders;
    },
    issuedPo() {
      return this.pos.filter(po => po.status === 'issued')
    }
  },
  methods: {
    showSuccessAlert() {
      this.showSweetAlert('Yay', 'Order has been accepted');
    },
    // connect(callApi) {
    //   const pusher = new Pusher('ba095b8c30f78f55d662', {
    //     cluster: 'ap2',
    //     debug: true
    //   });
    //   const channel = pusher.subscribe('Test-channel');
    //   channel.bind('Test-event', () => {
    //     this.$store.dispatch(callApi);
    //     console.log('connected');
    //   });
    // },
    showErrorAlert() {
      this.showSweetError('Oops', 'Something went wrong');
    },
    acceptPurchaseOrder(po) {
      this.$store.dispatch('acceptOrder', po)
      const token = localStorage.getItem('token');
      axiosInstance
        .put('orders/' + po.sid, {
          status: 'accepted',
          expected_at: po.expected_at, // Make sure this.po is defined
          message: this.message
        }, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          if (response.status === 'pending') {
            console.log('status changed', response.data);
          }
          this.showSuccessAlert();
        })
        .catch((error) => {
          console.error('acceptPurchaseOrder:', error);
          this.showErrorAlert();
        }) 
    },
    rejectPurchaseOrder(po) {
      const token = localStorage.getItem('token');
      axiosInstance
        // .put(`http://192.168.1.183:8000/api/orders/reject/${orderId}`, {
        .put('orders/' + po.sid, {
          message: this.message, status: 'rejected'
        }, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          if (response.status === 'pending') {
            console.log('hi');
            console.log('status changed', response.data);
          }
          this.showSuccessAlert();
          this.hideButton = true;
        })
        .catch((error) => {
          console.error('acceptPurchaseOrder:', error);
          this.showErrorAlert();
        });
    },
  },

}
</script> 
<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(-100%);
}

.slide-enter-to,
.slide-leave {
  transform: translateX(0);
}
</style>