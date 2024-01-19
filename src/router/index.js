import { createRouter, createWebHistory } from "vue-router";
import authRoutes from './auth'

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: "/dashboard",
    name: "MyDashboard",
    component: () => import('@/pages/MyDashboard.vue'),
  },
  {
    path: "/",
    component: () => import('@/AppLayout.vue'),
    children: [
      {
        path: "/new-orders",
        name: "NewOrders",
        component: () => import('@/pages/NewOrders.vue'),
        children: []
      },
      {
        path: "/purchase-orders",
        name: "NewPurchase",
        component: () => import('@/pages/NewPurchase.vue'),
    
      },
      {
        path: "/running-orders",
        children: [
          {
            path: "",
            name: "RunningOrders",
            component: () => import('@/pages/RunningOrders.vue'),
          },
          {
            path: ":ledger_sid",
            name: "RunningOrderLedger",
            component: () => import('@/pages/RunningOrderLedger.vue'),
          },
        ]
      },
      {
        path: "/dispatch-orders",
        name: "DispatchOrders",
        component: () => import('@/pages/DispatchOrders.vue'),
    
      },
      {
        path: "/sale-orders",
        name: "MySales",
        component: () => import('@/pages/MySales.vue'),
    
      },
      {
        path: "/profile",
        name: "MyProfile",
        component: () => import('@/pages/MyProfile.vue'),
      },
    ],
  },
  {
    path: "/running-orders/:ledger_sid/chats",
    name: "LedgerChats",
    component: () => import('@/pages/LedgerChats.vue'),
  },
  ...authRoutes
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
