<template>
    <v-card flat>
        <v-simple-table>
            <template v-slot:default>
                <colgroup>
                    <col width="10%">
                </colgroup>
                <thead>
                    <tr>
                        <th>Service #</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>
                            <v-btn @click="addBtnClick" elevation="0" color="primary" style="float: right">
                                <v-icon>mdi-plus</v-icon>ADD NEW
                            </v-btn>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="s in services" :key="s.service_no">
                        <td>{{ s.service_no }}</td>
                        <td>{{ s.description }}</td>
                        <td>{{ s.price | price }}</td>
                        <td>
                            <v-btn @click="editItemClick(s)" elevation="0" style="float: right">
                                Edit
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

export default {
    computed: mapState({
        services: state => state.data.services
    }),
    methods: {
        addBtnClick(){
            editService({service_no: 'new'})
        },
        editItemClick(data){
            editService(data);
        }
    }
}
</script>