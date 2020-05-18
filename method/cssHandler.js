module.exports = {
    find(path){
        // let arr = path.split('/');
        // let pathName = arr[arrlenght - 1]
        path = "." + path
        let string = fs.readFileSync(path, "utf8");
        response.statusCode = 200;
        response.setHeader("Content-Type", "text/css; charset=utf-8");
        response.write(string);
        response.end();
    }
}