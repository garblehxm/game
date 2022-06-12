Ickt('Event', {
    //构造函数
    initialize: function() {
        //获取容器
        this.container = document.querySelector(Ickt("container"));
        //获取棋盘在页面中的起始坐标
        //横坐标
        this.startX = this.getOffsetLeft(this.container);
        //纵坐标
        this.startY = this.getOffsetTop(this.container);
        //棋盘宽度
        this.width = this.container.clientWidth;
        //棋盘高度
        this.height = this.container.clientHeight;
        //单元格宽度
        this.cell = Ickt('cell')
        //共20条线，从0开始计算，所以最后一条线的索引值是Ickt（'1ine'）-1
        this.lineNum = Ickt('line') - 1;
    },

    //获取棋盘容器元素距离页面顶部的坐标
    getOffsetTop: function(element) {
        //获取顶部偏移量
        var top = element.offsetTop;
        //获取父元素
        var current = element.offsetParent;
        //逐—遍历父元素
        //如果父元素存在
        while (current !== null) {
            //添加父元素的偏移量
            top += current.offsetTop;
            //获取父元素的父元素
            current = current.offsetParent;
        }
        //返回顶部的偏移量
        return top;
    },

    //获取棋盘容器元素距离页面左侧的坐标
    getOffsetLeft: function(element) {
        //获取当前元素左侧的偏移量
        var left = element.offsetLeft;
        // 获取父元素
        var current = element.offsetParent;
        //逐一遍历父元素
        //如果父元素存在
        while (current !== null) {
            //添加父元素的偏移量
            left += current.offsetLeft;
            //获取父元素的父元素
            current = current.offsetParent
                //返回左侧的偏移量
            return left;
        }
    },


    //模块创建完，绑定事件
    ready: function() {
        //通过事件委托模式，将事件委托给页面
        document.addEventListener('touchstart', this.touchDOM.bind(this))
    },
    //事件回调函数
    touchDOM: function(e) {
        //获取事件坐标
        //棋盘的列为横坐标
        var col = e.touches[0].pagex - this.startX;
        //棋盘的行为纵坐标
        var row = e.touches[0].pageY - this.startY;
        this.trigger('player.choose', this.getRowCol(row), this.getRowCol(col));
        //发布玩家下棋的消息
        // this.trigger('socket.player.choose', this.getRowCol(row), this.getRowCol(col))
        //如果单击的是"开始游戏"按钮
        if (~e.target.className.indexOf('game-start')) {
            //游戏开始
            this.trigger('socket.gameStart');
            this.trigger('ui.hideGameStartBtn');
        }
    }
})