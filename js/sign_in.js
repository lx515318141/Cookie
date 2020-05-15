{
    let view = {
        el: '#signInForm',
        init(){
            this.$el = $(this.el)
        }
    };
    let model = {
        data: {},
        sign_in(){

        }
    };
    let controller = {
        init(view, model){
            this.view = view
            this.view.init()
            this.model = model
            this.bindEvent()
        },
        bindEvent(){
            this.view.$el.on('submit', (e)=>{
                e.preventDefault();
                let need = ['email', 'password']
                need.forEach((name) => {
                    let value = this.view.$el.find(`[name=${name}]`).val()
                    this.model.data[name] = value
                })
                this.view.$el.find('.error').each((index, span) => {
                    $(span).text('')
                })
                if (this.model.data['email'] === '') {
                    this.view.$el.find(`[name="email"]`).siblings('.error').text('邮箱不能为空')
                    return
                }
                if (this.model.data['password'] === '') {
                    this.view.$el.find(`[name="password"]`).siblings('.error').text('密码不能为空')
                    return
                }
                $.post('/sign_in', this.model.data).then((response) => {
                    window.location.href = '/'
                }, (request) => {
                    alert('邮箱或密码错误')
                })
            })
            this.view.$el.find('#sign_up').on('click', (e)=>{
                alart('1')
                window.location.href('http://127.0.0.1:8080/sign_up.html')
            })
        }
    }
    controller.init(view, model)
}