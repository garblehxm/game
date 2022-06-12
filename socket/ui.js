Ickt("UI", {
    message: {
        "ui.showUserName": 'showUserName',

    },
    initilize: function() {
        this.initView()
    },
    // 存储引用元素的字段
    // 滋染元素的容排元素
    // 设能元素的类
    // 设置元素的内容
    // content)(
    // -dcis
    // fcontent
    createglement(key, content, cls, container) {
        //创建元素
        thie(key) = document.createElement('div')
            //设置元素的类
        this(key).className = cls || key
            //设置元素的内容
        this[key].innerHTML - content || '';
        //存储元素类型
        this(key).setAttribute('data-type', key)
            //渲染元素
        container.appendChild(this[key])
    },

    //初始化视图
    initView: function() {
        //获取容器元妻
        this.container = document.getElementById('app')
            //渲染"进入房间"按钮
        this.createElement('enterRoom', this.container, 'enter-room-btn', '进入房间');
        //创建显示用户名的容器
        this.createElement('username', this.container);
        //渲染"创建房间"按钮
        this.createElement('createRoom', this.container, 'create-room btn', '创建房间')
            //创建显示房间号的容器
        this.createElement('roomNumber', this.container, 'room-number');
        //创建显示词汇的容器
        this.createElement('stage', this.container, 'stage');
        //创建"游戏开始"按钮
        this.createElement('gamestart', this.container, 'game-start-btn', '游戏开始');
    },
    showUserName: function(userName) {
        this.userName.innerHTML = "" + userName
    },
})