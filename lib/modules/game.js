IView.module('Game', {
    //模块创建前
    beforeInstall: function() {
        //如果RAE不存在
        if (!window.requestAnimationFrame) {
            //定义上一次执行的时间
            var lastTime = 0;
            //为了判断是否有具有浏览器前缀的RAF方法，要获取浏览器前缀
            var prefix = 'ms moz webkit o'.split(' ');
            //如果没有找到RAF方法，继续遍历浏览器前缀
            for (var i = 0; i < prefix.length && !window.requestAnimationFrame; i++) {
                //获取具有浏览器前缀的RAF方法，并存储
                window.requestAnimationFrame = window[prefix[i] + 'RequestAnimationFrame'];
                //存储清除的RAE方法，具有Webkit前缀的清除方法的名称有所不同
                window.cancelAnimationFrame = window[prefix[i] + 'CancelAnimationFrame'] || window[prefix[i] + 'CancelRequestAnimationFrame']
            }
            // 如果仍然没有RAF方法，用setTimeout模拟
            if (!window.requestAnimationFrame) {
                /***
                *定义RAF方法
                回调函数
                * @callback
                **/
                window.requestAnimationFrame = function(callback) {
                        //获取当前时间
                        var currentTime = +new Date();
                        //每秒60帧，时间间隔约是1.67ms，如果超过16.7ms，立即执行
                        var timeToCall = Math.max(0, 16.7 - (currentTims - lastTime))
                            //执行定时器方法，并存储定时器句柄
                        var id = window.setTimeout(function() {
                            //执行回调函数
                            callback(currentTime + timeToCall);
                        }, timeToCall);
                        //更新上一次执行的时间
                        lastTime = currentTime + timeToCall;
                        //返回定时器句柄
                        return id;
                    }
                    //定义清除RAF的方法
                window.cancelAnimationFrame = function(id) {
                    clearTimeout(id);
                }
            }
        }
        this.GAME_MESSAGE = {
            //游戏开始
            'game.start': 'start',
            //更新每一帧
            'game.update': 'update',
            //游戏暂停
            'game.pause': 'pause',
            //游戏继续
            'game.continue': 'continues',
            //游戏重启
            'game.restart': 'restart',
            //游戏结束（失败）
            'game.over': 'over',
            //本关通过，进入下一关
            'game.pass': 'pass',
            //游戏结束（成功）
            'game.success': 'success'
        }
        Object.keys(this.GAME_MESSAGE).forEach(function(key) {
            //获取消息名称
            var value = this.GAME_MESSAGE[key];
            //注册全局消息（生命周期）
            IView.registGlobalMessage(key)
        }.bind(this))
    },
    beforeCreate: function(instance) {
        instance.message = this.GAME_MESSAGE;
    },
    initialize: function() {
        this.gameExec = false;
        // 开始的时间
        this.startTime = 0;
        //定时器句柄
        this.timeBar = null;
        // 循环的次数
        this.loopNum = 0;
        // 暂停后的延迟
        this.timeDelay = 0;
    },
    //游戏开始的方法
    doStart: function() {
        //游戏可以执行了
        this.gameExec = true;
        //获取当前时间
        this.startTime = Date.now();
        //第一次循环
        this.loopNum = 0;
        //暂停后的时间延迟
        this.timeDelay = 0;
        //执行RAF
        this.exec()
    },
    //游戏结束的方法
    doEnd: function() {
        //游戏不能执行了
        this.gameExec = false;
        //起始时间归零
        this.startTime = 0;
        //清除RAE定时器
        cancelAnimationFrame(this.timeBar)
    },
    //游戏开始时的消息回调函数
    start: function() {
        //游戏开始
        this.doStart();
        //在游戏模块中发布游戏开始的消息
        this.trigger('IView.game.start', this.loopNum, Date.now() - this.startTime, this.startTime);
    },

    //游戏更新时的消息回调函数
    update: function(loop, time) {},
    //游戏结束（失败）时的消息回调函数
    over: function() {
        //获取开始时间
        var startTime = this.startTime;
        //游戏结束
        this.doEnd();
        //在游戏模块中发布游戏结束（失败）的消息
        this.trigger('IView.game.over', this.loopNum, Date.now() - startTime, startTime)
    },
    //游戏暂停时的消息回调函数
    pause: function() {
        //游戏不能执行了
        this.gameExec = false;
        //获取当前时间
        this.timeDelay = Date.now();
        //向全局发布游戏暂停的消息
        this.trigger('IView.game.pause', this.loopNum, Date.now() - this.startTime, this.startTime);
        // this.exec()
    },
    //游戏继续时的消息回调函数
    continues: function() {
        //游戏可以执行了
        this.gameExec = true;
        //游戏开始时间要减去暂停时间
        this.startTime += Date.now() - this.timeDelay;
        //重置游戏暂停时间
        this.timeDelay = 0;
        //在游戏模块中发布游戏继续的消息
        this.trigger('IView.game.continue', this.loopNum, Date.now() - this.startTime, this.startTime);
    },
    //游戏重新开始时的消息回调函数
    restart: function() {
        //获取开始时间
        var startTime = this.startTime;
        //游戏结束
        this.doEnd();
        //在游戏模块中发布游戏重新开始的消息
        this.trigger('IView.game.restart', this.loopNum, Date.now() - startTime, startTime);
        //开始游戏
        this.doStart();
    },
    //游戏过关并进入下一关的消息回调函数
    pass: function() {
        //获取开始时间
        var startTime = this.startTime;
        //游戏结束
        this.doEnd();
        //在游戏模块中发布游戏过关并进入下一关的消息
        this.trigger('IView.game.pass', this.loopNum, Date.now() - startTime, startTime);
        //游戏开始
        this.doStart();
    },
    //游戏结束（成功）时的消息回调函数
    success: function() {
        //获取开始时间
        var startTime = this.startTime;
        //游戏结束
        this.trigger('IView.game.success', this.loopNum, Date.now() - startTime, startTime);
        this.doEnd();
        //在游戏模块中发布游戏结束（成功）的消息
    },
    //游戏执行方法
    exec: function() {
        //如果游戏可以执行
        if (this.gameExec) {
            //执行游戏每一帧
            this.timebar = requestAnimationFrame(function() {
                //在游戏模块中发布游戏更新一次的消息
                this.trigger('IView.game.update', this.loopNum, Date.now() - this.startTime, this.startTime);
                //游戏又执行了一次
                ++this.loopNum;
                //继续执行游戏
                this.exec()
            }.bind(this))
        }
    }
})