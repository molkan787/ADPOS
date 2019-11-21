import DataManager from './DataManager';
import Utils from '../utils';
import Store from '../store';
const Excel = req('exceljs');

const names = [
    ['date', 'day', 'datetime'],
    ['invoice_no', 'invoiceno', 'invoice'],
    ['po'],
    ['stock'],
    ['wo'],
    ['vin'],
    ['make', 'dealer', 'brand'],
    ['model'],
    ['description', 'item', 'service'],
    ['price', 'cost'],
    ['comment', 'comments', 'note']
];

class DataImporter{

    static async importSales(filename, progressCB){
        const workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filename);
        const ws = this._findDataWorksheet(workbook);
        const map = this._detectColumnsMap(ws._rows[0]);
        await this._importItems(ws._rows, map, progressCB || (() => false));
    }

    static async _importItems(items, map, progressCB){
        const time = Utils.time();
        const taxes = Store.state.setting;
        let sales = [];
        let cino = '';
        const l = items.length - 1; // Substract 1, because of Header row;
        const ll = l + 1;
        for(let i = 0; i < ll; i++){
            const row = items[i + 1];
            const data = row ? this._extractData(row.values, map, taxes) : null;
            if(data){
                data.date_added = time;
                data.invoice_id = 0;
                data.item_no = data.invoice_no + '-' + (cino == data.invoice_no ? sales.length + 1 : 1);
            }
            if((i >= l || cino && cino != data.invoice_no)){
                const invoice_id = await this._genAndInsertInvoice(sales);
                sales.forEach(s => s.invoice_id = invoice_id);
                await DataManager.db.insert('sale', sales);
                sales = [];
            }
            progressCB(i / l * 100);
            if(i >= l) break;
            cino = data.invoice_no;
            sales.push(data);
        }
    }

    static async _genAndInsertInvoice(sales){
        const {data, items} = this._extractInvoiceDataFromSales(sales);
        const id = await DataManager.db.insert('invoice', data);
        for(let i = 0; i < items.length; i++){
            items[i].invoice_id = id;
        }
        await DataManager.insertInvoiceItems(items);
        return id;
    }

    static _extractData(values, map, taxes){
        const result = {};
        for(let i = 0; i < values.length; i++){
            const p = map[i];
            if(!p) continue;
            if(p == 'date'){
                result[p] = Utils.getDateString(values[i], true);
            }else if(p == 'price'){
                const v = parseFloat(values[i]);
                result.price = v;
                result.gst = v * taxes.gstRate;
                result.qst = v * taxes.qstRate;
                result.total = result.price + result.gst + result.qst;
            }else{
                result[p] = values[i];
            }
        }
        return result;
    }

    static _extractInvoiceDataFromSales(sales){
        const sale = sales[0];
        const data = Utils.copyObject(sale, ['date', 'wo', 'stock', 'vin', 'po', 'make', 'model', 'year', 'color', 'date_added']);
        data.no = sale.invoice_no;
        data.status = 1;
        data.added_by = Store.state.user.id;
        const items = [];
        const comments = [];
        let subtotal = 0;
        for(let i = 0; i < sales.length; i++){
            const s = sales[i];
            const item = Utils.copyObject(s, ['item_no', 'description', 'price'])
            item.service_no = 0;
            items.push(item);
            subtotal += parseFloat(s.price);
            if(s.comment) comments.push(s.comment);
        }
        if(comments.length){ // Joining all comments into one
            const comment = comments.join(' - ');
            for(let i = 0; i < sales.length; i++){
                sales[i].comment = comment;
            }
        }
        const gst = subtotal * Store.state.setting.gstRate;
        const qst = subtotal * Store.state.setting.qstRate;
        data.subtotal = subtotal;
        data.gst = gst;
        data.qst = qst;
        data.total = subtotal + gst + qst;
        data.gst_rate = Store.state.setting.gstRate;
        data.qst_rate = Store.state.setting.qstRate;
        return {
            data,
            items
        }
    }

    static _findDataWorksheet(wb){
        let result = null;
        wb.eachSheet(ws => {
            if(ws.name.toLowerCase().indexOf('sales') != -1){
                result = ws;
            }
        });
        return result;
    }

    static _detectColumnsMap(row){
        const map = {};
        const values = row.values;
        for(let i = 0; i < values.length; i++){
            let val = values[i];
            if(!val) continue;
            val = val.replace(/[^a-z]/gi, '');
            val = val.toLowerCase();
            for(let x = 0; x < names.length; x++){
                const r = names[x];
                if(r.includes(val)){
                    map[i] = r[0];
                    break;
                }
            }
        }
        return map;
    }

}
window.DataImporter = DataImporter;
export default DataImporter;