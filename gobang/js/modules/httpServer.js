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
            this.server = http.createServer(function(request, response) {
                //用url模块解析请求地址，获取路径名称并转码
                console.log('URL:', request);
                let pathname = decodeURIComponent(url.parse(request.url).pathname);
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
                        //用二进制形式读取文件
                        fs.readFile(realPath, 'binary', (err, file) => {
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
HttpServer.PORT = 3000;
//获取当前服务器所在根目录的绝对地址
HttpServer.ROOT = process.cwd();
//默认入口文件是html文件
HttpServer.INDEX = 'index.html';
//将HTTP服务器类作为接口暴露
module.exports = HttpServer;