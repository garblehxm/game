//定义玩家模块
IView('Player', {
    //模块安装前，定义模块静态变量
    beforeInstall: function() {
        //定义奖品概率比
        //  this.RATE = [1, 5, 10, 15, 10, 10];
        this.RATE = [1, 5, 20, 50, 100, 10000]; //为了方便测试，我们调高各个奖项的比重
    },
    // 定义构造函数 
    initialize: function() {
        //根据概率比映射每个奖品的随机中奖区间
        this.createPrizeRate()
            //判断用户是否单击”开始游戏”按钮，进入游戏
        this.gameStart = false;
    },
    //所有模块加载完成后，绑定事件
    ready: function() {
        document
        //获取"开始游戏"按钮
            .querySelector('.arrow')
            //绑定单击事件
        addEventListener('click', function() {
            //如果游戏已经开始，提示用户稍后单击
            if (this.gameStart) {
                alert('游戏进行中，请稍候！')
            } else {
                //游戏开始
                this.gameStart = true;
                //随机产生一个奖品，并发布消息
                this.trigger('ui.showPrize', this.random())
            }
            //绑定当前作用域，方便使用模块实例化对象
        }.bind(this));
        //获取转盘元素
        //监听过渡完成的事件
        document.querySelector('.table').addEventListener('webkitTransitionEnd', function() {
            //动画结束，游戏完成
            this.gameStart = false;
        }.bind(this))
    },
    createPrizeRate: function() {
        //获取奖品概率比
        var rate = this.consts('RATE');
        //Math，random(）的结果在（0,1)区间内，因此起始值是0
        var lastValue = 0;
        //算出概率比中每一份占的比率，即1/所有数之和
        var itemRate = 1 / rate.reduce(function(res, value) {
                return res + value;
            })
            //定义奖品随机区间：每个成员值存储奖品区间的终止值
        this.prizeRate = rate.map(function(value, index) {
            //在上一个区间的基础上，加上当前奖品值的占比
            return lastValue = value * itemRate + lastValue
        })
    },
    //随机产生一个奖品
    //从头遍历，如果成员值比随机值大，说明选中的是该奖品，并返回该奖品的索引值
    random: function() {
        //随机产生一个数
        var num = Math.random();
        return this.prizeRate.findIndex(function(value) {
            //比较奖品区间的终止值与随机数
            return value > num;
        })
    }
})