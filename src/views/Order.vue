<template>
  <div class="container" v-if="order && orderPositions">
    <div class="row mt-4">
      <div class="col text-start ms-0">
        <button class="btn btn-no-style p-0 align-baseline" @click="goBack">
          <font-awesome-icon :icon="['fa', 'arrow-left']" size="sm" />
          <span class="ms-2">Powrót do zamówień</span>
        </button>
      </div>
    </div>

    <order-details :order-source="order" class="mt-3 gy-2" />
  </div>

  <div
    class="container mt-3 mb-4"
    v-if="isAdmin && orderPositions && order && order.status === 'PENDING'"
  >
    <div class="row justify-content-center">
      <div class="col-6 col-lg-3 col-xl-2">
        <button
          type="button"
          class="btn btn-main-outline w-100"
          data-bs-toggle="modal"
          data-bs-target="#orderAcceptModal"
          @click="accepting = false"
        >
          Odrzuć
        </button>
      </div>
      <div class="col-6 col-lg-3 col-xl-2">
        <button
          type="button"
          class="btn btn-main w-100"
          data-bs-toggle="modal"
          data-bs-target="#orderAcceptModal"
          @click="accepting = true"
        >
          Zaakceptuj
        </button>
      </div>
    </div>
  </div>

  <div class="container" v-if="orderPositions">
    <div class="d-flex flex-row-reverse">
      <pagination
        :navigation-source="navigation"
        @switch:page="handleGoToPage"
      />
    </div>
  </div>

  <div class="container" v-if="orderPositions">
    <order-positions-table
      :order-position-source="orderPositions"
      :order-source="order"
    />
  </div>

  <div
    class="container mb-3"
    v-if="orderPositions && orderPositions.length >= 10"
  >
    <div class="d-flex flex-row-reverse">
      <pagination
        :navigation-source="navigation"
        @switch:page="handleGoToPage"
      />
    </div>
  </div>

  <div class="modal fade" tabindex="-1" id="orderAcceptModal" v-if="order">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <div class="container">
            <h5
              v-if="accepting && order.transport"
              class="modal-title text-start"
            >
              Dodaj kursy do zamówienia
            </h5>
            <button
              id="orderAcceptModalClose"
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
        </div>
        <div class="modal-body">
          <div class="container">
            <div class="row mb-5" v-if="accepting && order.transport">
              <div class="col-12 col-md-6">
                <div class="text-start">
                  <h4>DOSTAWA</h4>
                  <label for="vehicleToInput" class="form-label">Pojazd:</label>
                  <select
                    v-model="courseTo.vehicleId"
                    class="form-select form-control btn-no-style"
                    id="vehicleToInput"
                  >
                    <option
                      v-for="veh in vehicles"
                      :key="veh.vehicleId"
                      :value="veh.vehicleId"
                    >
                      {{ veh.brand }} {{ veh.model }} {{ veh.licensePlate }}
                    </option>
                  </select>
                </div>
                <div class="text-start mt-3">
                  <label for="driverToInput" class="form-label"
                    >Kierowca:</label
                  >
                  <select
                    v-model="courseTo.driverId"
                    class="form-select form-control btn-no-style"
                    id="driverToInput"
                  >
                    <option
                      v-for="driver in drivers"
                      :key="driver.userId"
                      :value="driver.userId"
                    >
                      {{ driver.firstName }} {{ driver.lastName }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="text-start">
                  <h4>ODBIÓR</h4>
                  <label for="vehicleFromInput" class="form-label"
                    >Pojazd:</label
                  >
                  <select
                    v-model="courseFrom.vehicleId"
                    class="form-select form-control btn-no-style"
                    id="vehicleFromInput"
                  >
                    <option
                      v-for="veh in vehicles"
                      :key="veh.vehicleId"
                      :value="veh.vehicleId"
                    >
                      {{ veh.brand }} {{ veh.model }} {{ veh.licensePlate }}
                    </option>
                  </select>
                </div>
                <div class="text-start mt-3">
                  <label for="driverFromInput" class="form-label"
                    >Kierowca:</label
                  >
                  <select
                    v-model="courseFrom.driverId"
                    class="form-select form-control btn-no-style"
                    id="driverFromInput"
                  >
                    <option
                      v-for="driver in drivers"
                      :key="driver.userId"
                      :value="driver.userId"
                    >
                      {{ driver.firstName }} {{ driver.lastName }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="row" v-else-if="accepting && !order.transport">
              <div class="col">
                <p>
                  Czy na pewno chcesz zaakceptować zamówienie w dniach
                  <span class="fst-italic">
                    {{ this.$func_global.formatDate(order.startDate) }}
                    -
                    {{ this.$func_global.formatDate(order.endDate) }}</span
                  >?
                </p>
              </div>
            </div>
            <div class="row" v-else-if="!accepting">
              <div class="col">
                <p>
                  Czy na pewno chcesz odrzucić zamówienie w dniach
                  <span class="fst-italic">
                    {{ this.$func_global.formatDate(order.startDate) }}
                    -
                    {{ this.$func_global.formatDate(order.endDate) }}</span
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
                  Anuluj
                </button>
              </div>
              <div class="col" v-if="accepting && order.transport">
                <button
                  class="btn btn-main modal-decision-button"
                  data-bs-dismiss="modal"
                  type="button"
                  @click="addCourses"
                >
                  Dodaj
                </button>
              </div>
              <div class="col" v-else-if="accepting && !order.transport">
                <button
                  class="btn btn-main modal-decision-button"
                  data-bs-dismiss="modal"
                  type="button"
                  @click="changeOrderStatus('ACCEPTED')"
                >
                  Tak
                </button>
              </div>
              <div class="col" v-else-if="!accepting">
                <button
                  class="btn btn-main modal-decision-button"
                  data-bs-dismiss="modal"
                  type="button"
                  @click="changeOrderStatus('REJECTED')"
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
</template>

<script>
import Pagination from "@/components/pagination/Pagination";
import OrderPositionsTable from "@/components/orders/OrderPositionsTable";
import OrderDetails from "@/components/orders/OrderDetails";
export default {
  name: "Order",
  components: {
    Pagination,
    OrderPositionsTable,
    OrderDetails,
  },
  props: {
    orderId: String,
  },
  data() {
    return {
      order: null,
      orderPositions: [],
      vehicles: [],
      drivers: [],
      accepting: false,
      courseTo: {
        vehicleId: "",
        driverId: "",
        type: "DELIVERY",
        status: "PLANNED",
        date: null,
        orderId: "",
      },
      courseFrom: {
        vehicleId: "",
        driverId: "",
        type: "PICKUP",
        status: "PLANNED",
        date: null,
        orderId: "",
      },
      userParams: {
        goToPage: 1,
        itemsPerPage: 20,
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
    getOrder() {
      let url = `${this.apiURL}api/Orders/${this.orderId}`;
      const token = this.$store.getters.getToken;

      this.axios
        .get(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.order = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getOrderPositions(firstPage) {
      let url = `${this.apiURL}api/Orders/${this.orderId}/order-positions`;
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
          this.orderPositions = response.data.results;
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
    changeOrderStatus(status) {
      const url = `${this.apiURL}api/Orders/${this.order.orderId}/status`;
      const token = this.$store.getters.getToken;

      const data = {
        status: status,
      };

      return this.axios
        .put(url, data, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          this.order = response.data;
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
    addCourse(course) {
      const url = `${this.apiURL}api/Courses`;
      const token = this.$store.getters.getToken;

      return this.axios.post(url, course, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    async addCourses() {
      this.courseTo.date = this.order.startDate;
      this.courseTo.orderId = this.orderId;

      this.courseFrom.date = this.order.endDate;
      this.courseFrom.orderId = this.orderId;

      await this.addCourse(this.courseTo);
      await this.addCourse(this.courseFrom);
      await this.changeOrderStatus("ACCEPTED");
    },
    handleGoToPage(number) {
      this.userParams.goToPage = number;
      this.getOrderPositions(false);
    },
    goBack() {
      this.$router.push({ name: "Orders" });
    },
  },
  async mounted() {
    this.getOrder();
    this.getOrderPositions();
    await this.getDrivers();
    await this.getVehicles();
    this.courseTo.driverId = this.drivers[0].userId;
    this.courseFrom.driverId = this.drivers[0].userId;
    this.courseTo.vehicleId = this.vehicles[0].vehicleId;
    this.courseFrom.vehicleId = this.vehicles[0].vehicleId;
  },
  computed: {
    isAdmin() {
      return this.$store.getters.getRole === "Manager";
    },
  },
};
</script>

<style scoped>
.modal-header {
  border-bottom: none;
}
</style>
