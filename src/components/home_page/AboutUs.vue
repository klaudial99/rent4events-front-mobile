<template>
  <div class="container">
    <div class="row mb-5">
      <div class="col">
        <h2>Dlaczego my?</h2>
      </div>
    </div>
    <div class="row justify-content-center gy-5">
      <div class="col-12 col-sm-8 col-md-4 col-xl-3">
        <font-awesome-icon
          :icon="['fa', 'people-group']"
          size="2x"
          class="about-us-icon"
        />
        <h5>Wykwalifikowani pracownicy</h5>
        <span>
          Tworzymy doświadoczony zespół, który z chęcią doradzi i odpowie na
          wszystkie Twoje pytania.
        </span>
      </div>
      <div class="col-12 col-sm-8 col-md-4 col-xl-3">
        <font-awesome-icon
          :icon="['fa', 'boxes-packing']"
          size="2x"
          class="about-us-icon"
        />
        <h5>Wysokiej jakości sprzęt</h5>
        <span>
          Zależy nam na jakości oferowanego asortymentu. Dodatkowo nieustannie
          dbamy aby jak najdłużej pozostał w jak najlepszym stanie.
        </span>
      </div>
      <div class="col-12 col-sm-8 col-md-4 col-xl-3">
        <font-awesome-icon
          :icon="['fa', 'truck']"
          size="2x"
          class="about-us-icon"
        />
        <h5>Profejsonalny transport</h5>
        <span>
          Dokładamy wszelkich starań aby nasza flota pojazdów była zawsze w
          idealnym stanie.
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutUs",
};
</script>

<style scoped>
.about-us-icon {
  color: var(--PRIMARY);
}
</style>
