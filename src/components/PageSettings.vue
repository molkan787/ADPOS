<template>
  <v-card :height="$store.state.layout.pageViewHeight + 'px'">
    <v-tabs v-model="tab" grow background-color="indigo" dark>
      <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" class="tabs" :style="{height: (viewHeight - 50) + 'px'}">

      <v-tab-item v-for="item in items" :key="item">
        <component :is="item + 'Tab'" />
      </v-tab-item>

    </v-tabs-items>
  </v-card>
</template>

<script>
import GeneralTab from './SettingsTabs/General';
import ServicesTab from './SettingsTabs/Services';
import UsersTab from './SettingsTabs/Users';
import { mapState } from 'vuex';

export default {
  components: {
    GeneralTab,
    ServicesTab,
    UsersTab
  },
  computed: {
    ...mapState({ 
      viewHeight: state => state.layout.pageViewHeight,
      userType: state => state.user.utype
    }),
    items(){
      return this.userType > 1 ? ["Services"] : ["General", "Services", "Users"];
    }
  },
  data: () => ({
    tab: 0,
  }),
  watch: {
    items(){
      this.tab = 0;
    }
  }
};
</script>

<style scoped>
.tabs{
  overflow-y: scroll;
}
</style>