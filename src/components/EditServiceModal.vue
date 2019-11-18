<template>
    <v-dialog v-model="open" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">{{ title }}</v-card-title>
        <hr>
        <v-card-text>
            <v-text-field :readonly="loading" v-model="form.description" label="Service Name" placeholder="Name" class="input" dense outlined hide-details/>
            <v-text-field :readonly="loading" v-model="form.price" label="Service Price" placeholder="Price" type="number" class="input" dense outlined/>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="cancelClick" :disabled="loading" >Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveClick" :loading="loading" >Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import DataAgent from '../logic/DataAgent';

export default {
    data:() => ({
        open: false,
        loading: false,
        title: 'Add new Service',
        form: {
            description: '',
            price: ''
        },
        data: {service_no: 'new'}
    }),
    methods: {
        cancelClick(){ this.open = false },
        async saveClick(){
            if(this.form.description.length < 1){
                alert('Service description is required.');
                return;
            }
            this.loading = true;
            await this.save();
            this.loading = false;
            await alert('Changes were successfully saved!');
            this.open = false;
        },

        save(){
            const data = {
                description: this.form.description,
                price: parseFloat(this.form.price || 0)
            };
            return DataAgent.editService(this.data.service_no, data);
        },

        show(data){
            this.title = data.service_no == 'new' ? 'Add new Service' : 'Edit service # ' + data.service_no;
            this.data = data;
            this.form.description = data.description;
            this.form.price = data.price;
            this.open = true;
        }
    },

    created(){
        window.editService = data => this.show(data);
    }
}
</script>

<style scoped>
.input{
    margin-top: 10px;
}
hr{
    margin-bottom: 30px;
}
</style>