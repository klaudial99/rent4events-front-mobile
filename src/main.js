import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { faPhone } from "@fortawesome/free-solid-svg-icons";
library.add(faPhone);

const app = createApp(App).use(router);

app.config.globalProperties.apiURL = "http://localhost:8090/";

app.use(store);
app.use(VueAxios, axios);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
