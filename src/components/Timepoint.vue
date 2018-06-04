<template>
  <v-card-text class="pt-2">
		<button @click="generateSnapshots">Generate</button>
        <v-toolbar 
					dense 
					class="elevation-0 sticky" 
					color="blue-grey lighten-3"
					>
      <v-toolbar-title>Time: {{time}}</v-toolbar-title>
      <v-spacer></v-spacer>Display: &nbsp;
    <v-btn-toggle v-model="scheduleType">
              <v-btn flat value="changes">
                <span>Just Changes</span>
              </v-btn>
              <v-btn flat value="everything">
                <span>Everything</span>
              </v-btn>
            </v-btn-toggle>
      <v-btn icon @click="toggleShow">
        <v-icon>{{expandIcon}}</v-icon>
      </v-btn>
    </v-toolbar>
		<v-container v-show="expand">
    <v-container class="pa-0 pt-1">
        <v-form v-model="formIsValid" ref="form"> 
<!-- there is validation being triggered by rules within the selects themselves, but also
	using watchers on specific things, so that if the value stored in the data prop is updated, we can 
	run validation on elements that might be affected by the change.
	This is all about providing visual feedback to the user as they make changes elsewhere in the form,
	without having to wait on triggers like blurring a field or whatever.
-->
        <v-layout align-center>
        <span class="form-instruction">Move</span>
              <v-select
              chips
							deletable-chips
              multiple
          :items="individuals"
          v-model="selectedIndividuals"
          :label="`Individuals`"
        ></v-select> &nbsp;&nbsp;
              <v-select
              multiple       
              chips    
							deletable-chips   
          :items="employees"
          v-model="selectedEmployees"
          :label="`Employees`"
          :rules="employeeRules"
        ></v-select> &nbsp;&nbsp;
              <v-select
              multiple 
              chips
							deletable-chips           
          :items="Object.keys(vehicles)"
          v-model="selectedVehicles"
          :label="`Vehicles`"
          :rules="vehicleRules"
        ></v-select>
        <span class="form-instruction">To</span>
              <v-select
							@blur="logHello"
              required   
							combobox           
          :items="availableLocations"
          v-model="targetLocation"
          :label="`Location`"
        ></v-select>
        <v-btn color="normal" @click="updateNewLocations({date: '2018-04-23', time, newLocations:changesToBeCommitted})">Apply</v-btn>
      </v-layout>
      </v-form>
			<v-alert type="success" transition="slide-y-reverse-transition" dismissible v-model="alert">
				{{alertMessage}}
    </v-alert>
    </v-container>
    <v-container color="blue-grey" class="pa-0 pb-1" grid-list-md v-for="(location, locationName) in timepoint['2018-04-23'][locationsDataSource][time]" :key="locationName">
      <v-card class="pl-1 pt-1 mb-1" color="blue-grey lighten-4">
      <b>{{locationName}}</b>
      <v-layout row>
        <v-flex xs4 v-for="(thingList, category) in location" :key="category">
        <v-card color="blue-grey lighten-3" flat class="pa-1 mr-1" >
          {{category}} ({{thingList.length}})<br>
					<!-- so we're adding a random number to the key here because we never expect this component to "update" as such, but during moving them around sometimes more than one 
					exists at the same time, and vue yells if they have the same key -->
					<!-- this is less than ideal so FIXME -->
        <person-or-vehicle class="" v-for="id in thingList" :key="id + Math.floor(Math.random() * 200)" :id="id"></person-or-vehicle>
        </v-card>
        </v-flex>
      </v-layout>
      </v-card>
      
  </v-container>
		</v-container>
    </v-card-text>
</template>

<script>
import PersonOrVehicle from './PersonOrVehicle'
import dataExp from '../data/data-exp.js'

export default {
	props: ['timepoint', 'time', 'test'],
	data() {
		return {
			...dataExp, // adds following props: individuals, employees, availableLocations, and vehicles ... this is concise but probably not clear enough?
			selectedEmployees: [],
			selectedIndividuals: [],
			selectedVehicles: [],
			selectTest: [],
			expandIcon: 'expand_less',
			expand: true,
			targetLocation: '',
			formIsValid: true,
			alert: false,
			alertMessage: '',
			vehicleRules: [
				value => {
					if (value.length > this.selectedEmployees.length) {
						return 'There are more vehicles than drivers'
					}
					return true
				},
				value => {
					if (
						value.length === 1 &&
						this.selectedEmployees.length + this.selectedIndividuals.length >
							5 &&
						value[0] === 'Corolla'
					) {
						return 'Corolla can only fit 5 people'
					}
					return true
				}
			],
			employeeRules: [
				value => {
					// this is abusing the rules function for side effects... feels wrong but works to keep the vehicle list consistant with reality
					this.vehicles = {...this.pmpVehicles}
					value.forEach(employee => {
						this.vehicles[employee + ' car'] = {seats: 5}
					})
					return true
				}
			]
		}
	},
	components: {PersonOrVehicle},
	methods: {
		toggleShow() {
			this.expand = !this.expand
			this.expandIcon = this.expand ? 'expand_less' : 'expand_more'
		},
		sayHelloViaStore() {
			this.$store.dispatch('sayHello')
		},
		validateForm() {
			this.$refs.form.validate()
		},
		logHello(event) {
			console.log('hello from', event)
		},
		applyCurrentMovement() {},
		generateSnapshots() {
			this.$emit('generateSnapshots', this.time)
		},
		updateNewLocations({date, time, newLocations}) {
			// sets alert message and launches alert
			this.alertMessage = `Moved ${this.selectedIndividuals.join(
				', '
			)}, ${this.selectedEmployees.join(', ')}, to ${
				this.targetLocation
			} in ${this.selectedVehicles.join(', ')}. `
			this.alert = true

			// this action is not quite right yet!
			this.$store
				.dispatch('updateNewLocations', {date, time, newLocations})
				.then(() => {
					console.log('completed update')
					// this.generateSnapshots()
				})

			// now reset the form
			this.$refs.form.reset()
			setTimeout(() => {
				// this handles the common case where you click "apply"
				// having just chosen the location and so it's still active, so a blur event fires
				// AFTER the button click, resetting the 'targetLocation' to whatever was selected
				this.targetLocation = ''
			}, 100)
		}
	},
	computed: {
		greeting() {
			return this.$store.state.hello
		},
		scheduleType: {
			get: function() {
				return this.$store.state.scheduleType
			},
			set: function(newValue) {
				this.$store.dispatch('setScheduleType', newValue)
			}
		},
		locationsDataSource() {
			return this.$store.state.locationsDataSource
		},
		changesToBeCommitted() {
			return {
				[this.targetLocation]: {
					employees: this.selectedEmployees,
					individuals: this.selectedIndividuals,
					vehicles: this.selectedVehicles
				}
			}
		}
	},
	mounted() {
		console.log('mounted a timepoint for time ' + this.time)
		// this.updateNewLocations({
		// 	date: '2018-04-23',
		// 	time: '09:00',
		// 	newLocations: {galengoal: {employees: ['MN']}}
		// })
		// this is just an example of populating the snapshot, in production it shouldn't happen until it is requested, I guess
	},
	watch: {
		// this lets us validate a little earlier, while selects are still in use.
		selectedEmployees: function() {
			this.validateForm()
		},
		selectedVehicles: function() {
			this.validateForm()
		},
		selectedIndividuals: function() {
			this.validateForm()
		}
	}
}
</script>

<style scoped>
.form-instruction {
	font-weight: bold;
	margin: 0 8px 0 8px;
}
.has-moved {
	border: 2px solid yellowgreen;
}
</style>