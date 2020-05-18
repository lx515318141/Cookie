{
    let view = {
        el: '#signUpForm',
        init(){
            this.$el = $(this.el)
        }
    };
    let model = {
        data: {},
        sign_in(data){
            return $.ajax({
                type: 'post',
                url: 'http://localhost:8888/sign_in',
                data: data
            })
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
                let hash = {}
                need.forEach((name) => {
                    let value = this.view.$el.find(`[name=${name}]`).val()
                    this.model.data[name] = value
                    hash[name] = this.view.$el.find(`[name=${name}]`).siblings('label').text()
                })
                console.log(hash)
                this.view.$el.find('.error').each((index, span) => {
                    $(span).text('')
                })
                for(let key in this.model.data){
                    if(this.model.data[key] === ''){
                        this.view.$el.find(`[name=${key}]`).siblings('.error').text(`${hash[key]}不能为空`)
                    }
                }
                if (this.model.data['email'] === '') {
                    this.view.$el.find(`[name="email"]`).siblings('.error').text('邮箱不能为空')
                    return
                }
                if (this.model.data['password'] === '') {
                    this.view.$el.find(`[name="password"]`).siblings('.error').text('密码不能为空')
                    return
                }
                this.model.sign_in(this.model.data)
                .then((response) => {
                    window.location.href = '/'
                }, (request) => {
                    alert('邮箱或密码错误')
                })
            })
            this.view.$el.on('click', 'button', (e)=>{
                console.log('1')
                window.location.href = '/sign_up'
            })
        }
    }
    controller.init(view, model)
}