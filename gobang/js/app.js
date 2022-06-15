//导入I0接口
let io = require('./modules/socketServer');
let Game = require('./game')
class App {
    //消息不需要每次实例化的时候都创建一份，因此我们将它们定义在静态属性中，并存储消息名称
    static get message() {
            //需要注册的Socket消息序列
            return ['playerInit', 'gameStart', 'playerChoose', 'playerWin', 'disconnect']
        }
        //在构造函数中，注册消息
    constructor() {
        this.game = new Game();
        //存储socket对象
        this.io = io;
        // Socket 监听玩家链接成功的消息
        this.io.on('connection', guest => {
            //遍历消息，逐一注册
            App.message.forEach(name => {
                //注册消息，为了在回调方法中访问注册消息的用户，我们将作为参数传递用户
                guest.on(name, this[name].bind(this, guest))
            })
        })
    }

    //用户进入游戏
    /**用户加入游戏
    socket对象
    @guest
    前端返回的数据
    @res **/
    playerInit(guest, res) {
        //添加用户后，查看用户的类型
        switch (this.game.addPlayer(res.username, guest)) {
            //用户名与玩家名称相同
            case 0:
                //不合法的名称
                guest.emit('invaludUser')
                return;
                //第一位玩家
            case 1:
                //显示第一位玩家的信息
                guest.emit('setPlayer', 'player1')
                break;
                //第二位玩家
            case 2:
                //显示第二位玩家的信息
                guest.emit('setPlayer', 'player2')
                    //通知两位玩家，显示”开始游戏”按钮名字，以及两位玩家的名字
                this.game.guest.forEach(item => item.emit('showStartBtn' [this.game.playerl, this.game.player2]))
                break;
                //观众信息
            case 3:
                break;
        }
        //显示玩家之前的步骤
        guest.emit('drawAllActions', this.game.actions)
            //存储用户名，方便在APP中访问
        guest.username = res.username;
        //通知所有人添加了用户
        io.sockets.emit('addUser', this.getAllUser())
    }

    // 获取所有用户
    getAllUser() {
        //解构玩家以及观众名称
        let (playerl, player2, visitor) = this.game;
        return (playerl, player2, visitor)
    }

    /**
    开始游戏
    guest     Socket对象
    res  前端返回的数据
    **/
    gamestart(guest, res) {
        //开始游戏
        if (this.game.start()) {
            //通知所有用户开始游戏
            io.sockets.emit('gameStart')
                //缺少玩家，通知用户等待玩家
        } else {
            guest.emit('waitPlayer')
        }
    }

    /**
    *棋手下棋
    socket对象
    前端返回的数据
    * @guest* ares
    ***/
    playerChoose(guest, res) {
        //判断游戏是否开始
        if (this.game.begin) {
            //判断同一位棋手是否连续走两步
            if (this.game.checkChoose(guest.username)) {
                //存储棋手的名称
                this.game.playerMove(guest.username)
                    //存储棋手的动作
                this.game.saveActions(res)
                    //向所有用户显示该步
                io.sockets.emit('drawPoint', res)
            } else {
                guest.emit('waitPlayerChoose')
            }
        } else {
            //若没开始，通知用户等待游戏开始
            guest.emit('waitGameStart', res)
        }
    }

    /**
    *玩家获胜
    Socket对象
    * Cguest
    前端返回的数据
    * @res
    ***/
    playerWin(guest, res) {
        //判断游戏是否结束
        if (!this.game.gameover) {
            //获取UserName
            var player = this.game['player' + res.id];
            //向所有用户显示获胜棋手
            io.sockets.emit('showWinPlayer', {
                    player: res.id,
                    username: player
                })
                // 游戏结束 
            this.game.win()
        }
    }

    /**
    *用户离开游戏
    Socket对象
    @guest*
    前端返回的数据
    * eres
    ***/
    disconnect(guest, res) {
        //将该用户从游戏中移除
        this.game.userLeave(guest.username);
        //复用addUser消息更新视图
        io.sockets.emit('addUser', this.getAllUser())
    }

    //游戏启动
    // gameStart(guest, res) {}
    //棋手下棋
    // playerChoose(guest, res) {}
    //棋手获胜
    //观众离开
    // disconnect(guest, res) {}
}

module.exports = App;