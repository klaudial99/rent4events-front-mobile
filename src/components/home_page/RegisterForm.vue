<template>
  <form @submit.prevent="register" novalidate>
    <div class="mb-3 text-start">
      <label for="emailInputRegister" class="form-label">Adres email:</label>
      <input
        @blur="v$.registerEmail.$touch"
        type="email"
        class="form-control"
        id="emailInputRegister"
        v-model="registerEmail"
        :class="{ 'error-input': v$.registerEmail.$error || emailTaken }"
        @focus="clearStatus"
        @keypress="clearStatus"
      />
      <div
        v-for="error of v$.registerEmail.$errors"
        :key="error.$uid"
        class="text-start mx-1"
      >
        <span class="error-msg">{{ error.$message }}</span>
      </div>
      <div class="text-start mx-1" v-if="emailTaken">
        <span class="error-msg">Podany adres email jest już zajęty.</span>
      </div>
    </div>

    <div class="mb-3 text-start">
      <label for="passwordInputRegister1" class="form-label">Hasło:</label>
      <input
        @blur="v$.registerPassword.$touch"
        type="password"
        class="form-control"
        id="passwordInputRegister1"
        v-model="registerPassword"
        :class="{ 'error-input': v$.registerPassword.$error }"
      />
      <div class="text-start mx-1">
        <span
          class="password-info"
          :class="{
            highlight: v$.registerPassword.$error,
          }"
          >Hasło musi składać się z co najmniej 8 znaków i zawierać przynajmniej
          jedną małą i wielką literę, cyfrę oraz znak specjalny.</span
        >
      </div>
    </div>

    <div class="mb-3 text-start">
      <label for="passwordInputRegister2" class="form-label"
        >Powtórz hasło:</label
      >
      <input
        @blur="v$.registerPasswordConfirm.$touch"
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
        class="text-start mx-1"
      >
        <span class="error-msg">{{ error.$message }}</span>
      </div>
    </div>

    <div class="mb-3 text-start">
      <label for="firstNameInput" class="form-label">Imię:</label>
      <input
        @blur="v$.firstName.$touch"
        type="text"
        class="form-control"
        id="firstNameInput"
        v-model="firstName"
        :class="{
          'error-input': v$.firstName.$error,
        }"
      />
      <div
        v-for="error of v$.firstName.$errors"
        :key="error.$uid"
        class="text-start mx-1"
      >
        <span class="error-msg">{{ error.$message }}</span>
      </div>
    </div>

    <div class="mb-3 text-start">
      <label for="lastNameInput" class="form-label">Nazwisko:</label>
      <input
        @blur="v$.lastName.$touch"
        type="text"
        class="form-control"
        id="lastNameInput"
        v-model="lastName"
        :class="{
          'error-input': v$.lastName.$error,
        }"
      />
      <div
        v-for="error of v$.lastName.$errors"
        :key="error.$uid"
        class="text-start mx-1"
      >
        <span class="error-msg">{{ error.$message }}</span>
      </div>
    </div>

    <div class="mb-3 text-start">
      <label for="phoneNumberInput" class="form-label">Numer telefonu:</label>
      <div class="input-group">
        <span class="input-group-text" id="phone-number">+48</span>
        <input
          @blur="v$.phoneNumber.$touch"
          type="tel"
          class="form-control"
          id="phoneNumberInput"
          v-model="phoneNumber"
          aria-describedby="phone-number"
          :class="{
            'error-input': v$.phoneNumber.$error,
          }"
        />
      </div>
      <div
        v-for="error of v$.phoneNumber.$errors"
        :key="error.$uid"
        class="text-start mx-1"
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
  alpha,
  numeric,
  minLength,
  maxLength,
  sameAs,
} from "@vuelidate/validators";

export default {
  name: "RegisterForm",
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      registerEmail: "",
      registerPassword: "",
      registerPasswordConfirm: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      emailTaken: false,
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
      firstName: {
        required: helpers.withMessage("To pole nie może być puste.", required),
        alpha: helpers.withMessage(
          "To pole może zawierać jedynie litery.",
          alpha
        ),
      },
      lastName: {
        required: helpers.withMessage("To pole nie może być puste.", required),
        alpha: helpers.withMessage(
          "To pole może zawierać jedynie litery.",
          alpha
        ),
      },
      phoneNumber: {
        required: helpers.withMessage("To pole nie może być puste.", required),
        numeric: helpers.withMessage(
          "To pole może zawierać jedynie cyfry.",
          numeric
        ),
        minLength: helpers.withMessage(
          "To pole musi składać się dokładnie z 9 cyfr.",
          minLength(9)
        ),
        maxLength: helpers.withMessage(
          "To pole musi składać się dokładnie z 9 cyfr.",
          maxLength(9)
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
        first_name: this.firstName,
        last_name: this.lastName,
        phone_no: this.phoneNumber,
      };

      const url = `${this.apiURL}api/Account/register`;

      const isFormCorrect = await this.v$.$validate();

      if (!isFormCorrect) return;

      this.clearStatus();

      this.axios
        .post(url, data)
        .then((response) => {
          console.log(response.data);
          this.$store.commit("setShowAfterRegisterModal", true);
        })
        .catch((error) => {
          if (
            this.$func_global.getErrorCode(error.response.data.message) ===
            "103"
          )
            this.emailTaken = true;
        });
    },
    clearStatus() {
      this.emailTaken = false;
    },
  },
};
</script>

<style scoped>
.password-info {
  font-size: 14px;
}

.highlight {
  color: red;
}
</style>
