<template>
  <div class="container">
    <div class="row gy-3">
      <div class="col-12 col-sm-6 col-md-3 text-sm-start">
        <h5 class="mb-2 mb-sm-4 fw-bolder">Firma</h5>
        <ul>
          <li><a href="javascript:">O nas</a></li>
          <li><a href="javascript:">Praca</a></li>
          <li><a href="javascript:">Reklama</a></li>
          <li><a href="javascript:">Współpraca</a></li>
        </ul>
      </div>
      <div class="col-12 col-sm-6 col-md-3 text-sm-start">
        <h5 class="mb-2 mb-sm-4 fw-bolder">Informacje</h5>
        <ul>
          <li><a href="javascript:">Aktualności</a></li>
          <li><a href="javascript:">Strefa klienta</a></li>
          <li><a href="javascript:">Zasady dostawy</a></li>
          <li><a href="javascript:">Dla firm</a></li>
        </ul>
      </div>
      <div class="col-12 col-sm-6 col-md-3 text-sm-start">
        <h5 class="mb-2 mb-sm-4 fw-bolder">Pomoc</h5>
        <ul>
          <li><a href="javascript:">Obsługa Klienta</a></li>
          <li><a href="javascript:">Reklamacje</a></li>
          <li><a href="javascript:">Regulamin</a></li>
        </ul>
      </div>
      <div class="col-12 col-sm-6 col-md-3 text-sm-start">
        <h5 class="mb-2 mb-sm-4 fw-bolder">Kontakt</h5>
        <ul>
          <li><span>ul. Kościerzyńska 9, Wrocław</span></li>
          <li><span>kontakt@rent4events.com</span></li>
          <li><span>+48 234 567 88</span></li>
        </ul>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <a href="javascript:" class="mx-4">
          <font-awesome-icon
            :icon="['fa-brands', 'facebook']"
            class="social-icon"
            size="lg"
          />
        </a>
        <a href="javascript:" class="mx-4">
          <font-awesome-icon
            :icon="['fa-brands', 'instagram']"
            class="social-icon"
            size="lg"
          />
        </a>
        <a href="javascript:" class="mx-4">
          <font-awesome-icon
            :icon="['fa-brands', 'tiktok']"
            class="social-icon"
            size="lg"
          />
        </a>
        <a href="javascript:" class="mx-4">
          <font-awesome-icon
            :icon="['fa-brands', 'youtube']"
            class="social-icon"
            size="lg"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SiteFooter",
};
</script>

<style scoped>
* {
  color: white;
}

ul {
  padding-left: 0;
  list-style: none;
}

li {
  padding-bottom: 0.5rem;
}

li a {
  text-decoration: none;
}

li a:hover,
.social-icon:hover {
  color: var(--PRIMARY-LIGHTER);
}
</style>
