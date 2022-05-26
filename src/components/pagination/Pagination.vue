<template>
  <div class="d-flex">
    <span class="fs-smaller align-self-center me-3 text-disabled text-nowrap">
      {{ navigationSource.totalCount }}
      {{ this.$func_global.mapResultForm(navigationSource.totalCount) }}
    </span>
    <button
      class="btn btn-no-style btn-filters pages-navigation"
      :class="{ disabled: navigationSource.isFirst }"
      @click="goToPage(this.navigationSource.page - 1)"
    >
      <font-awesome-icon :icon="['fa', 'chevron-left']" size="xs" />
    </button>
    <div class="d-flex">
      <span class="fs-smaller align-self-center text-nowrap"
        >{{ navigationSource.page }} z {{ navigationSource.totalPages }}</span
      >
    </div>
    <button
      class="btn btn-no-style btn-filters pages-navigation"
      :class="{ disabled: navigationSource.isLast }"
      @click="goToPage(this.navigationSource.page + 1)"
    >
      <font-awesome-icon :icon="['fa', 'chevron-right']" size="xs" />
    </button>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    navigationSource: Object,
  },
  methods: {
    goToPage(page) {
      this.$emit("switch:page", page);
    },
  },
};
</script>

<style scoped>
.pages-navigation.disabled {
  color: var(--BLACK-LIGHTER);
}

.pages-navigation.disabled:hover {
  background: none;
}
</style>
