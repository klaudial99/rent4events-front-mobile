import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";
import VueNumber from "vue-number-animation";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import {
  faArrowUp,
  faTruck,
  faPeopleGroup,
  faBoxesPacking,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
library.add(faArrowUp);
library.add(faTruck);
library.add(faPeopleGroup);
library.add(faBoxesPacking);
library.add(faArrowRight);

import {
  faFacebook,
  faInstagram,
  faTiktok,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
library.add(faFacebook);
library.add(faInstagram);
library.add(faTiktok);
library.add(faYoutube);

const app = createApp(App).use(router);

app.config.globalProperties.apiURL = process.env.VUE_APP_BASE_URI;

app.use(store);
app.use(VueAxios, axios);
app.use(VueNumber);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
