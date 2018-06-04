import Vue from 'vue'
import Router from 'vue-router'
import Schedules from '@/components/Schedules'
import AddEmployee from '@/components/AddEmployee'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Schedules',
      component: Schedules
    },
    {
      path: '/add-employee',
      name: 'AddEmployee',
      component: AddEmployee
    }
  ]
})
