<template>
  <div
    class="modal fade"
    id="loginRegisterModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body position-relative">
          <button
            id="loginRegisterModalClose"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
          <div class="container">
            <div class="row">
              <div class="col">
                <ul
                  class="nav nav-pills justify-content-around mb-3"
                  id="pills-tab"
                  role="tablist"
                >
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link"
                      :class="{
                        active: this.$store.getters.getActiveTab === 'login',
                      }"
                      @click="this.$store.commit('setActiveTab', 'login')"
                      id="pills-login-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-login"
                      type="button"
                      role="tab"
                      aria-controls="pills-home"
                      aria-selected="true"
                    >
                      <span>Logowanie</span>
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link"
                      :class="{
                        active: this.$store.getters.getActiveTab === 'register',
                      }"
                      @click="this.$store.commit('setActiveTab', 'register')"
                      id="pills-register-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-register"
                      type="button"
                      role="tab"
                      aria-controls="pills-register"
                      aria-selected="false"
                    >
                      <span>Rejestracja</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col px-4">
              <div class="tab-content" id="pills-tabContent">
                <div
                  class="tab-pane fade"
                  :class="{
                    active: this.$store.getters.getActiveTab === 'login',
                    show: this.$store.getters.getActiveTab === 'login',
                  }"
                  id="pills-login"
                  role="tabpanel"
                  aria-labelledby="pills-login-tab"
                >
                  <login-form />
                </div>
                <div
                  class="tab-pane fade"
                  :class="{
                    active: this.$store.getters.getActiveTab === 'register',
                    show: this.$store.getters.getActiveTab === 'register',
                  }"
                  id="pills-register"
                  role="tabpanel"
                  aria-labelledby="pills-register-tab"
                >
                  <register-form />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from "@/components/home_page/LoginForm";
import RegisterForm from "@/components/home_page/RegisterForm";

export default {
  name: "LoginRegisterModal",
  components: {
    LoginForm,
    RegisterForm,
  },
};
</script>

<style scoped>
.modal-content {
  border-radius: 0;
  border: none;
}

.modal-header {
  border-bottom: none;
}

.btn-close {
  position: absolute;
  right: 1rem;
  top: 1rem;
}

.nav-link {
  color: var(--BLACK);
  transition: all 0.4s ease-in-out;
  font-size: 20px;
  transform: scale(0.8);
}

.nav-link:hover,
.nav-link:focus {
  color: var(--PRIMARY);
  transform: scale(1);
  font-weight: 600;
}

.nav-link.active,
.nav-item.show .nav-link {
  color: var(--PRIMARY);
  background: none;
  transform: scale(1.1);
  font-weight: 600;
}

.modal,
.modal * {
  transition: all 0.3s ease;
}
</style>
