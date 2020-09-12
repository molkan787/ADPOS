<template>
    <v-card elevation="1" height="auto" class="pa-1">
        <div style="height: 100%">
            <BasicInfoForm :data="basicInfo"/>
            <CarDataForm :data="carData" class="carData" />
            <ServicesForm @requestItemUpdate="updateServiceItemData"
            :items="services" :totals="totals" :itemNoPrefix="basicInfo.no"
            :gstRate="setting.gstRate" :qstRate="setting.qstRate" />

            <div class="pa-3 buttons">
                <v-text-field :readonly="submitLoading" v-model="comment" label="Comment" class="comment-box nup" outlined dense hide-details />
                <v-btn large color="primary" elevation="1" class="mlb" :loading="submitLoading" @click="submit">
                    <v-icon left>mdi-check</v-icon>
                    PRINT INVOICE
                </v-btn>
                <v-btn large elevation="1" @click="clear">
                    <v-icon left>mdi-close</v-icon>
                    Clear
                </v-btn>
            </div>
        </div>
        <v-dialog
            :value="submitLoading"
            hide-overlay
            width="300">
            <v-card color="primary" dark >
                <v-card-text>
                    Generating invoice...
                    <v-progress-linear
                        indeterminate
                        color="white"
                        class="mb-0">
                    </v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
import Vue from 'vue'
import BasicInfoForm from './FormPage/basicInfoForm'
import CarDataForm from './FormPage/CarDataForm'
import ServicesForm from './FormPage/ServicesForm'
import { mapState } from 'vuex'
import DataAgent from '../logic/DataAgent'
import Dialogs from '../logic/Dialogs'
import Utils from '../utils'
import Invoice from '../logic/invoice'

export default {
    components: {
        CarDataForm,
        BasicInfoForm,
        ServicesForm
    },
    computed: mapState(['setting', 'invoiceCount', 'dealerName']),
    data: () => ({
        submitLoading: false,
        comment: '',
        carData: {},
        basicInfo: {
            date: '',
            no: ''
        },
        services: [],
        totals: {
            subtotal: 0,
            gst: 0,
            qst: 0,
            total: 0,
        }
    }),
    watch: {
        invoiceCount(){
            this.updateInvoiceNO();
        }
    },
    methods: {
        updateInvoiceNO(){
            const prefix = this.basicInfo.date.substr(5, 5).replace('-', '') + '-';
            this.basicInfo.no = prefix + (this.invoiceCount + 1);
        },
        resetDate(){
            this.basicInfo.date = Utils.getDateString(true);
        },
        clear(){
            this.comment = '';
            this.carData = this.setting.autoFillMake ? {make: this.dealerName } : {};
            this.services = [{},{},{},{},{}];
            this.updateInvoiceNO();
            this.updateTotals();
        },
        validateForm(services){
            const title = 'Invalid data';
            if(!this.basicInfo.date){
                alert('You need to select date & time', title);
            }else if(this.carData.year && (this.carData.year.length != 4 || !Utils.isDigitOnly(this.carData.year))){
                alert('YEAR must be in 4 digits format 20##', title);
            }else if(services.length < 1){
                alert('You need to add at least 1 service to the invoice.', title);
            }else{
                return true;
            }
            return false;
        },
        async submit(){
            const services = this.services.filter(i => i.bk_service_no)
            .map(i => ({price: i.price, description: i.description, service_no: i.service_no}));
            if(!this.validateForm(services)) return;
            this.resetDate();
            const data = {
                ...this.totals,
                ...this.carData,
                ...this.basicInfo
            }
            this.submitLoading = true;
            try {
                const invoice = await DataAgent.submitInvoice(data, services, this.comment);
                await Invoice.print(invoice.data, invoice.services, this.comment);
                this.clear();
            } catch (error) {
                console.error(error)
                Dialogs.actionError();
            }
            this.submitLoading = false;
        },

        updateServiceItemData(index){
            const item = this.services[index];
            const service_no = parseInt(item.service_no);
            const service = this.$dataAgent.getService(service_no);
            if(service){
                if(item.bk_service_no != service_no){
                    const isCustom = service.price == 0;
                    Vue.set(item, 'description', service.description);
                    Vue.set(item, 'isCustom', isCustom);
                    Vue.set(item, 'price', service.price);
                    if(isCustom){
                        Vue.set(item, 'dynamicPrice', this.$options.filters.price(0));
                    }
                }
                Vue.set(item, 'bk_service_no', service_no);
            }else{
                Vue.set(item, 'description', '');
                Vue.set(item, 'price', '');
                Vue.set(item, 'bk_service_no', '');
            }
            this.updateTotals();
        },

        updateTotals(){
            let total = 0;
            for(let s of this.services){
                if(!s.price) continue;
                total += s.price;
            }
            const gst = total * this.setting.gstRate;
            const qst = total * this.setting.qstRate;
            this.totals.subtotal = total;
            this.totals.gst = gst;
            this.totals.qst = qst;
            this.totals.total = total + gst + qst;
        }
    },
    created(){
        DataAgent.registerForAfterInit(() => {
            setInterval(() => this.resetDate(), 30 * 1000);
            this.resetDate();
            this.clear();
        })
    }
}
</script>

<style lang="scss" scoped>
.buttons{
    text-align: left;
    width: calc(100% - 400px);
    margin: -115px 0 10px 0;
}
.comment-box{
    width:80% !important;
    margin-bottom: 10px;
}
.carData{
    width: calc(100% - 100px)
}
.mlb{
    margin-right: 10px;
}
</style>