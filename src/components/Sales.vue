<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="10"
      :loading="loading"
      :height="(layout.pageViewHeight - 61) + 'px'"
      class="elevation-1 rounded-corners mtable"
    ></v-data-table>
    <HeadBarControls>
      <v-btn @click="exportDataClick" outlined color="white">
        <v-icon>get_app</v-icon>
        Export Data
      </v-btn>
    </HeadBarControls>
  </div>
</template>

<script>
import { mapState } from "vuex";
import DataAgent from '../logic/DataAgent';
import Utils from '../utils';
import HeadBarControls from './HeadBarControls';

export default {
  components: {
    HeadBarControls
  },
  computed: mapState(['layout', 'router']),
  watch: {
      'router.page'(){
          if(this.router.page == 'Sales') this.update();
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
        { text: "INVOICE", value: "invoice_no" },
        { text: "ITEM #", value: "item_no" },
        { text: "W.O", value: "wo" },
        { text: "STOCK", value: "stock" },
        { text: "VIN", value: "vin" },
        { text: "P.O.", value: "po" },
        { text: "MAKE", value: "make" },
        { text: "MODEL", value: "model" },
        { text: "YEAR", value: "year" },
        { text: "COLOR", value: "color" },
        { text: "SERVICE", value: "description" },
        { text: "PRICE", value: "price" },
        { text: "GST", value: "gst" },
        { text: "QST", value: "qst" },
        { text: "TOTAL", value: "total" },
      ],
      items: [] 
    };
  },
  methods: {
    async update(){
      this.loading = true;
      this.items = await DataAgent.getDailySales();
      this.loading = false;
    },
    exportDataClick(){
      this.$router.openModalPage('salesExporter');
    }
  },
  mounted(){
      this.update()
  }
};
</script>

<style>
.rounded-corners {
  border-radius: 4px;
}
.mtable td, .mtable th{
    white-space: nowrap !important;
}
</style>