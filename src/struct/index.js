import Router from './router';

export default class Struct{

    static init(Vue, Store){
        Vue.use(Router, Store);
    }

}