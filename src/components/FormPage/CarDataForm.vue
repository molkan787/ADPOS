<template>
    <v-form v-model="valid">
      <v-card-title class="pa-0-b pa-0-t">Car informations</v-card-title>
      <v-container class="pa-0-t ma-0">
        <v-row dense class="pa-1">

          <v-col cols="15" class="pa-1px">
            <v-text-field :readonly="readonly" dense outlined hide-details v-model="data.wo" label="W.O" required></v-text-field>
          </v-col>
          <v-col cols="15" class="pa-1px">
            <v-text-field :readonly="readonly" dense outlined hide-details v-model="data.stock" label="STOCK" required></v-text-field>
          </v-col>

          <v-col cols="15" class="pa-1px">
            <v-text-field :readonly="readonly" dense outlined hide-details v-model="data.vin" label="VIN" required maxlength="6"></v-text-field>
          </v-col>
          <v-col cols="15" class="pa-1px">
            <v-text-field :readonly="readonly" dense outlined hide-details v-model="data.po" label="P.O" required></v-text-field>
          </v-col>
          
          <v-col cols="15" class="pa-1px">
            <v-text-field :readonly="readonly" dense outlined hide-details v-model="data.make" label="MAKE" required></v-text-field>
          </v-col>
          <v-col cols="15" class="pa-1px">
            <v-text-field :readonly="readonly" dense outlined hide-details v-model="data.model" label="MODEL" required></v-text-field>
          </v-col>
          
          <v-col cols="15" class="pa-1px">
            <v-text-field :readonly="readonly" dense outlined hide-details v-model="data.year" label="YEAR" required maxlength="4"></v-text-field>
          </v-col>
          <v-col cols="15" class="pa-1px">
            <v-text-field :readonly="readonly" dense outlined hide-details v-model="data.color" label="COLOR" required></v-text-field>
          </v-col>

        </v-row>
      </v-container>
    </v-form>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            required: true
        },
        readonly: {
          type: Boolean,
          default: false
        }
    },
    data: () => ({
      valid: false
    }),
    methods: {
      
    }
}
</script>