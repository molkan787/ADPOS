import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify';
import DatetimePicker from 'vuetify-datetime-picker'
import './style/main.scss';

import config from './config';
import Struct from './struct';
import Logic from './logic';
import Tests from './tests';

Vue.config.productionTip = false

Struct.init(Vue, store);
Logic.init(Vue, store);
Tests.init(Logic, store);

Vue.use(DatetimePicker);

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
