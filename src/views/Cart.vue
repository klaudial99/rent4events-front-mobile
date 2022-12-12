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
              <div class="row" v-if="version === 'A'">
                <div class="col-12 text-start">
                  <h6>Adres rozliczeniowy:</h6>
                </div>
                <div class="col-6">
                  <div class="mb-2 text-start">
                    <label for="billingStreetInput" class="form-label"
                      >Ulica i numer domu:</label
                    >
                    <input
                      @blur="v$.newOrder.billingAddress.street.$touch"
                      type="text"
                      class="form-control"
                      id="billingStreetInput"
                      v-model="newOrder.billingAddress.street"
                      :class="{
                        'error-input': v$.newOrder.billingAddress.street.$error,
                      }"
                    />
                    <div
                      v-for="error of v$.newOrder.billingAddress.street.$errors"
                      :key="error.$uid"
                      class="text-start mx-1"
                    >
                      <span class="error-msg">{{ error.$message }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-2 text-start">
                    <label for="billingApartmentNumberInput" class="form-label"
                      >Numer mieszkania:</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="billingApartmentNumberInput"
                      v-model="newOrder.billingAddress.apartmentNumber"
                    />
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-2 text-start">
                    <label for="billingPostalCodeInput" class="form-label"
                      >Kod pocztowy:</label
                    >
                    <input
                      @blur="v$.newOrder.billingAddress.postalCode.$touch"
                      type="text"
                      class="form-control"
                      id="billingPostalCodeInput"
                      v-model="newOrder.billingAddress.postalCode"
                      :class="{
                        'error-input':
                          v$.newOrder.billingAddress.postalCode.$error,
                      }"
                    />
                    <div
                      v-for="error of v$.newOrder.billingAddress.postalCode
                        .$errors"
                      :key="error.$uid"
                      class="text-start mx-1"
                    >
                      <span class="error-msg">{{ error.$message }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-2 text-start">
                    <label for="billingCityInput" class="form-label"
                      >Miasto:</label
                    >
                    <input
                      @blur="v$.newOrder.billingAddress.city.$touch"
                      type="text"
                      class="form-control"
                      id="billingCityInput"
                      v-model="newOrder.billingAddress.city"
                      :class="{
                        'error-input': v$.newOrder.billingAddress.city.$error,
                      }"
                    />
                    <div
                      v-for="error of v$.newOrder.billingAddress.city.$errors"
                      :key="error.$uid"
                      class="text-start mx-1"
                    >
                      <span class="error-msg">{{ error.$message }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-check mb-3 text-start">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="newOrder.transport"
                      :value="newOrder.transport"
                      id="isTransportInput"
                    />
                    <label class="form-check-label" for="isTransportInput">
                      Potrzebuję transportu
                    </label>
                  </div>
                </div>
              </div>
              <div class="row" v-if="newOrder.transport && version === 'A'">
                <div class="col-12 text-start">
                  <h6>Adres dostawy:</h6>
                </div>
                <div class="col-6">
                  <div class="mb-2 text-start">
                    <label for="shippingStreetInput" class="form-label"
                      >Ulica i numer domu:</label
                    >
                    <input
                      @blur="v$.newOrder.shippingAddress.street.$touch"
                      type="text"
                      class="form-control"
                      id="shippingStreetInput"
                      v-model="newOrder.shippingAddress.street"
                      :disabled="sameAddress"
                      :class="{
                        'error-input':
                          v$.newOrder.shippingAddress.street.$error,
                      }"
                    />
                    <div
                      v-for="error of v$.newOrder.shippingAddress.street
                        .$errors"
                      :key="error.$uid"
                      class="text-start mx-1"
                    >
                      <span class="error-msg">{{ error.$message }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-2 text-start">
                    <label for="shippingApartmentNumberInput" class="form-label"
                      >Numer mieszkania:</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="shippingApartmentNumberInput"
                      v-model="newOrder.shippingAddress.apartmentNumber"
                      :disabled="sameAddress"
                    />
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-2 text-start">
                    <label for="shippingPostalCodeInput" class="form-label"
                      >Kod pocztowy:</label
                    >
                    <input
                      @blur="v$.newOrder.shippingAddress.postalCode.$touch"
                      type="text"
                      class="form-control"
                      id="shippingPostalCodeInput"
                      v-model="newOrder.shippingAddress.postalCode"
                      :disabled="sameAddress"
                      :class="{
                        'error-input':
                          v$.newOrder.shippingAddress.postalCode.$error,
                      }"
                    />
                    <div
                      v-for="error of v$.newOrder.shippingAddress.postalCode
                        .$errors"
                      :key="error.$uid"
                      class="text-start mx-1"
                    >
                      <span class="error-msg">{{ error.$message }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-2 text-start">
                    <label for="shippingCityInput" class="form-label"
                      >Miasto:</label
                    >
                    <input
                      @blur="v$.newOrder.shippingAddress.city.$touch"
                      type="text"
                      class="form-control"
                      id="shippingCityInput"
                      v-model="newOrder.shippingAddress.city"
                      :disabled="sameAddress"
                      :class="{
                        'error-input': v$.newOrder.shippingAddress.city.$error,
                      }"
                    />
                    <div
                      v-for="error of v$.newOrder.shippingAddress.city.$errors"
                      :key="error.$uid"
                      class="text-start mx-1"
                    >
                      <span class="error-msg">{{ error.$message }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-check mb-3 text-start">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="sameAddress"
                      id="sameAddressInput"
                    />
                    <label class="form-check-label" for="sameAddressInput">
                      Taki sam jak adres rozliczeniowy
                    </label>
                  </div>
                </div>
              </div>

              <div class="row" v-if="version === 'B'">
                <div :class="[newOrder.transport ? 'col-6' : 'col-12']">
                  <div class="row">
                    <div class="col-12 text-start">
                      <h6>Adres rozliczeniowy:</h6>
                    </div>
                    <div :class="[newOrder.transport ? 'col-12' : 'col-6']">
                      <div class="mb-2 text-start">
                        <label for="billingStreetInputB" class="form-label"
                          >Ulica i numer domu:</label
                        >
                        <input
                          @blur="v$.newOrder.billingAddress.street.$touch"
                          type="text"
                          class="form-control"
                          id="billingStreetInputB"
                          v-model="newOrder.billingAddress.street"
                          :class="{
                            'error-input':
                              v$.newOrder.billingAddress.street.$error,
                          }"
                        />
                        <div
                          v-for="error of v$.newOrder.billingAddress.street
                            .$errors"
                          :key="error.$uid"
                          class="text-start mx-1"
                        >
                          <span class="error-msg">{{ error.$message }}</span>
                        </div>
                      </div>
                    </div>
                    <div :class="[newOrder.transport ? 'col-12' : 'col-6']">
                      <div class="mb-2 text-start">
                        <label
                          for="billingApartmentNumberInputB"
                          class="form-label"
                          >Numer mieszkania:</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          id="billingApartmentNumberInputB"
                          v-model="newOrder.billingAddress.apartmentNumber"
                        />
                      </div>
                    </div>
                    <div :class="[newOrder.transport ? 'col-12' : 'col-6']">
                      <div class="mb-2 text-start">
                        <label for="billingPostalCodeInputB" class="form-label"
                          >Kod pocztowy:</label
                        >
                        <input
                          @blur="v$.newOrder.billingAddress.postalCode.$touch"
                          type="text"
                          class="form-control"
                          id="billingPostalCodeInputB"
                          v-model="newOrder.billingAddress.postalCode"
                          :class="{
                            'error-input':
                              v$.newOrder.billingAddress.postalCode.$error,
                          }"
                        />
                        <div
                          v-for="error of v$.newOrder.billingAddress.postalCode
                            .$errors"
                          :key="error.$uid"
                          class="text-start mx-1"
                        >
                          <span class="error-msg">{{ error.$message }}</span>
                        </div>
                      </div>
                    </div>
                    <div :class="[newOrder.transport ? 'col-12' : 'col-6']">
                      <div class="mb-2 text-start">
                        <label for="billingCityInputB" class="form-label"
                          >Miasto:</label
                        >
                        <input
                          @blur="v$.newOrder.billingAddress.city.$touch"
                          type="text"
                          class="form-control"
                          id="billingCityInputB"
                          v-model="newOrder.billingAddress.city"
                          :class="{
                            'error-input':
                              v$.newOrder.billingAddress.city.$error,
                          }"
                        />
                        <div
                          v-for="error of v$.newOrder.billingAddress.city
                            .$errors"
                          :key="error.$uid"
                          class="text-start mx-1"
                        >
                          <span class="error-msg">{{ error.$message }}</span>
                        </div>
                      </div>
                    </div>
                    <div :class="[newOrder.transport ? 'col-12' : 'col-6']">
                      <div class="form-check mb-3 text-start">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          v-model="newOrder.transport"
                          :value="newOrder.transport"
                          id="isTransportInputB"
                        />
                        <label class="form-check-label" for="isTransportInputB">
                          Potrzebuję transportu
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-6" v-if="newOrder.transport">
                  <div class="col-12 text-start">
                    <h6>Adres dostawy:</h6>
                  </div>
                  <div class="col-12">
                    <div class="mb-2 text-start">
                      <label for="shippingStreetInputB" class="form-label"
                        >Ulica i numer domu:</label
                      >
                      <input
                        @blur="v$.newOrder.shippingAddress.street.$touch"
                        type="text"
                        class="form-control"
                        id="shippingStreetInputB"
                        v-model="newOrder.shippingAddress.street"
                        :disabled="sameAddress"
                        :class="{
                          'error-input':
                            v$.newOrder.shippingAddress.street.$error,
                        }"
                      />
                      <div
                        v-for="error of v$.newOrder.shippingAddress.street
                          .$errors"
                        :key="error.$uid"
                        class="text-start mx-1"
                      >
                        <span class="error-msg">{{ error.$message }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="mb-2 text-start">
                      <label
                        for="shippingApartmentNumberInputB"
                        class="form-label"
                        >Numer mieszkania:</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="shippingApartmentNumberInputB"
                        v-model="newOrder.shippingAddress.apartmentNumber"
                        :disabled="sameAddress"
                      />
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="mb-2 text-start">
                      <label for="shippingPostalCodeInputB" class="form-label"
                        >Kod pocztowy:</label
                      >
                      <input
                        @blur="v$.newOrder.shippingAddress.postalCode.$touch"
                        type="text"
                        class="form-control"
                        id="shippingPostalCodeInputB"
                        v-model="newOrder.shippingAddress.postalCode"
                        :disabled="sameAddress"
                        :class="{
                          'error-input':
                            v$.newOrder.shippingAddress.postalCode.$error,
                        }"
                      />
                      <div
                        v-for="error of v$.newOrder.shippingAddress.postalCode
                          .$errors"
                        :key="error.$uid"
                        class="text-start mx-1"
                      >
                        <span class="error-msg">{{ error.$message }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="mb-2 text-start">
                      <label for="shippingCityInputB" class="form-label"
                        >Miasto:</label
                      >
                      <input
                        @blur="v$.newOrder.shippingAddress.city.$touch"
                        type="text"
                        class="form-control"
                        id="shippingCityInputB"
                        v-model="newOrder.shippingAddress.city"
                        :disabled="sameAddress"
                        :class="{
                          'error-input':
                            v$.newOrder.shippingAddress.city.$error,
                        }"
                      />
                      <div
                        v-for="error of v$.newOrder.shippingAddress.city
                          .$errors"
                        :key="error.$uid"
                        class="text-start mx-1"
                      >
                        <span class="error-msg">{{ error.$message }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-check mb-3 text-start">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="sameAddress"
                        id="sameAddressInputB"
                      />
                      <label class="form-check-label" for="sameAddressInputB">
                        Taki sam jak adres rozliczeniowy
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col">
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
      sameAddress: false,
      version: "A",
      newOrder: {
        billingAddress: {
          street: "",
          apartmentNumber: "",
          postalCode: "",
          city: "",
        },
        transport: false,
        shippingAddress: {
          street: "",
          apartmentNumber: "",
          postalCode: "",
          city: "",
        },
        comment: "",
      },
    };
  },
  validations() {
    return {
      newOrder: {
        billingAddress: {
          street: {
            required: helpers.withMessage(
              "To pole nie może być puste.",
              required
            ),
          },
          postalCode: {
            required: helpers.withMessage(
              "To pole nie może być puste.",
              required
            ),
          },
          city: {
            required: helpers.withMessage(
              "To pole nie może być puste.",
              required
            ),
          },
        },
        shippingAddress: {
          street: {
            required: helpers.withMessage(
              "To pole nie może być puste.",
              required
            ),
          },
          postalCode: {
            required: helpers.withMessage(
              "To pole nie może być puste.",
              required
            ),
          },
          city: {
            required: helpers.withMessage(
              "To pole nie może być puste.",
              required
            ),
          },
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
  watch: {
    sameAddress(newValue) {
      if (newValue === true) {
        this.newOrder.shippingAddress.street =
          this.newOrder.billingAddress.street;
        this.newOrder.shippingAddress.apartmentNumber =
          this.newOrder.billingAddress.apartmentNumber;
        this.newOrder.shippingAddress.postalCode =
          this.newOrder.billingAddress.postalCode;
        this.newOrder.shippingAddress.city = this.newOrder.billingAddress.city;
      }
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
