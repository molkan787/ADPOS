<template>
  <div>
    <v-app-bar elevation="0" color="indigo" dense dark>
      <v-icon style="margin-right: 10px">mdi-domain</v-icon>

      <v-toolbar-title>AVANTI DEALER POINT OF SALE - {{ dealerName }}</v-toolbar-title>

      <v-spacer></v-spacer>

    </v-app-bar>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: mapState(['dealerName'])
}
</script>