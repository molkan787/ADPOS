String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

window.sleep = t => new Promise(r => setTimeout(() => r(), t));

export default class Utils {

    static get DECIMAL_10(){ return 10 }
    static get DECIMAL_5(){ return 5 }

    static parsePrice(value){
        if(typeof value == 'string'){
            if(value.charAt(0) == '$')
                value = value.substr(1);
            else if(value.substr(0, 3) == '- $')
                value = '-' + value.substr(3);
        }
        return parseFloat(value);
    }

    static encodeFloat(val, decimals){
        return Math.floor(val * Math.pow(10, decimals || this.DECIMAL_5));
    }

    static decodeFloat(val, decimals){
        return val / Math.pow(10, decimals || this.DECIMAL_5);
    }

    static time(){
        return Math.floor(new Date().getTime() / 1000);
    }

    static getHours(){
        return new Date().getHours();
    }

    static getDateAsInt(){
        const d = new Date();
        let date = d.getFullYear() * 10000;
        date += (d.getMonth() + 1) * 100;
        date += d.getDate();
        return date;
    }

    static getDateString(source, includeTime){
        if(typeof source == 'boolean' && source){
            source = null;
            includeTime = true;
        }
        const _source = typeof source == 'number' ? (source * 1000) : (source || null);
        const d = _source ? new Date(_source) : new Date();
        let date = d.getFullYear() + '-';
        date += ('0' + (d.getMonth() + 1)).substr(-2) + '-';
        date += ('0' + d.getDate()).substr(-2);
        if(includeTime){
            date += ' ' + ('0' + d.getHours()).substr(-2);
            date += ':' + ('0' + d.getMinutes()).substr(-2);
        }
        return date;
    }

    static getDatesInRange(from, to){
        if(this.dateCompare(from, to)) return null; // If ending date is greater than starting date return NULL
        const f = this.dateStrToObject(from);
        const t = this.dateStrToObject(to);
        const result = [];
        while(true){
            const d = f.year + '-' + ('0' + f.month).substr(-2) + '-' + ('0' + f.day).substr(-2);
            result.push(d);
            f.day++;
            if(f.day > 31){
                f.day = 1;
                f.month++;
            }
            if(f.month > 12){
                f.month = 1;
                f.year++;
            }
            if(f.year >= t.year && f.month >= t.month && f.day > t.day){
                break;
            }
        }
        return result;
    }

    static dateCompare(d1, d2){
        return (new Date(d1).getTime()) > (new Date(d2).getTime());
    }

    static dateStrToObject(str){
        const d = str.split('-');
        return {
            year: parseInt(d[0]),
            month: parseInt(d[1]),
            day: parseInt(d[2])
        }
    }

    static copyObject(obj, props){
        const o = {};
        for(let i = 0; i < props.length; i++){
            const p = props[i];
            o[p] = obj[p];
        }
        return o;
    }

    static checkProps(obj, props){
        for(let i = 0; i < props.length; i++){
            const p = props[i];
            if(!obj[p]) return false;
        }
        return true;
    }

    static patchObject(target, source){
        for(let p in source){
            if(source.hasOwnProperty(p)){
                target[p] = source[p];
            }
        }
    }

    static round(num, decimals){
        const f = Math.pow(10, decimals);
        return Math.round(num * f) / f;
    }

    static revealFileInExplorer(filename){
        const shell = req('electron').remote.shell;
        shell.showItemInFolder(filename);
    }

    static isDigitOnly(str){
        return /^\d+$/.test(str);
    }

}
window.utils = Utils;