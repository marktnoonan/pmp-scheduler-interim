import * as types from './mutation-types'

export const mutations = {
  [types.SAY_HELLO](state, user_payload) {
    state.hello = 'hello instead of hi'
  },
  [types.SET_SCHEDULE_TYPE](state, user_payload) {
    state.scheduleType = user_payload
    if (user_payload === 'changes') {
      state.locationsDataSource = 'newLocations'
    } else if (user_payload === 'everything') {
      state.locationsDataSource = 'snapshots'
      console.log('updated data source to snapshots')
    }
  },
  [types.UPDATE_NEW_LOCATIONS](state, user_payload) {
    console.log(user_payload)
    const newLocationsState =
      state.testInstructions[user_payload.date].newLocations[user_payload.time]
    const prevNewLocationsState = JSON.parse(JSON.stringify(newLocationsState))
    for (let location in user_payload.newLocations) {
      for (let category in user_payload.newLocations[location]) {
        user_payload.newLocations[location][category].forEach(
          personOrVehicle => {
            for (let prevNewLocation in prevNewLocationsState) {
              for (let prevNewLocationCategory in prevNewLocationsState[
                prevNewLocation
              ]) {
                const arrayOfPeopleOrVehicles =
                  newLocationsState[prevNewLocation][prevNewLocationCategory]
                if (arrayOfPeopleOrVehicles.includes(personOrVehicle)) {
                  arrayOfPeopleOrVehicles.splice(
                    arrayOfPeopleOrVehicles.indexOf(personOrVehicle),
                    1
                  )
                  if (!prevNewLocationsState[location]) {
                    newLocationsState[location] = {
                      individuals: [],
                      employees: [],
                      vehicles: []
                    }
                  }

                  newLocationsState[location][category].push(personOrVehicle)
                  console.log(personOrVehicle)
                }
              }
            }
          }
        )
        console.log('category from store', location, category)
      }
    }

    console.log(prevNewLocationsState, newLocationsState)
  },
  [types.REPLACE_SNAPSHOT](state, user_payload) {
    console.log('replacing snapshot', user_payload)
    state.testInstructions['2018-04-23'].snapshots[user_payload.time] =
      user_payload.snapshotsForThisTime
  }
}
