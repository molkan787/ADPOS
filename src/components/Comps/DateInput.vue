<template>
    <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="pvalue"
        transition="scale-transition"
        offset-y
        min-width="290px" >
        <template v-slot:activator="{ on }">
            <v-text-field
                v-model="pvalue"
                :label="label"
                :disabled="disabled"
                :outlined="outlined"
                :dense="dense"
                prepend-icon="event"
                readonly
                v-on="on"
            ></v-text-field>
        </template>
        <v-date-picker v-model="pvalue" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(pvalue)">OK</v-btn>
        </v-date-picker>
    </v-menu>
</template>

<script>
export default {
    props: {
        value: {
            type: String,
            default: '',
        },
        disabled: { type: Boolean, default: false },
        dense: { type: Boolean, default: false },
        outlined: { type: Boolean, default: false },
        label: { type: String, default: '' },
    },
    data:() => ({
        pvalue: '',
        menu: false,
    }),
    watch: {
        value(val){
            this.pvalue = val;
        },
        pvalue(val){
            this.$emit('input', val);
        }
    }
}
</script>