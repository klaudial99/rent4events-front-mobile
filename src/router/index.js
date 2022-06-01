import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Dashboard from "@/views/Dashboard";
import Categories from "@/views/Categories";
import Vehicles from "@/views/Vehicles";
import Products from "@/views/Products";
import Drivers from "@/views/Drivers";

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
  {
    path: "/products",
    name: "Products",
    component: Products,
  },
  {
    path: "/drivers",
    name: "Drivers",
    component: Drivers,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
