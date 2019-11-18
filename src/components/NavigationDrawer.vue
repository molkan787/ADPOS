<template>
    <v-card class="nd-card-root" height="100%" elevation="0">
        <v-navigation-drawer absolute permanent left >
            <template v-slot:prepend>
                <v-list-item two-line>
                    <v-list-item-avatar>
                        <img src="@/assets/user.png">
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>{{ user.username }}</v-list-item-title>
                        <v-list-item-subtitle>
                            <a @click="logoutClick" href="#">Logout</a>
                        </v-list-item-subtitle>
                        <!-- <v-list-item-subtitle>
                            <a href="#">Change password</a>
                        </v-list-item-subtitle> -->
                    </v-list-item-content>
                </v-list-item>
            </template>

            <v-divider></v-divider>

            <v-list dense>
                <v-list-item
                    v-for="item in items"
                    :key="item.title"
                    v-model="actives[item.name]"
                    @click="itemClick(item)" >

                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                    
                </v-list-item>

            </v-list>
        </v-navigation-drawer>
    </v-card>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

export default {
    computed: mapState(['router', 'user']),
    methods: {
        itemClick(item){
            Vue.set(this, 'actives', {});
            Vue.set(this.actives, item.name, true);
            if(this.router.page != item.name){
                this.$navigate(item.name);
            }
        },
        async logoutClick(){
            if(await confirm('Are you sure you want to logout?')){
                logout();
            }
        }
    },
    data: () => ({
        actives: {
            Form: true
        },
        items: [
            { name: 'Form', title: 'Home', icon: 'dashboard' },
            { name: 'Sales', title: 'Daily Sales', icon: 'insert_chart' },
            { name: 'Invoices', title: 'Invoices', icon: 'mdi-note' },
            { name: 'Settings', title: 'Settings', icon: 'settings' },
            // { name: 'Users', title: 'Users', icon: 'mdi-account-group-outline' },
        ],
    }),
}
</script>

<style>
.nd-card-root{
    border-radius: 0 !important;
}
</style>