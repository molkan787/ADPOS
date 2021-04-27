import DataManager from './DataManager';
import xlBuilder from '../struct/xlBuilder'
import Utils from '../utils'
import Store from '../store';

class DataExporter{

    static async exportDailySales(_date){
        const date = _date ? Utils.getDateString(_date) : Utils.getDateString();
        const sales = await DataManager.db.select('sale', {
            date: {
                op: 'LIKE',
                val: date + '%'
            }
        });
        const canceledInvoices = await DataManager.db.select('invoice', {
            date: {
                op: 'LIKE',
                val: date + '%'
            },
            status: 3
        });
        console.log(sales)
        const items = this.mergeSalesAndCanceledInvoices(sales, canceledInvoices);
        const title = 'DAILY SALES - ' + date;
        const filename = (await DataManager.getReportsFolderPath()) + title + '.xlsx';
        await this.genSalesFile(items, {
            filename,
            worksheetName: 'SALES',
            header: title
        });
        return filename;
    }

    static async exportDateRangeSales(from, to){
        const dates = Utils.getDatesInRange(from, to).map(d => `'${d}'`).join(',');
        const sales = await DataManager.db.select('sale', {
            date: {
                escapeValue: false,
                custom: 'substr(date, 0, 11)',
                op: 'IN',
                val: `(${dates})`
            }
        });
        const canceledInvoices = await DataManager.db.select('invoice', {
            date: {
                escapeValue: false,
                custom: 'substr(date, 0, 11)',
                op: 'IN',
                val: `(${dates})`
            },
            status: 3
        });
        const items = this.mergeSalesAndCanceledInvoices(sales, canceledInvoices);
        console.log(items);
        const title = 'SALES - ' + from + ' - ' + to;
        const filename = (await DataManager.getReportsFolderPath()) + title + '.xlsx';
        await this.genSalesFile(items, {
            filename,
            worksheetName: 'SALES',
            header: title
        });
        return filename;
    }

    static mergeSalesAndCanceledInvoices(sales, invoices){
        const im = Utils.arrayToObjectMap(invoices, 'no');
        const items = [...sales];
        for(let i = sales.length - 1; i >= 0; i--){
            const { invoice_no: no } = sales[i];
            const inv = im[no];
            if(inv){
                delete im[no];
                const { wo, stock, vin, po, make, model, year, color, subtotal, gst, qst, total, date_modified } = inv;
                const cis = {
                    id: 1,
                    date: Utils.getDateString(date_modified, true),
                    invoice_no: no,
                    item_no: 'CANCELATION',
                    wo: wo,
                    stock: stock,
                    vin: vin,
                    po: po,
                    make: make,
                    model: model,
                    year: year,
                    color: color,
                    description: 'CANCELATION',
                    price: -subtotal,
                    gst: -gst,
                    qst: -qst,
                    total: -total,
                    comment: '',
                }
                items.splice(i + 1, 0, cis);
            }
        }
        return items;
    }

    static async genSalesFile(items, options){
        const { filename, worksheetName, header } = options;
        const b = new xlBuilder(worksheetName, {
            header: `&LTO: ${Store.state.dealerName} &C${header} &RFROM: AVANTI AUTO SPA&R\nTPS: 762219293 TVQ: 1223960291`,
            author: 'ADPOS - ' + Store.state.dealerName
        });
        b.head([
            'ID', 0.6,
            'DATE', 3.5,
            'INVOICE #', 2,
            'ITEM #', 1.8,
            'W.O', 1.8,
            'STOCK', 1.8,
            'VIN', 1.8,
            'P.O.', 1.8,
            'MAKE', 1.8,
            'MODEL', 1.8,
            'YEAR', 1.2,
            'COLOR', 1.8,
            'SERVICE', 4,
            'PRICE', 2,
            'GST', 1.8,
            'QST', 1.8,
            'TOTAL', 2,
            'COMMENT', 5
        ], xlBuilder.HEADINPUT_ALLINONE, { 13: 'right', 14: 'right', 15: 'right', 16: 'right' });

        b.addItems(items, [
            { f: 'num', p: 'id' },
            { f: 'str', p: 'date' },
            { f: 'str', p: 'invoice_no' },
            { f: 'str', p: 'item_no' },
            { f: 'str', p: 'wo' },
            { f: 'str', p: 'stock' },
            { f: 'str', p: 'vin' },
            { f: 'str', p: 'po' },
            { f: 'str', p: 'make' },
            { f: 'str', p: 'model' },
            { f: 'str', p: 'year' },
            { f: 'str', p: 'color' },
            { f: 'str', p: 'description' },
            { f: 'price', p: 'price' },
            { f: 'price', p: 'gst' },
            { f: 'price', p: 'qst' },
            { f: 'price', p: 'total' },
            { f: 'str', p: 'comment' },
        ], {
            defaultValue: '---',
            sums: [
                { col: 14, style: 'priceBold', prefix: 'Totals:' },
                { col: 15, style: 'priceBold' },
                { col: 16, style: 'priceBold' },
                { col: 17, style: 'priceBold' },
            ]
        });

        await b.writeFile(filename);
    }

}
window.DataExporter = DataExporter;
export default DataExporter;

console.log('DataExporter');