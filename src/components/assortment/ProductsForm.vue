<template>
  <form @submit.prevent="addProduct" novalidate>
    <div class="row gy-3 mb-3">
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="text-start">
          <label for="productNameInput" class="form-label">Nazwa:</label>
          <input
            @blur="v$.newProduct.Name.$touch"
            type="text"
            class="form-control"
            id="productNameInput"
            v-model="newProduct.Name"
            :class="{
              'error-input': v$.newProduct.Name.$error || productNameTaken,
            }"
            @focus="clearStatus"
            @keypress="clearStatus"
          />
          <div
            v-for="error of v$.newProduct.Name.$errors"
            :key="error.$uid"
            class="text-start mx-1"
          >
            <span class="error-msg">{{ error.$message }}</span>
          </div>
          <div class="text-start mx-1" v-if="productNameTaken">
            <span class="error-msg"
              >Produkt o podanej nazwie już istnieje.</span
            >
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="text-start">
          <label for="productQuantityInput" class="form-label"
            >Liczba sztuk:</label
          >
          <input
            @blur="v$.newProduct.Quantity.$touch"
            type="number"
            min="0"
            class="form-control"
            id="productQuantityInput"
            v-model="newProduct.Quantity"
            :class="{ 'error-input': v$.newProduct.Quantity.$error }"
          />
          <div
            v-for="error of v$.newProduct.Quantity.$errors"
            :key="error.$uid"
            class="text-start mx-1"
          >
            <span class="error-msg">{{ error.$message }}</span>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="text-start">
          <label for="productCategoryInput" class="form-label"
            >Kategoria:</label
          >
          <select
            v-model="newProduct.Category"
            class="form-select form-control btn-no-style"
            id="productCategoryInput"
          >
            <option
              v-for="cat in categoriesSource"
              :key="cat.categoryId"
              :value="cat.categoryName"
            >
              {{ cat.categoryName }}
            </option>
          </select>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="text-start">
          <label for="productPriceInput" class="form-label">Cena:</label>
          <input
            @blur="v$.newProduct.Price.$touch"
            type="number"
            min="0"
            class="form-control"
            id="productPriceInput"
            v-model="newProduct.Price"
            :class="{ 'error-input': v$.newProduct.Price.$error }"
          />
          <div
            v-for="error of v$.newProduct.Price.$errors"
            :key="error.$uid"
            class="text-start mx-1"
          >
            <span class="error-msg">{{ error.$message }}</span>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="text-start">
          <label for="productImageFileInput" class="form-label">Zdjęcie:</label>
          <input
            class="form-control"
            type="file"
            id="productImageFileInput"
            accept="image/png, image/jpeg, image/png"
            @change="changePhoto"
          />
        </div>
      </div>
      <div class="col-12">
        <div class="text-start">
          <label for="productDescriptionInput" class="form-label">Opis:</label>
          <textarea
            @blur="v$.newProduct.Description.$touch"
            rows="3"
            class="form-control"
            id="productDescriptionInput"
            v-model="newProduct.Description"
            :class="{
              'error-input': v$.newProduct.Description.$error,
            }"
          />
          <div
            v-for="error of v$.newProduct.Description.$errors"
            :key="error.$uid"
            class="text-start mx-1"
          >
            <span class="error-msg">{{ error.$message }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-end">
      <div class="col-3 col-md-2 d-none d-sm-block">
        <button type="submit" class="btn btn-main">Dodaj</button>
      </div>
    </div>
    <div class="row justify-content-center mt-4 d-sm-none">
      <div class="col-9">
        <button type="submit" class="btn btn-main btn-main-mobile">
          Dodaj
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { helpers, integer, numeric, required } from "@vuelidate/validators";

export default {
  name: "ProductsForm",
  setup() {
    return { v$: useVuelidate() };
  },
  props: {
    categoriesSource: Array,
  },
  data() {
    return {
      newProduct: {
        Name: "",
        Description: "",
        Quantity: 0,
        Category: "",
        ImageFile: null,
        Price: 0,
      },
      productNameTaken: false,
    };
  },
  validations() {
    return {
      newProduct: {
        Name: {
          required: helpers.withMessage(
            "To pole nie może być puste.",
            required
          ),
        },
        Description: {
          required: helpers.withMessage(
            "To pole nie może być puste.",
            required
          ),
        },
        Quantity: {
          required: helpers.withMessage(
            "To pole nie może być puste.",
            required
          ),
          integer: helpers.withMessage(
            "To pole może zawierać jedynie cyfry.",
            integer
          ),
        },
        Price: {
          required: helpers.withMessage(
            "To pole nie może być puste.",
            required
          ),
          numeric: helpers.withMessage(
            "To pole może zawierać jedynie cyfry.",
            numeric
          ),
        },
      },
    };
  },
  methods: {
    async addProduct() {
      const url = `${this.apiURL}api/Products`;
      const token = this.$store.getters.getToken;

      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;

      this.clearStatus();

      let formData = new FormData();
      for (const elem in this.newProduct) {
        formData.append(elem, this.newProduct[elem]);
      }

      this.axios
        .post(url, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.$emit("add:product", response.data);
          this.clearNewProductData();
          this.v$.$reset();
          document.getElementById("productImageFileInput").value = null;
        })
        .catch((error) => {
          if (
            this.$func_global.getErrorCode(error.response.data.message) ===
            "100"
          )
            this.productNameTaken = true;
        });
    },
    changePhoto(e) {
      const file = e.target.files[0];
      if (e.target.id === "productImageFileInput" && file) {
        this.newProduct.ImageFile = file;
      }
    },
    clearStatus() {
      this.productNameTaken = false;
    },
    clearNewProductData() {
      this.newProduct = {
        Name: "",
        Description: "",
        Quantity: 0,
        Category: "",
        ImageFile: "",
        Price: 0,
      };
    },
  },
};
</script>

<style scoped></style>
