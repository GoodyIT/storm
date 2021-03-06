import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import publicdata from './public'
import site from './site'

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
    barImage: 'https://demos.creative-tim.com/material-dashboard-pro/assets/img/sidebar-1.jpg',
    drawer: null,
    siteId: localStorage.getItem('site_id') || ''
  },
  mutations: {
    SET_BAR_IMAGE (state, payload) {
      state.barImage = payload
    },
    SET_DRAWER (state, payload) {
      state.drawer = payload
    },
    SET_SCRIM (state, payload) {
      state.barColor = payload
    },
  },
  actions: {

  },
  modules: { 
    site
  },
})
