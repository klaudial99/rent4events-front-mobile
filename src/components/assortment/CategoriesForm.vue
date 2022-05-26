<template>
  <form @submit.prevent="addCategory" novalidate>
    <div class="row justify-content-center align-items-end">
      <div class="col-12 col-sm-9 col-md-10">
        <div class="text-start">
          <label for="categoryNameInput" class="form-label">Nazwa:</label>
          <input
            @blur="v$.categoryName.$touch"
            type="text"
            class="form-control"
            id="categoryNameInput"
            v-model="categoryName"
            :class="{
              'error-input': v$.categoryName.$error || categoryNameTaken,
            }"
            @focus="clearStatus"
            @keypress="clearStatus"
          />
        </div>
      </div>
      <div class="col-3 col-md-2 d-none d-sm-block">
        <button type="submit" class="btn btn-main">Dodaj</button>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div
          v-for="error of v$.categoryName.$errors"
          :key="error.$uid"
          class="text-start mx-1"
        >
          <span class="error-msg">{{ error.$message }}</span>
        </div>
        <div class="text-start mx-1" v-if="categoryNameTaken">
          <span class="error-msg"
            >Kategoria o podanej nazwie już istnieje.</span
          >
        </div>
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
import { helpers, required } from "@vuelidate/validators";

export default {
  name: "CategoriesForm",
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      categoryName: "",
      categoryNameTaken: false,
    };
  },
  validations() {
    return {
      categoryName: {
        required: helpers.withMessage("To pole nie może być puste.", required),
      },
    };
  },
  methods: {
    async addCategory() {
      const category = {
        categoryGroup: 0,
        categoryName: this.categoryName,
      };

      const url = `${this.apiURL}api/Categories`;
      const token = this.$store.getters.getToken;

      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;

      this.clearStatus();

      this.axios
        .post(url, category, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          this.$emit("add:category", response.data);
          this.clearNewCategoryData();
          this.v$.$reset();
        })
        .catch((error) => {
          if (
            this.$func_global.getErrorCode(error.response.data.message) ===
            "101"
          )
            this.categoryNameTaken = true;
        });
    },
    clearNewCategoryData() {
      this.categoryName = "";
    },
    clearStatus() {
      this.categoryNameTaken = false;
    },
  },
};
</script>

<style scoped></style>
