<template>
  <form @submit.prevent="login" novalidate>
    <div class="mb-3 text-start">
      <label for="emailInputLogin" class="form-label">Adres email:</label>
      <input
        @blur="v$.loginEmail.$touch"
        type="email"
        class="form-control"
        id="emailInputLogin"
        aria-describedby="emailHelp"
        v-model="loginEmail"
        :class="{ 'error-input': v$.loginEmail.$error }"
        @focus="clearStatus"
        @keypress="clearStatus"
      />
      <div
        v-for="error of v$.loginEmail.$errors"
        :key="error.$uid"
        class="text-start mx-1"
      >
        <span class="error-msg">{{ error.$message }}</span>
      </div>
    </div>

    <div class="mb-3 text-start">
      <label for="passwordInputLogin" class="form-label">Hasło:</label>
      <input
        @blur="v$.loginPassword.$touch"
        type="password"
        class="form-control"
        id="passwordInputLogin"
        v-model="loginPassword"
        :class="{ 'error-input': v$.loginPassword.$error }"
        @focus="clearStatus"
        @keypress="clearStatus"
      />
      <div
        v-for="error of v$.loginPassword.$errors"
        :key="error.$uid"
        class="text-start mx-1"
      >
        <span class="error-msg">{{ error.$message }}</span>
      </div>
      <div class="text-start mt-2" v-if="wrongData">
        <span class="error-msg">Niepoprawny adres email i/lub hasło.</span>
      </div>
    </div>
    <button type="submit" class="btn btn-main">Zaloguj się</button>
  </form>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
export default {
  name: "LoginForm",
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      loginEmail: "",
      loginPassword: "",
      wrongData: false,
    };
  },
  validations() {
    return {
      loginEmail: {
        required: helpers.withMessage("To pole nie może być puste.", required),
        email: helpers.withMessage("Zły format adresu email.", email),
      },
      loginPassword: {
        required: helpers.withMessage("To pole nie może być puste.", required),
      },
    };
  },
  methods: {
    async login() {
      const data = {
        email: this.loginEmail,
        password: this.loginPassword,
      };

      const url = `${this.apiURL}Users/authenticate`;

      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;

      this.clearStatus();

      this.axios
        .post(url, data)
        .then((response) => {
          console.log(response.data);
          this.$store.commit("setEmail", response.data.email);
          this.$store.commit("setFirstName", response.data.firstName);
          this.$store.commit("setLastName", response.data.lastName);
          this.$store.commit("setToken", response.data.token);
          this.$store.commit("setRefreshToken", response.data.refreshToken);
          this.$store.commit("setRole", "client");
          document.getElementById("loginRegisterModalClose").click();
          this.$router.push({ name: "Dashboard" });
        })
        .catch((error) => {
          if (error.response.status === 400) this.wrongData = true;
        });
    },
    clearStatus() {
      this.wrongData = false;
    },
  },
};
</script>

<style scoped></style>
