<template>
  <div class="container">
    <div class="row position-relative">
      <div
        class="col-12 col-md-6 my-auto step-text"
        :class="{ 'order-md-1': stepSource.stepId % 2 === 1 }"
      >
        <h4 class="py-3">{{ stepSource.title }}</h4>
        <p>{{ stepSource.text }}</p>
      </div>
      <div class="col-12 col-md-6">
        <img
          :src="this.getImgSrc(this.stepSource.pictureSource)"
          :alt="this.stepSource.pictureSource"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Step",
  props: {
    stepSource: Object,
  },
  methods: {
    getImgSrc(img) {
      return require("@/assets/home_page/" + img);
    },
  },
};
</script>

<style scoped>
img {
  width: 70%;
  max-height: 220px;
}

@media (min-width: 768px) {
  .step-text::after {
    content: "";
    position: absolute;
    height: 1.5rem;
    width: 1.5rem;
    background: var(--PRIMARY);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
    z-index: 100;
  }
}
</style>
