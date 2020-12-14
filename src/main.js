import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import router from './router'
import axios from 'axios';
import g from './global.js'
import elementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import cookie from 'vue-cookies';
import loadingComponent from './global.js'
import store from './store'
// 引入图片懒加载
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  preLoad: 1,
  loading: require('./img/loading.gif'),
  attempt: 1
})
Vue.use(VueRouter);
Vue.use(elementUI);
Vue.use(loadingComponent)
Vue.prototype.axios = axios;
axios.defaults.withCredentials = true;
Vue.prototype.$cookie = cookie; //设置cookie
Vue.prototype.g = g;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')