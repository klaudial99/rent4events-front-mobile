<template>
  <div>
    <div
      v-if="
        orderSource && orderPositionSource && orderPositionSource.length > 0
      "
      class="table-responsive"
    >
      <table class="table table-hover align-middle">
        <thead>
          <tr>
            <th scope="col" class="text-start">Produkt</th>
            <th scope="col">Liczba sztuk</th>
            <th scope="col">Cena za sztukę</th>
            <th scope="col">Cena za dzień</th>
            <th scope="col">Cena razem</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pos in orderPositionSource" :key="pos.productId">
            <td class="text-start">{{ pos.product.name }}</td>
            <td
              :class="{
                'error-cart':
                  isAdmin &&
                  orderSource.status === 'PENDING' &&
                  pos.product.availableInDateRange < pos.quantity,
              }"
            >
              {{ pos.quantity }}
            </td>
            <td>
              {{ this.$func_global.formatPrice(pos.product.priceInDateRange) }}
              zł
            </td>
            <td>{{ this.$func_global.formatPrice(pos.totalCostPerDay) }} zł</td>
            <td>{{ this.$func_global.formatPrice(pos.totalCost) }} zł</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  name: "OrderPositionsTable",
  props: {
    orderPositionSource: Array,
    orderSource: Object,
  },
  computed: {
    isAdmin() {
      return this.$store.getters.getRole === "Manager";
    },
  },
};
</script>

<style scoped>
* {
  color: var(--BLACK);
}
</style>
