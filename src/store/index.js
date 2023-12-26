import axios from "axios";
import { createStore } from "vuex";

export default createStore({
  state: {
    purchaseOrders: [],
    // purchases: [],
    // saleOrder: [],
    stocks: [],
    stock: {},
    ledgerEntries: [
      {
        date: '23 Dec 23', order: 10000, ready: '', demand: '',
        color: [
          {
            img: 'https://fabricpandit.com/cdn/shop/files/fabric-pandit-fabric-peacock-blue-color-plain-cotton-satin-fabric-width-42-inches-36447076286639_1400x.jpg?v=1686052205',
            qty: 5000
          },
          {
            img: "https://recovo.co/wp-content/uploads/2023/04/portadas-NEWSLETTER-98.jpg",
            qty: 5000
          },
        ]
      },
      {
        date: '24 Dec 23', order: 5000, ready: '', demand: '',
        color: [
          {
            img: 'https://fabricpandit.com/cdn/shop/files/fabric-pandit-fabric-peacock-blue-color-plain-cotton-satin-fabric-width-42-inches-36447076286639_1400x.jpg?v=1686052205',
            qty: 2500
          },
          {
            img: "https://recovo.co/wp-content/uploads/2023/04/portadas-NEWSLETTER-98.jpg",
            qty: 2500
          },
        ]
      },
      {
        date: '25 Dec 23', order: '', ready: 6000, demand: '',
        color: [
          {
            img: 'https://fabricpandit.com/cdn/shop/files/fabric-pandit-fabric-peacock-blue-color-plain-cotton-satin-fabric-width-42-inches-36447076286639_1400x.jpg?v=1686052205',
            qty: 3000
          },
          {
            img: "https://recovo.co/wp-content/uploads/2023/04/portadas-NEWSLETTER-98.jpg",
            qty: 3000
          },
        ]
      },
      {
        date: '26 Dec 23', order: '', ready: '', demand: 3000,
        color: [
          {
            img: 'https://fabricpandit.com/cdn/shop/files/fabric-pandit-fabric-peacock-blue-color-plain-cotton-satin-fabric-width-42-inches-36447076286639_1400x.jpg?v=1686052205',
            qty: 1500
          },
          {
            img: "https://recovo.co/wp-content/uploads/2023/04/portadas-NEWSLETTER-98.jpg",
            qty: 1500
          },
        ]
      },
    ],
    ledgers: [],
    activeEntry: {}
  },
  getters: {
    getpurchaseOrders: state => state.purchaseOrders,
    // getSaleOrder: state => state.saleOrder,
    getLedgerEntries: state => state.ledgerEntries,
    getActiveEntry: state => state.activeEntry,
    // getPurchases: state => state.purchases,
    getStocks: state => state.stocks,
    getStock: state => state.stock,
    getLedgers: state => state.ledgers,
  },
  mutations: {
    PurchaseOrder(state, data) {
      state.purchaseOrders = data
    },
    // saleOrder(state, data) {
    //   state.saleOrder = data
    // },
    // setPurchases(state, data) {
    //   state.purchases = data
    // },
    setStocks(state, data) {
      state.stocks = data
    },
    setStock(state, data) {
      state.stock = data
    },
    setLedgers(state, data) {
      state.ledgers = data
    },
    showActiveEntry(state, data) {
      state.activeEntry = data
    },
    hideActiveEntry(state) {
      state.activeEntry = {}
    }
  },
  actions: {
    fetchpurchaseOrders({ commit }) {
      const token = localStorage.getItem('token')
      axios.get('http://192.168.1.133:8001/api/orders', {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(response => {
          if (response.data.status === 'ok') {
            commit('PurchaseOrder', response.data.data)
          } else if (response.data.status === 'error') {
            alert(response.data.message);
          } else {
            alert('Something went wrong! Please try again');
          }
        })
        .catch((error) => { console.error('fetchpurchaseOrders:', error) })
    },
    // fetchSaleOrder({ commit }, data) {
    //   axios.get('http://192.168.1.133:8003/api/saleorder/' + data.jwoId + '/' + data.fabId)
    //     .then(response => {
    //       // commit('saleOrder', response.data.data)
    //       if (response.data.status === 'ok') {
    //         console.log('test', response.data.data)
    //         commit('saleOrder', response.data.data)
    //       } else if (response.data.status === 'error') {
    //         alert(response.data.message)
    //       } else {
    //         alert('Something went wrong! Please try again')
    //       }
    //     })
    //     .catch((error) => { console.error('fetchSaleOrder', error) })
    // },
    // fetchPurchases({ commit }) {
    //   axios.get('http://192.168.1.133:8001/api/purchases')
    //     .then(response => {
    //       if (response.data.status === 'ok') {
    //         commit('setPurchases', response.data.data)
    //       } else if (response.data.status === 'error') {
    //         alert(response.data.message)
    //       } else {
    //         alert('Something went wrong! Please try again')
    //       }
    //     })
    // },
    fetchStocks({ commit }) {
      const token = localStorage.getItem('token')
      axios.get('http://192.168.1.133:8001/api/stocks', {
        headers: { "Authorization": `Bearer ${token}` }
      }).then((response) => {
        if (response.data.status === 'ok') {
          commit('setStocks', response.data.data)
        } else if (response.data.status === 'error') {
          alert(response.data.message)
        } else {
          alert('Something went wrong! Please try again')
        }
      })
    },
    fetchStock({ commit }, data) {
      const token = localStorage.getItem('token')
      axios.get('http://192.168.1.133:8001/api/stocks/' + data, {
        headers: { "Authorization": `Bearer ${token}` }
      }).then((response) => {
        if (response.data.status === 'ok') {
          commit('setStock', response.data.data)
        } else if (response.data.status === 'error') {
          alert(response.data.message)
        } else {
          alert('Something went wrong! Please try again')
        }
      })
    },
    fetchLedgers({ commit }, data) {
      const token = localStorage.getItem('token')
      axios.get('http://192.168.1.133:8001/api/ledgers', {
        params: { product_sid: data },
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then((response) => {
          commit('setLedgers', response.data.data)
        })
        .catch((error) => {
          console.error('Error fetching ledger:', error);
        });
    },
    showActiveEntry({ commit }, data) {
      commit('showActiveEntry', data)
    },
    hideActiveEntry({ commit }, data) {
      commit('hideActiveEntry', data)
    },
  },
  modules: {},
});
