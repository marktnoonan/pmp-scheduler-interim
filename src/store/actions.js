import * as types from './mutation-types'

export const sayHello = ({commit}, user_payload) => {
  commit(types.SAY_HELLO, user_payload)
}

export const setScheduleType = ({commit}, user_payload) => {
  commit(types.SET_SCHEDULE_TYPE, user_payload)
}

export const updateNewLocations = ({commit}, user_payload) => {
  commit(types.UPDATE_NEW_LOCATIONS, user_payload)
}

export const replaceSnapshot = ({commit}, user_payload) => {
  commit(types.REPLACE_SNAPSHOT, user_payload)
}
