<template>
  <div>
    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">Imię</th>
            <th scope="col">Nazwisko</th>
            <th scope="col">Numer telefonu</th>
            <th scope="col">Data zatrudnienia</th>
            <th scope="col">Data urodzenia</th>
            <th scope="col">Pensja</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="driver in driversSource" :key="driver.userId">
            <td>{{ driver.firstName }}</td>
            <td>{{ driver.lastName }}</td>
            <td>{{ driver.phoneNumber }}</td>

            <td v-if="editMode && editedDriver === driver">
              <Datepicker
                v-model="editedDriverNewData.employmentDate"
                autoApply
                :enableTimePicker="false"
                :format="this.$func_global.datepickerFormat"
                id="newEmploymentDateInput"
                startingView="day"
                locale="pl"
              ></Datepicker>
            </td>
            <td v-else>
              {{ this.$func_global.formatDate(driver.employmentDate) }}
            </td>

            <td v-if="editMode && editedDriver === driver">
              <Datepicker
                v-model="editedDriverNewData.birthDate"
                autoApply
                :enableTimePicker="false"
                :format="this.$func_global.datepickerFormat"
                id="newBirthDateInput"
                startingView="day"
                locale="pl"
              ></Datepicker>
            </td>
            <td v-else>{{ this.$func_global.formatDate(driver.birthDate) }}</td>

            <td v-if="editMode && editedDriver === driver">
              <input
                @blur="v$.editedDriverNewData.salary.$touch"
                type="number"
                min="0"
                class="form-control"
                id="newSalaryInput"
                v-model="editedDriverNewData.salary"
                :class="{
                  'error-input': v$.editedDriverNewData.salary.$error,
                }"
              />
            </td>
            <td v-else>
              {{ driver.salary }}
            </td>

            <td v-if="editMode && editedDriver === driver" class="text-start">
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
                  @click="turnOnEditMode(driver)"
                />
              </button>
              <button class="btn table-btn" v-if="driver.deletable">
                <font-awesome-icon
                  :icon="['fa', 'trash']"
                  size="sm"
                  class="table-icon"
                  data-bs-toggle="modal"
                  data-bs-target="#driverDeleteModal"
                  @click="deletedDriver = driver"
                />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal fade" tabindex="-1" id="driverDeleteModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body" v-if="deletedDriver">
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
                    Czy na pewno chcesz usunąć kierowcę
                    <span class="fst-italic">
                      {{ deletedDriver.firstName }}
                      {{ deletedDriver.lastName }} </span
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
                    @click="deleteDriver"
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
import { helpers, required } from "@vuelidate/validators";
export default {
  name: "DriversTable",
  components: { Datepicker },
  setup() {
    return { v$: useVuelidate() };
  },
  props: {
    driversSource: Array,
  },
  data() {
    return {
      editMode: false,
      editedDriver: null,
      deletedDriver: null,
      editedDriverNewData: {
        employmentDate: "",
        birthDate: "",
        salary: "",
      },
    };
  },
  validations() {
    return {
      editedDriverNewData: {
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
    turnOnEditMode(driver) {
      this.editMode = true;
      this.editedDriver = driver;

      this.editedDriverNewData.employmentDate = driver.employmentDate;
      this.editedDriverNewData.birthDate = driver.birthDate;
      this.editedDriverNewData.salary = driver.salary;
    },
    clearNewDriverData() {
      this.editedDriverNewData = {
        employmentDate: "",
        birthDate: "",
        salary: "",
      };
    },
    cancelEdit() {
      this.editMode = false;
      this.editedDriver = null;
      this.clearNewDriverData();
    },
    async confirmEdit() {
      const url = `${this.apiURL}api/Drivers/${this.editedDriver.userId}`;
      const token = this.$store.getters.getToken;

      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;

      this.axios
        .put(url, this.editedDriverNewData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.$emit("edit:driver", response.data);
          this.editMode = false;
          this.editedDriver = null;
          this.clearNewDriverData();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async deleteDriver() {
      const url = `${this.apiURL}api/Drivers/${this.deletedDriver.userId}`;
      const token = this.$store.getters.getToken;

      this.axios
        .delete(url, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          this.$emit("delete:driver", this.deletedDriver.userId);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped></style>
