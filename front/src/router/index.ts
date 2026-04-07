import { createRouter, createWebHistory } from 'vue-router'

import index from "../pages/index.vue"
import Inventory from '@/pages/inventory.vue'
import Sales from '@/pages/sales.vue'
import Forecast from '@/pages/forecast.vue'
import Login from '@/pages/login.vue'
import Shift from '@/pages/shift.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: index},
    { path: '/inventory', component: Inventory},
    { path: '/sales', component: Sales},
    { path: '/forecast', component: Forecast},
    { path: '/login', component: Login},
    { path: '/shift', component: Shift},
  ],
})

export default router
