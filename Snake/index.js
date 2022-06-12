//蛇实例化对象
function Game(id, snake, food) {
    //获取容器
    this.mapDom = document.getElementById(id);
    this.snake = snake;
    //食物实例化对象
    this.food = food;
    //地图数组
    this.map = [];
    //障碍物数组
    this.stone = [];
    //游戏主循环句柄
    this.timer = null;
    //游戏行数
    this.row = 20;
    //游戏列数
    this.col = 20;
    //方格的宽度
    this.cell = 20;
    //游戏分数
    this.score = 0;
    //游戏结束分数
    this.levelScore = 20;
    //初始化游戏
    this.init();
}
//游戏初始化方法
Game.prototype.init = function() {
    //初始化地图容器元素样式
    this.initMapStyle();
    //渲染地图
    this.renderMap();
    //渲染蛇
    this.renderSnake();
    this.start();
    // 绑定事件
    this.bindEevnt();
    this.resetFood();
    this.initScoreStyle()
}
Game.prototype.start = function() {
        var me = this;
        this.timer = setInterval(function() {
            me.snake.move();
            me.checkEatFood()
            if (me.checkBorder() || me.checkStone() || me.snake.kill()) {
                me.gmaeOver();
                return;
            }
            if (me.checkFood()) {
                me.snake.growUp();
                me.resetFood();
            }
            me.clear();
            me.renderSnake();
            me.renderFood();
        }, 100);
    }
    //初始化地图容器元素样式
Game.prototype.initMapStyle = function() {
        //设置类"+="避免影响原有类
        this.mapDom.className += ' game';

        //设置宽与高
        this.mapDom.style.width = this.col * this.cell + 'px'
        this.mapDom.style.height = this.row * this.cell + 'px'
    }
    //渲染地图
Game.prototype.renderMap = function() {
    //渲染地图，地图由行和列组成
    //遍历行
    for (var i = 0; i < this.row; i++) {
        //行是一个具有row类的div元素
        var row = document.createElement("div");
        row.className = "row";
        //*为了方便在JavaScript中操作DOM，将DOM缓存在数组中，由于不能在
        // 一次循环中缓存所有的DOM元素，因此先将每一行元素缓存在一个数组中
        var arr = [];
        //遍历列
        for (var j = 0; j < this.col; j++) {
            //列是一个具有co1类的div元素
            var col = document.createElement("div");
            col.className = "col";
            //将每个列元素插入行元素中
            row.appendChild(col);
            //缓存到行数组中
            arr.push(col);
        }
        //将每一行缓存到地图数组中
        this.map.push(arr);
        //将行元素插入地图容器元素中
        this.mapDom.appendChild(row);
    }
}
Game.prototype.renderSnake = function() {
    //绘制蛇的方法
    //获取蛇的长度
    //遍历蛇的身体，并在画布中进行绘制，即更改DOM的背景色
    var length = this.snake.length;
    for (var i = 0; i < length; i++) { //头是红色的，身子是橘黄色的
        this.map[this.snake[i].row][this.snake[i].col].style.background = i === 0 ? "red" : "orange";
    }
}
Game.prototype.bindEevnt = function() {
        var me = this;
        window.onkeydown = function(e) {
            var kc = e.keyCode;
            if (kc === 37 || kc === 38 || kc === 39 || kc === 40) {
                me.snake.changeDirection(kc)
            }
        }
    }
    /** 检测蛇是否撞墙
     检测蛇头部的横纵（行与列）坐标是否出界，即小于0或者大于或等于长度于长度是20的数组中
     ·返回值表示是否出界，true表示出界，false表示未出界
     组成员0就算出织此如，20个数组成员中最后一个成员的索引值是19，因此于或等于20就算出界）**/
Game.prototype.checkBorder = function() {
    if (this.snake[0].row >= 20 || this.snake[0].row < 0 || this.snake[0].col >= 20 || this.snake[0].col < 0) {
        return true;
    }
}
Game.prototype.gmaeOver = function() {
    clearInterval(this.timer);
    alert("游戏结束")
}
Game.prototype.renderFood = function() {
    this.map[this.food.row][this.food.col].style.background = "purple";
}

Game.prototype.checkFood = function() {
    if (this.food.row === this.snake[0].row && this.food.col === this.snake[0].col) {
        return true;
    }
}
Game.prototype.resetFood = function() {
    var row = Math.random() * 20 >> 0;
    var col = Math.random() * 20 >> 0;
    if (this.snake[0].row === row && this.snake[0].col === col) {
        this.resetFood()
        return;
    }
    for (var i = 0; i < this.stone.length; i++) {
        if (this.stone[j].row === row && this.snake[j].col === col) {
            this.resetFood()
            return;
        }
    }
    this.food.row = row;
    this.food.col = col;
}
Game.prototype.initScoreStyle = function() {
    this.scoreDom = document.createElement('div');
    this.scoreDom.className = "score";
    this.scoreDom.innerHTML = 0;
    this.mapDom.appendChild(this.scoreDom);
    this.renderSocre()
}

