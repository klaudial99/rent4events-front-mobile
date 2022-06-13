import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Dashboard from "@/views/Dashboard";
import Categories from "@/views/Categories";
import Vehicles from "@/views/Vehicles";
import Products from "@/views/Products";
import Drivers from "@/views/Drivers";
import Cart from "@/views/Cart";
import Offer from "@/views/Offer";
import Orders from "@/views/Orders";
import Order from "@/views/Order";
import Courses from "@/views/Courses";
import CurrentCourse from "@/views/CurrentCourse";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
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
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
  },
  {
    path: "/offer",
    name: "Offer",
    component: Offer,
  },
  {
    path: "/orders",
    name: "Orders",
    component: Orders,
  },
  {
    path: "/order/:orderId",
    name: "Order",
    component: Order,
    props: true,
  },
  {
    path: "/courses",
    name: "Courses",
    component: Courses,
  },
  {
    path: "/courses/current",
    name: "CurrentCourse",
    component: CurrentCourse,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
