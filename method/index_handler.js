var fs = require("fs");

module.exports = {
    handler: function(request, response, sessions){
        let string = fs.readFileSync("./index.html", "utf8");
    let cookies = "";
    
    if (request.headers.cookie) {
      cookies = request.headers.cookie.split("; ");
    }
    let hash = {};
    for (let i = 0; i < cookies.length; i++) {
      let parts = cookies[i].split("=");
      let key = parts[0];
      let value = parts[1];
      hash[key] = value;
    }
    let mySession = sessions[hash.sessionId];
    let email;
    if (mySession) {
      email = mySession.sign_in_email;
    }
    // 上面这段话是重点
    let users = fs.readFileSync("./db/users", "utf8");
    users = JSON.parse(users);
    let foundUser;
    for (let i = 0; i < users.length; i++) {
      if (users[i].email === email) {
        foundUser = users[i];
        break;
      }
    }
    if (foundUser) {
      for(let key in foundUser){
        string = string.replace(`__${key}__`, foundUser[key]);
      }
    } else {
      string = string.replace("__password__", "不知道");
      console.log(string)
    }
    response.statusCode = 200;
    // 相应的第一部分
    response.setHeader("Content-Type", "text/html;charset=utf-8");
    // 相应的第二部分
    response.write(string);
    // 相应的第四部分
    response.end();
    // 相应结束
    }
}