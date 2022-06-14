IView('Player', {
    //模块创建前
    beforeInstall: function() {
        //让用户输入username，当对象指向模块，this存储的数据将作为模块类
        this.username = prompt('请输入用户名！');
        //为了方便测试，我们可以随机取一个用户名
        //this.username='雨夜清荷，+Math.ceil(Math.random()*1000)
        IView({
            //将用户名添加到全局配置中
            username: this.username,
            //默认游戏尚未开始
            gameStart: false
        })
    },

    message: {
        'player.choose': 'choose'
    },

    choose: function(row, col) {
        var result = this.trigger('map.item.isVaild', row, col)[0];

        if (IView('gameStart') && result && IView('player')) {
            this.trigger('socket.player.choose', row, col);
        }
    },

    //所有模块加载完
    ready: function() {
        //发送给socket模块，用户进入游戏信息
        this.trigger('socket.player.init', this.consts('username'))
    },
})