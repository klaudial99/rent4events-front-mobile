<template>
  <div class="container">
    <div class="row mt-4">
      <div class="col text-start ms-0 ms-lg-4">
        <h3>Kategorie</h3>
      </div>
      <div class="col text-end">
        <button
          class="btn btn-no-style"
          v-if="addNewCategory"
          @click="addNewCategory = !addNewCategory"
        >
          <font-awesome-icon
            :icon="['fa', 'eye-slash']"
            size="sm"
            class="add-hide-icon"
          />
          <span class="d-none d-md-inline"> Ukryj dodawanie kategorii </span>
        </button>
        <button
          class="btn btn-no-style"
          v-else
          @click="addNewCategory = !addNewCategory"
        >
          <font-awesome-icon
            :icon="['fa', 'plus']"
            size="sm"
            class="add-hide-icon"
          />
          <span class="d-none d-md-inline"> Dodaj nową kategorię </span>
        </button>
      </div>
    </div>
    <div class="row justify-content-center" v-if="addNewCategory">
      <div class="col ms-0 ms-lg-4 mt-4">
        <h6 class="text-start new-item">Nowa kategoria:</h6>
        <categories-form @add:category="addCategory" />
      </div>
    </div>

    <categories-table
      :categories-source="categories"
      class="mt-4"
      @edit:category="editCategory"
      @delete:category="deleteCategory"
    />
  </div>
</template>

<script>
import CategoriesTable from "@/components/assortment/CategoriesTable";
import CategoriesForm from "@/components/assortment/CategoriesForm";
export default {
  name: "Categories",
  components: {
    CategoriesTable,
    CategoriesForm,
  },
  data() {
    return {
      categories: [],
      addNewCategory: false,
    };
  },
  methods: {
    getCategories() {
      const url = `${this.apiURL}api/Categories`;
      const token = this.$store.getters.getToken;

      this.axios
        .get(url, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          this.categories = response.data.results;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addCategory(category) {
      this.categories.unshift(category);
    },
    editCategory(category) {
      const index = this.categories.findIndex(
        (cat) => cat.categoryId === category.categoryId
      );
      this.categories[index] = category;
    },
    deleteCategory(categoryId) {
      const index = this.categories.findIndex(
        (cat) => cat.categoryId === categoryId
      );
      this.categories.splice(index, 1);
    },
  },
  mounted() {
    this.getCategories();
  },
};
</script>

<style scoped></style>
