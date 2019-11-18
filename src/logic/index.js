import Filters from './filters'
import DataAgent from './DataAgent';
import Invoice from './invoice';
import Settings from './Settings';

export default class Logic{

    static async init(Vue, Store){
        Vue.use(Filters)
        Vue.prototype.$dataAgent = DataAgent;
        const ready = await DataAgent.init(Store);
        if(!ready) return;
        Settings.init(Store);
        await Settings.load();
        Invoice.init(Store);
    }

}