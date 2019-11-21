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
      :search="searchValue"
    ></v-data-table>
    <HeadBarControls>
      <v-text-field v-model="searchValue" prepend-inner-icon="search" placeholder="Search" class="searchBox" outlined dense dark clearable />
    </HeadBarControls>
    <InvoiceDetails :data="{}" :services="[]" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import DataAgent from '../logic/DataAgent';
import InvoiceDetails from './InvoiceDetails';
import Router from '../struct/router';
import HeadBarControls from './HeadBarControls';

export default {
  components: {
    InvoiceDetails,
    HeadBarControls
  },
  computed: mapState(['layout', 'router']),
  watch: {
      'router.page'(){
          if(this.router.page == 'Invoices'){
            this.searchValue = '';
            this.update();
          }
      }
  },
  data() {
    return {
      loading: false,
      searchValue: '',
      headers: [
        { 
            text: "DATE", value: "date",
            align: "left"
        },
        { text: "NO.", value: "no" },
        { text: "W.O", value: "wo", filterable: true, default: '---' },
        { text: "STOCK", value: "stock", filterable: true, default: '---' },
        { text: "VIN", value: "vin", filterable: true, default: '---' },
        { text: "P.O.", value: "po", default: '---' },
        { text: "MAKE", value: "make", default: '---' },
        { text: "MODEL", value: "model", default: '---' },
        { text: "YEAR", value: "year", default: '---' },
        { text: "COLOR", value: "color", default: '---' },
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
.searchBox{
  width: 300px;
  float: right;
  transform: scale(0.9);
  margin-top: -3px !important;
  margin-right: -20px !important;
}
</style>