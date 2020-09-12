<template>
  <div>
    <v-card-title class="pa-0-b pa-0-t">Services</v-card-title>
    <v-simple-table class="pa-3 special-ribr" dense>
      <template v-slot:default>
        <colgroup>
          <col width="15%">
          <col width="15%">
          <col width="50%">
          <col width="20%">
        </colgroup>
        <thead>
          <tr>
            <th class="text-left">SERVICE NO.</th>
            <th class="text-left">Item Invoice ID</th>
            <th class="text-left">SERVICE DESCRIPTION</th>
            <th class="text-left">PRICE</th>
          </tr>
        </thead>
          
        <tbody ref="tbody">
          <tr v-if="!items || !items.length">
            <td colspan="4">
              <v-progress-linear
                  indeterminate
                  color="blue"
                  class="mb-0">
              </v-progress-linear>
            </td>
          </tr>
          <tr v-for="(item, index) in items" :key="index">
            <td class="pa-0">
                <v-text-field
                    :readonly="readonly"
                    class="service_no"
                    dense
                    outlined
                    hide-details
                    v-model="item.service_no"
                    placeholder="SERVICE NO."
                    required
                    type="number"
                ></v-text-field>
            </td>
            <td class="pa-0">
                <v-text-field
                    dense
                    outlined
                    hide-details
                    :value="readonly ? item.item_no : (item.service_no ? (itemNoPrefix + '-' + (index + 1)) : '')"
                    placeholder="Item Invoice ID"
                    readonly
                    required
                ></v-text-field>
            </td>
            <td class="pa-0">
                <v-text-field
                    :readonly="readonly"
                    dense
                    outlined
                    hide-details
                    v-model="item.description"
                    placeholder="SERVICE DESCRIPTION"
                    required
                ></v-text-field>
            </td>
            <td class="pa-0">
                <v-text-field
                    v-if="item.isCustom"
                    dense
                    outlined
                    hide-details
                    v-model="item.dynamicPrice"
                    @focus="priceInputFocused(item, $event)"
                    @blur="priceInputBlured(item, $event)"
                    placeholder="PRICE"
                ></v-text-field>
                <v-text-field
                    v-else
                    dense
                    outlined
                    hide-details
                    :value="item.price | price"
                    placeholder="PRICE"
                    readonly
                ></v-text-field>
            </td>
          </tr>

          <tr class="totals-row pad-top">
              <td colspan="3">Total before taxes</td>
              <td class="keep-border">{{ totals.subtotal | price }}</td>
          </tr>

          <tr class="totals-row">
              <td colspan="3">GST {{_gstRate}}</td>
              <td class="keep-border">{{ totals.gst | price }}</td>
          </tr>

          <tr class="totals-row">
              <td colspan="3">QST {{_qstRate}}</td>
              <td class="keep-border">{{ totals.qst | price }}</td>
          </tr>

          <tr class="totals-row">
              <td colspan="3">TOTAL WITH TAXES</td>
              <td>{{ totals.total | price }}</td>
          </tr>

        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import Utils from '../../utils';

export default {
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    totals: {
        type: Object,
        required: true,
    },
    items: {
        type: Array,
        required: true,
    },
    itemNoPrefix: {
        type: String,
        default: '', 
    },
    gstRate: {
        type: Number,
        default: '', 
    },
    qstRate: {
        type: Number,
        default: '', 
    }
  },
  computed:{
    _gstRate(){ return Utils.round(this.gstRate * 100, 4) + '%' },
    _qstRate(){ return Utils.round(this.qstRate * 100, 4) + '%' }
  },
  data: () => ({
      itemsLen: 0,
      itemsServiceNumbers: {}
  }),
  watch: {
    items: {
        deep: true,
        handler(){ this.itemsChanged() }
    }
  },
  methods: {
    priceInputFocused(item, event){
      event.target.placeholder = item.dynamicPrice;
      item.dynamicPrice = '';
    },
    priceInputBlured(item, event){
      event.target.placeholder = 'PRICE';
      const np = item.dynamicPrice ? parseFloat(item.dynamicPrice) : item.price;
      item.dynamicPrice = this.$options.filters.price(np);
      item.price = np;
    },
    itemsChanged(){
      const nos = this.itemsServiceNumbers;
      for(let i = 0; i < this.items.length; i++){
        if(nos[i] != this.items[i].service_no){
          this.updateItem(i);
        }
      }
      const lastItem = this.items[this.items.length-1];
      if(!this.readonly && lastItem && lastItem.service_no){
          this.items.push({});
      }
      this.initEnterHandlers();
    },
    updateItem(index){
        this.$emit('requestItemUpdate', index);
    },

    initEnterHandlers(){
        if(this.itemsLen == this.items.length) return;
        setTimeout(() => {
            this.itemsLen = this.items.length;
            const els = this.$refs.tbody.querySelectorAll('.service_no input');
            for(let i = 0; i < els.length; i++){
                const el = els[i];
                el.nextInput = els[i+1] || els[0];
            }
        }, 50);
    },

  },
  created(){
    this.initEnterHandlers();
  }
};
</script>

<style lang="scss">
.special-ribr {
    td{
        &:not(.keep-border){
            border: none !important;
        }
        &:not(:first-child) .v-input__slot{
            border-top-left-radius: 0 !important;
            border-bottom-left-radius: 0 !important;
        }
        &:not(:last-child) .v-input__slot{
            border-top-right-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
        }
        &:last-child, &:last-child input{
            text-align: right;
        }
        &[colspan="3"]{
            font-weight: bold;
            padding-left: calc(80% - 200px) !important;
        }
    }
}
.totals-row{
    background: none !important;
    td{
        font-weight: bold;
    }
}
.pad-top td{
    padding-top: 15px !important;
}
</style>