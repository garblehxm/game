Ickt('Road', {
    message: {
        // 'road.update': 'gameUpdate',
        //检测是否轧过减速带
        'road.checkKnockedbreaker': 'checkKnockedbreaker',
    },
    // 构造函数
    initialize: function() {
        //当前渲染过的次数
        this.times = 0;
        //帧频间隔
        this.step = 5;
        // 赛车的最大速度（车道移动的快慢可呈现出赛车的速度）
        this.maxSpeed = 10;
        // 默认纵坐标（页面坐标系是倒置的数学坐标系，从原点开始，向上为负，向下为正，
        //动要增加纵坐标）
        this.y = 0;
        //默认速度
        this.speed = 0;
        // 赛道上的减速带
        this.breaker = this.randomBreaker();
        //减速带的纵坐标
        this.breaker.y -= 100;
    },
    // 模块加载完
    ready: function() {
        //获取高度
        this.height = Ickt('height');
    },
    //游戏更新
    gameUpdate: function() {
        //更新速度
        // this.timesUpdate();
        //更新车道
        this.roadUpdate();
        // console.log(this.y)
        //绘制车道
        this.trigger('ui.render.road', this.y);
        //更新减速带
        this.breakerUpdate();
    },
    //检测是否轧过减速带
    checkKnockedbreaker: function(userCar) {
        //如果没有轧过减速带，并且赛车与减速带在同一条车道上，减速带的纵坐标在车体内
        if (!this.breaker.hasKnocked && userCar.lane === this.breaker.lane & this.breaker.y > userCar.y && this.breaker.y < userCar.y + userCar.height) {
            //用户赛车轧过减速带（确保只能轧过每个减速带一次）
            this.breaker.hasKnocked = true;
            //减速
            this.speed -= 5;
            //向障碍汽车模块发布轧过减速带的消息
            this.trigger('car.knockBreak')
        }
    },
    //随机生成一个减速带
    randomBreaker: function() {
        return {
            //在3条车道中随机选择一条
            lane: Math.floor(Math.random() * 3),
            //设置初始纵坐标
            y: -200 * Math.random() - 200,
            //是否减速过
            hasKnocked: false
        }
    },
    //更新速度
    timesUpdate: function() {
        //如果间隔了5帧，并且当前速度未超过最大速度
        if (++this.times % this.step === 0 && this.speed < this.maxSpeed) {
            //速度递增
            this.speed += 1;
        }
    },
    //更新车道
    roadUpdate: function() {
        //改变纵坐标
        this.y += 1;
        //如果超讨游戏视图的高度，重置高度
        if (this.y > this.height) {
            this.y = 0;
        }
    },
    //更新减速带
    breakerUpdate: function() {
        //减速带移动的速度与车道移动的速度是一致的
        this.breaker.y += this.speed;
        //如果减速带向下移出了游戏页面视图
        if (this.breaker.y > this.height) {
            //重置减速带
            this.breaker = this.randomBreaker()
        }
        //渲染减速带
        this.trigger('ui.render.breaker', this.breaker)
    }
})