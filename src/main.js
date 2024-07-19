import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import '@/plugins/iview.js';
import '@/assets/base.less';

import axios from 'axios'
Vue.prototype.$http = axios.create({
  baseURL: '/api'
});


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
