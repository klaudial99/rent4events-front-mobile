<template>
  <div class="layout">
    <navbar-client v-if="this.$store.getters.getRole === 'Customer'" />
    <navbar-driver v-else-if="this.$store.getters.getRole === 'Driver'" />
    <navbar-manager v-else-if="this.$store.getters.getRole === 'Manager'" />
    <navbar-guest v-else />
    <slot />
    <button class="scroll-top" id="scroll-btn" @click="scrollTop">
      <font-awesome-icon :icon="['fa', 'arrow-up']" />
    </button>
    <div id="footer">
      <site-footer class="py-5" />
    </div>
  </div>
</template>

<script>
import NavbarGuest from "@/components/navbars/NavbarGuest";
import NavbarDriver from "@/components/navbars/NavbarDriver";
import NavbarManager from "@/components/navbars/NavbarManager";
import NavbarClient from "@/components/navbars/NavbarClient";
import SiteFooter from "@/components/SiteFooter";
export default {
  name: "Layout",
  components: {
    NavbarGuest,
    NavbarClient,
    NavbarManager,
    NavbarDriver,
    SiteFooter,
  },
  methods: {
    handleScroll() {
      let scrollToTopBtn = document.getElementById("scroll-btn");
      if (window.scrollY > 500) scrollToTopBtn.classList.add("show-btn");
      else scrollToTopBtn.classList.remove("show-btn");
    },
    scrollTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
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
    document.addEventListener("scroll", this.handleScroll);
  },
};
</script>

<style scoped>
.scroll-top {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  border: none;
  color: white;
  background-color: #3b3b3b;
  position: fixed;
  bottom: 25px;
  right: 25px;

  z-index: 100;
  opacity: 0;
  transform: translateY(100px);
  transition: all 0.7s ease;
}

.show-btn {
  opacity: 0.75;
  transform: translateY(0);
}

#footer {
  background-color: var(--SECONDARY);
}
</style>
