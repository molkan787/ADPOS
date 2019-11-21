import DataManager from './DataManager';
import xlBuilder from '../struct/xlBuilder'
import Utils from '../utils'
import Store from '../store';

class DataExporter{

    static async exportDailySales(){
        const date = Utils.getDateString();
        const sales = await DataManager.db.select('sale', {
            date: {
                op: 'LIKE',
                val: date + '%'
            }
        });
        if(sales.length == 0){ return null }
        const title = 'DAILY SALES - ' + date;
        const filename = (await DataManager.getReportsFolderPath()) + title + '.xlsx';
        await this.genSalesFile(sales, {
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
        if(sales.length == 0){ return null }
        const title = 'SALES - ' + from + ' - ' + to;
        const filename = (await DataManager.getReportsFolderPath()) + title + '.xlsx';
        await this.genSalesFile(sales, {
            filename,
            worksheetName: 'SALES',
            header: title
        });
        return filename;
    }

    static async genSalesFile(items, options){
        const { filename, worksheetName, header } = options;
        const sps = ' '.repeat(60);
        const b = new xlBuilder(worksheetName, {
            header: `TO: ${Store.state.dealerName} ${sps} ${header} ${sps} FROM: AVANTI AUTO SPA`,
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