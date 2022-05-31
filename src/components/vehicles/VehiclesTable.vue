<template>
  <div>
    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">Marka</th>
            <th scope="col">Model</th>
            <th scope="col">Rok produkcji</th>
            <th scope="col">Numer rejestracyjny</th>
            <th scope="col">Typ</th>
            <th scope="col">Status</th>
            <th scope="col">Przegląd do</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="veh in vehiclesSource" :key="veh.vehicleId">
            <td v-if="editMode && editedVehicle === veh">
              <input
                @blur="v$.editedVehicleNewData.brand.$touch"
                type="text"
                class="form-control"
                id="newBrandInput"
                v-model="editedVehicleNewData.brand"
                :class="{ 'error-input': v$.editedVehicleNewData.brand.$error }"
              />
            </td>
            <td v-else>{{ veh.brand }}</td>

            <td v-if="editMode && editedVehicle === veh">
              <input
                @blur="v$.editedVehicleNewData.model.$touch"
                type="text"
                class="form-control"
                id="newModelInput"
                v-model="editedVehicleNewData.model"
                :class="{ 'error-input': v$.editedVehicleNewData.model.$error }"
              />
            </td>
            <td v-else>{{ veh.model }}</td>

            <td v-if="editMode && editedVehicle === veh">
              <input
                @blur="v$.editedVehicleNewData.productionYear.$touch"
                type="number"
                min="1970"
                :max="new Date().getFullYear()"
                class="form-control"
                id="newProductionYearInput"
                v-model="editedVehicleNewData.productionYear"
                :class="{
                  'error-input': v$.editedVehicleNewData.productionYear.$error,
                }"
              />
            </td>
            <td v-else>{{ veh.productionYear }}</td>

            <td v-if="editMode && editedVehicle === veh">
              <input
                @blur="v$.editedVehicleNewData.licensePlate.$touch"
                type="text"
                class="form-control"
                id="newLicensePlateInput"
                v-model="editedVehicleNewData.licensePlate"
                :class="{
                  'error-input':
                    v$.editedVehicleNewData.licensePlate.$error ||
                    licensePlateTaken,
                }"
                @focus="clearStatus"
                @keypress="clearStatus"
              />
            </td>
            <td v-else>{{ veh.licensePlate }}</td>

            <td v-if="editMode && editedVehicle === veh">
              <select
                v-model="editedVehicleNewData.type"
                class="form-select form-control btn-no-style"
                id="newTypeInput"
              >
                <option
                  v-for="type in this.$store.getters.getVehicleTypeOptions"
                  :key="type"
                  :value="type"
                >
                  {{ this.$func_global.mapVehicleTypeName(type) }}
                </option>
              </select>
            </td>
            <td v-else>{{ this.$func_global.mapVehicleTypeName(veh.type) }}</td>

            <td v-if="editMode && editedVehicle === veh">
              <select
                v-model="editedVehicleNewData.status"
                class="form-select form-control btn-no-style"
                id="newStatusInput"
              >
                <option
                  v-for="status in this.$store.getters.getVehicleStatusOptions"
                  :key="status"
                  :value="status"
                >
                  {{ this.$func_global.mapVehicleStatusName(status) }}
                </option>
              </select>
            </td>
            <td v-else>
              {{ this.$func_global.mapVehicleStatusName(veh.status) }}
            </td>

            <td v-if="editMode && editedVehicle === veh">
              <Datepicker
                v-model="editedVehicleNewData.serviceTo"
                autoApply
                :enableTimePicker="false"
                :format="this.$func_global.datepickerFormat"
                id="newServiceToInput"
                startingView="day"
                locale="pl"
              ></Datepicker>
            </td>
            <td v-else>{{ this.$func_global.formatDate(veh.serviceTo) }}</td>

            <td v-if="editMode && editedVehicle === veh" class="text-start">
              <button class="btn table-btn">
                <font-awesome-icon
                  :icon="['fa', 'xmark']"
                  size="sm"
                  class="table-icon"
                  @click="cancelEdit"
                />
              </button>
              <button class="btn table-btn">
                <font-awesome-icon
                  :icon="['fa', 'check']"
                  size="sm"
                  class="table-icon"
                  @click="confirmEdit"
                />
              </button>
            </td>
            <td v-else class="text-start">
              <button class="btn table-btn">
                <font-awesome-icon
                  :icon="['fa', 'pen']"
                  size="sm"
                  class="table-icon"
                  @click="turnOnEditMode(veh)"
                />
              </button>
              <button class="btn table-btn" v-if="veh.deletable">
                <font-awesome-icon
                  :icon="['fa', 'trash']"
                  size="sm"
                  class="table-icon"
                  data-bs-toggle="modal"
                  data-bs-target="#vehicleDeleteModal"
                  @click="deletedVehicle = veh"
                />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal fade" tabindex="-1" id="vehicleDeleteModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body" v-if="deletedVehicle">
            <button
              id="vehicleDeleteModalClose"
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
            <div class="container mt-4">
              <div class="row">
                <div class="col">
                  <p>
                    Czy na pewno chcesz usunąć pojazd
                    <span class="fst-italic">
                      {{ deletedVehicle.brand }} {{ deletedVehicle.model }}
                      {{ deletedVehicle.licensePlate }} </span
                    >?
                  </p>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <button
                    class="btn btn-main-outline modal-decision-button"
                    data-bs-dismiss="modal"
                    type="button"
                  >
                    Nie
                  </button>
                </div>
                <div class="col">
                  <button
                    class="btn btn-main modal-decision-button"
                    data-bs-dismiss="modal"
                    type="button"
                    @click="deleteVehicle"
                  >
                    Tak
                  </button>
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
import useVuelidate from "@vuelidate/core";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import {
  alpha,
  alphaNum,
  integer,
  helpers,
  required,
} from "@vuelidate/validators";

