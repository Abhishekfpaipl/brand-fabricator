// import axios from "axios";
// import Cookies from 'js-cookies';
import { createStore } from "vuex";
// import SweetAlert from '@/mixins/sweet-alert';
// const axiosInstance = axios.create({
//   baseURL: 'http://192.168.1.183:8000/api/', // Your base URL
// });
import axiosInstance from "@/axiosInstance";

const token = localStorage.getItem('token')
export default createStore({
  state: {
    newOrders: [],
    filteredOrders: [],
    stocks: [],
    stock: {},
    ledgers: [],
    dispatches: [],
    fabricator: {},
    activeEntry: {},
    action: false,
    sales: [],
    dashboard: [],
    ledgerChats: {
      chats: [],
      ledger: {},
      pagination: {}
    },
  },
  getters: {
    getNewOrders(state) {
      return state.newOrders
    },
    getFilteredOrders(state) {
      return state.filteredOrders
    },
    getLedgerEntries: state => state.ledgerEntries,
    getActiveEntry: state => state.activeEntry,
    getStocks: state => state.stocks,
    getStock: state => state.stock,
    getLedgers: state => state.ledgers,
    getLedgerChats: state => state.ledgerChats,
    getDispatches: state => state.dispatches,
    getFabricator: state => state.fabricator,
    getSales: state => state.sales,
    getDashboard: state => state.dashboard,
  },
  mutations: {
    actionDone(state) {
      state.action = true;
    },
    setNewOrders(state, data) {
      state.newOrders = data
    },
    setFilteredOrders(state, data) {
      state.filteredOrders = data
    },
    setStocks(state, data) {
      state.stocks = data
    },
    setStock(state, data) {
      state.stock = data
    },
    setLedgers(state, data) {
      state.ledgers = data
    },
    setLedgerChats(state, data) {
      state.ledgerChats.ledger = data.ledger;
      state.ledgerChats.pagination = data.pagination;
      state.ledgerChats.chats = [...data.chats, ...state.ledgerChats.chats];
    },
    setLedgerChat(state, data) {
      state.ledgerChats.chats = data.chats;
    },
    setDispatches(state, data) {
      state.dispatches = data
    },
    setSales(state, data) {
      state.sales = data
    },
    setDashboard(state, data) {
      state.dashboard = data
    },
    setFabricator(state, data) {
      state.fabricator = data
    },
    showActiveEntry(state, data) {
      state.activeEntry = data
    },
    hideActiveEntry(state) {
      state.activeEntry = {}
    },
  },
  actions: {

    // Fetch issued or Accepted order
    fetchNewOrders({ commit }) {
      console.log('hit');
      // const token = Cookies.get('token'); 
      axiosInstance.get('orders', {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(response => {
          if (response.data.status === 'ok') {
            commit('setNewOrders', response.data.data)
          } else if (response.data.status === 'error') {
            alert(response.data.message);
          } else {
            alert('Something went wrong! Please try again');
          }
        })
        .catch((error) => { console.error('fetchOrders:', error) })
    },

    fetchFilteredOrders({ commit }, data) {
      console.log('hit');
      axiosInstance.get('orders?status=' + data.status, {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(response => {
          if (response.data.status === 'ok') {
            commit('setFilteredOrders', response.data.data)
          } else if (response.data.status === 'error') {
            alert(response.data.message);
          } else {
            alert('Something went wrong! Please try again');
          }
        })
        .catch((error) => { console.error('fetchOrders:', error) })
    },

    // Accept or Reject Order
    orderAction({ commit }, data) {
      axiosInstance
        .put('orders/' + data.sid, {
          status: data.status,
          content: data.content,
          expected_at: data.expected_at,
        }, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          if (response.status === 'pending') {
            commit('actionDone')
          }
        })
        .catch((error) => {
          console.error('acceptPurchaseOrder:', error);
        })
    },

    fetchDispatches({ commit }) {
      axiosInstance.get('dispatches', {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(response => {
          if (response.data.status === 'ok') {
            commit('setDispatches', response.data.data)
          } else if (response.data.status === 'error') {
            alert(response.data.message);
          } else {
            alert('Something went wrong! Please try again');
          }
        })
        .catch((error) => { console.error('fetchOrders:', error) })
    },

    fetchStocks({ commit }) {
      axiosInstance.get('mystocks', {
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

    fetchStockLedger({ commit }, payload) {
      const page = payload.page || 1;
      axiosInstance.get(`ledgers/${payload.ledger_sid}?page=${page}`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then((response) => {
          commit('setLedgers', response.data.data);
        })
        .catch((error) => {
          console.error('Error fetching ledger:', error);
        });
    },

    fetchLedgerChats({ commit }, payload) {
      const page = payload.page || 1;
      axiosInstance.get(`chats/${payload.ledger_sid}?page=${page}`, {
        headers: { "Authorization": `Bearer ${token}` }
      }).then((response) => {
        if (response.data.status === 'ok') {
          commit('setLedgerChats', response.data.data)
        } else if (response.data.status === 'error') {
          alert(response.data.message);
        } else {
          alert('Something went wrong! Please try again');
        }
      });
    }, 
    reloadLedgerChats({ commit }, payload) {
      axiosInstance.get(`chats/${payload.ledger_sid}?page=1`, {
        headers: { "Authorization": `Bearer ${token}` }
      }).then((response) => {
        if (response.data.status === 'ok') {
          commit('setLedgerChat', response.data.data)
        } else if (response.data.status === 'error') {
          alert(response.data.message);
        } else {
          alert('Something went wrong! Please try again');
        }
      });
    },

    postAdjustment({ commit }, data) {
      axiosInstance.post('adjustments', data,
        { headers: { "Authorization": `Bearer ${token}` } })
        .then((response) => {
          if (response.status === 'ok') {
            commit('actionDone')
          }
        })
        .catch((error) => {
          console.error('postAdjustment:', error);
        })
    },
    postReady({ commit }, data) {
      axiosInstance.post('readies', data,
        { headers: { "Authorization": `Bearer ${token}` } })
        .then((response) => {
          if (response.status === 'pending') {
            commit('actionDone')
          }
        })
        .catch((error) => {
          console.error('acceptPurchaseOrder:', error);
        })
    },

    postDispatch({ commit }, data) {
      axiosInstance.post('dispatches', data,
        { headers: { "Authorization": `Bearer ${token}` } })
        .then((response) => {
          if (response.status === 'pending') {
            commit('actionDone')
          }
        })
        .catch((error) => {
          console.error('acceptPurchaseOrder:', error);
        })

    },

    fetchSales({ commit }) {
      axiosInstance.get('purchases', {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then((response) => {
          if (response.data.status === 'ok') {
            commit('setSales', response.data.data)
          } else if (response.data.status === 'error') {
            alert(response.data.message)
          } else {
            alert('Something went wrong! Please try again')
          }
        })
        .catch((error) => {
          console.error('fetchSales:', error);
        })
    },

    fetchDashboard({ commit }) {
      axiosInstance.get('dashboard', {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then((response) => {
          if (response.data.status === 'ok') {
            commit('setDashboard', response.data.data)
          } else if (response.data.status === 'error') {
            alert(response.data.message)
          } else {
            alert('Something went wrong! Please try again')
          }
        })
        .catch((error) => {
          console.error('fetchDashboard:', error);
        })
    },
    showActiveEntry({ commit }, data) {
      commit('showActiveEntry', data)
    },
    hideActiveEntry({ commit }, data) {
      commit('hideActiveEntry', data)
    },
    statusCheck({ commit }, data) {
      commit('statusCheck', data)
    },
    test111({ commit }, data) {
      alert(data)
      commit('statusCheck', data)
    }
  },
  modules: {},
});
