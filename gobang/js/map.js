IView('Map', {
    message: {
        //检测该位置是否可以下棋子
        'map.item.isValid': 'checkItemIsValid',
        //存储棋手下棋的步骤
        'map.savePlayerChoose': 'savePlayerChoose',
        'map.item.isVaild': 'checkItemIsVaild',
        // 'map.checkWinGame':'checkWinGame'
    },

    //构造函数，用于注入检测服务
    initialize: function($gobang) {
        this.row = IView("line")
        this.col = IView("line")
        this.createMap();
    },

    /**
    *存储棋手下棋的动作
    行号（纵坐标）* @row
    列号（横坐标）* @col* 
    棋手的id   @value
    **/
    savePlayerChoose: function(row, col, value) {
        //为了检测胜负，将棋手的id存储在棋盘数组内
        this.map[row][col] = value;
        //检测游戏是否结束
        this.checkGameOver(value)
    },

    checkGameOver: function(value) {
        //获取检测结果
        var result = this.checkWinGame()
            //如果结束
        if (result) {
            //通知服务器端游戏结束，并展示获胜棋手的名称
            this.trigger('socket.playerWin', {
                id: value
            })
        }
    },

    //检测游戏获胜情况 
    checkWinGame: function() {
        //如果是棋手，并且横向五子相连或者纵向五子相连或者在斜45°（或者135°方向上
        //则在游戏中获胜
        return IView('player') > 0 && (this.$gobang.checkRow(this.map) || this.$gobang.checkCol(this.map) ||
            this.$gobang.check45(this.map, IView('line')) || this.$gobang.checkl35(this.map, IView('line')))
    },

    createMap: function() {
        var col = this.col;
        this.map = new Array(this.row).fill(0).map(function(value, index, array) {
            return new Array(col).fill(0)
        })
    },

    checkItemIsVaild: function(row, col) {
        return this.map[row][col] === 0;
    },

    ready: function() {
        this.trigger("ui.renderMap", this.map)
    }
})