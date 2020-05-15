{
    let view = {
        el: "#signUpForm",
        init(){
            this.$el = $(this.el)
        }
    };
    let model = {
        data:{},
        sign_up(data){
            return $.ajax({
                type: 'post',
                url: 'http://localhost:8888/sign_up',
                data: data
            }).then((response) => {
                console.log(response)
                console.log(request)
                window.location.href('http://127.0.0.1:8080/sign_in.html')
            }).catch((request) => {
                console.log(request)
            })
        }
    };
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            this.view.init()
            this.bindEvent()
        },
        bindEvent(){
            this.view.$el.on('submit',(e) => {
                e.preventDefault();
                let hash = {}
                let need = ['email', 'username', 'password', 'password_confirmation', 'gender', 'spayed']
                need.forEach((name) => {
                    let value = this.view.$el.find(`[name=${name}]`).val()
                    this.model.data[name] = value
                    let value1 = this.view.$el.find(`[name=${name}]`).prev().prev().text()
                    hash[name] = value1
                })
                this.view.$el.find('.error').each((index, span) => {
                    $(span).text('')
                })
                for(let key in this.model.data){
                    if(this.model.data[key] === ''){
                        console.log(key)
                        if(key === 'email' || key === 'username' || key === 'password' ){
                            this.view.$el.find(`[name=${key}]`).siblings('.error').text(`${hash[key]}不能为空`)
                        }
                        if(key === 'password_confirmation'){
                            this.view.$el.find(`[name=${key}]`).siblings('.error').text(`请确认密码`)
                        }
                    }else if (this.model.data['password_confirmation'] !== this.model.data['password']) {
                            this.view.$el.find(`[name="password_confirmation"]`).siblings('.error').text('两次密码不一致')
                        }
                }
                this.model.sign_up(this.model.data)
                .then((response) => {
                        window.location.href('http://127.0.0.1:8080/sign_in.html')
                        console.log(response)
                    })
                // $.post('/sign_up', hash).then((response) => {
                //     window.location.href('/sign_in')
                // }, (request) => {
                //     if (request.responseText === 'email in use') {
                //         alert('邮箱已存在')
                //     }
                //     let { errors } = request.responseJSON
                //     if (errors.email && errors.email === 'invalid') {
                //         $form.find(`[name="email"]`).siblings('.error').text('邮箱格式错误')
                //     }
                // })
            })
        }
    }
    controller.init(view, model)
}
