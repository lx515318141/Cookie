var http = require("http");
var fs = require("fs");
var url = require("url");
var port = process.argv[2];

if (!port) {
  console.log("请指定端口号好不啦？\nnode server.js 8888 这样不会吗？");
  process.exit(1);
}

let sessions = {};

var server = http.createServer(function(request, response) {
  var parsedUrl = url.parse(request.url, true);
  var pathWithQuery = request.url;
  var queryString = "";
  if (pathWithQuery.indexOf("?") >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf("?"));
  }
  var path = parsedUrl.pathname;
  var query = parsedUrl.query;
  var method = request.method;

  /******** 从这里开始看，上面不要看 ************/

  if (path === "/") {
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
      string = string.replace("__password__", foundUser.password);
    } else {
      string = string.replace("__password__", "不知道");
    }
    response.statusCode = 200;
    // 相应的第一部分
    response.setHeader("Content-Type", "text/html;charset=utf-8");
    // 相应的第二部分
    response.write(string);
    // 相应的第四部分
    response.end();
    // 相应结束
  } else if (path === "/sign_up" && method === "GET") {
    let string = fs.readFileSync("./sign_up.html", "utf8");
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/html;charset=utf-8");
    response.write(string);
    response.end();
  } else if (path === "/sign_up" && method === "POST") {
    readBody(request).then(body => {
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
      let { email, password, password_confirmation } = hash;
      // 声明三个变量，将hash中与这三个变量名相同的key的value值赋给这三个变量
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
        }
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
          users.push({ email: email, password: password });
          var usersString = JSON.stringify(users);
          fs.writeFileSync("./db/users", usersString);
          response.statusCode = 200;
        }
      }
      response.end();
    });
  } else if (path === "/sign_in" && method === "GET") {
    let string = fs.readFileSync("./sign_in.html", "utf8");
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/html;charset=utf-8");
    response.write(string);
    response.end();
  } else if (path === "/sign_in" && method === "POST") {
    readBody(request).then(body => {
      let strings = body.split("&");
      let hash = {};
      strings.forEach(string => {
        let parts = string.split("=");
        let key = parts[0];
        let value = parts[1];
        hash[key] = decodeURIComponent(value);
      });
      let { email, password } = hash;
      let users = fs.readFileSync("./db/users", "utf8");
      try {
        users = JSON.parse(users);
      } catch (exception) {
        users = [];
      }
      let found;
      for (let i = 0; i < users.length; i++) {
        if (users[i].email === email && users[i].password === password) {
          found = true;
          break;
        }
      }
      if (found) {
        let sessionId = Math.random() * 100000;
        sessions[sessionId] = { sign_in_email: email };
        response.setHeader("Set-Cookie", `sessionId=${sessionId}`);
        // Set-Cookie: <cookie-name>=<cookie-value>
        response.statusCode = 200;
      } else {
        response.statusCode = 401;
      }
      response.end();
    });
  } else if (path === "/main.js") {
    let string = fs.readFileSync("./main.js", "utf8");
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/javascript;charset=utf-8");
    response.write(string);
    response.end();
  } else if (path === "/xxx") {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/xml;charset=utf-8");
    response.setHeader("Access-Control-Allow-Origin", "http://xxxxxxxxx");
    // CORS 跨站资源共享，允许另一个网站发送AJAX请求，'http://xxxxxxx'为允许的那个网站的网址
    // 如果网址用*号代替，表示允许所有网址发送AJAX请求
    response.write(`
    {
        note{
            "to": "小刘"
            "from": "小李"
            "heading": "打招呼"
            "content": "hello"
        }
    }
    `);
    response.end();
  } else {
    response.statusCode = 404;
    response.setHeader("Content-Type", "text/html;charset=utf-8");
    response.write("呜呜呜");
    response.end();
  }

  /******** 代码结束，下面不要看 ************/
});
function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = [];
    request
      .on("data", chunk => {
        body.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(body).toString();
        resolve(body);
      });
  });
}

server.listen(port);
console.log(
  "监听 " +
    port +
    " 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:" +
    port
);
