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
                  active: userParams.vehicleType === 'BUS',
                }"
              >
                Busy
              </button>
              <button
                class="btn btn-filters"
                @click="setTypeFilter('TRUCK')"
                :class="{
                  active: userParams.vehicleType === 'TRUCK',
                }"
              >
                Samochody ciężarowe
              </button>
            </div>

            <div id="vehicle-status" class="filters-group">
              <select
                v-model="userParams.vehicleStatus"
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

        <div id="pages">
          <div class="p-0">Strony:</div>
        </div>
      </div>
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
</template>

<script>
import VehiclesForm from "@/components/vehicles/VehiclesForm";
import VehiclesTable from "@/components/vehicles/VehiclesTable";
export default {
  name: "Vehicles",
  components: {
    VehiclesForm,
    VehiclesTable,
  },
  data() {
    return {
      vehicles: [],
      addNewVehicle: false,
      userParams: {
        goToPage: 1,
        pageSize: 20,
        vehicleType: "",
        vehicleStatus: "",
        orderBy: "",
      },
      filters: {
        sortByOptions: [
          { label: "Marka i model A-Z", value: "brand asc, model asc" },
          { label: "Marka i model Z-A", value: "brand desc, model desc" },
          { label: "Numer A-Z", value: "licensePlate asc" },
          { label: "Numer Z-A", value: "licensePlate desc" },
          // { label: "Przegląd rosnąco", value: "serviceTo asc" },
          // { label: "Przegląd malejąco", value: "serviceTo desc" },
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
      this.userParams.vehicleType = "";
      this.userParams.vehicleStatus = "";
      this.userParams.orderBy = "";
    },
    setTypeFilter(type) {
      if (this.userParams.vehicleType === type)
        this.userParams.vehicleType = "";
      else this.userParams.vehicleType = type;
      this.getVehicles(true);
    },
  },
  mounted() {
    this.getVehicles(true);
  },
  computed: {
    filtersApplied() {
      return (
        this.userParams.vehicleType !== "" ||
        this.userParams.vehicleStatus !== "" ||
        this.userParams.orderBy !== ""
      );
    },
    filterString() {
      const type = this.userParams.vehicleType;
      const status = this.userParams.vehicleStatus;
      let filters = [];
      if (type !== "") filters.push("type=" + type);
      if (status !== "") filters.push("status=" + status);
      return filters.join();
    },
  },
};
</script>

<style scoped>
.filter-row {
  border-top: 1px solid var(--GREY);
  border-bottom: 1px solid var(--GREY);
  padding: 0.9rem 0;
  margin: 1rem 0;
  overflow-x: auto;
}

.filters-title {
  font-weight: 500;
  padding: 0.3rem 0.5rem 0.3rem 0;
  font-size: smaller;
}

.btn-filters {
  box-shadow: none;
  border-radius: 10px;
  padding: 0.3rem 0.5rem;
  margin: 0 0.3rem;
  font-size: smaller;
  white-space: nowrap;
}

.btn-filters:hover,
.btn-filters:focus {
  box-shadow: none;
  background-color: var(--GREY-LIGHT);
}

.btn-filters:active,
.btn-filters.active {
  box-shadow: none;
  background-color: var(--PRIMARY);
  color: white;
}

.filters-group {
  display: flex;
  align-items: center;
}

.filters-group:not(:first-child) {
  border-left: 1px solid var(--GREY);
}

.form-select {
  margin: 0 0.8rem;
  width: fit-content;
}

select option[disabled]:first-child {
  display: none;
}
</style>
