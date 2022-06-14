// 地图模块
IView('Map', {
    //地图模块依赖于事件模块以及虚拟DOM模块
    dependences: ['Event', 'VDom'],
    //订阅键盘消息
    message: {
        //向左滑动
        'event.left': 'moveRightToLeft',
        //向右滑动
        'event.right': 'moveLeftToRight',
        //向上滑动
        'event.up': 'moveDownToUp',
        //向下滑动
        'event.down': 'moveUpToDown'
    },
    //构造函数，注入$2048模块
    initialize: function($2048) {
        //每行长度
        this.num = IView('num');
        //创建地图
        this.createMap();
        //初始化方格
        this.initBlock();
    },
    //模块创建完
    ready: function() {
        //初始化视图
        this.trigger('vdom.initView', this.map)
    },
    //创建地图
    createMap: function() {
        //获取每行长度
        var num = this.num;
        //地图是个二维数组，为了能够调用迭代器方法和遍历数组，填充默认娄
        this.map = new Array(num)
            .fill(0)
            .map(function() {
                return new Array(num).fill(0)
            })
    },
    //在地图中随机指定一个位置
    //位置要是0到num的整数（可以是0）
    random: function(num) {
        return Math.random() * num >> 0;
    },
    //初始化方格
    initBlock: function() {
        //在[1，1]位置初始化
        this.map[1][1] = 2;
        //如果长度不小于4
        if (IView('num') >= 4) {
            //在[1，3]位置初始化
            this.map[1][3] = 2;
        }
    },
    //创建方块
    createBlock: function() {
        //随机产生行坐标
        var row = this.random(this.num);
        //随机产生列坐标
        var col = this.random(this.num);
        //如果该位置没有成员
        if (!this.map[row][col]) {
            //设置默认值2
            this.map[row][col] = 2
                //如果该位置有成员，并且还有空余位置
        } else if (!this.$2048.checkNoPosition(this.map)) {
            //继续创建
            this.createBlock();
            //剩余的情况是：没有剩余位置，但是还可以合并方格
        }
    },
    //更新地图
    updateMap: function() {
        //创建方格
        this.createBlock();
        //更新虚拟DOM
        this.trigger('vdom.render', this.map)
            //如果没有位置了，并且不能继续玩下去，游戏结束
        if (this.$2048.checkNoPosition(this.map) && this.$2048.checkGameOver(this.map)) {
            alert('游戏结束')
        }
    },
    //向左滑动
    moveRightToLeft: function() {
        //从右向左合并列
        this.$2048.combineMap(this.map, false)
            //更新地图
        this.updateMap()
    },
    //向右滑动
    moveLeftToRight: function() {
        // 从左向右合并列
        this.$2048.combineMap(this.map, true);
        //更新地图
        this.updateMap()
    },
    //逆时针旋转90°，向上滑动就是向左滑动
    //向上滑动就是向左滑动
    moveDownToUp: function() {
        //旋转地图并合并
        this.$2048.rotateMap(this.map, false);
        //更新地图
        this.updateMap()
    },
    //逆时针旋转90°，向下滑动就是向右滑动
    //向下滑动就是向右滑动
    moveUpToDown: function() {
        //旋转地图并合并
        this.$2048.rotateMap(this.map, true);
        //更新地图
        this.updateMap()
    },
})