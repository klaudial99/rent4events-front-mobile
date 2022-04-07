<template>
  <div class="home">
    <section id="main" class="py-5">
      <main-info />
    </section>
    <section id="numbers" class="py-5">
      <numbers />
    </section>
    <section id="steps" class="py-5">
      <div class="container mb-3 mb-md-5">
        <div class="row">
          <div class="col">
            <h2>Od wymarzonej imprezy dzielą Cię tylko 3 prost kroki!</h2>
          </div>
        </div>
      </div>
      <div
        v-for="step in steps"
        :key="step.stepId"
        class="steps position-relative"
      >
        <step :step-source="step" class="py-3" />
      </div>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
import MainInfo from "@/components/home_page/MainInfo";
import Numbers from "@/components/home_page/Numbers";
import Step from "@/components/home_page/Step";
export default {
  name: "Home",
  components: {
    MainInfo,
    Numbers,
    Step,
  },
  data() {
    return {
      steps: [
        {
          stepId: 1,
          title: "Wybierz asortyment",
          text: "Posiadamy szeroki asortyment, na pewno znajdziesz coś, co Cię zainteresuje.",
          pictureSource: "step-1.svg",
        },
        {
          stepId: 2,
          title: "Złóż zapytanie",
          text: "Powiedz gdzie i kiedy chcesz zrealizować swoje zamówienie i wyślij zapytanie.",
          pictureSource: "step-2.svg",
        },
        {
          stepId: 3,
          title: "Czekaj na odpowiedź",
          text: "Nasz zespoł stara się odpowiadać jak najszybciej na zamówienia naszych Klientów, niedługo się odezwiemy!",
          pictureSource: "step-3.svg",
        },
      ],
    };
  },
};
</script>

<style scoped>
#numbers {
  background-color: var(--PRIMARY);
  color: white;
}

@media (min-width: 768px) {
  .steps::after {
    content: "";
    position: absolute;
    border: 1px dashed var(--PRIMARY-LIGHT);
    height: 100%;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
  }
}
</style>
