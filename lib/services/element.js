Ickt('$element', function() {
    return {
        /***
        封装设置样式的方法
        设置的元素
        * @dom
        样式属性名称|样式对象
        * @key
        样式的属性值
        * @val
        ***/
        css: function(dom, key, val) {
            //如果key是字符出，说明设置一个样式
            if (typeof key === 'string') {
                dom.style[key] = val;
                //否则，key是对象，说明设置多个样式
            } else {
                //遍历样式对象，逐一设置
                for (var i in key) {
                    //设置单个样式
                    this.css(dom, i, key[i])
                }
            }
        },
        /***
        *创建元素
        元素的样式
        * estyle
        该元素的容器元素
        * @container
        元素名称
        * @name
        **/
        create: function(style, container, name) {
            //创建元素
            var dom = document.createElement(name || 'div');
            //设置样式
            this.css(dom, style);
            //将创建的元素添加到容器元素内
            container && container.appendChild(dom);
            //返回元素
            return dom;
        }
    }
})