export default {
  name: "VehiclesTable",
  components: { Datepicker },
  setup() {
    return { v$: useVuelidate() };
  },
  props: {
    vehiclesSource: Array,
  },
  data() {
    return {
      editMode: false,
      editedVehicle: null,
      deletedVehicle: null,
      licensePlateTaken: false,
      editedVehicleNewData: {
        brand: "",
        model: "",
        productionYear: 0,
        type: "",
        licensePlate: "",
        status: "",
        serviceTo: null,
      },
    };
  },
  validations() {
    return {
      editedVehicleNewData: {
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
    turnOnEditMode(veh) {
      this.editMode = true;
      this.editedVehicle = veh;

      this.editedVehicleNewData.brand = veh.brand;
      this.editedVehicleNewData.model = veh.model;
      this.editedVehicleNewData.productionYear = veh.productionYear;
      this.editedVehicleNewData.type = veh.type;
      this.editedVehicleNewData.licensePlate = veh.licensePlate;
      this.editedVehicleNewData.status = veh.status;
      this.editedVehicleNewData.serviceTo = veh.serviceTo;
    },
    clearNewVehicleData() {
      this.editedVehicleNewData = {
        brand: "",
        model: "",
        productionYear: 0,
        type: "",
        licensePlate: "",
        status: "",
        serviceTo: null,
      };
    },
    clearStatus() {
      this.licensePlateTaken = false;
    },
    cancelEdit() {
      this.editMode = false;
      this.editedVehicle = null;
      this.clearNewVehicleData();
    },
    async confirmEdit() {
      const url = `${this.apiURL}api/Vehicles/${this.editedVehicle.vehicleId}`;
      const token = this.$store.getters.getToken;

      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;

      this.clearStatus();

      this.axios
        .put(url, this.editedVehicleNewData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.$emit("edit:vehicle", response.data);
          this.editMode = false;
          this.editedVehicle = null;
          this.clearNewVehicleData();
        })
        .catch((error) => {
          if (
            this.$func_global.getErrorCode(error.response.data.message) ===
            "102"
          )
            this.licensePlateTaken = true;
        });
    },
    async deleteVehicle() {
      const url = `${this.apiURL}api/Vehicles/${this.deletedVehicle.vehicleId}`;
      const token = this.$store.getters.getToken;

      this.axios
        .delete(url, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          this.$emit("delete:vehicle", this.deletedVehicle.vehicleId);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
* {
  color: var(--BLACK);
}

@media (min-width: 1px) and (max-width: 575px) {
  td {
    min-width: calc(100vw / 4);
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  td {
    min-width: calc(100vw / 5);
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  td {
    min-width: calc(100vw / 6);
  }
}

@media (min-width: 992px) {
  td {
    min-width: calc(100vw / 10);
  }
  .table-responsive {
    overflow-x: hidden;
  }
}

@media (min-width: 1200px) {
  td {
    min-width: calc(100vw / 9);
  }
}
</style>
