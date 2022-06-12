<template>
  <nav class="navbar navbar-expand-md navbar-light bg-white sticky-top">
    <div class="container">
      <a class="navbar-brand" href="#">rent4events</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarClientContent"
        aria-controls="navbarClientContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarClientContent">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item pe-3">
            <router-link
              class="nav-link"
              :class="{ active: this.$route.name === 'Dashboard' }"
              :to="{ name: 'Dashboard' }"
              >HOME</router-link
            >
          </li>
          <li class="nav-item pe-3">
            <router-link
              class="nav-link"
              :class="{ active: this.$route.name === 'Offer' }"
              :to="{ name: 'Offer' }"
              >OFERTA</router-link
            >
          </li>
          <li class="nav-item pe-3">
            <router-link
              class="nav-link"
              :class="{ active: this.$route.name === 'Orders' }"
              to=""
              >ZAMÓWIENIA</router-link
            >
          </li>

          <li class="nav-item pe-3">
            <div class="dropdown">
              <button
                class="btn first-letter"
                type="button"
                id="dropdownMenuAccount"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span class="">{{
                  this.$store.getters.getFirstName.charAt(0)
                }}</span>
              </button>
              <ul
                class="dropdown-menu dropdown-menu-end"
                aria-labelledby="dropdownMenuAccount"
              >
                <li><a class="dropdown-item" href="#">Ustawienia</a></li>
                <li>
                  <a @click="logout" class="dropdown-item" href="#"
                    >Wyloguj się</a
                  >
                </li>
              </ul>
            </div>
          </li>
          <li class="nav-item pe-3">
            <router-link class="nav-link cart px-3" :to="{ name: 'Cart' }">
              <font-awesome-icon :icon="['fa', 'cart-shopping']" />
              <span class="cart-money ms-3 align-self-center"
                >{{
                  this.$func_global.formatPrice(
                    this.$store.getters.getTotalCost
                  )
                }}
                zł</span
              >
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavbarClient",
  methods: {
    logout() {
      const url = `${this.apiURL}api/Account/LogOff`;
      this.axios
        .post(url)
        .then(() => {
          this.$store.replaceState({});
          this.$store.commit("setRole", "guest");
          this.$router.push({ name: "Home" });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.nav-link {
  padding-right: 0.5rem;
  padding-left: 0.5rem;
}

.navbar-nav .cart {
  background-color: var(--PRIMARY) !important;
  color: white;
  border-radius: 10px;
}

.navbar-nav .cart:hover,
.navbar-nav .cart:focus {
  background-color: var(--PRIMARY-DARKER) !important;
  color: white;
}

.cart-money {
  font-size: smaller;
}
</style>
