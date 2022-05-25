import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Dashboard from "@/views/Dashboard";
import Categories from "@/views/Categories";
import Vehicles from "@/views/Vehicles";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/home",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/categories",
    name: "Categories",
    component: Categories,
  },
  {
    path: "/vehicles",
    name: "Vehicles",
    component: Vehicles,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
