<template>
  <v-container fluid >
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>

        <v-menu
          ref="menu"
          lazy
          :close-on-content-click="false"
          v-model="menu"
          transition="scale-transition"
          offset-y
          full-width
          :nudge-right="40"
          min-width="290px"
          :return-value.sync="date"
        >
          <v-text-field
            slot="activator"
            label="Choose a start date"
            v-model="date"
            prepend-icon="event"
            readonly
          ></v-text-field>
        <v-date-picker 
          v-model="date" 
          :landscape="false" 
          :reactive="reactive" 
          no-title 
          scrollable
          first-day-of-week="1"
          :min="today"

        >
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
          </v-date-picker>
        </v-menu>
              <v-tabs
        v-model="active"
        color="purple lighten-6"
        dark
        slider-color="yellow"
        show-arrows
      >
        <v-tab
          v-for="day in scheduleDays"
          :key="day.date"
          ripple
        >
        Day {{ new Date(day.date).getDay() + 1 }} ({{formatDate(day.date).slice(0,-5)}})
        </v-tab>
        <v-tab>
          Add a day
        </v-tab>
        <v-tab-item
          v-for="day in scheduleDays"
          :key="day.date"
        >
          <v-card flat>
            <v-card-text>
            <!--  <v-flex xs4>
                Sort Schedule By:
          <v-select
          :items="orderByItems"
          v-model="orderBy"
          label="Select"
          single-line
        ></v-select>
              </v-flex>               -->
              
              <h2> Schedule for {{formatDate(day.date)}} </h2>
              <v-card width="900" v-if="timepoints['2018-04-23'][locationsDataSource]"
 flat class="my-2" v-for="(date, time) in timepoints['2018-04-23'][locationsDataSource]" :key="time">
                <Timepoint 
                  test="test" 
                  :time="time" 
                  :timepoint="timepoints"
                  @generateSnapshots="generateSnapshots"
                  ></Timepoint>
              </v-card>
              </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <h2> Add a Day </h2>
              {{ text }}
              </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>  
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import locations from '../data/locations.js'
import Timepoint from './Timepoint'

