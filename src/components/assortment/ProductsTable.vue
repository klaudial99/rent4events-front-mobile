<template>
  <div>
    <div
      v-if="productsSource && productsSource.length > 0"
      class="table-responsive"
    >
      <table class="table table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">Nazwa</th>
            <th scope="col">Kategoria</th>
            <th scope="col">Liczba sztuk</th>
            <th scope="col">Dostępne</th>
            <th scope="col">Cena</th>
            <th scope="col">Opis</th>
            <th scope="col">Zdjęcie</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prod in productsSource" :key="prod.productId">
            <td v-if="editMode && editedProduct === prod">
              <input
                @blur="v$.editedProductNewData.name.$touch"
                type="text"
                class="form-control"
                id="newNameInput"
                v-model="editedProductNewData.name"
                :class="{
                  'error-input':
                    v$.editedProductNewData.name.$error || productNameTaken,
                }"
                @focus="clearStatus"
                @keypress="clearStatus"
              />
            </td>
            <td v-else class="w-10">{{ prod.name }}</td>

            <td v-if="editMode && editedProduct === prod">
              <select
                v-model="editedProductNewData.categoryName"
                class="form-select form-control btn-no-style"
                id="newCategoryNameInput"
              >
                <option
                  v-for="cat in categoriesSource"
                  :key="cat.categoryId"
                  :value="cat.categoryName"
                >
                  {{ cat.categoryName }}
                </option>
              </select>
            </td>
            <td v-else class="w-10">{{ prod.categoryName }}</td>

            <td v-if="editMode && editedProduct === prod">
              <input
                @blur="v$.editedProductNewData.quantity.$touch"
                type="number"
                min="0"
                class="form-control"
                id="newQuantityInput"
                v-model="editedProductNewData.quantity"
                :class="{
                  'error-input': v$.editedProductNewData.quantity.$error,
                }"
              />
            </td>
            <td v-else class="w-10">{{ prod.quantity }}</td>

            <td>{{ prod.availableToday }}</td>

            <td class="text-nowrap">
              {{ this.$func_global.formatPrice(prod.priceToday) }} zł
            </td>

            <td v-if="editMode && editedProduct === prod">
              <input
                @blur="v$.editedProductNewData.description.$touch"
                type="text"
                class="form-control"
                id="newDescriptionInput"
                v-model="editedProductNewData.description"
                :class="{
                  'error-input': v$.editedProductNewData.description.$error,
                }"
              />
            </td>
            <td v-else class="text-start w-30">{{ prod.description }}</td>

            <td v-if="editMode && editedProduct === prod">
              <div
                v-if="hasImage"
                class="position-relative img-container mx-auto"
              >
                <img
                  class="product-photo"
                  :src="this.$func_global.getPhotoSource(prod.images[0].url)"
                  alt="Product photo"
                />
                <button
                  class="btn btn-no-style position-absolute delete-picture d-flex justify-content-center align-items-center"
                >
                  <font-awesome-icon
                    :icon="['fa', 'xmark']"
                    size="2xs"
                    class="delete-icon"
                    @click="deletePhotoInTable"
                  />
                </button>
              </div>

              <input
                v-else
                class="form-control"
                type="file"
                id="newImageFileInput"
                accept="image/png, image/jpeg, image/png"
                @change="changePhoto"
              />
            </td>
            <td v-else-if="prod.images[0]">
              <img
                class="product-photo w-10"
                :src="this.$func_global.getPhotoSource(prod.images[0].url)"
                alt="Product photo"
              />
            </td>
            <td v-else>-</td>

            <td
              v-if="editMode && editedProduct === prod"
              class="text-start w-10"
            >
              <button class="btn table-btn">
                <font-awesome-icon
                  :icon="['fa', 'xmark']"
                  size="sm"
                  class="table-icon"
                  @click="cancelEdit"
                />
              </button>
              <button class="btn table-btn">
                <font-awesome-icon
                  :icon="['fa', 'check']"
                  size="sm"
                  class="table-icon"
                  @click="confirmEdit"
                />
              </button>
            </td>
            <td v-else class="text-start w-10">
              <button class="btn table-btn">
                <font-awesome-icon
                  :icon="['fa', 'pen']"
                  size="sm"
                  class="table-icon"
                  @click="turnOnEditMode(prod)"
                />
              </button>
              <button class="btn table-btn" v-if="prod.deletable">
                <font-awesome-icon
                  :icon="['fa', 'trash']"
                  size="sm"
                  class="table-icon"
                  data-bs-toggle="modal"
                  data-bs-target="#productDeleteModal"
                  @click="deletedProduct = prod"
                />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <no-results-filter
      v-else-if="filtersSource && productsSource && productsSource.length === 0"
    />
    <no-results
      v-else-if="
        !filtersSource && productsSource && productsSource.length === 0
      "
    />

    <div class="modal fade" tabindex="-1" id="productDeleteModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body" v-if="deletedProduct">
            <button
              id="productDeleteModalClose"
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
            <div class="container mt-4">
              <div class="row">
                <div class="col">
                  <p>
                    Czy na pewno chcesz usunąć produkt
                    <span class="fst-italic"> {{ deletedProduct.name }} </span>?
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
                    @click="deleteProduct"
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
import useVuelidate from "@vuelidate/core";
import { helpers, integer, required } from "@vuelidate/validators";
import NoResultsFilter from "@/components/other/NoResultsFilter";
import NoResults from "@/components/other/NoResults";

