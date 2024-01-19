<template>
  <div>
    <router-view />
    <button v-if="showInstallButton" @click="installApp">Install App</button>
  </div>
</template>
<script>
import Pusher from 'pusher-js';
import Store from './store';
import SweetAlert from './mixins/sweet-alert';
export default {
  name: 'App',
  data() {
    return {
      deferredPrompt: null,
      showInstallButton: false,
      showInstallPopup: false,
    };
  },
  mounted() {
    const pusher = new Pusher('ba095b8c30f78f55d662', {
      cluster: 'ap2',
      debug: true
    });
    const channel = pusher.subscribe('Test-channel');
    channel.bind('Test-event', (data) => {
      this.parseApiAndReloadData(data)
      console.log(data)
    });
  },
  methods: {
    parseApiAndReloadData(data) {
      let message = data.message;
      if (message) {
        var array = message.split('#');
        var event = array[0];
        var payload = array[1];
        this.reloadApiData(event, payload);
      }
    },
    reloadApiData(event, payload = null) {
      Store.dispatch('fetchDashboard');
      switch (event) {
        case 'new_order':
          SweetAlert.showSweetAlert('Ypee!', 'New Order Arrived')
          Store.dispatch('fetchNewOrders');
          break;

        case 'update_order':
          Store.dispatch('fetchNewOrders');
          if (payload === 'accepted' || payload === 'rejected') {
            Store.dispatch('fetchFilteredOrders', { status: 'accepted' });
            if (payload === 'accepted') {
              SweetAlert.showSweetAlert('Great', 'Order Accepted')
            } else if (payload === 'rejected') {
              SweetAlert.showSweetAlert('Done', 'Order Rejected')
            }
          } else if (payload) {
            SweetAlert.showSweetAlert('Alert', payload)
          }
          break;

        case 'new_ready':
          if (payload) {
            SweetAlert.showSweetAlert('Done', 'Ready Added Successfully')
            Store.dispatch('fetchStockLedger', { ledger_sid: payload });
          }
          break;

        case 'new_demand':
          if (payload) {
            SweetAlert.showSweetAlert('Done', 'New Demand Arrived')
            Store.dispatch('fetchStockLedger', { ledger_sid: payload });
          }
          break;

        case 'new_dispatch':
          if (payload) {
            SweetAlert.showSweetAlert('Done', 'Dispatched Successfully')
            Store.dispatch('fetchStockLedger', { ledger_sid: payload });
          }
          break;

        case 'update_dispatch':
          if (payload) {
            SweetAlert.showSweetAlert('Yes', 'Dispatch Updated')
            Store.dispatch('fetchDispatches');
          }
          break;

        case 'new_purchase':
          SweetAlert.showSweetAlert('Done', 'New Purchase Created')
          Store.dispatch('fetchDispatches');
          Store.dispatch('fetchSales');

          break;

        case 'new_adjustment':
          if (payload) {
            SweetAlert.showSweetAlert('Done', 'New Adjustment Created')
            Store.dispatch('fetchStockLedger', { ledger_sid: payload });
          }
          break;

        case 'new_chat':
          if (payload) {
            Store.dispatch('reloadLedgerChats', { ledger_sid: payload })
          }
          break;

        default: break;
      }
    },
  }
}
</script>
<style>
body {
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* Internet Explorer/Edge */
}

/* WebKit-specific style to hide the scrollbar */
body::-webkit-scrollbar {
  display: none;
}

.top-brand {
  background-color: #25C297;
  color: white;
  --bs-btn-hover-border-color: none !important;
}

.bg-fullscreen {
  background-size: cover;
  background-position: center;
  /* height: 100%; */
  width: 100%;
  overflow: hidden;
}

.brand-text {
  color: #25C297;
}

.small {
  font-size: 14px;
}

.smaller {
  font-size: 12px;
}

.truncate {
  font-size: 13px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
