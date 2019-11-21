<template>
    <v-snackbar
        v-model="open"
        bottom
        right
        :timeout="0"
        :color="success ? 'success' : 'info'" >
        <template v-if="success">
            <v-icon dark>check_circle</v-icon>
            <span>Data correction Completed!</span>
        </template>
        <template v-else>
            <v-progress-circular :value="progress"></v-progress-circular>
            {{ notifText }} {{ progressText }}
        </template>
        <v-btn dark text @click="hideClick" > Hide </v-btn>
    </v-snackbar>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed:{
        ...mapState({
            open: state => state.dataMonitor.notifOpen,
            success: state => state.dataMonitor.notifSuccess,
            progress: state => state.dataMonitor.progress,
            notifText: state => state.dataMonitor.notifText,
        }),
        progressText(){
            return this.progress + '%';
        }
    },
    methods: {
        hideClick(){
            this.$store.state.dataMonitor.notifOpen = false;
        }
    }
}
</script>

<style>
.v-progress-circular__overlay{
    -webkit-transition: none !important;
    transition: none !important;
}
</style>