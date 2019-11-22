<template>
    <v-container>
        <v-row no-gutters>
            <v-col cols="18">
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
            </v-col>
            <v-col cols="18">
                <v-card flat class="pa-4">
                    <v-card-title class="pa-0">Mailing of Reports</v-card-title>
                    <v-text-field v-model="gmailUser" class="input nup" label="Gmail Username" placeholder="user@gmail.com" outlined dense hide-details />
                    <v-text-field v-model="gmailPass" class="input nup" label="Gmail Password" placeholder="password" type="password" outlined dense hide-details />
                    <v-divider class="input"></v-divider>
                    <v-text-field v-model="mailSendTo" class="input nup" label="Send to" placeholder="user@mail.com" outlined dense hide-details />
                    <v-text-field v-model="mailCC" class="input nup" label="CC" placeholder="user@mail.com" outlined dense hide-details />
                    <v-btn @click="saveClick2" :loading="saveBtnLoading2" class="input" color="primary" elevation="1">Save</v-btn>
                    <v-icon class="success_icon" color="green" :class="{visible: showSuccess2}">check_circle</v-icon>
                    <v-btn :disabled="!isEmailConfigValid" @click="testEmail" :loading="testBtnLoading" class="input" elevation="1">Send test email</v-btn>

                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import Settings from '../../logic/Settings';
import ReportsMailer from '../../logic/CronTasks/ReportsMailer';
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState(['setting']),
        isEmailConfigValid(){
            const s = this.setting;
            return (s.gmailUser && s.gmailPass && s.mailSendTo && true) || false;
        }
    },
    data:() => ({
        billCompany: '',
        billAddress1: '',
        billAddress2: '',
        gstRate: 0,
        qstRate: 0,

        gmailUser: '',
        gmailPass: '',
        mailSendTo: '',
        mailCC: '',

        saveBtnLoading: false,
        showSuccess: false,
        saveBtnLoading2: false,
        showSuccess2: false,
        testBtnLoading: false,
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
        async testEmail(){
            this.testBtnLoading = true;
            try {
                await ReportsMailer.doDaily();
                alert('The test email was successfully sent.', 'Test succeeded!');
            } catch (error) {
                alert('The test has failed.', 'Test failed.');
            }
            this.testBtnLoading = false;
        },
        async saveClick(){
            this.saveBtnLoading = true;
            await this.save();
            setTimeout(() => {
                this.saveBtnLoading = false;
                this.showSuccess = true;
                setTimeout(() => this.showSuccess = false, 3000);
            }, 250);
        },
        save(){
            const data = {
                billCompany: this.billCompany,
                billAddress1: this.billAddress1,
                billAddress2: this.billAddress2,
                gstRate: parseFloat(this.gstRate),
                qstRate: parseFloat(this.qstRate)
            }
            return Settings.edit(data);
        },
        async saveClick2(){
            this.saveBtnLoading2 = true;
            await this.save2();
            setTimeout(() => {
                this.saveBtnLoading2 = false;
                this.showSuccess2 = true;
                setTimeout(() => this.showSuccess2 = false, 3000);
            }, 250);
        },
        save2(){
            const data = {
                gmailUser: this.gmailUser.trim(),
                gmailPass: this.gmailPass.trim(),
                mailSendTo: this.mailSendTo.trim(),
                mailCC: this.mailCC.trim(),
            }
            return Settings.edit(data);
        },
        updateLocal(){
            const s = this.setting;
            this.billCompany = s.billCompany;
            this.billAddress1 = s.billAddress1;
            this.billAddress2 = s.billAddress2;
            this.gstRate = s.gstRate;
            this.qstRate = s.qstRate;
            
            this.gmailUser = s.gmailUser;
            this.gmailPass = s.gmailPass;
            this.mailSendTo = s.mailSendTo;
            this.mailCC = s.mailCC;
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