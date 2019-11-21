import DataManager from './DataManager';
import DataImporter from './DataImporter';

class DataMonitor{

    static init(Store){
        this.state = Store.state.dataMonitor;
    }

    static async start(){
        await sleep(2000);
        this.checkSalesWithoutInvoices();
    }

    static async checkSalesWithoutInvoices(){
        const sales = await DataManager.db.select('sale', { invoice_id: 0 });
        if(sales.length > 0){
            this.showNotif();
            await this.createInvoicesForSales(sales);
            console.log(`Data Correction: Created invoices from ${sales.length} sales.`);
            this.notifSuccess();
        }
    }

    static async createInvoicesForSales(sales){
        let sleepCount = 0;
        let items = [];
        let cino = '';
        const l = sales.length;
        const ll = l + 1;
        for(let i = 0; i < ll; i++){
            const s = sales[i];
            if((i >= l || (cino && cino != s.invoice_no)) && items.length > 0){
                const invoice_id = await DataImporter._genAndInsertInvoice(items);
                await this.patchSales(items, invoice_id);
                items = [];
            }
            this.progress(i / l);
            if(i >= l) break;
            cino = s.invoice_no;
            items.push(s);
            if(sleepCount == 10){
                sleepCount = 0;
                await sleep(100);
            }else{
                sleepCount++;
            }
        }
    }

    static patchSales(sales, invoice_id){
        const ids = sales.map(s => s.id).join(',');
        const filters = {
            id: {
                op: 'IN',
                val: `(${ids})`,
                escapeValue: false
            }
        }
        return DataManager.db.update('sale', {invoice_id}, filters);
    }

    // =================================================================

    static showNotif(){
        this.state.progress = 0;
        this.state.notifSuccess = false;
        this.state.notifOpen = true;
    }

    static notifSuccess(){
        this.state.notifSuccess = true;
        this.state.notifOpen = true;
        setTimeout(() => {
            this.state.notifOpen = false;
        }, 20000);
    }

    static progress(val){
        const p = Math.round(val * 100);
        if(p != this._pp){
            this._pp = p;
            this.state.progress = Math.round(val * 100);
        }
    }

}
window.DataMonitor = DataMonitor;
export default DataMonitor;