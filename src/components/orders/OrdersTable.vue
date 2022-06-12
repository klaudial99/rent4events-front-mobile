<template>
  <div>
    <div
      v-if="ordersSource && ordersSource.length > 0"
      class="table-responsive"
    >
      <table class="table table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">Data rozpoczęcia</th>
            <th scope="col">Data zakończenia</th>
            <th scope="col">Status</th>
            <th scope="col">Koszt</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in ordersSource" :key="order.orderId">
            <td>{{ this.$func_global.formatDate(order.startDate) }}</td>
            <td>{{ this.$func_global.formatDate(order.endDate) }}</td>
            <td>{{ this.$func_global.mapOrderStatusName(order.status) }}</td>
            <td>{{ this.$func_global.formatPrice(order.totalCost) }} zł</td>

            <td class="text-start">
              <button class="btn table-btn" v-if="order.status === 'PENDING'">
                <font-awesome-icon
                  :icon="['fa', 'trash']"
                  size="sm"
                  class="table-icon"
                  data-bs-toggle="modal"
                  data-bs-target="#orderCancelModal"
                  @click="cancelledOrder = order"
                />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <no-results-filter
      v-else-if="filtersSource && ordersSource && ordersSource.length === 0"
    />

    <div
      class="my-5"
      v-else-if="!filtersSource && ordersSource && ordersSource.length === 0"
    >
      <h5>Nie posiadasz jeszcze złożonych zamówień.</h5>
    </div>

    <div class="modal fade" tabindex="-1" id="orderCancelModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body" v-if="cancelledOrder">
            <button
              id="orderCancelModalClose"
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
            <div class="container mt-4">
              <div class="row">
                <div class="col">
                  <p>
                    Czy na pewno chcesz anulować zamówienie w dniach
                    <span class="fst-italic">
                      {{
                        this.$func_global.formatDate(cancelledOrder.startDate)
                      }}
                      -
                      {{
                        this.$func_global.formatDate(cancelledOrder.endDate)
                      }}</span
                    >?
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
                    @click="cancelOrder"
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
  </div>
</template>

<script>
import NoResultsFilter from "@/components/other/NoResultsFilter";
export default {
  name: "OrdersTable",
  components: {
    NoResultsFilter,
  },
  props: {
    ordersSource: Array,
    filtersSource: Boolean,
  },
  data() {
    return {
      cancelledOrder: null,
    };
  },
  methods: {
    async cancelOrder() {
      const url = `${this.apiURL}api/Orders/${this.cancelledOrder.orderId}/status`;
      const token = this.$store.getters.getToken;

      const data = {
        status: "CANCELLED",
      };

      this.axios
        .put(url, data, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          this.$emit("cancel:order", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped></style>
