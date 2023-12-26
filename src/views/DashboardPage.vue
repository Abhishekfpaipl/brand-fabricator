<template>
  <div class="" style="padding-bottom: 80px;">
    <div class="">
      <p class="p-2 text-center mb-0 bg-light bill border-bottom"><span class="fs-5">~ Pending Orders ~</span></p>
      <PoCard :po="po" :poIndex="poIndex" v-for="(po, poIndex) in pos" :key="poIndex">
      </PoCard>
    </div>

  </div>
</template>

<script>
import PoCard from '@/components/PoCard.vue'
// import NoOrder from '@/components/NoOrder.vue';
import pusherApi from '@/mixins/pusherApi.js';
export default {
  name: "DashboardPage",
  data() {
    return {
      messages: [],
    };
  },
  mixins: [pusherApi],
  components: {
    PoCard,
    // NoOrder
  },
  created() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.connect('fetchpurchaseOrders'); // Pass the action name as a parameter
    }
    this.$store.dispatch('fetchpurchaseOrders')
  },
  mounted() {
  },
  computed: {
    pos() {
      return this.$store.getters.getpurchaseOrders
    },
  },
}
</script>