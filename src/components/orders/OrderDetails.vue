<template>
  <div class="row">
    <div class="col-12 col-md-6 col-lg-4 text-start">
      <span class="fw-bolder">Początek wypożyczenia: </span>
      <span>{{ this.$func_global.formatDate(orderSource.startDate) }}</span>
    </div>
    <div class="col-12 col-md-6 col-lg-4 text-start">
      <span class="fw-bolder">Koniec wypożyczenia: </span>
      <span>{{ this.$func_global.formatDate(orderSource.endDate) }}</span>
    </div>
    <div class="col-12 col-md-6 col-lg-4 text-start">
      <span class="fw-bolder">Adres: </span>
      <span>{{ orderSource.address }}</span>
    </div>
    <div class="col-12 col-md-6 col-lg-4 text-start">
      <span class="fw-bolder">Transport: </span>
      <font-awesome-icon v-if="orderSource.transport" :icon="['fa', 'check']" />
      <font-awesome-icon v-else :icon="['fa', 'xmark']" />
    </div>
    <div class="col-12 col-md-6 col-lg-4 text-start">
      <span class="fw-bolder">Status: </span>
      <span>{{
        this.$func_global.mapOrderStatusName(orderSource.status)
      }}</span>
    </div>
    <div class="col-12 col-md-6 col-lg-4 text-start">
      <span class="fw-bolder">Całkowity koszt: </span>
      <span>{{ this.$func_global.formatPrice(orderSource.totalCost) }} zł</span>
    </div>
    <div class="col-12 text-start">
      <span class="fw-bolder">Komentarz: </span>
      <p>{{ orderSource.comment }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderDetails",
  props: {
    orderSource: Object,
  },
};
</script>

<style scoped></style>
