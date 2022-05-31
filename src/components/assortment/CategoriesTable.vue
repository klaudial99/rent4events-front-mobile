<template>
  <div>
    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">Nazwa</th>
            <th scope="col">Liczba produktów</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categoriesSource" :key="cat.categoryId">
            <td v-if="editMode && editedCategory === cat">
              <input
                @blur="v$.editedCategoryNewName.$touch"
                type="text"
                class="form-control"
                id="newCategoryNameInput"
                v-model="editedCategoryNewName"
                :class="{
                  'error-input':
                    v$.editedCategoryNewName.$error || categoryNameTaken,
                }"
                @focus="clearStatus"
                @keypress="clearStatus"
              />
            </td>
            <td v-else>{{ cat.categoryName }}</td>

            <td>{{ cat.count }}</td>

            <td v-if="editMode && editedCategory === cat" class="text-start">
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
                  @click="confirmEdit(cat)"
                />
              </button>
            </td>
            <td v-else class="text-start">
              <button class="btn table-btn">
                <font-awesome-icon
                  :icon="['fa', 'pen']"
                  size="sm"
                  class="table-icon"
                  @click="turnOnEditMode(cat)"
                />
              </button>
              <button class="btn table-btn" v-if="cat.count === 0">
                <font-awesome-icon
                  :icon="['fa', 'trash']"
                  size="sm"
                  class="table-icon"
                  data-bs-toggle="modal"
                  data-bs-target="#categoryDeleteModal"
                  @click="deletedCategory = cat"
                />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal fade" tabindex="-1" id="categoryDeleteModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body" v-if="deletedCategory">
            <button
              id="categoryDeleteModalClose"
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
            <div class="container mt-4">
              <div class="row">
                <div class="col">
                  <p>
                    Czy na pewno chcesz usunąć kategorię
                    <span class="fst-italic">
                      {{ deletedCategory.categoryName }} </span
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
                    @click="deleteCategory"
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
import { helpers, required } from "@vuelidate/validators";

export default {
  name: "CategoriesTable",
  setup() {
    return { v$: useVuelidate() };
  },
  props: {
    categoriesSource: Array,
  },
  data() {
    return {
      editMode: false,
      editedCategory: null,
      editedCategoryNewName: "",
      deletedCategory: null,
      categoryNameTaken: false,
    };
  },
  validations() {
    return {
      editedCategoryNewName: {
        required: helpers.withMessage("To pole nie może być puste.", required),
      },
    };
  },
  methods: {
    turnOnEditMode(cat) {
      this.editMode = true;
      this.editedCategory = cat;
      this.editedCategoryNewName = cat.categoryName;
    },
    cancelEdit() {
      this.editMode = false;
      this.editedCategory = null;
      this.editedCategoryNewName = "";
    },
    clearStatus() {
      this.categoryNameTaken = false;
    },
    async confirmEdit(cat) {
      const category = {
        categoryName: this.editedCategoryNewName,
        groupId: cat.groupId,
      };

      const url = `${this.apiURL}api/Categories/${this.editedCategory.categoryId}`;
      const token = this.$store.getters.getToken;

      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;

      this.clearStatus();

      this.axios
        .put(url, category, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          this.$emit("edit:category", response.data);
          this.editMode = false;
          this.editedCategory = null;
          this.editedCategoryNewName = "";
        })
        .catch((error) => {
          if (
            this.$func_global.getErrorCode(error.response.data.message) ===
            "101"
          )
            this.categoryNameTaken = true;
        });
    },
    async deleteCategory() {
      const url = `${this.apiURL}api/Categories/${this.deletedCategory.categoryId}`;
      const token = this.$store.getters.getToken;

      this.axios
        .delete(url, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          this.$emit("delete:category", this.deletedCategory.categoryId);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
* {
  color: var(--BLACK);
}
</style>
