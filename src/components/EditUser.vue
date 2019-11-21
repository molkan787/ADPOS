<template>
    <v-dialog v-model="open" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">Add new User</v-card-title>
        <hr>
        <v-card-text>
            <v-select v-if="$store.state.user.id == 1" :readonly="loading" v-model="type" :items="['Simple', 'Admin']" label="User type" class="input" dense outlined hide-details></v-select>
            <v-text-field :readonly="loading" v-model="username" label="Username" placeholder="username" type="text"  class="input" dense outlined hide-details/>
            <v-text-field :readonly="loading" v-model="pass1" label="Password" placeholder="Password" type="password"  class="input" dense outlined hide-details/>
            <v-text-field :readonly="loading" v-model="pass2" label="Repeat Password" placeholder="Password" type="password" class="input" dense outlined hide-details/>
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
        type: 'Simple',
        username: '',
        pass1: '',
        pass2: '',
    }),
    methods: {
        cancelClick(){ this.open = false },
        async saveClick(){
            if(this.username.length < 5){
                alert('The username need to be at least 5 characters long.');
                return;
            }else if(this.pass1.length < 4){
                alert('The password need to be at least 4 characters long.');
                return;
            }else if(this.pass1.toUpperCase() != this.pass2.toUpperCase()){
                alert('The two passwords does not match.');
                return;
            }
            this.loading = true;
            await this.save();
            this.loading = false;
            await alert('The user was successfully created!');
            this.open = false;
        },

        save(){
            return DataAgent.editUser('new', {
                utype: this.type == 'Admin' ? 1 : 2,
                password: this.pass1.toUpperCase(),
                username: this.username.toUpperCase()
            });
        },

        show(){
            this.type = 'Simple';
            this.username = '';
            this.pass1 = '';
            this.pass2 = '';
            this.open = true;
        }
    },

    created(){
        window.editUser = data => this.show(data);
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