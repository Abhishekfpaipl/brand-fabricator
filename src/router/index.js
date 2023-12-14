import { createRouter, createWebHistory } from "vue-router";
import authRoutes from './auth'

const routes = [
  {
    path: "/",
    name: "RootPage",
    component: () => import('@/views/RootPage.vue'),
  },
  ...authRoutes
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
