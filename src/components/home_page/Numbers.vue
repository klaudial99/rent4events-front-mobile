<template>
  <div class="container">
    <div class="row gy-5">
      <div class="col-6 col-md-3">
        <h3>
          +<number
            ref="number1"
            :from="1"
            :to="40"
            :format="theFormat"
            :duration="2"
            easing="Power1.easeOut"
          />
        </h3>
        <span>ekspertów</span>
      </div>
      <div class="col-6 col-md-3">
        <h3>
          +<number
            ref="number2"
            :from="1"
            :to="500"
            :format="theFormat"
            :duration="2"
            easing="Power2.easeOut"
          />
        </h3>
        <span>zadowlonych klientów</span>
      </div>

      <div class="col-6 col-md-3">
        <h3>
          <number
            ref="number3"
            :from="1"
            :to="10"
            :format="theFormat"
            :duration="2"
            easing="Power1.easeOut"
          />
        </h3>
        <span>lat na rynku</span>
      </div>
      <div class="col-6 col-md-3">
        <h3>
          +<number
            ref="number4"
            :from="1"
            :to="3000"
            :format="theFormat"
            :duration="2"
            easing="Power2.easeOut"
          />
        </h3>
        <span>artykułów</span>
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

<style scoped></style>
