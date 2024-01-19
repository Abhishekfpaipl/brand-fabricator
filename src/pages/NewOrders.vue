<template>
  <div>
    <div v-if="Object.keys(newOrders).length">
      <div v-for="(newOrder, newOrderIndex) in newOrders" :key="newOrderIndex">
        <transition name="slide" mode="out-in">
          <OrderCard :order="newOrder" :orderIndex="newOrderIndex" />
        </transition>
      </div>
      <OrderDetailCard :orders="newOrders" />
    </div>
    <EmptyList v-else title="No Order Available"></EmptyList>
  </div>
</template>

<script>
import EmptyList from '@/components/EmptyList.vue';
import OrderCard from '@/components/OrderCard.vue'
import OrderDetailCard from '@/components/OrderDetailCard.vue'

export default {
  name: "NewOrders",
  components: { EmptyList, OrderCard, OrderDetailCard },
  created() {
    this.$store.dispatch('fetchNewOrders');
  },
  computed: {
    newOrders() {
      return this.$store.getters.getNewOrders;
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
  transform: translateX(100%);
}

.slide-enter-to,
.slide-leave {
  transform: translateX(0);
}
</style>
