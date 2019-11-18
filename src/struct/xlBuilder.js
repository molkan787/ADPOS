const xl = req('excel4node');
export default class XlBuilder{

    static get HEADINPUT_ALLINONE(){
        return 100;
    }
    static get HEADINPUT_TEXTONLY(){
        return 101;
    }

    constructor(worksheetName){
        this.workbook = new xl.Workbook();
        this.styles = XlBuilder.initStyles(this.workbook);
        if(worksheetName) this.createWorksheet(worksheetName);
        this.c_row = 1;
        this.c_col = 1;
    }

    writeFile(filename){
        return new Promise((resolve, reject) => {
            this.workbook.write(filename, err => {
                if(err){
                    reject(err);
                }else{
                    resolve(filename);
                }
            });
        });
    }

    createWorksheet(name){
        this.ws = this.workbook.addWorksheet(name);
    }

    setWS(ws){
        this.ws = ws;
    }
    setRow(row){
        this.c_row = row;
    }
    nextRow(){
        this.c_row++;
        this.resetCol();
    }
    resetCol(){
        this.c_col = 1;
    }
    nextCol(){
        this.c_col++;
    }

    head(data, mode){
        if(typeof mode == 'undefined') mode = XlBuilder.HEADINPUT_ALLINONE;
        const inc = mode == XlBuilder.HEADINPUT_ALLINONE ? 2 : 1;
        for(let i = 0; i < data.length; i += inc){
            if(mode == XlBuilder.HEADINPUT_ALLINONE){
                this.ws.column(this.c_col).setWidth(data[i + 1] * 6);   
            }
            this.str(data[i]).style(this.styles.head);
        }
        this.nextRow();
    }

    addItems(items, cells){
        const l = items.length;
        for(let i = 0; i < l; i++){
            const t = items[i];
            for(let c of cells){
                this[c.f](t[c.p]);
            }
            this.nextRow();
        }
    }

    num(val){
        return this.ws.cell(this.c_row, this.c_col++).number(val);
    }
    str(val){
        return this.ws.cell(this.c_row, this.c_col++).string(val);
    }
    price(val){
        return this.ws.cell(this.c_row, this.c_col++).number(parseFloat(val)).style(this.styles.price);
    }
    price_m(val){
        return this.ws.cell(this.c_row, this.c_col++).number(parseFloat(val) / 100).style(this.styles.price);
    }
    percent(val){
        return this.ws.cell(this.c_row, this.c_col++).number(val).style(this.styles.percent);
    }
    strArr(val){
        let str = '';
        for(let i = 0; i < val.length; i++){
            if(str) str += "\n";
            str += '- ' + val[i];
        }
        return this.ws.cell(this.c_row, this.c_col++).string(str);
    }

    static initStyles(wb){
        const o = {};
        o.head = wb.createStyle({
            fill: {
                type: 'pattern',
                patternType: 'darkUp',
                fgColor: '000000',
                bgColor: '000000',
            },
            font: {
                color: 'ffffff',
                bold: true,
            },
            alignment: {
                horizontal: 'center',
                shrinkToFit: true, 
                wrapText: true
            }
        });
        o.price = wb.createStyle({
            alignment: {
                horizontal: 'right',
            },
            numberFormat: '$#,##0.00; - $#,##.00; -- ',
        });
        o.pricePositiveSign = wb.createStyle({
            alignment: {
                horizontal: 'right',
            },
            numberFormat: '+ $#,##0.00; - $#,##.00; -- ',
        });
        o.percent = wb.createStyle({
            alignment: {
                horizontal: 'right',
            },
            numberFormat: '#%; -#%; -',
        });
        return o;
    }

}