<template>
    <v-card flat>
        <v-simple-table>
            <template v-slot:default>
                <colgroup>
                    <col width="10%">
                    <col width="12%">
                </colgroup>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>User type</th>
                        <th>
                            <v-btn @click="addBtnClick" elevation="0" color="primary" style="float: right">
                                <v-icon>mdi-plus</v-icon>ADD NEW
                            </v-btn>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="u in users" :key="u.id">
                        <td>{{ u.id }}</td>
                        <td>{{ u.username }}</td>
                        <td>{{ u.utype == 1 ? 'Admin' : 'Simple' }}</td>
                        <td>
                            <v-btn @click="editItemClick(u)" elevation="0" style="float: right">
                                Change password
                            </v-btn>
                        </td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
    </v-card>
</template>

<script>
import { mapState } from 'vuex';
import DataAgent from '../../logic/DataAgent';

export default {
    computed: mapState({users: state => {
        return state.user.id == 1 ? state.data.users : state.data.users.filter(u => (u.utype > 1 || u.id == state.user.id))
    }}),
    methods: {
        addBtnClick(){
            editUser()
        },
        editItemClick(data){
            changePassword(data);
        },

        async update(){
            // await sleep(1000)
            this.$store.state.data.users = await DataAgent.getUsers();
        }
    },
    mounted(){
        this.update();
    }
}
</script>