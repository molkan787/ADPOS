export default class Tests{

    static init(Logic, Store){
        this.logic = Logic;
        this.store = Store;
        this.state = Store.state;
        // =====================================
        // this.addDemoServices();

        const d = new Date();
        d.setDate(20);
        window.d = d;
    }

    static addDemoServices(){
        const services = [
            { service_no: 1, description: 'Delivery or Showroom', price: 43 },
            { service_no: 2, description: 'Quick Wash (in/out)', price: 18 },
            { service_no: 3, description: 'Quick Wash (out only)', price: 15 },
            { service_no: 4, description: 'Quick Wash (in only)', price: 13 },
            { service_no: 5, description: 'Used car reconditioning', price: 180 },
            { service_no: 6, description: 'Hand Wax (Full)', price: 60 },
            { service_no: 7, description: 'Compound', price: 125 },
            { service_no: 8, description: 'Glaze', price: 90 },
            { service_no: 9, description: 'Engine Wash', price: 35 },
            { service_no: 10, description: 'Floor Shampoo (carpet & floor) ', price: 25 },
            { service_no: 11, description: 'Interior Protection Fabric', price: 40 },
            { service_no: 12, description: 'Interior Protection Leather', price: 45 },
            { service_no: 13, description: 'Interior showroom - cleaning monthly', price: 250 },
            { service_no: 14, description: 'Cyrstal Nano ', price: 8 },
            { service_no: 15, description: 'Sap removal', price: 30 },
            { service_no: 16, description: 'Driver\'s-side floor shampoo', price: 20 },
            { service_no: 17, description: 'Degrease ', price: 25 },
            { service_no: 18, description: 'Scratch Removal (3 stage) per panel', price: 20 },
            { service_no: 19, description: 'Extra glue removal', price: 35 },
            { service_no: 20, description: 'Paint protection - ', price: 60 },
            { service_no: 21, description: 'Extra buff', price: 60 },
            { service_no: 22, description: 'Spa 90 - in out and wax', price: 75 },
            { service_no: 23, description: 'Spa 180 in out / wax / shampoo', price: 175 },
            { service_no: 24, description: 'Spa 360 / add buff to spa 180', price: 200 },
            { service_no: 25, description: 'Other item – specify', price: 0}
        ];
        for(let s of services){
            this.state.data.servicesMapped[s.service_no] = s;
        }
        this.state.data.services.push(...services);
    }

}