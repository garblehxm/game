(function() {
    'use strict';
    var root = this;
    var IView = function(key) {
        //获取参数长度
        var len = arguments.length;
        //如果只有一个参数
        //第一个参数是字符串，表示获取全局配置
        if (len === 1) {
            //检测是否存在字段信息，若不存在抛出错误
            if (typeof key === 'string') {
                if (IView.Conf[key] === undefined) {
                    IView.error('全局中尚未配置' + key + '字段信息');
                }
                //返回全局配置
                return IView.Conf[key]
                    // } else if (typeof key ==='function') {
                    // root.onload = key.bind(this)
                    // }
                    // 否则存储全局配置
            } else {
                key && IView(IView.Conf, key)
            }
            //参数长度大于1
        } else if (len > 1) {
            // 第一个参数是字符串
            if (typeof key === 'string') {
                // 如果第二个参数是函数
                if (typeof arguments[1] === 'function') {
                    // console.log(arguments[1](), IView.Service)
                    IView.Service = {};
                    IView.Service[arguments[0]] = arguments[1]() // 表示自定义服务
                } else {
                    IView.module.apply(IView, Array.prototype.map.call(arguments,
                            // 否则，通过module定义模块
                            //从第二个开始，如果参数是字符串，表示模块要继承的扩展类
                            function(obj, index) {
                                if (index && typeof obj === 'string') {
                                    //扩展类存储在IView中
                                    return IView[obj]
                                }
                                //返回参数对象
                                return obj
                            }))
                        // IView.module.apply(IView, arguments);
                }
            } else {
                //从第二个参数开始，将每个对象中的属性方法复制到第一个对象中
                return Object.assign.apply(this, arguments)
            }
        } else {
            IView.ready();
        }
        return IView;
    }
    if (typeof Moudle !== 'undefined') {
        module.exports = IView;
    } else {
        root.IView = IView;
    }
}.call(this));

//为IView扩展观察者对象（消息系统）
IView(IView, {
    //定义观察者对象，为了将消息管道私有化，把它放在一个闭包中
    EventCenter: function() {
        //定义消息管道，将消息私有化
        var __message = {};
        //返回接口方注
        return {
            //订阅消息的方法
            // on: function() {
            /* 消息类望
            ·订每动息的方法
            消息回调函数
            回调西数执行时的作用域
            当前对象，用于方便链式调用
            *Ecal1back
            · fcontext
            s retuzn **/
            on: function(type, callback, context) {
                // /划菜消息管道中存在这条消息
                if (__message[type]) {
                    //加入新的回调函数
                    __message[type].push({
                            //定义回调函数
                            callback: callback || function() {},
                            // /定义作用域，注意，默认作用域为nu11，指代调用on方法的对象，后面会将on+
                            //到各个组件模块中，此时this将不再指代EventCenter返回的接口对象
                            context: context || null
                        })
                        //如果消息管道中不存在该消息
                } else {
                    //定义存储该消息的容器
                    __message[type] = [];
                    //再次调用该方法，存储消息
                    this.on(type, callback, context)
                }
                //返回当前对象
                return this;
            },
            /** 单次订阅消息的方法
            消息类型
                * @type
            消息回调函数
                * @callback
            回调函数执行时的作用域
                * @context
            当前对象，用于方便链式调用
                * return **/
            once: function(type, callback, context) {
                //函数执行时的作用域，默认为nu11
                context = context || null;
                //单次触发，即只能触发一次，也就是说，在触发前将它销毁，因此我们要将回调函数装饰成一个新的函数，
                //从而提供销毁该回调函数的机会
                var fn = function() {
                        //在执行回调函数之前注销，为了避免在销毁前再次触发时出现的死循环
                        this.remove(type, {
                            //定义回调函数
                            callback: fn,
                            //定义作用域
                            context: context
                                //在context作用域下执行回调函数，并传递所有参数
                        })
                        callback.apply(context, arguments)
                            //为了让fn作用域与once一致，要绑定this作用域
                            // ECMAScript 5中bind方法的实现，请参考《JavaScript设计模式》
                    }.bind(this)
                    //注册该消息
                this.on(type, fn, context)
            },
            //发布消息的方法
            trigger: function(type) {
                //我们认为第一个参数是消息类型，从第二个参效
                var arg = IView.slice.call(arguments, 1);
                // 定义返回的结果
                var result = [];
                //如果该消息存在
                //消息容器中的每一个成员是对象，将callback回调函数的属性放在context作用
                if (__message[type]) {
                    __message[type].forEach(function(obj) {
                            //遍历该消息源
                            result.push(obj.callback.apply(obj.context, arg))
                                //并传递自定义的arg参数
                                //如果没有该消息，返回nul1
                        })
                        //提示用户，该消息没有注册
                } else {
                    IView.warn(type + ' message not defined!')
                        //返回null
                    return null;
                }
                //返回结果
                return result.concat(arg);
            },
            //注销消息的方法
            // remove: function () { }
            remove: function(type, messageObject) {
                // 如果没传递任何参数
                if (!type) {
                    //清空整个消息管道
                    __message = {};
                    //返回当前对象
                    return this;
                }
                //如果存在消息管道
                if (__message[type]) {
                    //如果传递了消息成员对象
                    //将该消息删除，即从消息容器中过滤出回调函数相等并且作用域相等的对象
                    if (messageObject) {
                        _message[type] = __message[type].filter(function(msgObj) {
                                //条件是：如果是回调函数，回调函数不相等；
                                //如果是消息成员对象，回调函数不相等，或者作用域不相等
                                return typeof messageObject === 'function' ? msgObj.callback !==
                                    messageObject : msgObj.callback !== messageObject.callback ||
                                    msgObj.context !== messageObject.context;

                            })
                            //没有传递消息成员对象
                    } else {
                        //清空该消息容器
                        __message[type] = [];
                    }
                    //返回当前对象
                    return this;
                }
            }
        }
        //执行该方法，暴露接口
    }()
})

