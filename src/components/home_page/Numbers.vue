<template>
  <div class="container">
    <div class="row gy-5">
      <div class="col-6 col-md-3">
        <h1 class="number">
          +<number
            ref="number1"
            :from="1"
            :to="40"
            :format="theFormat"
            :duration="2"
            easing="Power1.easeOut"
          />
        </h1>
        <h6>ekspertów</h6>
      </div>
      <div class="col-6 col-md-3">
        <h1 class="number">
          +<number
            ref="number2"
            :from="1"
            :to="500"
            :format="theFormat"
            :duration="2"
            easing="Power2.easeOut"
          />
        </h1>
        <h6>zadowolonych klientów</h6>
      </div>

      <div class="col-6 col-md-3">
        <h1 class="number">
          <number
            ref="number3"
            :from="1"
            :to="10"
            :format="theFormat"
            :duration="2"
            easing="Power1.easeOut"
          />
        </h1>
        <h6>lat na rynku</h6>
      </div>
      <div class="col-6 col-md-3">
        <h1 class="number">
          +<number
            ref="number4"
            :from="1"
            :to="3000"
            :format="theFormat"
            :duration="2"
            easing="Power2.easeOut"
          />
        </h1>
        <h6>artykułów</h6>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Numbers",
  methods: {
    theFormat(number) {
      return Math.round(number);
    },
  },
};
</script>

<style scoped>
.number {
  font-weight: 500;
}
</style>
