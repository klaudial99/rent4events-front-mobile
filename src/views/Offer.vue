<template>
  <div class="filter-row">
    <div class="container">
      <div class="d-flex align-items-center text-start ms-0 ms-lg-4">
        <div class="d-flex align-items-center flex-grow-1" id="filters">
          <div class="filters-title">Wyszukaj:</div>
          <div class="d-flex filters w-100">
            <div id="product-search" class="filters-group flex-grow-1">
              <input
                type="text"
                class="form-control form-control-sm w-100"
                id="productNameInput"
                v-model="userParams.filters.name"
                @keydown="getOfferWithTimeout(true)"
              />
            </div>

            <div id="product-sort" class="filters-group">
              <select
                v-model="userParams.orderBy"
                class="form-select form-select-sm form-control btn-no-style"
                id="productSort"
                @change="getOffer(true)"
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

            <div id="product-clear" v-if="filtersApplied">
              <button
                class="btn btn-filters"
                @click="
                  clearFilters();
                  getOffer(true);
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
    <div class="row mt-4">
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="text-start">
          <label for="offerFromToDates" class="form-label">
            Okres wypożyczenia:
          </label>
          <Datepicker
            v-model="userParams.datesRange"
            range
            autoApply
            :enableTimePicker="false"
            :format="this.$func_global.datepickerRangeFormat"
            :clearable="false"
            id="offerFromToDates"
            startingView="day"
            locale="pl"
            @update:modelValue="updateDateDatepicker"
          ></Datepicker>
        </div>
      </div>
    </div>
    <div class="row my-4 gy-2">
      <div
        v-for="prod in products"
        :key="prod.productId"
        class="col-6 col-sm-6 col-md-4 col-lg-3"
      >
        <product-tile-offer
          v-if="cart"
          :product-source="prod"
          :cart-id="cart.orderId"
          :already-added="
            productsInCart[prod.productId] ? productsInCart[prod.productId] : 0
          "
          @update:cart="getCart"
          class="mx-2"
        />
      </div>
    </div>
  </div>

  <div class="container mb-3" v-if="products.length >= 10">
    <div class="d-flex flex-row-reverse">
      <pagination
        :navigation-source="navigation"
        @switch:page="handleGoToPage"
      />
    </div>
  </div>
</template>

<script>
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import ProductTileOffer from "@/components/assortment/ProductTileOffer";
import Pagination from "@/components/pagination/Pagination";
import moment from "moment";
export default {
  name: "Offer",
  components: { Datepicker, ProductTileOffer, Pagination },
  data() {
    return {
      products: [],
      cart: null,
      changeTime: new Date(),
      userParams: {
        goToPage: 1,
        itemsPerPage: 20,
        filters: {
          name: "",
          categoryName: "",
        },
        datesRange: [],
        orderBy: "",
      },
      filters: {
        sortByOptions: [
          { label: "Nazwa A-Z", value: "name asc" },
          { label: "Nazwa Z-A", value: "name desc" },
          // { label: "Cena rosnąco", value: "priceInDateRange asc" },
          // { label: "Cena malejąco", value: "priceInDateRange desc" },
          { label: "Kategoria A-Z", value: "categoryName asc" },
          { label: "Kategoria Z-A", value: "categoryName desc" },
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
    getOffer(firstPage) {
      const url = `${this.apiURL}api/Products/offer`;
      const token = this.$store.getters.getToken;
      const requestParams = {
        Page: firstPage ? 1 : this.userParams.goToPage,
        PageSize: this.userParams.itemsPerPage,
        OrderBy: this.userParams.orderBy,
        Filter: this.filterString,
        FromDate: this.userParams.datesRange[0],
        ToDate: this.userParams.datesRange[1],
      };

      this.axios
        .get(url, {
          params: requestParams,
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.products = response.data.results;

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
    getOfferWithTimeout() {
      this.changeTime = new Date();
      setTimeout(() => {
        const newTime = new Date();
        if (newTime - this.changeTime > 500) {
          this.getOffer(true);
          this.changeTime = newTime;
        }
      }, 500);
    },
    getCart() {
      const url = `${this.apiURL}api/Orders/template`;
      const token = this.$store.getters.getToken;
      this.axios
        .post(url, {}, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          this.cart = response.data;
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          if (moment(response.data.startDate).isSameOrAfter(today, "day"))
            this.userParams.datesRange = [
              response.data.startDate,
              response.data.endDate,
            ];
          else {
            this.userParams.datesRange = [today, tomorrow];
            this.changeOrderDates();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changeOrderDates() {
      const url = `${this.apiURL}api/Orders/${this.cart.orderId}`;
      const token = this.$store.getters.getToken;
      const newDates = {
        startDate: this.userParams.datesRange[0],
        endDate: this.userParams.datesRange[1],
      };

      this.axios
        .put(url, newDates, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          this.cart = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateDateDatepicker() {
      if (this.userParams.datesRange !== null && this.datesRange !== []) {
        this.changeOrderDates();
        this.getOffer(true);
      }
    },
    handleGoToPage(number) {
      this.userParams.goToPage = number;
      this.getOffer(false);
    },
    clearFilters() {
      this.userParams.filters.name = "";
      this.userParams.orderBy = "";
    },
  },
  mounted() {
    this.getOffer(true);
    this.getCart();
  },
  computed: {
    filtersApplied() {
      return this.userParams.filters.name !== "" || this.userParams.orderBy;
    },
    filterString() {
      return this.$func_global.formatFilters(this.userParams.filters);
    },
    productsInCart() {
      let products = {};
      for (const item of this.cart.orderPositions) {
        products[item.productId] = item.quantity;
      }
      return products;
    },
  },
};
</script>

<style scoped>
.form-select,
input {
  margin: 0 0.8rem;
  width: fit-content;
}
</style>
