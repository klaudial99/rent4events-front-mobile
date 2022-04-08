<template>
  <layout>
    <router-view />
  </layout>
  <!--  <div id="nav">-->
  <!--    <router-link to="/">Home</router-link> |-->
  <!--    <router-link to="/about">About</router-link>-->
  <!--  </div>-->
  <!--  <router-view />-->
</template>

<script>
import Layout from "@/components/Layout";
export default {
  components: {
    Layout,
  },
};
</script>

<style>
@import "./assets/colors.css";

#app {
  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  font-family: "source-sans-pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-size: 1rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--BLACK);
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.btn-main {
  background-color: var(--PRIMARY);
  color: white;
  border-radius: 0;
  border: 1px solid var(--PRIMARY);
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.btn-main:hover,
.btn-main:focus {
  background-color: var(--PRIMARY-DARKER);
  color: white;
  border: 1px solid var(--PRIMARY-DARKER);
  box-shadow: none;
}

.btn-main-outline {
  background-color: white;
  color: var(--PRIMARY);
  border-radius: 0;
  border: 1px solid var(--PRIMARY);
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.btn-main-outline:hover,
.btn-main-outline:focus {
  background-color: var(--PRIMARY-DARKER);
  color: white;
  border: 1px solid var(--PRIMARY-DARKER);
  box-shadow: none;
}

h1,
h2 {
  font-weight: 700;
}
</style>
