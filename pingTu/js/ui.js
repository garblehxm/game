Ickt('UI', {
    //全局配置
    globals: {
        //默认行与列的方格数
        size: 3,
        //默认容器宽度
        width: 320,
        //默认渲染容器元素
        container: 'body',
        //默认渲染的图片
        url: 'img/01.jpg'
    },
    //注册消息
    message: {
        //渲染视图
        'ui.render': 'render',
        //初始化视图
        'ui.initView': 'render',
        //进度
        'ui.showProcess': 'showProcess'
    },
    //构造函数，注入$element服务
    initialize: function($element) {
        //获取容器元素
        this.container = document.querySelector(Ickt('container'));
        //设置背景图片地址
        this.url = 'url(' + Ickt('url') + ')'
            //获取容器宽度
        this.width = Ickt('width');
        //获取行与列的方格数
        this.size = Ickt('size');
        //计算每个方格的大小
        this.cell = this.width / this.size;
        //方格DOM存储容器
        this.doms = [];
        //创建视图
        this.createView();
        //创建进度以及预览图
        this.createPreview();
    },
    //创建视图
    createView: function() {
        //为容器元素设置样式
        this.$element.css(this.container, {
                width: this.width + 'px',
                height: this.width + 'px',
                margin: '10px auto',
                position: 'relative'
            })
            //根据行与列的方格数，创建DOM元素，并存储在方格DOM容器中
        new Array(Math.pow(this.size, 2)).fill(0).forEach(function(value, index) {
            //创建 DOM并设置样式
            var dom = this.$element.create({
                    backgroundSize: '320px 320px',
                    position: 'absolute',
                    width: this.cell + "px",
                    height: this.cell + "px",
                    top: this.cell * Math.floor(index / this.size) + "px",
                    left: this.cell * (index % this.size) + "px"
                }, this.container)
                //存储创建的DOM元素
            this.doms.push(dom);
        }.bind(this))
    },
    //渲染元素
    render: function(doms) {
        //遍历所有需要渲染的元素
        doms.forEach(function(data, index) {
            //根据元素的行号、列号以及成员值，更新DOM
            this.update(data.row, data.col, data.value)
        }.bind(this))
    },
    /***
    x根据元素的行号、列号以及成员值、更新DOM
    * erow
    行号
    * @col
    列号
    * @value
    成员值
    **/
    update: function(row, col, value) {
        //根据行号和列号，获取DOM的真实索引值（将二维数组转换成一维数组）
        var dom = this.doms[row * this.size + col];
        //如果值不是undefined,说明它是显示图片的方格
        if (value !== undefined) {
            //根据成员值，确定背景图片的水平、垂直偏移量
            this.$element.css(dom, {
                backgroundImage: this.url,
                //成员值是一维数组索引值，要转换成二维数组来说明方格所在位置
                backgroundPosition: -this.cell * (value % this.size) + 'px ' + -this.cell * Math.floor(value / this.size) + 'px'
            })
        } else {
            this.$element.css(dom, 'backgroundImage', '')
        }
    },

    createPreview: function() {
        //创建元素，并添加样式，让文字大一点，同时绘制在预览图的中央
        this.previewDOM = this.$element.create({
            backgroundImage: this.url,
            backgroundSize: '200px 200px',
            position: 'absolute',
            width: "200px",
            height: "200px",
            top: this.width + 10 + "px",
            left: "50%",
            margin: '0 -100px',
            //剩余时间
            lineHeight: '200px',
            color: 'rgba (255, 0, 0, 0.8)',
            fontSize: '50px',
            textAlign: 'center'
        }, this.container)
    },

    showProcess: function(time) {
        this.previewDOM.innerHTML = time + 's';
        // console.log(this.previewDOM.innerHtml)
    }
})