<template>
  <div class="container mb-4" v-if="cart">
    <div class="row">
      <div class="col-6">
        <div class="text-start">
          <label for="cartFromToDates" class="form-label">
            Okres wypożyczenia:
          </label>
          <Datepicker
            v-model="datesRange"
            range
            autoApply
            :enableTimePicker="false"
            :format="this.$func_global.datepickerRangeFormat"
            :clearable="false"
            id="cartFromToDates"
            startingView="day"
            locale="pl"
            @update:modelValue="updateDateDatepicker"
          ></Datepicker>
        </div>
      </div>
      <div class="col-6 text-end mt-auto">
        <span class="all-text">Razem: </span>
        <span class="fw-bolder all-cost">{{ cart.totalCost }} zł</span>
      </div>
    </div>
  </div>

  <div v-if="cart && notAvailableProducts.length > 0" class="container">
    <h6 class="text-start">Pozycje przekraczające dostępność:</h6>
    <div v-for="pos in notAvailableProducts" :key="pos" class="my-3">
      <product-tile-cart
        :order-position-source="pos"
        :cart-id="cart.orderId"
        @set:position="setPositionToDelete"
        @update:cart="getCart"
      />
    </div>
  </div>

  <div v-if="cart && availableProducts.length > 0" class="container">
    <h6 class="text-start">Dostępne produkty:</h6>
    <div v-for="pos in availableProducts" :key="pos" class="my-3">
      <product-tile-cart
        :order-position-source="pos"
        :cart-id="cart.orderId"
        @set:position="setPositionToDelete"
        @update:cart="getCart"
      />
    </div>
  </div>

  <div class="modal fade" tabindex="-1" id="orderPositionDeleteModal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body" v-if="deletedPosition">
          <button
            id="orderPositionDeleteModalClose"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
          <div class="container mt-4">
            <div class="row">
              <div class="col">
                <p>
                  Czy na pewno chcesz usunąć produkt
                  <span class="fst-italic">
                    {{ deletedPosition.product.name }}
                  </span>
                  z koszyka?
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
                  Nie
                </button>
              </div>
              <div class="col">
                <button
                  class="btn btn-main modal-decision-button"
                  data-bs-dismiss="modal"
                  type="button"
                  @click="deleteOrderPosition"
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
import ProductTileCart from "@/components/assortment/ProductTileCart";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
export default {
  name: "Cart",
  components: {
    ProductTileCart,
    Datepicker,
  },
  data() {
    return {
      cart: null,
      deletedPosition: null,
      datesRange: [],
    };
  },
  methods: {
    getCart() {
      const url = `${this.apiURL}api/Orders/template`;
      const token = this.$store.getters.getToken;
      this.axios
        .post(url, {}, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          this.cart = response.data;
          this.datesRange = [response.data.startDate, response.data.endDate];
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changeOrderDates() {
      const url = `${this.apiURL}api/Orders/${this.cart.orderId}`;
      const token = this.$store.getters.getToken;
      const newDates = {
        startDate: this.datesRange[0],
        endDate: this.datesRange[1],
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
      if (this.datesRange !== null && this.datesRange !== []) {
        this.changeOrderDates();
      }
    },
    deleteOrderPosition() {
      const url = `${this.apiURL}api/Orders/order/${this.cart.orderId}/product/${this.deletedPosition.productId}`;
      const token = this.$store.getters.getToken;

      const product = {
        quantity: 0,
      };

      return this.axios
        .put(url, product, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          this.getCart();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    setPositionToDelete(position) {
      this.deletedPosition = position;
    },
  },
  mounted() {
    this.getCart();
  },
  computed: {
    availableProducts() {
      return this.cart.orderPositions.filter(
        (pos) => pos.quantity <= pos.product.availableInDateRange
      );
    },
    notAvailableProducts() {
      return this.cart.orderPositions.filter(
        (pos) => pos.quantity > pos.product.availableInDateRange
      );
    },
  },
};
</script>

<style scoped>
.all-text {
  color: var(--PRIMARY-DARKER);
}

.all-cost {
  color: var(--PRIMARY);
}

h6 {
  color: var(--GREY-DARKER);
}
</style>
