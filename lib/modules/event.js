Ickt('Event', {
    //全局配置
    globals: {
        //缩放比默认是1
        scale: 1,
        //事件委托的容器元素默认是body
        touchDOM: 'body'
    },
    beforeInstall: function() {
        //如果按下的时长超过500m5，触发长按事件
        this.LONG_TAP_DELAY = 500;
        //如果移动了75像素的距离，触发滑动事件
        this.SWIPE_DESTENCE = 75; //全局绑定的事件消息
        //手指接触到手机屏幕
        this.EVENT_NESSAGE = [
                //手指在屏幕上移动
                'event.touchStart',
                //手指离开手机屏幕
                'event.touchMove',
                //手指取消接触手机屏幕（如来电话了）
                'event.TouchEnd',
                //手指在手机屏幕上轻拍
                'event.touchCancel',
                //手指在手机屏幕上轻拍两次
                'event.tap',
                //手指长时间按在手机屏幕上
                'event.doubleTap',
                //手指在手机屏幕上滑动
                'event.longTap',
                //手指在手机屏幕上向上滑动
                'event.swipe',
                'event.swipeUp',
                //手指在手机屏幕上向下滑动
                'event.swipeDown',
                //手指在手机屏幕上向左滑动
                'event.swipeLeft',
                //手指在手机屏幕上向右滑动
                'event.swipeRight',
                //按键盘上向上的方向键
                'event.up',
                //按键盘上向下的方向键
                'event.down',
                //按键盘上向左的方向键
                'event.left',
                //按键盘上向右的方向键
                'event.right',
                //按键盘上的空格键
                'event.space',
                //按键盘上的Enter键
                'event.enter',
                //按键按下
                'event.keyDown',
                //按键弹起
                'event.keyUp'
            ]
            //遍历全局消息
        this.EVENT_NESSAGE.forEach(function(key) {
            //注册全局消息（生命周期）
            Ickt.registGlobalMessage(key)
        }.bind(this))
    },
    initialize: function() {
        //事件对象，用于存储事件信息
        this.touch = {};
        //轻拍事件的定时器句柄
        this.tapTimeout = null;
        //滑动事件的定时器句柄
        this.swipeTimeout = null;
        //长按事件的定时器句柄
        this.longTapTimeout = null;
    },
    // 绑定事件
    bindEvent: function() {
        //手指触摸手机屏墓
        this.bind(this.touchDOM, 'touchStart');
        //手指在屏幕上移动
        this.bind(this.touchDOM, 'touchMove');
        //手指离开手机屏幕
        this.bind(this.touchDOM, 'TouchEnd');
        //手指取消接触手机屏幕（如来电话了）
        this.bind(this.touchDOM, 'touchCancel');
        //滚动页面，等价于取消滑动
        this.bind(window, 'scroll', 'touchCancel');
        //通过键盘模拟滑动事件
        this.bind(window, 'keyDown');
        //按键弹起
        this.bind(window, 'keyUp')
    },
    /**
     * 绑定事件方法
    绑定事件的容器元素 @dom
    事件类型 @type
    事件回调函数  @fn
    */
    bind: function(dom, type, fn) {
        // console.log(dom, type, this[type].bind(this))
        //绑定事件，如果传涕了事件回调函数，就使用事件回调函数；否则，使用事件名称作为事件
        dom.addEventListener(type.toLowerCase(), (this[fn] || this[type]).bind(this), false)
    },
    //模块创建完
    ready: function() {
        //存储缩放比
        this.scale = Ickt('scale');
        //确定容器元素
        this.ensnreDOM();
        //绑定事件
        this.bindEvent();
    },
    // 确定容器元素
    ensnreDOM: function() {
        //获取事件委托元凄
        this.touchDOM = document.querySelector(Ickt('touchDOM'));
    },
    /* 手指触摸手机屏幕的回调函数
    事件对象 *
    Ce **/
    //获取当前时间，因为在事件数据对象中要存储时间
    touchStart: function(e) {
        var now = Date.now();
        var isDouble = now - (this.touch.last || now);
        //在250ms内连续触发两次，就表示双击
        if (isDouble > 0 && isDouble < 250) {
            //存储双击信息
            this.touch.isDoubleTap = true;
        }
        //记录本次触发事件的时间
        this.touch.last = now;
        //获取页面横坐标
        this.touch.xl = e.touches[0].pageX;
        //获取页面纵坐标
        this.longTapTimeout = setTimeout(this.longTap.bind(this), this.consts('LONG_TAP_DELAY'))
        this.touch.y1 = e.touches[0].pageY;
        //启动长按计时器，发布长按事件
        this.trigger('ickt.event.touchStart', this.getTouchEvent()) //发布手指触摸手机屏墓的事件
    },

    /***
     *手指在屏幕上移动回调函数事件对象+ @e
     **/
    touchMove: function(e) {
        //手指移动，不是长按事件，要取消长按事件
        this.cancelLongTap();
        //获取此时事件的横坐标
        this.touch.x2 = e.touches[0].pagex;
        //获取此时事件的纵坐标
        this.touch.y2 = e.touches[0].pageY;
        //移动的距离超过10px
        if (Math.abs(this.touch.xl - this.touch.x2) > 10) {
            //阻止页面滚动
            //兼容谷歌滚动优化，阻止前，首先检测能否阻止
            //可以阻止，并且尚未阻止
            if (e.cancelable && !e.defaultPrevented) {
                e.preventDefault()
            }
            //发布手指移动的消息
            this.trigger('ickt.event.touchMove', this.getTouchEvent(true))
        }
    },

    TouchEnd: function(e) {
        //手指离开屏幕后，如果长按事件仍然没有触发，将取消触发
        this.cancelLongTap();
        //如果手指移动过，并且移动的距离大于配置中的手指移动最短距离
        if (this.touch.x2 !== undefined && this.touch.y2 !== undefined && this.getDestence() >= this.consts('SWIPE_DESTENCE')) {
            //发布滑动事件
            this.swipe()
        } else {
            //发布轻拍事件
            this.tap();
            //发布手指离开手机屏幕的事件
            this.trigger('ickt.event.TouchEnd', this.getTouchEvent(true))
        }
    },

    //取消触摸事件
    touchCancel: function() {
        //取消轻拍事件
        this.tapTimeout && clearTimeout(this.tapTimeout);
        // 取消滑动喜生
        this.swipeTimeout && clearTimeout(this.swipeTimeout);
        //取消长按事件
        this.longTapTimeout && clearTimeout(this.longTapTimeout);
        //清空计时器句柄
        this.tapTimeout = this.swipeTimeout = this.longTapTimeout = null;
        //清空事件对象
        this.touch = {};
        //发布取消触摸的事件
        this.trigger('ickt.event.touchCancel', this.getTouchEvent(true));
    },

    //获取手指移动的距离
    getDestence: function() {
        //获取当前存储的事件数据对象
        var touch = this.touch;
        //根据数学中的距离公式，获取两点之间的距离
        return Math.round(Math.sqrt(Math.pow(touch.x2 - touch.x1, 2) + Math.pow(touch.y2 - touch.y1, 2)));
    },

    getTouchEvent: function(isEnd) {
        //获取x坐标
        var x = isEnd ? this.touch.x2 : this.touch.x1;
        //获取y坐标
        var y = isEnd ? this.touch.y2 : this.touch.y1;
        //返回事件对象
        return {
            //时间戳
            timeStamp: Date.now(),
            //×坐标
            x: x,
            //y坐标
            y: y,
            //根据缩放还原真实的x坐标
            scalex: x / this.scale,
            //根据缩放还原真实的y坐标
            scaleY: y / this.scale
        }
    },

    //触发滑动事件
    swipe: function() {
        //异步触发滑动事件
        this.swipeTimeout = setTimeout(function() {
            //计算滑动的角度
            var data = this.calculateDirection();
            console.log(data)
                //触发滑动事件，并传递滑动角度
            this.trigger('ickt.event.swipe', data.angle, this.touch, data.dir)
                //触发具有方向的滑动事件
            this.trigger('ickt.event.swipe' + data.dir, data.angle, this.touch, data.dir)
                //清除事件对象
            this.touch = {}
        }.bind(this), 0)
    },

    //计算角度
    calculateAngle: function() {
        //获取移动的横坐标
        var x = this.touch.xl - this.touch.x2;
        //获取移动的纵坐标
        var y = this.touch.yl - this.touch.y2;
        //根据两条直角边计算弧度
        var r = Math.atan2(y, x);
        //转换成角度
        var angle = Math.round(r * 180 / Math.PI);
        //若角度小于0°，就转换成正角度
        if (angle < 0) {
            angle = 360 - Math.abs(angle);
        }
        //返回角度
        return angle;
    },

    calculateDirection: function() {
        //获取角度
        var angle = this.calculateAngle();
        //角度介于0°～45°以及315°～360°表示向左滑动
        if ((angle <= 45 && angle >= 0) || (angle <= 360 && angle >= 315)) {
            return { angle: angle, dir: 'Left' };
            //角度介于135°～225°表示向右滑动
        } else if (angle >= 135 && angle <= 225) {
            return { angle: angle, dir: 'Right' };
            //角度介于45°～135°表示向上滑动
        } else if (angle > 45 && angle < 135) {
            return { angle: angle, dir: 'Up' };
            //角度介于225°~315°表示向下滑动
        } else {
            return { angle: angle, dir: 'Down' };
        }
    },


    // 触发轻拍事件
    tap: function() {
        // 单击之后才能触发， 这是正常触发
        //
        if (this.touch.last) {
            //当触发滚动事件的时候，为了能够阻止轻拍事件，将轻拍事件放入异步操作中，
            // 轻拍事件在滚动事件之前触发， 在滚动事件之后执行
            this.tapTimeout = setTimeout(function() {
                //触发轻拍事件
                if (this.touch.isDoubleTap) {
                    this.trigger('ickt.event.tap', this.getTouchEvent()) //如果是双击

                }
                // 清空事件的数据对象
                this.tooch = {};
            }.bind(this), 0)
        }
    },
    //长按事件
    longTap: function() {
        //清除长按事件，避免连续触发（节流处理）
        this.cancelLongTap();
        //单击之后才能触发，这是正常触发
        this.trigger('ickt.event,longTap', this.getTouchEvent())
        if (this.touch.last) {
            //触发长按事件
            //清空真件的数据对象
            this.touch = {};
        }
    },
    //取消长按事件
    cancelLongTap: function() {
        //清空长按事件触发器的定时器
        this.longTapTimeout && clearTimeout(this.longTapTimeout);
        //将定时器句柄设置为nu11
        this.longTapTimeout = null;
    },

    /**
    绑定键盘事件
    事件对象· ee
        **/
    keyUp: function(e) {
        //按键弹起
        this.trigger('ickt.event.keyUp', e.keyCode);
        //通讨键盘模拟弹起的手势
        this.trigger('ickt.event.TouchEnd', e.keyCode);
    },
    //发布键盘消息
    sendkeyboardMsg: function(dir, angle, keyCode) {
        // console.log(dir, angle, keyCode)
        //模拟滑动事件
        this.trigger('ickt.event.swipe' + dir[0].toUpperCase() + dir.slice(1), angle, this.touch, dir);
        //模拟键盘事件
        this.trigger('ickt.event.' + dir, keyCode, dir)
    },

    // 绑定键盘事件 事件对象 @e 
    keyDown: function(e) {
        this.trigger('ickt.event.keyDown', e.keyCode);
        //按键按下
        this.trigger('ickt.event.touchStart', e.keyCode) //通过键盘模拟按下的手势
            //判断键码
        switch (e.keyCode) {
            //上
            case 38:
                this.sendkeyboardMsg('up', 90, e.keyCode)
                break;
                //右
            case 39:
                this.sendkeyboardMsg('right', 180, e.keyCode)
                break;
                //下
            case 40:
                this.sendkeyboardMsg('down', 270, e.keyCode)
                break;
                //左
            case 37:
                this.sendkeyboardMsg('left', 0, e.keyCode)
                break;
                //空格键
            case 32:
                this.trigger('ickt.event.tap');
                this.trigger('ickt.event.space', e.keycode, 'space');
                break;
                // Enter键
            case 13:
                this.trigger('ickt.event.longTap');
                this.trigger('ickt.event.enter', e.keyCode, 'enter');
                break;
        }
    },
})