<template>
  <div class="container">
    <div class="row mt-4">
      <div class="col text-start ms-0 ms-lg-4">
        <h3>Zamówienia</h3>
      </div>
    </div>
  </div>
  <div class="filter-row">
    <div class="container">
      <div class="d-flex align-items-center text-start ms-0 ms-lg-4">
        <div class="d-flex align-items-center flex-grow-1" id="filters">
          <div class="filters-title">Filtry:</div>
          <div class="d-flex filters">
            <div id="order-status" class="filters-group">
              <select
                v-model="userParams.filters.status"
                class="form-select form-select-sm form-control btn-no-style"
                id="ordersStatus"
                @change="getOrders(true)"
              >
                <option value="" selected disabled>Status</option>
                <option value="">-</option>
                <option
                  v-for="status in this.$store.getters.getOrderStatusOptions"
                  :key="status"
                  :value="status"
                >
                  {{ this.$func_global.mapOrderStatusName(status) }}
                </option>
              </select>
            </div>

            <div id="order-sort" class="filters-group">
              <select
                v-model="userParams.orderBy"
                class="form-select form-select-sm form-control btn-no-style"
                id="ordersSort"
                @change="getOrders(true)"
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
                  getOrders(true);
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
    <orders-table
      :orders-source="orders"
      :filters-source="filtersApplied"
      @cancel:order="cancelOrder"
      class="mt-4"
    />
  </div>

  <div class="container mb-3" v-if="orders.length >= 10">
    <div class="d-flex flex-row-reverse">
      <pagination
        :navigation-source="navigation"
        @switch:page="handleGoToPage"
      />
    </div>
  </div>
</template>

<script>
import OrdersTable from "@/components/orders/OrdersTable";
import Pagination from "@/components/pagination/Pagination";
export default {
  name: "Orders",
  components: {
    OrdersTable,
    Pagination,
  },
  data() {
    return {
      orders: [],
      userParams: {
        goToPage: 1,
        itemsPerPage: 20,
        filters: {
          status: "",
        },
        orderBy: "",
      },
      filters: {
        sortByOptions: [
          { label: "Data rozpoczęcia najpóźniej", value: "startDate desc" },
          { label: "Data rozpoczęcia najwcześniej", value: "startDate asc" },
          { label: "Koszt rosnąco", value: "totalCost asc" },
          { label: "Koszt malejąco", value: "totalCost desc" },
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
    getOrders(firstPage) {
      let url = `${this.apiURL}api/Orders`;
      if (this.$store.getters.getRole === "Customer") url += "/my";
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
          this.orders = response.data.results;
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
    cancelOrder(order) {
      const index = this.orders.findIndex((o) => o.orderId === order.orderId);
      this.orders[index] = order;
    },
    clearFilters() {
      this.userParams.filters.status = "";
      this.userParams.orderBy = "";
    },
    handleGoToPage(number) {
      this.userParams.goToPage = number;
      this.getOrders(false);
    },
  },
  mounted() {
    this.getOrders(true);
  },
  computed: {
    filtersApplied() {
      return (
        this.userParams.filters.status !== "" || this.userParams.orderBy !== ""
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
