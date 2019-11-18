<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="10"
      :loading="loading"
      :height="(layout.pageViewHeight - 61) + 'px'"
      class="elevation-1 rounded-corners mtable2"
      @click:row="itemClick"
    ></v-data-table>
    <InvoiceDetails :data="{}" :services="[]" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import DataAgent from '../logic/DataAgent';
import InvoiceDetails from './InvoiceDetails';
import Router from '../struct/router'

export default {
  components: {
    InvoiceDetails
  },
  computed: mapState(['layout', 'router']),
  watch: {
      'router.page'(){
          if(this.router.page == 'Invoices') this.update();
      }
  },
  data() {
    return {
      loading: false,
      headers: [
        { 
            text: "DATE", value: "date",
            align: "left"
        },
        { text: "NO.", value: "no" },
        { text: "W.O", value: "wo" },
        { text: "STOCK", value: "stock", default: '---' },
        { text: "VIN", value: "vin" },
        { text: "P.O.", value: "po" },
        { text: "MAKE", value: "make" },
        { text: "MODEL", value: "model" },
        { text: "YEAR", value: "year" },
        { text: "COLOR", value: "color" },
        // { text: "SUB-TOTAL", value: "subtotal" },
        // { text: "GST", value: "gst" },
        // { text: "QST", value: "qst" },
        { text: "TOTAL", value: "total" },
      ],
      items: [] 
    };
  },
  methods: {
    async update(){
        this.loading = true;
        this.items = await DataAgent.getInvoices();
        this.loading = false;
    },
    itemClick(data){
      Router.openModalPage('invoiceDetails', {data});
    }
  },
  mounted(){
      this.update();
  }
};
</script>

<style>
.rounded-corners {
  border-radius: 4px;
}
.mtable2 td{
    white-space: nowrap !important;
    cursor: pointer !important;
}
</style>