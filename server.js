var http = require("http");
var fs = require("fs");
var url = require("url");
var port = process.argv[2];
// var cssHandler = require('./method/cssHandler.js')
var sign_up_handler = require('./method/sign_up_handler.js')
var sign_in_handler = require('./method/sign_in_handler.js')

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
  var phn = url.parse( request.url ).pathname    //后添加用于获取图片

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
    console.log(sessions)
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
        console.log(key)
        console.log(foundUser)
        string = string.replace(`__${key}__`, foundUser.key);
      }
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
    response.setHeader('Access-Control-Allow-Origin','*')
    response.write(string);
    response.end();
  } else if (path === "/sign_up" && method === "POST") {
    sign_up_handler.handler(request, response, sessions)
  } else if (path === "/sign_in" && method === "GET") {
    let string = fs.readFileSync("./sign_in.html", "utf8");
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/html;charset=utf-8");
    response.setHeader('Access-Control-Allow-Origin','*')
    response.write(string);
    response.end();
  } else if (path === "/sign_in" && method === "POST") {
    sign_in_handler.handler(request, response, sessions)
  } else if (path.lastIndexOf("js") > -1) {
    path = "." + path
    let string = fs.readFileSync(path, "utf8");
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/javascript;charset=utf-8");
    response.write(string);
    response.end();
  } else if (path.lastIndexOf("css") > -1) {
    // cssHandler.find(path)
    path = "." + path
    let string = fs.readFileSync(path, "utf8");
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/css; charset=utf-8");
    response.write(string);
    response.end();
  } else if (path.lastIndexOf("png") > -1) {
    let stream = fs.createReadStream(path.substr(1));
    let responseData = [];
    if(stream){
      stream.on( 'data', function( chunk ) {
        responseData.push( chunk );
      });
      stream.on( 'end', function() {
         let finalData = Buffer.concat( responseData );
         response.write( finalData );
         response.end();
      });
    }
  } else {
    response.statusCode = 404;
    response.setHeader("Content-Type", "text/html;charset=utf-8");
    response.write("呜呜呜");
    response.end();
  }

  /******** 代码结束，下面不要看 ************/
});

server.listen(port);
console.log(
  "监听 " +
    port +
    " 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:" +
    port
);
