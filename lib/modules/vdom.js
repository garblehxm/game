//虚拟DOM模块
Ickt('VDom', {
    //要发布UI消息，因此依赖UI模块
    dependences: ['UI'],
    //注册消息
    message: {
        //视图初始化消息
        'vdom.initView': 'initView',
        //更新渲染视图的消息
        'vdom.render': 'render'
    },
    //构造函数
    initialize: function() {
        //在构造函数中，初始化默认状态的虚拟DOM
        this.vdoms = []
    },
    /***
    ﹡初始化视图
    传递的数据
    @data
    **/

    //更新完虚拟DOM，发布初始化视图的消息
    initView: function(data) {
        this.trigger('ui.initView', this.merge(data))
    },

    /*
    更新渲染视图消息的回调函数
    传递的数据
    * @data
    **/
    render: function(data) {
        //对比上一个状态的虚拟 DOM
        var result = this.merge(data)
            //如果有需要更新的虚拟DOM
        if (result.length) {
            // 更新视图
            this.trigger('ui.render', result);
        }
    },

    /*
    对比上一个状态的虚拟DOM
    传递的数据* data
    */
    merge: function(data) {
        //比较结果
        //在棋牌（方格）类游戏中，虚拟DOM存储在一个二维数组中，row代表行，co1代表列
        var diff = [];
        //遍历行数据
        data.forEach(function(arr, row) {
                if (!this.vdoms[row]) {
                    //列数组不存在，初始化空数组
                    this.vdoms[row] = [];
                }
                //遍历列数组中每一个成员
                arr.forEach(function(value, col) {
                    //如果值发生了改变
                    if (this.vdoms[row][col] !== value) {
                        //存储发生改变的虚拟DOM
                        diff.push({
                            row: row,
                            col: col,
                            value: value,
                        })
                    }
                    //更新内部维护的虚拟DOM，由于是值类型，因此可以直接赋值
                    this.vdoms[row][col] = value;
                }.bind(this))
            }.bind(this))
            //返回比较结果
        return diff;
    }
})