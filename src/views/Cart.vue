<template>
  <div class="container mb-4" v-if="cart">
    <div class="row justify-content-between">
      <div class="col-7 col-md-5">
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
      <div class="col-5 text-end mt-auto">
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

  <div
    class="container my-4"
    v-if="
      cart && (availableProducts.length > 0 || notAvailableProducts.length > 0)
    "
  >
    <div class="row justify-content-center">
      <button
        type="button"
        class="btn btn-main w-50"
        :class="{
          disabled: notAvailableProducts.length > 0,
        }"
        data-bs-toggle="modal"
        data-bs-target="#orderDetailsModal"
      >
        Przejdź dalej
      </button>
    </div>
  </div>

  <div class="container" v-else>
    <div class="my-5">
      <h5>Twój koszyk jest pusty.</h5>
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

  <div class="modal fade" tabindex="-1" id="orderDetailsModal">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Szczegóły zamówienia</h5>
          <button
            id="orderDetailsModalClose"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="changeOrderDetails" novalidate>
            <div class="container mt-4">
              <div class="row">
                <div class="col">
                  <div class="mb-2 text-start">
                    <label for="addressInput" class="form-label">Adres:</label>
                    <input
                      @blur="v$.newOrder.address.$touch"
                      type="text"
                      class="form-control"
                      id="addressInput"
                      v-model="newOrder.address"
                      :class="{ 'error-input': v$.newOrder.address.$error }"
                    />
                    <div
                      v-for="error of v$.newOrder.address.$errors"
                      :key="error.$uid"
                      class="text-start mx-1"
                    >
                      <span class="error-msg">{{ error.$message }}</span>
                    </div>
                  </div>
                  <div class="form-check mb-3 text-start">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="newOrder.transport"
                      :value="newOrder.transport"
                      id="transportInput"
                    />
                    <label class="form-check-label" for="transportInput">
                      Transport
                    </label>
                  </div>
                  <div class="mb-3 text-start">
                    <label for="commentInput" class="form-label">Uwagi:</label>
                    <textarea
                      type="text"
                      class="form-control"
                      rows="3"
                      id="commentInput"
                      v-model="newOrder.comment"
                    />
                  </div>
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
                <div class="col">
                  <button
                    class="btn btn-main modal-decision-button"
                    data-bs-dismiss="modal"
                    type="submit"
                  >
                    Potwierdź
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductTileCart from "@/components/assortment/ProductTileCart";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
export default {
  name: "Cart",
  setup() {
    return { v$: useVuelidate() };
  },
  components: {
    ProductTileCart,
    Datepicker,
  },
  data() {
    return {
      cart: null,
      deletedPosition: null,
      datesRange: [],
      newOrder: {
        address: "",
        transport: false,
        comment: "",
      },
    };
  },
  validations() {
    return {
      newOrder: {
        address: {
          required: helpers.withMessage(
            "To pole nie może być puste.",
            required
          ),
        },
      },
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
          this.$store.commit("setTotalCost", response.data.totalCost);
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
    async changeOrderDetails() {
      const url = `${this.apiURL}api/Orders/${this.cart.orderId}`;
      const token = this.$store.getters.getToken;

      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;

      this.axios
        .put(url, this.newOrder, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          this.submitOrder();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    submitOrder() {
      const url = `${this.apiURL}api/Orders/${this.cart.orderId}/status`;
      const token = this.$store.getters.getToken;

      const data = {
        status: "PENDING",
      };

      this.axios
        .put(url, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          this.getCart();
        })
        .catch((error) => {
          console.log(error);
        });
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

.modal-header {
  border-bottom: none;
}

.form-check-input:focus {
  border-color: var(--PRIMARY-LIGHTER);
  box-shadow: none;
}
.form-check-input:checked {
  background-color: var(--PRIMARY);
  border-color: var(--PRIMARY);
}
</style>
