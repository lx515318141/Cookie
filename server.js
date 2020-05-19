var http = require("http");
var fs = require("fs");
var url = require("url");
var port = process.argv[2];
var sign_up_handler = require('./method/sign_up_handler.js')
var sign_in_handler = require('./method/sign_in_handler.js')
var index_handler = require('./method/index_handler.js')
var base_method = require('./method/base_method')

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
    index_handler.handler(request, response, sessions)
  } else if ((path === "/sign_up" && method === "GET") || (path === "/sign_in" && method === "GET")) {
    base_method.in_up_get(path, request,response)
  } else if (path === "/sign_up" && method === "POST") {
    sign_up_handler.handler(request, response, sessions)
  } else if (path === "/sign_in" && method === "POST") {
    sign_in_handler.handler(request, response, sessions)
  } else if (path.lastIndexOf("js") > -1 || path.lastIndexOf("css") > -1) {
    base_method.css_js_handler(path, request, response)
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