<template>
  <nav class="navbar navbar-expand-md navbar-light bg-white sticky-top">
    <div class="container">
      <a class="navbar-brand" href="#">rent4events</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
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
  methods: {
    shadowOnScroll() {
      window.onscroll = () => {
        const nav = document.querySelector(".navbar");
        if (window.scrollY > 0) {
          nav.classList.add("add-shadow");
        } else {
          nav.classList.remove("add-shadow");
        }
      };
    },
  },
  mounted() {
    this.shadowOnScroll();
  },
};
</script>

<style scoped>
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
.nav-item {
  text-align: right;
}

.nav-link {
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
</style>
