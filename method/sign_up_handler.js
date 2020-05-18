let baseMethod = require('./baseMethod.js')
var fs = require("fs");

module.exports = {
    handler:function(request, response){
        baseMethod.readBody(request).then(body => {
            let strings = body.split("&");
            // 以&符合将body分割成多个数组及['email=1', 'password=2','password_confirmation']
            let hash = {};
            strings.forEach(strings => {
              let parts = strings.split("=");
              let key = parts[0];
              let value = parts[1];
              hash[key] = decodeURIComponent(value);
              // url里面不能有@，如果有要用%40代替，所有为了判断邮箱里是否有@，需要使用上面的这个API把%40转换成@
            });
            let { email, username, password, password_confirmation, gender, spayed } = hash;
            // 声明六个变量，将hash中与这六个变量名相同的key的value值赋给这六个变量
            if (email.indexOf("@") === -1) {
              response.statusCode = 400;
              response.setHeader("Content-Type", "application/json;charset=utf-8");
              // 加了application/json这个响应头之后，response里会出现一个responseJSON的属性，内容是将下面的JSON变成正常的js对象
              response.write(`{
                "errors": {
                  "email": "invalid"
                }
              }`);
            } else if (password !== password_confirmation) {
              response.statusCode = 400;
              response.write("password not macth");
            } else {
              let users = fs.readFileSync("./db/users", "utf8");
              try {
                users = JSON.parse(users);
              } catch (exception) {
                users = [];
              }   // 疑问
              let inUse = false;
              for (let i = 0; i < users.length; i++) {
                let user = users[i];
                if (user.email === email) {
                  inUse = true;
                  break;
                }
              }
              if (inUse) {
                response.statusCode = 400;
                response.write("email in use");
              } else {
                users.push({ email: email, username: username, password: password, gender: gender, spayed: spayed });
                var usersString = JSON.stringify(users);
                fs.writeFileSync("./db/users", usersString);
                response.statusCode = 200;
              }
            }
            response.end();
          });
    }
}