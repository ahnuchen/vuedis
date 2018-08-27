import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'main-page',
            component :()=> import ('../components/MainPage.vue')
        },
        {
            path: '/index',
            name: 'landing-page',
            component:()=>import('../components/LandingPage.vue')
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})
