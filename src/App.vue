<template>
  <layout>
    <router-view />
  </layout>
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
  color: white !important;
  border-radius: 10px;
  font-weight: 500;
  border: 2px solid var(--PRIMARY);
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.btn-main:hover,
.btn-main:focus {
  background-color: var(--PRIMARY-DARKER);
  color: white !important;
  border: 2px solid var(--PRIMARY-DARKER);
  box-shadow: none;
}

.btn-main-outline {
  background-color: white;
  color: var(--PRIMARY) !important;
  border-radius: 10px;
  font-weight: 500;
  border: 2px solid var(--PRIMARY);
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.btn-main-outline:hover,
.btn-main-outline:focus {
  background-color: var(--PRIMARY-DARKER);
  color: white !important;
  border: 2px solid var(--PRIMARY-DARKER);
  box-shadow: none;
}

h1,
h2 {
  font-weight: 700;
}

.form-control:hover,
.form-control:focus {
  box-shadow: none;
  border-color: var(--SECONDARY);
}

.error-msg {
  color: red;
  font-size: 14px;
}

.error-input,
.error-input:focus,
.error-input:hover {
  border-color: red;
}

.clickable {
  cursor: pointer;
}
/*navbars*/
@media (min-width: 1px) and (max-width: 576px) {
  .navbar {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
}

.navbar-toggler {
  border: none;
}

.navbar-toggler:focus {
  box-shadow: none;
}

router-link {
  color: var(--BLACK) !important;
}

.add-shadow {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.navbar-brand {
  background: -webkit-linear-gradient(
    0deg,
    var(--PRIMARY) 0%,
    var(--PRIMARY-LIGHTER) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  font-size: 2rem;
}

.navbar-nav .nav-item {
  text-align: left;
}

.navbar-nav .nav-link.active {
  width: fit-content;
}

.navbar-nav .nav-link:not(.active):hover {
  background-color: var(--GREY-LIGHT);
  border-radius: 10px;
}

.navbar-nav .nav-link.active:after {
  display: block;
  border-bottom: 2px solid var(--PRIMARY);
  content: "";
  width: 80%;
  align-self: start;
}

/*MODAL*/
.modal-content {
  border-radius: 0;
  border: none;
}

.btn-close {
  position: absolute;
  right: 1rem;
  top: 1rem;
}

/*NAVBAR - FIRST NAME BUTTON*/
.first-letter {
  border: 2px solid var(--PRIMARY);
  border-radius: 50%;
  /*color: var(--PRIMARY);*/
}

.first-letter:hover,
.first-letter:focus {
  box-shadow: none;
  color: white;
  background-color: var(--PRIMARY);
}

.dropdown-menu {
  padding: 0;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  border: none;
  overflow: hidden;
}

.dropdown-item {
  padding: 0.75rem 1rem;
}

.dropdown-item:hover,
.dropdown-item:focus,
.dropdown-item.active,
.dropdown-item:active {
  background-color: var(--GREY-LIGHT);
}

.btn-no-style:focus {
  box-shadow: none;
}

.new-item {
  color: var(--PRIMARY);
}

.add-hide-icon {
  color: var(--PRIMARY);
}

.modal-decision-button {
  width: 70%;
}

.btn-main-mobile {
  width: 100%;
}

.text-disabled {
  color: var(--GREY-DARKER);
}

.fs-smaller {
  font-size: smaller;
}

.filter-row {
  border-top: 1px solid var(--GREY);
  border-bottom: 1px solid var(--GREY);
  padding: 0.9rem 0;
  margin: 1rem 0;
  overflow-x: auto;
}

.filters-title {
  font-weight: 500;
  padding: 0.3rem 0.5rem 0.3rem 0;
  font-size: smaller;
}

.btn-filters {
  box-shadow: none;
  border-radius: 10px;
  padding: 0.3rem 0.5rem;
  margin: 0 0.3rem;
  font-size: smaller;
  white-space: nowrap;
}

.btn-filters:hover,
.btn-filters:focus {
  box-shadow: none;
  background-color: var(--GREY-LIGHT);
}

.btn-filters:active,
.btn-filters.active {
  box-shadow: none;
  background-color: var(--PRIMARY);
  color: white;
}

.filters-group {
  display: flex;
  align-items: center;
}

.filters-group:not(:first-child) {
  border-left: 1px solid var(--GREY);
}

select option[disabled]:first-child {
  display: none;
}

.table-btn:hover,
.table-btn:active,
.table-btn:focus {
  box-shadow: none;
}

.table-icon:hover,
.table-icon:active {
  color: var(--PRIMARY);
}

.table > :not(:first-child) {
  border-top: 1.5px solid currentColor;
}

.fw-500 {
  font-weight: 500;
}
</style>
