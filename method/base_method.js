var fs = require("fs");

module.exports = {
  readBody: function (request) {
    return new Promise((resolve, reject) => {
      let body = [];
      request
        .on("data", (chunk) => {
          body.push(chunk);
        })
        .on("end", () => {
          body = Buffer.concat(body).toString();
          resolve(body);
        });
    });
  },
  css_js_handler: function (path, request, response) {
    path = "." + path;
    let string = fs.readFileSync(path, "utf8");
    response.statusCode = 200;
    if(path.lastIndexOf("css") > -1){
      response.setHeader("Content-Type", "text/css; charset=utf-8");
    }else{
      response.setHeader("Content-Type", "text/javascript;charset=utf-8");
    }
    response.write(string);
    response.end();
  },
  in_up_get:function(path, request,response){
    let string
    if(path.lastIndexOf("up") > -1){
      string = fs.readFileSync("./sign_up.html", "utf8");
    }else{
      string = fs.readFileSync("./sign_in.html", "utf8");
    }
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/html;charset=utf-8");
    response.write(string);
    response.end();
  }
};
