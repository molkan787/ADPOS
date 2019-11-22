import PrintJS from 'print-js';

window.PrintJS = PrintJS;
export default class Invoice{

    static init(store){
        this.invoice = store.state.invoice;
    }

    static print(data, services, comment){
        return new Promise((resolve, reject) => {
            this.invoice.data = data;
            this.invoice.services = services;
            this.invoice.comment = comment;
            setTimeout(() => {
                try {
                    printJS({ printable: 'el-invoice', type: 'html', targetStyles: ['*']});
                    resolve();
                } catch (error) {
                    reject();
                }
            }, 100);
        })
    }

}
