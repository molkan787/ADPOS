<template>
    <v-dialog v-model="open" persistent max-width="360">
      <v-card>
        <v-card-title class="headline">Import Sales</v-card-title>
        <v-card-text>
            <v-file-input :disabled="loading" v-model="file" label="Excel file" type="file" outlined dense hide-details />
            <v-progress-linear :value="progress" class="pb" :style="{opacity: loading ? 1 : 0}"></v-progress-linear>
            <v-btn color="primary" elevation="1" class="fluid" @click="importClick" :loading="loading">
                <v-icon class="fliped">mdi-download</v-icon>
                Import
            </v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeClick" :disabled="loading" >Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import DataImporter from '../logic/DataImporter';
import DateInput from './Comps/DateInput';
import Utils from '../utils';

export default {
    components: {
        DateInput
    },
    data:() => ({
        open: false,
        loading: false,
        progress: 0,
        file: null,
    }),
    methods: {
        closeClick(){
            this.open = false;
        },
        show(){
            this.file = null;
            this.open = true;
        },
        validateData(){
            if(!this.file || this.file.path.substr(-5) != '.xlsx'){
                alert('Please select an excel file to import sales', 'Data Import');
                return false;
            }
            return true;
        },
        async importClick(){
            if(this.validateData()){
                this.progress = 0;
                this.loading = true;
                const filename = this.file.path;
                try {
                    await DataImporter.importSales(filename, p => this.progress = Math.round(p));
                    alert('Sales was successfully imported!', 'Data Import');
                    this.file = null;
                } catch (error) {
                    console.error(error);
                    alert('An error occued.', 'Error');
                }
                this.loading = false;
            }
        }
    },
    created(){
        this.$router.registerModalPage('salesImporter', () => this.show());
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
.pb{
    margin: 10px 0 10px 0;
}
</style>