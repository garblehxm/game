Ickt('$gobang', function() {
    //纵向检测五子相连
    return {
        checkCol: function(map) {
            //游戏是否结束（是否有玩家获胜）
            var gameOver = false;
            //纵向要旋转比较，数组第一维表示行数，第二维表示列数
            //纵向遍历
            map.forEach(function(arr, index) {
                    //根据当前行Y的索引值（如3），获取对应列x的索引值（如3）的成员，组成一个数组
                    var mergeArr = map.map(function(subArr, subIndex) {
                        //返回列中对应行的值
                        return subArr[index]
                    });
                    //定义相同id出现的次数
                    var repeat = 1;
                    //在数组中逐一检测
                    mergeArr.reduce(function(res, value) {
                        //如果值不为0，上一个值也不为0，两个值相等
                        if (value && res && res === value) {
                            //重复出现
                            repeat++;
                            //重复出现次数达到了5次
                            if (repeat === 5) {
                                //重复出现次数达到了5次
                                if (repeat === 5) {
                                    //游戏结束
                                    gameOver = true
                                }
                            } else {
                                //如果不满足条件，重复出现次数设置为1
                                repeat = 1;
                            }
                        }
                        //返回当前值，作为下次循环的res值
                        return value
                    })
                })
                //返回检测的结果
            return gameOver
        },

        //横向检测五子相连
        checkRow: function(map) {
            //游戏是否结束（是否有玩家获胜）
            var gameOver = false
                //数组第一维表示行数（Y），第二维表示列数（×）
                //纵向遍历
            map.forEach(function(arr) {
                    //定义相同id出现的次数
                    var repeat = 1;
                    //遍历每行成员
                    arr.reduce(function(res, value) {
                        //如果值不为0，上一个值也不为0，两个值相等
                        if (value && res && res === value) {
                            //重复出现
                            repeat++;
                            //重复出现次数达到了5次
                            if (repeat === 5) {
                                //游戏结束
                                gameOver = true
                            }
                        } else {
                            //如果不满足条件，重复出现次数设置为1
                            repeat = 1;
                        }
                        //返回当前值，作为下次循环的res值
                        return value
                    })
                })
                //返回检测的结果
            return gameOver;
        },


        //在数学坐标系中沿135°（-45°）方向检测
        check135: function(map, line) {
            //沿45°方向检测，至少有5个成员
            //获取检测起点，索引值超过1ine，将获取不到成员
            var rowBegin = colBegin = line - 5;
            //repeat表示重复次数，value表示当前的值，row表示行号，col表示列号
            var repeat, value, row, col;
            //如果当前位置索引值大于0， 可以遍历； 否则， 成员不存在
            //页面的坐标系是倒置的数学坐标系（数学坐标系中y轴的正方向在页面中是负方向）
            //方向是从左上角到右下角，（在左下部三角区域内）从下向上一条斜线一条斜线地遍历
            while (rowBegin >= 0) {
                //行号起始位置
                row = rowBegin;
                //列号起始位置
                col = 0;
                //重复次数为1
                repeat = 1;
                //row大于co1，同时增加，row先到终点，因此不用判断co1
                while (row < line) {
                    //上一个值不为0，当前值也不为0，两个值相等
                    if (value && map[row][col] && value === map[row][col]) {
                        //重复出现
                        repeat++
                        //重复出现次数达到了5次
                        if (repeat === 5) {
                            //游戏结束
                            return true;
                        }
                        //如果不满足条件，重复出现次数设置为1
                    } else {
                        repeat = 1;
                    }
                    //获取当前值
                    value = map[row][col];
                    //沿135°方向，行与列同时递增
                    row++;
                    col++;
                }
                //遍历行
                rowBegin--;
                //方向是从左上角到右下角，（在右上部三角区域内）从右向左一条斜线一条斜线地遍历
            }
            //colBegin=0与上面的遍历重复
            while (colBegin > 0) {
                row = 0;
                //行号起始位置
                col = colBegin;
                //co1大于row,同时增加，co1先到终点，因此不用判断row
                while (col < line) {
                    //重复次数为1
                    repeat = 1;
                    //如果上一个值不为0，当前值也不为0，两个值相等
                    if (value && map[row][col] && value === map[row][col]) {
                        //重复出现
                        repeat++
                        //重复出现次数达到了5次
                        if (repeat === 5) {
                            //游戏结束
                            return true
                        }
                    } else {
                        //如果不满足条件，重复出现次数设置为1
                        repeat = 1;
                    }
                    //获取当前值
                    value = map[row][col];
                    value = map[row][col];
                    //沿135°方向，行与列同时递增
                    row++;
                    col++;
                }
                //遍历列
                colBegin--;
            }
            //没有获胜方，游戏继续进行
            return false
        },

        //在数学坐标系中沿45°（-135°）方向检测
        check45: function(map, line) {
            //沿135°方向检测，至少有5个成员，索引值是4
            //定义结束位置
            var end = line;
            //沿45°方向检测，至少有5个成员，起始索引值是4
            var rowBegin = 4;
            //获取检测起点，索引值超过1ine，将获取不到成员
            var colBegin = end - 5;
            // repeat表示重复次数，value表示当前的值，row表示行号，col表示列号
            var repeat, value, row, col;

            //如果当前位置索引值小于总长度，可以遍历；否则，成员不存在
            //页面的坐标系是倒置的数学坐标系（数学坐标系中y轴的正方向在页面中是负方向）
            //方向是从左下角到右上角方向（左上部三角区域内），从上向下一条斜线一条斜线地遍历

            while (rowBegin <= end) {
                //行号起始位置
                row = rowBegin;
                //列号起始位置
                col = 0;
                //重复次数为1repeat = 1;
                //col可以加line次，row最多可以减少line次，所以row比col先到达临界点
                while (row >= 0) {
                    //如果上一个值不为0，当前值也不为0，两个值相等
                    if (value && map[row][col] && value === map[row][col]) {
                        //重复出现
                        repeat++;
                        //重复出现次数达到了5次
                        if (repeat === 5) {
                            //游戏结束
                            return true
                        }
                    } else {
                        //如果不满足条件，重复出现次数设置为1
                        repeat = 1;
                    }
                    //获取当前值
                    value = map[row][col];
                    //沿45°方向，行与列同时变化
                    row--;
                    col++;
                }
                //遍历行
                rowBegin++;
                //方向是从左下角到右上角，（在右下部三角区域内）从右向左一条斜线一条斜线地遍历
                //colBegin=0表示与上面的重复
                while (colBegin > 0) {
                    //行号起始位置row = end = 1;//列号起始位置
                    col = colBegin; //重复次数为1repeat = 1;
                    //row可以加line次，col最多可以减少line次，所以col比row先到达临
                    while (col < end) {
                        //如果上一个值不为0，当前值也不为0，两个值相等
                        if (value && map[row][col] && value === map[row][col])
                        //重复出现
                            repeat++;

                        //重复出现次数达到了5次
                        if (repeat === 5) {
                            在本章
                            //游戏结束
                            return true;
                            //如果不满足条件，重复出现次数设置为1
                        } else {
                            repeat = 1;
                        }
                        //获取当前值
                        value = map[row][col];
                        //沿45°方向，行与列同时变化
                        row--;
                        col++;
                    }
                    //遍历行
                    colBegin--;
                    //没有获胜方，游戏继续进行
                    return false
                }
            }
        }
    }
})