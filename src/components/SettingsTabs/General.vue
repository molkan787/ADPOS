<template>
    <v-card flat class="pa-4">
        <v-card-title class="pa-0">Invoice - Bill to</v-card-title>
        <v-text-field v-model="billCompany" class="input" label="Company" outlined dense hide-details />
        <v-text-field v-model="billAddress1" class="input" label="Address line 1" outlined dense hide-details />
        <v-text-field v-model="billAddress2" class="input" label="Address line 2" outlined dense hide-details />
        <v-card-title class="pa-0 ma-t">Taxes</v-card-title>
        <v-text-field v-model="gstRate" class="input" label="GST Rate" type="number" outlined dense hide-details />
        <v-text-field v-model="qstRate" class="input" label="QST Rate" type="number" outlined dense hide-details />
        <v-btn @click="saveClick" :loading="saveBtnLoading" class="input" color="primary" elevation="1">Save</v-btn>
        <v-icon class="success_icon" color="green" :class="{visible: showSuccess}">check_circle</v-icon>
    </v-card>
</template>

<script>
import Settings from '../../logic/Settings';
import { mapState } from 'vuex';

export default {
    computed: mapState(['setting']),
    data:() => ({
        billCompany: '',
        billAddress1: '',
        billAddress2: '',
        gstRate: 0,
        qstRate: 0,

        saveBtnLoading: false,
        showSuccess: false,
    }),
    watch: {
        setting: {
            deep: true,
            handler(){
                this.updateLocal();
            }
        }
    },
    methods: {
        async saveClick(){
            this.saveBtnLoading = true;
            await this.save();
            setTimeout(() => {
                this.saveBtnLoading = false;
                this.showSuccess = true;
                setTimeout(() => this.showSuccess = false, 3000);
            }, 250);
        },
        async save(){
            const data = {
                billCompany: this.billCompany,
                billAddress1: this.billAddress1,
                billAddress2: this.billAddress2,
                gstRate: parseFloat(this.gstRate),
                qstRate: parseFloat(this.qstRate)
            }
            Settings.edit(data);
        },
        updateLocal(){
            const s = this.setting;
            this.billCompany = s.billCompany;
            this.billAddress1 = s.billAddress1;
            this.billAddress2 = s.billAddress2;
            this.gstRate = s.gstRate;
            this.qstRate = s.qstRate;
        }
    },

    mounted(){
        this.updateLocal();
    }
}
</script>

<style scoped>
.input{
    margin-top: 10px;
    width: 300px;
}
.ma-t{
    margin-top: 20px;
}
.success_icon{
    font-size: 30px;
    padding: 6px 6px 6px 0;
    transform: translateY(6px);
    opacity: 0;
}
.visible{
    padding-left: 6px;
    opacity: 1;
}
</style>