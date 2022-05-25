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
        orderBy: "",
        filter: "",
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
    getVehicles() {
      const url = `${this.apiURL}api/Vehicles`;
      const token = this.$store.getters.getToken;
      const requestParams = {
        Page: this.userParams.goToPage,
        PageSize: this.userParams.itemsPerPage,
        OrderBy: this.userParams.orderBy,
        Filter: this.userParams.filter,
      };

      this.axios
        .get(url, {
          params: requestParams,
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log(response.data);
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
  },
  mounted() {
    this.getVehicles();
  },
};
</script>

<style scoped></style>
