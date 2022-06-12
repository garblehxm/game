Ickt('Player', {
    //全局配置
    globals: {
        //玩家汽车的纵坐标
        playerY: 260
    },

    message: {
        // 'player.game.update': 'gameUpdate',
    },
    initialize: function() {
        //游戏是否开始
        this.isBegin = false;
        //默认在中间
        this.lane = 1;
        //获取用户赛车的纵坐标
        this.y = Ickt('playerY');
        //定义用户赛车的高度
        this.height = 43;
    },
    //轻拍事件
    eventTap: function() {
        //如果没有开始
        if (!this.isBegin) {
            //游戏开始
            this.trigger('game.start')
                //已经开始
            this.isBegin = true;
        }
    },
    ready: function() {
        this.eventTap();
    },
    // 向右滑动
    eventSwipeRight: function() {
        //如果超过第三条车道
        if (++this.lane > 2) {
            //就在第三条车道上
            this.lane = 2;
        } else {
            //如果游戏开始，发布更新车道的消息
            this.isBegin && this.trigger('ui.render.player', this.lane)
        }
    },
    //如果切换后的车道宽度小于第一条车道
    eventSwipeLeft: function() {
        //向左滑动
        if (--this.lane < 0) {
            //就在第一条车道上
            this.lane = 0;
        } else {
            //如果游戏开始，发布更新车道的消息
            this.isBegin && this.trigger('ui.render.player', this.lane)
        }
    },
    //游戏更新
    gameUpdate: function(loop, time) {
        //游戏更新
        //发布是否撞到障碍汽车的消息
        this.trigger('car.checPlayerkKnocked', {
            lane: this.lane,
            y: this.y,
            height: this.height
        });
        //发布是否轧过减速带的消息
        this.trigger('road.checkKnockedbreaker', {
            lane: this.lane,
            y: this.y,
            height: this.height,
        })
    },
    //游戏结束
    gameOver: function(loop, time) {
        //在赛车所在的车道以及纵坐标上绘制爆炸特效
        this.trigger('ui.render.bomb', {
            lane: this.lane,
            y: this.y
        });
        //游戏已经结束
        this.isBegin = false;
        //提示用户坚持的时间，并放在定时器中异步执行，防止alert中断程序
        setTimeout(function() {
            alert('恭喜您，坚持了，' + time / 1000 + '秒！')
        }, 0);
    }
})