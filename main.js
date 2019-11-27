myButton.addEventListener("click", e => {
  let request = new XMLHttpRequest(); 
  request.open("GET", "/xxx");
  //   配置request，设置请求的第一部分
  request.setRequestHeader('lixiang','18')
  // 可以设置响应的第二部分第一个为key，第二个为value
  request.setRequestHeader('Content-Type','x-www-form-urlencoded')
  // 请求头可设置多个，都会自动添加进第二部分，但是某些默认的请求头不能修改
  request.send('偏要设置第四部分');
  // send可以用来设置第四部分，因为get请求默认没有第四部分，所有即使设置了很多浏览器也看不到，把get该改成post就可以看到了
  request.onreadystatechange = () => {
    // 监听request的readystatechange
    if (request.readyState === 4) {
        // 当前文档的状态，浏览器发出请求后并不是瞬间得到全部相应，而是分为0,1,2,3,4,五个状态，4表示已完成下载
        // 0表示未调用open，1表示open以及调用，2表示send以及调用并且相应头和相应状态可获得，3表示下载中
        console.log('说明响应完毕')
        console.log(request.status)
        // 获取请求成功相应给出的状态码，入200
        console.log(request.statusText)
        // 获取请求成功时相关给出的OK
      if (request.status >= 200 && request.status < 300) {
        console.log('说明请求成功')
        console.log(request.getAllResponseHeaders())
        // 获取相应的第二部分全部即响应头
        console.log(request.getResponseHeader('Content-Type'))
        // 获取第二部分的某一个值
        console.log(request.responseText)
        // 获取相应的第四部分
        console.log(typeof request.responseText)
        // 响应的第四部分永远是字符串
        let string = request.responseText
        let object = window.JSON.parse(string)
        // 把相应的第四部分的符合JSON语法的字符串转换成JS对应的值
        // window.JSON.parse由浏览器提供
        console.log(typeof object)
        console.log('object.note')
        console.log(object.note)
      } else if(request.status >= 400){
        console.log('说明请求失败')
      }
    }
  };
});
