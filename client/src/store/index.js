import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import cards from "./modules/cards";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    cards
  },
  strict: true,
  plugins: [createPersistedState()],
  state: {
    lastActive: null,
    token: null,
    host: null,
    user: null,
    isUserLoggedIn: null,
    method: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setHost(state, host) {
      state.host = host;
    }
  },
  actions: {
    setUser({ commit }, user) {
      commit("setUser", user);
    },
    setHost({ commit }, host) {
      commit("setHost", host);
    }
  }
});
