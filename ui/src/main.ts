import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '@/App.vue'
import UserScreen from '@/views/UserScreen.vue'
import OperatorScreen from '@/views/OperatorScreen.vue'
import StatusScreen from '@/views/StatusScreen.vue'

import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue"

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueRouter)

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/user",
      component: UserScreen,
    },
    // {
    //   path: "/",
    //   component: StatusScreen,
    // }
  ],
})

Vue.config.productionTip = false
Vue.config.devtools = true

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  render: h => h(App),
})
