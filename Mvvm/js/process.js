// 进度条模块
Ickt('Process', 'Component', {
    message: {
        // 'player.game.update': 'gameUpdate'
    },
    //渲染容器元素
    el: '#app .process',
    // 模板
    template: '#tmp_process',
    //绑定的数据
    data: {
        value: '100%',
    },
    //全局配置
    globals: {
        //总时长
        time: 60 * 1000 * 3
    },
    //样式文件 
    style: '../css/style.css',
    //构造函数，用于初始化进度条信息
    initialize: function() {
        this.wholeTime = Ickt('time');
    },
    //更新游戏
    gameUpdate: function(loop, useTime) {
        console.log(loop)
            //如果用时超过了总时间
        if (useTime >= this.wholeTime) {
            //修改进度
            this.$value = '0%';
            //游戏结束
            this.trigger('game.over')
        } else {
            //更新内容值
            this.$value = (1 - useTime / this.wholeTime) * 100 + '%';
        }
    }
})