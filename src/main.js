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

import { faArrowUp } from "@fortawesome/free-solid-svg-icons/faArrowUp";
library.add(faArrowUp);

const app = createApp(App).use(router);

app.config.globalProperties.apiURL = "http://localhost:8090/";

app.use(store);
app.use(VueAxios, axios);
app.use(VueNumber);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
