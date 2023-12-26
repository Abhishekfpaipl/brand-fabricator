<template>
  <div>
    <TopNav v-if="!hide" />
    <router-view />
    <BottomNav v-if="!bottomHide" style="bottom: 0px; position: fixed; width: 100%; z-index: 10;" />
    <button v-if="showInstallButton" @click="installApp">Install App</button>
  </div>
</template>
<script>
import BottomNav from './components/BottomNav.vue';
import TopNav from './components/TopNav.vue';

export default {
  name: 'App',
  data() {
    return {
      deferredPrompt: null,
      showInstallButton: false,
      showInstallPopup: false,
    };
  },
  components: {
    TopNav,
    BottomNav
  },
  computed: {
    hide() {
      const hiddenPages = ['RootPage', 'LoginPage', 'SaleOrderPreview', 'SaleOrderDetail', 'MaterialProcurement']
      return hiddenPages.includes(this.$route.name)
    },
    bottomHide() {
      const hiddenPages = ['RootPage', 'LoginPage',];
      return hiddenPages.includes(this.$route.name)
    }
  },
}
</script>
<style>
.top-brand {
  background-color: #25C297;
  color: white;
  --bs-btn-hover-border-color: none !important;
}
</style>
