Ickt('$2048', function() {
    return {
        //检测是否有空位置
        checkNoPosition: function(map) {
            //遍历每一行
            return map.every(function(arr) {
                //遍历每一列的每个成员，看值是否大于0
                return arr.every(function(value) {
                    return value
                })
            })
        },
        //检测游戏是否结束
        checkGameOver: function(map) {
            //默认游戏已经结束
            var gameOver = true;
            //横向或者纵向有数字相同的方格，它们还能合并，游戏尚未结束
            map.forEach(function(arr) {
                //逐一比较
                arr.reduce(function(res, value) {
                    //如果当前的值不为0，上一个值不为0，两个值相等
                    if (value && res && res === value) {
                        //游戏还可以继续
                        gameOver = false;
                    }
                    //返回当前值
                    return value;
                })
            })

            //纵向要旋转比较
            map.forEach(function(arr, index) {
                    //根据当前行的索引值（如3），获取所有列中对应当前行索引值（如3）的成员，组成新数组
                    var mergeArr = map.map(function(subArr, subIndex) {
                            return subArr[index]
                        })
                        //逐一比较，有数字相同的方格，它们还能合并，游戏尚未结束
                    mergeArr.reduce(function(res, value) {
                        //如果当前的值不为0，上一个值不为0，两个值相等
                        if (value && res && res === value) {
                            //游戏还可以继续
                            gameOver = false;
                        }
                        //   返回当前值
                        return value;
                    })
                })
                //退日判断结果
            return gameOver;
        },

        // 褥向合并 是否是由左向右比较 -
        // ORAD· 9 leftToRight
        combineMap: function(map, leftToRight) {
            // /依次通历，执行含并操作
            map.forEach(function(arr, index, map) {
                //先合并再排序
                this.merge(arr, leftToRight);
                //对于当前行重新排序
                map[index] = this.sort(arr, leftToRight)
            }.bind(this))
        },
        //旋转矩阵 地图数据 
        // SmAp 是否是由左向右比较· QleftToRight 
        rotateMap: function(map, leftToRight) {
            /**遍历数组
            UE[0, 0, (0), 0]
            [0, 0, (0), 0] 1 / [0, 0, (0), 0]
            [0, 0, (0), 0] 
            **/
            //]
            //融入排序
            map.forEach(function(arr, index) {
                //极据当前行的索引值（如3），获取所有列中对应当前行索引值（如3）的成员，组成新数组
                var mergeArr = map.map(function(subArr, subIndex) {
                        return subArr[index]
                    })
                    //合并新数组
                this.merge(mergeArr, leftToRight)
                    //进行排序
                var sortArr = this.sort(mergeArr, leftToRight);
                //将结果同步到原数组
                sortArr.forEach(function(sortItem, sortIndex) {
                    //将 merge 中的每个成员添加到原 map 败组原位置
                    map[sortIndex][index] = sortItem
                })
            }.bind(this))
        },

        /***
         *比较并合并数组内相同的成员* @arr数组
         * @leftToRight 是否是由左向右比较
         **/
        merge: function(arr, leftToRight) {
            //使用迭代器模式，避免使用循环
            //如果从左向右滑动方格，应从右侧开始合并：如果从右向左滑动方格，应从左侧开始合并
            var lastIndex = leftToRight ? arr.length - 1 : 0;
            arr[leftToRight ? 'reduceRight' : 'reduce'](function(res, value, index, arr) {
                    //如果value存在
                    if (value) {
                        //如果res存在，并且与value相同
                        if (res && res === value) {
                            //res放大2倍
                            res *= 2;
                            //更新值
                            arr[lastIndex] = res;
                            //合并后，清空当前的数据
                            arr[index] = 0;
                            //返回合并后的数据
                            return res;
                        } else {
                            //缓存这一次的index
                            lastIndex = index;
                            //如果不相同，停止res的判断，进行value判断
                            return value;
                        }
                    } else {
                        //如果value不存在，返回上一个res
                        return res;
                    }
                })
                //返回结果
            return arr;
        },
        /***
        *对合并后的结果重新排序
        数组
        * @arr
        是否是由左向右比较
        *leftToRight
        **/
        sort: function(arr, leftToRight) {
            //创建结果数组（与原数组方格数相同）
            var result = new Array(Ickt('num')).fill(0);
            //从第一个成员开始遍历
            //如果由左向右滑动方格，应该从后向前遍历，所以要反转，等遍历完成后，再反转回来
            var i = 0;
            arr = leftToRight ? arr.reverse() : arr;
            //遍历成员，去除数字之间的空白
            arr.forEach(function(item) {
                    //如果不是0
                    if (item) {
                        //添加成员
                        result[i++] = item;
                    }
                })
                //如果由左向右滑动方格，需要反转回来
            return leftToRight ? result.reverse() : result;
        }
    }
})