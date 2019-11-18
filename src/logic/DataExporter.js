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
        const filename = (await DataManager.getReportsFolderPath()) + 'DAILY SALES - ' + date + '.xlsx';
        await this.genSalesFile(sales, {
            filename,
            worksheetName: `${Store.state.dealerName} - SALES (${date})`
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
        const filename = (await DataManager.getReportsFolderPath()) + 'SALES - ' + from + ' - ' + to + '.xlsx';
        await this.genSalesFile(sales, {
            filename,
            worksheetName: `${Store.state.dealerName} - SALES`
        });
        return filename;
    }

    static async genSalesFile(items, options){
        const { filename, worksheetName } = options;
        const b = new xlBuilder(worksheetName);
        b.head(['', 'Dealer: ' + Store.state.dealerName, 'from ', 'AVANTI AUTOSPA', ...(' '.repeat(12).split(' '))], xlBuilder.HEADINPUT_TEXTONLY);
        b.head(' '.repeat(16).split(' '), xlBuilder.HEADINPUT_TEXTONLY);
        b.head([
            'ID', 1,
            'DATE', 3,
            'INVOICE #', 2,
            'ITEM #', 2,
            'W.O', 2,
            'STOCK', 2,
            'VIN', 2,
            'P.O.', 2,
            'MAKE', 2,
            'MODEL', 2,
            'YEAR', 2,
            'COLOR', 2,
            'SERVICE', 4,
            'PRICE', 2,
            'GST', 2,
            'QST', 2,
            'TOTAL', 2
        ], xlBuilder.HEADINPUT_ALLINONE);

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
        ]);

        await b.writeFile(filename);
    }

}
window.DataExporter = DataExporter;
export default DataExporter;