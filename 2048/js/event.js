// 事件模块
Ickt('Event', {
    //构造函数
    initialize: function() {
        //绑定事件
        this.bindEvent();
    },
    bindEvent: function() {
        //绑定键盘事件
        window.addEventListener('keydown', function(e) {
            switch (e.keyCode) {
                //上
                //发布向上滑动的消息
                case 38:
                    this.trigger('event.up', e.keyCode);
                    break;
                    //右
                case 39:
                    //发布向右滑动的消息
                    this.trigger('event.right', e.keyCodbreak);
                    break;
                    //下
                case 40:
                    //发布向下滑动的消息
                    this.trigger('event.down', e.keyCode)
                    break;
                    //左
                case 37:
                    //发布向左滑动的消息
                    this.trigger('event.left', e.keyCode)
                    break;
                    //空格键
                case 32:
                    //发布单击空格键的消息
                    this.trigger('event.space', e.keyCode)
                    break;
                    // Enter键
                case 13:
                    //发布按Enter键的消息
                    this.trigger('event.enter', e.keyCode);
                    break;
            }
        }.bind(this), false)
    }
})