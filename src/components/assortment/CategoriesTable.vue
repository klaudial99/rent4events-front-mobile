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
          <tr v-for="cat in categoriesSource" :key="cat.id">
            <td v-if="editMode && editedCategory === cat">
              <input
                @blur="v$.editedCategoryNewName.$touch"
                type="text"
                class="form-control"
                id="newCategoryNameInput"
                v-model="editedCategoryNewName"
                :class="{ 'error-input': v$.editedCategoryNewName.$error }"
              />
            </td>
            <td v-else>{{ cat.category_name }}</td>

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
                      {{ deletedCategory.category_name }} </span
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
      this.editedCategoryNewName = cat.category_name;
    },
    cancelEdit() {
      this.editMode = false;
      this.editedCategory = null;
      this.editedCategoryNewName = "";
    },
    async confirmEdit(cat) {
      const category = {
        category_name: this.editedCategoryNewName,
        group_id: cat.group_id,
      };

      const url = `${this.apiURL}api/Categories/${this.editedCategory.id}`;
      const token = this.$store.getters.getToken;

      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;

      this.axios
        .put(url, category, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          this.$emit("edit:category", response.data);
          this.editMode = false;
          this.editedCategory = null;
          this.editedCategoryNewName = "";
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async deleteCategory() {
      const url = `${this.apiURL}api/Categories/${this.deletedCategory.id}`;
      const token = this.$store.getters.getToken;

      this.axios
        .delete(url, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          console.log(response.data);
          this.$emit("delete:category", this.deletedCategory.id);
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

.table-btn:hover,
.table-btn:active,
.table-btn:focus {
  box-shadow: none;
}

.table-icon:hover,
.table-icon:active {
  color: var(--PRIMARY);
}

.table > :not(:first-child) {
  border-top: 1.5px solid currentColor;
}

.modal-decision-button {
  width: 70%;
}
</style>
