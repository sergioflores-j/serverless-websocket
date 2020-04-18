import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.prototype.$HTTP_HOST = 'http://localhost:3000';
Vue.prototype.$WS_HOST = 'ws://localhost:3001';

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
