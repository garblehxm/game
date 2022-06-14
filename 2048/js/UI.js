IView('UI', {
    //定义全局默认配置数据
    globals: {
        //方格宽度
        unit: 80,
        //方格数量
        num: 4,
        //容器
        container: 'app'
    },
    //注册消息
    message: {
        //初始化视图
        'ui.initView': 'initView',
        //渲染视图
        'ui.render': 'render'
    },
    //构造函数
    //获取方格容器的尺寸：方格之间的间距是方格宽度的1/4，假设一行有4个方格，
    initialize: function() {
        //容器两边的间距也是方格宽度的1/4
        var size = IView('unit') * (IView('num') * 1.25 + 0.25);
        //获取容器
        this.container = document.getElementById(IView('container'));
        //设置容器样式
        this.container.style = 'width: ' + size + 'px; height:' + size + 'px;margin: 20px auto;background: gray;position: relative;';
        //缓存DOM元素，防止每次渲染时再次获取
        this.doms = [];
    },

    //初始化视图
    initView: function(map) {
        var me = this;
        //遍历需要更新的数据
        map.forEach(function(obj) {
            //根据数据创建DOM
            var item = me.create(obj.value, obj.row, obj.col); //存储DOM到对应的位置
            me.doms[obj.row] = me.doms[obj.row] || [];
            me.doms[obj.row][obj.col] = item
        })
    },
    render: function(diffs) {
        //渲染更新的数据
        var me = this;
        //遍历已经更新的数据
        diffs.forEach(function(obj) {
            //更新元素
            me.updateDom(me.doms[obj.row][obj.col], obj.value)
        })
    },
    updateDom: function(dom, value) {
        //更新DOM
        dom.style.display = value ? 'block' : 'none'
            //设置内容
        dom.innerHTML = value;
    },
    //数字大于0，显示该元素
    create: function(value, top, left) {
        //创建元素
        var dom = document.createElement('div');
        //创建DOM
        dom.style.background = "#ccc";
        //添加样式
        dom.style.textAlign = "center";
        dom.style.position = "absolute";
        dom.style.fontSize = this.getFontSize(value);
        dom.style.lineHeight = IView('unit') + "px";
        dom.style.width = IView('unit') + "px";
        dom.style.height = IView('unit') + "px"; + 'px';
        dom.style.top = this.getSize(top) + "px";
        dom.style.left = this.getSize(left) + 'px';
        //复用updateDom更新内容以及显/隐
        this.updateDom(dom, value);
        //渲染元素
        this.container.appendChild(dom);
        // 返回创建的DOM
        return dom;
    },
    //获取字体大小
    getFontSize: function(value) {
        //位数越长，字体越小（因为空间有限）
        return 50 - 5 * String(value).length;
    },

    //获取位置
    getSize: function(val) {
        //获取方格的单位长度
        var unit = IView('unit');
        //返回位置
        return unit * 0.25 + unit * 1.25 * val;
    }
})