import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import router from './router'
import axios from 'axios';
import g from './global.js'
import { Switch, Slider, Icon, Drawer, Carousel, TabPane, Tabs, CarouselItem } from 'element-ui';
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
//按需引入elementui组件-------------------------
Vue.component(Switch.name, Switch)
Vue.component(Slider.name, Slider)
Vue.component(Icon.name, Icon)
Vue.component(Drawer.name, Drawer)
Vue.component(Carousel.name, Carousel)
Vue.component(TabPane.name, TabPane)
Vue.component(Tabs.name, Tabs);
Vue.component(CarouselItem.name, CarouselItem)
//--------------------------------------------
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