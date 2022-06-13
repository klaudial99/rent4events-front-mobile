<template>
  <form @submit.prevent="addVehicle" novalidate>
    <div class="row justify-content-center gy-3 mb-3">
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="text-start">
          <label for="vehicleBrandInput" class="form-label">Marka:</label>
          <input
            @blur="v$.newVehicle.brand.$touch"
            type="text"
            class="form-control"
            id="vehicleBrandInput"
            v-model="newVehicle.brand"
            :class="{ 'error-input': v$.newVehicle.brand.$error }"
          />
          <div
            v-for="error of v$.newVehicle.brand.$errors"
            :key="error.$uid"
            class="text-start mx-1"
          >
            <span class="error-msg">{{ error.$message }}</span>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="text-start">
          <label for="vehicleModelInput" class="form-label">Model:</label>
          <input
            @blur="v$.newVehicle.model.$touch"
            type="text"
            class="form-control"
            id="vehicleModelInput"
            v-model="newVehicle.model"
            :class="{ 'error-input': v$.newVehicle.model.$error }"
          />
          <div
            v-for="error of v$.newVehicle.model.$errors"
            :key="error.$uid"
            class="text-start mx-1"
          >
            <span class="error-msg">{{ error.$message }}</span>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="text-start">
          <label for="vehicleProductionYearInput" class="form-label"
            >Rok produkcji:</label
          >
          <input
            @blur="v$.newVehicle.productionYear.$touch"
            type="number"
            min="1970"
            :max="new Date().getFullYear()"
            class="form-control"
            id="vehicleProductionYearInput"
            v-model="newVehicle.productionYear"
            :class="{ 'error-input': v$.newVehicle.productionYear.$error }"
          />
          <div
            v-for="error of v$.newVehicle.productionYear.$errors"
            :key="error.$uid"
            class="text-start mx-1"
          >
            <span class="error-msg">{{ error.$message }}</span>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="text-start">
          <label for="vehicleLicensePlateInput" class="form-label"
            >Numer rejestracyjny:</label
          >
          <input
            @blur="v$.newVehicle.licensePlate.$touch"
            type="text"
            class="form-control"
            id="vehicleLicensePlateInput"
            v-model="newVehicle.licensePlate"
            :class="{
              'error-input':
                v$.newVehicle.licensePlate.$error || licensePlateTaken,
            }"
            @focus="clearStatus"
            @keypress="clearStatus"
          />
          <div
            v-for="error of v$.newVehicle.licensePlate.$errors"
            :key="error.$uid"
            class="text-start mx-1"
          >
            <span class="error-msg">{{ error.$message }}</span>
          </div>
          <div class="text-start mx-1" v-if="licensePlateTaken">
            <span class="error-msg"
              >Pojazd o podanym numerze rejestracyjnym już istnieje.</span
            >
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="text-start">
          <label for="vehicleTypeInput" class="form-label">Typ:</label>
          <select
            v-model="newVehicle.type"
            class="form-select form-control btn-no-style"
            id="vehicleTypeInput"
          >
            <option
              v-for="type in this.$store.getters.getVehicleTypeOptions"
              :key="type"
              :value="type"
            >
              {{ this.$func_global.mapVehicleTypeName(type) }}
            </option>
          </select>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="text-start">
          <label for="vehicleStatusInput" class="form-label">Status:</label>
          <select
            v-model="newVehicle.status"
            class="form-select form-control btn-no-style"
            id="vehicleStatusInput"
          >
            <option
              v-for="status in this.$store.getters.getVehicleStatusOptions"
              :key="status"
              :value="status"
            >
              {{ this.$func_global.mapVehicleStatusName(status) }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="row justify-content-between align-items-end">
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="text-start">
          <label for="vehicleServiceToInput" class="form-label"
            >Przegląd do:</label
          >
          <Datepicker
            v-model="newVehicle.serviceTo"
            autoApply
            :enableTimePicker="false"
            :format="this.$func_global.datepickerFormat"
            id="vehicleServiceToInput"
            startingView="day"
            locale="pl"
          ></Datepicker>
        </div>
      </div>
      <div class="col-3 col-md-2 d-none d-sm-block">
        <button type="submit" class="btn btn-main">Dodaj</button>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div
          v-for="error of v$.newVehicle.serviceTo.$errors"
          :key="error.$uid"
          class="text-start mx-1"
        >
          <span class="error-msg">{{ error.$message }}</span>
        </div>
      </div>
    </div>
    <div class="row justify-content-center mt-4 d-sm-none">
      <div class="col-9">
        <button type="submit" class="btn btn-main btn-main-mobile">
          Dodaj
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import {
  alpha,
  alphaNum,
  helpers,
  integer,
  required,
} from "@vuelidate/validators";

export default {
  name: "VehiclesForm",
  components: { Datepicker },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      newVehicle: {
        brand: "",
        model: "",
        productionYear: new Date().getFullYear(),
        type: "",
        licensePlate: "",
        status: "",
        serviceTo: null,
      },
      licensePlateTaken: false,
    };
  },
  validations() {
    return {
      newVehicle: {
        brand: {
          required: helpers.withMessage(
            "To pole nie może być puste.",
            required
          ),
          alpha: helpers.withMessage(
            "To pole może zawierać jedynie litery.",
            alpha
          ),
        },
        model: {
          required: helpers.withMessage(
            "To pole nie może być puste.",
            required
          ),
          alphaNum: helpers.withMessage(
            "To pole może zawierać jedynie litery i cyfry.",
            alphaNum
          ),
        },
        productionYear: {
          required: helpers.withMessage(
            "To pole nie może być puste.",
            required
          ),
          integer: helpers.withMessage(
            "To pole może zawierać jedynie cyfry.",
            integer
          ),
        },
        licensePlate: {
          required: helpers.withMessage(
            "To pole nie może być puste.",
            required
          ),
          alphaNum: helpers.withMessage(
            "To pole może zawierać jedynie litery i cyfry.",
            alphaNum
          ),
        },
        serviceTo: {
          required: helpers.withMessage(
            "To pole nie może być puste.",
            required
          ),
        },
      },
    };
  },
  methods: {
    async addVehicle() {
      const url = `${this.apiURL}api/Vehicles`;
      const token = this.$store.getters.getToken;

      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;

      this.clearStatus();

      this.axios
        .post(url, this.newVehicle, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.$emit("add:vehicle", response.data);
          this.clearNewVehicleData();
          this.v$.$reset();
        })
        .catch((error) => {
          if (
            this.$func_global.getErrorCode(error.response.data.message) ===
            "102"
          )
            this.licensePlateTaken = true;
        });
    },
    clearStatus() {
      this.licensePlateTaken = false;
    },
    clearNewVehicleData() {
      this.newVehicle = {
        brand: "",
        model: "",
        productionYear: new Date().getFullYear(),
        type: "",
        licensePlate: "",
        status: "",
        serviceTo: null,
      };
    },
  },
};
</script>

<style scoped></style>
