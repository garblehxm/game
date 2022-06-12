Ickt("UI", {
    //订阅消息
    message: {
        //订阅展示奖品的消息
        'ui.showPrize': 'showPrize',
    },
    //为构造函数定义静态属性
    //定义指针区间偏移度数（为了避免指针指向边界，造成误解），首尾的偏移量设置为10
    beforeInstall: function() {
        this.OFFSET = 10; //6个奖品均分360°this.ITEM = 360 / 6;
        //数组中每个成员代表每个奖品的起始角度（为了避免指针指向边界，首尾的偏移量设置为10）
        this.AREA_START = [
                //特等奖
                this.ITEM * 3 + this.OFFSET,
                //一等奖
                this.ITEM * 5 + this.OFFSET,
                //二等奖
                this.ITEM * 1 + this.OFFSET,
                //三等奖
                this.ITEM * 4 + this.OFFSET,
                //四等奖
                this.ITEM * 2 + this.OFFSET,
                //谢谢参与
                this.ITEM * 0 + this.OFFSET
            ]
            //创建一个元素，找出当前浏览器支持的前缀
        var element = document.createElement('div');
        //分割字符串，遍历过渡属性数组，找到元素支持的属性
        this.TRANSFORM = 'transform WebkitTransform MozTransform msTransform OTransfom'.split('').find(function(value) {
                return element.style[value] == undefined
            })
            //如果没找到支持的属性，说明浏览器版本过低，无法实现转盘动画
        if (!this.TRANSFORM) {
            alert('您的浏览器不支持转盘特效，请更换浏览器')
        }
    },
    //构造函数
    initialize: function() {
        //创建转意宓器
        this.createElement('container', document.getElementById('app'))
            //创建转盘
        this.createElement('table', this.container)
            //创建转盘周围的白点
        this.createElement('point', this.container)
            //创建转盘上的箭头
        this.createElement('arrow', this.container)
            //玩家摇奖次数
        this.times = 0;
    },
    /** 创建元素
    ekey
    实例化对象中存储的属性名称
    · econtainer
    DOM渲染的容器元素为元素设置的类名
        + ecls **/
    createElement(key, container, cls) {
        //创建div元素
        this[key] = document.createElement('div')
            //为元素添加类
        this[key].className = cls || key;
        //将该元素渲染到容器元素中
        container.appendChild(this[key])
    },
    // 摇奖动画
    // 展示的奖品索引值
    showPrize: function(value) {
        //根据奖品索引值计算出箭头最终指向的角度：奖品起始角度+奖品区间随机角度（去除首尾10°的/ / 偏移量）=最终角度
        var angle = this.consts('AREA_START')[value] + Math.random() * (this.consts('ITEM') - this.consts('OFFSET') * 2); //玩家摇奖次数加1
        this.times++;
        //设置转盘转动的角度，在摇奖过程中，保证每次至少转10圈
        this.table.style[this.consts('TRANSFORM')] = 'rotate(' + (360 * 10 * this.times - angle) + 'deg)';
        //设置转盘上的白点的转动角度，保证每次至少转动一圈
        this.point.style[this.consts('TRANSFORM')] = 'rotate(-' + 360 * this.times + 'deg)';

    }
})