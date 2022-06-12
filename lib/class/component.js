//扩展组件类
Ickt(Ickt, {
    Component: {
        data: {},
        //默认容器元素
        el: 'body',
        // 默认模板
        template: '',
        //默认样式
        style: '',
        $$initState: function() {
            this.$$data = {};
            // 将监听队列设置在实例对象中
            this.$$queue = {};
        },
        //以下为组件扩展的生命周期方法//数据初始化
        initState: function() {},
        //数据已绑定
        dataBound: function() {},
        //组件已编译
        compiled: function() {},
        //组件更新前
        beforeUpdate: function() {},
        //组件已更新
        updated: function() {},
        //生命周期钩子方法
        _hooks: function() {
            //数据初始化
            this.$$initState();
            //数据已经初始化
            this.initState();
            //绑定数据
            this.$$bindData();
            //数据已绑定
            this.dataBound();
            //组件编译视图模板
            this.$$compileStart();
            //组件视图模板已编译
            this.compiled();
        },
        //为组件绑定数据
        $$bindData: function() {
            //将数据属性名称转换成数组
            var keys = Object.keys(this.data);
            //遍历属性名称
            keys.forEach(function(key) {
                //为对象的子属性对象绑定监听器
                this.$$walk(key, this.data[key])
                this.$$defineDataProperty(this.data, key, this.data[key], key);
                //绑定数据监听器
                //设置数据的代理属性
                this.$$propertyProxy('data', key)
            }.bind(this))
        },
        /**
         *emessage消息命名空间，为了简化监听器的消息结构，我们以最外层属性名称作为消息名称
         *逐层遍历属性，绑定特性监听器
         *@obj解析的对象，将为其每个属性及其子属性设置监听器 **/
        $$walk: function(message, obj) {
            //通过字符串调用keys方法，返回索引值数组
            if (!obj || typeof obj === 'string') {
                return;
            }
            //获取对象属性名称
            var keys = Object.keys(obj);
            //遍历对象属性名称
            keys.forEach(function(key, index) {
                //递归调用，遍历所有子属性对象的属性
                this.$$walk(message, obj[key])
                    //为了简化监听，都触发父级消息
                this.$$defineDataProperty(obj, key, obj[key], message)
            }.bind(this))
        },

        /***
                    *为属性绑定特性监听器，当数据更新发布消息后更新视图解析的对象，将为其每个属性及其子属性设置监听器* @obj
                    属性名称
                    * @key
                    属性值
                    * @value
                    消息命名空间
                    * @message**/
        $$defineDataProperty: function(obj, key, value, message) {
            //设置特性监听器
            Object.defineProperty(obj, key, {
                //可以枚举
                enumerable: true,
                //可以配置
                confiqurable: true,
                //取值器方法
                get: function() {
                    //为了简化取值器，直接返回数据值
                    return value
                },
                //赋值器方法
                set: function(val) {

                    //如果值相等，说明数据没有更新，返回
                    if (val === value) {
                        return;
                    }
                    //如果更新的是对象，重新遍历其属性，并设置监听器
                    this.$$walk(message, val);
                    //更新数据
                    value = val;
                    //发布命名空间消息，更新视图
                    this.$$notify(message, key)
                }.bind(this)
            })
        },

        //带s的变量给模板用，并为它们设置特性；不带S的变量给模块用，不为它们设置特性（不要弄混）
        $$propertyProxy: function(sourcekey, key) {
            //供模板使用
            Object.defineProperty(this, '$' + key, {
                //可枚举
                enumerable: true,
                //可配置
                configurable: true,
                //取值器方法
                get: function() {
                    return this[sourcekey][key]
                },
                //赋值器方法
                set: function(value) {
                    return this[sourcekey][key] = value;
                }
            })
        },

        /***
        为数据监听器订阅消息
        消息字符串
        *@key
        消息回调函数
        *ecb
        ★*/
        $watch: function(key, cb) {
            //通过消息字符串获取消息命名空间
            key.replace(/\$(\w+)\b/g, function(match, $1) {
                //如果该类消息序列不存在，创建新数组
                this.$$queue[$1] = this.$$queue[$1] || [];
                //移除原来的回调方法，避免重复添加
                //是否已经添加过具有该消息字符串的消息回调函数
                var index = this.$$queue[$1].findIndex(function(item) {
                    return item.$$id === key;
                });
                //如果存在
                if (!!~index) {
                    //删除原来的
                    this.$$queue[$1].splice(index, 1);
                }
                //添加新的消息回调函数
                var fn = cb.bind(this, this.$$createStaticFn(key), this, $1);
                //设置消息字符串的id
                fn.$$id = key;
                //将消息回调函数添加到消息队列中
                this.$$queue[$1].push(fn)
            }.bind(this))
        },

        /***
        *为数据监听器发布消息
        消息名称
        * @key
        回调函数id所包含的字段
        *@id
        **/
        $$notify: function(key, id) {
            //有两次优化：第一次是在$watch中，相同的处理函数只添加一次；第二次是在发布时，包含
            //id的回调函数可以执行
            //如果消息队列存在
            if (this.$$queue[key] && this.$$queue[key].length) {
                //组件生命周期——组件更新前的回调函数
                this.beforeUpdate();
                //组件更新视图
                this.$$queue[key].forEach(function(cb) {
                    !!~cb.$$id.indexOf(id) && cb()
                });
                //组件生命周期——组件更新完毕
                this.updated();
            }
        },
        // 有了这些数据监听器， 并实现了为数据监听器订阅消息的$watch方法， 接下来就可以解析模板中的指令和订阅消息了。
        // 在解析编译模板之前，我们还需要一些准备工作。首先，确定样式，确定容器元素。然后，获取模板，并编译模板。接着，执行脏值检测工作，
        // 将渲染绑定的数据。最后，将编译的内容渲染到视图中。实现程序如下。
        //开始编译
        $$compileStart: function() {
            //初始化样式
            this.$$initStyle();
            //确定模板
            this.$$dom = this.$$ensureElement();
            // console.log(this.$$dom.innerHTML)
            //编译容器元素
            this.$$compile(this.$$dom);
            //脏值检测
            this.$digest();
            //获取组件容器元素
            var container = document.querySelector(this.el);
            //如果容器元素存在
            if (container) {
                //用编译后的视图替换页面中的视图
                container.appendChild(this.$$dom.children[0])
            } else {
                //如果容器元素不存在，提示用户
                Ickt('请创建容器元素：，' + this.el)
            }
        },

        //初始化样式
        $$initStyle: function() {
            //如果没有定义样式，则返回
            if (!this.style) {
                return;
            }
            //如果是样式字符串
            if (~this.style.indexOf(')')) {
                //创建样式标笠
                var style = document.createElement('style');
                //设置样式
                style.innerText = this.style;
                //否则是样式文件地址
            } else {
                //创建1ink标签以导入样式
                var style = document.createElement('link');
                style.rel = 'stylesheet';
                style.href = this.style;
            }
            //设置样式类型
            style.type = 'text/css';
            //渲染样式
            document.head.appendChild(style)
        },

        //确定容器元素
        $$ensureElement: function() {
            //创建根元素
            var div = document.createElement('div')
                //如果是模板字符串
            if (~this.template.indexOf('<')) {
                //直接渲染
                div.innerHTML = this.template;
                //否则，使用css选择器
            } else {
                // console.log(document.querySelector(this.template).innerHTML)
                //在页面中获取模板，并渲染
                div.innerHTML = document.querySelector(this.template).innerHTML
            }
            //返回容器元素
            return div
        },

        //开始编译模板
        $$compile: function(dom, needExec) {
            //获取所有元素，逐一遍历
            dom.querySelectorAll('*').forEach(function(item, index) {
                    //编译属性指令，attributes是类数组对象
                    this.$$compileDirectives(item.attributes, item, index, needExec);
                }.bind(this))
                //获取所有元素，逐一遍历
            dom.querySelectorAll('*').forEach(function(item, index) {
                    //编译文本指令
                    this.$$compileTextNodes(item.childNodes, item, index, needExec);
                }.bind(this))
                //返回容器元素
            return dom;
        },

        // …… 指令编译开始 ……
        //匹配指令的正则表达式
        $$directiveRegExp: {
            //4类指令语法糖——事件指令、插值指令、属性指令、功能指令
            //事件指令：i-on：click="fn（）"或者（click）="fn（）"
            //属性绑定：i-bind:title="str"或者：title="str"
            //功能指令：i-show="isShow"或者[show]="isShow"
            //插值指令：{#title#}
            subTypeRE: {
                //事件指令正则表达式
                Event: /^\((\w+)\)|^i-on:(\w+)/g,
                //属性绑定指令正则表达式
                Bind: /^:(\w+)|^i-bind:(\w+)/g,
                //功能指令正则表达式
                Action: /^\[(\w+)\]|^i-(\w+)$/g,
            },
            //插值正则表达式
            htmlSignRE: /\{#((?:.|\n)+?)#\}/g,
        },

        /*
        编译指令
        属性节点
        属性所在元素
        @attr
        + aitem
        元素索引值
        是否需要立即执行
        * @index
        *eneedExec
        **/
        $$compileDirectives: function(attrs, item, index, needExec) {
            //获取指令正则表达式
            var REG = this.$$directiveRegExp;
            //将类数组转换成数组
            Array.from(attrs)
                //遍历每个属性
                .forEach(function(attr, index) {
                    //遍历正则表达式
                    for (var re in REG.subTypeRE) {
                        //如果正则表达式匹配
                        if (REG.subTypeRE[re].test(attr.name)) {
                            // console.log(REG.subTypeRE[re])
                            //处理指令
                            this.$$subscribeBuilding({
                                // dom: item,
                                node: attr,
                                dom: item,
                                key: attr.name,
                                value: attr.value,
                                regKey: re,
                                regValue: REG.subTypeRE[re]
                            }, needExec);
                            //移除指令
                            item.removeAttribute(attr.name);
                            return;
                        }
                    }
                }.bind(this))
        },

        /** 
        *编译指令
        指令对象
        * @options
        是否需要立即执行
        *@needExec
        **/
        $$subscribeBuilding: function(options, needExec) {
            // console.log(this['$$parse' + options.regKey](options, needExec))
            //执行指令编译方法
            this['$$parse' + options.regKey](options, needExec)
        },

        //处理事件指令
        $$parseEvent: function(options) {
            //匹配事件指令
            options.key.replace(options.regValue, function(match, $1, $2) {
                //绑定$1||$1左边正则表达式匹配或者右边正则表达式匹配的事件
                options.dom.addEventListener($1 || $2, this.$$createEventFn(options.value))
            }.bind(this))
        },

        //创建事件指令回调函数
        $$createEventFn: function(str) {
            //返回事件回调函数，并绑定作用域
            return new Function('$event', 'with(this) {return' + str + '}').bind(this);
        },

        /** 属性指令 在属性指令中， 我们要为属性值中出现的变量订阅消息。 当这些属性值变化的时候， 要更新视图。 
         * 另外， 在页面中， 我们不希望用户看到这些指令， 因此还可以将这些自定义指令属性删除。 实现程序如下。*/
        //处理属性指令
        $$parseBind: function(options, needExec) {
            //匹配属性指令
            options.key.replace(options.regValue, function(match, $1, $2) {
                //为数据监听器注册消息
                this.$watch(options.value, function(getValueFn) {
                        console.log(options.value)
                            //设置属性值
                        options.dom.setAttribute($1 || $2, getValueFn())
                    })
                    //如果需要立即执行
                if (needExec) {
                    //更新属性值
                    options.dom.setAttribute($1 || $2, this.$$createStaticFn(options.value)())
                }
            }.bind(this))
        },

        //创建静态方法
        $$createStaticFn: function(str) {
            //返回方法
            return new Function('with(this){return' + ' ' + str + '}').bind(this);
        },

        /**    功能指令  
         * 要为指令扩展功能， 首先要确保全局指令池（ 存储指令的容器） 具有功能指令， 
         * 这就允许我们在不同的游戏项目中自定义功能指令了。 当解析这类功能指令时， 
         * 我们从全局指令池中获取该类型的功能指令， 处理数据， 并且还要监听数据的变化，
         *  因此要注册消息。 在解析过程中， 如果功能指令不存在， 
         * 要提示用户。 最后， 功能指令处理完， 我们还要删除该功能指令的自定义属性
         * */
        //指令池
        $$directives: {},
        //处理功能指令
        $$parseAction: function(options, needExec) {
            //匹配功能指令
            options.key.replace(options.regValue, function(match, $1, $2) {
                //如果指令存在
                if (this.$$directives[$1 || $2]) {
                    //从指令池中，获取相应指令并执行
                    var fn = this.$$directives[$1 || $2].call(this, options);
                    // console.log(fn)
                    //需要立即执行
                    if (needExec) {
                        //执行指令回调方法
                        fn(this.$$createStaticFn(options.value))
                    }
                    //为数据监听器注册消息
                    this.$watch(options.value, fn)
                        // console.log(options.value)
                } else {
                    //指令不存在，提示用户
                    Ickt.error(($1 || $2) + 'directive not find!');
                }
            }.bind(this))
        },

        //添加指令
        directive: function(obj) {
            //将指令添加到指令池中
            Ickt(this.$$directives, obj)
        },

        /** 插值指令
        插值指令与其他类型的指令还是有些不一样。 插值指令用于解析元素内容， 而不是属性， 因此对于它们就要特殊对待， 
        并且不能像其他指令那样， 定义相同的指令对象， 毕竟指令的结构是不同的。 
        在处理插值指令时， 首先要把插值指令转换成一个可执行的语句字符串， 
        然后在函数构造器中执行该语句字符串， 并将得到的结果渲染在视图中
        **/
        /***
        *编译文本节点* @attr
        属性节点
        * @item
        属性所在元素
        * @index
        元素索引值
        * @needExec
        是否需要立即执行
        **/
        $$compileTextNodes: function(nodes, item, index, needExec) {
            //获取插值正则表达式
            var REG = this.$$directiveRegExp;
            //将类数组转换成数组
            Array.from(nodes)
                //遍历每个属性
                .forEach(function(childItem, childIndex) {
                    //如果是文本节点，并且符合插值表达式
                    if (childItem.nodeType === 3 && REG.htmlSignRE.test(childItem.nodeValue)) {
                        //编译插值
                        this.$$parseText(childItem, REG.htmlSignRE, needExec)
                    }
                }.bind(this))
        },

        /**
        ﹡解析插值
        文本节点
        @node
        匹配正则
        * @re
        是否立即执行
        * @needExec
        **/
        $$parseText: function(node, re, needExec) {
            //语句集
            var tokens = [];
            //文本内容
            var text = node.nodeValue;
            //重置re
            var lastIndex = re.lastIndex = 0;
            //匹配字段和索引值
            var match, index;
            //依次匹配插值指令
            while (match = re.exec(text)) {
                //获取索引值
                index = match.index;
                //插值左边的字符
                if (index > lastIndex) {
                    //保证是语句字符串JSoN.stringify
                    tokens.push(JSON.stringify(text.slice(lastIndex, index)))
                }
                //向语句集中添加语句
                tokens.push(match[1].trim())
                    //更新索引
                lastIndex = index + match[0].length;
                //插值右边的字符
                if (lastIndex < text.length) {
                    tokens.push(JSON.stringify(text.slice(lastIndex)))
                        //解决插值中没有变量无法替换的问题（没有变量，无法监听）
                    if (!~tokens.join('+').indexOf('$') || needExec) {
                        //直接设置内容
                        node.nodeValue = this.$$createStaticFn(tokens.join('+'))();
                    } else {
                        //为数据监听器注册消息
                        this.$watch(tokens.join('+'), function(getValueFn, model) {
                            //更新数据，更新内容
                            node.nodeValue = getValueFn();
                        })

                    }
                }
            }
        },


        //脏值检测 
        $digest: function() {
            //遍历数据监听器的消息队列
            Object.values(this.$$queue)
                //遍历消息序列
                .forEach(function(arr) {
                    //注意，执行每个消息回调函数
                    arr.forEach(function(cb) {
                        cb()
                    })
                })
        },

        //销毁组件
        $$destory: function() {
            //使用Ickt模块基类的destory方法销毁组件this.destory();
            //从容器元素中删除该组件根元素
            this.$$dom.parentNode.removeChild(this.$$dom)
        }
    }
})

//自定义指令
Ickt.Component.directive({
    //数据双向绑定
    model: function(options) {
        //定义获取数据的方法
        var fn = new Function('val', 'with(this){' + options.value + '=val;}');
        //绑定键盘事件
        options.dom.addEventListener('keyup', function(e) {
                //把视图更新同步到模型中
                fn.call(this, e.target.value)
            }.bind(this))
            /***
            *返回指令的方法
            获取指令的值
            * @getValueFn
            **/
        return function(getValueFn) {
            //更新数据，同步到视图中
            options.dom.value = getValueFn();
        }
    }
})


/**循环指令
为了可以循环创建元素，我们定义了i-repeat指令。通过该指令可以循环一组数据，可以循环创建元素。
另外，创建的元素上的其他指令也要生效，因此我们要对生成的元素模板再次编译，并且设置其指令值。实现程序如下。 **/
Ickt.Component.directive({
    //重复渲染模板的指令
    repeat: function(options) {
        //解析指令值
        var matchIn = options.value.match(/(.*) in (.*)/),
            //创建容器元素
            container = document.createElement('div'),
            //获取元素
            dom = options.dom,
            //获取前一个节点
            start = dom.previousSibling,
            //获取后一个节点
            end = dom.nextSibling,
            //获取父元素
            parent = dom.parentNode,
            //定义模板
            //如果指令的属性值不匹配正则表达式，提示用户
            tpl = '';
        if (!matchIn) {
            Ickt.error('i-repeat指令语法错误：' + options.key + '="' + options.value + '"')
            return;
        }
        //获取成员变量以及索引值变量
        var matchItemIndex = matchIn[1].match(/(\S*)\s*,\s*(\S*)/);
        // console.log(matchItemIndex[1])
        //获取索引值
        index = matchItemIndex[2]
            //获取成员值
        alias = matchItemIndex[1]
            //删除v-for属性
        dom.removeAttribute(options.key);
        //将dom转换为字符串
        var div = document.createElement('div')
            //设置内容
        div.appendChild(dom)
            //本取植板字符出
        tpl = div.innerHTML;
        // console.log(tpl)
        //如果模板中有不存在的变量，要删除，避免编译
        var indexReg = new RegExp('[^\\.]?\\b' + index + '\\b', 'g');
        var aliasReg = new RegExp('[^\\.]?\\b' + alias + '\\b', 'g');
        //更正监听的字段
        options.value = matchIn[2]
            //指令方法
        return function(getValueFn) {
            //获取数据
            var data = getValueFn(),
                //定义结果
                html = '';
            console.log(data)
                //数据存在
            if (data && data.length) {
                //循环，复制字符出
                data.forEach(function(dataItem, dataIndex) {
                        //替换索引值
                        html += tpl.replace(indexReg, function(match) {
                            return match.replace(index, dataIndex)
                                //替换变量
                        }).replace(aliasReg, function(match) {
                            return match.replace(alias, matchIn[2] + '[' + dataIndex + ']')
                        })
                    })
                    // 将字符出转换为dom
                container.innerHTML = html;
                //重新编译该模板
                var result = this.$$compile(container, true);
                //将dom插入页面中
                //清除从start到end的元素
                var shouldDelete = false;
                //转换成数组
                Array.from(parent.childNodes)
                    //遍历节点
                    .forEach(function(nodeItem, nodeIndex) {
                        //如果在起始节点之后
                        if (nodeItem === start) {
                            //可以删除
                            shouldDelete = true;
                            return;
                            //如果在节点之后
                        } else if (nodeItem === end) {
                            //不能删除
                            shouldDelete = false;
                            return;
                        }
                        //如果可以删除该节点，则删除该节点
                        if (shouldDelete) {
                            parent.removeChild(nodeItem);
                        }
                    })
                    //添加
                Array.from(container.childNodes)
                    //逐一添加节点
                    .forEach(function(item) {
                        parent.insertBefore(item, end)
                    })
            }
        }
    }
})


// Style directive
Ickt.Component.directive({
    //动态绑定样式指令
    style: function(options) {
        /***
        返问指令方法
        *
        *@getValueFn
        获取指令的值
        **/
        return function(getValueFn) {
            //获取结果
            var result = getValueFn();
            //如果是行内式字符串
            if (typeof result === 'string') {
                //直接设置
                options.dom.style = result;
            } else if (Ickt.toString.call(result) === "[object Object]") {
                //如果是对象
                //定义行内式字符串
                var str = "";
                //解析对象
                for (var i in result) {
                    //将驼峰式命名方式转换成横线分隔的形式，并设置内容
                    str += i.replace(/([A-Z])/g, function(match, $1) {
                        return '-' + $1.toLowerCase()
                    }) + ':' + result[i] + ';';
                }
                //设置样式
                options.dom.style = str;
            }
        }
    }
})

// Show directive
//自定义指令
Ickt.Component.directive({
    //显/隐指令
    show: function(options) {
        /***
        *返回指令的方法
        获取指令的值
        * @getValueFn
        **/
        return function(getValueFn) {
            //如果值为真
            if (getValueFn()) {
                //显示元素
                options.dom.style.display = "";
                //如果值为假} else {
                //隐藏元素
                options.dom.style.display = 'none';
            }
        }
    }
})

// Html Directive
// 题，我们可以定义i-html指令来代替插值语法。实现程序如下。
//自定义指令
Ickt.Component.directive({
    /***
    *设置HTML内容的指令
    指令对象
    * Coptions
    **/
    html: function(options) {
        /***
        *返回指令方法
        获取指令的值
        * @getValueFn
        实例化对象
        * @model
        消息命名空间
        *@id
        **/
        return function(getValueFn, model, id) {
            //设置内容
            options.dom.innerHTML = getValueFn()
        }
    }
})


//自定义指令
Ickt.Component.directive({
    //创建元素的指令
    create: function(options) {
        //获取前一个元素
        options.nextSibling = options.dom.nextSibling
            //获取父元素
        options.parentNode = options.dom.parentNode;
        //指令函数
        return function(getValueFn, model) {
            //获取值
            var val = getValueFn()
                //如果值没变，返回
            if (val === options.oldValue) {
                return
            }
            //如果值为真
            if (val) {
                //在父元素中插入该元素
                options.parentNode.insertBefore(options.dom, options.nextSibling)
            } else {
                //从父元素中移除该元素
                options.dom.parentNode.removeChild(options.dom)
                    //存储上一个值
                options.oldValue = val
            }
        }
    }
})