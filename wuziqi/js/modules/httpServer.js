var url = require('url');
var http = require('http');
var fs = require('fs');
var path = require('path');

//定义http服务器类
class HttpServer {
    //构造函数存储的端口号
    constructor(port) {
            //定义HTTP服务器
            this.server = null;
            //定义默认端口号
            this.port = port || HttpServer.PORT;
            //启动HTTP服务器
            this.init();
        }
        //启动HTTP服务器
    init() {
            //创建一个HTTP服务器，实现简单的请求路由，回调函数有两个参数——请求对象和响应对象
            this.server = http.createServer((request, response) => {
                //用url模块解析请求地址，获取路径名称并转码
                let pathname = decodeURIComponent(url.parse(request.url).pathname);
                console.log('URL:', pathname);
                //通过path模块，拼接根路径，获取请求绝对地址
                let realPath = path.join(HttpServer.ROOT, pathname);
                console.log('realPath:', realPath);
                //获取扩展名
                let ext = path.extname(realPath);
                //如果扩展名不存在
                if (!ext) {
                    //设置默认文件
                    realPath = path.join(realPath, '/' + HttpServer.INDEX);
                    //设置默认文件扩展名
                    ext = '.html'
                }
                //通过fs模块判断该文件是否存在
                fs.exists(realPath, function(exists) {
                    //如果存在
                    if (exists) {
                        fs.readFile(realPath, 'binary', (err, file) => {
                            //用二进制形式读取文件
                            //在读取文件时没有错误
                            //返回200请求状态码，并根据文件扩展名设置文件类型，
                            if (err) {
                                //默认类型是文本类型
                                response.writeHead(200, {
                                    'Content-Type': HttpServer.MINE_TYPES[ext.slice(1)] || 'text/plain'
                                });
                                //返回文件内容
                                response.write(file, 'binary');
                                //响应结束
                                response.end();
                                //在读取文件时出现错误
                            } else {
                                //返回500状态码，服务器错误
                                response.writeHead(500, {
                                    'Content-Type': 'text/plain'
                                });

                                //返回错误详细信息
                                response.write('ERROR, the reason of error is ' + err.code + '; Error number is ' + err.errno + '.');
                                //响应结束
                                response.end();
                                //如果文件不存在
                            }
                        })
                    } else {
                        //返回404状态码：无法找到文件
                        response.writeHead(404, {
                            'Content-Type': 'text/plain'
                        });
                        //提示用户请求地址错误
                        response.write('This request URL ' + pathname + 'was notfound on this server.');
                        //响应结束
                        response.end();
                    }
                });
            });
        }
        //设量端口号，启动服务器
    start() {
        //设置端口号
        this.server.listen(this.port);
        //提示用户当前服务器端口号
        console.log("server running at port " + this.port);
        //返回当前实例化对象
        return this;
    }
}
//不同文件扩展名对应的文件类型
HttpServer.MINE_TYPES = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'gif': 'image/gif',
    'ico': 'image/x-icon',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg'
};
//定义默认端口号
HttpServer.PORT = 3001;
//获取当前服务器所在根目录的绝对地址
HttpServer.ROOT = process.cwd(); //默认入口文件是html文件
HttpServer.INDEX = 'index.html'; //将HTTP服务器类作为接口暴露
module.exports = HttpServer;


// 为了测试自己写的模块是否有问题， 小铭在server.js入口文件中导入HttpServer模块类， 并实例化。 此文件的实现如下。 server.js文件
//导入HTTP服务器类
// var HttpServer = require('./server/lib/httpServer.js'); //实例化并启动 HTTP服务器
// new HttpServer().start()



// ‘ 子民’ 之间可以直接通信。 但是需要注意的是， No 小铭在控制台中输入npm install socket.io指令， 顺利安装socket.io模块。 在 要安装一个socket.io模块。” 小铭说。 socketServer,
// js文件中写了几行代码， 创建了HTTP 服务器实例， 并启动它。 最后引入了Socket协议并将结果作为接口暴露出来。 bogon: ~yyqh$ npm install socket.io 图3 - 3 安装socket.io模块
//获取 HTTP服务器类
//获取socket.io模块，注意，该模块需要安装
// server / lib / socketServer.js文件
// let HttpServer = require('./httpServer.js');
// let socket = require('socket.io'); // 实例化HTTP服务器
// let server = new HttpServer()
//     //启动服务器
// server.start();
// //添加Socket协议，并将结果暴露在接口中

// // 于是在server.js中， 删除原来的测试代码， 并导入socketServer.js。 
// require('./server/lib/socketServer.js');