// 扩展IView
//为了方便开发，这里为IView对象复制一些常用方法
//扩展一些常用方法
IView(IView, {
    //复制截取数组的方法
    slice: [].slice,
    //复制删除并插入新成员的方法
    splice: [].splice,
    //复制把对象转换成字符串的方法
    toString: Object.prototype.toString,
    //信息提示，当希望给用户提供一些建议的时候，可以使用该方法
    //为了方便提示程序运行时的一些问题，我们将提示信息格式化，并封装成方法
    info: function(msg) {
        //console存在，通知用户
        console && console.log('(IView Info]:' + msg);
    },
    //警告
    warn: function(msg) {
        //console存在,警告用户
        console && console.warn('[IView Warn]:' + msg);
    },
    //轻微的错误提示（例如，模块类名需要大写）对程序规苑等有影响，但是程序仍正常运行
    error: function(msg) {
        // console存在，提示错误
        console && console.error('[Tckt Error]:' + msg)
    },
    //产重的错误提示，例如，死循环、堆栈溢出等
    seriousError: function(msg) {
        //抛出错误，终止执行
        new Error('[IView Serious Error):' + msg)
    }
})

//为方便订阅发布消息，将EventCenter中的方法复制到IView对象中
IView(IView, IView.EventCenter);
//定义回调函数
// function demo(msg) {
//     console.log(msg)
// }
//订阅消息
// IView.on('hello', demo)
//注销消息
// IView.remove('hello', demo)
//发布消息
// IView.trigger('hello', '雨夜清荷')



