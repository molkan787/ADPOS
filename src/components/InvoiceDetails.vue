<template>
  <v-dialog
    v-model="open"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable>
    <v-card tile>
      <v-toolbar flat dark color="primary">
        <v-btn icon dark @click="open = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Invoice # {{ data.no }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="printClick" :loading="printBtnLoading">Print</v-btn>
        </v-toolbar-items>
        <v-toolbar-items>
          <v-btn dark text :disabled="data.status == 3" @click="cancelClick"  :loading="cancelBtnLoading">Cancel Invoice</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text class="content">
        <BasicInfoForm :data="data" readonly/>
        <CarDataForm :data="data" class="carData" readonly />
        <ServicesForm  readonly
            :items="services" :totals="data" :itemNoPrefix="data.no"
            :gstRate="data.gst_rate" :qstRate="data.qst_rate" />
            <div class="pa-3 commentBox">
              <v-text-field :value="comment" label="Comment" placeholder="Empty" class="nup" outlined dense readonly/>
            </div>
      </v-card-text>

      <div style="flex: 1 1 auto;"></div>
    </v-card>
  </v-dialog>
</template>

<script>
import BasicInfoForm from './FormPage/basicInfoForm'
import CarDataForm from './FormPage/CarDataForm'
import ServicesForm from './FormPage/ServicesForm'
import DataAgent from '../logic/DataAgent'
import Router from '../struct/router'
import Invoice from '../logic/invoice'

export default {
    components: {
        CarDataForm,
        BasicInfoForm,
        ServicesForm
    },
    data:() => ({
        open: false,
        data: {},
        services: [],
        comment: '',

        printBtnLoading: false,
        cancelBtnLoading: false,
    }),
    methods: {
        async show(data){
            this.data = data;
            this.open = true;
            this.services = await DataAgent.getInvoiceItems(data.id);
            this.comment = await DataAgent.getInvoiceComment(data.id);
        },
        printClick(){
            this.printBtnLoading = true;
            setTimeout(() => this.printBtnLoading = false, 250);
            try {
                Invoice.print(this.data, this.services, this.comment);
            } catch (error) {
            }
        },
        async cancelClick(){
          if(await confirm('Are you sure you want to cancel the invoice?')){
            this.cancelInvoice();
          }
        },

        async cancelInvoice(){
          this.cancelBtnLoading = true;
          await DataAgent.cancelInvoice(this.data.id);
          this.data.status = 3;
          setTimeout(() => this.cancelBtnLoading = false, 250);
          // Invoice.print(this.data, this.services);
        }
    },
    created(){
        Router.registerModalPage('invoiceDetails', ({data}) => this.show(data));
    }
}
</script>

<style lang="scss" scoped>
.content  {
    min-height: calc(100% - 64px);
}
.commentBox{
  width: 550px;
  margin-top: -100px;
}
</style>