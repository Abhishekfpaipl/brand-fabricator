<template>
  <div>
    <div v-if="Object.keys(newPurchases).length">
      <div v-for="(newPurchase, newPurchaseIndex) in newPurchases" :key="newPurchaseIndex">
        <transition name="slide" mode="out-in">
          <PurchaseCard :purchase="newPurchase" :purchaseIndex="newPurchaseIndex" />
        </transition>
      </div>
      <PurchaseDetailCard :purchases="newPurchases" />
    </div>
    <EmptyList v-else title="No Purchase Available"></EmptyList>
  </div>
</template>

<script>
import EmptyList from '@/components/EmptyList.vue';
import PurchaseCard from '@/components/PurchaseCard.vue'
import PurchaseDetailCard from '@/components/PurchaseDetailCard.vue'
export default {
  name: "NewPurchase",
  components: { PurchaseCard, EmptyList, PurchaseDetailCard },
  data() {
    return {
      action: 'Procure'
    };
  },
  computed: {
    newPurchases() {
      return this.$store.getters.getFilteredOrders;
    },
  },
  mounted() {
    this.$store.dispatch('fetchFilteredOrders', { status: 'accepted' });
  }, 
}
</script>
