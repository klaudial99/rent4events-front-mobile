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

  <div
    class="position-fixed top-0 end-0 p-3"
    style="z-index: 1050"
    v-if="userFeedback.isOpen && userFeedback.version === 'A'"
  >
    <div class="my-toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex me-4">
        <div
          class="my-toast-body"
          v-if="userFeedback.accepted && userFeedback.courses"
        >
          Pomyślnie zaakceptowano zamówienie i dodano kursy.
        </div>
        <div
          class="my-toast-body"
          v-else-if="userFeedback.accepted && !userFeedback.courses"
        >
          Pomyślnie zaakceptowano zamówienie.
        </div>
        <div class="my-toast-body" v-else>Pomyślnie odrzucono zamówienie.</div>
        <button
          type="button"
          class="btn-close me-2 mt-2"
          @click="userFeedback.isOpen = false"
          aria-label="Close"
        ></button>
      </div>
    </div>
  </div>

  <div class="modal fade" tabindex="-1" id="orderAcceptModal" v-if="order">
    <div
      class="modal-dialog modal-dialog-centered"
      :class="[userFeedback.isOpen ? 'modal-md' : 'modal-lg']"
    >
      <div class="modal-content">
        <div class="modal-header">
          <div class="container">
            <h5
              v-if="!userFeedback.isOpen && accepting && order.transport"
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
            <div
              class="row"
              v-if="userFeedback.isOpen && userFeedback.version === 'B'"
            >
              <div class="col">
                <p v-if="userFeedback.accepted && userFeedback.courses">
                  Pomyślnie zaakceptowano zamówienie i dodano kursy.
                </p>
                <p v-else-if="userFeedback.accepted && !userFeedback.courses">
                  Pomyślnie zaakceptowano zamówienie.
                </p>
                <p v-else>Pomyślnie odrzucono zamówienie.</p>
              </div>
            </div>
            <div class="row mb-5" v-else-if="accepting && order.transport">
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
              <div class="col" v-if="!userFeedback.isOpen">
                <button
                  class="btn btn-main-outline modal-decision-button"
                  data-bs-dismiss="modal"
                  type="button"
                >
                  Anuluj
                </button>
              </div>
              <div
                class="col"
                v-if="userFeedback.isOpen && userFeedback.version === 'B'"
              >
                <button
                  class="btn btn-main modal-decision-button"
                  data-bs-dismiss="modal"
                  type="button"
                >
                  Zamknij
                </button>
              </div>
              <div class="col" v-else-if="accepting && order.transport">
                <button
                  v-if="userFeedback.version === 'A'"
                  class="btn btn-main modal-decision-button"
                  data-bs-dismiss="modal"
                  type="button"
                  @click="addCourses"
                >
                  Dodaj
                </button>
                <button
                  v-else
                  class="btn btn-main modal-decision-button"
                  type="button"
                  @click="addCourses"
                >
                  Dodaj
                </button>
              </div>
              <div class="col" v-else-if="accepting && !order.transport">
                <button
                  class="btn btn-main modal-decision-button"
                  type="button"
                  @click="changeOrderStatus('ACCEPTED')"
                >
                  Tak
                </button>
              </div>
              <div class="col" v-else-if="!accepting">
                <button
                  class="btn btn-main modal-decision-button"
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
      userFeedback: {
        courses: false,
        accepted: false,
        isOpen: false,
        version: "A",
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
          status === "ACCEPTED"
            ? (this.userFeedback.accepted = true)
            : (this.userFeedback.false = true);
          this.userFeedback.isOpen = true;
          if (this.userFeedback.version === "A") {
            setTimeout(() => {
              this.userFeedback.isOpen = false;
            }, 3000);
          }
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
      this.userFeedback.courses = true;
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
.my-toast {
  max-width: 100%;
  font-size: 0.875rem;
  pointer-events: auto;
  background-color: rgba(240, 240, 240, 0.95);
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
}

.my-toast-body {
  padding: 0.75rem;
  word-wrap: break-word;
  text-align: start;
}
</style>
