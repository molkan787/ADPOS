import ReportsMailer from './ReportsMailer';
import Utils from '../../utils';

export default class CronTasks{

    static init(){
        ReportsMailer.init(this);
    }

    static async start(){
        await sleep(10000);
        ReportsMailer.start();
    }

    static isDoneToday(name){
        const key = this.buildKey(name);
        return window.localStorage.getItem(key) == '1';
    }

    static markAsDoneToday(name){
        const key = this.buildKey(name);
        window.localStorage.setItem(key, '1');
    }

    static buildKey(taskName){
        return `taskState_${taskName}_${Utils.getDateAsInt()}`;
    }

}