<template>
  <v-row justify="center">
    <v-dialog v-model="open" persistent max-width="520">
      <v-card>
        <v-card-title class="headline">SETUP</v-card-title>
        <v-card-text>Welcome to ADPOS, To start using the software setup a dealer.</v-card-text>
        <v-card flat class="pa-6">
            <v-text-field v-model="name" :disabled="loading" label="Dealer Name" filled class="input" />
            <v-btn @click="setupClick" :loading="loading" class="fluid" style="height: 50px" elevation="1" color="primary">Setup</v-btn>
        </v-card>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import DataManager from '../logic/DataManager';

export default {
    data:() => ({
        open: false,
        loading: false,
        name: '',
    }),

    methods: {
        setupClick(){
            if(this.name.length < 4){
                alert('Please type at least 4 characters long dealer name.', 'Setup');
                return;
            }
            this.loading = true;
            this.setup();
        },
        async setup(){
            try {
                console.log('Before: DataManager.setup')
                await DataManager.setup(this.name.toUpperCase());
                console.log('After: DataManager.setup')
                setTimeout(() => this.end(), 2000);
                console.log('After: this.end()')
            } catch (error) {
                this.loading = false;
                console.error(error);
                alert('An error occured,\n' + error.message, 'Setup')
            }
        },
        async end(){
            this.loading = false;
            await alert('Setup was successfully completed, The software will now reload!<br><br>Username: ADMIN<br>Password: 123456', 'ADPOS');
            window.onbeforeunload = null;
            window.location.reload();
        }
    },

    created(){
        window.setup = () => {
            console.log('Launching setup...')
            this.open = true;
        };
    }
}
</script>

<style scoped>
.input{
    margin-bottom: 30px;
}
</style>