<template>
  <div class="home">
    <section id="main" class="py-5">
      <main-info />
    </section>
    <section id="numbers" class="py-5">
      <numbers />
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
import MainInfo from "@/components/HomePage/MainInfo";
import Numbers from "@/components/HomePage/Numbers";
export default {
  name: "Home",
  components: {
    MainInfo,
    Numbers,
  },
};
</script>

<style scoped>
#numbers {
  background-color: var(--PRIMARY);
  color: white;
}
</style>
