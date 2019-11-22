<template>
    <div style="width:1000px; height: 50%">
        <div :style="s.top" style="width:100%">
            <table :style="s.info">
                <tr>
                    <td>
                        AVANTI AUTOSPA<br>
                        3540 BOUL. DES SOURCES<br>
                        DDO, QC H9B 1Z9<br>
                        GST # 762219293  QST # 1223960291
                    </td>
                    <td style="float: right">
                        <table style="white-space: nowrap">
                            <tr>
                                <td>BILL TO: </td>
                                <td>{{ setting.billCompany }}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>{{ setting.billAddress1 }}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>{{ setting.billAddress2 }}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>-</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <table :style="s.header">
                <colgroup>
                    <col width="33%">
                    <col width="34%">
                    <col width="33%">
                </colgroup>
                <tr>
                    <td></td>
                    <td :style="s.title">INVOICE {{ data.status == 3 ? ' ( CANCELLED )' : '' }}</td>
                    <td></td>
                </tr>
                <tr>
                    <td style="text-align: left">DATE: {{ data.date }}</td>
                    <td>{{ copyName }}</td>
                    <td style="text-align: right">INVOICE # {{ data.no }}</td>
                </tr>
            </table>

            <table :style="s.table">
                <tr>
                    <td :style="s.cell">W.O</td>
                    <td :style="s.cell">STOCK</td>
                    <td :style="s.cell">VIN</td>
                    <td :style="s.cell">P.O</td>
                    <td :style="s.cell">MAKE</td>
                    <td :style="s.cell">MODEL</td>
                    <td :style="s.cell">YEAR</td>
                    <td :style="s.cell">COLOR</td>
                </tr>
                <tr>
                    <td :style="s.boldCell">{{ data.wo || '---' }}</td>
                    <td :style="s.boldCell">{{ data.stock || '---' }}</td>
                    <td :style="s.boldCell">{{ data.vin || '---' }}</td>
                    <td :style="s.boldCell">{{ data.po || '---' }}</td>
                    <td :style="s.cell">{{ data.make || '---' }}</td>
                    <td :style="s.cell">{{ data.model || '---' }}</td>
                    <td :style="s.cell">{{ data.year || '---' }}</td>
                    <td :style="s.cell">{{ data.color || '---' }}</td>
                </tr>
            </table>

            <table :style="s.table2">
                <colgroup>
                    <col width="20%">
                    <col width="20%">
                    <col width="50%">
                    <col width="10%">
                </colgroup>
                <tr>
                    <td :style="s.boldCell" style="text-align: center">PRODUCT CODE</td>
                    <td :style="s.boldCell" style="text-align: center">Item Invoice ID</td>
                    <td :style="s.boldCell" style="text-align: center">SERVICE DESCRIPTION</td>
                    <td :style="s.boldCell" style="text-align: center">PRICE</td>
                </tr>
                <tr v-for="(item, index) in items" :key="index">
                    <td :style="getCellStyle(index)">{{ item.service_no }}</td>
                    <td :style="getCellStyle(index)">{{ item.item_no }}</td>
                    <td :style="getCellStyle(index)">{{ item.description }}</td>
                    <td :style="getCellStyle(index)" style="text-align: right">{{ item.price | price }}</td>
                </tr>

                <tr>
                    <td></td> <td></td>
                    <td :style="s.totalsLeftCellFirstRow" style="text-align: left;">Total before taxes</td>
                    <td :style="s.totalsCellFirstRow" style="text-align: right;">{{ data.subtotal | price }}</td>
                </tr>
                <tr>
                    <td></td> <td></td>
                    <td :style="s.totalsLeftCell" style="text-align: left">GST {{ _gstRate }}</td>
                    <td :style="s.totalsCell" style="text-align: right">{{ data.gst | price }}</td>
                </tr>
                <tr>
                    <td>Comment:</td> <td></td>
                    <td :style="s.totalsLeftCell" style="text-align: left">QST {{ _qstRate }}</td>
                    <td :style="s.totalsCell" style="text-align: right">{{ data.qst | price }}</td>
                </tr>
                <tr>
                    <td colspan="2">{{ comment || '---' }}</td>
                    <td :style="s.totalsLeftCellLastRow" style="text-align: left">TOTAL WITH TAXES</td>
                    <td :style="s.totalsCellLastRow" style="text-align: right">{{ data.total | price }}</td>
                </tr>

            </table>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Utils from '../utils'

export default {
    props: {
        ownerCopy: {
            type: Boolean,
            default: false,
        }
    },
    computed: {
        ...mapState({
            data: state => state.invoice.data,
            items: state => state.invoice.services,
            comment: state => state.invoice.comment,
            setting: state => state.setting
        }),
        _gstRate(){ return Utils.round(this.data.gst_rate * 100, 4) + '%' },
        _qstRate(){ return Utils.round(this.data.qst_rate * 100, 4) + '%' },
        copyName(){ return this.ownerCopy ? 'AVANTI COPY': 'DEALER COPY' }
    },
    data:() => ({
        s: {
            top: {
                'font-size': '11px'
            },
            info: {
                width: '100%',
                'font-size': '10px'
            },
            header:{
                width: '100%',
                'text-align': 'center',
                'font-weight': 'bold'
            },
            title: {
                'font-size': '12px',
                padding: '10px'
            },
            table: {
                width: '100%',
                'margin-top': '2px',
                'border-collapse': 'collapse'
            },
            table2: {
                width: '100%',
                'margin-top': '10px',
                'border-collapse': 'collapse'
            },
            boldCell:{
                border: '1px solid #333',
                padding: '2px 8px 2px 8px',
                'font-weight': 'bold'
            },
            cell:{
                border: '1px solid #333',
                padding: '2px 8px 2px 8px'
            },
            denseCell:{
                border: '1px solid #333',
                padding: '2px 8px 2px 8px'
            },
            bgCell:{
                border: '1px solid #333',
                padding: '2px 8px 2px 8px',
                'background-color': '#eee'
            },
            totalsCell: {
                padding: '2px 8px 0 8px'
            },
            totalsCellFirstRow: {
                padding: '6px 8px 0 8px'
            },
            totalsCellLastRow: {
                padding: '2px 8px 0 8px',
                'font-weight': 'bold'
            },
            totalsLeftCell: {
                padding: '2px 8px 0 150px'
            },
            totalsLeftCellFirstRow: {
                padding: '6px 8px 0 150px'
            },
            totalsLeftCellLastRow: {
                padding: '2px 8px 0 150px',
                'font-weight': 'bold'
            },
        }
    }),
    methods: {
        getCellStyle(index){
            return (index % 2 == 0) ? this.s.bgCell : this.s.denseCell;
        }
    }
}
</script>
