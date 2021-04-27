<template>
    <v-card flat color="transparent">
        <v-text-field :readonly="loading" v-model="username" label="Username" prepend-icon="perm_identity" autofocus />
        <v-text-field :readonly="loading" v-model="password" label="Password" prepend-icon="lock" type="password"/>
        <v-btn :disabled="!formDataValid" :loading="loading" @click="loginClick" elevation="0" class="fluid" color="white" light >Login</v-btn>
        <v-card-subtitle class="credit">AVANTI DEALER POINT OF SALE - CREATED BY JIMMY GEORGIADIS</v-card-subtitle>
    </v-card>
</template>

<script>
import DataAgent from '../../logic/DataAgent';

export default {
    data:() => ({
        loading: false,
        username: '',
        password: '',
    }),
    computed:{
        formDataValid(){
            return this.username.length >= 5 && this.password.length >= 4;
        }
    },
    methods: {
        async loginClick(){
            this.loading = true;
            await this.login();
            this.loading = false;
        },
        async login(){
            try {
                console.log('before login')
                await DataAgent.login(this.username.toUpperCase(), this.password.toUpperCase());
                console.log('after login')
                await DataAgent.initialeLoad();
                console.log('after initialeLoad')
                this.$store.state.router.page = 'Form';
                this.$emit('loggedin');
            } catch (error) {
                if(error == 'NO_USER'){
                    alert('User does not exist.', 'ADPOS');
                }else if(error == 'WRONG_PASSWORD'){
                    alert('Incorrect password.', 'ADPOS')
                }else{
                    alert('An error occured..', 'ADPOS');
                }
            }
        }
    },
    created(){
        window.clearLoginForm = () => {
            this.username = '';
            this.password = '';
        }
    },
    mounted(){
        if(DEV){
            this.username = 'ADMIN';
            this.password = '123456';
            setTimeout(() => {
                this.login();
            }, 1000)
        }
    }
}
</script>

<style scoped>
.credit{
    margin-top: 34px !important;
    font-size: 10px;
    color: #666 !important;
    text-align: center;
}
</style>