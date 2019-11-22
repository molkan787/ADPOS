import Filters from './filters'
import DataAgent from './DataAgent';
import Invoice from './invoice';
import Settings from './Settings';
import CronTasks from './CronTasks';

export default class Logic{

    static async init(Vue, Store){
        Vue.use(Filters)
        Vue.prototype.$dataAgent = DataAgent;
        CronTasks.init();
        const ready = await DataAgent.init(Store);
        if(!ready) return;
        Settings.init(Store);
        await Settings.load();
        CronTasks.start();
        Invoice.init(Store);
    }

}