<template>
  <div
    class="product-tile p-2 d-flex align-items-center row"
    v-if="orderPosition"
  >
    <div class="col-2 text-center">
      <img
        v-if="orderPosition.product.images[0]"
        class="tile-photo"
        :class="{ 'unavailable-photo': this.tooMuchInCart }"
        :src="
          this.$func_global.getPhotoSource(orderPosition.product.images[0].url)
        "
        alt="Product photo"
      />
      <img
        v-else
        class="tile-photo"
        src="@/assets/no-image-icon.png"
        alt="Product photo"
      />
    </div>

    <div class="col-4 col-sm-5 text-start">
      <div class="category-text">
        {{ orderPosition.product.categoryName }}
      </div>
      <div class="name-text">{{ orderPosition.product.name }}</div>
    </div>

    <div class="col-3">
      <div v-if="tooMuchInCart" class="d-flex">
        <div class="error-cart align-self-center me-md-3">
          {{ orderPosition.quantity }}
        </div>
        <button
          class="btn btn-no-style category-text text-nowrap"
          type="button"
          @click="deleteOverflow"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
        >
          Usuń nadmiar
        </button>
      </div>

      <div v-else class="d-flex">
        <button class="btn table-btn">
          <font-awesome-icon
            :icon="['fa', 'trash']"
            size="sm"
            class="table-icon"
            data-bs-toggle="modal"
            data-bs-target="#orderPositionDeleteModal"
            @click="setPositionToDelete"
          />
        </button>
        <div class="input-cart w-100 d-flex">
          <button
            v-if="units === 1"
            type="button"
            class="btn btn-no-style btn-cart d-none d-md-block"
            @click="setPositionToDelete"
            data-bs-toggle="modal"
            data-bs-target="#orderPositionDeleteModal"
          >
            <font-awesome-icon :icon="['fa', 'minus']" />
          </button>
          <button
            v-else
            type="button"
            class="btn btn-no-style btn-cart d-none d-md-block"
            @click="
              units--;
              updateCartWithTimeout();
            "
          >
            <font-awesome-icon :icon="['fa', 'minus']" />
          </button>
          <input
            v-model="units"
            type="number"
            min="0"
            :max="orderPosition.product.availableInDateRange"
            class="flex-fill fw-500 number-text"
            @change="updateCartWithTimeout"
          />
          <button
            type="button"
            class="btn btn-no-style btn-cart d-none d-md-block"
            @click="
              units++;
              updateCartWithTimeout();
            "
            :class="{
              disabled: units >= orderPosition.product.availableInDateRange,
            }"
          >
            <font-awesome-icon :icon="['fa', 'plus']" />
          </button>
        </div>
      </div>
    </div>

    <div class="col-3 col-sm-2 text-end">{{ orderPosition.totalCost }} zł</div>
  </div>
</template>

<script>
export default {
  name: "ProductTileCart",
  props: {
    orderPositionSource: Object,
    cartId: Number,
  },
  data() {
    return {
      orderPosition: null,
      units: 0,
      changeTime: new Date(),
    };
  },
  methods: {
    updateCart() {
      const url = `${this.apiURL}api/Orders/order/${this.cartId}/product/${this.orderPosition.productId}`;
      const token = this.$store.getters.getToken;

      const product = {
        quantity: this.units,
      };

      return this.axios
        .put(url, product, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          console.log(
            "PRODUKT: ",
            response.data.productId,
            " SZTUKI: ",
            response.data.quantity
          );
          if (this.units === 0) {
            this.$emit("update:cart");
          }
          this.orderPosition = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateCartWithTimeout() {
      this.changeTime = new Date();
      setTimeout(() => {
        const newTime = new Date();
        if (newTime - this.changeTime > 1000) {
          this.updateCart();
          this.changeTime = newTime;
        }
      }, 1000);
    },
    async deleteOverflow() {
      console.log("USUWAM");
      this.units = this.orderPosition.product.availableInDateRange;
      await this.updateCart();
      this.$emit("update:cart");
    },
    setUnitsOnCartEnter() {
      if (
        0 <
        this.orderPosition.quantity <=
        this.orderPosition.product.availableInDateRange
      )
        this.units = this.orderPosition.quantity;
    },
    setPositionToDelete() {
      this.$emit("set:position", this.orderPosition);
    },
  },
  mounted() {
    this.orderPosition = this.orderPositionSource;
    this.setUnitsOnCartEnter();
  },
  computed: {
    tooMuchInCart() {
      return (
        this.orderPosition.quantity >
        this.orderPosition.product.availableInDateRange
      );
    },
  },
  watch: {
    units: function () {
      if (this.units > this.orderPosition.product.availableInDateRange)
        this.units = this.orderPosition.product.availableInDateRange;

      if (this.units < 0) this.units = 1;
    },
  },
};
</script>

<style scoped>
@media (min-width: 1px) and (max-width: 767px) {
  .tile-photo {
    height: 100%;
    width: 100%;
  }
}

@media (min-width: 768px) {
  .tile-photo {
    max-height: 4rem;
    width: auto;
  }
}

.btn-cart {
  color: var(--PRIMARY);
  padding: 0 0.5rem;
}

.btn-cart:hover {
  background-color: var(--GREY-LIGHT);
}

input {
  border: 1px solid transparent;
  text-align: center;
  border-radius: 5px;
  font-size: smaller;
  background-color: var(--GREY-LIGHT);
}

.product-tile:hover input:hover {
  background-color: var(--GREY-LIGHT);
}

input:focus-visible {
  border: 2px solid var(--PRIMARY) !important;
  outline: none;
  padding: 0;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.table-icon {
  color: var(--GREY-DARKER);
}

.table-icon:hover {
  color: var(--PRIMARY);
}
</style>
