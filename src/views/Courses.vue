<template>
  <div class="container">
    <div class="row mt-4">
      <div class="col text-start ms-0 ms-lg-4">
        <h3>Kursy</h3>
      </div>
    </div>
  </div>
  <div class="filter-row">
    <div class="container">
      <div class="d-flex align-items-center text-start ms-0 ms-lg-4">
        <div class="d-flex align-items-center flex-grow-1" id="filters">
          <div class="filters-title">Filtry:</div>
          <div class="d-flex filters">
            <div id="course-type" class="filters-group">
              <select
                v-model="userParams.filters.type"
                class="form-select form-select-sm form-control btn-no-style"
                id="courseTypeFilter"
                @change="getCourses(true)"
              >
                <option value="" selected disabled>Status</option>
                <option value="">-</option>
                <option
                  v-for="type in this.$store.getters.getCourseTypeOptions"
                  :key="type"
                  :value="type"
                >
                  {{ this.$func_global.mapCourseTypeName(type) }}
                </option>
              </select>
            </div>

            <div id="course-status" class="filters-group">
              <select
                v-model="userParams.filters.status"
                class="form-select form-select-sm form-control btn-no-style"
                id="courseStatusFilter"
                @change="getCourses(true)"
              >
                <option value="" selected disabled>Status</option>
                <option value="">-</option>
                <option
                  v-for="status in this.$store.getters.getCourseStatusOptions"
                  :key="status"
                  :value="status"
                >
                  {{ this.$func_global.mapCourseStatusName(status) }}
                </option>
              </select>
            </div>

            <div id="vehicle-sort" class="filters-group">
              <select
                v-model="userParams.orderBy"
                class="form-select form-select-sm form-control btn-no-style"
                id="vehicleSort"
                @change="getCourses(true)"
              >
                <option value="" selected disabled>Sortowanie</option>
                <option value="">-</option>
                <option
                  v-for="sort in filters.sortByOptions"
                  :key="sort.label"
                  :value="sort.value"
                >
                  {{ sort.label }}
                </option>
              </select>
            </div>

            <div id="vehicle-clear" v-if="filtersApplied">
              <button
                class="btn btn-filters"
                @click="
                  clearFilters();
                  getCourses(true);
                "
              >
                Wyczyść wszystkie
              </button>
            </div>
          </div>
        </div>

        <pagination
          :navigation-source="navigation"
          @switch:page="handleGoToPage"
          class="d-none d-lg-flex"
        />
      </div>
    </div>
  </div>

  <div class="container d-lg-none">
    <div class="d-flex flex-row-reverse">
      <pagination
        :navigation-source="navigation"
        @switch:page="handleGoToPage"
      />
    </div>
  </div>

  <div class="container">
    <courses-table
      :courses-source="courses"
      :filters-source="filtersApplied"
      :vehicles-source="vehicles"
      :drivers-source="drivers"
      :is-actual-course="false"
      class="mt-4"
      @edit:course="editCourse"
    />
  </div>

  <div class="container mb-3" v-if="courses.length >= 10">
    <div class="d-flex flex-row-reverse">
      <pagination
        :navigation-source="navigation"
        @switch:page="handleGoToPage"
      />
    </div>
  </div>
</template>

<script>
import CoursesTable from "@/components/courses/CoursesTable";
import Pagination from "@/components/pagination/Pagination";
export default {
  name: "Courses",
  components: {
    CoursesTable,
    Pagination,
  },
  data() {
    return {
      courses: [],
      vehicles: [],
      drivers: [],
      userParams: {
        goToPage: 1,
        itemsPerPage: 20,
        filters: {
          type: "",
          status: "",
        },
        orderBy: "",
      },
      filters: {
        sortByOptions: [
          { label: "Data rosnąco", value: "Date asc" },
          { label: "Data malejąco", value: "Date desc" },
        ],
      },
      navigation: {
        totalCount: 0,
        page: 1,
        itemsPerPage: 20,
        isFirst: false,
        isLast: false,
        isEmpty: false,
        totalPages: 1,
      },
    };
  },
  methods: {
    getCourses(firstPage) {
      const url = `${this.apiURL}api/Courses`;
      const token = this.$store.getters.getToken;
      const requestParams = {
        Page: firstPage ? 1 : this.userParams.goToPage,
        PageSize: this.userParams.itemsPerPage,
        OrderBy: this.userParams.orderBy,
        Filter: this.filterString,
      };

      this.axios
        .get(url, {
          params: requestParams,
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.courses = response.data.results;
          this.navigation.totalCount = response.data.totalCount;
          this.navigation.page = response.data.page;
          this.navigation.itemsPerPage = response.data.itemsPerPage;

          this.navigation.isFirst = response.data.isFirst;
          this.navigation.isLast = response.data.isLast;
          this.navigation.isEmpty = response.data.isEmpty;
          this.navigation.totalPages = response.data.totalPages;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getDrivers() {
      const url = `${this.apiURL}api/Drivers`;
      const token = this.$store.getters.getToken;
      const requestParams = {
        Page: 1,
        PageSize: 100,
      };

      return this.axios
        .get(url, {
          params: requestParams,
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.drivers = response.data.results;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getVehicles() {
      const url = `${this.apiURL}api/Vehicles`;
      const token = this.$store.getters.getToken;
      const requestParams = {
        Page: 1,
        PageSize: 100,
      };

      return this.axios
        .get(url, {
          params: requestParams,
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.vehicles = response.data.results;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    editCourse(course) {
      const index = this.courses.findIndex(
        (c) => c.courseId === course.courseId
      );
      this.courses[index] = course;
    },
    clearFilters() {
      this.userParams.filters.type = "";
      this.userParams.filters.status = "";
      this.userParams.orderBy = "";
    },
    handleGoToPage(number) {
      this.userParams.goToPage = number;
      this.getCourses(false);
    },
  },
  mounted() {
    this.getCourses(true);
    this.getDrivers();
    this.getVehicles();
  },
  computed: {
    filtersApplied() {
      return (
        this.userParams.filters.type !== "" ||
        this.userParams.filters.status !== "" ||
        this.userParams.orderBy !== ""
      );
    },
    filterString() {
      return this.$func_global.formatFilters(this.userParams.filters);
    },
  },
};
</script>

<style scoped>
.form-select {
  margin: 0 0.8rem;
  width: fit-content;
}
</style>
