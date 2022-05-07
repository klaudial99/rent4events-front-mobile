<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top">
    <div class="container">
      <a class="navbar-brand" href="#">rent4events</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarDriverContent"
        aria-controls="navbarDriverContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarDriverContent">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item pe-3">
            <router-link class="nav-link active" to="">HOME</router-link>
          </li>
          <li class="nav-item pe-3">
            <router-link class="nav-link" to="">OFERTA</router-link>
          </li>
          <li class="nav-item pe-3">
            <router-link class="nav-link" to="">ZAMÓWIENIA</router-link>
          </li>
          <li class="nav-item pe-3">
            <router-link class="nav-link" to="">KADRA</router-link>
          </li>
          <li class="nav-item pe-3">
            <router-link class="nav-link" to="">POJAZDY</router-link>
          </li>
          <li class="nav-item pe-3">
            <router-link class="nav-link" to="">KURSY</router-link>
          </li>
          <li class="nav-item pe-3">
            <router-link class="nav-link" to="">ASORTYMENT</router-link>
          </li>
          <li class="nav-item pe-3">
            <router-link class="nav-link" to="">RAPORTY</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavbarManager",
};
</script>

<style scoped>
.nav-link {
  padding-right: 0.5rem;
  padding-left: 0.5rem;
}
</style>
