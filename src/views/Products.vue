<template>
  <div class="container">
    <div class="row mt-4">
      <div class="col text-start ms-0 ms-lg-4">
        <h3>Produkty</h3>
      </div>
      <div class="col text-end">
        <button
          class="btn btn-no-style"
          v-if="addNewProduct"
          @click="addNewProduct = !addNewProduct"
        >
          <font-awesome-icon
            :icon="['fa', 'eye-slash']"
            size="sm"
            class="add-hide-icon"
          />
          <span class="d-none d-md-inline"> Ukryj dodawanie produktu </span>
        </button>
        <button
          class="btn btn-no-style"
          v-else
          @click="addNewProduct = !addNewProduct"
        >
          <font-awesome-icon
            :icon="['fa', 'plus']"
            size="sm"
            class="add-hide-icon"
          />
          <span class="d-none d-md-inline"> Dodaj nowy produkt </span>
        </button>
      </div>
    </div>
    <div class="row justify-content-center" v-if="addNewProduct">
      <div class="col ms-0 ms-lg-4 mt-4">
        <h6 class="text-start new-item">Nowy produkt:</h6>
        <products-form
          @add:product="addProduct"
          :categories-source="categories"
        />
      </div>
    </div>
  </div>
  <div class="filter-row">
    <div class="container">
      <div class="d-flex align-items-center text-start ms-0 ms-lg-4">
        <div class="d-flex align-items-center flex-grow-1" id="filters">
          <div class="filters-title">Filtry:</div>
          <div class="d-flex filters">
            <div id="product-category" class="filters-group">
              <select
                v-model="userParams.filters.categoryName"
                class="form-select form-select-sm form-control btn-no-style"
                id="productCategoryFilter"
                @change="getProducts(true)"
              >
                <option value="" selected disabled>Kategoria</option>
                <option value="">-</option>
                <option
                  v-for="cat in this.categories"
                  :key="cat.categoryId"
                  :value="cat.categoryName"
                >
                  {{ cat.categoryName }}
                </option>
              </select>
            </div>

            <div id="product-sort" class="filters-group">
              <select
                v-model="userParams.orderBy"
                class="form-select form-select-sm form-control btn-no-style"
                id="productSort"
                @change="getProducts(true)"
              >
                <option value="" selected disabled>Sortowanie</option>
                <option value="">-</option>
                <option
                  v-for="sort in filters.sortByOptions"
                  :key="sort.label"
                  :value="sort.value"
                >
                  {{ sort.label }}
                </option>
              </select>
            </div>

            <div id="product-clear" v-if="filtersApplied">
              <button
                class="btn btn-filters"
                @click="
                  clearFilters();
                  getProducts(true);
                "
              >
                Wyczyść wszystkie
              </button>
            </div>
          </div>
        </div>

        <pagination
          :navigation-source="navigation"
          @switch:page="handleGoToPage"
          class="d-none d-lg-flex"
        />
      </div>
    </div>
  </div>

  <div class="container d-lg-none">
    <div class="d-flex flex-row-reverse">
      <pagination
        :navigation-source="navigation"
        @switch:page="handleGoToPage"
      />
    </div>
  </div>

  <div class="container">
    <products-table
      :products-source="products"
      :categories-source="categories"
      :filters-source="filtersApplied"
      class="mt-4"
      @edit:product="editProduct"
      @delete:product="deleteProduct"
    />
  </div>

  <div class="container mb-3" v-if="products.length >= 10">
    <div class="d-flex flex-row-reverse">
      <pagination
        :navigation-source="navigation"
        @switch:page="handleGoToPage"
      />
    </div>
  </div>
</template>

<script>
import ProductsTable from "@/components/assortment/ProductsTable";
import ProductsForm from "@/components/assortment/ProductsForm";
import Pagination from "@/components/pagination/Pagination";

export default {
  name: "Products",
  components: {
    ProductsTable,
    ProductsForm,
    Pagination,
  },
  data() {
    return {
      products: [],
      categories: [],
      addNewProduct: false,
      userParams: {
        goToPage: 1,
        itemsPerPage: 20,
        filters: {
          categoryName: "",
        },
        orderBy: "",
      },
      filters: {
        sortByOptions: [
          { label: "Nazwa A-Z", value: "name asc" },
          { label: "Nazwa Z-A", value: "name desc" },
          { label: "Kategoria A-Z", value: "categoryName asc" },
          { label: "Kategoria Z-A", value: "categoryName desc" },
        ],
      },
      navigation: {
        totalCount: 0,
        page: 1,
        itemsPerPage: 20,
        isFirst: false,
        isLast: false,
        isEmpty: false,
        totalPages: 1,
      },
    };
  },
  methods: {
    getProducts(firstPage) {
      const url = `${this.apiURL}api/Products`;
      const token = this.$store.getters.getToken;
      const requestParams = {
        Page: firstPage ? 1 : this.userParams.goToPage,
        PageSize: this.userParams.itemsPerPage,
        OrderBy: this.userParams.orderBy,
        Filter: this.filterString,
      };

      this.axios
        .get(url, {
          params: requestParams,
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.products = response.data.results;
          this.navigation.totalCount = response.data.totalCount;
          this.navigation.page = response.data.page;
          this.navigation.itemsPerPage = response.data.itemsPerPage;

          this.navigation.isFirst = response.data.isFirst;
          this.navigation.isLast = response.data.isLast;
          this.navigation.isEmpty = response.data.isEmpty;
          this.navigation.totalPages = response.data.totalPages;
        })
        .catch((error) => {
          console.log(error);
        });
    },
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
    addProduct(product) {
      this.navigation.totalCount++;
      this.products.unshift(product);
    },
    editProduct(product) {
      const index = this.products.findIndex(
        (prod) => prod.productId === product.productId
      );
      this.products[index] = product;
    },
    deleteProduct(productId) {
      const index = this.products.findIndex(
        (prod) => prod.productId === productId
      );
      this.products.splice(index, 1);
      this.navigation.totalCount--;
    },
    clearFilters() {
      this.userParams.filters.categoryName = "";
      this.userParams.orderBy = "";
    },
    handleGoToPage(number) {
      this.userParams.goToPage = number;
      this.getProducts(false);
    },
  },
  mounted() {
    this.getProducts(true);
    this.getCategories();
  },
  computed: {
    filtersApplied() {
      return (
        this.userParams.filters.categoryName !== "" || this.userParams.orderBy
      );
    },
    filterString() {
      return this.$func_global.formatFilters(this.userParams.filters);
    },
  },
};
</script>

<style scoped>
.form-select {
  margin: 0 0.8rem;
  width: fit-content;
}
</style>
