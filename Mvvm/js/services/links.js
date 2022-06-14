IView('$links', function() {
    return {
        //是否在一条横线上
        ABInX: function(a, b, oneLineNum) {
            return Math.floor(a / oneLineNum) === Math.floor(b / oneLineNum);
        },

        //是否相邻
        AxNextToBx: function(a, b) {
            return Math.abs(a - b) === 1;
        },

        //是否通过直线相连
        AxLineToBx: function(a, b, list) {
            var min = Math.min(a, b);
            var max = Math.max(a, b);
            // console.log(this.list.slice(min, max), max, min)
            return this.checkABX(min, max, list)
        },

        //检测水平方向上a与b两个值之间（不包含a和b）的索引值是否都隐藏
        checkABX: function(min, max, list) {
            //不包含起始点，不包括终止点
            return list.slice(min + 1, max).every(function(item) {
                return item.display === 'none';
            })
        },

        //是否在同一条竖线上
        ABInY: function(a, b, oneLineNum) {
            return a % oneLineNum === b % oneLineNum;
        },

        //是否相邻
        AyNextToBy: function(a, b, oneLineNum) {
            return Math.abs(a % oneLineNum - b % oneLineNum) === 1
        },

        //是否可以相连
        AyLineToBy: function(a, b, oneLineNum, list) {
            var min = Math.min(a, b);
            var max = Math.max(a, b);
            return this.checkABY(min, max, oneLineNum, list)
        },

        //检测垂直方向上a与b两个值之间（不包含a和b）的索引值是否都隐藏
        checkABY: function(min, max, oneLineNum, list) {
            var col = min % oneLineNum;
            return list.filter(function(item, index) {
                //列号×
                var itemCol = index % oneLineNum;
                //行号y
                var itemRow = index / oneLineNum;
                //在同一列，行号小于最大值，大于最小值
                return itemCol === col && itemRow > min / oneLineNum && itemRow < max / oneLineNum
            }).every(function(item) {
                return item.display === 'none'
            })
        },

        //都在边缘上
        ABInBorder: function(a, b, oneLineNum, lines) {
            //上
            return (a < oneLineNum && b < oneLineNum) ||
                //下
                (Math.ceil(a / oneLineNum) === lines && Math.ceil(b / oneLineNum) === lines) ||
                //左
                (a % oneLineNum === 0 && b % oneLineNum === 0) ||
                //右
                (a % oneLineNum === oneLineNum - 1 && b % oneLineNum === oneLineNum - 1)
        },

        //如果不在同一条直线上，判断横向和纵向延长线上的两个点是否可以相连
        AExtensionB: function(a, b, oneLineNum, total, list) {
            return this.AxExtensionBx(a, b, oneLineNum, total, list) || this.AyExtensionBy(a, b, oneLineNum, list)
        },

        /**
        *
        在纵向延长线上，隐藏水平方向上两个点之间的所有元素*
        */
        AxExtensionBx: function(a, b, oneLineNum, total, list) {
            var isRight = false;
            //在横向上a与b之间的最短距离
            var distance = Math.max(a % oneLineNum, b % oneLineNum) - Math.min(a % oneLineNum, b % oneLineNum);
            //找出与a、b相邻并且在纵向隐藏的节点
            //我们规定，延长线不能超出整个容器
            var AResult = this.forEachByStep(a, total, oneLineNum, false, list).
            concat(this.forEachByStep(a, 0, oneLineNum, true, list)).concat(a);
            var BResult = this.forEachByStep(b, total, oneLineNum, false, list).
            concat(this.forEachByStep(b, 0, oneLineNum, true, list)).concat(b);
            //将两个数组混成一个数组，填入a和b，并排序，如果相邻两个值的差值小于12，说明在一排，
            //查看两个数之间的成员是否隐藏
            var result = AResult.concat(BResult).sort(function(a, b) {
                return a - b
            });
            //一对一对遍历，如果差值小于12，查看两者之间的成员是否隐藏
            result.reduce(function(res, item) {
                //如果距离相等
                if (!isRight && item - res === distance) {
                    //检测两个值之间的成员是否都隐藏
                    isRight = this.checkABX(res, item, list)
                }
                return item
            }.bind(this));
            //返回结果
            return isRight
        },

        /**
        在横向延长线上，隐藏垂直方向上两个点之间的所有元素
        */
        AyExtensionBy: function(a, b, oneLineNum, list) {
            var isRight = false;
            //在横向获取a与b之间的最短距离
            var aRow = Math.floor(a / oneLineNum);
            var bRow = Math.floor(b / oneLineNum);
            //获取距离
            var distance = Math.max(aRow - bRow);
            //找出与a、b两点相邻并且在横向隐藏的节点
            var AResult = this.forEachByStep(a, aRow * oneLineNum + oneLineNum, 1, false, list).concat(this.forEachByStep(a, aRow * oneLineNum, 1, true, list)).concat(a);
            var BResult = this.forEachByStep(b, bRow * oneLineNum + oneLineNum, 1, false, list).concat(this.forEachByStep(b, bRow * oneLineNum, 1, true, list)).concat(b);
            //合并数组
            var result = AResult.concat(BResult);
            //分组，将求余后相等的两个数放在同一组中，作为对象的属性
            var map = {};
            //根据索引值，将数组转化成对象
            result.forEach(function(item) {
                    //获取索引值（横向坐标值）
                    var value = item % oneLineNum; //如果定义了该数组
                    if (map[value]) {
                        //存储成员
                        map[value].push(item)
                    } else {
                        //创建新数组
                        map[value] = [item]
                    }
                }.bind(this))
                //遍历数组
            for (var i in map) {
                //加里有同一列上有两个成员才需要比较
                if (map[i] && map[i].length === 2) {
                    //检测两者之间的成员是否都隐藏
                    if (this.checkABY(Math.min.apply(Math, map[i]), Math.max.apply(Math, map[i]), oneLineNum, list)) {
                        //如果都隐藏，则返回true
                        return true
                    }
                }
            }
            return false
        },

        //获取延长线上的空白点
        forEachByStep: function(start, end, step, invert, list) {
            //结果数组
            var result = []; //逆序
            if (invert) {
                //在遍历时，不能包含自身，因为自身已经显示
                for (var i = start - step; i > end; i -= step) {
                    //如果该位置的图片被隐藏
                    if (i && list[i].display === 'none') {
                        //添加成员
                        result.push(i)
                    } else {
                        //否则，跳出循环
                        break;
                    }
                }
            } else {
                //在遍历时，不能包含自身，因为自身已经显示
                for (var i = start + step; i < end; i += step) {
                    //如果该位置的图片被隐藏
                    if (list[i].display === 'none') {
                        //添加成员
                        result.unshift(i)
                    } else {
                        //否则，跳出循环
                        break;
                    }
                }
            }
            //返回结果数组
            return result;
        },
    }
})