//模块base
//为IView扩展Base基类模块
IView(IView, {
    //全局配置
    Conf: {},
    /**
     * obj 属性对象
     * return (Boolean}
     **/
    isPropertyObject: function(obj) {
        return obj.value && (obj.enumerable !== undefined || obj.writable !== undefined || obj.configurable !== undefined)
    },
    propertiesExtend: function(target) {
        //获取扩展对象（从第二个参数开始）
        var args = IView.slice.call(arguments, 1);
        //判断是否设置了特性
        var ipo = this.isPropertyObject;
        //遍历扩展对象，每个成员代表一个扩展对象
        args.forEach(function(obj) {
                //获取扩展对象的所有属性名称key，并遍历这些key
                Object.keys(obj).forEach(function(key, index) {
                    // 定义特性属性对象
                    var descriptor = {
                            //原型方法默认不能枚举
                            enumerable: obj[key].enumerable || false,
                            //原型方法默认可以再次配置
                            configurable: true
                        }
                        //如果定义了set和get方法
                    if (obj[key].set || obj[key].get) {
                        //如果定义了set方法，则设置set方法
                        obj[key].set && (descriptor.set = obj[key].set)
                            //如果定义了get方法，则设置get方法
                        obj[key].get && (descriptor.get = obj[key].get)
                            // 如果没有设置set或者get方法，默认设置value和writable
                    } else if (ipo(obj[key])) {
                        //原型方法的value值默认为属性值
                        descriptor.value = obj[key].value;
                        //原型方法默认可以修改
                        descriptor.writable = obj[key].writable;
                    } else {
                        //原型方法的value值默认为属性值
                        descriptor.value = obj[key];
                        //原型方法默认可以修改
                        descriptor.writable = true;
                    }
                    //为扩展的属性设置特性
                    Object.defineProperty(target, key, descriptor)
                })
            })
            //返回当前对象
        return target;
    },
    //需要安装的模块集合，一旦安装完成，该集合被清空
    installModule: [],
    //模块实例化对象集合
    instances: {},
    //一切模块以及组件的基类
    Base: function() {
        //解析模块的消息序列，并注册已有的消息
        IView.messageSerialization.call(this);
        //为了扩展模块，我们在这里将执行模块预留的钩子函数
        this._hookCallbacks.forEach(function(fn) {
                //注意，钩子函数一定要在当前模块实例化对象上执行
                fn.call(this);
            }.bind(this))
            //一切数据实例化完成，执行模块的initialize生命周期钩子方法
            //完整的生命周期方法将在后面给出
            // this.initialize.apply(this, arguments)
            //解析initialize构造函数的参数集合，并传递模块实例化对象
        var args = IView.paramInjectAnalysis(this.initialize, this)
        this.initialize.apply(this, args)
    },
    //解析模块的消息序列并注册消息，后面会根据消息的存储方式实现该方法
    //为IView扩展Base基类模块
    messageSerialization: function() {
        //将两类模块消息复制到一个对象中
        var msg = IView({}, this.__message__, this.message);
        //遍历该消息对象
        //逐一注册，并传递回调函数执行时的作用域
        for (var key in msg) {
            this.on(key, this[msg[key]], this)
        }
    },
    /**     参数注入
            “因为参数注入技术要求我们在函数执行之前，解析函数的参数，并根据解析的结果，
            找到这些数据，在函数执行的时候，传递这些数据，所以比较耗性能。通常我们在构造函
            数中实现参数注入即可,因为模块的构造函数是initialize,所以我们解析initialize就行了。
            为了方便管理，我们将注入的所有数据统称为服务，因此为了注入模块中，我们就要首先
            定义这些服务。然后我们再扩展一点，对于被注入的服务，我们同时将其存储在模块实例
            化对象中，方便在其他属性方法中使用
        **/

    //为构造函数传递服务参数
    paramInjectAnalysis: function(fn, module) {
        //m修饰符表示多行匹配
        //去除注释
        var commentsReg = /((\/\/.*$) | (\/\*[\s\S]*?\*\/))/mg;
        //获取参数
        var argsReg = /^[^\(]*\(([^\)]*)\)/m;
        var args = Function.prototype.toString.call(fn)
            //将方法转换成字符串
            //删除注释
            .replace(commentsReg, '')
            //获取注入服务
            .match(argsReg)[1]
            //返回服务参数集合
        return args ?
            //如果args参数存在
            args
            //分割参数
            .split(',')
            //获取参数
            .map(function(str) {
                //去除首尾空白符
                var name = str.trim();
                //在服务池中查找该服务
                var result = IView.Service[name]
                    //判断服务是否存在
                if (!result) {
                    //若不存在，提示错误
                    IView.error(name + ' service not found!')
                } else {
                    //若服务存在，将服务存储在模块自身中
                    module[name] = result;
                }
                //返回该服务
                return result
            }) :
            //若没有传递参数，返回空数组
            [];
    },
    /***
     * 在模块中，注册全家全局消息
     * messageName  全局消息的名称
     * hookName 生命周期钩子函数的名称
     */
    registGlobalMessage: function(messageName, hookName) {
        //添加全局消息前级
        var wholeMessageName = 'IView.' + messageName;
        //判断该消息是否已经存在
        if (IView.Base.prototype.__message__[wholeMessageName]) {
            //消息已经存在，提示用户
            IView.error(messageName + '已经被注册，请更换消息名称')
        }
        //如果没有传递回调函数的名称，则将messageName转化成驼峰式，作为回调函数的名称
        hookName = hookName || messageName.replace(/\.([a-z])?/g, function(match, $1) {
            return $1 ? $1.toUpperCase() : ''
        });
        //回调函数的名称
        IView.Base.prototype.__message__[wholeMessageName] = hookName;
        //定义回调函数的默认值
        Object.defineProperty(IView.Base.prototype, hookName, {
            //设置特性
            configurable: false,
            writable: true,
            enumerable: true,
            value: function() {}
        })
    },
    ModuleClass: {},
    /** 安装模块 * @name模块名称 * 从第二个参数开始，表示对该模块扩展的属性方法 **/
    module: function(name) {
        // 模块名称首字母必须大写
        if (!/[A-Z]/.test(name[0])) {
            //如果首字母没有大写，不符合规范，提示错误
            IView.error(name + '模块名称首字母大写')
        }
        // 判断是否已经创建了该模块
        if (IView.ModuleClass[name]) {
            //如果创建了该模块，不能重复创建
            IView.error(name + '模块已经安装')
        }
        //模块类要继承模块基类，基类就是Base类
        var Parent = this.Base;
        //缓存slice方法
        var slice = this.slice;
        //定义模块类
        var Module = function() {
                //获取模块实例化时的参数，并转换成数组
                var args = Array.from(arguments);
                //将实例化对象添加到数组中
                args.unshift(this);
                //在构造函数的作用域下，进入组件生命周期的第二个阶段，并传递作用域和参数
                this.beforeCreate.apply(Module, args);
                //继承父类构造函数
                return Parent.apply(this, arguments);
            }
            //通过寄生式继承，可以继承基类的原型，但是ECMAScript5提供了create方法，方便我们继承
            //继承父类的原型和实现寄生式继承
        var protos = Module.prototype = Object.create(Parent && Parent.prototype, {
                //纠正构造函数
                constructor: {
                    value: Module,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            })
            //获取创建模块时传递的参数
        var args = slice.call(arguments, 1);
        //处理钩子函数，将所有继承模块的hooks钩子函数添加到数组中，逐一执行，即可实现方法的重载
        var callbacks = [];
        //遍历每一个继承的模块
        args.forEach(function(proto) {
            //如果存在钩子函数，并且是一个函数，存储该钩子函数
            proto && typeof proto._hooks === "function" && callbacks.push(proto._hooks)
        });
        //继承模块集合中加入继承钩子函数的模块
        args.push({
            _hookCallbacks: callbacks
        });
        //为了扩展模块类的原型，在数组头部加入模块原型
        args.unshift(Module.prototype);
        //扩展原型
        //原型继承的属性方法默认不可枚举
        this.propertiesExtend.apply(this, args)
            /**
             * 如果支持setPrototypeof方法，使用setPrototypeof方法实现静态继承；否则，修改 **/
            // -proto__属性(在EcMAScript未来的版本中，不建议直接访问_proto__属性，而使用
            //模块类的静态属性继承
            // setPrototypeOf代替）
        Object.setPrototypeOf ? Object.setPrototypeOf(Module, Parent) : (Module.__proto__ = Parent);
        //定义全局配置
        protos.globals && IView(protos.globals);
        Module.dependencies = protos.dependencies;
        //模块即将安装，执行模块生命周期第一个阶段的方法
        protos.beforeInstall.call(Module, Module);
        //安装模块
        IView.ModuleClass[name] = Module;
        //将模块插入模块安装集合中
        this.installModule.push(name)
            // console.log(args, protos)
            //返回this,方便链式调用
        return this;
    },
    destory: function(instance) {
        // 将两类消息复制到一个新对象中
        var msg = IView({}, instance.__message__, instance.message);
        //遍历该消息对象
        // key 表示消息名称， msg [key] 表示回调函数名称，通过instance 才能访问对应的函数
        for (var key in msg) {
            //删除key消息类型下的回调函数，同时传递消息函数以及执行时的作用域
            instance.remove(key, {
                context: instance,
                callback: instance[msg[key]]
            })
        }
    },
    //模块安装完成，开始实例化
    ready: function() {
        // console.log(this.create)
        //存储所有模块及其依赖集合
        var modules = [];
        //遍历所有需要安装的模块
        // if (this.installModule && this.installModule.length) {
        this.installModule = this.installModule.filter(function(moduleName) {
                //如果模块名称不存在，继续执行下一个
                if (!moduleName) {
                    return;
                }
                // 如果在所有模块集合中存在该模块名称
                if (IView.ModuleClass[moduleName]) {
                    // 存储该模块名称及其依赖的模块集合
                    modules.push({
                        name: moduleName,
                        deps: IView.ModuleClass[moduleName].dependencies
                    })
                }
                // this.create(module);
                //绑定当前对象
            }.bind(this))
            // }
            //解析依赖集合
        var result = this.resolveDependencies(modules)
            //按照模块的创建顺序，遍历所有模块
            .forEach(function(module) {
                //创建这个模块
                this.create(module)
            }.bind(this))
            //所有组件安装完成，进入生命周期的第五个阶段
        this.EventCenter.trigger('IView.ready');
        //返回this，方便链式调用
        return this;
    },
    /***
    ﹡创建一个模块
    模块名称
    * module
        ***/
    create: function(module) {
        /** 模块名
         * @module
         * **/
        //获取模块实例化时传递的参数
        var arg = this.slice.call(arguments, 1);
        //实例化模块，并在实例化过程中传递参数
        var instance = new(Function.prototype.bind.apply(IView.ModuleClass[module], [null].concat(arg)))
            //在ECMAScript 6中，可以通过Reflect实现
            // var instance = Reflect.construct(IView.ModuleClass[module],
            /**也可以直接通过bind绑定作用域，但是用户重写模块的bind方法是很危险的，
            所以我们选择前面那种借用函数原型的bind方法**/
            // var instance = new (IView.ModuleClass[module].bind(IView.ModuleClass[moaure], arg))
            //安装这个模块
        this.install(module, instance)
            //返回该实例化对身
        return instance;
    },
    /***
       *安装模块
      模块名称
      * module
      模块实例化对象
      * @instance
      **/
    //将模块的实例化对象存储在this.instance实例化对象集合的module（模块名称）分类里，
    install: function(module, instance) {
        //如果该分类不存在，则创建一个空数组
        var moduleIntances = (this.instances[module.toLowerCase()] = this.instances[module.toLowerCase()] || []);
        //存储该实例化对象
        moduleIntances.push(instance)
            //模块创建完，进入模块生命周期的第四个阶段
        instance.afterCreated();
    },
    /**
    解析模块依赖
    *@arr要被处理的集合数组格式：[{name：'Game '，deps：[]}，{name：'Snake '，deps：['Game ']}]
    返回模块的创建顺序
    * return
    **/
    resolveDependencies: function(arr) {
        //依赖的模块集合
        var deps = [];
        //模块集合
        var modules = [];
        //获取已经实例化的模块（已经实例化了，说明模块已经创建了）
        var instances = this.instances;
        arr.forEach(function(obj, index) {
                //存储模块的名称
                modules.push(obj.name);
                //道历依赖模块的集合
                obj.deps.forEach(function(item) {
                    //如果模块已经安装，不要加入依赖解析
                    if (instances[item.toLowerCase()]) {
                        return;
                    }
                    // 存储依赖关系，这是一个数组，第一个成员表示被依赖的模块item，第二个成员
                    //当前的模块obi.name
                    deps.push([item, obj.name])
                })
            })
            // 按照上面的算法处理模块，得到模块的创建顺序集合并返回
        return this.dependenciesArrayOrder(modules, deps, []);
    },
    /* 解析依赖，确定模块创建顺序
    所有模块依赖关系的集合
    * modules
    * edeps
    * eresult
    上一次处理的结果
    **/
    dependenciesArrayOrder: function(modules, deps, result) {
        //定义当前模块，并获取所有模块的长度
        var module, len = modules.length;
        //寻找右边不存在的模块
        modules.some(function(name, index) {
                //所有模块名称都不能一样
                var test = deps.every(function(arr) {
                        return arr[1] != name
                    })
                    //如果找到了
                if (test) {
                    //从未确定顺序的所有模块数组中删除选中的
                    module = modules.splice(index, 1)[0];
                    //在结果中加入该数组
                    result.push(module)
                }
                return test;
            })
            //没有找到模块，说明双向依赖
        if (len === modules.length) {
            //双向依赖的模块集合
            var errorArr = []
                //遍历依赖模块的集合
            deps.filter(function(arr) {
                    //如果左侧模块与右侧模块名称相同
                    return deps.filter(function(item) {
                            return arr[0] === item[1] && arr[1] === item[0]
                        }).length
                        //遍历结果，去重
                }).forEach(function(arr) {
                    //左右模块拼接后的结果不能存放在errorArr数组中
                    if (!~errorArr.indexOf(arr.join('<=>')) &&
                        !~errorArr.indexof([arr[1], arr[0]].join('<=>'))
                    ) {
                        //如果不在errorArx数组中，存储双向依赖的两个模块的拼接形式
                        errorArr.push(arr.join('<=>'))
                    }
                })
                //如果有双向依赖的模块
            if (errorArr.length) {
                // 提示用户，错误很严重，相互依赖的模块可能无法运行
                IView.seriousError('模块禁止双向依赖！' + errorArr.join(' | '))
            } else {
                //对于没有双向依赖的模块，可能依赖的模块不存在，提示用户定义不存在的模块，以及错误
                //所在模块的位音y天，肥K）
                //遍历依赖的模块集合
                deps.forEach(function(arr) {
                    //arr[0]表示被依赖的模块，arr[1]表示当前模块
                    //如果被依赖的模块不在未排序的模块由
                    if (modules.indexof(arr[0]) < 0) {
                        //提示用户，定义模块
                        IView.seriousError(arr[1] + '模块中依赖的模块，' + arr[0] + '，尚未定义！请定义，' + arr[0] + ',模块')
                    }
                })
            }
            //阻止程序执行
            return;
        }
        //删除依赖数组
        deps = deps.filter(function(arr) {
                //去除左边是module的成员
                return arr[0] != module;
            })
            //如果还有没处理的模块，继续处理
        if (modules.length) {
            return this.dependenciesArrayOrder(modules, deps, result);
        }
        return result;
    },
    /** 模块名称
        @module
        模块实例化对象
        @instance
    **/
    uninstall: function(module, instance) {
        //如果该模块存在实例化对象
        if (this.instances[module]) {
            //找到该模块的实例化对象
            this.instances[module].some(function(obj, index, arr) {
                //如果找到该模块的实例化对象
                if (obj === instance) {
                    //删除该模块的实例化对象
                    var result = arr.splice(index, 1);
                    //执行模块实例化对象的删除方法，进入模块生命周期的第六个阶段
                    //在模块集合中，一个实例化对象存储一次，因此删除了该模块的实例化对象之后，
                    result.destory();
                    //就不用再遍历了
                    return true;
                }
            })
        }
    },

});

//我们希望Base基类的属性具有特性，所以定义propertiesExtend的方法
//工具方法：我们简单地认为，设置属性对象至少包含两个属性
IView.propertiesExtend(IView.Base.prototype,
    //一类消息是在创建时自动绑定的，定义在__message___中，通常是系统消息
    //为基类扩展消息系统
    IView.EventCenter, {
        //损块消息分成两类
        //创建所有模块之后，发布的一个系统消息ready
        //膚性值value表示回调函数名称，要在组件中定义
        __message__: {
            //属性名称key表示消息名称
            //理论上，每一个模块都可能被扩展，都应该定义默认的_hooks方法，在后面的章节中，为了避免执行
            //另一类消息是在各自的横块中单独定义的，定义在message中
            'IView.ready': 'ready'
        },
        message: {},
        //内容的_hooks，我们放弃定义默认的_hooks方法
        // _hooks: function() {},
        // 依赖集合, 禁止双向依赖
        dependencies: [],
        //生命周期的6个阶段
        //模块安装前
        beforeInstall: function() {},
        //模块创建前
        beforeCreate: function() {},
        //模块初始化
        initialize: function() {},
        //模块创建后
        afterCreated: function() {},
        //所有模块完成实例化后
        ready: function() {},
        //模块实例化对象销毁前
        beforeDestory: function() {},
        consts: function(key, value) {
            // 如果value存在，则修改属性
            if (value !== undefined) {
                //修改类的静态属性
                this.constructor[key] = value;
                //如果value不存在，并且key是字符串，则获取类的静态属性
            } else if (typeof key === 'string') {
                //获取类的静态属性
                return this.constructor[key]
                    //如果value不存在，并且key是对象，则设置类的多个静态属性
            } else if (IView.toString.call(key) === "[object Object]") {
                //遍历这些静态属性
                for (var i in key) {
                    //逐一设置
                    this.consts(i, key[i])
                }
            }
        },
        //模块类的销毁方法
        destory: function() {
            //执行模块的最后一个生命周期钩子方法
            this.beforeDestory();
            //注销该实例化对象注册的所有消息
            IView.destory(this);
        }
    })