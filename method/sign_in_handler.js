let baseMethod = require('./baseMethod.js')
var fs = require("fs");

module.exports = {
    handler:function(request, response, sessions){
      baseMethod.readBody(request).then(body => {
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
    }
}