Game.prototype.renderSocre = function() {
    this.scoreDom.innerHTML = this.score;
}
Game.prototype.checkEatFood = function() {
    if (this.food.row === this.snake[0].row && this.food.col === this.snake[0].col) {
        this.score++;
        this.renderSocre();
        if (this.score >= this.levelScore) {
            this.gmaeOver();
            alert("恭喜你通关");
        }
        return true;
    }
}
Game.prototype.renderStone = function() {
    for (var i = 0; i < this.stone.length; i++) {
        this.map[this.stone[i].row][this.stone[i].col].style.background = 'black'
    }
}
Game.prototype.checkStone = function() {
    if (this.stone.row === this.snake[0].row && this.stone.col === this.snake[0].col) {
        return true;
    }
}

//蛇类
function Snake() {
    //将蛇看成类数组对象，每个成员代表蛇身体的一部分，里面存放的是坐标
    //以下是蛇的初始化坐标
    this[0] = { row: 10, col: 9 };
    this[1] = { row: 10, col: 8 };
    this[2] = { row: 10, col: 7 };
    //保存蛇身体的长度
    this.length = 3;
    //存储蛇尾的节点信息
    this.tail = null;
    //*方向属性，由于目前用键盘模拟，因此按键的keyCode（键盘事件对象的属性，表示键，如问上的方
    /*方向：左对应的键码是37，上对应的键码是38，右对应的键码定39，下对应的键码是40
    向键的编码是38） 默认向右 */
    this.direction = 39;
}
//蛇实例化对象是一个类数组对象，为了方便对其操作，复制数组的常用方法
Snake.prototype.pop = Array.prototype.pop;
Snake.prototype.unshift = Array.prototype.unshift;
Snake.prototype.push = Array.prototype.push;

//移动蛇的方法
Snake.prototype.move = function() {
        //删除并存储尾部节点
        this.tail = this.pop();
        //如果方向是向右的
        if (this.direction === 39) {
            //在头部加入该节点
            this.unshift({
                row: this[0].row,
                //方向向右，水平分量co1加1
                col: this[0].col + 1
            });
            //如果方向是向上的
        } else if (this.direction === 38) {
            //在头部加入该节点
            this.unshift({
                //方向向上，垂直分量row减1
                row: this[0].row - 1,
                col: this[0].col
            });
            //如果方向是向左的
        } else if (this.direction === 37) {
            //在头部加入该节点
            this.unshift({
                row: this[0].row,
                //方向向左，水平分量co1减1
                col: this[0].col - 1
            });
            //如果方向是向下的
        } else if (this.direction === 40) {
            //在头部加入该节点
            this.unshift({
                //方向向下，垂直分量row加1
                row: this[0].row + 1,
                col: this[0].col
            });
        }
    }
    //清除地图样式
Game.prototype.clear = function() {
        //遍历地图中的所有元素，地图中的元素保存在20*20的一个二维数组中
        //第一维表示行
        for (var row = 0; row < this.map.length; row++) {
            //第二维表示列
            for (var col = 0; col < this.map[row].length; col++) {
                //清除样式
                this.map[row][col].style = "";
            }
        }
    }
    //改变蛇的方向的方法
Snake.prototype.changeDirection = function(direction) {
        if (Math.abs(this.direction - direction) === 2) {
            return;
        }
        this.direction = direction;
    }
    //蛇吃了食物后，会变长
Snake.prototype.growUp = function() {
        this.push(this.tail)
    }
    //如果移动的蛇碰到自身，就会被杀死
    /***
    *检测移动的蛇，如果碰到自身会被杀死
    true表示自杀，false表示非自杀（无返回值会转换成false）
    *返回值表示是否自杀，**/
Snake.prototype.kill = function() {
    /*判断蛇头是否与身体重叠，就是判断每一点的横纵坐标是否相同，为了方便理解，
    我们从第4成员（索引值是1开始判断，但是理论上，在我们的模型中，能能捞屑否相颩与头后面的两个节点是无法相撞的，因此可以从第4个节点开始判断**/
    for (var i = 1; i < this.length; i++) {
        //判断两个节点是否重合
        if (this[0].row === this[i].row && this[0].col === this[i].col) {
            //如果重合，说明相撞，返回true
            return true;
        }
    }
}


function Food(row, col) {
    this.row = row || 0;
    this.col = col || 0;
}
console.log(new Snake())
new Game('app', new Snake(), new Food())