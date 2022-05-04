<template>
  <form @submit.prevent="register" novalidate>
    <div class="mb-3 text-start">
      <label for="emailInputRegister" class="form-label">Adres email:</label>
      <input
        type="email"
        class="form-control"
        id="emailInputRegister"
        aria-describedby="emailHelp"
        v-model="registerEmail"
        :class="{ 'error-input': v$.registerEmail.$error }"
      />
      <div
        v-for="error of v$.registerEmail.$errors"
        :key="error.$uid"
        class="text-start"
      >
        <span class="error-msg">{{ error.$message }}</span>
      </div>
    </div>

    <div class="mb-3 text-start">
      <label for="passwordInputRegister1" class="form-label">Hasło:</label>
      <input
        type="password"
        class="form-control"
        id="passwordInputRegister1"
        v-model="registerPassword"
        :class="{ 'error-input': v$.registerPassword.$error }"
      />
      <div
        v-for="error of v$.registerPassword.$errors"
        :key="error.$uid"
        class="text-start"
      >
        <span class="error-msg">{{ error.$message }}</span>
      </div>
    </div>
    <div class="mb-3 text-start">
      <label for="passwordInputRegister2" class="form-label"
        >Powtórz hasło:</label
      >
      <input
        type="password"
        class="form-control"
        id="passwordInputRegister2"
        v-model="registerPasswordConfirm"
        :class="{
          'error-input': v$.registerPasswordConfirm.$error,
        }"
      />
      <div
        v-for="error of v$.registerPasswordConfirm.$errors"
        :key="error.$uid"
        class="text-start"
      >
        <span class="error-msg">{{ error.$message }}</span>
      </div>
    </div>
    <button type="submit" class="btn btn-main">Zarejestruj się</button>
  </form>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import {
  required,
  email,
  helpers,
  minLength,
  sameAs,
} from "@vuelidate/validators";

export default {
  name: "RegisterForm",
  setup() {
    return { v$: useVuelidate({ $autoDirty: true }) };
  },
  data() {
    return {
      registerEmail: "",
      registerPassword: "",
      registerPasswordConfirm: "",
    };
  },
  validations() {
    return {
      registerEmail: {
        required: helpers.withMessage("To pole nie może być puste.", required),
        email: helpers.withMessage("Zły format adresu email.", email),
      },
      registerPassword: {
        required: helpers.withMessage("To pole nie może być puste.", required),
        minLength: helpers.withMessage(
          "Hasło musi mieć przynajmniej 8 znaków.",
          minLength(8)
        ),
        containsLowerCase: helpers.withMessage(
          () => `Hasło musi zawierać przynajmniej jedną małą literę.`,
          (value) => /[a-z]/.test(value)
        ),
        containsUpperCase: helpers.withMessage(
          () => `Hasło musi zawierać przynajmniej jedną wielką literę.`,
          (value) => /[A-Z]/.test(value)
        ),
        containsNumber: helpers.withMessage(
          () => `Hasło musi zawierać przynajmniej jedną cyfrę.`,
          (value) => /[0-9]/.test(value)
        ),
        containsSpecial: helpers.withMessage(
          () => `Hasło musi zawierać przynajmniej jeden znak specjalny.`,
          (value) => /[#?!@$%^&*-]/.test(value)
        ),
      },
      registerPasswordConfirm: {
        required: helpers.withMessage("To pole nie może być puste.", required),
        sameAsPassword: helpers.withMessage(
          "Oba hasła muszą być identyczne.",
          sameAs(this.registerPassword)
        ),
      },
    };
  },
  methods: {
    async register() {
      const data = {
        email: this.registerEmail,
        password: this.registerPassword,
        password2: this.registerPasswordConfirm,
        first_name: "",
        last_name: "",
        phone_no: "",
      };

      const url = `${this.apiURL}api/Account/register`;

      const isFormCorrect = await this.v$.$validate();

      if (!isFormCorrect) return;

      this.axios
        .post(url, data)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped></style>
