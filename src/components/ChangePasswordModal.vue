<template>
    <v-dialog v-model="open" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">Change password</v-card-title>
        <hr>
        <v-card-text>
            <span>User: {{ username }}</span>
            <v-text-field :readonly="loading" v-model="pass1" label="New Password" placeholder="Password" type="password"  class="input" dense outlined hide-details/>
            <v-text-field :readonly="loading" v-model="pass2" label="Repeat Password" placeholder="Password" type="password" class="input" dense outlined/>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="cancelClick" :disabled="loading" >Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveClick" :loading="loading" >Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import DataAgent from '../logic/DataAgent';

export default {
    data:() => ({
        open: false,
        loading: false,
        pass1: '',
        pass2: '',

        userId: 0,
        username: '',
    }),
    methods: {
        cancelClick(){ this.open = false },
        async saveClick(){
            if(this.pass1.length < 4){
                alert('The password need to be at least 4 characters long.');
                return;
            }else if(this.pass1.toUpperCase() != this.pass2.toUpperCase()){
                alert('The two passwords does not match.');
                return;
            }
            this.loading = true;
            await this.save();
            this.loading = false;
            await alert('The password was successfully changed!');
            this.open = false;
        },

        save(){
            return DataAgent.changeUserPassword(this.userId, this.pass1.toUpperCase());
        },

        show(data){
            this.userId = data.id;
            this.username = data.username;
            this.pass1 = '';
            this.pass2 = '';
            this.open = true;
        }
    },

    created(){
        window.changePassword = data => this.show(data);
    }
}
</script>

<style scoped>
.input{
    margin-top: 10px;
}
hr{
    margin-bottom: 20px;
}
span{
    font-size: 20px;
    margin-bottom: 20px;
}
</style>