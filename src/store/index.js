import Vue from 'vue'
import Vuex from 'vuex'
//
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dealerName: '',
    router: {
      page: 'Form',
    },

    user: {
      id: 0,
      username: 'SYSTEM'
    },

    data: {
      services: [],
      servicesMapped: {},

      users: [],
    },

    invoiceCount: 0,
    invoice:{
      data: {},
      services: [],
      comment: '',
    },

    setting: {
      gstRate: 0.05,
      qstRate: 0.09975,
      autoFillMake: false,
      billCompany: '',
      billAddress1: '',
      billAddress2: '',

      gmailUser: '',
      gmailPass: '',
      mailSendTo: '',
      mailCC: '',
    },

    layout:{
      pageViewHeight: 0,
    },

    dataMonitor:{
      progress: 0,
      notifOpen: false,
      notifSuccess: false,
      notifText: 'Correcting data...',
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
