import DataManager from './DataManager';
import Utils from '../utils';

class ValueType{
    static get STRING() { return 2 }
    static get NUMBER() { return 1 }
}

export default class Settings{

    static init(Store){
        this.store = Store;
        this.data = Store.state.setting;        
    }

    static async load(){
        const items = await DataManager.db.select('setting');
        for(let item of items){
            const val = item.value_type == ValueType.NUMBER ? parseFloat(item.value) : item.value;
            this.data[item.key] = val;
            if(item.key == 'dealerName'){
                this.store.state.dealerName = val;
            }
        }
    }

    static async edit(data){
        Utils.patchObject(this.data, data);
        for(let key in data){
            if(data.hasOwnProperty(key)){
                await DataManager.db.update('setting', {value: data[key]},{key: key});
            }
        }
    }

}