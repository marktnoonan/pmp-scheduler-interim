import Vue from 'vue'
import Vuex from 'vuex'
import {mutations} from './mutations'
import * as actions from './actions'
import testInstructions from '../data/instructions'

Vue.use(Vuex)

const state = {
  hello: 'hi!',
  scheduleType: 'changes',
  testInstructions,
  locationsDataSource: 'newLocations'
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
