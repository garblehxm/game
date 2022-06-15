IView("Socket", {
    //注册消息
    message: {
        'socket.player.init': 'playerInit',
        //玩家进入游戏
        'socket.player.choose': 'playerChoose',
        //玩家下棋
        'socket.playerWin': 'playerWin',
        //玩家获胜
        'socket.gameStart': 'gameStart'
    },

    /***
    *用户进入游戏，通知服务器端
    * @username
    玩家名称
    **/
    playerInit: function(username) {
        this.socket.emit('playerInit', { username: username })
    },

    /***
    *用户进入游戏，通知服务器端
    * @username
    玩家名称
    **/
    gameStart: function() {
        //将模块中存储的用户名传递给服务器端
        this.socket.emit('gameStart', this.username)
    },

    /***
    *玩家下棋，要将棋子的横纵坐标传递过去
    横坐标
    * @row
    纵坐标
    * @col
    **/
    playerChoose: function(row, col) {
        this.socket.emit('playerChoose', {
            row: rOw,
            col: col,
            player: this.player3
        })
    },

    /**
     *玩家获胜，通知服务器端用户信息* @data
     **/
    playerWin: function(data) {
        this.socket.emit('playerWin', data)
    },

    beforeInstall: function() {
        //消息序列
        this.ACTIONS = [
            // 监听玩家下棋的消息
            'addUser',
            //监听获取用户身份的消息
            'setPlayer',
            //监听用户进入的消息
            'drawPoint',
            // 监听游戏开始的消息 
            'gameStart',
            //监听显示获胜玩家的消息
            'showWinPlayer',
            //监听等待对手下棋的消息
            'waitPlayerChoose',
            //监听等待游戏开始的消息
            'waitGameStart',
            //监听等待玩家进入游戏的消息
            'waitPlayer',
            //监听绘制之前所有下棋步骤的消息
            'drawAllActions',
            //监听显示”开始游戏”按钮的消息
            'showStartBtn'
        ]
    },
    //构造函数
    initialize: function() {
        //获取玩家昵称
        this.username = IView('username');
        this.socket = io();
        //获取socket io对象
        //注册事件
        this.consts('ACTIONS').forEach(function(msg) {
            //msg代表消息名称，消息回调函数以on开头，采用驼峰式命名，并绑定当前实例化对象
            this.socket.on(msg, this['on' + msg[0].toUpperCase() + msg.slice(1)].bind(this).bind(this))

        })
    },
    //监听用户进入的消息
    onAddUser: function(res) {
        //绘制用户
        this.trigger('ui.drawAllPlayers', res)
    },

    //监听获取用户身份的消息
    onSetPlayer: function(res) {
        //如果用户是左侧（黑方）玩家
        if (res === 'playerl') {
            //设置信息
            IView({
                    player: 1,
                })
                //存储信息
            this.player = 1;
            //如果用户是右侧（白方）玩家
        } else if (res === 'player2') {
            //设置信息
            IView({
                    player: 2,
                })
                //存储信息
            this.player = 2;
        }
    },
    //展示"开始游戏"按钮
    onShowStartBtn: function(res) {
        this.trigger('ui.showGameStartBtn')
    },

    //监听玩家下棋的消息
    onDrawPoint: function(res) {
        this.trigger('map.savePlayerChoose', res.row, res.col, res.player)
        this.trigger('ui.renderPlayer', res.row, res.col, res.player)
    },

    //监听显示获胜玩家的消息
    onShowWinPlayer: function(res) {
        alert('player' + res.player + ':' + res.username + ' win!')
    },

    //监听等待对手下棋的消息
    onWaitPlayerChoose: function() {
        alert('请等待对方下棋！')
    },

    //监听等待游戏开始的消息
    onWaitGameStart: function() {
        alert('请等待游戏开始')
    },

    //监听等待玩家进入游戏的消息
    onWaitPlayer: function() {
        alert('请等待玩家进入')
    },

    //监听绘制之前所有下棋步骤的消息
    onDrawAllActions: function(actions) {
        actions.forEach(function(res) {
            this.trigger('map.savePlayerChoose', res.row, res.col, res.player);
            this.trigger('ui.renderPlayer', res.row, res.col, res.player)
        }.bind(this))
    },

    //监听游戏开始的消息
    onGameStart: function() {
        //存储游戏开始的配置
        IView({ gameStart: true })
        this.trigger('ui.hideGameStartBtn')
    }
})