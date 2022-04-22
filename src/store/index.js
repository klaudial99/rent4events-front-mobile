import { createStore } from "vuex";

export default createStore({
  state: {
    activeTab: "",
  },
  mutations: {
    setActiveTab(state, value) {
      state.activeTab = value;
    },
  },
  getters: {
    getActiveTab(state) {
      return state.activeTab;
    },
  },
  actions: {},
  modules: {},
});
