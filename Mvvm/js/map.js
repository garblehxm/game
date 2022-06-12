Ickt('Map', {
    //注册消息
    message: {
        'map.gameStart': 'gameStart',
        'map.change': 'changeItem',
        //选中而隐藏图片
        'map.hide': 'hideItem',
        //比较两张图片
        'map.compare': 'compareItem'
    },
    //游戏开始
    gameStart: function() {
        //重置地图数据
        this.resetMap();
        //初始化视图
        this.trigger('ui.init', this.list)
    },
    //构造函数，注入〈连连看〉的服务
    initialize: function($links) {
        //不同图片的数量
        this.level = 18; //行数
        this.repeat = 4; //图片总数
        this.total = 72;
        this.currentNum = this.total = this.level * this.repeat;
        //一行排列的图片数
        this.oneLineNum = 12; //行数
        this.lines = this.total / this.oneLineNum;
    },
    ready: function() {
        // this.gameStart()
    },
    //重置地图
    resetMap: function() {
        //获取不同图片的数量
        var level = this.level;
        //获取一行的图片数
        var oneLineNum = this.oneLineNum;
        //根据图片总数，创建一维数组，乱序后，设置成员数据信息
        this.list = new Array(this.total).fill(0).map(function(value, index) {
            return index
                //乱序
        }).sort(function() {
            return Math.random() < .5 ? 1 : -1;
            //设置每个成员的信息
        }).map(function(value, index) {
            return {
                //列
                col: index % oneLineNum * 54,
                //行
                row: parseInt(index / oneLineNum) * 54,
                //图片id，同一类图片的id相同
                num: value % (level),
                //边框颜色，默认无颜色
                color: "",
                //是否显示，默认显示
                display: ''
            }
        })
    },
    //隐藏成员
    hideItem: function(index) {
        //隐藏元素
        this.list[index].display = 'none';
        //数量减一
        this.currentNum--;
        //修改该成员
        this.trigger('ui.render', index, this.list[index]);
        //  如果长度小干0， 则游戏腼利诵关
        if (this.currentNum <= 0) {
            //发布成功的消息
            this.trigger('game.success')
        }
    },
    //改变成员的色彩
    changeItem: function(index, color) {
        //修改色彩
        this.list[index].color = color;
        //向UI模块发布消息
        this.trigger('ui.render', index, this.list[index]);
    },
    //比较两张图片是否相同
    compareItem: function(a, b, newId) {
        //获取《连连看》的算法服务
        var links = this.$links;
        //获取列表数捉145，
        var list = this.list;
        //获取一行的成员数
        var oneLineNum = this.oneLineNum;
        //获取行数
        var lines = this.lines;
        //获取总数
        var total = this.total;
        //判断是否在一条横线上，是否相邻，是否可以相连
        var result = (links.ABInX(a, b, oneLineNum) && (links.AxNextToBx(a, b) || links.AxLineToBx(a, b, list))) ||
            //判断是否在同一条竖线上，是否相邻，是否可以相连
            (links.ABInY(a, b, oneLineNum) && (links.AyNextToBy(a, b, oneLineNum) ||
                links.AyLineToBy(a, b, oneLineNum, list))) ||
            //都在同一边缘上
            links.ABInBorder(a, b, oneLineNum, lines) ||
            //不在同一条直线上，判断横向和纵向延长线上的两个点是否可以相连
            links.AExtensionB(a, b, oneLineNum, total, list)
            //如果是相连的
        if (result) {
            //发布连接成功的消息
            this.trigger('player.choose.right', newId, a)
                //否则，发布连接失败的消息
        } else {
            this.trigger('player.choose.wrong', newId, a)
        }
    }
})