import Vue from 'vue'
import axios from 'axios'

import App from './App'
import store from './store'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import './assets/font/sourcepro.woff2'

Vue.use(iView);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
    el: '#app',
    store,
    render: h => h(App)
});