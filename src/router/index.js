import { createRouter, createWebHistory } from "vue-router";
import authRoutes from './auth'

const routes = [
  {
    path: "/",
    name: "RootPage",
    component: () => import('@/views/RootPage.vue'),
  },
  {
    path: "/dashboard",
    name: "PurchaseOrders",
    component: () => import('@/views/DashboardPage.vue'),
    children: []
  },
  {
    path: "/material",
    children: [
      {
        path: "accepted",
        name: "MaterialAccepted",
        component: () => import('@/views//material/MaterialAccepted.vue'),
      },
      {
        path: "procurement/:poId",
        name: "MaterialProcurement",
        component: () => import('@/views/material/MaterialProcurement.vue'),
      }
    ]
  },
  {
    path: "/saleOrder",
    children: [
      {
        path: "list",
        name: "ReadyCatalogList",
        component: () => import('@/views/saleOrders/SaleOrderList.vue'),
      },
      {
        path: "detail-page/:purchaseId",
        name: "SaleOrderDetail",
        component: () => import('@/views/saleOrders/SaleOrderDetail.vue'),
      },
      {
        path: "preview-page/:purchaseId",
        name: "SaleOrderPreview",
        component: () => import('@/views/saleOrders/SaleOrderPreviewPage.vue'),
      },
      {
        path: "catalog-ledger/:catalogId",
        name: "CatalogLedger",
        component: () => import('@/views/CatalogLedger.vue'),
      },
    ]
  },
  {
    path: "/profile",
    name: "Profile Page",
    component: () => import('@/views/ProfilePage.vue'),
  },
  ...authRoutes
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
