<template>
  <form @submit.prevent="login" novalidate>
    <div class="mb-3 text-start">
      <label for="emailInputLogin" class="form-label">Adres email:</label>
      <input
        type="email"
        class="form-control"
        id="emailInputLogin"
        aria-describedby="emailHelp"
        v-model="loginEmail"
        :class="{ 'error-input': v$.loginEmail.$error }"
      />
      <div
        v-for="error of v$.loginEmail.$errors"
        :key="error.$uid"
        class="text-start"
      >
        <span class="error-msg">{{ error.$message }}</span>
      </div>
    </div>

    <div class="mb-3 text-start">
      <label for="passwordInputLogin" class="form-label">Hasło:</label>
      <input
        type="password"
        class="form-control"
        id="passwordInputLogin"
        v-model="loginPassword"
        :class="{ 'error-input': v$.loginPassword.$error }"
      />
      <div
        v-for="error of v$.loginPassword.$errors"
        :key="error.$uid"
        class="text-start"
      >
        <span class="error-msg">{{ error.$message }}</span>
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
    return { v$: useVuelidate({ $autoDirty: true }) };
  },
  data() {
    return {
      loginEmail: "",
      loginPassword: "",
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

      this.axios
        .post(url, data)
        .then((response) => {
          console.log(response.data);
          this.$store.commit("setEmail", response.data.email);
          this.$store.commit("setFirstName", response.data.firstName);
          this.$store.commit("setLastName", response.data.lastName);
          this.$store.commit("setToken", response.data.token);
          this.$store.commit("setRefreshToken", response.data.refreshToken);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped></style>
