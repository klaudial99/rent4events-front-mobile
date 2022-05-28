<template>
  <div class="container">
    <div class="row mt-4">
      <div class="col text-start ms-0 ms-lg-4">
        <h3>Pojazdy</h3>
      </div>
      <div class="col text-end">
        <button
          class="btn btn-no-style"
          v-if="addNewVehicle"
          @click="addNewVehicle = !addNewVehicle"
        >
          <font-awesome-icon
            :icon="['fa', 'eye-slash']"
            size="sm"
            class="add-hide-icon"
          />
          <span class="d-none d-md-inline"> Ukryj dodawanie pojazdu </span>
        </button>
        <button
          class="btn btn-no-style"
          v-else
          @click="addNewVehicle = !addNewVehicle"
        >
          <font-awesome-icon
            :icon="['fa', 'plus']"
            size="sm"
            class="add-hide-icon"
          />
          <span class="d-none d-md-inline"> Dodaj nowy pojazd </span>
        </button>
      </div>
    </div>
    <div class="row justify-content-center" v-if="addNewVehicle">
      <div class="col ms-0 ms-lg-4 mt-4">
        <h6 class="text-start new-item">Nowy pojazd:</h6>
        <vehicles-form @add:vehicle="addVehicle" />
      </div>
    </div>
  </div>
  <div class="filter-row">
    <div class="container">
      <div class="d-flex align-items-center text-start ms-0 ms-lg-4">
        <div class="d-flex align-items-center flex-grow-1" id="filters">
          <div class="filters-title">Filtry:</div>
          <div class="d-flex filters">
            <div id="vehicle-type" class="filters-group">
              <button
                class="btn btn-filters"
                @click="setTypeFilter('BUS')"
                :class="{
                  active: userParams.filters.type === 'BUS',
                }"
              >
                Busy
              </button>
              <button
                class="btn btn-filters"
                @click="setTypeFilter('TRUCK')"
                :class="{
                  active: userParams.filters.type === 'TRUCK',
                }"
              >
                Samochody ciężarowe
              </button>
            </div>

            <div id="vehicle-status" class="filters-group">
              <select
                v-model="userParams.filters.status"
                class="form-select form-select-sm form-control btn-no-style"
                id="vehicleTypeFilter"
                @change="getVehicles(true)"
              >
                <option value="" selected disabled>Status</option>
                <option value="">-</option>
                <option
                  v-for="status in this.$store.getters.getVehicleStatusOptions"
                  :key="status"
                  :value="status"
                >
                  {{ this.$func_global.mapVehicleStatusName(status) }}
                </option>
              </select>
            </div>

            <div id="vehicle-sort" class="filters-group">
              <select
                v-model="userParams.orderBy"
                class="form-select form-select-sm form-control btn-no-style"
                id="vehicleSort"
                @change="getVehicles(true)"
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
                  getVehicles(true);
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
    <vehicles-table
      :vehicles-source="vehicles"
      class="mt-4"
      @edit:vehicle="editVehicle"
      @delete:vehicle="deleteVehicle"
    />
  </div>

  <div class="container mb-3" v-if="vehicles.length >= 10">
    <div class="d-flex flex-row-reverse">
      <pagination
        :navigation-source="navigation"
        @switch:page="handleGoToPage"
      />
    </div>
  </div>
</template>

<script>
import VehiclesForm from "@/components/vehicles/VehiclesForm";
import VehiclesTable from "@/components/vehicles/VehiclesTable";
import Pagination from "@/components/pagination/Pagination";
export default {
  name: "Vehicles",
  components: {
    VehiclesForm,
    VehiclesTable,
    Pagination,
  },
  data() {
    return {
      vehicles: [],
      addNewVehicle: false,
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
          { label: "Marka i model A-Z", value: "brand asc, model asc" },
          { label: "Marka i model Z-A", value: "brand desc, model desc" },
          { label: "Numer A-Z", value: "licensePlate asc" },
          { label: "Numer Z-A", value: "licensePlate desc" },
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
    getVehicles(firstPage) {
      const url = `${this.apiURL}api/Vehicles`;
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
          this.vehicles = response.data.results;
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
    addVehicle(vehicle) {
      vehicle.deletable = true;
      this.navigation.totalCount++;
      this.vehicles.unshift(vehicle);
    },
    editVehicle(vehicle) {
      const index = this.vehicles.findIndex(
        (veh) => veh.vehicleId === vehicle.vehicleId
      );
      this.vehicles[index] = vehicle;
    },
    deleteVehicle(vehicleId) {
      const index = this.vehicles.findIndex(
        (veh) => veh.vehicleId === vehicleId
      );
      this.vehicles.splice(index, 1);
    },
    clearFilters() {
      this.userParams.type = "";
      this.userParams.status = "";
      this.userParams.orderBy = "";
    },
    setTypeFilter(type) {
      if (this.userParams.filters.type === type)
        this.userParams.filters.type = "";
      else this.userParams.filters.type = type;
      this.getVehicles(true);
    },
    handleGoToPage(number) {
      this.userParams.goToPage = number;
      this.getVehicles(false);
    },
  },
  mounted() {
    this.getVehicles(true);
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
