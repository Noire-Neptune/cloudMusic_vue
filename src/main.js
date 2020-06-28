import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import router from './router'
import axios from 'axios';
import g from './global.js'
import elementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(VueRouter);
Vue.use(elementUI)
Vue.prototype.axios=axios;
axios.defaults.withCredentials=true;

Vue.prototype.g=g;
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
