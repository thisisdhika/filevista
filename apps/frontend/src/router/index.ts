import { createRouter, createWebHistory } from "vue-router";
import ExplorerView from "@/views/ExplorerView.vue";

const routes = [{ path: "/", component: ExplorerView }];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
