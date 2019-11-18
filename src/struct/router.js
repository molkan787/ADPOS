export default class Router{
    
    static install(Vue, store){
        Vue.prototype.$router = this;
        Vue.prototype.$navigate = pn => this.navigate(pn);

        this.state = store.state.router;

        this.modalPages = {};
    }

    static navigate(pagename){
        this.state.page = pagename;
    }

    static openModalPage(name, params){
        const handler = this.modalPages[name];
        if(handler){
            handler(params);
        }
    }

    static registerModalPage(slug, handler){
        this.modalPages[slug] = handler;
    }

}