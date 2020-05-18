{
    let view = {
        el: '.wrapper',
        init(){
            this.$el = $(this.el)
        }
    };
    let model = {
        data: {},
        find(){}
    };
    let contriller = {
        init(view, model){
            this.view = view
            this.view.init()
            this.model = model
        }
    };
    contriller.init(view, model)
}