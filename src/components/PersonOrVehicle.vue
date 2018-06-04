<template>
<v-menu
        offset-x
        :close-on-content-click="false"
        :nudge-width="200"
        v-model="menu"
      >
  <v-chip
		color="white"
		slot="activator">
			{{id}}
	</v-chip>

	<v-card>
          <v-list>
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <v-icon>person</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{id}}</v-list-tile-title>
                <v-list-tile-sub-title>Something about person or vehicle</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn
                  icon
                  :class="fav ? 'red--text' : ''"
                  @click="fav = !fav"
                >
                  <v-icon>favorite</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <v-divider></v-divider>
          <v-list>
            <v-list-tile>
              <v-list-tile-action>
                <v-switch v-model="message" color="purple"></v-switch>
              </v-list-tile-action>
              <v-list-tile-title>Enable messages</v-list-tile-title>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-action>
                <v-switch v-model="hints" color="purple"></v-switch>
              </v-list-tile-action>
              <v-list-tile-title>Enable hints</v-list-tile-title>
            </v-list-tile>
          </v-list>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="menu = false">Cancel</v-btn>
            <v-btn color="primary" flat @click="menu = false">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>

</template>

<script>
export default {
	props: {
		id: {
			default: 'none'
		},
		category: {
			default: 'none'
		}
	},
	data() {
		return {
			fav: true,
			menu: false,
			message: false,
			hints: true
		}
	}
}
</script>

<style scoped>

</style>