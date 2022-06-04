import { createStore } from "vuex";

export default createStore({
  state: {
    activeTab: "",
    email: "",
    firstName: "",
    lastName: "",
    token: "",
    refreshToken: "",
    role: "",
    showAfterRegisterModal: false,
    vehicleTypeOptions: ["BUS", "TRUCK"],
    vehicleStatusOptions: ["WORKING", "AT_WORKSHOP", "NOT_WORKING"],
  },
  mutations: {
    setActiveTab(state, value) {
      state.activeTab = value;
    },
    setEmail(state, value) {
      state.email = value;
    },
    setFirstName(state, value) {
      state.firstName = value;
    },
    setLastName(state, value) {
      state.lastName = value;
    },
    setToken(state, value) {
      state.token = value;
    },
    setRefreshToken(state, value) {
      state.refreshToken = value;
    },
    setRole(state, value) {
      state.role = value;
    },
    setShowAfterRegisterModal(state, value) {
      state.showAfterRegisterModal = value;
    },
  },
  getters: {
    getActiveTab(state) {
      return state.activeTab;
    },
    getEmail(state) {
      return state.email;
    },
    getFirstName(state) {
      return state.firstName;
    },
    getLastName(state) {
      return state.lastName;
    },
    getToken(state) {
      return state.token;
    },
    getRefreshToken(state) {
      return state.refreshToken;
    },
    getRole(state) {
      return state.role;
    },
    getShowAfterRegisterModal(state) {
      return state.showAfterRegisterModal;
    },
    getVehicleTypeOptions(state) {
      return state.vehicleTypeOptions;
    },
    getVehicleStatusOptions(state) {
      return state.vehicleStatusOptions;
    },
  },
  actions: {},
  modules: {},
});