export default {
  name: "ProductsTable",
  setup() {
    return { v$: useVuelidate() };
  },
  props: {
    productsSource: Array,
    categoriesSource: Array,
    filtersSource: Boolean,
  },
  components: {
    NoResultsFilter,
    NoResults,
  },
  data() {
    return {
      editMode: false,
      editedProduct: null,
      hasImage: false,
      changingImage: false,
      deletedProduct: null,
      productNameTaken: false,
      editedProductNewData: {
        name: "",
        description: "",
        quantity: 0,
        categoryName: "",
        imageFile: null,
      },
    };
  },
  validations() {
    return {
      editedProductNewData: {
        name: {
          required: helpers.withMessage(
            "To pole nie może być puste.",
            required
          ),
        },
        description: {
          required: helpers.withMessage(
            "To pole nie może być puste.",
            required
          ),
        },
        quantity: {
          required: helpers.withMessage(
            "To pole nie może być puste.",
            required
          ),
          integer: helpers.withMessage(
            "To pole może zawierać jedynie cyfry.",
            integer
          ),
        },
      },
    };
  },
  methods: {
    turnOnEditMode(prod) {
      this.editMode = true;
      this.editedProduct = prod;

      this.editedProductNewData.name = prod.name;
      this.editedProductNewData.description = prod.description;
      this.editedProductNewData.quantity = prod.quantity;
      this.editedProductNewData.categoryName = prod.categoryName;
      this.editedProductNewData.imageFile = prod.imageFile;

      prod.images[0] ? (this.hasImage = true) : (this.hasImage = false);
    },
    clearNewProductData() {
      this.editedProductNewData = {
        name: "",
        description: "",
        quantity: 0,
        categoryName: "",
        imageFile: null,
      };
    },
    clearStatus() {
      this.productNameTaken = false;
    },
    cancelEdit() {
      this.editMode = false;
      this.editedProduct = null;
      this.clearNewProductData();
    },
    async confirmEdit() {
      const url = `${this.apiURL}api/Products/${this.editedProduct.productId}`;
      const token = this.$store.getters.getToken;

      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;

      this.clearStatus();

      if (this.changingImage) {
        if (this.editedProductNewData.imageFile == null) {
          await this.deletePhoto();
        } else {
          await this.editPhoto();
        }
      }

      this.editedProductNewData.imageFile = null;

      this.axios
        .put(url, this.editedProductNewData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.$emit("edit:product", response.data);
          this.editMode = false;
          this.editedProduct = null;
          this.clearNewProductData();
        })
        .catch((error) => {
          if (
            this.$func_global.getErrorCode(error.response.data.message) ===
            "100"
          )
            this.productNameTaken = true;
        });
    },
    deleteProduct() {
      const url = `${this.apiURL}api/Products/${this.deletedProduct.productId}`;
      const token = this.$store.getters.getToken;

      this.axios
        .delete(url, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          this.$emit("delete:product", this.deletedProduct.productId);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changePhoto(e) {
      this.changingImage = true;
      const file = e.target.files[0];
      if (e.target.id === "newImageFileInput" && file) {
        this.editedProductNewData.imageFile = file;
      }
    },
    deletePhotoInTable() {
      this.changingImage = true;
      this.hasImage = false;
    },
    editPhoto() {
      const url = `${this.apiURL}api/Products/${this.editedProduct.productId}/image`;
      const token = this.$store.getters.getToken;

      let formData = new FormData();
      formData.append("ImageFile", this.editedProductNewData.imageFile);

      return this.axios
        .put(url, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          this.changingImage = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deletePhoto() {
      const url = `${this.apiURL}api/Products/${this.editedProduct.productId}/image`;
      const token = this.$store.getters.getToken;

      return this.axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
  },
};
</script>

<style scoped>
* {
  color: var(--BLACK);
}

.product-photo {
  height: 3rem;
  width: auto;
}

.delete-picture {
  top: -13px;
  right: -13px;
  height: 26px;
  width: 26px;
  background-color: white;
  opacity: 95%;
  border: 1px solid var(--SECONDARY);
  border-radius: 50%;
}

.delete-picture:hover,
.delete-picture:focus {
  background-color: var(--SECONDARY);
}

.delete-icon {
  color: var(--SECONDARY);
}

.delete-picture:hover .delete-icon,
.delete-picture:focus .delete-icon {
  color: white;
}

.img-container {
  width: fit-content;
}

@media (min-width: 992px) {
  td.w-10 {
    min-width: 7vw;
  }
  td.w-30 {
    min-width: 30vw;
  }
}

@media (min-width: 1200px) {
  .table-responsive {
    overflow-x: hidden;
  }
}
</style>
