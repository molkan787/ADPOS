const xl = req('excel4node');
export default class XlBuilder{

    static get HEADINPUT_ALLINONE(){
        return 100;
    }
    static get HEADINPUT_TEXTONLY(){
        return 101;
    }

    constructor(worksheetName, options){
        this.workbook = new xl.Workbook({
            defaultFont: {
                size: 10
            },
            author: options && options.author || ''
        });
        this.styles = XlBuilder.initStyles(this.workbook);
        if(worksheetName) this.createWorksheet(worksheetName, options);
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

    createWorksheet(name, options){
        const { header } = (options || {})
        this.ws = this.workbook.addWorksheet(name, {
            headerFooter: {
                'evenHeader': header,
                'firstHeader': header,
                'oddHeader': header,
                'alignWithMargins': true,
                'differentFirst': true,
                'differentOddEven': true,
                'scaleWithDoc': true
            },
            printOptions: {
                printGridLines: true,
            },
            pageSetup: {
                orientation: 'landscape'
            },
            margins: {
                'bottom': 0.7519685, // Inches
                'footer': 0.2992126,
                'header': 0.2992126,
                'left': 0.18, // Narrow 0.2519685
                'right': 0.18,
                'top': 0.7519685
            },
        });
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

    head(data, mode, aligns){
        if(typeof mode == 'undefined') mode = XlBuilder.HEADINPUT_ALLINONE;
        const inc = mode == XlBuilder.HEADINPUT_ALLINONE ? 2 : 1;
        for(let i = 0; i < data.length; i += inc){
            if(mode == XlBuilder.HEADINPUT_ALLINONE){
                this.ws.column(this.c_col).setWidth(data[i + 1] * 4.5);   
            }
            const style = aligns[i / inc] == 'right' ? this.styles.headRightAlign : this.styles.head;
            this.str(data[i]).style(style);
        }
        this.nextRow();
    }

    addItems(items, cells, options){
        const { defaultValue, sums } = (options || {});
        const l = items.length;
        const start = this.c_row;
        const end = start + l - 1;
        for(let i = 0; i < l; i++){
            const t = items[i];
            for(let c of cells){
                this[c.f](t[c.p] || defaultValue);
            }
            this.nextRow();
        }
        if(sums){
            for(let sum of sums){
                const startCell = xl.getExcelCellRef(start, sum.col);
                const endCell = xl.getExcelCellRef( end, sum.col);
                this.ws.cell(end + 3, sum.col).formula(`SUM(${startCell}:${endCell})`)
                .style(this.styles[sum.style]);
                if(sum.prefix){
                    this.ws.cell(end + 3, sum.col - 1).string(sum.prefix)
                    .style(this.styles[sum.style]);
                }
            }
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
            font: {
                color: '000000',
                bold: true,
            },
            alignment: {
                // horizontal: 'center',
                shrinkToFit: true, 
                wrapText: true
            }
        });
        o.headRightAlign = wb.createStyle({
            font: {
                color: '000000',
                bold: true,
            },
            alignment: {
                horizontal: 'right',
                shrinkToFit: true, 
                wrapText: true
            }
        });
        o.rightAlign = wb.createStyle({
            alignment: {
                horizontal: 'right',
            }
        });
        o.priceBold = wb.createStyle({
            font: {
                bold: true,
            },
            alignment: {
                horizontal: 'right',
            },
            numberFormat: '$#,##0.00; - $#,##.00; -- ',
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