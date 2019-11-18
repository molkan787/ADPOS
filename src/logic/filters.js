import Settings from '@/settings';

export default class Filters{

    static install(Vue){
        Vue.filter('price', val => this.price(val))
    }

    static price(value){
        if(typeof value == 'string' && value.charAt(0) == '$') value = value.substr(1);
        let val = parseFloat(value);
        if(isNaN(val)) return '';
        const neg = val < 0;
        if(neg) val *= -1;
        return (neg ? '- ' : '') + Settings.currentSymbol + val.toFixed(2);
    }

}