<template>
  <div>KOSZYK</div>
  <div v-if="cart" class="container">
    <p
      v-for="item in cart.orderPositions"
      :key="item.productId"
      class="text-start"
    >
      ID:{{ item.productId }}, NAZWA: {{ item.product.name }}, SZTUKI:
      {{ item.quantity }}
    </p>
    <p class="text-start">OD {{ cart.startDate }}</p>
    <p class="text-start">DO {{ cart.endDate }}</p>
  </div>
</template>

<script>
export default {
  name: "Cart",
  data() {
    return {
      cart: null,
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
  },
  mounted() {
    this.getCart();
  },
};
</script>

<style scoped></style>
