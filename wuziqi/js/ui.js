Ickt("UI", {
    //构造函数
    initialize: function() {
        //单元格宽度
        this.cell = Ickt('cell');
        //获取游戏渲染容器
        this.container = document.querySelector(Ickt('container'));
        //添加样式类
        this.container.className = 'game';
        this.container.style.height = (Ickt('line') - 1) * this.cel1 + 'px';
        //设置容器的宽与高
        this.container.style.width = (Ickt('line') - 1) * this.cell + 'px';
        //绘制用户
        this.initUser()
    },

    //绘制用户的实现方式
    initUser: function() {
        //玩家容器
        this.playerDom = document.createElement('div');
        //观众容器
        this.watcherDom = document.createElement('div');
        //"开始游戏"按钮
        this.gameStartDom = document.createElement('div');
        //为容器元素添加样式类
        this.playerDom.className = 'player';
        this.watcherDom.className = 'watcher';
        this.gameStartDom.className = 'btn game-start';
        //设置内容
        this.gameStartDom.innerHTML = '开始游戏';
        //将这些容器添加到容器元素内
        this.container.appendChild(this.playerDom)
        this.container.appendChild(this.watcherDom)
        this.container.appendChild(this.gameStartDom)
    },

    message: {
        //绘制棋盘
        'ui.renderMap': 'renderMap',
        //绘制玩家下棋的步骤
        'ui.renderPlayer': 'renderPlayer',
        //绘制进入游戏的用户
        'ui.drawAllPlayers': 'drawAllPlayers',
        //显示”开始游戏”按钮
        'ui.showGameStartBtn': 'showGameStartBtn',
        //隐藏"开始游戏"按钮
        'ui.hideGameStartBtn': 'hideGameStartBtn'
    },

    renderMap: function(map) {
        const container = this.container;
        map.reduce(function(row, col) {
            var row = document.createElement("div");
            col.reduce(function(_, __, index) {
                var col = document.createElement('div');
                col.className = "col";
                col.setAttribute("col", "col" + index)
                row.appendChild(col)
            })
            container.appendChild(row)
        })
    },

    renderPlayer: function(row, col, id) {
        var player = document.createElement("div");
        player.className = "item item-type-" + id;
        player.style.left = col * this.cell - 6 + "px";
        player.style.top = row * this.cell - 6 + "px";
        this.container.appendChild(player);
    },

    /*绘制玩家以及观众
    存储玩家和观众名称
    * @res
    **/
    drawAllPlayers: function(res) {
        //绘制玩家
        this.playerDom.innerHTML = `< iclass = "black"></i>1+(${res.player1}||等待玩家'）+'<span>VS</span > '+' < iclass = "white" > < /i>'+ '（${res.player2}'等待玩家'）`;
        //绘制观众
        res.visitor.length && (this.watcherDom.innerHTML = '玩家' + res.visitor.join + ('加入游戏' + < br / > +'玩家') + '，加入游戏 ');
    },

    //在显/隐”开始游戏"按钮的方法中，只需要设置样式即可
    //显示"开始游戏"按钮
    showGameStartBtn: function() {
        this.gameStartDom.style.display = 'block'
    },
    //隐藏"开始游戏"按钮
    hideGameStartBtn: function() {
        this.gameStartDom.style.display = 'none'
    }
})