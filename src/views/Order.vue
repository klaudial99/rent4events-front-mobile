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
    <div class="row mt-3 gy-2">
      <div class="col-12 col-md-6 col-lg-4 text-start">
        <span class="fw-bolder">Początek wypożyczenia: </span>
        <span>{{ this.$func_global.formatDate(order.startDate) }}</span>
      </div>
      <div class="col-12 col-md-6 col-lg-4 text-start">
        <span class="fw-bolder">Koniec wypożyczenia: </span>
        <span>{{ this.$func_global.formatDate(order.endDate) }}</span>
      </div>
      <div class="col-12 col-md-6 col-lg-4 text-start">
        <span class="fw-bolder">Adres: </span>
        <span>{{ order.address }}</span>
      </div>
      <div class="col-12 col-md-6 col-lg-4 text-start">
        <span class="fw-bolder">Transport: </span>
        <font-awesome-icon
          v-if="order.transport"
          :icon="['fa', 'check']"
          size="sm"
        />
        <font-awesome-icon v-else :icon="['fa', 'xmark']" />
      </div>
      <div class="col-12 col-md-6 col-lg-4 text-start">
        <span class="fw-bolder">Status: </span>
        <span>{{ this.$func_global.mapOrderStatusName(order.status) }}</span>
      </div>
      <div class="col-12 col-md-6 col-lg-4 text-start">
        <span class="fw-bolder">Całkowity koszt: </span>
        <span>{{ this.$func_global.formatPrice(order.totalCost) }} zł</span>
      </div>
      <div class="col-12 text-start">
        <span class="fw-bolder">Komentarz: </span>
        <p>{{ order.comment }}</p>
      </div>
    </div>
  </div>

  <div class="container mb-3" v-if="orderPositions">
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
      class="mt-4"
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
</template>

<script>
import Pagination from "@/components/pagination/Pagination";
import OrderPositionsTable from "@/components/orders/OrderPositionsTable";
export default {
  name: "Order",
  components: {
    Pagination,
    OrderPositionsTable,
  },
  props: {
    orderId: String,
  },
  data() {
    return {
      order: null,
      orderPositions: [],
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
    handleGoToPage(number) {
      this.userParams.goToPage = number;
      this.getOrderPositions(false);
    },
    goBack() {
      this.$router.push({ name: "Orders" });
    },
  },
  mounted() {
    this.getOrder();
    this.getOrderPositions();
  },
};
</script>

<style scoped></style>
