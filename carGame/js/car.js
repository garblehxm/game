// 障碍汽车模块
IView('Car', {
    //全局信息
    globals: {
        //障碍汽车的数量
        carNum: 3,
        //每类障碍汽车的信息
        carInfo: [
            //每个成员代表一类汽车，3个成员分别表示宽度、高度，以及速度
            [23, 48, 10],
            [25, 43, 8],
            [22, 41, 6]
        ]
    },
    message: {
        // 'road.knockBreak':'knockBreak'
        //检测障碍汽车
        'car.checPlayerkKnocked': 'checPlayerkKnocked',
        //用户的赛车轧过减速带，障碍汽车相对减速
        'car.knockBreak': 'knockBreak'
    },
    // 构造函数
    initialize: function() {
        // 获取障碍汽车的数量
        this.carNum = IView('carNum')
            // 获取障碍汽车的尺寸与速度等信息
        this.carInfo = IView('carInfo');
        // 当前渲染的汽车
        this.cars = [];
        //汽车平均间距
        this.step = 100;
    },
    //模块加载完
    ready: function() {
        //获取游戏界面的高度
        this.height = IView('height')
    },
    //游戏开始
    gameStart: function() {
        //初始化障碍汽车
        this.initCars();
    },
    //根据数字范围获取随机数
    random: function(num, isInt) {
        //创建一个随机数
        var result = num * Math.random();
        //如果是整数，向下取整
        return isInt ? Math.floor(result) : result;
    },
    //初始化汽车
    initCars: function() {
        //根据障碍汽车的数量，初始化障碍汽车
        for (var i = 0; i < this.carNum; i++) {
            //获取障碍汽车的类型
            var type = this.random(this.carInfo.length, true);
            //获取障碍汽车的信息
            var info = this.carInfo[type];
            //添加障碍汽车
            this.cars.push({
                //所在车道
                lane: this.random(3, true),
                //宽度
                width: info[0],
                //高度
                height: info[1],
                //速度
                speed: info[2],
                //类型
                type: type,
                //纵坐标
                y: -this.step * (i * 2 + Math.random()) - 500
            })
            this.trigger('ui.reset.car', this.cars[i], i)
        }
    },
    //检测是否撞击：可能是用户的赛车与障碍汽车相撞，也可能是障碍汽车之间的碰撞
    checkKnocked: function(car) {
        //查找与car相撞的汽车
        return this.cars.find(function(item, index) {
            //不是同一个汽车，并且在同一个跑道上car的顶部在item汽车内部或者car
            //的底部在 item汽车内部
            return car !== item && (car.lane == item.lane) && ((car.y > item.y && car.y < item.y + item.height) || (car.y + car.height > item.y && car.y + car.height < item.y + item.height))
        })
    },
    //游戏更新
    gameUpdate: function() {
        //遍历障碍汽车，判断相互之间是否相撞
        this.cars.forEach(function(car, index) {
            //更新汽车的纵坐标
            car.y += car.speed;
            //获取碰撞结果
            var result = this.checkKnocked(car);
            //如果有相撞的汽车，为了避免障碍汽车之间的撞击，设置两者的间距是5px
            if (result) {
                //如果car在result汽车上面
                if (car.y <= result.y) {
                    // car与result汽车的间距是5px-
                    car.y = result.y - car.height - 5
                        //如果car在result汽车底部
                } else {
                    //car与result汽车的间距是5px
                    car.y = result.y + result.height - 5
                }
                //两辆汽车的速度一致
                car.speed = result.speed
            }
            //如果汽车超出视图高度
            if (car.y > this.height) {
                //重置该汽车
                this.resetCar(car)
                    //发布重置汽车的消息
                this.trigger('ui.reset.car', car, index)
            } else {
                //渲染该汽车
                this.trigger('ui.render.car', car.y, index)
            }
        }.bind(this))
    },
    //重置汽车
    resetCar: function(car) {
        //随机产生一种类型
        var type = this.random(this.carInfo.length, true);
        //获取该类型汽车的信息
        var info = this.carInfo[type];
        //随机产生车道
        car.lane = this.random(3, true);
        //设置宽度
        car.width = info[0];
        //设置高度
        car.height = info[1];
        //设置速度
        car.speed = info[2];
        //设置类型
        car.type = type;
        //随机产生纵坐标
        car.y = -this.step * (2 * Math.random())
    },
    //检测用户的赛车是否与障碍汽车相撞
    checPlayerkKnocked: function(car) {
        //如果相撞
        if (this.checkKnocked(car)) {
            //游戏结束
            this.trigger('game.over')
        }
    },
    //检测用户的赛车是否与障碍汽车相撞
    checPlayerkKnocked: function(car) {
        //如果相撞
        if (this.checkKnocked(car)) {
            //游戏结束
            this.trigger('game.over')
        }
    },
    //赛车减速
    knockBreak: function() {
        this.cars.forEach(function(car) {
            //保证赛车虚拟速度大于2
            if (car.speed > 2) {
                //赛车减速
                car.speed -= 1;
            }
        })
    }
})