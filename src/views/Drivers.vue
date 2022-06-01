<template>
  <div class="container">
    <div class="row mt-4">
      <div class="col text-start ms-0 ms-lg-4">
        <h3>Kierowcy</h3>
      </div>
      <div class="col text-end">
        <button
          class="btn btn-no-style"
          v-if="addNewDriver"
          @click="addNewDriver = !addNewDriver"
        >
          <font-awesome-icon
            :icon="['fa', 'eye-slash']"
            size="sm"
            class="add-hide-icon"
          />
          <span class="d-none d-md-inline"> Ukryj dodawanie kierowcy </span>
        </button>
        <button
          class="btn btn-no-style"
          v-else
          @click="addNewDriver = !addNewDriver"
        >
          <font-awesome-icon
            :icon="['fa', 'plus']"
            size="sm"
            class="add-hide-icon"
          />
          <span class="d-none d-md-inline"> Dodaj nowego kierowcę </span>
        </button>
      </div>
    </div>
    <div class="row justify-content-center" v-if="addNewDriver">
      <div class="col ms-0 ms-lg-4 mt-4">
        <h6 class="text-start new-item">Nowy kierowca:</h6>
        <drivers-form @add:driver="addDriver" />
      </div>
    </div>
  </div>
  <div class="filter-row">
    <div class="container">
      <div class="d-flex align-items-center text-start ms-0 ms-lg-4">
        <div class="d-flex align-items-center flex-grow-1" id="filters">
          <div class="d-flex filters">
            <div id="driver-sort" class="filters-group">
              <select
                v-model="userParams.orderBy"
                class="form-select form-select-sm form-control btn-no-style"
                id="driverSort"
                @change="getDrivers(true)"
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
                  getDrivers(true);
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
          class="d-none d-sm-flex"
        />
      </div>
    </div>
  </div>

  <div class="container d-sm-none">
    <div class="d-flex flex-row-reverse">
      <pagination
        :navigation-source="navigation"
        @switch:page="handleGoToPage"
      />
    </div>
  </div>

  <div class="container">
    <drivers-table
      :drivers-source="drivers"
      class="mt-4"
      @edit:driver="editDriver"
      @delete:driver="deleteDriver"
    />
  </div>

  <div class="container mb-3" v-if="drivers.length >= 10">
    <div class="d-flex flex-row-reverse">
      <pagination
        :navigation-source="navigation"
        @switch:page="handleGoToPage"
      />
    </div>
  </div>
</template>

<script>
import DriversForm from "@/components/drivers/DriversForm";
import DriversTable from "@/components/drivers/DriversTable";
import Pagination from "@/components/pagination/Pagination";
export default {
  name: "Drivers",
  components: {
    DriversForm,
    DriversTable,
    Pagination,
  },
  data() {
    return {
      drivers: [],
      addNewDriver: false,
      userParams: {
        goToPage: 1,
        itemsPerPage: 20,
        orderBy: "",
      },
      filters: {
        sortByOptions: [
          {
            label: "Nazwisko i imię A-Z",
            value: "lastName asc, firstName asc",
          },
          {
            label: "Nazwisko i imię Z-A",
            value: "lastName desc, firstName desc",
          },
          { label: "Pensja rosnąco", value: "salary asc" },
          { label: "Pensja malejąco", value: "salary desc" },
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
    getDrivers(firstPage) {
      const url = `${this.apiURL}api/Drivers`;
      const token = this.$store.getters.getToken;
      const requestParams = {
        Page: firstPage ? 1 : this.userParams.goToPage,
        PageSize: this.userParams.itemsPerPage,
        OrderBy: this.userParams.orderBy,
      };

      this.axios
        .get(url, {
          params: requestParams,
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.drivers = response.data.results;
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
    addDriver(driver) {
      this.navigation.totalCount++;
      this.drivers.unshift(driver);
    },
    editDriver(driver) {
      const index = this.drivers.findIndex((d) => d.userId === driver.userId);
      this.drivers[index] = driver;
    },
    deleteDriver(userId) {
      const index = this.drivers.findIndex((d) => d.userId === userId);
      this.drivers.splice(index, 1);
      this.navigation.totalCount--;
    },
    clearFilters() {
      this.userParams.type = "";
      this.userParams.status = "";
      this.userParams.orderBy = "";
    },
    handleGoToPage(number) {
      this.userParams.goToPage = number;
      this.getDrivers(false);
    },
  },
  mounted() {
    this.getDrivers(true);
  },
  computed: {
    filtersApplied() {
      return this.userParams.orderBy !== "";
    },
    filterString() {
      return this.$func_global.formatFilters(this.userParams.filters);
    },
  },
};
</script>

<style scoped></style>
