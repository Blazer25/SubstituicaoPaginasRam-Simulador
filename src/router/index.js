import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home/index.vue";
import Fifo from "../views/Fifo/index.vue";
import Lfu from "../views/Lfu/index.vue";

const routes = [
  {
    path: "/",
    name: "Home_",
    component: Home,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/fifo",
    name: "Fifo",
    component: Fifo,
  },
  {
    path: "/lfu",
    name: "Lfu",
    component: Lfu,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
