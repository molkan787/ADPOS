import DataManager from './DataManager';
import Utils from '../utils';
import Store from '../store';
const Excel = req('exceljs');

const names = [
    ['date', 'day'],
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
        const itemsNoMap = {};
        const l = items.length - 1;
        const db = DataManager.db;
        for(let i = 0; i < l; i++){
            const data = this._extractData(items[i + 1].values, map, taxes);
            data.date_added = time;
            data.invoice_id = 0;
            const ino = data.invoice_no;
            if(itemsNoMap[ino]) itemsNoMap[ino]++;
            else itemsNoMap[ino] = 1;
            data.item_no = ino + '-' + itemsNoMap[ino];
            await db.insert('sale', data);
            progressCB(i / l * 100);
            // if(i == 10) break;
        }
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