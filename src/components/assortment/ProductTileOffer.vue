<template>
  <div class="product-tile pb-2 pt-3 px-3">
    <img
      v-if="productSource.images[0]"
      class="tile-photo"
      :src="this.$func_global.getPhotoSource(productSource.images[0].url)"
      alt="Product photo"
    />
    <img
      v-else
      class="tile-photo"
      src="@/assets/no-image-icon.png"
      alt="Product photo"
    />
    <div class="text-start category-text ms-2 mt-2">
      {{ productSource.categoryName }}
    </div>
    <div class="text-start name-text ms-2">{{ productSource.name }}</div>
    <div class="text-start ms-2">
      <span class="fw-500"
        >{{
          this.$func_global.formatPrice(productSource.priceInDateRange)
        }}
        zł</span
      >
      / dzień
    </div>
    <div class="text-start category-text ms-2 my-1">
      Dostępnych: {{ productSource.availableInDateRange }}
    </div>

    <button
      v-if="units === 0"
      class="btn btn-main btn-no-style w-100 mt-2"
      type="button"
      @click="
        units++;
        updateCartWithTimeout();
      "
    >
      <font-awesome-icon :icon="['fa', 'cart-shopping']" />
    </button>
    <div v-else class="input-cart w-100 mt-2 d-flex">
      <button
        type="button"
        class="btn btn-no-style btn-cart"
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
        :max="productSource.availableInDateRange"
        class="flex-fill fw-500 number-text"
        @change="updateCartWithTimeout"
      />
      <button
        type="button"
        class="btn btn-no-style btn-cart"
        @click="
          units++;
          updateCartWithTimeout();
        "
        :class="{ disabled: units >= productSource.availableInDateRange }"
      >
        <font-awesome-icon :icon="['fa', 'plus']" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductTileOffer",
  props: {
    productSource: Object,
    cartId: Number,
  },
  data() {
    return {
      units: 0,
      changeTime: new Date(),
    };
  },
  methods: {
    updateCart() {
      const url = `${this.apiURL}api/Orders/order/${this.cartId}/product/${this.productSource.productId}`;
      const token = this.$store.getters.getToken;

      const product = {
        quantity: this.units,
      };

      this.axios
        .put(url, product, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          console.log(
            "PRODUKT: ",
            response.data.productId,
            " SZTUKI: ",
            response.data.quantity
          );
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateCartWithTimeout() {
      this.changeTime = new Date();
      console.log("PRZYPISANIE DATY");
      setTimeout(() => {
        const newTime = new Date();
        if (newTime - this.changeTime > 2000) {
          this.updateCart();
          this.changeTime = newTime;
        }
      }, 2000);
    },
  },
  watch: {
    units: function () {
      if (this.units > this.productSource.availableInDateRange)
        this.units = this.productSource.availableInDateRange;

      if (this.units < 0) this.units = 1;
    },
  },
};
</script>

<style scoped>
.tile-photo {
  height: 9rem;
  width: auto;
}

.product-tile {
  border-radius: 10px;
}

.product-tile:hover {
  background-color: var(--GREY-LIGHT);
}

.input-cart {
  border-radius: 10px;
  background-color: var(--GREY-LIGHT);
  padding: 0.3rem 1rem;
  border: 2px solid var(--GREY-LIGHT);
}

.product-tile:hover .input-cart,
.product-tile:hover input {
  background-color: white;
}

.btn-cart {
  color: var(--PRIMARY);
  padding: 0 0.5rem;
}

.btn-cart:hover {
  background-color: var(--GREY-LIGHT);
}

.name-text {
  font-size: larger;
}

.category-text {
  color: var(--BLACK-LIGHTER);
  font-size: smaller;
}

.number-text {
  color: var(--PRIMARY);
}

.btn-main {
  padding: 0.3rem 1rem;
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
</style>
