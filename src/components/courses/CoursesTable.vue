<template>
  <div>
    <div
      v-if="coursesSource && coursesSource.length > 0"
      class="table-responsive"
    >
      <table class="table table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">Zamówienie</th>
            <th scope="col">Data</th>
            <th scope="col">Pojazd</th>
            <th v-if="isAdmin" scope="col">Kierowca</th>
            <th scope="col">Typ</th>
            <th scope="col">Status</th>
            <th v-if="isAdmin" scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in coursesSource" :key="course.courseId">
            <td>{{ course.order.address }}</td>

            <td>{{ this.$func_global.formatDate(course.date) }}</td>

            <td v-if="isAdmin && editMode && editedCourse === course">
              <select
                v-model="editedCourseNewData.vehicleId"
                class="form-select form-control btn-no-style"
                id="newVehicleInput"
              >
                <option
                  v-for="veh in vehiclesSource"
                  :key="veh.vehicleId"
                  :value="veh.vehicleId"
                >
                  {{ veh.brand }} {{ veh.model }} {{ veh.licensePlate }}
                </option>
              </select>
            </td>
            <td v-else>
              {{ course.vehicle.brand }} {{ course.vehicle.model }}
              {{ course.vehicle.licensePlate }}
            </td>

            <td v-if="isAdmin && editMode && editedCourse === course">
              <select
                v-model="editedCourseNewData.driverId"
                class="form-select form-control btn-no-style"
                id="newDriverInput"
              >
                <option
                  v-for="driver in driversSource"
                  :key="driver.userId"
                  :value="driver.userId"
                >
                  {{ driver.firstName }} {{ driver.lastName }}
                </option>
              </select>
            </td>
            <td v-else-if="isAdmin">
              {{ course.driver.firstName }} {{ course.driver.lastName }}
            </td>

            <td>
              {{ this.$func_global.mapCourseTypeName(course.type) }}
            </td>

            <td>
              {{ this.$func_global.mapCourseStatusName(course.status) }}
            </td>

            <td
              v-if="isAdmin && editMode && editedCourse === course"
              class="text-start"
            >
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
            <td v-else-if="isAdmin" class="text-start">
              <button class="btn table-btn">
                <font-awesome-icon
                  :icon="['fa', 'pen']"
                  size="sm"
                  class="table-icon"
                  @click="turnOnEditMode(course)"
                />
              </button>
            </td>
            <td v-else-if="isActualCourse" class="text-start">
              <button class="btn table-btn" v-if="course.status === 'PLANNED'">
                <font-awesome-icon
                  :icon="['fa', 'truck-fast']"
                  size="sm"
                  class="table-icon"
                  @click="startCourse(course)"
                />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <no-results-filter
      v-else-if="filtersSource && coursesSource && coursesSource.length === 0"
    />
    <no-results
      v-else-if="!filtersSource && coursesSource && coursesSource.length === 0"
    />
  </div>
</template>

<script>
import NoResultsFilter from "@/components/other/NoResultsFilter";
import NoResults from "@/components/other/NoResults";
export default {
  name: "CoursesTable",
  components: { NoResults, NoResultsFilter },
  props: {
    coursesSource: Array,
    filtersSource: Boolean,
    vehiclesSource: Array,
    driversSource: Array,
    isActualCourse: Boolean,
  },
  data() {
    return {
      editMode: false,
      editedCourse: null,
      deletedVehicle: null,
      editedCourseNewData: {
        vehicleId: "",
        driverId: "",
      },
    };
  },
  methods: {
    turnOnEditMode(course) {
      this.editMode = true;
      this.editedCourse = course;

      this.editedCourseNewData.vehicleId = course.vehicle.vehicleId;
      this.editedCourseNewData.driverId = course.driver.userId;
    },
    clearNewCourseData() {
      this.editedCourseNewData = {
        vehicleId: "",
        driverId: "",
      };
    },
    cancelEdit() {
      this.editMode = false;
      this.editedCourse = null;
      this.clearNewCourseData();
    },
    async confirmEdit() {
      const url = `${this.apiURL}api/Courses/${this.editedCourse.courseId}`;
      const token = this.$store.getters.getToken;

      this.axios
        .put(url, this.editedCourseNewData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.$emit("edit:course", response.data);
          this.editMode = false;
          this.editedCourse = null;
          this.clearNewCourseData();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    startCourse(course) {
      const url = `${this.apiURL}api/Courses/${course.courseId}`;
      const token = this.$store.getters.getToken;

      const data = {
        status: "ON_THE_WAY",
      };

      this.axios
        .put(url, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.$emit("start:course", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  computed: {
    isAdmin() {
      return this.$store.getters.getRole === "Manager";
    },
  },
};
</script>

<style scoped>
* {
  color: var(--BLACK);
}
</style>
