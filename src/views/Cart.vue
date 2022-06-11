<template>
  <div v-if="cart" class="container">
    <div v-for="pos in cart.orderPositions" :key="pos.productId" class="my-3">
      <product-tile-cart
        :order-position-source="pos"
        :cart-id="cart.orderId"
        @set:position="setPositionToDelete"
        @update:cart="getCart"
      />
    </div>

    <p class="text-start">OD {{ cart.startDate }}</p>
    <p class="text-start">DO {{ cart.endDate }}</p>
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
export default {
  name: "Cart",
  components: {
    ProductTileCart,
  },
  data() {
    return {
      cart: null,
      deletedPosition: null,
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
        })
        .catch((error) => {
          console.log(error);
        });
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
