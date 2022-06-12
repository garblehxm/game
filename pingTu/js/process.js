Ickt('Process', {
    globals: {
        //默认用时1min
        time: 1 * 60 * 1000
    },
    message: {
        'process.gameOver': 'gameOver'
    },
    //构造函数
    initialize: function() {
        //循环定时器的句柄
        this.timebar = null;
        //获取游戏约束时间
        this.wholeTime = Ickt('time');
    },
    //模块加载完成，开始游戏，并开始计时
    ready: function() {
        var me = this;
        //获取初始化的时间
        this.date = Date.now();
        //启动定时器
        this.timebar = setInterval(function() {
            //获取剩余时间（总时间-已经计时的时间）
            var time = me.wholeTime - (Date.now() - me.date);
            //如果剩余时间小于0
            if (time < 0) {
                //将时间设置成0
                time = 0;
                //游戏结束
                me.gameOver();
                //通知地图模块，游戏结束
                me.trigger('map.gameOver')
                    //提示用户
                alert('游戏结束！');
            }
            //通知UI模块更新进度，将毫秒转换成秒
            me.trigger('ui.showProcess', (time / 1000).toFixed(1))
        })
    },
    //游戏结束
    gameOver: function() {
        //清除循环定时器，
        clearInterval(this.timebar)
    }
})