// UI组件
Ickt('UI', 'Component', {
    //组件渲染的容器元素
    el: '#list',
    //样式
    style: '../css/style.css',
    //模板选择器
    template: '#tpl_ui',
    //绑定的数据
    //《连连看》中每幅图片的数据
    data: {
        list: []
    },
    //绑定的消息
    message: {
        //初始化视图
        'ui.init': 'init',
        //渲染视图
        'ui.render': 'render'
    },
    //渲染一个成员
    render: function(index, item) {
        //更细视图就是更新数据
        this.$list[index] = Object.assign({}, item);
    },
    initialize: function() {
        // this.render()
    },
    //初始化视图
    init: function(list) {
        //对于MVVM模式中的数据驱动视图，初始化视图就是初始化数据
        this.$list = list.map(function(item) {
            //复制该数据，防止在其他模块中修改数据会影响到UI模块
            return Object.assign({}, item)
        });
    },

    //单击图片的回调函数
    chooseImage: function(id, index, e) {
        //事件对象
        // console.log (e)
        //向玩家模块发布选择图片的消息
        this.trigger('player.choose', id, index)
    },
})