<template>
  <v-app>
    <v-navigation-drawer
      persistent
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      flat
      app
      :clipped-left="clipped"
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer">
      </v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>

    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<style>
body {
	overflow: scroll;
}
</style>


<script>
export default {
	data() {
		return {
			clipped: true,
			drawer: false,
			fixed: true,
			items: [
				{
					icon: 'account_circle',
					title: 'Account'
				},
				{
					icon: 'playlist_add',
					title: 'New Schedule'
				},
				{
					icon: 'person_add',
					title: 'New Employee'
				},
				{
					icon: 'person_add',
					title: 'New Individual'
				},
				{
					icon: 'add_location',
					title: 'New Location'
				}
			],
			miniVariant: false,
			title: 'PMP Scheduler'
		}
	},
	name: 'App'
}
</script>
