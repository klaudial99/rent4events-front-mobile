<template>
  <div
    class="container"
    v-if="todayCourses && todayCourses.length > 0 && !courseOnTheWay"
  >
    <div class="row mt-4">
      <div class="col text-start ms-0 ms-lg-4">
        <h3>Dzisiejsze kursy</h3>
      </div>
    </div>
    <div class="row mt-3">
      <courses-table
        :courses-source="todayCourses"
        :is-actual-course="true"
        @start:course="handleStartCourse"
      />
    </div>
  </div>

  <div
    class="container"
    v-else-if="todayCourses && todayCourses.length > 0 && courseOnTheWay"
  >
    <div class="row mt-4">
      <div class="col text-start">
        <h3>Aktualny kurs</h3>
      </div>
      <div class="col text-end">
        <button
          class="btn btn-main"
          data-bs-toggle="modal"
          data-bs-target="#finishCourseModal"
        >
          Zakończ kurs
        </button>
      </div>
    </div>
    <div class="row mt-1 gy-3">
      <div class="col-12 col-lg-7">
        <div class="row gy-3">
          <div class="col-12 col-md-6 text-start">
            <span class="fw-bolder">Data: </span>
            <span>{{ this.$func_global.formatDate(courseOnTheWay.date) }}</span>
          </div>
          <div class="col-12 col-md-6 text-start">
            <span class="fw-bolder">Typ: </span>
            <span>{{
              this.$func_global.mapCourseTypeName(courseOnTheWay.type)
            }}</span>
          </div>
          <div class="col-12 col-md-6 text-start">
            <span class="fw-bolder">Z: </span>
            <span v-if="courseOnTheWay.type === 'DELIVERY'"
              >ul. Kościerzyńska 9 Wrocław</span
            >
            <span v-else>{{ courseOnTheWay.order.address }}</span>
          </div>
          <div class="col-12 col-md-6 text-start">
            <span class="fw-bolder">Do: </span>
            <span v-if="courseOnTheWay.type === 'PICKUP'"
              >ul. Kościerzyńska 9 Wrocław</span
            >
            <span v-else>{{ courseOnTheWay.order.address }}</span>
          </div>
          <div class="col-12 col-md-6 text-start">
            <span class="fw-bolder">Klient: </span>
            <span>
              {{ courseOnTheWay.client.firstName }}
              {{ courseOnTheWay.client.lastName }}
            </span>
          </div>
          <div class="col-12 col-md-6 text-start">
            <span class="fw-bolder">Telefon: </span>
            <span>
              {{
                courseOnTheWay.client.phoneNumber
                  ? courseOnTheWay.client.phoneNumber
                  : "-"
              }}
            </span>
          </div>
          <div class="col-12 col-md-6 text-start">
            <span class="fw-bolder">Pojazd: </span>
            <span>
              {{ courseOnTheWay.vehicle.brand }}
              {{ courseOnTheWay.vehicle.model }}
              {{ courseOnTheWay.vehicle.licensePlate }}
            </span>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-5 map">
        <iframe
          :src="mapAddress"
          width="100%"
          height="100%"
          style="border: 0"
          allowfullscreen
        ></iframe>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col text-start">
        <h3>Szczegóły zamówienia</h3>
      </div>
    </div>

    <order-details :order-source="courseOnTheWay.order" class="mt-3 gy-2" />

    <div v-if="orderPositions">
      <div class="d-flex flex-row-reverse">
        <pagination
          :navigation-source="navigation"
          @switch:page="handleGoToPage"
        />
      </div>
    </div>

    <div v-if="orderPositions">
      <order-positions-table
        :order-position-source="orderPositions"
        :order-source="courseOnTheWay"
      />
    </div>

    <div class="mb-3" v-if="orderPositions && orderPositions.length >= 10">
      <div class="d-flex flex-row-reverse">
        <pagination
          :navigation-source="navigation"
          @switch:page="handleGoToPage"
        />
      </div>
    </div>
  </div>

  <div v-else>
    <div class="my-5">
      <h5>Brak kursów zaplanowanych na dzisiaj.</h5>
    </div>
  </div>

  <div class="modal fade" tabindex="-1" id="finishCourseModal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body" v-if="courseOnTheWay">
          <button
            id="finishCourseModalClose"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
          <div class="container mt-4">
            <div class="row">
              <div class="col">
                <p>Czy na pewno chcesz zakończyć ten kurs?</p>
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
                  @click="finishCourse"
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
</template>

