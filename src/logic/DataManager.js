import DataBase from '../struct/DataBase';
import FileExtractor from '../struct/FileExtractor';
import Store from '../store';
const fs = req('fs');
const app = remote.app;

class DataManager{

    static async init(){
        const db_file = this.getDBFilename();
        console.log('db_file:', db_file);
        const exist = await FileExtractor.fileExist(db_file);
        console.log('exist:', exist);
        if(exist){
            await sleep(500);
            await this.connectDB(db_file);
            await this.handleVersions();
            window.beforeQuit = () => this.close();
            return true;
        }else{
            const timer = setInterval(() => {
                if(typeof window.setup == 'function'){
                    clearInterval(timer);
                    window.setup();
                }
            })
            return false;
        }
    }

    static async handleVersions(){
        let version = (await this.db.query('PRAGMA user_version'))[0].user_version;
        if(version == 0){
            await this.db.query("ALTER TABLE sale ADD COLUMN comment TEXT DEFAULT NULL");
            await this.db.query('PRAGMA user_version = 1');
            version == 1;
            console.log('Updated Database to version 1');
        }
        if(version < 2){
            await this.db.insert('setting', [
                {key: 'gmailUser', value_type: 2, value: ''},
                {key: 'gmailPass', value_type: 2, value: ''},
                {key: 'mailSendTo', value_type: 2, value: ''},
                {key: 'mailCC', value_type: 2, value: ''},
            ]);
            await this.db.query('PRAGMA user_version = 2');
            version == 2;
            console.log('Updated Database to version 2');
        }
        if(version < 3){
            await this.db.insert('setting', [
                {key: 'mailHeaderPrefix', value_type: 2, value: ''},
            ]);
            await this.db.query('PRAGMA user_version = 3');
            version == 3;
            console.log('Updated Database to version 3');
        }
    }

    static close(){
        console.log('Closing database...');
        this.db.close();
    }

    static async setup(dealerName){
        console.log('>prepareDBFile')
        const filename = await this.prepareDBFile();
        await sleep(500);
        console.log('>connectDB')
        await this.connectDB(filename);
        console.log('>update')
        await this.db.update('setting', {value: dealerName}, {key: 'dealerName'});
        return true;
    }

    static getPath(name){
        return app.getPath(name) + '\\';
    }

    static async getReportsFolderPath(){
        const path = this.getPath('desktop') + 'ADPOS - ' + Store.state.dealerName + '\\';
        await this.prepareFolder(path);
        return path;
    }

    static prepareFolder(path) {
        return new Promise((resolve, reject) => {
            fs.mkdir(path, function(err) {
                if (err) {
                    if (err.code == 'EEXIST') resolve(); // ignore the error if the folder already exists
                    else reject(err); // something else went wrong
                } else resolve(); // successfully created folder
            });
        })
    }

    static getBaseFolderPath(){
        return this.getPath('documents') + 'ADPOS\\';
    }

    static getDBFilename(){
        return this.getBaseFolderPath() + 'data.db';
    }

    static async prepareDBFile(){
        console.log('>prepareFolder')
        await this.prepareFolder(this.getBaseFolderPath());
        console.log('>getDBFilename')
        const filename = this.getDBFilename();
        console.log('>fileExist')
        if(! await FileExtractor.fileExist(filename)){
            console.log('>sleep')
            await sleep(500);
            console.log('>extract')
            await FileExtractor.extract('template.db', filename);
        }
        return filename;
    }

    static async connectDB(filename){
        this.db = new DataBase();
        await this.db.open(filename);
        window.db = this.db;
    }

    static insertInvoice(data){
        return this.db.insert('invoice', data);
    }

    static insertInvoiceItems(items){
        return this.db.insert('invoice_items', items);
    }

    static insertSales(items){
        return this.db.insert('sale', items);
    }

    static async getDailyInvoiceCount(){
        const date = utils.getDateAsInt();
        const dcs = await this.db.select('daily_invoice_count', {date});
        if(dcs.length){
            return dcs[0].count;
        }else{
            await this.db.insert('daily_invoice_count', {date, count: 0});
            return 0;
        }
    }

    static setDailyInvoiceCount(count){
        const date = utils.getDateAsInt();
        return this.db.update('daily_invoice_count', {count}, {date});
    }

}
window.DataManager = DataManager;
export default DataManager;