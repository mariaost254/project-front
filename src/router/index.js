import { createRouter, createWebHistory } from "vue-router";
import UsersPageView from "../views/UsersPageView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: UsersPageView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
