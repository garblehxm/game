IView('Map', {
    dependences: ['VDom'],
    globals: {
        size: 3,
    },

    //订阅消息
    message: {
        //游戏结束
        'player.gameOver': 'gameover'
    },
    //游戏结束
    gameOver: function() {
        this.gameStart = false;
    },
    //游戏通关检测
    checkGameOver: function() {
        //最后一个位置是空格，值为undefined
        if (this.blocks[this.size - 1][this.size - 1] === undefined) {
            //假设游戏通关
            var result = true;
            //将二维数组转换成一维数组
            Array.prototype.concat.apply([], this.blocks)
                //过滤最后一个空格的undefined 值
                .slice(0, -1)
                //从前向后遍历，判断图片的索引值是否依次递增
                .reduce(function(res, value) {
                    //如果当前的值小于上一个值，游戏没有结束
                    if (res > value) {
                        result = false;
                        //返回当前值，作为下一次比较的第一个参数
                    }
                    return value
                })
                //发布结果
            return result
        }
    },
    initialize: function() {
        this.size = IView('size');
        this.gameStart = false;

        this.initMap();
        this.empty = {
            col: this.size - 1,
            row: this.size - 1
        }
    },

    ready: function() {
        this.trigger('vdom.initView', this.blocks);
    },

    initMap() {
        var size = this.size;
        var all = Math.pow(size, 2);
        var arr = new Array(all).fill(0).map(function(value, index) {
            return index === all - 1 ? undefined : index;
        }).sort(function() {
            return Math.random() > .5 ? 1 : -1;
        })
        this.blocks = new Array(size).fill(0).map(function(value, row) {
            return new Array(size).fill(0).map(function(v, col) {
                return arr[size * row + col];
            })
        })
    },
    // 原则上，虽然操作简单，每次只有两个元素变化，但是由于虚拟DOM这套架构模式，我们还是让虚拟DOM
    //先比较后渲染，使虚拟DOM的功能更直观
    //引入 game 模块的问题：在每个模块内部存储 gameover 变量，模块的通信复杂
    //移动滑块
    move: function(des, isX) {
        //如果游戏结束，提示用户，并阻止执行
        if (this.gameStart) {
            alert('游戏已经结束')
            return;
        }
        //检测游戏是否结束
        if (this.checkGameOver()) {
            //游戏结束
            this.gameOver();
            //向进度模块发布游戏结束的消息
            this.trigger('process.gameOver')
                //防止程序中断
            setTimeout(function() {
                alert('恭喜你过关')
            })
        }
        //获取空格的行号和列号
        var col = this.empty.col;
        var row = this.empty.row;
        //如果是水平方向的移动（左右移动）
        if (isX) {
            //更新列号
            if (this.checkPositionValid(col)) {
                col += des;
                //检测是否可以更新
                this.updateBlock(row, col);
                //更新方格
            }
            //如果是垂直方向的移动（上下移动）
        } else {
            //更新行号
            row += des;
            if (this.checkPositionValid(row)) {
                //检测是否可以更新
                this.updateBlock(row, col);
                //更新方格
                this.trigger('vdom.render', this.blocks)
                    // 通知虚拟DOM更新方格
            }
        }
    },
    /***
        *更新方格
        行号
        * erow
        列号
        * @col
        **/
    updateBlock: function(row, col) {
        //交换空格的位置（让空格与目标方格交换索引值）
        this.blocks[this.empty.row][this.empty.col] = this.blocks[row][col];
        //设置空格
        this.blocks[row][col] = undefined;
        //存储当前空格的行号和列号
        this.empty.col = col;
        this.empty.row = row;
    },
    //检测是否可以更新
    checkPositionValid: function(value) {
        //如果行号和列号在有效范围内，可以更新
        return value >= 0 && value < this.size;
    },
    //订阅向上滑动的事件
    eventSwipeUp: function() {
        //向上移动一个位置
        this.move(1, false)
    },
    //订阅向下滑动的事件
    eventSwipeDown: function() {
        //向下移动一个位置
        this.move(-1, false)
    },
    //订阅向右滑动的事件
    eventSwipeRight: function() {
        //向右滑动一个位置
        this.move(-1, true)
    },
    //订阅向左滑动的事件
    eventSwipeLeft: function() {
        //向左滑动一个位置
        this.move(1, true)
    }
})