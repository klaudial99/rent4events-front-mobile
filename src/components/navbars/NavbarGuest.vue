<template>
  <nav class="navbar navbar-expand-md navbar-light bg-white sticky-top">
    <div class="container">
      <a class="navbar-brand" href="#">rent4events</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarGuestContent"
        aria-controls="navbarGuestContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarGuestContent">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item me-3">
            <a
              class="nav-link"
              href="#"
              data-bs-toggle="modal"
              data-bs-target="#loginRegisterModal"
              @click="this.$store.commit('setActiveTab', 'login')"
              >Zaloguj się</a
            >
          </li>
          <li class="nav-item">
            <button
              class="btn btn-main-outline"
              type="submit"
              data-bs-toggle="modal"
              data-bs-target="#loginRegisterModal"
              @click="this.$store.commit('setActiveTab', 'register')"
            >
              Dołącz do nas!
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavbarGuest",
};
</script>

<style scoped>
.nav-item {
  text-align: right !important;
}
</style>
