Ickt('UI', {
    //全局配置信息
    globals: {
        //默认容器元素
        container: 'body',
        //容器高度
        height: 320,
    },
    //注册消息
    message: {
        //渲染车道
        'ui.render.road': 'renderRoad',
        //渲染玩家的赛车
        'ui.render.player': 'renderPlayer',
        // 渲染减速带
        'ui.render.breaker': 'renderBreaker',
        //渲染障碍汽车
        'ui.render.car': 'renderCar',
        //重置障碍汽车
        'ui.reset.car': 'resetCar',
        //渲染汽车相撞后爆炸的特效
        'ui.render.bomb': 'renderBomb'
    },
    //渲染车道
    renderRoad: function(y) {
        //车道向下移动，所以更新纵坐标
        this.$element.css(this.roadDOM, {
            backgroundPositionY: y + 'px'
        })
    },
    //渲染玩家的赛车
    renderPlayer: function(pos) {
        console.log(pos)
            //玩家只能在3个车道上切换，因此设置横坐标
        this.$element.css(this.playerDOM, {
            left: this.lane[pos] + 15 + 'px'
        })
    },
    //渲染减速带
    renderBreaker: function(breaker) {
        //根据所在车道以及横坐标，设置减速带
        this.$element.css(this.breakerDOM, {
            left: this.lane[breaker.lane] + 'px',
            top: breaker.y + 'px'
        })
    },
    //渲染障碍汽车
    renderCar: function(y, index) {
        //障碍汽车只能在单一车道上移动，因此更新纵坐标
        this.$element.css(this.carDOMs[index], {
            top: y + 'px'
        })
    },
    //重置障碍汽车
    resetCar: function(car, index) {
        // console.log(this.carDOMs)
        //根据障碍汽车的索引值，找到需要重置的障碍汽车，并重置横坐标和纵坐标
        this.$element.css(this.carDOMs[index], {
            backgroundImage: this.getImage('car' + car.type),
            width: car.width + 'px',
            height: car.height + 'px',
            left: this.lane[car.lane] + (52 - car.width) / 2 + 'px',
            top: car.y + 'px'
        })
    },
    //渲染汽车相撞后爆炸的特效
    renderBomb: function(bomb) {
        //根据车道以及爆炸的纵坐标，创建爆炸元素，并渲染爆炸的特效
        this.$element.create({
            position: 'absolute',
            backgroundImage: this.getImage('bomb'),
            width: '49px',
            height: '57px',
            top: bomb.y - 7 + 'px',
            left: this.lane[bomb.lane] + 15 - 12 + 'px'
        }, this.roadDOM)
    },
    //构造函数，用于注入selement服务
    initialize: function($element) {
        //获取玩家汽车所在位置的纵坐标
        this.playerY = Ickt('playerY');
        //获取容器元素
        this.container = document.querySelector(Ickt('container'));
        //3条车道所在位置的横坐标
        this.lane = [36, 94, 152];
        this.carDOMs = [];
        //设置页面背景色
        this.$element.css(document.body, {
            backgroundColor: 'rgb (13, 57, 11)'
                //设置容器元素宽度、高度，并居中
        })
        this.$element.css(this.container, {
            width: '240px',
            height: '320px',
            margin: '0 auto'
        })
        this.initView();
    },

    //页面加载完成
    ready: function() {
        //获取障碍汽车的数量
        this.carNum = Ickt('carNum')
            //初始化视图
            // this.initView();
    },

    //封装获取图片的方法
    getImage: function(key) {
        //根据图片名称获取具有backoroundImaqe属性的图片的完整地址
        return 'url(img/' + key + '.png)';
    },

    //初始化视图
    initView: function() {
        //创建汽车赛道，如果视图溢出，要隐藏
        this.roadDOM = this.$element.create({
            backgroundImage: this.getImage('road'),
            height: '320px',
            position: 'relative',
            overflow: 'hidden'
        }, this.container);
        //为了使汽车减速，创建障碍元素
        this.breakerDOM = this.$element.create({
            position: 'absolute',
            // left: this.position.left + 'px',
            backgroundImage: this.getImage('breaker'),
            width: '52px',
            height: '8px',
            top: '-20px'
        }, this.roadDOM);
        //创建障碍汽车容器数组
        this.carDOMs = [];
        //创建障碍汽车元素
        for (var i = 0; i < 3; i++) {
            this.carDOMs.push(this.$element.create({
                position: 'absolute',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }, this.roadDOM))
        }
        //创建玩家汽车
        this.playerDOM = this.$element.create({
            position: 'absolute',
            backgroundImage: this.getImage('userCar'),
            width: '25px',
            height: '43px',
            top: this.playerY + 'px',
            left: this.lane[1] + 15 + 'px'
        }, this.roadDOM)
    }
})