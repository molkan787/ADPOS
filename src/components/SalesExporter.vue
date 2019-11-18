<template>
    <v-dialog v-model="open" persistent max-width="360">
      <v-card>
        <v-card-title class="headline">Export Sales</v-card-title>
        <v-card-text>
            <v-radio-group v-model="rangeType" row >
                <v-radio label="Daily" value="daily"></v-radio>
                <v-radio label="Date range" value="date_range"></v-radio>
            </v-radio-group>
            <DateInput :disabled="rangeType == 'daily'" v-model="dateFrom" label="Date from" outlined dense hide-details />
            <DateInput :disabled="rangeType == 'daily'" v-model="dateTo"  label="Date to" outlined dense class="textbox" />
            <v-btn color="primary" elevation="1" class="fluid" @click="exportClick" :loading="loading">
                <v-icon>mdi-download</v-icon>
                Export
            </v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeClick" >Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import DataExporter from '../logic/DataExporter';
import DateInput from './Comps/DateInput';
import Utils from '../utils';

export default {
    components: {
        DateInput
    },
    data:() => ({
        open: false,
        loading: false,
        rangeType: 'daily',
        dateFrom: '',
        dateTo: ''
    }),
    methods: {
        closeClick(){
            this.open = false;
        },
        show(){
            this.rangeType = 'daily';
            const d = Utils.getDateString();
            this.dateFrom = d;
            this.dateTo = d;
            this.open = true;
        },
        async exportClick(){
            this.loading = true;
            let filename;
            if(this.rangeType == 'daily'){
                filename = await DataExporter.exportDailySales();
            }else{
                if(Utils.dateCompare(this.dateFrom, this.dateTo)){
                    alert('Please select a valid date range');
                    this.loading = false;
                    return;
                }
                filename = await DataExporter.exportDateRangeSales(this.dateFrom, this.dateTo);
            }
            this.loading = false;
            if(!filename){
                alert('No sales were found within the selected date range.', 'Sales')
                return;
            }
            if(await confirm('Sales were successfully exported!', 'Sales', {
                cancelButtonText: 'Close',
                okButtonText: 'Show File'
            })){
                Utils.revealFileInExplorer(filename);
            }
        }
    },
    created(){
        this.$router.registerModalPage('salesExporter', () => this.show());
    }
}
</script>

<style scoped>
.textbox{
    margin-top: 10px;
}
.fluid{
    width: 100%;
}
</style>