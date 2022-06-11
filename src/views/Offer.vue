<template>
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
            id="offerFromToDates"
            startingView="day"
            locale="pl"
            @update:modelValue="updateDateDatepicker"
          ></Datepicker>
        </div>
      </div>
    </div>
    <div class="row mt-4 gy-2">
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
</template>

<script>
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import ProductTileOffer from "@/components/assortment/ProductTileOffer";
import moment from "moment";
export default {
  name: "Offer",
  components: { Datepicker, ProductTileOffer },
  data() {
    return {
      products: [],
      cart: null,
      userParams: {
        goToPage: 1,
        itemsPerPage: 20,
        filters: {
          categoryName: "",
        },
        datesRange: [],
        orderBy: "",
      },
      filters: {
        sortByOptions: [
          { label: "Nazwa A-Z", value: "name asc" },
          { label: "Nazwa Z-A", value: "name desc" },
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
          else this.userParams.datesRange = [today, tomorrow];
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
      if (this.userParams.datesRange !== null) {
        this.changeOrderDates();
        this.getOffer(true);
      }
    },
  },
  mounted() {
    this.getOffer(true);
    this.getCart();
  },
  computed: {
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

<style scoped></style>
