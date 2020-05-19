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
            this.bindEvent()
        },
        bindEvent(){
            this.view.$el.on('click', 'button', (e) => {
                window.location.href = '/sign_in'
            })
        }
    };
    contriller.init(view, model)
}