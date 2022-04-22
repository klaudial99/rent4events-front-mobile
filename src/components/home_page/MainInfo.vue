<template>
  <div class="container">
    <div class="row">
      <div class="col-12 col-md-6">
        <div class="row h-100 d-flex justify-content-center align-items-center">
          <div class="text-center text-md-start">
            <h1 id="main-title" class="pt-3">
              Planujesz imprezę,
              <br />
              ale brakuje Ci <span id="special-text">inspiracji</span>?
            </h1>
            <h5 class="py-3">U nas na pewno znajdziesz to, czego szukasz.</h5>
            <button
              class="btn btn-main d-block my-3 mx-auto mx-md-0"
              data-bs-toggle="modal"
              data-bs-target="#loginRegisterModal"
              @click="this.$store.commit('setActiveTab', 'register')"
            >
              Dołącz do nas!
            </button>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 text-center">
        <img
          src="@/assets/home_page/main-photo.png"
          alt="Main photo"
          id="main-photo"
        />
      </div>
    </div>
    <login-register-modal />
  </div>
</template>

<script>
import LoginRegisterModal from "@/components/home_page/LoginRegisterModal";
export default {
  name: "MainInfo",
  components: { LoginRegisterModal },
};
</script>

<style scoped>
#main-photo {
  width: 100%;
}

#special-text {
  color: var(--PRIMARY);
}

h5 {
  font-weight: 400;
}
</style>
