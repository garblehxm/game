IView('Player', {
    message: {
        //玩家选中图片
        'player.choose': 'chooseImage',
        //玩家选择的两张图片可以连接
        'player.choose.right': 'chooseRight',
        //玩家选择的两张图片不能连接
        'player.choose.wrong': 'chooseWrong'
    },
    //构造函数
    initialize: function() {
        //上一张图片的id（用来判断是否是同一张图片）
        this.lastImageId = 0;
        //上一张图片的索引值（图片id相同，但是索引值不同）
        this.lastIndex = 0;
        //是否选中一张图片
        this.hasChoose = false;
    },
    //选择一张图片
    chooseImage: function(id, index) {
        //如果单击过，判断两次单击是否匹配
        if (this.hasChoose) {
            //如果图片id相同，但是单击了同一张图片，是不能连接的
            if (this.lastImageId === id && this.lastIndex !== index) {
                //发送消息，比较两张图片
                this.trigger('map.compare', index, this.lastIndex, id)
            } else {
                //单击错误，更新id和索引值
                this.chooseWrong(id, index)
                    //没有单击过，是第一次单击
            }
        } else {
            //设置第一次单击的id
            this.firstChoose(id, index)
        }
    },
    //选择正确
    chooseRight: function(id, index) {
        //隐藏上-张图片
        this.trigger('map.hide', this.lastIndex)
            //隐藏当前图片
        this.trigger('map.hide', index)
            //正确地选中图片后，用户要重新选择
        this.hasChoose = false;
    },
    //选择错误
    chooseWrong: function(id, index) {
        //不相等，当前图片被选中，取消选中上一张图片
        this.trigger('map.change', this.lastIndex);
        this.trigger('map.change', index);
        //更新id
        this.lastImageId = id;
        //更新索引值
        this.lastIndex = index;
        this.hasChoose = false;
    },
    //第一次选中
    firstChoose: function(id, index) {
        //将当前图片变成红色
        this.trigger('map.change', index, 'red');
        //存储id
        this.lastImageId = id;
        //存储索引值
        this.lastIndex = index;
        //已经单击过，再次单击，用于验证是否相同
        this.hasChoose = true;
    },
    ready: function() {
        this.trigger('game.start')
    },
    gameOver: function() {
        alert('游戏结束！');
        this.trigger('game.start')
    },
    gameSuccess: function() {
        alert('恭喜你通关了！');
    },

})