<template>
  <form @submit.prevent="addDriver" novalidate>
    <div class="row justify-content-start mb-3">
      <div class="col-12 col-md-6 d-flex align-items-end">
        <div class="text-start flex-fill">
          <label for="driverSalaryInput" class="form-label"
            >Adres email użytkownika:</label
          >
          <input
            type="text"
            class="form-control"
            id="candidateSearchEmail"
            v-model="filters.email"
          />
        </div>
        <div>
          <button
            type="button"
            class="btn btn-no-style"
            @click="searchCandidate"
          >
            Wyszukaj
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="candidateSearching && candidateFound"
      class="row justify-content-start mt-5"
    >
      <h6 class="text-start new-item">Znaleziono użytkownika:</h6>
      <p class="text-start">
        <span class="fw-500">Imię: </span>
        <span>{{ this.candidateFound.firstName }}</span>
        <span class="fw-500">&emsp;Nazwisko: </span>
        <span>{{ this.candidateFound.lastName }}</span>
        <span class="fw-500">&emsp;Numer telefonu: </span>
        <span>{{ this.candidateFound.phoneNumber }}</span>
      </p>
    </div>
    <div
      v-else-if="candidateSearching && !candidateFound"
      class="row justify-content-start mb-3"
    >
      <span class="text-start"
        >Nie znaleziono użytkownika o podanym adresie email, spróbuj wyszukać
        ponownie.
      </span>
    </div>
    <div
      v-if="candidateSearching && candidateFound"
      class="row justify-content-between align-items-end gy-3 mb-3"
    >
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="text-start">
          <label for="driverEmploymentDateInput" class="form-label"
            >Data zatrudnienia:</label
          >
          <Datepicker
            v-model="newDriver.employmentDate"
            autoApply
            :enableTimePicker="false"
            :format="this.$func_global.datepickerFormat"
            id="driverEmploymentDateInput"
            startingView="day"
            locale="pl"
            @focus="clearStatusEmploymentDate"
            @keypress="clearStatusEmploymentDate"
          ></Datepicker>
          <div
            v-for="error of v$.newDriver.employmentDate.$errors"
            :key="error.$uid"
            class="text-start mx-1"
          >
            <span class="error-msg">{{ error.$message }}</span>
          </div>
          <div class="text-start mx-1" v-if="wrongEmploymentDate">
            <span class="error-msg"
              >Data zatrudnienia kierowcy musi być większa od daty urodzenia i
              niewiększa od daty dzisiejszej.</span
            >
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="text-start">
          <label for="driverBirthDateInput" class="form-label"
            >Data urodzenia:</label
          >
          <Datepicker
            v-model="newDriver.birthDate"
            autoApply
            :enableTimePicker="false"
            :format="this.$func_global.datepickerFormat"
            id="driverBirthDateInput"
            startingView="day"
            locale="pl"
            @focus="clearStatusBirthDate"
            @keypress="clearStatusBirthDate"
          ></Datepicker>
          <div
            v-for="error of v$.newDriver.birthDate.$errors"
            :key="error.$uid"
            class="text-start mx-1"
          >
            <span class="error-msg">{{ error.$message }}</span>
          </div>
          <div class="text-start mx-1" v-if="wrongBirthDate">
            <span class="error-msg"
              >Kierowca musi mieć co najmniej 17 lat.</span
            >
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="text-start">
          <label for="driverSalaryInput" class="form-label">Pensja:</label>
          <input
            @blur="v$.newDriver.salary.$touch"
            type="number"
            min="0"
            class="form-control"
            id="driverSalaryInput"
            v-model="newDriver.salary"
            :class="{ 'error-input': v$.newDriver.salary.$error }"
            @focus="clearStatusSalary"
            @keypress="clearStatusSalary"
          />
          <div
            v-for="error of v$.newDriver.salary.$errors"
            :key="error.$uid"
            class="text-start mx-1"
          >
            <span class="error-msg">{{ error.$message }}</span>
          </div>
          <div class="text-start mx-1" v-if="wrongSalary">
            <span class="error-msg"
              >Pensja kierowcy nie może być mniejsza od 0.</span
            >
          </div>
        </div>
      </div>
      <div class="col-3 col-md-2 d-none d-sm-block d-lg-none">
        <button type="submit" class="btn btn-main">Dodaj</button>
      </div>
    </div>

    <div
      v-if="candidateSearching && candidateFound"
      class="row justify-content-center mt-4 d-sm-none"
    >
      <div class="col-9">
        <button type="submit" class="btn btn-main btn-main-mobile">
          Dodaj
        </button>
      </div>
    </div>

    <div
      v-if="candidateSearching && candidateFound"
      class="row justify-content-end mt-4 d-none d-lg-flex"
    >
      <div class="col-2">
        <button type="submit" class="btn btn-main">Dodaj</button>
      </div>
    </div>
  </form>
</template>

<script>
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";

export default {
  name: "DriversForm",
  components: { Datepicker },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      newDriver: {
        userId: "",
        employmentDate: new Date(),
        birthDate: "",
        salary: "",
      },
      filters: {
        email: "",
      },
      candidateSearching: false,
      candidateFound: null,

      wrongBirthDate: false,
      wrongEmploymentDate: false,
      wrongSalary: false,
    };
  },
  validations() {
    return {
      newDriver: {
        employmentDate: {
          required: helpers.withMessage(
            "To pole nie może być puste.",
            required
          ),
        },
        birthDate: {
          required: helpers.withMessage(
            "To pole nie może być puste.",
            required
          ),
        },
        salary: {
          required: helpers.withMessage(
            "To pole nie może być puste.",
            required
          ),
        },
      },
    };
  },
  methods: {
    searchCandidate() {
      const url = `${this.apiURL}api/Drivers/candidates`;
      const token = this.$store.getters.getToken;
      const requestParams = {
        Filter: this.filterString,
      };

      if (this.filters.email === "") return;

      this.axios
        .get(url, {
          params: requestParams,
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const userFound = response.data.results[0];
          this.candidateFound = userFound;
          this.newDriver.userId = userFound.userId;
          this.candidateSearching = true;
        })
        .catch((error) => {
          console.log(error);
          this.candidateSearching = true;
        });
    },
    async addDriver() {
      const url = `${this.apiURL}api/Drivers`;
      const token = this.$store.getters.getToken;

      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;

      this.clearStatusBirthDate();
      this.clearStatusEmploymentDate();
      this.clearStatusSalary();

      this.axios
        .post(url, this.newDriver, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.$emit("add:driver", response.data);
          this.clearNewDriverData();
          this.candidateFound = null;
          this.candidateSearching = false;
          this.filters.email = "";
          this.v$.$reset();
        })
        .catch((error) => {
          if (
            this.$func_global.getErrorCode(error.response.data.message) ===
            "107"
          )
            this.wrongBirthDate = true;

          if (
            this.$func_global.getErrorCode(error.response.data.message) ===
            "108"
          )
            this.wrongEmploymentDate = true;

          if (
            this.$func_global.getErrorCode(error.response.data.message) ===
            "111"
          )
            this.wrongSalary = true;
        });
    },
    clearNewDriverData() {
      this.newDriver = {
        userId: "",
        employmentDate: new Date(),
        birthDate: "",
        salary: "",
      };
    },
    clearStatusBirthDate() {
      this.wrongBirthDate = false;
    },
    clearStatusEmploymentDate() {
      this.wrongEmploymentDate = false;
    },
    clearStatusSalary() {
      this.wrongSalary = false;
    },
  },
  computed: {
    filterString() {
      return this.$func_global.formatFilters(this.filters);
    },
  },
};
</script>

<style scoped></style>