<script>
import CoursesTable from "@/components/courses/CoursesTable";
import Pagination from "@/components/pagination/Pagination";
import OrderPositionsTable from "@/components/orders/OrderPositionsTable";
import OrderDetails from "@/components/orders/OrderDetails";
export default {
  name: "CurrentCourse",
  components: {
    CoursesTable,
    OrderDetails,
    Pagination,
    OrderPositionsTable,
  },
  data() {
    return {
      todayCourses: [],
      orderPositions: [],
      userParams: {
        goToPage: 1,
        itemsPerPage: 20,
      },
      navigation: {
        totalCount: 0,
        page: 1,
        itemsPerPage: 20,
        isFirst: false,
        isLast: false,
        isEmpty: false,
        totalPages: 1,
      },
    };
  },
  methods: {
    getTodayCourses() {
      const url = `${this.apiURL}api/Courses`;
      const token = this.$store.getters.getToken;
      const requestParams = {
        Page: 1,
        PageSize: 100,
        Filter: `onlyDate=${this.$func_global.formatDateRequest(new Date())}`,
      };

      this.axios
        .get(url, {
          params: requestParams,
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.todayCourses = response.data.results;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getOrderPositions(firstPage) {
      let url = `${this.apiURL}api/Orders/${this.courseOnTheWay.orderId}/order-positions`;
      const token = this.$store.getters.getToken;

      const requestParams = {
        Page: firstPage ? 1 : this.userParams.goToPage,
        PageSize: this.userParams.itemsPerPage,
      };

      this.axios
        .get(url, {
          params: requestParams,
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.orderPositions = response.data.results;
          this.navigation.totalCount = response.data.totalCount;
          this.navigation.page = response.data.page;
          this.navigation.itemsPerPage = response.data.itemsPerPage;

          this.navigation.isFirst = response.data.isFirst;
          this.navigation.isLast = response.data.isLast;
          this.navigation.isEmpty = response.data.isEmpty;
          this.navigation.totalPages = response.data.totalPages;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    finishCourse() {
      const url = `${this.apiURL}api/Courses/${this.courseOnTheWay.courseId}`;
      const token = this.$store.getters.getToken;
      const data = {
        status: "DONE",
      };

      this.axios
        .put(url, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const index = this.todayCourses.findIndex(
            (c) => c.courseId === response.data.courseId
          );
          this.todayCourses[index] = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    waitForCourse() {
      if (typeof this.courseOnTheWay !== "undefined") {
        this.getOrderPositions(true);
      } else {
        setTimeout(this.waitForCourse, 200);
      }
    },
    handleGoToPage(number) {
      this.userParams.goToPage = number;
      this.getOrderPositions(false);
    },
    handleStartCourse(course) {
      const index = this.todayCourses.findIndex(
        (c) => c.courseId === course.courseId
      );
      this.todayCourses[index] = course;
    },
  },
  mounted() {
    this.getTodayCourses();
    this.waitForCourse();
  },
  computed: {
    courseOnTheWay() {
      return this.todayCourses.filter(
        (course) => course.status === "ON_THE_WAY"
      )[0];
    },
    mapAddress() {
      if (this.courseOnTheWay) {
        const address = this.courseOnTheWay.order.address.replace(" ", "+");
        return `https://maps.google.com/maps?q=${address}&output=embed`;
      }
      return "";
    },
  },
};
</script>

<style scoped>
.map {
  min-height: 35vh;
}
</style>
