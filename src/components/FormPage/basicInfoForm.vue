<template>
  <v-form v-model="valid">
    <v-card-title class="pa-0-b">Invoice</v-card-title>
    <v-container class="pa-0-t ma-0">
      <v-row>
        <v-col cols="12" md="4">
          <v-datetime-picker label="Date" v-model="data.date" :disabled="readonly"
          :textFieldProps="{dense: true, outlined: true, 'hide-details': true, readonly}"> </v-datetime-picker>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            dense
            readonly
            outlined
            hide-details
            v-model="data.no"
            label="Invoice No."
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-chip
            v-if="data.status == 3"
            class="ma-2 fh can-flag"
            color="red"
            outlined >
            <!-- <v-icon left>mdi-ban</v-icon> -->
            CANCELLED
          </v-chip>
            <!-- <v-btn class="fh" elevation="1" fluid>CLICK FOR NEW INVOICE</v-btn> -->
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
    valid: false,
    modal: false,
  })
};
</script>

<style lang="scss" scoped>
.can-flag{
      transform: translateY(-9px);
}
</style>