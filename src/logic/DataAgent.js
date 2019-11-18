import DataManager from './DataManager';
import Filters from './filters';
import Utils from '../utils';
import md5 from 'md5';

export default class DataAgent{

    static init(Store){
        this.afterInitCallbacks = [];
        this.store = Store;
        this.state = Store.state;
        this.data = Store.state.data;

        return DataManager.init();
        // this.initialeLoad();
    }

    static async initialeLoad(){
        const invoiceCount = await DataManager.getDailyInvoiceCount();
        this.state.invoiceCount = invoiceCount;
        await this.loadServices();
        for(let cb of this.afterInitCallbacks){
            cb();
        }
    }

    static registerForAfterInit(cb){
        this.afterInitCallbacks.push(cb);
    }

    static async loadServices(){
        const services = await DataManager.db.select('service');
        this.data.services = services;
        for(let s of services){
            this.data.servicesMapped[s.service_no] = s;
        }
    }

    static getService(no){
        return this.data.servicesMapped[no] || null;
    }

    static async editService(service_no, data){
        if(service_no == 'new'){
            const id = await DataManager.db.insert('service', data);
            data.service_no = id;
            this.data.servicesMapped[id] = data;
            this.data.services.push(data);
        }else{
            await DataManager.db.update('service', data, {service_no});
            const s = this.data.servicesMapped[service_no];
            s.description = data.description;
            s.price = data.price;
        }
    }

    static async submitInvoice(data, services){
        Object.keys(data).map(function(key) {
            const val = data[key];
            if(typeof val == 'string'){
                data[key] = val.toUpperCase();
            }
        });
        const time = Utils.time();
        data.added_by = this.state.user.id;
        data.gst_rate = this.state.setting.gstRate;
        data.qst_rate = this.state.setting.qstRate;
        data.date_added = time;
        data.date_modified = time;

        const invID = await DataManager.insertInvoice(data, services);
        const sharedData = {
            ...Utils.copyObject(data, ['date', 'wo', 'stock', 'vin', 'po', 'make', 'model', 'year', 'color', 'date_added']),
            invoice_id: invID,
            invoice_no: data.no,
        };
        const itemNoPrefix = data.no + '-';
        const sales = [];
        const items = [];
        for(let i = 0; i < services.length; i++){
            const s = services[i];
            if(s.description) s.description = s.description.toUpperCase();
            const item = {
                ...s,
                invoice_id: invID,
                item_no: itemNoPrefix + (i + 1)
            };
            items.push(item);
            const gst = s.price * this.state.setting.gstRate;
            const qst = s.price * this.state.setting.qstRate;
            const total = s.price + gst + qst;
            const sale = {
                ...sharedData,
                ...s,
                item_no: itemNoPrefix + (i + 1),
                gst,
                qst,
                total
            };
            sales.push(sale);
        }
        await DataManager.insertInvoiceItems(items);
        await DataManager.insertSales(sales);

        this.state.invoiceCount++;
        await DataManager.setDailyInvoiceCount(this.state.invoiceCount);
        return {
            data,
            services: items
        }
    }

    static async cancelInvoice(invoice_id){
        await DataManager.db.update('invoice', {status: 3}, {id: invoice_id});
        await DataManager.db.delete('sale', {invoice_id});
    }

    static getDailySales(){
        return this.getSales({
            date: {
              op: 'LIKE',
              val: Utils.getDateString() + '%'
            }
        });
    }

    static async getSales(filters){
        const items = await DataManager.db.select('sale', filters, {desc: 'id'});
        items.forEach(i => {
            i.gst = Filters.price(i.gst, 2);
            i.qst = Filters.price(i.qst);
            i.price = Filters.price(i.price);
            i.total = Filters.price(i.total);
        });
        return items;
    }

    static async getInvoices(){
        const items = await DataManager.db.select('invoice', null, {desc: 'id'});
        items.forEach(i => {
            i.gst = Filters.price(i.gst, 2);
            i.qst = Filters.price(i.qst);
            i.subtotal = Filters.price(i.subtotal);
            i.total = Filters.price(i.total);
        });
        return items;
    }

    static getInvoiceItems(invoice_id){
        return DataManager.db.select('invoice_items', {invoice_id});
    }

    static async login(username, password){
        const user = await DataManager.db.findOne('user', { username });
        this.store.state.user = user;
        if(user){
            if(user.password == md5(password)){
                return true;
            }else{
                throw 'WRONG_PASSWORD';
            }
        }else{
            throw 'NO_USER';
        }
    }

    static getUsers(){
        return DataManager.db.select('user');
    }

    static changeUserPassword(userId, password){
        password = md5(password);
        return DataManager.db.update('user', {password}, {id: userId});
    }

    static async editUser(userId, data){
        data.password = md5(data.password);
        data.status = 1;
        data.utype = 2;
        data.date_added = Utils.time();
        if(userId == 'new'){
            const id = await DataManager.db.insert('user', data);
            data.id = id;
            this.data.users.push(data);
        }else{
            // Updating existing user... TODO
        }
    }

}