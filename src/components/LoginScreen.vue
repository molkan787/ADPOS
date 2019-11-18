<template>
    <div>
        <transition name="zoom-fade">
            <keep-alive>
                <v-card v-if="open" flat class="root">
                    <v-row justify="center">
                        <v-card class="card pa-4" elevation="1" color="indigo" dark>
                            <div class="title">ADPOS - {{ dealerName }}</div>
                            <v-card flat color="transparent" class="pa-6">
                                <LoginForm @loggedin="loggedIn" />
                            </v-card>
                        </v-card>
                    </v-row>
                </v-card>
            </keep-alive>
        </transition>
    </div>
</template>

<script>
import LoginForm from './LoginScreenComps/LoginForm';
import { mapState } from 'vuex';

export default {
    computed: mapState(['dealerName']),
    components: {
        LoginForm
    },
    data:() => ({
        open: true,
    }),
    methods: {
        loggedIn(){
            this.open = false;
        }
    },
    created(){
        window.logout = () => {
            clearLoginForm();
            this.open = true;
        }
    }
}
</script>

<style scoped>
.root{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #eee;
}
.hidden{
    display: none;
}
.card{
    position: absolute;
    top: 50%;
    width: 500px;
    height: 300px;
    margin-top: -150px;
}
.title{
    color: white;
    font-size: 30px;
    border-bottom: 3px solid white;
    padding-bottom: 6px;
}

.zoom-fade-enter-active {
  transition: all .2s ease;
}
.zoom-fade-leave-active {
  transition: all .4s;
}
.zoom-fade-enter-to{
    transform: scale(1);
}
.zoom-fade-enter, .zoom-fade-leave-to {
  transform: scale(1.1);
  opacity: 0.3;
}
</style>