export default {
	components: {Timepoint},
	data() {
		return {
			locations,
			date: null,
			landscape: true,
			categories: ['employees', 'individuals', 'vehicle'],
			reactive: false,
			menu: false,
			active: null,
			orderBy: 'Time',
			orderByItems: ['Employee', 'Individual', 'Location', 'Time'],
			text:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
			scheduleDays: [
				{
					date: '2018-04-23'
				}
			]
		}
	},
	computed: {
		timepoints: function() {
			return this.$store.state.testInstructions
		},
		locationsDataSource: function() {
			return this.$store.state.locationsDataSource
		},
		today: function() {
			const today = new Date()
			return `${today.getFullYear()}-${
				today.getMonth.length < 10 ? 0 : ''
			}${today.getMonth() + 1}-${today.getDate()}`
		},
		activeDate: function() {
			// ultimately this should be a watcher or something.
			//return this.today
			return '2018-04-23'
		}
	},
	methods: {
		deepClone(object) {
			return JSON.parse(JSON.stringify(object))
		},
		next() {
			const active = parseInt(this.active)
			this.active = (active < 2 ? active + 1 : 0).toString()
		},
		formatDate(date) {
			return new Date(date).toLocaleDateString()
		},
		generateSnapshots(snapTime) {
			console.log('generate snapshots from ' + snapTime)
			const timesWithNewLocations = Object.keys(
				this.timepoints[this.activeDate].newLocations
			).sort()

			timesWithNewLocations.forEach(time => {
				// we will use this to initialize locations that are not already in the list
				let emptyLocation = {employees: [], individuals: [], vehicles: []}

				// a snapshot may already exist, if it doesn't we'll create it
				let snapshotsForThisTime =
					this.timepoints[this.activeDate].snapshots[time] || {}

				// we know this exists
				let newLocationsForThisTime = this.timepoints[this.activeDate]
					.newLocations[time]

				// start by getting a clone of the snapshot just before this one
				snapshotsForThisTime = this.getSnapshotFromPreviousTimepoint(
					snapTime,
					timesWithNewLocations
				)

				// these will make iteration easier
				const newLocationKeys = Object.keys(newLocationsForThisTime)
				const snapshotKeys = Object.keys(snapshotsForThisTime)
				const snapshotEntries = Object.entries(snapshotsForThisTime)

				// for categories (employees, individuals and vehicles), check what is going on in each newLocation
				this.categories.forEach(category => {
					newLocationKeys.forEach(location => {
						console.log(time)
						// locations in newLocations may only have one category where a change happens, so  check
						if (newLocationsForThisTime[location].hasOwnProperty(category)) {
							const peopleOrVehiclesWhoWillMove =
								newLocationsForThisTime[location][category]
							// for every member of the current category,  we check where they were before this change
							peopleOrVehiclesWhoWillMove.forEach(personOrVehicle => {
								const prevLocationOfPersonOrVehicle = this.getLocationOfPersonOrVehicleInSnapshot(
									snapshotEntries,
									personOrVehicle,
									category
								)

								if (prevLocationOfPersonOrVehicle !== 'unknown location') {
									const prevArrayContainingPersonOrVehicle = [
										...snapshotsForThisTime[prevLocationOfPersonOrVehicle][
											category
										]
									]

									// if they were somewhere in the previous snapshot, remove them now
									snapshotsForThisTime[prevLocationOfPersonOrVehicle][
										category
									] = prevArrayContainingPersonOrVehicle.filter(
										element => element !== personOrVehicle
									)
								}
								console.log(
									personOrVehicle +
										' will move from ' +
										prevLocationOfPersonOrVehicle
								)
							})
							if (this.locationExistsInSnapshot(location, snapshotKeys)) {
								console.log(location + ' is in the snapshot')
								if (
									categoryExistsInLocation(
										category,
										snapshotsForThisTime[location]
									)
								) {
									console.log(location + ' in snapshot already has ' + category)
								}
							} else {
								console.log(location + ' is NOT in the snapshot')

								// create an empty location object
								snapshotsForThisTime[location] = {...emptyLocation}
								// assign the new locations
								snapshotsForThisTime[location][category] = {
									...newLocationsForThisTime[location][category]
								}
								console.log(
									'added ' + location + ' to snapshot',
									snapshotsForThisTime
								)
							}
						}
					})
				})
				this.$store.dispatch('replaceSnapshot', {snapshotsForThisTime, time})
			})
		},
		getSnapshotFromPreviousTimepoint(time, times) {
			if (time === '00:00') {
				return this.deepClone(
					this.timepoints[this.activeDate].baselineAtMidnight
				)
			}
			const currentIndex = times.indexOf(time)
			const previousTime = times[currentIndex - 1]
			const previousSnapshot = this.deepClone(
				this.timepoints[this.activeDate].snapshots[previousTime]
			)
			console.log('prevsnap', previousSnapshot)
			return previousSnapshot
		},
		locationExistsInSnapshot(location, snapshotKeys) {
			return snapshotKeys.includes(location)
		},
		categoryExistsInLocation(category, location) {
			return Object.keys(location).includes(category)
		},
		getLocationOfPersonOrVehicleInSnapshot(
			snapshotEntriesArray,
			personOrVehicle,
			category
		) {
			let foundLocation = snapshotEntriesArray.find(entry => {
				if (entry[1].hasOwnProperty(category)) {
					return entry[1][category].includes(personOrVehicle)
				}
			})
			if (foundLocation) {
				return foundLocation[0]
			} else {
				return 'unknown location'
			}
		}
	},
	mounted() {}
}
</script>

<style scoped>
h1,
h2 {
	font-weight: normal;
}
ul {
	list-style-type: none;
	padding: 0;
}
li {
	display: inline-block;
	margin: 0 10px;
}
a {
	color: #42b983;
}
</style>
