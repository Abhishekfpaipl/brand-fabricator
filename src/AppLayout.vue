<template>
  <div>
    <!-- <TopNav v-if="!hide" /> -->
    <div style="margin-bottom: 60px;">
      <router-view />
    </div>
    <BottomNav v-if="!bottomHide" style="bottom: 0px; position: fixed; width: 100%; z-index: 10;" />
  </div>
</template>
<script>
import BottomNav from './components/BottomNav.vue';
// import TopNav from './components/TopNav.vue';
export default {
  name: 'AppLayout',
  components: {
    // TopNav,
    BottomNav
  },
  computed: {
    hide() {
      const hiddenPages = ['RootPage', 'LoginPage', 'SaleOrderPreview', 'SaleOrderDetail', 'MaterialProcurement', 'CatalogLedger']
      return hiddenPages.includes(this.$route.name)
    },
    bottomHide() {
      const hiddenPages = ['RootPage', 'LoginPage', 'MyDashboard'];
      return hiddenPages.includes(this.$route.name)
    }
  },
}
</script> 
