(function (window) {
    /**
     * 第三方库
     * @type {function(*): Object}
     */
    var u = _;
    /**
     * @override lib
     */

    var lib = {};

    /*-------------------------------------------lib----------------------------------------------------*/

    /**
     * ESUI (Enterprise Simple UI library)
     * Copyright 2013 Baidu Inc. All rights reserved.
     *
     * @ignore
     * @file 字符串相关基础库
     * @author otakustay
     */
    var WHITESPACE = /^[\s\xa0\u3000]+|[\u3000\xa0\s]+$/g;

    /**
     * 删除目标字符串两端的空白字符
     *
     * @param {string} source 目标字符串
     * @return {string} 删除两端空白字符后的字符串
     */
    lib.trim = function (source) {
        if (!source) {
            return '';
        }

        return String(source).replace(WHITESPACE, '');
    };

    /**
     * 字符串格式化
     *
     * 简单的格式化使用`${name}`进行占位
     *
     * @param {string} template 原字符串
     * @param {Object} data 用于模板替换的数据
     * @return {string} 格式化后的字符串
     */
    lib.format = function (template, data) {
        if (!template) {
            return '';
        }

        if (data == null) {
            return template;
        }

        return template.replace(
            /\$\{(.+?)\}/g,
            function (match, key) {
                var replacer = data[key];
                if (typeof replacer === 'function') {
                    replacer = replacer(key);
                }

                return replacer == null ? '' : replacer;
            }
        );
    };

    /**
     * 将字符串转换成`camelCase`格式
     *
     * 该方法将横线`-`视为单词的 **唯一分隔符**
     *
     * @param {string} source 源字符串
     * @return {string}
     */
    lib.camelize = function (source) {
        if (!source) {
            return '';
        }

        return source.replace(
            /-([a-z])/g,
            function (match, alpha) {
                return alpha.toUpperCase();
            }
        );
    };

    /**
     * 将字符串转换成`PascalCase`格式
     *
     * 该方法将横线`-`视为单词的 **唯一分隔符**
     *
     * @param {string} source 源字符串
     * @return {string}
     */
    lib.pascalize = function (source) {
        if (!source) {
            return '';
        }

        return source.charAt(0).toUpperCase()
            + lib.camelize(source.slice(1));
    };

    /**
     * 将Token列表字符串切分为数组
     *
     * Token列表是使用逗号或空格分隔的字符串
     *
     * @param {string | string[] | null | undefined} input 输入值
     * @return {string[]}
     */
    lib.splitTokenList = function (input) {
        if (!input) {
            return [];
        }

        if (u.isArray(input)) {
            return;
        }

        return u.chain(input.split(/[,\s]/))
            .map(lib.trim)
            .compact()
            .value();
    };

    /*-----------------------------------------------------------------------------------------------*/

    /**
     * ESUI (Enterprise Simple UI library)
     * Copyright 2013 Baidu Inc. All rights reserved.
     *
     * @ignore
     * @file 页面相关基础库
     * @author otakustay
     */
    var documentElement = document.documentElement;
    var body = document.body;
    var viewRoot = document.compatMode === 'BackCompat'
        ? body
        : documentElement;

    /**
     * @class lib.page
     * @singleton
     */
    var page = {};

    /**
     * 获取页面宽度
     *
     * @return {number} 页面宽度
     */
    page.getWidth = function () {
        return Math.max(
            (documentElement ? documentElement.scrollWidth : 0),
            (body ? body.scrollWidth : 0),
            (viewRoot ? viewRoot.clientWidth : 0),
            0
        );
    };

    /**
     * 获取页面高度
     *
     * @return {number} 页面高度
     */
    page.getHeight = function () {
        return Math.max(
            (documentElement ? documentElement.scrollHeight : 0),
            (body ? body.scrollHeight : 0),
            (viewRoot ? viewRoot.clientHeight : 0),
            0
        );
    };


    /**
     * 获取页面视觉区域宽度
     *
     * @return {number} 页面视觉区域宽度
     */
    page.getViewWidth = function () {
        return viewRoot ? viewRoot.clientWidth : 0;
    };

    /**
     * 获取页面视觉区域高度
     *
     * @return {number} 页面视觉区域高度
     */
    page.getViewHeight = function () {
        return viewRoot ? viewRoot.clientHeight : 0;
    };

    /**
     * 获取纵向滚动量
     *
     * @return {number} 纵向滚动量
     */
    page.getScrollTop = function () {
        return window.pageYOffset
            || document.documentElement.scrollTop
            || document.body.scrollTop
            || 0;
    };

    /**
     * 获取横向滚动量
     *
     * @return {number} 横向滚动量
     */
    page.getScrollLeft = function () {
        return window.pageXOffset
            || document.documentElement.scrollLeft
            || document.body.scrollLeft
            || 0;
    };

    /**
     * 获取页面纵向坐标
     *
     * @return {number}
     */
    page.getClientTop = function () {
        return document.documentElement.clientTop
            || document.body.clientTop
            || 0;
    };

    /**
     * 获取页面横向坐标
     *
     * @return {number}
     */
    page.getClientLeft = function () {
        return document.documentElement.clientLeft
            || document.body.clientLeft
            || 0;
    };

    lib.page = page;

    /*-----------------------------------------------------------------------------------------------*/

    /**
     * ESUI (Enterprise Simple UI library)
     * Copyright 2013 Baidu Inc. All rights reserved.
     *
     * @ignore
     * @file 语言基础库
     * @author otakustay
     */
    var counter = 0x861005;
    /**
     * 获取唯一id
     *
     * @param {string} [prefix="esui"] 前缀
     * @return {string}
     */
    lib.getGUID = function (prefix) {
        prefix = prefix || 'esui';
        return prefix + counter++;
    };

    /**
     * 为类型构造器建立继承关系
     *
     * @param {Function} subClass 子类构造器
     * @param {Function} superClass 父类构造器
     * @return {Function} 返回`subClass`构造器
     */
    lib.inherits = function (subClass, superClass) {
        var Empty = function () {
        };
        Empty.prototype = superClass.prototype;
        var selfPrototype = subClass.prototype;
        var proto = subClass.prototype = new Empty();

        for (var key in selfPrototype) {
            proto[key] = selfPrototype[key];
        }
        subClass.prototype.constructor = subClass;
        subClass.superClass = superClass.prototype;

        return subClass;
    };

    /**
     * 对一个对象进行深度复制
     *
     * @param {Object} source 需要进行复制的对象
     * @return {Object} 复制出来的新对象
     * @deprecated 将在4.0版本中移除，使用{@link lib#deepClone}方法代替
     */
    lib.clone = function (source) {
        if (!source || typeof source !== 'object') {
            return source;
        }

        var result = source;
        if (u.isArray(source)) {
            result = u.clone(source);
        }
        else if (({}).toString.call(source) === '[object Object]'
            // IE下，DOM和BOM对象上一个语句为true，
            // isPrototypeOf挂在`Object.prototype`上的，
            // 因此所有的字面量都应该会有这个属性
            // 对于在`window`上挂了`isPrototypeOf`属性的情况，直接忽略不考虑
            && ('isPrototypeOf' in source)
        ) {
            result = {};
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    result[key] = lib.deepClone(source[key]);
                }
            }
        }

        return result;
    };

    /**
     * 对一个对象进行深度复制
     *
     * @param {Object} source 需要进行复制的对象
     * @return {Object} 复制出来的新对象
     */
    lib.deepClone = lib.clone;

    /**
     * 将数组转换为字典
     *
     * @param {Array} array 数组
     * @return {Object} 以`array`中的每个对象为键，以`true`为值的字典对象
     */
    lib.toDictionary = function (array) {
        var dictionary = {};
        u.each(
            array,
            function (value) {
                dictionary[value] = true;
            }
        );

        return dictionary;
    };

    /**
     * 判断一个对象是否为数组
     *
     * @param {Mixed} source 需要判断的对象
     * @return {boolean}
     * @deprecated 将在4.0版本中移除，使用`underscore.isArray`代替
     */
    lib.isArray = u.isArray;

    /**
     * 将对象转为数组
     *
     * @param {Mixed} source 需要转换的对象
     * @return {Array}
     * @deprecated 将在4.0版本中移除，使用`underscore.toArray`代替
     */
    lib.toArray = u.toArray;

    /**
     * 扩展对象
     *
     * @param {Object} source 需要判断的对象
     * @param {Object...} extensions 用于扩展`source`的各个对象
     * @return {Object} 完成扩展的`source`对象
     * @deprecated 将在4.0版本中移除，使用`underscore.extend`代替
     */
    lib.extend = u.extend;

    /**
     * 固定函数的`this`对象及参数
     *
     * @param {Function} fn 需要处理的函数
     * @param {Object} thisObject 执行`fn`时的`this`对象
     * @param {Mixed...} args 执行`fn`时追回在前面的参数
     * @return {Function}
     * @deprecated 将在4.0版本中移除，使用`underscore.bind`代替
     */
    lib.bind = u.bind;

    /**
     * 为函数添加参数
     *
     * 该函数类似于{@link lib#bind}，但不固定`this`对象
     *
     * @param {Function} fn 需要处理的函数
     * @param {Mixed...} args 执行`fn`时追回在前面的参数
     * @return {Function}
     * @deprecated 将在4.0版本中移除，使用`underscore.partial`代替
     */
    lib.curry = u.partial;

    /**
     * 在数组或类数组对象中查找指定对象的索引
     *
     * @param {Array | Object} array 用于查找的数组或类数组对象
     * @param {Mixed} value 需要查找的对象
     * @param {number} [fromIndex] 开始查找的索引
     * @return {number}
     * @deprecated 将在4.0版本中移除，使用`underscore.indexOf`代替
     */
    lib.indexOf = u.indexOf;

    /**
     * 对字符串进行HTML解码
     *
     * @param {string} source 需要解码的字符串
     * @return {string}
     * @deprecated 将在4.0版本中移除，使用`underscore.unescape`代替
     */
    lib.decodeHTML = u.unescape;

    /**
     * 对字符串进行HTML编码
     *
     * @param {string} source 需要编码的字符串
     * @return {string}
     * @deprecated 将在4.0版本中移除，使用`underscore.escape`代替
     */
    lib.encodeHTML = u.escape;

    /*-----------------------------------------------------------------------------------------------*/

    /**
     * ESUI (Enterprise Simple UI library)
     * Copyright 2013 Baidu Inc. All rights reserved.
     *
     * @ignore
     * @file DOM相关基础库
     * @author otakustay
     */
    /**
     * 从文档中获取指定的DOM元素
     *
     * @param {string | HTMLElement} id 元素的id或DOM元素
     * @return {HTMLElement | null} 获取的元素，查找不到时返回null
     */
    lib.g = function (id) {
        if (!id) {
            return null;
        }

        return typeof id === 'string' ? document.getElementById(id) : id;
    };

    /**
     * 判断一个元素是否输入元素
     *
     * @param {HTMLElement} element 目标元素
     * @return {boolean}
     */
    lib.isInput = function (element) {
        var nodeName = element.nodeName.toLowerCase();
        return nodeName === 'input'
            || nodeName === 'select'
            || nodeName === 'textarea';
    };

    /**
     * 移除目标元素
     *
     * @param {HTMLElement} element 目标元素或其id
     */
    lib.removeNode = function (element) {
        if (typeof element === 'string') {
            element = lib.g(element);
        }

        if (!element) {
            return;
        }

        var parent = element.parentNode;
        if (parent) {
            parent.removeChild(element);
        }
    };

    /**
     * 将目标元素添加到基准元素之后
     *
     * @param {HTMLElement} element 被添加的目标元素
     * @param {HTMLElement} reference 基准元素
     * @return {HTMLElement} 被添加的目标元素
     */
    lib.insertAfter = function (element, reference) {
        var parent = reference.parentNode;

        if (parent) {
            parent.insertBefore(element, reference.nextSibling);
        }
        return element;
    };

    /**
     * 将目标元素添加到基准元素之前
     *
     * @param {HTMLElement} element 被添加的目标元素
     * @param {HTMLElement} reference 基准元素
     * @return {HTMLElement} 被添加的目标元素
     */
    lib.insertBefore = function (element, reference) {
        var parent = reference.parentNode;

        if (parent) {
            parent.insertBefore(element, reference);
        }

        return element;
    };

    /**
     * 获取子元素
     * @param {HTMLElement} element 目标元素
     * @return {HTMLElement[]} 目标元素的所有子元素
     */
    lib.getChildren = function (element) {
        return u.filter(
            element.children,
            function (child) {
                return child.nodeType === 1;
            }
        );
    };


    /**
     * 获取计算样式值
     *
     * @param {HTMLElement} element 目标元素
     * @param {string} key 样式名称
     * @return {string}
     */
    lib.getComputedStyle = function (element, key) {
        if (!element) {
            return '';
        }

        var doc = element.nodeType === 9
            ? element
            : element.ownerDocument || element.document;

        if (doc.defaultView && doc.defaultView.getComputedStyle) {
            var styles = doc.defaultView.getComputedStyle(element, null);
            if (styles) {
                return styles[key] || styles.getPropertyValue(key);
            }
        }
        else if (element && element.currentStyle) {
            return element.currentStyle[key];
        }
        return '';
    };

    /**
     * 获取元素样式值
     *
     * @param {HTMLElement} element 目标元素
     * @param {string} key 样式名称
     * @return {string} 目标元素的指定样式值
     */
    lib.getStyle = function (element, key) {
        key = string.camelize(key);
        return element.style[key]
            || (element.currentStyle ? element.currentStyle[key] : '')
            || lib.getComputedStyle(element, key);
    };

    /**
     * 获取元素在页面中的位置和尺寸信息
     *
     * @param {HTMLElement} element 目标元素
     * @return {Object} 元素的尺寸和位置信息，
     * 包含`top`、`right`、`bottom`、`left`、`width`和`height`属性
     */
    lib.getOffset = function (element) {
        var rect = element.getBoundingClientRect();
        var offset = {
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left,
            width: rect.right - rect.left,
            height: rect.bottom - rect.top
        };
        var clientTop = document.documentElement.clientTop
            || document.body.clientTop
            || 0;
        var clientLeft = document.documentElement.clientLeft
            || document.body.clientLeft
            || 0;
        var scrollTop = window.pageYOffset
            || document.documentElement.scrollTop;
        var scrollLeft = window.pageXOffset
            || document.documentElement.scrollLeft;
        offset.top = offset.top + scrollTop - clientTop;
        offset.bottom = offset.bottom + scrollTop - clientTop;
        offset.left = offset.left + scrollLeft - clientLeft;
        offset.right = offset.right + scrollLeft - clientLeft;

        return offset;
    };

    /**
     * 获取元素内部文本
     *
     * @param {HTMLElement} element 目标元素
     * @return {string}
     */
    lib.getText = function (element) {
        var text = '';

        //  text 和 CDATA 节点，取nodeValue
        if (element.nodeType === 3 || element.nodeType === 4) {
            text += element.nodeValue;
        }
        // 8 是 comment Node
        else if (element.nodeType !== 8) {
            u.each(
                element.childNodes,
                function (child) {
                    text += lib.getText(child);
                }
            );
        }

        return text;
    };

    /**
     * @class lib.dom
     * @singleton
     */
    lib.dom = {};

    /**
     * 获取目标元素的第一个元素节点
     *
     * @param {HTMLElement | string} element 目标元素或其id
     * @return {HTMLElement | null} 目标元素的第一个元素节点，查找不到时返回null
     */
    lib.dom.first = function (element) {
        element = lib.g(element);

        if (element.firstElementChild) {
            return element.firstElementChild;
        }

        var node = element.firstChild;
        for (; node; node = node.nextSibling) {
            if (node.nodeType === 1) {
                return node;
            }
        }

        return null;
    };

    /**
     * 获取目标元素的最后一个元素节点
     *
     * @param {HTMLElement | string} element 目标元素或其id
     * @return {HTMLElement | null} 目标元素的第一个元素节点，查找不到时返回null
     */
    lib.dom.last = function (element) {
        element = lib.g(element);

        if (element.lastElementChild) {
            return element.lastElementChild;
        }

        var node = element.lastChild;
        for (; node; node = node.previousSibling) {
            if (node.nodeType === 1) {
                return node;
            }
        }

        return null;
    };

    /**
     * 获取目标元素的下一个兄弟元素节点
     *
     * @param {HTMLElement | string} element 目标元素或其id
     * @return {HTMLElement | null} 目标元素的下一个元素节点，查找不到时返回null
     */
    lib.dom.next = function (element) {
        element = lib.g(element);

        if (element.nextElementSibling) {
            return element.nextElementSibling;
        }

        var node = element.nextSibling;
        for (; node; node = node.nextSibling) {
            if (node.nodeType === 1) {
                return node;
            }
        }

        return null;
    };

    /**
     * 判断一个元素是否包含另一个元素
     *
     * @param {HTMLElement | string} container 包含元素或元素的 id
     * @param {HTMLElement | string} contained 被包含元素或元素的 id
     * @return {boolean} `contained`元素是否被包含于`container`元素的DOM节点上
     */
    lib.dom.contains = function (container, contained) {
        container = lib.g(container);
        contained = lib.g(contained);

        //fixme: 无法处理文本节点的情况(IE)
        return container.contains
            ? container !== contained && container.contains(contained)
            : !!(container.compareDocumentPosition(contained) & 16);
    };

    /*-----------------------------------------------------------------------------------------------*/

    /**
     * ESUI (Enterprise Simple UI library)
     * Copyright 2013 Baidu Inc. All rights reserved.
     *
     * @ignore
     * @file DOM class基础库
     * @author otakustay
     */
    function getClassList(element) {
        return element.className
            ? element.className.split(/\s+/)
            : [];
    }

    /**
     * 判断元素是否拥有指定的class
     *
     * @param {HTMLElement | string} element 目标元素或其id
     * @param {string} className 要判断的class名称
     * @return {boolean} 是否拥有指定的class
     */
    lib.hasClass = function (element, className) {
        element = lib.g(element);

        if (className === '') {
            throw new Error('className must not be empty');
        }

        if (!element || !className) {
            return false;
        }

        if (element.classList) {
            return element.classList.contains(className);
        }

        var classes = getClassList(element);
        return u.includes(classes, className);
    };

    /**
     * 为目标元素添加class
     *
     * @param {HTMLElement | string} element 目标元素或其id
     * @param {string} className 要添加的class名称
     * @return {HTMLElement} 目标元素
     */
    lib.addClass = function (element, className) {
        element = lib.g(element);

        if (className === '') {
            throw new Error('className must not be empty');
        }

        if (!element || !className) {
            return element;
        }

        if (element.classList) {
            element.classList.add(className);
            return element;
        }

        var classes = getClassList(element);
        if (u.includes(classes, className)) {
            return element;
        }

        classes.push(className);
        element.className = classes.join(' ');

        return element;
    };

    /**
     * 批量添加class
     *
     * @param {HTMLElement | string} element 目标元素或其id
     * @param {string[]} classes 需添加的class名称
     * @return {HTMLElement} 目标元素
     */
    lib.addClasses = function (element, classes) {
        element = lib.g(element);

        if (!element || !classes) {
            return element;
        }

        if (element.classList) {
            u.each(
                classes,
                function (className) {
                    element.classList.add(className);
                }
            );
            return element;
        }

        var originalClasses = getClassList(element);
        var newClasses = u.union(originalClasses, classes);

        if (newClasses.length > originalClasses.length) {
            element.className = newClasses.join(' ');
        }

        return element;
    };

    /**
     * 移除目标元素的class
     *
     * @param {HTMLElement | string} element 目标元素或目标元素的 id
     * @param {string} className 要移除的class名称
     * @return {HTMLElement} 目标元素
     */
    lib.removeClass = function (element, className) {
        element = lib.g(element);

        if (className === '') {
            throw new Error('className must not be empty');
        }

        if (!element || !className) {
            return element;
        }

        if (element.classList) {
            element.classList.remove(className);
            return element;
        }

        var classes = getClassList(element);
        var changed = false;
        // 这个方法比用`u.diff`要快
        for (var i = 0; i < classes.length; i++) {
            if (classes[i] === className) {
                classes.splice(i, 1);
                i--;
                changed = true;
            }
        }

        if (changed) {
            element.className = classes.join(' ');
        }

        return element;
    };

    /**
     * 批量移除class
     *
     * @param {HTMLElement | string} element 目标元素或其id
     * @param {string[]} classes 需移除的class名称
     * @return {HTMLElement} 目标元素
     */
    lib.removeClasses = function (element, classes) {
        element = lib.g(element);

        if (!element || !classes) {
            return element;
        }

        if (element.classList) {
            u.each(
                classes,
                function (className) {
                    element.classList.remove(className);
                }
            );
            return element;
        }

        var originalClasses = getClassList(element);
        var newClasses = u.difference(originalClasses, classes);

        if (newClasses.length < originalClasses.length) {
            element.className = newClasses.join(' ');
        }

        return element;
    };

    /**
     * 切换目标元素的class
     *
     * @param {HTMLElement} element 目标元素或目标元素的 id
     * @param {string} className 要切换的class名称
     * @return {HTMLElement} 目标元素
     */
    lib.toggleClass = function (element, className) {
        element = lib.g(element);

        if (className === '') {
            throw new Error('className must not be empty');
        }

        if (!element || !className) {
            return element;
        }

        if (element.classList) {
            element.classList.toggle(className);
            return element;
        }

        var classes = getClassList(element);
        var containsClass = false;
        for (var i = 0; i < classes.length; i++) {
            if (classes[i] === className) {
                classes.splice(i, 1);
                containsClass = true;
                i--;
            }
        }

        if (!containsClass) {
            classes.push(className);
        }
        element.className = classes.join(' ');

        return element;
    };

    /*-----------------------------------------------------------------------------------------------*/

    /**
     * ESUI (Enterprise Simple UI library)
     * Copyright 2013 Baidu Inc. All rights reserved.
     *
     * @ignore
     * @file DOM属性相关基础库
     * @author otakustay
     */
    /**
     * 检查元素是否有指定的属性
     *
     * @param {HTMLElement} element 指定元素
     * @param {string} name 指定属性名称
     * @return {boolean}
     */
    lib.hasAttribute = function (element, name) {
        if (element.hasAttribute) {
            return element.hasAttribute(name);
        }
        else {
            return element.attributes
                && element.attributes[name]
                && element.attributes[name].specified;
        }
    };

    // 提供给 setAttribute 与 getAttribute 方法作名称转换使用
    var ATTRIBUTE_NAME_MAPPING = (function () {
        var result = {
            cellpadding: 'cellPadding',
            cellspacing: 'cellSpacing',
            colspan: 'colSpan',
            rowspan: 'rowSpan',
            valign: 'vAlign',
            usemap: 'useMap',
            frameborder: 'frameBorder'
        };

        var div = document.createElement('div');
        div.innerHTML = '<label for="test" class="test"></label>';
        var label = div.getElementsByTagName('label')[0];

        if (label.getAttribute('className') === 'test') {
            result['class'] = 'className';
        }
        else {
            result.className = 'class';
        }

        if (label.getAttribute('for') === 'test') {
            result.htmlFor = 'for';
        }
        else {
            result['for'] = 'htmlFor';
        }

        return result;
    }());


    /**
     * 设置元素属性，会对某些值做转换
     *
     * @param {HTMLElement | string} element 目标元素或其id
     * @param {string} key 要设置的属性名
     * @param {string} value 要设置的属性值
     * @return {HTMLElement} 目标元素
     */
    lib.setAttribute = function (element, key, value) {
        element = lib.g(element);

        if (key === 'style') {
            element.style.cssText = value;
        }
        else {
            key = ATTRIBUTE_NAME_MAPPING[key] || key;
            element.setAttribute(key, value);
        }

        return element;
    };

    /**
     * 获取目标元素的属性值
     *
     * @param {HTMLElement | string} element 目标元素或其id
     * @param {string} key 要获取的属性名称
     * @return {string | null} 目标元素的attribute值，获取不到时返回 null
     */
    lib.getAttribute = function (element, key) {
        element = lib.g(element);

        if (key === 'style') {
            return element.style.cssText;
        }

        key = ATTRIBUTE_NAME_MAPPING[key] || key;
        return element.getAttribute(key);
    };

    /**
     * 移除元素属性
     *
     * @param {HTMLElement | string} element 目标元素或其id
     * @param {string} key 属性名称
     */
    lib.removeAttribute = function (element, key) {
        element = lib.g(element);

        key = ATTRIBUTE_NAME_MAPPING[key] || key;
        element.removeAttribute(key);
    };

    /*------------------------------------mini-event-----------------------------------------------------------*/
    function returnTrue() {
        return true;
    }

    function returnFalse() {
        return false;
    }

    function isObject(target) {
        return Object.prototype.toString.call(target) === '[object Object]';
    }

    /**
     * 事件对象类
     *
     * 3个重载：
     *      - `new Event(type)`
     *      - `new Event(args)`
     *      - `new Event(type, args)`
     * 只提供一个对象作为参数，则是`new Event(args)`的形式，需要加上type
     *
     * @constructor
     * @param {string | Mixed} [type] 事件类型
     * @param {Mixed} [args] 事件中的数据，如果此参数为一个对象，
     * 则将参数扩展到`Event`实例上。如果参数是非对象类型，则作为实例的`data`属性使用
     */
    function Event(type, args) {
        // 如果第1个参数是对象，则就当是`new Event(args)`形式
        if (typeof type === 'object') {
            args = type;
            type = args.type;
        }

        if (isObject(args)) {
            lib.extend(this, args);
        }
        else if (args) {
            this.data = args;
        }

        if (type) {
            this.type = type;
        }
    }

    /**
     * 判断默认行为是否已被阻止
     *
     * @return {boolean}
     */
    Event.prototype.isDefaultPrevented = returnFalse;

    /**
     * 阻止默认行为
     */
    Event.prototype.preventDefault = function () {
        this.isDefaultPrevented = returnTrue;
    };

    /**
     * 判断事件传播是否已被阻止
     *
     * @return {boolean}
     */
    Event.prototype.isPropagationStopped = returnFalse;

    /**
     * 阻止事件传播
     */
    Event.prototype.stopPropagation = function () {
        this.isPropagationStopped = returnTrue;
    };

    /**
     * 判断事件的立即传播是否已被阻止
     *
     * @return {boolean}
     */
    Event.prototype.isImmediatePropagationStopped = returnFalse;

    /**
     * 立即阻止事件传播
     */
    Event.prototype.stopImmediatePropagation = function () {
        this.isImmediatePropagationStopped = returnTrue;

        this.stopPropagation();
    };

    var globalWindow = (function () {
        return this;
    }());

    /**
     * 从DOM事件对象生成一个Event对象
     *
     * @param {Event} domEvent DOM事件对象
     * @param {string} [type] 事件类型
     * @param {Mixed} [args] 事件数据
     * @return {Event}
     * @static
     */
    Event.fromDOMEvent = function (domEvent, type, args) {
        domEvent = domEvent || globalWindow.event;

        var event = new Event(type, args);

        event.preventDefault = function () {
            if (domEvent.preventDefault) {
                domEvent.preventDefault();
            }
            else {
                domEvent.returnValue = false;
            }

            Event.prototype.preventDefault.call(this);
        };

        event.stopPropagation = function () {
            if (domEvent.stopPropagation) {
                domEvent.stopPropagation();
            }
            else {
                domEvent.cancelBubble = true;
            }

            Event.prototype.stopPropagation.call(this);
        };

        event.stopImmediatePropagation = function () {
            if (domEvent.stopImmediatePropagation) {
                domEvent.stopImmediatePropagation();
            }

            Event.prototype.stopImmediatePropagation.call(this);
        };

        return event;
    };

    // 复制事件属性的时候不复制这几个
    var EVENT_PROPERTY_BLACK_LIST = {
        type: true, target: true,
        preventDefault: true, isDefaultPrevented: true,
        stopPropagation: true, isPropagationStopped: true,
        stopImmediatePropagation: true, isImmediatePropagationStopped: true
    };

    /**
     * 从一个已有事件对象生成一个新的事件对象
     *
     * @param {Event} originalEvent 作为源的已有事件对象
     * @param {Object} [options] 配置项
     * @param {string} [options.type] 新事件对象的类型，不提供则保留原类型
     * @param {boolean} [options.preserveData=false] 是否保留事件的信息
     * @param {boolean} [options.syncState=false] 是否让2个事件状态同步，
     * 状态包括 **阻止传播** 、 **立即阻止传播** 和 **阻止默认行为**
     * @param {Object} [options.extend] 提供事件对象的更多属性
     * @static
     */
    Event.fromEvent = function (originalEvent, options) {
        var defaults = {
            type: originalEvent.type,
            preserveData: false,
            syncState: false
        };
        options = lib.extend(defaults, options);

        var newEvent = new Event(options.type);
        // 如果保留数据，则把数据复制过去
        if (options.preserveData) {
            // 要去掉一些可能出现的杂质，因此不用`lib.extend`
            for (var key in originalEvent) {
                if (originalEvent.hasOwnProperty(key)
                    && !EVENT_PROPERTY_BLACK_LIST.hasOwnProperty(key)
                ) {
                    newEvent[key] = originalEvent[key];
                }
            }
        }

        // 如果有扩展属性，加上去
        if (options.extend) {
            lib.extend(newEvent, options.extend);
        }

        // 如果要同步状态，把和状态相关的方法挂接上
        if (options.syncState) {
            newEvent.preventDefault = function () {
                originalEvent.preventDefault();

                Event.prototype.preventDefault.call(this);
            };

            newEvent.stopPropagation = function () {
                originalEvent.stopPropagation();

                Event.prototype.stopPropagation.call(this);
            };

            newEvent.stopImmediatePropagation = function () {
                originalEvent.stopImmediatePropagation();

                Event.prototype.stopImmediatePropagation.call(this);
            };
        }

        return newEvent;
    };

    /**
     * 将一个对象的事件代理到另一个对象
     *
     * @param {EventTarget} from 事件提供方
     * @param {EventTarget | string} fromType 为字符串表示提供方事件类型；
     * 为可监听对象则表示接收方，此时事件类型由第3个参数提供
     * @param {EventTarget | string} to 为字符串则表示提供方和接收方事件类型一致，
     * 由此参数作为事件类型；为可监听对象则表示接收方，此时第2个参数必须为字符串
     * @param {string} [toType] 接收方的事件类型
     * @param {Object} [options] 配置项
     * @param {boolean} [options.preserveData=false] 是否保留事件的信息
     * @param {boolean} [options.syncState=false] 是否让2个事件状态同步，
     * 状态包括**阻止传播**、**立即阻止传播**和**阻止默认行为**
     * @param {Object} [options.extend] 提供事件对象的更多属性
     *
     *     // 当`label`触发`click`事件时，自身也触发`click`事件
     *     Event.delegate(label, this, 'click');
     *
     *     // 当`label`触发`click`事件时，自身触发`labelclick`事件
     *     Event.delegate(label, 'click', this, 'labelclick');
     * @static
     */
    Event.delegate = function (from, fromType, to, toType, options) {
        // 重载：
        //
        // 1. `.delegate(from, fromType, to, toType)`
        // 2. `.delegate(from, fromType, to, toType, options)`
        // 3. `.delegate(from, to, type)`
        // 4. `.delegate(from, to, type, options)

        // 重点在于第2个参数的类型，如果为字符串则肯定是1或2，否则为3或4
        var useDifferentType = typeof fromType === 'string';
        var source = {
            object: from,
            type: useDifferentType ? fromType : to
        };
        var target = {
            object: useDifferentType ? to : fromType,
            type: useDifferentType ? toType : to
        };
        var config = useDifferentType ? options : toType;
        config = lib.extend({preserveData: false}, config);

        // 如果提供方不能注册事件，或接收方不能触发事件，那就不用玩了
        if (typeof source.object.on !== 'function'
            || typeof target.object.on !== 'function'
            || typeof target.object.fire !== 'function'
        ) {
            return;
        }

        var delegator = function (originalEvent) {
            var event = Event.fromEvent(originalEvent, config);
            // 修正`type`和`target`属性
            event.type = target.type;
            event.target = target.object;

            target.object.fire(target.type, event);
        };

        source.object.on(source.type, delegator);
    };

    /**
     * 判断已有的一个事件上下文对象是否和提供的参数等同
     *
     * @param {Object} context 在队列中已有的事件上下文对象
     * @param {Function | boolean} handler 处理函数，可以是`false`
     * @param {Mixed} [thisObject] 处理函数的`this`对象
     * @return {boolean}
     * @ignore
     */
    function isContextIdentical(context, handler, thisObject) {
        // `thisObject`为`null`和`undefined`时认为等同，所以用`==`
        return context
            && context.handler === handler
            && context.thisObject == thisObject;
    }

    /**
     * 事件队列
     *
     * @constructor
     */
    function EventQueue() {
        this.queue = [];
    }

    /**
     * 添加一个事件处理函数
     *
     * @param {Function | boolean} handler 处理函数，
     * 可以传递`false`作为特殊的处理函数，参考{@link EventTarget#on}
     * @param {Object} [options] 相关配置
     * @param {Mixed} [options.thisObject] 执行处理函数时的`this`对象
     * @param {boolean} [options.once=false] 设定函数仅执行一次
     */
    EventQueue.prototype.add = function (handler, options) {
        if (handler !== false && typeof handler !== 'function') {
            throw new Error(
                'event handler must be a function or const false');
        }

        var wrapper = {
            handler: handler
        };
        lib.extend(wrapper, options);

        for (var i = 0; i < this.queue.length; i++) {
            var context = this.queue[i];
            // 同样的处理函数，不同的`this`对象，相当于外面`bind`了一把再添加，
            // 此时认为这是完全不同的2个处理函数，但`null`和`undefined`认为是一样的
            if (isContextIdentical(context, handler, wrapper.thisObject)) {
                return;
            }
        }

        this.queue.push(wrapper);
    };

    /**
     * 移除一个或全部处理函数
     *
     * @param {Function | boolean} [handler] 指定移除的处理函数，
     * 如不提供则移除全部处理函数，可以传递`false`作为特殊的处理函数
     * @param {Mixed} [thisObject] 指定函数对应的`this`对象，
     * 不提供则仅移除没有挂载`this`对象的那些处理函数
     */
    EventQueue.prototype.remove = function (handler, thisObject) {
        // 如果没提供`handler`，则直接清空
        if (!handler) {
            this.clear();
            return;
        }

        for (var i = 0; i < this.queue.length; i++) {
            var context = this.queue[i];

            if (isContextIdentical(context, handler, thisObject)) {
                // 为了让`execute`过程中调用的`remove`工作正常，
                // 这里不能用`splice`直接删除，仅设为`null`留下这个空间
                this.queue[i] = null;

                // 完全符合条件的处理函数在`add`时会去重，因此这里肯定只有一个
                return;
            }
        }
    };

    /**
     * 移除全部处理函数，如果队列执行时调用这个函数，会导致剩余的处理函数不再执行
     */
    EventQueue.prototype.clear = function () {
        this.queue.length = 0;
    };

    /**
     * 执行所有处理函数
     *
     * @param {Event} event 事件对象
     * @param {Mixed} thisObject 函数执行时的`this`对象
     */
    EventQueue.prototype.execute = function (event, thisObject) {
        // 如果执行过程中销毁，`dispose`会把`this.queue`弄掉，所以这里留一个引用，
        // 在`dispose`中会额外把数组清空，因此不用担心后续的函数会执行
        var queue = this.queue;
        for (var i = 0; i < queue.length; i++) {
            if (typeof event.isImmediatePropagationStopped === 'function'
                && event.isImmediatePropagationStopped()
            ) {
                return;
            }

            var context = queue[i];

            // 移除事件时设置为`null`，因此可能无值
            if (!context) {
                continue;
            }

            var handler = context.handler;

            // `false`等同于两个方法的调用
            if (handler === false) {
                if (typeof event.preventDefault === 'function') {
                    event.preventDefault();
                }
                if (typeof event.stopPropagation === 'function') {
                    event.stopPropagation();
                }
            }
            else {
                // 这里不需要做去重处理了，在`on`的时候会去重，因此这里不可能重复
                handler.call(context.thisObject || thisObject, event);
            }

            if (context.once) {
                this.remove(context.handler, context.thisObject);
            }
        }
    };

    /**
     * 获取队列的长度
     *
     * @reutrn {number}
     */
    EventQueue.prototype.getLength = function () {
        var count = 0;
        for (var i = 0; i < this.queue.length; i++) {
            if (this.queue[i]) {
                count++;
            }
        }
        return count;
    };

    /**
     * 获取队列的长度，与{@link EventQueue#getLength}相同
     *
     * @method
     * @reutrn {number}
     */
    EventQueue.prototype.length = EventQueue.prototype.getLength;

    /**
     * 销毁
     *
     * 如果在队列执行的过程中销毁了对象，则在对象销毁后，剩余的处理函数不会再执行了
     */
    EventQueue.prototype.dispose = function () {
        // 在执行过程中被销毁的情况下，这里`length`置为0，循环就走不下去了
        this.clear();
        this.queue = null;
    };

    /**
     * 提供事件相关操作的基类
     *
     * 可以让某个类继承此类，获得事件的相关功能：
     *
     *     function MyClass() {
         *         // 此处可以不调用EventTarget构造函数
         *     }
     *
     *     inherits(MyClass, EventTarget);
     *
     *     var instance = new MyClass();
     *     instance.on('foo', executeFoo);
     *     instance.fire('foo', { bar: 'Hello World' });
     *
     * 当然也可以使用`Object.create`方法：
     *
     *     var instance = Object.create(EventTarget.prototype);
     *     instance.on('foo', executeFoo);
     *     instance.fire('foo', { bar: 'Hello World' });
     *
     * 还可以使用`enable`方法让一个静态的对象拥有事件功能：
     *
     *     var instance = {};
     *     EventTarget.enable(instance);
     *
     *     // 同样可以使用事件
     *     instance.on('foo', executeFoo);
     *     instance.fire('foo', { bar: 'Hello World' });
     *
     * @constructor
     */
    function EventTarget() {
    }

    /**
     * 注册一个事件处理函数
     *
     * @param {string} type 事件的类型
     * @param {Function | boolean} fn 事件的处理函数，
     * 特殊地，如果此参数为`false`，将被视为特殊的事件处理函数，
     * 其效果等于`preventDefault()`及`stopPropagation()`
     * @param {Mixed} [thisObject] 事件执行时`this`对象
     * @param {Object} [options] 事件相关配置项
     * @param {boolean} [options.once=false] 控制事件仅执行一次
     */
    EventTarget.prototype.on = function (type, fn, thisObject, options) {
        if (!this.miniEventPool) {
            this.miniEventPool = {};
        }

        if (!this.miniEventPool.hasOwnProperty(type)) {
            this.miniEventPool[type] = new EventQueue();
        }

        var queue = this.miniEventPool[type];

        options = lib.extend({}, options);
        if (thisObject) {
            options.thisObject = thisObject;
        }

        queue.add(fn, options);
    };

    /**
     * 注册一个仅执行一次的处理函数
     *
     * @param {string} type 事件的类型
     * @param {Function} fn 事件的处理函数
     * @param {Mixed} [thisObject] 事件执行时`this`对象
     * @param {Object} [options] 事件相关配置项
     */
    EventTarget.prototype.once = function (type, fn, thisObject, options) {
        options = lib.extend({}, options);
        options.once = true;
        this.on(type, fn, thisObject, options);
    };

    /**
     * 注销一个事件处理函数
     *
     * @param {string} type 事件的类型，
     * 如果值为`*`仅会注销通过`*`为类型注册的事件，并不会将所有事件注销
     * @param {Function} [handler] 事件的处理函数，
     * 无此参数则注销`type`指定类型的所有事件处理函数
     * @param {Mixed} [thisObject] 处理函数对应的`this`对象，
     * 无此参数则注销`type`与`handler`符合要求，且未挂载`this`对象的处理函数
     */
    EventTarget.prototype.un = function (type, handler, thisObject) {
        if (!this.miniEventPool
            || !this.miniEventPool.hasOwnProperty(type)
        ) {
            return;
        }

        var queue = this.miniEventPool[type];
        queue.remove(handler, thisObject);
    };

    /**
     * 触发指定类型的事件
     *
     * 3个重载：
     *
     * - `.fire(type)`
     * - `.fire(args)`
     * - `.fire(type, args)`
     *
     * @param {string | Mixed} type 事件类型
     * @param {Mixed} [args] 事件对象
     * @return {Event} 事件传递过程中的`Event`对象
     */
    EventTarget.prototype.fire = function (type, args) {
        // 只提供一个对象作为参数，则是`.fire(args)`的形式，需要加上type
        if (arguments.length === 1 && typeof type === 'object') {
            args = type;
            type = args.type;
        }

        if (!type) {
            throw new Error('No event type specified');
        }

        if (type === '*') {
            throw new Error('Cannot fire global event');
        }

        var event = args instanceof Event
            ? args
            : new Event(type, args);
        event.target = this;

        // 无论`this.miniEventPool`有没有被初始化，
        // 如果有直接挂在对象上的方法是要触发的
        var inlineHandler = this['on' + type];
        if (typeof inlineHandler === 'function') {
            inlineHandler.call(this, event);
        }

        // 在此处可能没有`miniEventPool`，这是指对象整个就没初始化，
        // 即一个事件也没注册过就`fire`了，这是正常现象
        if (this.miniEventPool && this.miniEventPool.hasOwnProperty(type)) {
            var queue = this.miniEventPool[type];
            queue.execute(event, this);
        }

        // 同时也有可能在上面执行标准事件队列的时候，把这个`EventTarget`给销毁了，
        // 此时`miniEventPool`就没了，这种情况是正常的不能抛异常，要特别处理
        if (this.miniEventPool && this.miniEventPool.hasOwnProperty('*')) {
            var globalQueue = this.miniEventPool['*'];
            globalQueue.execute(event, this);
        }

        return event;
    };

    /**
     * 销毁所有事件
     */
    EventTarget.prototype.destroyEvents = function () {
        if (!this.miniEventPool) {
            return;
        }

        for (var name in this.miniEventPool) {
            if (this.miniEventPool.hasOwnProperty(name)) {
                this.miniEventPool[name].dispose();
            }
        }

        this.miniEventPool = null;
    };

    /**
     * 在无继承关系的情况下，使一个对象拥有事件处理的功能
     *
     * @param {Mixed} target 需要支持事件处理功能的对象
     * @static
     */
    EventTarget.enable = function (target) {
        target.miniEventPool = {};
        lib.extend(target, EventTarget.prototype);
    };

    /*----------------------------------------event.js-------------------------------------------------------*/

    var event = {};
    /**
     * 阻止事件默认行为
     *
     * @param {Event | undefined} event 事件对象
     */
    event.preventDefault = function (event) {
        event = event || window.event;

        if (event.preventDefault) {
            event.preventDefault();
        }
        else {
            event.returnValue = false;
        }
    };

    /**
     * 阻止事件冒泡
     *
     * @param {Event | undefined} event 事件对象
     */
    event.stopPropagation = function (event) {
        event = event || window.event;

        if (event.stopPropagation) {
            event.stopPropagation();
        }
        else {
            event.cancelBubble = true;
        }
    };

    /**
     * 获取鼠标位置
     *
     * @param {Event | undefined} event 事件对象
     * @return {Event} 经过修正的事件对象
     */
    event.getMousePosition = function (event) {
        event = event || window.event;

        if (typeof event.pageX !== 'number') {
            event.pageX =
                event.clientX + lib.page.getScrollLeft() - lib.page.getClientLeft();
        }

        if (typeof event.pageY !== 'number') {
            event.pageY =
                event.clientY + lib.page.getScrollTop() - lib.page.getClientTop();
        }

        return event;
    };

    /**
     * 获取事件目标对象
     *
     * @param {Event | undefined} event 事件对象
     * @return {HTMLElement} 事件目标对象
     */
    event.getTarget = function (event) {
        event = event || window.event;

        return event.target || event.srcElement;
    };

    /**
     * 为DOM元素添加事件
     *
     * 本方法 *不处理* DOM事件的兼容性，包括执行顺序、`Event`对象属性的修正等
     *
     * @param {HTMLElement | string} element DOM元素或其id
     * @param {string} type 事件类型， *不能* 带有`on`前缀
     * @param {Function} listener 事件处理函数
     */
    lib.on = function (element, type, listener) {
        element = lib.g(element);

        if (element.addEventListener) {
            element.addEventListener(type, listener, false);
        }
        else if (element.attachEvent) {
            element.attachEvent('on' + type, listener);
        }
    };

    /**
     * 为DOM元素移除事件
     *
     * 本方法 *不处理* DOM事件的兼容性，包括执行顺序、`Event`对象属性的修正等
     *
     * @param {HTMLElement | string} element DOM元素或其id
     * @param {string} type 事件类型， *不能* 带有`on`前缀
     * @param {Function} listener 事件处理函数
     */
    lib.un = function (element, type, listener) {
        element = lib.g(element);

        if (element.addEventListener) {
            element.removeEventListener(type, listener, false);
        }
        else if (element.attachEvent) {
            element.detachEvent('on' + type, listener);
        }
    }

    lib.event = event;

    /*---------------------------------------------painters.js--------------------------------------------------*/

    /**
     * @class painters
     *
     * 渲染器模块，用于提供生成`painter`方法的工厂方法
     *
     * @singleton
     */
    var painters = {};

    /**
     * 生成一个将属性与控件状态关联的渲染器
     *
     * 当属性变为`true`的时候使用`addState`添加状态，反之使用`removeState`移除状态
     *
     * @param {string} name 指定负责的属性名，同时也是状态名称
     * @return {Object} 一个渲染器配置
     */
    painters.state = function (name) {
        return {
            name: name,
            paint: function (control, value) {
                var method = value ? 'addState' : 'removeState';
                control[method](this.name);
            }
        };
    };

    /**
     * 生成一个将控件属性与控件主元素元素的属性关联的渲染器
     *
     * 当控件属性变化时，将根据参数同步到主元素元素的属性上
     *
     *     @example
     *     // 将target属性与<a>元素关联
     *     var painter = painters.attribute('target');
     *
     *     // 可以选择关联到不同的DOM属性
     *     var painter = painters.attribute('link', 'href');
     *
     *     // 可以指定DOM属性的默认值
     *     var painter = painters.attribute('active', 'title', '');
     *
     *     // 可以指定DOM属性的默认值配置
     *     var painter = painters.attribute('active', 'checked', options)
     *
     * @param {string} name 指定负责的属性名
     * @param {string} [attribute] 对应DOM属性的名称，默认与`name`相同
     * @param {Mixed | Object} [value] 默认的DOM属性值，或者默认值配置
     * @param {Mixed} value.defaultValue 默认值
     * @param {boolean} value.forceRemove 当属性值为false时，是否移除属性
     * @return {Object} 一个渲染器配置
     */
    painters.attribute = function (name, attribute, value) {
        return {
            name: name,
            attribute: attribute || name,
            value: value,
            paint: function (control, value) {
                // 将“默认值”组装为“默认值配置”
                var options = (this.value != null && typeof this.value === 'object')
                    ? this.value
                    : {defaultValue: this.value};
                // 传入的参数为空时，取默认值
                value = value == null ? options.defaultValue : value;
                // 将null和undefined用空字符串替代
                value = value == null ? '' : value;
                // this.value.forceRemove为true，并且value为false时，移除属性
                if (options.forceRemove && value === false) {
                    control.main.removeAttribute(this.attribute);
                }
                else {
                    control.main.setAttribute(this.attribute, value);
                }
            }
        };
    };

    // 这些属性不用加`px`
    var unitProperties = {
        width: true,
        height: true,
        top: true,
        right: true,
        bottom: true,
        left: true,
        fontSize: true,
        padding: true,
        paddingTop: true,
        paddingRight: true,
        paddingBottom: true,
        paddingLeft: true,
        margin: true,
        marginTop: true,
        marginRight: true,
        marginBottom: true,
        marginLeft: true,
        borderWidth: true,
        borderTopWidth: true,
        borderRightWidth: true,
        borderBottomWidth: true,
        borderLeftWidth: true
    };

    /**
     * 生成一个将控件属性与控件主元素元素的样式关联的渲染器
     *
     * 当控件属性变化时，将根据参数同步到主元素元素的样式上
     *
     * @param {string} name 指定负责的属性名
     * @param {string} [property] 对应的样式属性名，默认与`name`相同
     * @return {Object} 一个渲染器配置
     */
    painters.style = function (name, property) {
        return {
            name: name,
            property: property || name,
            paint: function (control, value) {
                if (value == null) {
                    return;
                }
                if (unitProperties.hasOwnProperty(this.property)) {
                    value = value === 0 ? '0' : value + 'px';
                }
                control.main.style[this.property] = value;
            }
        };
    };

    /**
     * 生成一个将控件属性与某个DOM元素的HTML内容关联的渲染器
     *
     * 当控件属性变化时，对应修改DOM元素的`innerHTML`
     *
     * @param {string} name 指定负责的属性名
     * @param {string | Function} [element] 指定DOM元素在当前控件下的部分名，
     * 可以提供函数作为参数，则函数返回需要更新的DOM元素
     * @param {Function} [generate] 指定生成HTML的函数，默认直接使用控件属性的值
     * @return {Object} 一个渲染器配置
     */
    painters.html = function (name, element, generate) {
        return {
            name: name,
            element: element || '',
            generate: generate,
            paint: function (control, value) {
                var element = typeof this.element === 'function'
                    ? this.element(control)
                    : this.element
                    ? control.helper.getPart(this.element)
                    : control.main;
                if (element) {
                    var html = typeof this.generate === 'function'
                        ? this.generate(control, value)
                        : value;
                    element.innerHTML = html || '';
                }
            }
        };
    };

    /**
     * 生成一个将控件属性与某个DOM元素的HTML内容关联的渲染器
     *
     * 当控件属性变化时，对应修改DOM元素的文本内容
     *
     * 本方法与{@link painters#html}相似，区别在于会将内容进行一次HTML转义
     *
     * @param {string} name 指定负责的属性名
     * @param {string | Function} [element] 指定DOM元素在当前控件下的部分名，
     * 可以提供函数作为参数，则函数返回需要更新的DOM元素
     * @param {Function} [generate] 指定生成HTML的函数，默认直接使用控件属性的值，
     * 该函数返回原始的HTML，不需要做额外的转义工作
     * @return {Object} 一个渲染器配置
     */
    painters.text = function (name, element, generate) {
        return {
            name: name,
            element: element || '',
            generate: generate,
            paint: function (control, value) {
                var element = typeof this.element === 'function'
                    ? this.element(control)
                    : this.element
                    ? control.helper.getPart(this.element)
                    : control.main;
                if (element) {
                    var html = typeof this.generate === 'function'
                        ? this.generate(control, value)
                        : value;
                    element.innerHTML = u.escape(html || '');
                }
            }
        };
    };


    /**
     * 生成一个将控件属性的变化代理到指定成员的指定方法上
     *
     * @param {string} name 指定负责的属性名
     * @param {string} member 指定成员名
     * @param {string} method 指定调用的方法名称
     * @return {Object} 一个渲染器配置
     */
    painters.delegate = function (name, member, method) {
        return {
            name: name,
            member: this.member,
            method: this.method,
            paint: function (control, value) {
                control[this.member][this.method](value);
            }
        };
    };

    /**
     * 通过提供一系列`painter`对象创建`repaint`方法
     *
     * 本方法接受以下2类作为“渲染器”：
     *
     * - 直接的函数对象
     * - 一个`painter`对象
     *
     * 当一个直接的函数对象作为“渲染器”时，会将`changes`和`changesIndex`两个参数
     * 传递给该函数，函数具有最大的灵活度来自由操作控件
     *
     * 一个`painter`对象必须包含以下属性：
     *
     * - `{string | string[]} name`：指定这个`painter`对应的属性或属性集合
     * - `{Function} paint`：指定渲染的函数
     *
     * 一个`painter`在执行时，其`paint`函数将接受以下参数：
     *
     * - `{Control} control`：当前的控件实例
     * - `{Mixed} args...`：根据`name`配置指定的属性，依次将属性的最新值作为参数
     *
     * @param {Object... | Function...} args `painter`对象
     * @return {Function} `repaint`方法的实现
     */
    painters.createRepaint = function () {
        var painters = [].concat.apply([], [].slice.call(arguments));

        return function (changes, changesIndex) {
            // 临时索引，不能直接修改`changesIndex`，会导致子类的逻辑错误
            var index = lib.extend({}, changesIndex);
            for (var i = 0; i < painters.length; i++) {
                var painter = painters[i];

                // 如果是一个函数，就认为这个函数处理所有的变化，直接调用一下
                if (typeof painter === 'function') {
                    painter.apply(this, arguments);
                    continue;
                }

                // 其它情况下，走的是`painter`的自动化属性->函数映射机制
                var propertyNames = [].concat(painter.name);

                // 以下2种情况下要调用：
                //
                // - 第一次重会（没有`changes`）
                // - `changesIndex`有任何一个负责的属性的变化
                var shouldPaint = !changes;
                if (!shouldPaint) {
                    for (var j = 0; j < propertyNames.length; j++) {
                        var name = propertyNames[j];
                        if (changesIndex.hasOwnProperty(name)) {
                            shouldPaint = true;
                            break;
                        }
                    }
                }
                if (!shouldPaint) {
                    continue;
                }

                // 收集所有属性的值
                var properties = [this];
                for (var j = 0; j < propertyNames.length; j++) {
                    var name = propertyNames[j];
                    properties.push(this[name]);
                    // 从索引中删除，为了后续构建`unpainted`数组
                    delete index[name];
                }
                // 绘制
                try {
                    painter.paint.apply(painter, properties);
                }
                catch (ex) {
                    var paintingPropertyNames =
                        '"' + propertyNames.join('", "') + '"';
                    var error = new Error(
                        'Failed to paint [' + paintingPropertyNames + '] '
                        + 'for control "' + (this.id || 'anonymous') + '" '
                        + 'of type ' + this.type + ' '
                        + 'because: ' + ex.message
                    );
                    error.actualError = ex;
                    throw error;
                }

            }

            // 构建出未渲染的属性集合
            var unpainted = [];
            for (var key in index) {
                if (index.hasOwnProperty(key)) {
                    unpainted.push(index[key]);
                }
            }

            return unpainted;
        };
    };

    /*---------------------------------------------ControlCollection--------------------------------------------------*/

    /**
     * 控件集合，类似`jQuery`对象，提供便携的方法来访问和修改一个或多个控件
     *
     * `ControlCollection`提供{@link Control}的所有 **公有** 方法，
     * 但 *没有* 任何 **保护或私有** 方法
     *
     * 对于方法，`ControlCollection`采用 **Write all, Read first** 的策略，
     * 需要注意的是，类似{@link Control#setProperties}的方法虽然有返回值，
     * 但被归类于写操作，因此会对所有内部的控件生效，但只返回第一个控件执行的结果
     *
     * `ControlCollection`仅继承{@link Control}的方法，并不包含任何子类独有方法，
     * 因此无法认为集合是一个{@link InputControl}而执行如下代码：
     *
     *     collection.setValue('foo');
     *
     * 此时可以使用通用的{@link Control#set}方法来代替：
     *
     *     collection.set('value', 'foo');
     *
     * 根据{@link Control#set}方法的规则，如果控件存在`setValue`方法，则会进行调用
     *
     * @constructor
     */
    function ControlCollection() {
        /**
         * @property {number} length
         *
         * 当前控件分组中控件的数量
         *
         * @readonly
         */
        this.length = 0;
    }

    // 为了让Firebug认为这是个数组
    ControlCollection.prototype.splice = Array.prototype.splice;

    /**
     * 向集合中添加控件
     *
     * @param {Control} control 添加的控件
     */
    ControlCollection.prototype.add = function (control) {
        var index = u.indexOf(this, control);
        if (index < 0) {
            [].push.call(this, control);
        }
    };

    /**
     * 从集合中移除控件
     *
     * @param {Control} control 需要移除的控件
     */
    ControlCollection.prototype.remove = function (control) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === control) {
                //  ie8 splice下有问题，只会改变length,并设置元素索引，但不会删除元素
                //  var t = {0:'a', 1: 'b', 2:'c', 3:'d', length: 4};
                //  [].splice.call(t, 3, 1);
                //  alert(t.length)
                //  for(var k in t) {
                //     alert(k+ ':' + t[k])
                //  }

                [].splice.call(this, i, 1);
                return;
            }
        }
    };

    /**
     * 对分组内每个控件调用指定函数
     *
     * @param {Function} iterator 每次循环调用的函数，
     * 函数接受 **当前的控件** 、 **索引** 及 **当前控件集合实例** 为参数
     * @param {Mixed} thisObject 执行`iterator`时的`this`对象，
     * 如果不指定此参数，则`iterator`内的`this`对象为控件实例
     */
    ControlCollection.prototype.each = function (iterator, thisObject) {
        u.each(
            this,
            function (control, i) {
                iterator.call(thisObject || control, control, i, this);
            }
        );
    };

    /**
     * 对分组内的每个控件调用给定名称的方法
     *
     * 调用此方法必须保证此集合中的 **所有** 控件均有`methodName`指定的方法，
     * 否则将会出现`TypeError("has no method 'methodName'")`异常
     *
     * @param {string} methodName 需要调用的函数的名称
     * @param {Mixed...} args 调用方法时指定的参数
     * @return {Mixed[]} 返回一个数组，依次包含每个控件调用方法的结果
     */
    ControlCollection.prototype.invoke = function (methodName) {
        var args = [this];
        args.push.apply(args, arguments);
        return u.invoke.apply(u, args);
    };

    // 写方法
    u.each(
        [
            'enable', 'disable', 'setDisabled',
            'show', 'hide', 'toggle',
            'addChild', 'removeChild',
            'set', 'setProperties',
            'addState', 'removeState', 'toggleState',
            'on', 'off', 'fire',
            'dispose', 'destroy',
            'setViewContext',
            'render', 'repaint', 'appendTo', 'insertBefore'
        ],
        function (method) {
            ControlCollection.prototype[method] = function () {
                var args = [method];
                args.push.apply(args, arguments);
                var result = this.invoke.apply(this, args);
                return result && result[0];
            };
        }
    );

    // 读方法
    u.each(
        [
            'isDisabled', 'isHidden', 'hasState',
            'get', 'getCategory', 'getChild', 'getChildSafely'
        ],
        function (method) {
            ControlCollection.prototype[method] = function () {
                var first = this[0];
                return first
                    ? first[method].apply(first, arguments)
                    : undefined;
            };
        }
    );

    /*-------------------------------------------SafeWrapper----------------------------------------------------*/

    /**
     * 控件安全包装，模拟一个无任何功能的控件
     *
     * **由于技术限制，此类不继承{@link Control}，不能用`instanceof`判断类型**
     *
     * 在实际使用中，经常会有这样的代码：
     *
     *     var panel = ui.get('panel');
     *     if (panel) {
         *         panel.set('content', someHTML);
         *     }
     *
     * 为了消除这些分支，可以使用本类。本类提供控件所有的基础方法：
     *
     * - 禁用 / 启用：`enable` | `disable` | `setDisabled` | `isDisabled`
     * - 显示 / 隐藏：`show` | `hide` | `toggle` | `isHidden`
     * - 分类：`getCategory`
     * - 取值：`getValue` | getRawValue | `setValue` | `setRawValue`
     * - 子控件：`getChild` | `getChildSafely` | `addChild` | `removeChild`
     * - 设置值：`set` | `get` | `setProperties`
     * - 状态：`addState` | `removeState` | `toggleState` | `hasState`
     * - 事件：`on` | `off` | `fire`
     * - 销毁：`dispose` | `destroy`
     * - 生命周期：`initOptions` | `createMain` | `initStructure`
     * - 视图管理：`setViewContext`
     * - 渲染：`appendTo` | `insertBefore` | `render` | `repaint`
     * - 内部辅助：`isPropertyChanged`
     * - 已废弃：`initChildren` | `disposeChildren`
     *
     * 所有设置、改变值的方法均为空逻辑。获取值的方法根据分类有如下可能：
     *
     * - 获取字符串的方法，返回空字符串`""`
     * - 获取未知类型的方法，返回`null`
     * - 获取对象的方法，返回空对象`{}`
     * - 获取数组的方法，返回空数组`[]`
     * - 获取`boolean`值的方法，返回`false`
     * - {@link SafeWrapper#getCategory}返回`"control"`
     * - {@link SafeWrapper#getChildSafely}返回一个{@link SafeWrapper}对象
     *
     * 通常不应该直接实例化此类，通过以下方法获取此类的实例：
     *
     * - {@link ViewContext#getSafely}
     * - {@link Control#getChildSafely}
     * - {@link main#wrap}
     *
     * @extends Control
     * @constructor
     */
    function SafeWrapper() {
    }

    // 设置值的方法
    u.each(
        [
            'enable', 'disable', 'setDisabled',
            'show', 'hide', 'toggle',
            'setValue', 'setRawValue',
            'addChild', 'removeChild',
            'set',
            'addState', 'removeState', 'toggleState',
            'on', 'off', 'fire',
            'dispose', 'destroy',
            'initOptions', 'createMain', 'initStructure',
            'setViewContext',
            'render', 'repaint', 'appendTo', 'insertBefore',
            'initChildren', 'disposeChildren'
        ],
        function (method) {
            SafeWrapper.prototype[method] = function () {
            };
        }
    );

    // 获取值方法
    u.each(
        ['isDisabled', 'isHidden', 'hasState', 'isPropertyChanged'],
        function (method) {
            SafeWrapper.prototype[method] = function () {
                return false;
            };
        }
    );

    u.each(
        ['getRawValue', 'getChild', 'get'],
        function (method) {
            SafeWrapper.prototype[method] = function () {
                return null;
            };
        }
    );

    u.each(
        ['getValue'],
        function (method) {
            SafeWrapper.prototype[method] = function () {
                return '';
            };
        }
    );

    u.each(
        ['setProperties'],
        function (method) {
            SafeWrapper.prototype[method] = function () {
                return {};
            };
        }
    );

    // 特殊的几个
    SafeWrapper.prototype.getCategory = function () {
        return 'control';
    };

    SafeWrapper.prototype.getChildSafely = function (childName) {
        var wrapper = new SafeWrapper();

        wrapper.childName = childName;
        wrapper.parent = this;
        if (this.viewContext) {
            wrapper.viewContext = this.viewContext;
        }

        return wrapper;
    };

    /*-------------------------------------------------ViewContext----------------------------------------------*/
    /**
     * 控件分组
     *
     * 控件分组表达一组控件，类似`getElementsByClass(className)`的效果，
     * 分组同时提供一些方法以方便地操作这个集合
     *
     * 控件分组是内部类，仅可以通过{@link ViewContext#getGroup}方法获取
     *
     * 为了保持私有性，`ControlGroup`去除了{@link ControlCollection#add}和
     * {@link ControlCollection#remove}方法，使用者不能修改集合
     *
     * @param {string} name 分组名称
     * @extends ControlCollection
     * @constructor
     * @private
     */
    function ControlGroup(name) {
        ControlCollection.apply(this, arguments);

        /**
         * @property {string} name
         *
         * 当前控件分组的名称
         *
         * @readonly
         */
        this.name = name;
    }

    lib.inherits(ControlGroup, ControlCollection);

    /**
     * @method
     *
     * `ControlGroup`不提供此方法
     */
    ControlGroup.prototype.add = undefined;

    /**
     * @method
     *
     * `ControlGroup`不提供此方法
     */
    ControlGroup.prototype.remove = undefined;

    /**
     * 销毁当前实例
     */
    ControlGroup.prototype.disposeGroup = function () {
        for (var i = 0; i < this.length; i++) {
            delete this[i];
        }
        this.length = 0;
    };

    function addToGroup(control, group) {
        ControlCollection.prototype.add.call(group, control);
    }

    function removeFromGroup(control, group) {
        ControlCollection.prototype.remove.call(group, control);
    }

    function getGroupNames(control) {
        var group = control.get('group');
        return group ? group.split(/[\t\r\n ]/) : [];
    }

    var counter = 0x830903;

    /**
     * 获取唯一id
     *
     * @return {string}
     */
    function getGUID() {
        return 'vt' + counter++;
    }

    /**
     * 视图环境对象池
     *
     * @type {Object}
     * @private
     */
    var pool = {};

    /**
     * 视图环境类
     *
     * 一个视图环境是一组控件的集合，不同视图环境中相同id的控件的DOM id不会重复
     *
     * @constructor
     * @param {string} id 该`ViewContext`的id
     */
    function ViewContext(id) {
        /**
         * 视图环境控件集合
         *
         * @type {Object}
         * @private
         */
        this.controls = {};

        /**
         * 视图环境控件分组集合
         *
         * @type {Object}
         * @private
         */
        this.groups = {};

        id = id || getGUID();
        // 如果已经有同名的，就自增长一下
        if (pool.hasOwnProperty(id)) {
            var i = 1;
            var prefix = id + '-';
            while (pool.hasOwnProperty(prefix + i)) {
                i++;
            }
            id = prefix + i;
        }

        /**
         * 视图环境id
         *
         * @type {string}
         * @readonly
         */
        this.id = id;

        // 入池
        pool[this.id] = this;
    }

    /**
     * 根据id获取视图环境
     *
     * @param {string} id 视图环境id
     * @static
     */
    ViewContext.get = function (id) {
        return pool[id] || null;
    };

    /**
     * 将控件实例添加到视图环境中
     *
     * @param {Control} control 待加控件
     */
    ViewContext.prototype.add = function (control) {
        var exists = this.controls[control.id];

        // id已存在
        if (exists) {
            // 是同一控件，不做处理
            if (exists === control) {
                return;
            }

            // 不是同一控件，先覆盖原关联控件的viewContext
            exists.setViewContext(null);
        }

        this.controls[control.id] = control;

        var groups = getGroupNames(control);
        for (var i = 0; i < groups.length; i++) {
            var groupName = groups[i];

            if (!groupName) {
                continue;
            }

            var group = this.getGroup(groupName);
            addToGroup(control, group);
        }

        control.setViewContext(this);

    };

    /**
     * 将控件实例从视图环境中移除。
     *
     * @param {Control} control 待移除控件
     */
    ViewContext.prototype.remove = function (control) {
        delete this.controls[control.id];

        var groups = getGroupNames(control);
        for (var i = 0; i < groups.length; i++) {
            var groupName = groups[i];

            if (!groupName) {
                continue;
            }

            var group = this.getGroup(groupName);
            removeFromGroup(control, group);
        }

        control.setViewContext(null);

    };

    /**
     * 通过id获取控件实例。
     *
     * @param {string} id 控件id
     * @return {Control} 根据id获取的控件
     */
    ViewContext.prototype.get = function (id) {
        return this.controls[id];
    };

    /**
     * 获取viewContext内所有控件
     *
     * @return {Control[]} viewContext内所有控件
     */
    ViewContext.prototype.getControls = function () {
        return require('./lib').extend({}, this.controls);
    };


    /**
     * 根据id获取控件实例，如无相关实例则返回{@link SafeWrapper}
     *
     * @param {string} id 控件id
     * @return {Control} 根据id获取的控件
     */
    ViewContext.prototype.getSafely = function (id) {
        var control = this.get(id);

        if (!control) {
            control = new SafeWrapper();
            control.id = id;
            control.viewContext = this;
        }

        return control;
    };

    /**
     * 获取一个控件分组
     *
     * @param {string} name 分组名称
     * @return {ControlGroup}
     */
    ViewContext.prototype.getGroup = function (name) {
        if (!name) {
            throw new Error('name is unspecified');
        }

        var group = this.groups[name];
        if (!group) {
            group = this.groups[name] = new ControlGroup(name);
        }
        return group;
    };

    /**
     * 清除视图环境中所有控件
     */
    ViewContext.prototype.clean = function () {
        for (var id in this.controls) {
            if (this.controls.hasOwnProperty(id)) {
                var control = this.controls[id];
                control.dispose();
                // 如果控件销毁后“不幸”`viewContext`还在，就移除掉
                if (control.viewContext && control.viewContext === this) {
                    this.remove(control);
                }
            }
        }

        for (var name in this.groups) {
            if (this.groups.hasOwnProperty(name)) {
                this.groups[name].disposeGroup();
                this.groups[name] = undefined;
            }
        }
    };

    /**
     * 销毁视图环境
     */
    ViewContext.prototype.dispose = function () {
        this.clean();
        delete pool[this.id];
    };

    /*------------------------------------main-----------------------------------------------------------*/

    var main, ui = {};
    main = ui;
    /**
     * 版本号常量
     *
     * @type {string}
     * @readonly
     */
    main.version = '3.1.0';

    var defaultViewContext = new ViewContext('default');

    /**
     * 获取默认的控件视图环境
     *
     * @return {ViewContext}
     */
    main.getViewContext = function () {
        return defaultViewContext;
    };

    /**
     * 控件库配置数据
     *
     * @type {Object}
     * @ignore
     */
    var config = {
        uiPrefix: 'data-ui',
        extensionPrefix: 'data-ui-extension',
        customElementPrefix: 'esui',
        instanceAttr: 'data-ctrl-id',
        viewContextAttr: 'data-ctrl-view-context',
        uiClassPrefix: 'ui',
        skinClassPrefix: 'skin',
        stateClassPrefix: 'state'
    };

    /**
     * 配置控件库
     *
     * 可用的配置有：
     *
     * - `{string} uiPrefix="data-ui"`：HTML中用于表示控件属性的DOM属性前缀
     * - `{string} extensionPrefix="data-ui-extension"`：用于表示扩展属性的前缀
     * - `{string} instanceAttr="data-ctrl-id"`：
     * 标识控件id的DOM属性名，配合`viewContextAttr`可根据DOM元素获取对应的控件
     * - `{string} viewContextAttr="data-ctrl-view-context"`：
     * 标识视图上下文id的DOM属性名，配合`instanceAttr`可根据DOM元素获取对应的控件
     * - `{string} uiClassPrefix="ui"`：控件生成DOM元素的class的前缀
     * - `{string} skinClassPrefix="skin"`：控件生成皮肤相关DOM元素class的前缀
     * - `{string} stateClassPrefix="state"`：控件生成状态相关DOM元素class的前缀
     *
     * @param {Object} info 控件库配置信息对象
     */
    main.config = function (info) {
        lib.extend(config, info);
    };

    /**
     * 获取配置项
     *
     * 具体可用配置参考{@link main#config}方法的说明
     *
     * @param {string} name 配置项名称
     * @return {Mixed} 配置项的值
     */
    main.getConfig = function (name) {
        return config[name];
    };

    /**
     * 将`name:value[;name:value]`的属性值解析成对象
     *
     * @param {string} source 属性值源字符串
     * @param {Function} valueReplacer 替换值的处理函数，每个值都将经过此函数
     * @return {Object}
     */
    main.parseAttribute = function (source, valueReplacer) {
        if (!source) {
            return {};
        }
        // 为了让key和value中有`:`或`;`这类分隔符时能正常工作，不采用正则
        //
        // 分析的原则是：
        //
        // 1. 找到第1个冒号，取前面部分为key
        // 2. 找下个早号前的最后一个分号，取前面部分为value
        // 3. 如果字符串没结束，回到第1步
        var result = {}; // 保存结果
        var lastStop = 0; // 上次找完时停下的位置，分隔字符串用
        var cursor = 0; // 当前检索到的字符
        // 为了保证只用一个`source`串就搞定，下面会涉及到很多的游标，
        // 简单的方法是每次截完一段后把`soruce`截过的部分去掉，
        // 不过这么做会频繁分配字符串对象，所以优化了一下保证`source`不变
        while (cursor < source.length) {
            // 找key，找到第1个冒号
            while (cursor < source.length && source.charAt(cursor) !== ':') {
                cursor++;
            }
            // 如果找到尾也没找到冒号，那就是最后有一段非键值对的字符串，丢掉
            if (cursor >= source.length) {
                break;
            }
            // 把key截出来
            var key = lib.trim(source.slice(lastStop, cursor));
            // 移到冒号后面一个字符
            cursor++;
            // 下次切分就从这个字符开始了
            lastStop = cursor;
            // 找value，要找最后一个分号，这里就需要前溯了，先找到第1个分号
            while (cursor < source.length
            && source.charAt(cursor) !== ';'
                ) {
                cursor++;
            }
            // 然后做前溯一直到下一个冒号
            var lookAheadIndex = cursor + 1;
            while (lookAheadIndex < source.length) {
                var ch = source.charAt(lookAheadIndex);
                // 如果在中途还发现有分号，把游标移过来
                if (ch === ';') {
                    cursor = lookAheadIndex;
                }
                // 如果发现了冒号，则上次的游标就是最后一个分号了
                if (ch === ':') {
                    break;
                }
                lookAheadIndex++;
            }
            // 把value截出来，这里没有和key一样判断是否已经跑到尾，
            // 是因为我们允许最后一个键值对没有分号结束，
            // 但是会遇上`key:`这样的串，即只有键没有值，
            // 这时我们就认为值是个空字符串了
            var value = lib.trim(source.slice(lastStop, cursor));
            // 加入到结果中
            result[key] = valueReplacer ? valueReplacer(value) : value;
            // 再往前进一格，开始下一次查找
            cursor++;
            lastStop = cursor;
        }

        return result;
    };

    /**
     * 寻找DOM元素所对应的控件
     *
     * @param {HTMLElement} dom DOM元素
     * @return {Control | null} `dom`对应的控件实例，
     * 如果`dom`不存在或不对应任何控件则返回`null`
     */
    main.getControlByDOM = function (dom) {
        if (!dom) {
            return null;
        }

        var getConf = main.getConfig;

        var controlId = dom.getAttribute(getConf('instanceAttr'));
        var viewContextId = dom.getAttribute(getConf('viewContextAttr'));
        var viewContext;

        if (controlId
            && viewContextId
            && (viewContext = ViewContext.get(viewContextId))
        ) {
            return viewContext.get(controlId);
        }
        return null;
    };

    /**
     * 注册类。用于控件类、规则类或扩展类注册
     *
     * @param {Function} classFunc 类Function
     * @param {Object} container 类容器
     * @ignore
     */
    function registerClass(classFunc, container) {
        if (typeof classFunc === 'function') {
            var type = classFunc.prototype.type;
            if (type in container) {
                throw new Error(type + ' is exists!');
            }

            container[type] = classFunc;
        }
    }

    /**
     * 创建类实例。用于控件类、规则类或扩展类的实例创建
     *
     * @param {string} type 类型
     * @param {Object} options 初始化参数
     * @param {Object} container 类容器
     * @ignore
     */
    function createInstance(type, options, container) {
        var Constructor = container[type];
        if (Constructor) {
            delete options.type;
            return new Constructor(options);
        }

        return null;
    }

    /**
     * 控件类容器
     *
     * @type {Object}
     * @ignore
     */
    var controlClasses = {};

    /**
     * 注册控件类
     *
     * 该方法通过类的`prototype.type`识别控件类型信息。
     *
     * @param {Function} controlClass 控件类
     * @throws
     * 已经有相同`prototype.type`的控件类存在，不能重复注册同类型控件
     */
    main.register = function (controlClass) {
        registerClass(controlClass, controlClasses);
    };

    /**
     * 创建控件
     *
     * @param {string} type 控件类型
     * @param {Object} options 初始化参数
     * @return {Control}
     */
    main.create = function (type, options) {
        return createInstance(type, options, controlClasses);
    };

    /**
     * 获取控件
     *
     * @param {string} id 控件的id
     * @return {Control | null}
     */
    main.get = function (id) {
        return defaultViewContext.get(id);
    };

    /**
     * 根据id获取控件实例，如无相关实例则返回{@link SafeWrapper}
     *
     * @param {string} id 控件id
     * @return {Control} 根据id获取的控件
     */
    main.getSafely = function (id) {
        return defaultViewContext.getSafely(id);
    };

    /**
     * 创建控件包裹，返回一个{@link ControlCollection}对象
     *
     * @param {Control...} controls 需要包裹的控件
     * @return {ControlCollection}
     */
    main.wrap = function () {
        var collection = new ControlCollection();

        for (var i = 0; i < arguments.length; i++) {
            collection.add(arguments[i]);
        }

        return collection;
    };

    /**
     * 从容器DOM元素批量初始化内部的控件渲染
     *
     * @param {HTMLElement} [wrap=document.body] 容器DOM元素，默认
     * @param {Object} [options] init参数
     * @param {Object} [options.viewContext] 视图环境
     * @param {Object} [options.properties] 属性集合，通过id映射
     * @param {Object} [options.valueReplacer] 属性值替换函数
     * @return {Control[]} 初始化的控件对象集合
     */
    main.init = function (wrap, options) {
        wrap = wrap || document.body;
        options = options || {};

        var valueReplacer = options.valueReplacer || function (value) {
                return value;
            };

        /**
         * 将字符串数组join成驼峰形式
         *
         * @param {string[]} source 源字符串数组
         * @return {string}
         * @ignore
         */
        function joinCamelCase(source) {
            function replacer(c) {
                return c.toUpperCase();
            }

            for (var i = 1, len = source.length; i < len; i++) {
                source[i] = source[i].replace(/^[a-z]/, replacer);
            }

            return source.join('');
        }

        /**
         * 不覆盖目标对象成员的extend
         *
         * @param {Object} target 目标对象
         * @param {Object} source 源对象
         * @ignore
         */
        function noOverrideExtend(target, source) {
            for (var key in source) {
                if (!(key in target)) {
                    target[key] = source[key];
                }
            }
        }

        /**
         * 将标签解析的值附加到option对象上
         *
         * @param {Object} optionObject option对象
         * @param {string[]} terms 经过切分的标签名解析结果
         * @param {string} value 属性值
         * @ignore
         */
        function extendToOption(optionObject, terms, value) {
            if (terms.length === 0) {
                noOverrideExtend(
                    optionObject,
                    main.parseAttribute(value, valueReplacer)
                );
            }
            else {
                optionObject[joinCamelCase(terms)] = valueReplacer(value);
            }
        }

        // 把dom元素存储到临时数组中
        // 控件渲染的过程会导致Collection的改变
        var rawElements = wrap.getElementsByTagName('*');
        var elements = [];
        for (var i = 0, len = rawElements.length; i < len; i++) {
            if (rawElements[i].nodeType === 1) {
                elements.push(rawElements[i]);
            }
        }

        var uiPrefix = main.getConfig('uiPrefix');
        var extPrefix = main.getConfig('extensionPrefix');
        var customElementPrefix = main.getConfig('customElementPrefix');
        var uiPrefixLen = uiPrefix.length;
        var extPrefixLen = extPrefix.length;
        var properties = options.properties || {};
        var controls = [];
        for (var i = 0, len = elements.length; i < len; i++) {
            var element = elements[i];

            // 有时候，一个控件会自己把`main.innerHTML`生成子控件，比如`Panel`，
            // 但这边有缓存这些子元素，可能又会再生成一次，所以要去掉
            if (element.getAttribute(config.instanceAttr)) {
                continue;
            }

            var attributes = element.attributes;
            var controlOptions = {};
            var extensionOptions = {};

            // 解析attribute中的参数
            for (var j = 0, attrLen = attributes.length; j < attrLen; j++) {
                var attribute = attributes[j];
                var name = attribute.name;
                var value = attribute.value;

                if (name.indexOf(extPrefix) === 0) {
                    // 解析extension的key
                    var terms = name.slice(extPrefixLen + 1).split('-');
                    var extKey = terms[0];
                    terms.shift();

                    // 初始化该key的option对象
                    var extOption = extensionOptions[extKey];
                    if (!extOption) {
                        extOption = extensionOptions[extKey] = {};
                    }

                    extendToOption(extOption, terms, value);
                }
                else if (name.indexOf(uiPrefix) === 0) {
                    var terms = name.length === uiPrefixLen
                        ? []
                        : name.slice(uiPrefixLen + 1).split('-');
                    extendToOption(controlOptions, terms, value);
                }
            }

            // 根据选项创建控件
            var type = controlOptions.type;
            if (!type) {
                var nodeName = element.nodeName.toLowerCase();
                var esuiPrefixIndex = nodeName.indexOf(customElementPrefix);
                if (esuiPrefixIndex === 0) {
                    var typeFromCustomElement;
                    /* jshint ignore:start */
                    typeFromCustomElement = nodeName.replace(
                        /-(\S)/g,
                        function (match, ch) {
                            return ch.toUpperCase();
                        }
                    );
                    /* jshint ignore:end */
                    typeFromCustomElement = typeFromCustomElement.slice(customElementPrefix.length);
                    controlOptions.type = typeFromCustomElement;
                    type = typeFromCustomElement;
                }
            }
            if (type) {
                // 从用户传入的properties中merge控件初始化属性选项
                var controlId = controlOptions.id;
                var customOptions = controlId
                    ? properties[controlId]
                    : {};
                for (var key in customOptions) {
                    controlOptions[key] = valueReplacer(customOptions[key]);
                }

                // 创建控件的插件
                var extensions = controlOptions.extensions || [];
                controlOptions.extensions = extensions;
                for (var key in extensionOptions) {
                    var extOption = extensionOptions[key];
                    var extension = main.createExtension(
                        extOption.type,
                        extOption
                    );
                    extension && extensions.push(extension);
                }

                // 绑定视图环境和控件主元素
                controlOptions.viewContext = options.viewContext;
                // 容器类控件会需要渲染自己的`innerHTML`，
                // 这种渲染使用`initChildren`，再调用`main.init`，
                // 因此需要把此处`main.init`的参数交给控件，方便再带回来，
                // 以便`properties`、`valueReplacer`之类的能保留
                controlOptions.renderOptions = options;
                controlOptions.main = element;

                // 创建控件
                var control = main.create(type, controlOptions);
                if (control) {
                    controls.push(control);
                    if (options.parent) {
                        options.parent.addChild(control);
                    }
                    try {
                        control.render();
                    }
                    catch (ex) {
                        var error = new Error(
                            'Render control '
                            + '"' + (control.id || 'anonymous') + '" '
                            + 'of type ' + control.type + ' '
                            + 'failed because: '
                            + ex.message
                        );
                        error.actualError = ex;
                        throw error;
                    }
                }
            }
        }

        return controls;
    };

    /**
     * 扩展类容器
     *
     * @type {Object}
     * @ignore
     */
    var extensionClasses = {};

    /**
     * 注册扩展类。
     *
     * 该方法通过类的`prototype.type`识别扩展类型信息
     *
     * @param {Function} extensionClass 扩展类
     * @throws
     * 已经有相同`prototype.type`的扩展类存在，不能重复注册同类型扩展
     */
    main.registerExtension = function (extensionClass) {
        registerClass(extensionClass, extensionClasses);
    };

    /**
     * 创建扩展
     *
     * @param {string} type 扩展类型
     * @param {Object} options 初始化参数
     * @return {Extension}
     */
    main.createExtension = function (type, options) {
        return createInstance(type, options, extensionClasses);
    };

    /**
     * 全局扩展选项容器
     *
     * @type {Object}
     * @ignore
     */
    var globalExtensionOptions = {};

    /**
     * 绑定全局扩展
     *
     * 通过此方法绑定的扩展，会对所有的控件实例生效
     *
     * 每一次全局扩展生成实例时，均会复制`options`对象，而不会直接使用引用
     *
     * @param {string} type 扩展类型
     * @param {Object} options 扩展初始化参数
     */
    main.attachExtension = function (type, options) {
        globalExtensionOptions[type] = options;
    };

    /**
     * 创建全局扩展对象
     *
     * @return {Extension[]}
     */
    main.createGlobalExtensions = function () {
        var options = globalExtensionOptions;
        var extensions = [];
        for (var type in globalExtensionOptions) {
            if (globalExtensionOptions.hasOwnProperty(type)) {
                var extension = main.createExtension(type, globalExtensionOptions[type]);
                extension && extensions.push(extension);
            }
        }

        return extensions;
    };

    /**
     * 验证规则类容器
     *
     * @type {Object}
     * @ignore
     */
    var ruleClasses = [];

    /**
     * 注册控件验证规则类
     *
     * 该方法通过类的`prototype.type`识别验证规则类型信息
     *
     * @param {Function} ruleClass 验证规则类
     * @param {number} priority 优先级，越小的优先级越高
     * @throws
     * 已经有相同`prototype.type`的验证规则类存在，不能重复注册同类型验证规则
     */
    main.registerRule = function (ruleClass, priority) {
        // 多个Rule共享一个属性似乎也没问题
        ruleClasses.push({type: ruleClass, priority: priority});
        // 能有几个规则，这里就不优化为插入排序了
        ruleClasses.sort(
            function (x, y) {
                return x.priority - y.priority;
            });
    };

    /**
     * 创建控件实例需要的验证规则
     *
     * @param {Control} control 控件实例
     * @return {validator.Rule[]} 验证规则数组
     */
    main.createRulesByControl = function (control) {
        var rules = [];
        for (var i = 0; i < ruleClasses.length; i++) {
            var RuleClass = ruleClasses[i].type;
            if (control.get(RuleClass.prototype.type) != null) {
                rules.push(new RuleClass());
            }
        }

        return rules;
    };

    /*---------------------------------------------validator--------------------------------------------------*/

    /**
     * 验证规则基类
     *
     * 验证规则是对{@link InputControl}的值的验证逻辑的抽象
     *
     * 每一个验证规则都包含一个`check(value, control)`方法，
     * 该方法返回一个{@link validator.ValidityState}以表示验证结果
     *
     * 验证规则必须通过{@link main#registerRule}进行注册后才可生效，
     * 每一个验证规则包含`prototype.type`属性来确定规则的类型
     *
     * 验证规则并不会显式地附加到控件上，而是通过控件自身的属性决定哪些规则生效，
     * 当控件本身具有与规则的`type`属性相同的属性时，此规则即会生效，例如：
     *
     *     var textbox = main.create('TextBox', { maxLength: 30 });
     *     textbox.validate();
     *
     * 由于`textbox`上存在`maxLength`属性，因此`MaxLengthRule`会对其进行验证
     *
     * @class validator.Rule
     * @constructor
     */
    function Rule() {
    }

    /**
     * 规则类型
     *
     * @type {string}
     */
    Rule.prototype.type = null;


    /**
     * 错误提示信息，可以使用`${xxx}`作为占位符输出控件的属性值
     *
     * @type {string}
     */
    Rule.prototype.errorMessage = '${title}验证失败';

    /**
     * 验证控件的验证状态
     *
     * @param {string} value 校验值
     * @param {Control} control 待校验控件
     * @return {validator.ValidityState}
     * @abstract
     */
    Rule.prototype.check = function (value, control) {
        var ValidityState = require('./ValidityState');
        return new ValidityState(true, '');

    };

    /**
     * 获取验证对应的错误提示信息。
     *
     * @param {Control} control 待校验控件
     * @return {string}
     */
    Rule.prototype.getErrorMessage = function (control) {
        var lib = require('../lib');
        var errorMessage =
            control.get(this.type + 'ErrorMessage') || this.errorMessage;
        return lib.format(errorMessage, control);
    };

    /**
     * 获取验证限制条件的值
     *
     * @param {Control} control 待校验控件
     * @return {Mixed}
     */
    Rule.prototype.getLimitCondition = function (control) {
        return control.get(this.type);
    };

    /**
     * 获取规则类型
     *
     * @return {string}
     */
    Rule.prototype.getName = function () {
        return this.type;
    };

    /**
     * 验证结果类
     *
     * 一个`Validity`是对一个控件的验证结果的表达，
     * 是一系列{@link validator.ValidityState}的组合
     *
     * 当有至少一个{@link validator.ValidityState}处于错误状态时，
     * 该`Validity`对象将处于错误状态
     *
     * @class validator.Validity
     * @constructor
     */
    function Validity() {
        this.states = [];
        this.stateIndex = {};
        this.customMessage = '';
        this.customValidState = null;
    }

    /**
     * 添加验证状态
     *
     * @param {string} name 状态名
     * @param {validator.ValidityState} state 规则验证状态对象
     */
    Validity.prototype.addState = function (name, state) {
        //如果状态名已存在
        if (this.stateIndex[name]) {
            // 同样的状态对象，不处理
            if (this.stateIndex[name] === state) {
                return;
            }

            // 不一样，删除原list中元素
            for (var i = 0; i < this.states.length; i++) {
                if (this.states[i] === this.stateIndex[name]) {
                    this.states.splice(i, 1);
                    break;
                }
            }
        }

        // 更新数据
        this.states.push(state);
        this.stateIndex[name] = state;
    };

    /**
     * 获取验证状态
     *
     * @param {string} name 状态名
     * @return {validator.ValidityState} 规则验证状态对象
     */
    Validity.prototype.getState = function (name) {
        return this.stateIndex[name] || null;
    };

    /**
     * 获取验证状态集合
     *
     * @return {validator.ValidityState[]}
     */
    Validity.prototype.getStates = function () {
        return this.states.slice();
    };

    /**
     * 获取自定义验证信息
     *
     * @return {string}
     */
    Validity.prototype.getCustomMessage = function () {
        return this.customMessage;
    };


    /**
     * 设置自定义验证信息
     *
     * @param {string} message 自定义验证信息
     */
    Validity.prototype.setCustomMessage = function (message) {
        this.customMessage = message;
    };

    /**
     * 设置自定义验证结果
     *
     * @param {string} validState 验证结果字符串
     */
    Validity.prototype.setCustomValidState = function (validState) {
        this.customValidState = validState;
    };


    /**
     * 获取整体是否验证通过
     *
     * @return {boolean}
     */
    Validity.prototype.isValid = function () {
        return u.every(
            this.getStates(),
            function (state) {
                return state.getState();
            }
        );
    };

    /**
     * 获取验证状态的字符串
     *
     * @return {string}
     */
    Validity.prototype.getValidState = function () {
        return this.customValidState
            || (this.isValid() ? 'valid' : 'invalid');
    };

    /**
     * 验证状态类
     *
     * 一个`ValidityState`表示一条规则的验证结果，其包含`state`和`message`两个属性
     *
     * @class validator.ValidityState
     * @constructor
     * @param {boolean} state 验证状态
     * @param {string} [message=""] 验证信息
     */
    function ValidityState(state, message) {
        this.state = state;
        this.message = message || '';
    }

    /**
     * 获取验证信息
     *
     * @return {string}
     */
    ValidityState.prototype.getMessage = function () {
        return this.message;
    };


    /**
     * 获取验证状态
     *
     * @return {boolean} `true`为值合法，`false`为值非法
     */
    ValidityState.prototype.getState = function () {
        return this.state;
    };


    /**
     * 设置验证信息
     *
     * @param {string} message 验证信息字符串
     */
    ValidityState.prototype.setMessage = function (message) {
        this.message = message;
    };


    /**
     * 设置验证状态
     *
     * @param {boolean} state `true`为值合法，`false`为值非法
     */
    ValidityState.prototype.setState = function (state) {
        this.state = state;
    };

    /**
     * 非空验证规则
     *
     * @extends validator.Rule
     * @class validator.RequiredRule
     * @constructor
     */
    function RequiredRule() {
        Rule.apply(this, arguments);
    }

    /**
     * 规则类型，始终为`"require"`
     *
     * @type {string}
     * @override
     */
    RequiredRule.prototype.type = 'required';


    /**
     * 错误提示信息
     *
     * @type {string}
     */
    RequiredRule.prototype.errorMessage = '${title}不能为空';

    /**
     * 验证控件的验证状态
     *
     * @param {string} value 校验值
     * @param {Control} control 待校验控件
     * @return {validator.ValidityState}
     * @override
     */
    RequiredRule.prototype.check = function (value, control) {
        return new ValidityState(!!value, this.getErrorMessage(control));
    };

    lib.inherits(RequiredRule, Rule);
    main.registerRule(RequiredRule, 0);

    /**
     * 正则检验规则
     *
     * 需要注意的是，当值为空时，此规则默认为通过。
     * 对于非空检验请使用{@link validator.RequiredRule}
     *
     * @extends validator.Rule
     * @class validator.PatternRule
     * @constructor
     */
    function PatternRule() {
        Rule.apply(this, arguments);
    }

    /**
     * 规则类型，始终为`"pattern"`
     *
     * @type {string}
     * @override
     */
    PatternRule.prototype.type = 'pattern';


    /**
     * 错误提示信息
     *
     * @type {string}
     * @override
     */
    PatternRule.prototype.errorMessage =
        '${title}格式不符合要求';

    /**
     * 验证控件的验证状态
     *
     * @param {string} value 校验值
     * @param {Control} control 待校验控件
     * @return {validator.ValidityState}
     * @override
     */
    PatternRule.prototype.check = function (value, control) {
        var regex = new RegExp(this.getLimitCondition(control));
        return new ValidityState(
            !value || regex.test(value),
            this.getErrorMessage(control)
        );
    };

    lib.inherits(PatternRule, Rule);
    main.registerRule(PatternRule, 200);

    /**
     * 最小值验证规则
     *
     * @extends validator.Rule
     * @class validator.MinRule
     * @constructor
     */
    function MinRule() {
        Rule.apply(this, arguments);
    }

    /**
     * 规则类型，始终为`"min"`
     *
     * @type {string}
     * @override
     */
    MinRule.prototype.type = 'min';


    /**
     * 错误提示信息
     *
     * @type {string}
     * @override
     */
    MinRule.prototype.errorMessage =
        '${title}不能小于${min}';

    /**
     * 验证控件的验证状态
     *
     * @param {string} value 校验值
     * @param {Control} control 待校验控件
     * @return {validator.ValidityState}
     * @override
     */
    MinRule.prototype.check = function (value, control) {
        var valueOfNumber = +value;
        var isValidNumber = !isNaN(valueOfNumber)
            && valueOfNumber >= this.getLimitCondition(control);
        return new ValidityState(
            !value || isValidNumber,
            this.getErrorMessage(control)
        );
    };

    lib.inherits(MinRule, Rule);
    main.registerRule(MinRule, 300);

    /**
     * 最小字符长度的验证规则
     *
     * @extends validator.Rule
     * @class validator.MinLengthRule
     * @constructor
     */
    function MinLengthRule() {
        Rule.apply(this, arguments);
    }

    /**
     * 规则类型，始终为`"minLength"`
     *
     * @type {string}
     * @override
     */
    MinLengthRule.prototype.type = 'minLength';


    /**
     * 错误提示信息
     *
     * @type {string}
     * @override
     */
    MinLengthRule.prototype.errorMessage =
        '${title}不能小于${minLength}个字符';

    /**
     * 验证控件的验证状态
     *
     * @param {string} value 校验值
     * @param {Control} control 待校验控件
     * @return {validator.ValidityState}
     * @override
     */
    MinLengthRule.prototype.check = function (value, control) {
        return new ValidityState(
            value.length >= this.getLimitCondition(control),
            this.getErrorMessage(control)
        );
    };

    lib.inherits(MinLengthRule, Rule);
    main.registerRule(MinLengthRule, 100);

    /**
     * 验证最小字节长度的规则
     *
     * 该规则将除标准ASCII码外的其它字符视为2个字节
     *
     * @extends validator.Rule
     * @class validator.MinByteLengthRule
     * @constructor
     */
    function MinByteLengthRule() {
        Rule.apply(this, arguments);
    }

    /**
     * 规则类型，始终为`"minByteLength"`
     *
     * @type {string}
     * @override
     */
    MinByteLengthRule.prototype.type = 'minByteLength';


    /**
     * 错误提示信息
     *
     * @type {string}
     * @override
     */
    MinByteLengthRule.prototype.errorMessage =
        '${title}不能小于${minByteLength}个字符';

    /**
     * 验证控件的验证状态
     *
     * @param {string} value 校验值
     * @param {Control} control 待校验控件
     * @return {validator.ValidityState}
     * @override
     */
    MinByteLengthRule.prototype.check = function (value, control) {
        var byteLength = value.replace(/[^\x00-\xff]/g, 'xx').length;
        return new ValidityState(
            byteLength >= this.getLimitCondition(control),
            this.getErrorMessage(control)
        );
    };

    lib.inherits(MinByteLengthRule, Rule);
    main.registerRule(MinByteLengthRule, 100);

    /**
     * 最大值验证规则
     *
     * @extends validator.Rule
     * @class validator.MaxRule
     * @constructor
     */
    function MaxRule() {
        Rule.apply(this, arguments);
    }

    /**
     * 规则类型，始终为`"max"`
     *
     * @type {string}
     * @override
     */
    MaxRule.prototype.type = 'max';


    /**
     * 错误提示信息
     *
     * @type {string}
     * @override
     */
    MaxRule.prototype.errorMessage =
        '${title}不能大于${max}';

    /**
     * 验证控件的验证状态
     *
     * @param {string} value 校验值
     * @param {Control} control 待校验控件
     * @return {validator.ValidityState}
     * @override
     */
    MaxRule.prototype.check = function (value, control) {
        var valueOfNumber = +value;
        var isValidNumber = !isNaN(valueOfNumber)
            && valueOfNumber <= this.getLimitCondition(control);
        return new ValidityState(
            !value || isValidNumber,
            this.getErrorMessage(control)
        );
    };

    lib.inherits(MaxRule, Rule);
    main.registerRule(MaxRule, 301);

    /**
     * 最大字符长度的验证规则
     *
     * @extends validator.Rule
     * @class validator.MaxLengthRule
     * @constructor
     */
    function MaxLengthRule() {
        Rule.apply(this, arguments);
    }

    /**
     * 规则类型，始终为`"maxLength"`
     *
     * @type {string}
     * @override
     */
    MaxLengthRule.prototype.type = 'maxLength';


    /**
     * 错误提示信息
     *
     * @type {string}
     * @override
     */
    MaxLengthRule.prototype.errorMessage =
        '${title}不能超过${maxLength}个字符';

    /**
     * 验证控件的验证状态
     *
     * @param {string} value 校验值
     * @param {Control} control 待校验控件
     * @return {validator.ValidityState}
     * @override
     */
    MaxLengthRule.prototype.check = function (value, control) {
        return new ValidityState(
            value.length <= this.getLimitCondition(control),
            this.getErrorMessage(control)
        );
    };

    /**
     * 获取错误信息
     *
     * @param {Control} control 待验证的控件
     * @return {string}
     * @override
     */
    MaxLengthRule.prototype.getErrorMessage = function (control) {
        var lib = require('../lib');
        var errorMessage =
            control.get(this.type + 'ErrorMessage') || this.errorMessage;
        var maxLength = this.getLimitCondition(control);
        var data = {
            title: control.get('title'),
            maxLength: maxLength,
            length: maxLength
        };
        return lib.format(errorMessage, data);
    };

    /**
     * 获取验证条件
     *
     * @param {Control} control 待验证的控件
     * @return {Mixed}
     * @override
     */
    MaxLengthRule.prototype.getLimitCondition = function (control) {
        return control.get('length') || control.get('maxLength');
    };

    lib.inherits(MaxLengthRule, Rule);
    main.registerRule(MaxLengthRule, 100);

    /**
     * 验证最大字节长度的规则
     *
     * 该规则将除标准ASCII码外的其它字符视为2个字节
     *
     * @extends validator.Rule
     * @class validator.MaxByteLengthRule
     * @constructor
     */
    function MaxByteLengthRule() {
        Rule.apply(this, arguments);
    }

    /**
     * 规则类型，强制为`"maxByteLength"`
     *
     * @type {string}
     * @override
     */
    MaxByteLengthRule.prototype.type = 'maxByteLength';


    /**
     * 错误提示信息
     *
     * @type {string}
     * @override
     */
    MaxByteLengthRule.prototype.errorMessage =
        '${title}不能超过${maxByteLength}个字符';

    /**
     * 验证控件的验证状态
     *
     * @param {string} value 校验值
     * @param {Control} control 待校验控件
     * @return {validator.ValidityState}
     * @override
     */
    MaxByteLengthRule.prototype.check = function (value, control) {
        var byteLength = value.replace(/[^\x00-\xff]/g, 'xx').length;
        return new ValidityState(
            byteLength <= this.getLimitCondition(control),
            this.getErrorMessage(control)
        );
    };

    lib.inherits(MaxByteLengthRule, Rule);
    main.registerRule(MaxByteLengthRule, 100);

    /*--------------------------------------------helper---------------------------------------------------*/

    /**
     * 获取控件用于生成css class的类型
     *
     * @param {Control} control 控件实例
     * @return {string}
     * @ignore
     */
    function getControlClassType(control) {
        var type = control.styleType || control.type;
        return type.toLowerCase();
    }

    /**
     * 将参数用`-`连接成字符串
     *
     * @param {string...} args 需要连接的串
     * @return {string}
     * @ignore
     */
    function joinByStrike() {
        return [].slice.call(arguments, 0).join('-');
    }

    /**
     * @override Helper
     */
    var helper = {};

    /**
     * 获取控件部件相关的class数组
     *
     * 如果不传递`part`参数，则生成如下：
     *
     * - `ui-ctrl`
     * - `ui-{styleType}`
     * - `skin-{skin}`
     * - `skin-{skin}-{styleType}`
     *
     * 如果有`part`参数，则生成如下：
     *
     * - `ui-{styleType}-{part}`
     * - `skin-{skin}-{styleType}-{part}`
     *
     * @param {string} [part] 部件名称
     * @return {string[]}
     */
    helper.getPartClasses = function (part) {
        if (part
            && this.partClassCache
            && this.partClassCache.hasOwnProperty(part)
        ) {
            // 得复制一份，不然外面拿到后往里`push`些东西就麻烦了
            return this.partClassCache[part].slice();
        }

        var type = getControlClassType(this.control);
        var skin = this.control.skin;
        var prefix = ui.getConfig('uiClassPrefix');
        var skinPrefix = ui.getConfig('skinClassPrefix');
        var classes = [];

        if (part) {
            classes.push(joinByStrike(prefix, type, part));
            if (skin) {
                classes.push(joinByStrike(skinPrefix, skin, type, part));
            }

            // 缓存起来
            if (!this.partClassCache) {
                this.partClassCache = {};
                // 还是得复制一份，不然这个返回回去就可能被修改了
                this.partClassCache[part] = classes.slice();
            }
        }
        else {
            classes.push(joinByStrike(prefix, 'ctrl'));
            classes.push(joinByStrike(prefix, type));
            if (skin) {
                classes.push(
                    joinByStrike(skinPrefix, skin),
                    joinByStrike(skinPrefix, skin, type)
                );
            }
        }

        return classes;
    };

    /**
     * 获取控件部件相关的class字符串，具体可参考{@link Helper#getPartClasses}方法
     *
     * @param {string} [part] 部件名称
     * @return {string}
     */
    helper.getPartClassName = function (part) {
        return this.getPartClasses(part).join(' ');
    };

    /**
     * 获取控件部件相关的主class字符串
     *
     * 如果不传递`part`参数，则生成如下：
     *
     * - `ui-{styleType}`
     *
     * 如果有`part`参数，则生成如下：
     *
     * - `ui-{styleType}-{part}`
     *
     * @param {string} [part] 部件名称
     * @return {string}
     */
    helper.getPrimaryClassName = function (part) {
        var type = getControlClassType(this.control);

        if (part) {
            return joinByStrike(ui.getConfig('uiClassPrefix'), type, part);
        }
        else {
            return joinByStrike(ui.getConfig('uiClassPrefix'), type);
        }
    };

    /**
     * 添加控件部件相关的class，具体可参考{@link Helper#getPartClasses}方法
     *
     * @param {string} [part] 部件名称
     * @param {HTMLElement | string} [element] 部件元素或部件名称，默认为主元素
     */
    helper.addPartClasses = function (part, element) {
        if (typeof element === 'string') {
            element = this.getPart(element);
        }

        element = element || this.control.main;
        if (element) {
            lib.addClasses(
                element,
                this.getPartClasses(part)
            );
        }
    };

    /**
     * 移除控件部件相关的class，具体可参考{@link Helper#getPartClasses}方法
     *
     * @param {string} [part] 部件名称
     * @param {HTMLElement | string} [element] 部件元素或部件名称，默认为主元素
     */
    helper.removePartClasses = function (part, element) {
        if (typeof element === 'string') {
            element = this.getPart(element);
        }

        element = element || this.control.main;
        if (element) {
            lib.removeClasses(
                element,
                this.getPartClasses(part)
            );
        }
    };

    /**
     * 获取控件状态相关的class数组
     *
     * 生成如下：
     *
     * - `ui-{styleType}-{state}`
     * - `state-{state}`
     * - `skin-{skin}-{state}`
     * - `skin-{skin}-{styleType}-{state}`
     *
     * @param {string} state 状态名称
     * @return {string[]}
     */
    helper.getStateClasses = function (state) {
        if (this.stateClassCache
            && this.stateClassCache.hasOwnProperty(state)
        ) {
            // 得复制一份，不然外面拿到后往里`push`些东西就麻烦了
            return this.stateClassCache[state].slice();
        }

        var type = getControlClassType(this.control);
        var getConf = ui.getConfig;
        var classes = [
            joinByStrike(getConf('uiClassPrefix'), type, state),
            joinByStrike(getConf('stateClassPrefix'), state)
        ];

        var skin = this.control.skin;
        if (skin) {
            var skinPrefix = getConf('skinClassPrefix');
            classes.push(
                joinByStrike(skinPrefix, skin, state),
                joinByStrike(skinPrefix, skin, type, state)
            );
        }

        // 缓存起来
        if (!this.stateClassCache) {
            this.stateClassCache = {};
            // 还是得复制一份，不然这个返回回去就可能被修改了
            this.stateClassCache[state] = classes.slice();
        }

        return classes;
    };

    /**
     * 添加控件状态相关的class，具体可参考{@link Helper#getStateClasses}方法
     *
     * @param {string} state 状态名称
     */
    helper.addStateClasses = function (state) {
        var element = this.control.main;
        if (element) {
            lib.addClasses(
                element,
                this.getStateClasses(state)
            );
        }
    };

    /**
     * 移除控件状态相关的class，具体可参考{@link Helper#getStateClasses}方法
     *
     * @param {string} state 状态名称
     */
    helper.removeStateClasses = function (state) {
        var element = this.control.main;
        if (element) {
            lib.removeClasses(
                element,
                this.getStateClasses(state)
            );
        }
    };

    /**
     * 获取用于控件DOM元素的id
     *
     * @param {string} [part] 部件名称，如不提供则生成控件主元素的id
     * @return {string}
     */
    helper.getId = function (part) {
        part = part ? '-' + part : '';
        if (!this.control.domIDPrefix) {
            this.control.domIDPrefix =
                this.control.viewContext && this.control.viewContext.id;
        }
        var prefix = this.control.domIDPrefix
            ? this.control.domIDPrefix + '-'
            : '';
        return 'ctrl-' + prefix + this.control.id + part;
    };

    /**
     * 创建一个部件元素
     *
     * @param {string} part 部件名称
     * @param {string} [nodeName="div"] 使用的元素类型
     */
    helper.createPart = function (part, nodeName) {
        nodeName = nodeName || 'div';
        var element = document.createElement(nodeName);
        element.id = this.getId(part);
        this.addPartClasses(part, element);
        return element;
    };

    /**
     * 获取指定部件的DOM元素
     *
     * @param {string} part 部件名称
     * @return {HTMLElement}
     */
    helper.getPart = function (part) {
        return lib.g(this.getId(part));
    };

    /**
     * 判断DOM元素是否某一部件
     *
     * @param {HTMLElement} element DOM元素
     * @param {string} part 部件名称
     * @return {boolean}
     */
    helper.isPart = function (element, part) {
        var className = this.getPartClasses(part)[0];
        return lib.hasClass(element, className);
    };

    // 这些属性是不复制的，多数是某些元素特有
    var INPUT_SPECIFIED_ATTRIBUTES = {
        type: true, name: true, alt: true,
        autocomplete: true, autofocus: true,
        checked: true, dirname: true, disabled: true,
        form: true, formaction: true, formenctype: true,
        formmethod: true, formnovalidate: true, formtarget: true,
        width: true, height: true, inputmode: true, list: true,
        max: true, maxlength: true, min: true, minlength: true,
        multiple: true, pattern: true, placeholder: true,
        readonly: true, required: true, size: true, src: true,
        step: true, value: true
    };

    /**
     * 替换控件的主元素
     *
     * @param {HTMLElement} [main] 用于替换的主元素，
     * 如不提供则使用当前控件实例的{@link Control#createMain}方法生成
     * @return {HTMLElement} 原来的主元素
     */
    helper.replaceMain = function (main) {
        main = main || this.control.createMain();
        var initialMain = this.control.main;

        // 欺骗一下`main`模块，让它别再次对原主元素进行控件创建
        initialMain.setAttribute(
            ui.getConfig('instanceAttr'),
            lib.getGUID()
        );

        // 把能复制的属性全复制过去
        var attributes = initialMain.attributes;
        for (var i = 0; i < attributes.length; i++) {
            var attribute = attributes[i];
            var name = attribute.name;
            if (lib.hasAttribute(initialMain, name)
                && !INPUT_SPECIFIED_ATTRIBUTES.hasOwnProperty(name)
            ) {
                lib.setAttribute(main, name, attribute.value);

                // 原主元素的ui属性需要移除，否则若再次init会重复处理
                if (name.indexOf(ui.getConfig('uiPrefix')) === 0) {
                    initialMain.removeAttribute(name);
                    i--;
                }
            }
        }

        lib.insertBefore(main, initialMain);
        initialMain.parentNode.removeChild(initialMain);
        this.control.main = main;

        return initialMain;
    };

    var INPUT_PROPERTY_MAPPING = {
        name: {name: 'name'},
        maxlength: {name: 'maxLength', type: 'number'},
        required: {name: 'required', type: 'boolean'},
        pattern: {name: 'pattern'},
        min: {name: 'min', type: 'number'},
        max: {name: 'max', type: 'number'},
        autofocus: {name: 'autoFocus', type: 'boolean'},
        disabled: {name: 'disabled', type: 'boolean'},
        readonly: {name: 'readOnly', type: 'boolean'}
    };

    /**
     * 从输入元素上抽取属性
     *
     * 该方法按以下对应关系抽取属性，当元素上不存在对应的DOM属性时，不会添加该属性：
     *
     * - DOM元素的`value`对应控件的`value`属性
     * - DOM元素的`name`对应控件的`name`属性
     * - DOM元素的`maxlength`对应控件的`maxLength`属性，且转为`number`类型
     * - DOM元素的`required`对应控件的`required`属性，且转为`boolean`类型
     * - DOM元素的`pattern`对应控件的`pattern`属性
     * - DOM元素的`min`对应控件的`min`属性，且转为`number`类型
     * - DOM元素的`max`对应控件的`max`属性，且转为`number`类型
     * - DOM元素的`autofocus`对应控件的`autoFocus`属性，且转为`boolean`类型
     * - DOM元素的`disabled`对应控件的`disabled`属性，且转为`boolean`类型
     * - DOM元素的`readonly`对应控件的`readOnly`属性，且转为`boolean`类型
     *
     * @param {HTMLElement} input 输入元素
     * @param {Object} [options] 已有的配置对象，有此参数则将抽取的属性覆盖上去
     * @return {Object}
     */
    helper.extractOptionsFromInput = function (input, options) {
        var result = {};
        u.each(
            INPUT_PROPERTY_MAPPING,
            function (config, attributeName) {
                var specified = lib.hasAttribute(input, attributeName);
                if (specified) {
                    var value = lib.getAttribute(input, attributeName);

                    switch (config.type) {
                        case 'boolean':
                            value = specified;
                            break;
                        case 'number':
                            value = parseInt(value, 10);
                            break;
                    }
                    result[config.name] = value;
                }
            }
        );

        // value要特殊处理一下，可能是通过innerHTML设置的，但是`<select>`元素在没有`value`属性时会自动选中第1个，
        // 这会影响诸如`selectedIndex`属性的效果，因此对`<select>`要特别地排除
        if (lib.hasAttribute(input, 'value')
            || (input.nodeName.toLowerCase() !== 'select' && input.value)
        ) {
            result.value = input.value;
        }

        return u.defaults(options || {}, result);
    };
    /**
     * 批量初始化子控件
     *
     * @param {HTMLElement} [wrap] 容器DOM元素，默认为主元素
     * @param {Object} [options] init参数
     * @param {Object} [options.properties] 属性集合，通过id映射
     */
    helper.initChildren = function (wrap, options) {
        wrap = wrap || this.control.main;
        options = u.extend({}, this.control.renderOptions, options);
        options.viewContext = this.control.viewContext;
        options.parent = this.control;

        ui.init(wrap, options);
    };

    /**
     * 销毁所有子控件
     */
    helper.disposeChildren = function () {
        var children = this.control.children.slice();
        u.each(
            children,
            function (child) {
                child.dispose();
            }
        );
        this.children = [];
        this.childrenIndex = {};
    };

    /**
     * 禁用全部子控件
     */
    helper.disableChildren = function () {
        u.each(
            this.control.children,
            function (child) {
                child.disable();
            }
        );
    };

    /**
     * 启用全部子控件
     */
    helper.enableChildren = function () {
        u.each(
            this.control.children,
            function (child) {
                child.enable();
            }
        );
    };

    var DOM_EVENTS_KEY = '_esuiDOMEvent';
    var globalEvents = {
        window: {},
        document: {},
        documentElement: {},
        body: {}
    };

    function getGlobalEventPool(element) {
        if (element === window) {
            return globalEvents.window;
        }
        if (element === document) {
            return globalEvents.document;
        }
        if (element === document.documentElement) {
            return globalEvents.documentElement;
        }
        if (element === document.body) {
            return globalEvents.body;
        }

        return null;
    }

    function triggerGlobalDOMEvent(element, e) {
        var pool = getGlobalEventPool(element);
        if (!pool) {
            return;
        }

        var queue = pool[e.type];

        if (!queue) {
            return;
        }

        u.each(
            queue,
            function (control) {
                if (control) {
                    triggerDOMEvent(control, element, e);
                }
            }
        );
    }

    // 事件模块专用，无通用性
    function debounce(fn, interval) {
        interval = interval || 150;

        var timer = 0;

        return function (e) {
            clearTimeout(timer);
            var self = this;
            e = e || window.event;
            e = {
                type: e.type,
                srcElement: e.srcElement,
                target: e.target,
                currentTarget: e.currentTarget
            };
            timer = setTimeout(
                function () {
                    fn.call(self, e);
                },
                interval
            );
        };
    }

    function addGlobalDOMEvent(control, type, element) {
        var pool = getGlobalEventPool(element);

        if (!pool) {
            return false;
        }

        var controls = pool[type];
        if (!controls) {
            controls = pool[type] = [];
            var handler = u.partial(triggerGlobalDOMEvent, element);
            if (type === 'resize' || type === 'scroll') {
                handler = debounce(handler);
            }
            controls.handler = handler;
            lib.on(element, type, controls.handler);
        }

        if (u.indexOf(controls, control) >= 0) {
            return;
        }

        controls.push(control);
        return true;
    }

    function removeGlobalDOMEvent(control, type, element) {
        var pool = getGlobalEventPool(element);

        if (!pool) {
            return false;
        }

        if (!pool[type]) {
            return true;
        }

        var controls = pool[type];
        for (var i = 0; i < controls.length; i++) {
            if (controls[i] === control) {
                controls[i] = null;
                break;
            }
        }
        // 尽早移除事件
        var isQueueEmpty = u.every(
            controls,
            function (control) {
                return control == null;
            }
        );
        if (isQueueEmpty) {
            var handler = controls.handler;
            lib.un(element, type, handler);
            pool[type] = null;
        }

        return true;
    }

    function triggerDOMEvent(control, element, e) {
        e = e || window.event;

        // 每个控件都能在某些状态下不处理DOM事件
        var isInIgnoringState = u.some(
            function (state) {
                console.info(control.hasState(state));
                return control.hasState(state);
            }
        );
        if (isInIgnoringState) {
            return;
        }

        if (!e.target) {
            e.target = e.srcElement;
        }
        if (!e.currentTarget) {
            e.currentTarget = element;
        }
        if (!e.preventDefault) {
            e.preventDefault = function () {
                e.returnValue = false;
            };
        }
        if (!e.stopPropagation) {
            e.stopPropagation = function () {
                e.cancelBubble = true;
            };
        }
        var queue =
            control.domEvents[e.currentTarget[DOM_EVENTS_KEY]][e.type];

        if (!queue) {
            return;
        }

        queue.execute(e, control);
    }

    /**
     * 为控件管理的DOM元素添加DOM事件
     *
     * 通过本方法添加的DOM事件处理函数，会进行以下额外的处理：
     *
     * - 修正`target`和`currentTarget`属性使其保持与标准兼容
     * - 修正`preventDefault`和`stopPropagation`方法使其保持与标准兼容
     * - 函数中的`this`对象永远指向当前控件实例
     * - 当控件处于由其{@link Control#ignoreStates}属性定义的状态时，不执行函数
     *
     * @param {HTMLElement | string} element 需要添加事件的DOM元素或部件名称
     * @param {string} type 事件的类型
     * @param {Function} handler 事件处理函数
     */
    helper.addDOMEvent = function (element, type, handler) {
        if (typeof element === 'string') {
            element = this.getPart(element);
        }

        if (!this.control.domEvents) {
            this.control.domEvents = {};
        }

        var guid = element[DOM_EVENTS_KEY];
        if (!guid) {
            guid = element[DOM_EVENTS_KEY] = lib.getGUID();
        }

        var events = this.control.domEvents[guid];
        if (!events) {
            // `events`中的键都是事件的名称，仅`element`除外，
            // 因为DOM上没有`element`这个事件，所以这里占用一下没关系
            events = this.control.domEvents[guid] = {element: element};
        }

        var isGlobal = addGlobalDOMEvent(this.control, type, element);
        var queue = events[type];
        if (!queue) {
            queue = events[type] = new EventQueue();
            // 非全局事件是需要自己管理一个处理函数的，以便到时候解除事件绑定
            if (!isGlobal) {
                // 无论注册多少个处理函数，其实在DOM元素上只有一个函数，
                // 这个函数负责执行队列中的所有函数，
                // 这样能保证执行的顺序，移除注册时也很方便
                queue.handler =
                    u.partial(triggerDOMEvent, this.control, element);
                lib.on(element, type, queue.handler);
            }
        }

        queue.add(handler);
    };

    /**
     * 代理DOM元素的事件为自身的事件
     *
     * @param {HTMLElement | string} element 需要添加事件的DOM元素或部件名称
     * @param {string} type 需要代理的DOM事件类型
     * @param {string} [newType] 代理时触发的事件，默认与`type`一致
     */
    helper.delegateDOMEvent = function (element, type, newType) {
        var handler = function (e) {
            var event = require('mini-event').fromDOMEvent(e);
            this.fire(newType || e.type, event);

            if (event.isDefaultPrevented()) {
                lib.event.preventDefault(e);
            }

            if (event.isPropagationStopped()) {
                lib.event.stopPropagation(e);
            }
        };

        this.addDOMEvent(element, type, handler);
    };

    /**
     * 为控件管理的DOM元素添加DOM事件
     *
     * @param {HTMLElement | string} element 需要添加事件的DOM元素或部件名称
     * @param {string} type 事件的类型
     * @param {Function} [handler] 事件处理函数，不提供则清除所有处理函数
     */
    helper.removeDOMEvent = function (element, type, handler) {
        if (typeof element === 'string') {
            element = this.getPart(element);
        }

        if (!this.control.domEvents) {
            return;
        }

        var guid = element[DOM_EVENTS_KEY];
        var events = this.control.domEvents[guid];

        if (!events || !events[type]) {
            return;
        }

        if (!handler) {
            events[type].clear();
        }
        else {
            var queue = events[type];
            queue.remove(handler);

            // 全局元素上的事件很容易冒泡到后执行，
            // 在上面的又都是`mousemove`这种不停执行的，
            // 因此对全局事件做一下处理，尽早移除
            if (!queue.getLength()) {
                removeGlobalDOMEvent(this.control, type, element);
            }
        }
    };

    /**
     * 清除控件管理的DOM元素上的事件
     *
     * @param {HTMLElement | string} [element] 控件管理的DOM元素或部件名称，
     * 如不提供则去除所有该控件管理的元素的DOM事件
     */
    helper.clearDOMEvents = function (element) {
        if (typeof element === 'string') {
            element = this.getPart(element);
        }

        if (!this.control.domEvents) {
            return;
        }

        if (!element) {
            // 在循环中直接删除一个属性不知道会发生什么（已知浏览器看上去没问题），
            // 因此先拿到所有的元素然后再做遍历更安全，虽然是2次循环但能有多少个对象
            u.each(
                u.map(this.control.domEvents, 'element'),
                this.clearDOMEvents,
                this
            );
            this.control.domEvents = null;
            return;
        }

        var guid = element[DOM_EVENTS_KEY];
        var events = this.control.domEvents[guid];

        // `events`中存放着各事件类型，只有`element`属性是一个DOM对象，
        // 因此要删除`element`这个键，
        // 以避免`for... in`的时候碰到一个不是数组类型的值
        delete events.element;
        u.each(
            events,
            function (queue, type) {
                // 全局事件只要清掉在`globalEvents`那边的注册关系
                var isGlobal =
                    removeGlobalDOMEvent(this.control, type, element);
                if (!isGlobal) {
                    var handler = queue.handler;
                    queue.dispose();
                    queue.handler = null; // 防内存泄露
                    lib.un(element, type, handler);
                }
            },
            this
        );

        delete this.control.domEvents[guid];
    };

    // 自闭合的标签列表
    var SELF_CLOSING_TAGS = {
        area: true, base: true, br: true, col: true,
        embed: true, hr: true, img: true, input: true,
        keygen: true, link: true, meta: true, param: true,
        source: true, track: true, wbr: true
    };

    /**
     * 获取部件的起始标签
     *
     * @param {string} part 部件名称
     * @param {string} nodeName 部件使用的元素类型
     * @return {string}
     */
    helper.getPartBeginTag = function (part, nodeName) {
        var html = '<' + nodeName + ' id="' + this.getId(part) + '" '
            + 'class="' + this.getPartClassName(part) + '">';
        return html;
    };

    /**
     * 获取部件的结束标签
     *
     * @param {string} part 部件名称
     * @param {string} nodeName 部件使用的元素类型
     * @return {string}
     */
    helper.getPartEndTag = function (part, nodeName) {
        var html = SELF_CLOSING_TAGS.hasOwnProperty(nodeName)
            ? ' />'
            : '</' + nodeName + '>';
        return html;
    };

    /**
     * 获取部件的HTML模板
     *
     * @param {string} part 部件名称
     * @param {string} nodeName 部件使用的元素类型
     * @return {string}
     */
    helper.getPartHTML = function (part, nodeName) {
        return this.getPartBeginTag(part, nodeName)
            + this.getPartEndTag(part, nodeName);
    };

    /**
     * LifeCycle枚举
     *
     * @type {Object}
     * @ignore
     */
    var LifeCycle = {
        NEW: 0,
        INITED: 1,
        RENDERED: 2,
        DISPOSED: 4
    };

    /**
     * 初始化控件视图环境
     */
    helper.initViewContext = function () {
        var viewContext = this.control.viewContext || ui.getViewContext();

        // 因为`setViewContext`里有判断传入的`viewContext`和自身的是否相等，
        // 这里必须制造出**不相等**的情况，再调用`setViewContext`
        this.control.viewContext = null;
        this.control.setViewContext(viewContext);
    };

    /**
     * 初始化控件扩展
     */
    helper.initExtensions = function () {
        // 附加全局扩展
        var extensions = this.control.extensions;
        if (!u.isArray(extensions)) {
            extensions = this.control.extensions = [];
        }
        Array.prototype.push.apply(
            extensions,
            ui.createGlobalExtensions()
        );

        // 同类型扩展去重
        var registeredExtensions = {};
        for (var i = 0; i < extensions.length; i++) {
            var extension = extensions[i];
            if (!registeredExtensions[extension.type]) {
                extension.attachTo(this.control);
                registeredExtensions[extension.type] = true;
            }
        }
    };

    /**
     * 判断控件是否处于相应的生命周期阶段
     *
     * @param {string} stage 生命周期阶段
     * @return {boolean}
     */
    helper.isInStage = function (stage) {
        if (LifeCycle[stage] == null) {
            throw new Error('Invalid life cycle stage: ' + stage);
        }

        return this.control.stage === LifeCycle[stage];
    };

    /**
     * 改变控件的生命周期阶段
     *
     * @param {string} stage 生命周期阶段
     */
    helper.changeStage = function (stage) {
        if (LifeCycle[stage] == null) {
            throw new Error('Invalid life cycle stage: ' + stage);
        }

        this.control.stage = LifeCycle[stage];
    };

    /**
     * 销毁控件
     */
    helper.dispose = function () {
        // 清理子控件
        this.control.disposeChildren();
        this.control.children = null;
        this.control.childrenIndex = null;

        // 移除自身行为
        this.clearDOMEvents();

        // 移除所有扩展
        u.invoke(this.control.extensions, 'dispose');
        this.control.extensions = null;

        // 从控件树中移除
        if (this.control.parent) {
            this.control.parent.removeChild(this.control);
        }

        // 从视图环境移除
        if (this.control.viewContext) {
            this.control.viewContext.remove(this.control);
        }

        this.control.renderOptions = null;
    };

    /**
     * 执行控件销毁前动作
     */
    helper.beforeDispose = function () {
        /**
         * @event beforedispose
         *
         * 在销毁前触发
         *
         * @member Control
         */
        this.control.fire('beforedispose');
    };

    /**
     * 执行控件销毁后动作
     */
    helper.afterDispose = function () {
        this.changeStage('DISPOSED');
        /**
         * @event afterdispose
         *
         * 在销毁后触发
         *
         * @member Control
         */
        this.control.fire('afterdispose');

        // 销毁所有事件，这个必须在`afterdispose`事件之后，不然事件等于没用
        this.control.destroyEvents();
    };

    var FILTERS = {
        'id': function (part, instance) {
            return instance.helper.getId(part);
        },

        'class': function (part, instance) {
            return instance.helper.getPartClassName(part);
        },

        'part': function (part, nodeName, instance) {
            return instance.helper.getPartHTML(part, nodeName);
        }
    };

    /**
     * 设置模板引擎实例
     *
     * @param {etpl.Engine} engine 模板引擎实例
     */
    helper.setTemplateEngine = function (engine) {
        this.templateEngine = engine;

        if (!engine.esui) {
            this.initializeTemplateEngineExtension();
        }
    };

    /**
     * 初始化模板引擎的扩展，添加对应的过滤器
     *
     * @protected
     */
    helper.initializeTemplateEngineExtension = function () {
        u.each(
            FILTERS,
            function (filter, name) {
                this.addFilter(name, filter);
            },
            this.templateEngine
        );
    };

    /**
     * 通过模板引擎渲染得到字符串
     *
     * ESUI为[etpl](https://github.com/ecomfe/etpl')提供了额外的
     * [filter](https://github.com/ecomfe/etpl/#变量替换)：
     *
     * - `${xxx | id($instance)}`按规则生成以`xxx`为部件名的DOM元素id
     * - `${xxx | class($instance)}`按规则生成以`xxx`为部件名的DOM元素class
     * - `${xxx | part('div', $instance)}`生成以`xxx`为部件名的div元素HTML
     *
     * 在使用内置过滤器时，必须加上`($instance)`这一段，以将过滤器和当前控件实例关联
     *
     * 同时也可以用简化的方式使用以上的过滤器，如：
     *
     * - `${xxx.id}`等效于`${xxx | id($instance)}`
     * - `${xxx.class}`等效于`${xxx | class($instance)}`
     *
     * 需要注意`part`过滤器需要指定`nodeName`，因此不能使用以上方法简写，
     * 必须使用过滤器的语法实现
     *
     * 一般来说，如果一个控件需要使用模板，我们会为这个控件类生成一个模板引擎实例：
     *
     *     var engine = new require('etpl').Engine();
     *     // 可使用text插件来加载模板文本
     *     engine.parse(require('text!myControl.tpl.html'));
     *
     *     // 声明控件类
     *     function MyControl() {
         *         ...
         *
         * 注意模板引擎实例是一个 **控件类** 一个，而非每个实例一个。
         * 由于引擎实例的隔离，在模板中不需要对`target`命名使用前缀等方式进行防冲突处理
         * 但是如果在项目发布的过程中涉及到了模板合并的工作，如果`target`重名了，可能存在问题
         * 因此如果一个 **控件类** 使用了模板，那么在项目发布的过程中需要注意选择合适的策略来
         * 合并模板：
         *
         * - 将模板的代码内嵌到js中
         * - 所有的模板合并为一个，然后统一通过插件来加载
         *
         * 随后在控件的构造函数中，为{@link Helper}添加模板引擎实现：
         *
         *     function MyClass() {
         *         // 调用基类构造函数
         *         Control.apply(this, arguments);
         *
         *         // 设置模板引擎实例
         *         this.helper.setTemplateEngine(engine);
         *     }
         *
         * 在控件的实现中，即可使用本方法输出HTML：
         *
         *     MyClass.prototype.initStructure = function () {
         *         this.main.innerHTML =
         *             this.helper.renderTemplate('content', data);
         *     }
         *
         * 需要注意，使用此方法时，仅满足以下所有条件时，才可以使用内置的过滤器：
         *
         * - `data`对象仅一层属性，即不能使用`${user.name}`这一形式访问深层的属性
         * - `data`对象不能包含名为`instance`的属性，此属性会强制失效
         *
         * 另外此方法存在微小的几乎可忽略不计的性能损失，
         * 但如果需要大量使用模板同时又不需要内置的过滤器，可以使用以下代码代替：
         *
         *     this.helper.templateEngine.render(target, data);
         *
     * @param {string} target 模板名
     * @param {Object} [data] 用于模板渲染的数据
     * @return {string}
     */
    helper.renderTemplate = function (target, data) {
        var helper = this;
        data = data || {};

        var templateData = {
            get: function (name) {
                if (name === 'instance') {
                    return helper.control;
                }

                if (typeof data.get === 'function') {
                    return data.get(name);
                }

                var propertyName = name;
                var filter = null;

                var indexOfDot = name.lastIndexOf('.');
                if (indexOfDot > 0) {
                    propertyName = name.substring(0, indexOfDot);
                    var filterName = name.substring(indexOfDot + 1);
                    if (filterName && FILTERS.hasOwnProperty(filterName)) {
                        filter = FILTERS[filterName];
                    }
                }

                var value = data.hasOwnProperty(propertyName)
                    ? data[propertyName]
                    : propertyName;
                if (filter) {
                    value = filter(value, helper.control);
                }

                return value;
            }
        };

        if (!this.templateEngine) {
            throw new Error('No template engine attached to this control');
        }

        return this.templateEngine.render(target, templateData);
    };

    function Helper(control) {
        this.control = control;
    }

    u.extend(
        Helper.prototype,
        helper
    );

    /*----------------------------------------------Layer.js-------------------------------------------------*/

    /**
     * 浮层基类
     *
     * `Layer`类是一个与控件形成组合关系的类，但并不是一个控件
     *
     * 当一个控件需要一个浮层（如下拉框）时，可以使用此类，并重写相关方法来实现浮层管理
     *
     * 不把`Layer`作为一个控件来实现，是有以下考虑：
     *
     * - 即便`Layer`作为子控件使用，也必须重写所有相关方法才能起作用，并未节省代码
     * - 控件的生命周期管理、事件管理等一大堆事对性能多少有些负面影响
     * - 通常重写`Layer`的方法时，会依赖控件本身的一些开放接口。
     * 那么如果`Layer`是个子控件，就形成了 **子控件反调用父控件方法** 的现象，不合理
     *
     * 关于如何使用`Layer`控件，可以参考{@link CommandMenu}进行学习
     *
     * @constructor
     * @param {Control} control 关联的控件实例
     */
    function Layer(control) {
        this.control = control;
    }

    /**
     * 创建的元素标签类型
     *
     * @type {string}
     */
    Layer.prototype.nodeName = 'div';

    /**
     * 控制是否在页面滚动等交互发生时自动隐藏，默认为`true`
     *
     * 如果需要改变此属性，必须在初始化后立即设置，仅在第一次创建层时生效
     *
     * @type {boolean}
     */
    Layer.prototype.autoHide = true;

    /**
     * 通过点击关闭弹层的处理方法
     *
     * @param {Event} e DOM事件对象
     * @ignore
     */
    function close(e) {
        var target = e.target;
        var layer = this.getElement(this);
        var main = this.control.main;

        if (!layer) {
            return;
        }

        while (target && (target !== layer && target !== main)) {
            target = target.parentNode;
        }

        if (target !== layer && target !== main) {
            this.hide();
        }
    }

    /**
     * 启用自动隐藏功能
     *
     * @param {HTMLElement} element 需要控制隐藏的层元素
     */
    Layer.prototype.enableAutoHide = function (element) {
        var eventName = 'onwheel' in document.body ? 'wheel' : 'mousewheel';
        this.control.helper.addDOMEvent(
            document.documentElement,
            eventName,
            u.bind(this.hide, this)
        );
        // 自己的滚动不要关掉
        this.control.helper.addDOMEvent(
            element,
            eventName,
            function (e) {
                e.stopPropagation();
            }
        );
    };

    /**
     * 创建浮层
     *
     * @return {HTMLElement}
     */
    Layer.prototype.create = function () {
        var element =
            this.control.helper.createPart('layer', this.nodeName);
        lib.addClass(element, ui.getConfig('uiClassPrefix') + '-layer');

        if (this.autoHide) {
            this.enableAutoHide(element);
        }

        return element;
    };

    /**
     * 给Layer增加自定义class
     *
     * @return {array} layerClassNames样式集合
     */
    Layer.prototype.addCustomClasses = function (layerClassNames) {
        var element = this.getElement();
        lib.addClasses(element, layerClassNames);
    };

    /**
     * 渲染层内容
     *
     * @param {HTMLElement} element 层元素
     * @abstract
     */
    Layer.prototype.render = function (element) {
    };

    /**
     * 同步控件状态到层
     *
     * @param {HTMLElement} element 层元素
     * @abstract
     */
    Layer.prototype.syncState = function (element) {
    };

    /**
     * 重新渲染
     */
    Layer.prototype.repaint = function () {
        var element = this.getElement(false);
        if (element) {
            this.render(element);
        }
    };

    /**
     * 初始化层的交互行为
     *
     * @param {HTMLElement} element 层元素
     * @abstract
     */
    Layer.prototype.initBehavior = function (element) {
    };

    function getHiddenClasses(layer) {
        var classes = layer.control.helper.getPartClasses('layer-hidden');
        classes.unshift(ui.getConfig('uiClassPrefix') + '-layer-hidden');

        return classes;
    }

    /**
     * 获取浮层DOM元素
     *
     * @param {boolean} [create=true] 不存在时是否创建
     * @return {HTMLElement}
     */
    Layer.prototype.getElement = function (create) {
        var element = this.control.helper.getPart('layer');

        if (!element && create !== false) {
            element = this.create();
            this.render(element);

            lib.addClasses(element, getHiddenClasses(this));

            this.initBehavior(element);
            this.control.helper.addDOMEvent(
                document, 'mousedown', u.bind(close, this));
            // 不能点层自己也关掉，所以阻止冒泡到`document`
            this.control.helper.addDOMEvent(
                element,
                'mousedown',
                function (e) {
                    e.stopPropagation();
                }
            );

            this.syncState(element);

            // IE下元素始终有`parentNode`，无法判断是否进入了DOM
            if (!element.parentElement) {
                document.body.appendChild(element);
            }

            this.fire('rendered');
        }

        return element;
    };

    /**
     * 隐藏层
     */
    Layer.prototype.hide = function () {
        var classes = getHiddenClasses(this);

        var element = this.getElement();
        lib.addClasses(element, classes);
        this.control.removeState('active');
        this.fire('hide');
    };

    /**
     * 显示层
     */
    Layer.prototype.show = function () {
        var element = this.getElement();
        element.style.zIndex = this.getZIndex();

        this.position();

        var classes = getHiddenClasses(this);
        lib.removeClasses(element, classes);
        this.control.addState('active');
        this.fire('show');
    };

    /**
     * 切换显示状态
     */
    Layer.prototype.toggle = function () {
        var element = this.getElement();
        if (!element
            || this.control.helper.isPart(element, 'layer-hidden')
        ) {
            this.show();
        }
        else {
            this.hide();
        }
    };

    /**
     * 放置层
     */
    Layer.prototype.position = function () {
        var element = this.getElement();
        Layer.attachTo(element, this.control.main, this.dock);
    };

    /**
     * 获取层应该有的`z-index`样式值
     *
     * @return {number}
     */
    Layer.prototype.getZIndex = function () {
        return Layer.getZIndex(this.control.main);
    };

    /**
     * 销毁
     */
    Layer.prototype.dispose = function () {
        var element = this.getElement(false);
        if (element) {
            element.innerHTML = '';
            lib.removeNode(element);
        }
        this.control = null;
    };

    // 控制浮层的静态方法，用与本身就漂浮的那些控件（如`Dialog`），
    // 它们无法组合`Layer`实例，因此需要静态方法为其服务

    // 初始最高的`z-index`值，将浮层移到最上就是参考此值
    var zIndexStack = 1000;

    /**
     * 创建层元素
     *
     * @param {string} [tagName="div"] 元素的标签名
     * @return {HTMLElement}
     * @static
     */
    Layer.create = function (tagName) {
        var element = document.createElement(tagName || 'div');
        element.style.position = 'absolute';
        return element;
    };

    /**
     * 获取层应当使用的`z-index`的值
     *
     * @param {HTMLElement} [owner] 层的所有者元素
     * @return {number}
     * @static
     */
    Layer.getZIndex = function (owner) {
        var zIndex = 0;
        while (!zIndex && owner && owner !== document) {
            zIndex =
                parseInt(lib.getComputedStyle(owner, 'zIndex'), 10);
            owner = owner.parentNode;
        }
        zIndex = zIndex || 0;
        return zIndex + 1;
    };

    /**
     * 将当前层移到最前
     *
     * @param {HTMLElement} element 目标层元素
     * @static
     */
    Layer.moveToTop = function (element) {
        element.style.zIndex = ++zIndexStack;
    };

    /**
     * 移动层的位置
     *
     * @param {HTMLElement} element 目标层元素
     * @param {number} top 上边界距离
     * @param {number} left 左边界距离
     * @static
     */
    Layer.moveTo = function (element, top, left) {
        positionLayerElement(element, {top: top, left: left});
    };

    /**
     * 缩放层的大小
     *
     * @param {HTMLElement} element 目标层元素
     * @param {number} width 宽度
     * @param {number} height 高度
     * @static
     */
    Layer.resize = function (element, width, height) {
        positionLayerElement(element, {width: width, height: height});
    };

    /**
     * 让当前层靠住一个指定的元素
     *
     * @param {HTMLElement} layer 目标层元素
     * @param {HTMLElement} target 目标元素
     * @param {Object} [options] 停靠相关的选项
     * @param {boolean} [options.strictWidth=false] 是否要求层的宽度不小于目标元素的宽度
     * @static
     */
    Layer.attachTo = function (layer, target, options) {
        options = options || {strictWidth: false};
        // 垂直算法：
        //
        // 1. 将层的上边缘贴住目标元素的下边缘
        // 2. 如果下方空间不够，则转为层的下边缘贴住目标元素的上边缘
        // 3. 如果上方空间依旧不够，则强制使用第1步的位置
        //
        // 水平算法：
        //
        // 1. 如果要求层和目标元素等宽，则设置宽度，层的左边缘贴住目标元素的左边缘，结束
        // 2. 将层的左边缘贴住目标元素的左边缘
        // 3. 如果右侧空间不够，则转为层的右边缘贴住目标元素的右边缘
        // 4. 如果左侧空间依旧不够，则强制使用第2步的位置

        // 虽然这2个变量下面不一定用得到，但是不能等层出来了再取，
        // 一但层出现，可能造成滚动条出现，导致页面尺寸变小
        var pageWidth = lib.page.getViewWidth();
        var pageHeight = lib.page.getViewHeight();
        var pageScrollTop = lib.page.getScrollTop();
        var pageScrollLeft = lib.page.getScrollLeft();

        // 获取目标元素的属性
        var targetOffset = lib.getOffset(target);

        // 浮层的存在会影响页面高度计算，必须先让它消失，
        // 但在消失前，又必须先计算到浮层的正确高度
        var previousDisplayValue = layer.style.display;
        layer.style.display = 'block';
        layer.style.top = '-5000px';
        layer.style.left = '-5000px';
        // 如果对层宽度有要求，则先设置好最小宽度
        if (options.strictWidth) {
            layer.style.minWidth = targetOffset.width + 'px';
        }
        // IE7下，如果浮层隐藏着反而会影响offset的获取，
        // 但浮层显示出来又可能造成滚动条出现，
        // 因此显示浮层显示后移到屏幕外面，然后计算坐标
        var layerOffset = lib.getOffset(layer);
        // 用完改回来再计算后面的
        layer.style.top = '';
        layer.style.left = '';
        layer.style.display = previousDisplayValue;


        var properties = {};

        // 先算垂直的位置
        var bottomSpace = pageHeight - (targetOffset.bottom - pageScrollTop);
        var topSpace = targetOffset.top - pageScrollTop;
        if (bottomSpace <= layerOffset.height && topSpace > layerOffset.height) {
            // 放上面
            properties.top = targetOffset.top - layerOffset.height;
        }
        else {
            // 放下面
            properties.top = targetOffset.bottom;
        }

        // 再算水平的位置
        var rightSpace = pageWidth - (targetOffset.left - pageScrollLeft);
        var leftSpace = targetOffset.right - pageScrollLeft;
        if (rightSpace <= layerOffset.width && leftSpace > layerOffset.width) {
            // 靠右侧
            properties.left = targetOffset.right - layerOffset.width;
        }
        else {
            // 靠左侧
            properties.left = targetOffset.left;
        }

        positionLayerElement(layer, properties);
    };

    /**
     * 将层在视图中居中
     *
     * @param {HTMLElement} element 目标层元素
     * @param {Object} [options] 相关配置项
     * @param {number} [options.width] 指定层的宽度
     * @param {number} [options.height] 指定层的高度
     * @param {number} [options.minTop] 如果层高度超过视图高度，
     * 则留下该值的上边界保底
     * @param {number} [options.minLeft] 如果层宽度超过视图高度，
     * 则留下该值的左边界保底
     * @static
     */
    Layer.centerToView = function (element, options) {
        var properties = options ? lib.clone(options) : {};

        if (typeof properties.width !== 'number') {
            properties.width = this.width;
        }
        if (typeof properties.height !== 'number') {
            properties.height = this.height;
        }

        properties.left = (lib.page.getViewWidth() - properties.width) / 2;

        var viewHeight = lib.page.getViewHeight();
        if (properties.height >= viewHeight &&
            options.hasOwnProperty('minTop')
        ) {
            properties.top = options.minTop;
        }
        else {
            properties.top =
                Math.floor((viewHeight - properties.height) / 2);
        }

        var viewWidth = lib.page.getViewWidth();
        if (properties.height >= viewWidth &&
            options.hasOwnProperty('minLeft')
        ) {
            properties.left = options.minLeft;
        }
        else {
            properties.left =
                Math.floor((viewWidth - properties.width) / 2);
        }

        properties.top += lib.page.getScrollTop();
        this.setProperties(properties);
    };

    // 统一浮层放置方法方法
    function positionLayerElement(element, options) {
        var properties = lib.clone(options || {});

        // 如果同时有`top`和`bottom`，则计算出`height`来
        if (properties.hasOwnProperty('top')
            && properties.hasOwnProperty('bottom')
        ) {
            properties.height = properties.bottom - properties.top;
            delete properties.bottom;
        }
        // 同样处理`left`和`right`
        if (properties.hasOwnProperty('left')
            && properties.hasOwnProperty('right')
        ) {
            properties.width = properties.right - properties.left;
            delete properties.right;
        }

        // 避免原来的属性影响
        if (properties.hasOwnProperty('top')
            || properties.hasOwnProperty('bottom')
        ) {
            element.style.top = '';
            element.style.bottom = '';
        }

        if (properties.hasOwnProperty('left')
            || properties.hasOwnProperty('right')
        ) {
            element.style.left = '';
            element.style.right = '';
        }

        // 设置位置和大小
        for (var name in properties) {
            if (properties.hasOwnProperty(name)) {
                element.style[name] = properties[name] + 'px';
            }
        }
    }

    lib.inherits(Layer, EventTarget);

    /*-------------------------------------------controlHelper.js----------------------------------------------------*/

    /**
     * 提供控件类常用的辅助方法
     *
     * **此对象将在4.0版本中移除** ，请按以下规则迁移：
     *
     * - `getGUID`移至{@link lib#getGUID}
     * - `createRepaint`移至{@link painters#createRepaint}
     * - 多数方法移至{@link Helper}类下
     * - 浮层相关方法移至{@link Layer}类下
     *
     * @class controlHelper
     * @singleton
     */

    /**
     * @ignore
     */
    helper.getGUID = lib.getGUID;

    var methods = [
        // life
        'initViewContext', 'initExtensions',
        'isInStage', 'changeStage',
        'dispose', 'beforeDispose', 'afterDispose',
        // dom
        'getPartClasses', 'addPartClasses', 'removePartClasses',
        'getStateClasses', 'addStateClasses', 'removeStateClasses',
        'getId', 'replaceMain',
        // event
        'addDOMEvent', 'removeDOMEvent', 'clearDOMEvents'
    ];

    helper.createRepaint = painters.createRepaint;

    // 补上原有的方法，全部代理到`Helper`上
    u.each(
        methods,
        function (name) {
            helper[name] = function (control) {
                var helper = control.helper || new Helper(control);
                var args = [].slice.call(arguments, 1);
                return helper[name].apply(helper, args);
            };
        }
    );

    // 再往下的全部是等待废弃的

    /**
     * @ignore
     * @deprecated 使用{@link Helper#extractOptionsFromInput}代替
     */
    helper.extractValueFromInput = function (control, options) {
        var main = control.main;
        // 如果是输入元素
        if (lib.isInput(main)) {
            if (main.value && !options.value) {
                options.value = main.value;
            }
            if (main.name && !options.name) {
                options.name = main.name;
            }
            if (main.disabled
                && (options.disabled === null
                || options.disabled === undefined)) {
                options.disabled = main.disabled;
            }
            if (main.readOnly
                && (options.readOnly === null
                || options.readOnly === undefined)) {
                options.readOnly = main.readonly || main.readOnly;
            }
        }
    };

    var layer = helper.layer = {};

    /**
     * @ignore
     */
    layer.create = Layer.create;

    /**
     * @ignore
     */
    layer.getZIndex = Layer.getZIndex;

    /**
     * @ignore
     */
    layer.moveToTop = Layer.moveToTop;

    /**
     * @ignore
     */
    layer.moveTo = Layer.moveTo;

    /**
     * @ignore
     */
    layer.resize = Layer.resize;

    /**
     * @ignore
     */
    layer.attachTo = Layer.attachTo;

    /**
     * @ignore
     */
    layer.centerToView = Layer.centerToView;

    /*-------------------------------------------Control----------------------------------------------------*/


    /**
     * 控件基类
     *
     * @constructor
     * @extends {mini-event.EventTarget}
     * @param {Object} [options] 初始化参数
     * @fires init
     */
    function Control(options) {
        options = options || {};

        /**
         * 控件关联的{@link Helper}对象
         *
         * @type {Helper}
         * @protected
         */
        this.helper = new Helper(this);

        this.helper.changeStage('NEW');

        /**
         * 子控件数组
         *
         * @type {Control[]}
         * @protected
         * @readonly
         */
        this.children = [];
        this.childrenIndex = {};
        this.currentStates = {};
        this.domEvents = {};

        /**
         * 控件的主元素
         *
         * @type {HTMLElement}
         * @protected
         * @readonly
         */
        this.main = options.main ? options.main : this.createMain(options);

        // 如果没给id，自己创建一个，
        // 这个有可能在后续的`initOptions`中被重写，则会在`setProperties`中处理，
        // 这个不能放到`initOptions`的后面，
        // 不然会导致很多个没有id的控件放到一个`ViewContext`中，
        // 会把其它控件的`ViewContext`给冲掉导致各种错误

        /**
         * 控件的id，在一个{@link ViewContext}中不能重复
         *
         * @property {string} id
         * @readonly
         */
        if (!this.id && !options.id) {
            this.id = lib.getGUID();
        }

        this.initOptions(options);

        // 初始化视图环境
        this.helper.initViewContext();

        // 初始化扩展
        this.helper.initExtensions();

        // 切换控件所属生命周期阶段
        this.helper.changeStage('INITED');

        /**
         * @event init
         *
         * 完成初始化
         */
        this.fire('init', {options: options});
    }

    /**
     * @property {string} type
     *
     * 控件的类型
     * @readonly
     */

    /**
     * @property {string} skin
     *
     * 控件皮肤，仅在初始化时设置有效，运行时不得变更
     *
     * @protected
     * @readonly
     */

    /**
     * @property {string} styleType
     *
     * 控件的样式类型，用于生成各class使用
     *
     * 如无此属性，则使用{@link Control#type}属性代替
     *
     * @readonly
     */

    Control.prototype = {
        constructor: Control,

        /**
         * 指定在哪些状态下该元素不处理相关的DOM事件
         *
         * @type {string[]}
         * @protected
         */
        ignoreStates: ['disabled'],

        /**
         * 获取控件的分类
         *
         * 控件分类的作用如下：
         *
         * - `control`表示普通控件，没有任何特征
         * - `input`表示输入控件，在表单中使用`getRawValue()`获取其值
         * - `check`表示复选控件，在表单中通过`isChecked()`判断其值是否加入结果中
         *
         * @return {string} 可以为`control`、`input`或`check`
         */
        getCategory: function () {
            return 'control';
        },

        /**
         * 初始化控件需要使用的选项
         *
         * @param {Object} [options] 构造函数传入的选项
         * @protected
         */
        initOptions: function (options) {
            options = options || {};
            this.setProperties(options);
        },

        /**
         * 创建控件主元素
         *
         * @return {HTMLElement}
         * @protected
         */
        createMain: function () {
            if (!this.type) {
                return document.createElement('div');
            }

            var name = this.type.replace(
                /([A-Z])/g,
                function (match, ch) {
                    return '-' + ch.toLowerCase();
                }
            );
            return document.createElement(ui.getConfig('customElementPrefix') + '-' + name.slice(1));
        },

        /**
         * 初始化DOM结构，仅在第一次渲染时调用
         *
         * @protected
         * @abstract
         */
        initStructure: function () {
        },

        /**
         * 初始化与DOM元素、子控件等的事件交互，仅在第一次渲染时调用
         *
         * @protected
         * @abstract
         */
        initEvents: function () {
        },

        /**
         * 渲染控件
         *
         * @fires beforerender
         * @fires afterrender
         */
        render: function () {
            if (this.helper.isInStage('INITED')) {
                /**
                 * @event beforerender
                 *
                 * 开始初次渲染
                 */
                this.fire('beforerender');

                this.domIDPrefix = this.viewContext.id;

                this.initStructure();
                this.initEvents();

                // 为控件主元素添加id
                if (!this.main.id) {
                    this.main.id = this.helper.getId();
                }

                // 为控件主元素添加控件实例标识属性
                this.main.setAttribute(
                    ui.getConfig('instanceAttr'),
                    this.id
                );
                this.main.setAttribute(
                    ui.getConfig('viewContextAttr'),
                    this.viewContext.id
                );

                this.helper.addPartClasses();

                if (this.states) {
                    this.states = typeof this.states === 'string'
                        ? this.states.split(' ')
                        : this.states;

                    u.each(this.states, this.addState, this);
                }
            }

            // 由子控件实现
            this.repaint();

            if (this.helper.isInStage('INITED')) {
                // 切换控件所属生命周期阶段
                this.helper.changeStage('RENDERED');

                /**
                 * @event afterrender
                 *
                 * 结束初次渲染
                 */
                this.fire('afterrender');
            }
        },

        /**
         * 重新渲染视图
         *
         * 仅当生命周期处于RENDER时，该方法才重新渲染
         *
         * 本方法的2个参数中的值均为 **属性变更对象** ，一个该对象包含以下属性：
         *
         * - `name`：属性名
         * - `oldValue`：变更前的值
         * - `newValue`：变更后的值
         *
         * @param {Object[]} [changes] 变更过的属性的集合
         * @param {Object} [changesIndex] 变更过的属性的索引
         * @protected
         */
        repaint: function (changes, changesIndex) {
            if (!changesIndex
                || changesIndex.hasOwnProperty('disabled')
            ) {
                var method = this.disabled ? 'addState' : 'removeState';
                this[method]('disabled');
            }
            if (!changesIndex || changesIndex.hasOwnProperty('hidden')) {
                var method = this.hidden ? 'addState' : 'removeState';
                this[method]('hidden');
            }
        },

        /**
         * 将控件添加到页面的某个元素中
         *
         * @param {HTMLElement | Control} wrap 控件要添加到的目标元素
         */
        appendTo: function (wrap) {
            if (wrap instanceof Control) {
                wrap = wrap.main;
            }

            wrap.appendChild(this.main);
            if (this.helper.isInStage('NEW')
                || this.helper.isInStage('INITED')
            ) {
                this.render();
            }
        },

        /**
         * 将控件添加到页面的某个元素之前
         *
         * @param {HTMLElement | Control} reference 控件要添加到之前的目标元素
         */
        insertBefore: function (reference) {
            if (reference instanceof Control) {
                reference = reference.main;
            }

            reference.parentNode.insertBefore(this.main, reference);
            if (this.helper.isInStage('NEW')
                || this.helper.isInStage('INITED')
            ) {
                this.render();
            }
        },

        /**
         * 销毁释放控件
         *
         * @fires beforedispose
         * @fires afterdispose
         */
        dispose: function () {
            if (!this.helper.isInStage('DISPOSED')) {
                this.helper.beforeDispose();
                this.helper.dispose();
                this.helper.afterDispose();
            }
        },

        /**
         * 销毁控件并移除所有DOM元素
         *
         * @fires beforedispose
         * @fires afterdispose
         */
        destroy: function () {
            // 为了避免`dispose()`的时候把`main`置空了，这里先留存一个
            var main = this.main;
            this.dispose();
            lib.removeNode(main);
        },

        /**
         * 获取控件的属性值
         *
         * @param {string} name 属性名
         * @return {Mixed}
         */
        get: function (name) {
            var method = this['get' + lib.pascalize(name)];

            if (typeof method === 'function') {
                return method.call(this);
            }

            return this[name];
        },

        /**
         * 设置控件的属性值
         *
         * @param {string} name 属性名
         * @param {Mixed} value 属性值
         */
        set: function (name, value) {
            var method = this['set' + lib.pascalize(name)];

            if (typeof method === 'function') {
                return method.call(this, value);
            }

            var property = {};
            property[name] = value;
            this.setProperties(property);
        },

        /**
         * 判断属性新值是否有变化，内部用于`setProperties`方法
         *
         * @param {string} propertyName 属性名称
         * @param {Mixed} newValue 新值
         * @param {Mixed} oldValue 旧值
         * @return {boolean}
         * @protected
         */
        isPropertyChanged: function (propertyName, newValue, oldValue) {
            // 默认实现将值和当前新值进行简单比对
            return oldValue !== newValue;
        },

        /**
         * 批量设置控件的属性值
         *
         * @param {Object} properties 属性值集合
         * @return {Object} `properties`参数中确实变更了的那些属性
         */
        setProperties: function (properties) {
            // 只有在渲染以前（就是`initOptions`调用的那次）才允许设置id
            if (!this.stage) {
                if (properties.hasOwnProperty('id')) {
                    this.id = properties.id;
                }

                if (properties.hasOwnProperty('group')) {
                    this.group = properties.group;
                }

                if (properties.hasOwnProperty('skin')) {
                    this.skin = properties.skin;
                }
            }

            delete properties.id;
            delete properties.group;
            delete properties.skin;

            // 吞掉`viewContext`的设置，逻辑都在`setViewContext`中
            if (properties.hasOwnProperty('viewContext')) {
                this.setViewContext(properties.viewContext);
                delete properties.viewContext;
            }

            // 几个状态选项是要转为`boolean`的
            if (this.hasOwnProperty('disabled')) {
                this.disabled = !!this.disabled;
            }
            if (this.hasOwnProperty('hidden')) {
                this.hidden = !!this.hidden;
            }

            var changes = [];
            var changesIndex = {};
            for (var key in properties) {
                if (properties.hasOwnProperty(key)) {
                    var newValue = properties[key];
                    var getterMethodName =
                        'get' + lib.pascalize(key) + 'Property';
                    var oldValue = this[getterMethodName]
                        ? this[getterMethodName]()
                        : this[key];

                    var isChanged =
                        this.isPropertyChanged(key, newValue, oldValue);
                    if (isChanged) {
                        this[key] = newValue;
                        var record = {
                            name: key,
                            oldValue: oldValue,
                            newValue: newValue
                        };
                        changes.push(record);
                        changesIndex[key] = record;
                    }
                }
            }

            if (changes.length && this.helper.isInStage('RENDERED')) {
                this.repaint(changes, changesIndex);
            }

            return changesIndex;

        },

        /**
         * 设置控件的所属视图环境
         *
         * @param {ViewContext} viewContext 视图环境
         */
        setViewContext: function (viewContext) {
            // 为了避免程序流转，降低性能，以及死循环，做一次判断
            var oldViewContext = this.viewContext;
            if (oldViewContext === viewContext) {
                return;
            }

            // 从老视图环境中清除
            if (oldViewContext) {
                this.viewContext = null;
                oldViewContext.remove(this);
            }

            // 注册到新视图环境
            this.viewContext = viewContext;
            viewContext && viewContext.add(this);

            // 切换子控件的视图环境
            var children = this.children;
            if (children) {
                for (var i = 0, len = children.length; i < len; i++) {
                    children[i].setViewContext(viewContext);
                }
            }

            // 在主元素上加个属性，以便找到`ViewContext`
            if (this.viewContext && this.helper.isInStage('RENDERED')) {
                this.main.setAttribute(
                    ui.getConfig('viewContextAttr'),
                    this.viewContext.id
                );
            }
        },

        /**
         * 设置控件禁用状态
         */
        setDisabled: function (disabled) {
            this[disabled ? 'disable' : 'enable']();
        },

        /**
         * 设置控件状态为禁用
         */
        disable: function () {
            this.addState('disabled');
        },

        /**
         * 设置控件状态为启用
         */
        enable: function () {
            this.removeState('disabled');
        },

        /**
         * 判断控件是否不可用
         *
         * @return {boolean}
         */
        isDisabled: function () {
            return this.hasState('disabled');
        },

        /**
         * 设置控件状态为可见
         */
        show: function () {
            this.removeState('hidden');
        },

        /**
         * 设置控件状态为不可见
         */
        hide: function () {
            this.addState('hidden');
        },

        /**
         * 切换控件可见状态
         */
        toggle: function () {
            this[this.isHidden() ? 'show' : 'hide']();
        },

        /**
         * 判断控件是否不可见
         *
         * @return {boolean}
         */
        isHidden: function () {
            return this.hasState('hidden');
        },

        /**
         * 添加控件状态
         *
         * 调用该方法同时会让状态对应的属性变为`true`，
         * 从而引起该属性对应的`painter`的执行
         *
         * 状态对应的属性名是指将状态名去除横线并以`camelCase`形式书写的名称，
         * 如`align-left`对应的属性名为`alignLeft`
         *
         * @param {string} state 状态名
         */
        addState: function (state) {
            if (!this.hasState(state)) {
                this.currentStates[state] = true;
                this.helper.addStateClasses(state);
                var properties = {};
                var statePropertyName = state.replace(
                    /-(\w)/,
                    function (m, c) {
                        return c.toUpperCase();
                    }
                );
                properties[statePropertyName] = true;
                this.setProperties(properties);
            }
        },

        /**
         * 移除控件状态
         *
         * 调用该方法同时会让状态对应的属性变为`false`，
         * 从而引起该属性对应的`painter`的执行
         *
         * 状态对应的属性名是指将状态名去除横线并以`camelCase`形式书写的名称，
         * 如`align-left`对应的属性名为`alignLeft`
         *
         * @param {string} state 状态名
         */
        removeState: function (state) {
            if (this.hasState(state)) {
                this.currentStates[state] = false;
                this.helper.removeStateClasses(state);
                var properties = {};
                var statePropertyName = state.replace(
                    /-(\w)/,
                    function (m, c) {
                        return c.toUpperCase();
                    }
                );
                properties[statePropertyName] = false;
                this.setProperties(properties);
            }
        },

        /**
         * 切换控件指定状态
         *
         * 该方法根据当前状态调用{@link Control#addState}或
         * {@link Control#removeState}方法，因此同样会对状态对应的属性进行修改
         *
         * @param {string} state 状态名
         */
        toggleState: function (state) {
            var methodName = this.hasState(state)
                ? 'removeState'
                : 'addState';

            this[methodName](state);
        },

        /**
         * 判断控件是否处于指定状态
         *
         * @param {string} state 状态名
         * @return {boolean}
         */
        hasState: function (state) {
            return !!this.currentStates[state];
        },

        /**
         * 添加子控件
         *
         * @param {Control} control 子控件实例
         * @param {string} [childName] 子控件名
         */
        addChild: function (control, childName) {
            childName = childName || control.childName;

            if (control.parent) {
                control.parent.removeChild(control);
            }

            this.children.push(control);
            control.parent = this;

            if (childName) {
                control.childName = childName;
                this.childrenIndex[childName] = control;
            }

            // 将子视图环境设置与父控件一致
            if (this.viewContext !== control.viewContext) {
                control.setViewContext(this.viewContext);
            }
        },

        /**
         * 移除子控件
         *
         * @param {Control} control 子控件实例
         */
        removeChild: function (control) {
            // 从控件树容器中移除
            var children = this.children;
            var len = children.length;
            while (len--) {
                if (children[len] === control) {
                    children.splice(len, 1);
                }
            }

            // 从具名子控件索引中移除
            var childName = control.childName;
            if (childName) {
                this.childrenIndex[childName] = null;
            }

            control.parent = null;
        },

        /**
         * 移除全部子控件
         *
         * @deprecated 将在4.0中移除，使用{@link Helper#disposeChildren}代替
         */
        disposeChildren: function () {
            var children = this.children.slice();
            for (var i = 0; i < children.length; i++) {
                children[i].dispose();
            }
            this.children = [];
            this.childrenIndex = {};
        },

        /**
         * 获取子控件
         *
         * @param {string} childName 子控件名
         * @return {Control}
         */
        getChild: function (childName) {
            return this.childrenIndex[childName] || null;
        },

        /**
         * 获取子控件，无相关子控件则返回{@link SafeWrapper}
         *
         * @param {string} childName 子控件名
         * @return {Control}
         */
        getChildSafely: function (childName) {
            var child = this.getChild(childName);

            if (!child) {
                child = new SafeWrapper();
                child.childName = childName;
                child.parent = this;
                if (this.viewContext) {
                    child.viewContext = this.viewContext;
                }
            }

            return child;
        },

        /**
         * 批量初始化子控件
         *
         * @param {HTMLElement} [wrap] 容器DOM元素，默认为主元素
         * @param {Object} [options] 初始化的配置参数
         * @param {Object} [options.properties] 属性集合，通过id映射
         * @deprecated 将在4.0中移除，使用{@link Helper#initChildren}代替
         */
        initChildren: function (wrap, options) {
            this.helper.initChildren(wrap, options);
        }
    };

    lib.inherits(Control, EventTarget);

    /*-------------------------------------------Validity----------------------------------------------------*/

    /**
     * 验证信息显示控件
     *
     * @extends Control
     * @constructor
     */
    function ValidityLabel() {
        Control.apply(this, arguments);
    }

    ValidityLabel.prototype.type = 'ValidityLabel';

    /**
     * 创建主元素，默认使用`<label>`元素
     *
     * @return {HTMLElement}
     * @protected
     * @override
     */
    ValidityLabel.prototype.createMain = function () {
        return document.createElement('label');
    };

    /**
     * 初始化参数
     *
     * @param {Object} [options] 输入的参数
     * @protected
     * @override
     */
    ValidityLabel.prototype.initOptions = function (options) {
        var properties =
            u.extend({}, ValidityLabel.defaultProperties, options);
        Control.prototype.initOptions.call(this, properties);
    };

    /**
     * 获取元素的全部class
     *
     * @param {ValidityLabel} label 控件实例
     * @param {string} state 验证状态
     * @ignore
     */
    function getClasses(label, state) {
        var target = label.target;

        var targetHelper = null;
        if (target || label.targetType) {
            var targetContext = {
                type: label.targetType || target.type,
                skin: target && target.skin
            };
            targetHelper = new Helper(targetContext);
        }

        var classes = label.helper.getPartClasses();
        if (targetHelper) {
            classes.push.apply(
                classes,
                targetHelper.getPartClasses('validity-label')
            );
        }
        if (state) {
            classes.push.apply(
                classes,
                label.helper.getPartClasses(state)
            );
            if (targetHelper) {
                classes.push.apply(
                    classes,
                    targetHelper.getPartClasses('validity-label-' + state)
                );
            }
        }
        if ((target && target.isHidden()) || label.isHidden()) {
            classes.push.apply(
                classes,
                label.helper.getStateClasses('hidden')
            );
            if (target) {
                classes.push.apply(
                    classes,
                    target.helper.getPartClasses('validity-label-hidden')
                );
            }
        }
        return classes;
    }

    /**
     * 显示验证信息，可重写
     *
     * @param {string} validState 验证结果
     * @param {string} message 验证信息
     * @param {validator.ValidityLabel} validity 最原始的验证结果对象
     * @protected
     */
    ValidityLabel.prototype.display = function (validState, message, validity) {
        this.main.innerHTML = message;
    };

    /**
     * 重绘
     *
     * @method
     * @protected
     * @override
     */
    ValidityLabel.prototype.repaint = painters.createRepaint(
        Control.prototype.repaint,
        {
            /**
             * @property {Control} target
             *
             * 对应的控件
             */

            /**
             * @property {string} targetType
             *
             * 对应的控件的类型，可覆盖{@link ValidityLabel#target}的`type`属性
             */
            name: ['target', 'targetType'],
            paint: function (label) {
                var validState = label.validity
                    ? label.validity.getValidState()
                    : '';
                var classes = getClasses(label, validState);
                label.main.className = classes.join(' ');
            }
        },
        {
            /**
             * @property {HTMLElement} focusTarget
             *
             * 点击当前标签后获得焦点的元素
             *
             * 此元素如果没有`id`属性，则不会获得焦点
             *
             * 私有属性，仅通过{@link InputControl#getFocusTarget}方法获得
             *
             * @private
             */
            name: 'focusTarget',
            paint: function (label, focusTarget) {
                if (label.main.nodeName.toLowerCase() === 'label') {
                    if (focusTarget && focusTarget.id) {
                        lib.setAttribute(label.main, 'for', focusTarget.id);
                    }
                    else {
                        lib.removeAttribute(label.main, 'for');
                    }
                }
            }
        },
        {
            /**
             * @property {validator.ValidityLabel} validity
             *
             * 验证结果
             */
            name: 'validity',
            paint: function (label, validity) {
                var validState = validity && validity.getValidState();
                var classes = getClasses(label, validState);
                label.main.className = classes.join(' ');

                label.disposeChildren();
                if (validity) {
                    var message = validity.getCustomMessage();
                    if (!message) {
                        var invalidState = u.find(
                            validity.getStates(),
                            function (state) {
                                return !state.getState();
                            }
                        );
                        message = invalidState && invalidState.getMessage();
                    }
                    label.display(validState, message || '', validity);
                    label.helper.initChildren();
                    if (message) {
                        label.show();
                    }
                    else {
                        label.hide();
                    }
                }
                else {
                    label.main.innerHTML = '';
                    label.hide();
                }
            }
        }
    );

    /**
     * 销毁控件
     *
     * @override
     */
    ValidityLabel.prototype.dispose = function () {
        if (this.helper.isInStage('DISPOSED')) {
            return;
        }

        if (this.target) {
            this.target.validityLabel = null;
            this.target = null;
        }
        this.focusTarget = null;

        if (this.main.parentNode) {
            this.main.parentNode.removeChild(this.main);
        }

        Control.prototype.dispose.apply(this, arguments);
    };

    lib.inherits(ValidityLabel, Control);
    main.register(ValidityLabel);

    /*-------------------------------------------InputControl----------------------------------------------------*/

    /**
     * 输入控件基类
     *
     * 输入控件用于表示需要在表单中包含的控件，
     * 其主要提供`getRawValue`和`getValue`方法供获取值
     *
     * 需要注意的是，控件其实并不通过严格的继承关系来判断一个控件是否为输入控件，
     * 只要`getCategory()`返回为`"input"`、`"check"或`"extend"`就认为是输入控件
     *
     * 相比普通控件的 **禁用 / 启用** ，输入控件共有3种状态：
     *
     * - 普通状态：可编辑，值随表单提交
     * - `disabled`：禁用状态，此状态下控件不能编辑，同时值不随表单提交
     * - `readOnly`：只读状态，此状态下控件不能编辑，但其值会随表单提交
     *
     * @extends Control
     * @constructor
     * @param {Object} [options] 初始化参数
     */
    function InputControl(options) {
        options = options ? lib.extend({}, options) : {};
        if (options.main && !options.name) {
            /**
             * @property {string} name
             *
             * 输入控件的名称，用于表单提交时作为键值
             *
             * @readonly
             */
            options.name = options.main.getAttribute('name');
        }
        Control.call(this, options);
    }

    InputControl.prototype = {
        constructor: InputControl,

        /**
         * 指定在哪些状态下该元素不处理相关的DOM事件，
         * 输入控件额外增加`read-only`状态
         *
         * @type {string[]}
         * @protected
         * @override
         */
        ignoreStates: Control.prototype.ignoreStates.concat('read-only'),

        /**
         * 获取控件的分类，默认返回`"input"`以表示为输入控件
         *
         * @return {string}
         * @override
         */
        getCategory: function () {
            return 'input';
        },

        /**
         * 获得应当获取焦点的元素，主要用于验证信息的`<label>`元素的`for`属性设置
         *
         * @return {HTMLElement}
         * @protected
         */
        getFocusTarget: function () {
            return null;
        },

        /**
         * 获取输入控件的值的字符串形式
         *
         * @return {string}
         */
        getValue: function () {
            /**
             * @property {string} value
             *
             * 输入控件的字符串形式的值
             */
            return this.stringifyValue(this.getRawValue());
        },

        /**
         * 设置输入控件的值
         *
         * @param {string} value 输入控件的值
         */
        setValue: function (value) {
            var rawValue = this.parseValue(value);
            this.setRawValue(rawValue);
        },

        /**
         * 获取输入控件的原始值，原始值的格式由控件自身决定
         *
         * @return {Mixed}
         */
        getRawValue: function () {
            /**
             * @property {Mixed} rawValue
             *
             * 输入控件的原始值，其格式由控件自身决定
             */
            return this.rawValue;
        },

        /**
         * 设置输入控件的原始值，原始值的格式由控件自身决定
         *
         * @param {Mixed} rawValue 输入控件的原始值
         */
        setRawValue: function (rawValue) {
            this.setProperties({rawValue: rawValue});
        },

        /**
         * 批量设置控件的属性值
         *
         * @param {Object} properties 属性值集合
         * @override
         */
        setProperties: function (properties) {
            // 当value和rawValue同时存在时，以rawValue为准
            // 否则，将value解析成rawValue
            var value = properties.value;
            delete properties.value;
            if (value != null && properties.rawValue == null) {
                properties.rawValue = this.parseValue(value);
            }

            if (this.hasOwnProperty('readOnly')) {
                this.readOnly = !!this.readOnly;
            }

            return Control.prototype.setProperties.call(this, properties);
        },

        /**
         * 重渲染
         *
         * @method repaint
         * @protected
         * @override
         */
        repaint: helper.createRepaint(
            Control.prototype.repaint,
            {
                name: 'disabled',
                paint: function (control, value) {
                    var nodeName = control.main.nodeName.toLowerCase();
                    if (nodeName === 'input'
                        || nodeName === 'select'
                        || nodeName === 'textarea'
                    ) {
                        control.main.disabled = value;
                    }
                }
            },
            {
                /**
                 * @property {boolean} readOnly
                 *
                 * 是否只读
                 *
                 * 只读状态下，控件通过用户操作不能修改值，但值随表单提交
                 */
                name: 'readOnly',
                paint: function (control, value) {
                    var method = value ? 'addState' : 'removeState';
                    control[method]('read-only');
                    var nodeName = control.main.nodeName.toLowerCase();
                    if (nodeName === 'input'
                        || nodeName === 'select'
                        || nodeName === 'textarea'
                    ) {
                        control.main.readOnly = value;
                    }
                }
            },
            {
                name: 'hidden',
                paint: function (control, hidden) {
                    // 需要同步验证信息的样式
                    var validityLabel = control.getValidityLabel(true);
                    if (validityLabel) {
                        var classPrefix = main.getConfig('uiClassPrefix');
                        var classes = [].concat(
                            classPrefix + '-hidden',
                            classPrefix + '-validity-hidden',
                            helper.getPartClasses(
                                control, 'validity-hidden')
                        );
                        var method = control.isHidden()
                            ? 'addClasses'
                            : 'removeClasses';
                        lib[method](validityLabel, classes);
                    }
                }

            }
        ),

        /**
         * 将值从原始格式转换成字符串，复杂类型的输入控件需要重写此接口
         *
         * @param {Mixed} rawValue 原始值
         * @return {string}
         * @protected
         */
        stringifyValue: function (rawValue) {
            return rawValue != null ? (rawValue + '') : '';
        },

        /**
         * 将字符串类型的值转换成原始格式，复杂类型的输入控件需要重写此接口
         *
         * @param {string} value 字符串值
         * @return {Mixed}
         * @protected
         */
        parseValue: function (value) {
            return value;
        },

        /**
         * 设置控件的只读状态
         *
         * @param {boolean} readOnly 是否只读
         */
        setReadOnly: function (readOnly) {
            readOnly = !!readOnly;
            this[readOnly ? 'addState' : 'removeState']('read-only');
        },

        /**
         * 判读控件是否处于只读状态
         *
         * @return {boolean}
         */
        isReadOnly: function () {
            return this.hasState('read-only');
        },

        /**
         * 获取验证结果的{@link validator.Validity}对象
         *
         * @return {validator.Validity}
         * @fires beforevalidate
         * @fires aftervalidate
         * @fires invalid
         */
        getValidationResult: function () {
            var validity = new Validity();
            var eventArg = {
                validity: validity
            };

            /**
             * @event beforevalidate
             *
             * 在验证前触发
             *
             * @param {validator.Validity} validity 验证结果
             * @member InputControl
             */
            eventArg = this.fire('beforevalidate', eventArg);

            // 验证合法性
            var rules = main.createRulesByControl(this);
            for (var i = 0, len = rules.length; i < len; i++) {
                var rule = rules[i];
                validity.addState(
                    rule.getName(),
                    rule.check(this.getValue(), this)
                );
            }

            // 触发invalid和aftervalidate事件
            // 这两个事件中用户可能会对validity进行修改操作
            // 所以validity.isValid()结果不能缓存
            if (!validity.isValid()) {
                /**
                 * @event invalid
                 *
                 * 在验证结果为错误时触发
                 *
                 * @param {validator.Validity} validity 验证结果
                 * @member InputControl
                 */
                eventArg = this.fire('invalid', eventArg);
            }

            /**
             * @event aftervalidate
             *
             * 在验证后触发
             *
             * @param {validator.Validity} validity 验证结果
             * @member InputControl
             */
            this.fire('aftervalidate', eventArg);

            return validity;
        },

        /**
         * 验证控件，仅返回`true`或`false`
         *
         * @return {boolean}
         * @fires beforevalidate
         * @fires aftervalidate
         * @fires invalid
         */
        checkValidity: function () {
            var validity = this.getValidationResult();
            return validity.isValid();
        },

        /**
         * 验证控件，当值不合法时显示错误信息
         *
         * @return {boolean}
         * @fires beforevalidate
         * @fires aftervalidate
         * @fires invalid
         */
        validate: function () {
            var validity = this.getValidationResult();
            this.showValidity(validity);
            return validity.isValid();
        },

        /**
         * 获取显示验证信息用的元素
         *
         * @param {boolean} [dontCreate=false]
         * 指定在没有找到已经存在的元素的情况下，不要额外创建
         * @return {Validity}
         * 返回一个已经放在DOM正确位置的{@link validator.Validity}控件
         */
        getValidityLabel: function (dontCreate) {
            if (!helper.isInStage(this, 'RENDERED')) {
                return null;
            }

            var label = this.validityLabel
                && this.viewContext.get(this.validityLabel);

            if (!label && !dontCreate) {
                var options = {
                    id: this.id + '-validity',
                    viewContext: this.viewContext
                };
                label = new ValidityLabel(options);
                if (this.main.nextSibling) {
                    var nextSibling = this.main.nextSibling;
                    label.insertBefore(nextSibling);
                }
                else {
                    label.appendTo(this.main.parentNode);
                }
                this.validityLabel = label.id;
            }

            // Adjacent sibling selector not working with dynamically added class in IE7/8
            // Put the class on a parent to force repainting
            if ((lib.ie === 8 || lib.ie === 7) && label) {
                // otakustay赐名
                lib.toggleClass(label.main.parentNode, 'fuck-the-ie');
            }

            return label;
        },

        /**
         * 显示验证信息
         *
         * @param {validator.Validity} validity 验证结果
         */
        showValidity: function (validity) {
            if (this.validity) {
                this.removeState(
                    'validity-' + this.validity.getValidState());
            }
            this.validity = validity;
            this.addState('validity-' + validity.getValidState());

            var label = this.getValidityLabel();

            if (!label) {
                return;
            }

            var properties = {
                target: this,
                focusTarget: this.getFocusTarget(),
                validity: validity
            };
            label.setProperties(properties);
        },

        /**
         * 隐藏验证信息
         */
        hideValidity: function () {
            var validity = new Validity();
            this.showValidity(validity);
        },

        /**
         * 直接显示验证消息
         *
         * @param {string} validState 验证状态，通常未通过验证为`"invalid"`
         * @param {string} message 待显示的信息
         */
        showValidationMessage: function (validState, message) {
            message = message || '';
            var validity = new Validity();
            validity.setCustomValidState(validState);
            validity.setCustomMessage(message);
            this.showValidity(validity);
        },

        /**
         * 销毁控件
         *
         * @override
         */
        dispose: function () {
            if (helper.isInStage(this, 'DISPOSED')) {
                return;
            }

            var validityLabel = this.getValidityLabel(true);
            if (validityLabel) {
                validityLabel.dispose();
            }
            Control.prototype.dispose.apply(this, arguments);
        }
    };

    lib.inherits(InputControl, Control);

    /*-----------------------------------------------------------------------------------------------*/

    /**
     * Schedule控件
     *
     * @param {Object=} options 初始化参数
     * @constructor
     */
    function Schedule(options) {
        InputControl.apply(this, arguments);
    }


    /**
     * 挂接到Schedule上以便进行全局替换
     */
    Schedule.defaultProperties = {

        //图例说明文本
        helpSelectedText: '投放时间段',
        helpText: '暂停时间段',

        //星期checkbox显示文本
        dayTexts: [
            '星期一',
            '星期二',
            '星期三',
            '星期四',
            '星期五',
            '星期六',
            '星期日'
        ],

        //快捷方式配置
        shortcut: shortcut()
    };

    /**
     * 日程快捷方式
     */
    function shortcut() {

        function selectByDayStates(dayStates) {

            var value = [];
            for (var i = 0; i < 7 && i < dayStates.length; i++) {

                value[i] = [];

                for (var j = 0; j < 24; j++) {

                    value[i][j] = dayStates[i];
                }
            }
            return value;
        }

        return [
            {
                text: '全周投放',
                tip: '周一到周日全天投放',
                getValue: function () {
                    return selectByDayStates([1, 1, 1, 1, 1, 1, 1]);
                }
            },
            {
                text: '周一到周五投放',
                tip: '周一到周五全天投放',
                getValue: function () {
                    return selectByDayStates([1, 1, 1, 1, 1, 0, 0]);
                }
            },
            {
                text: '周末投放',
                tip: '周六、周日全天投放',
                getValue: function () {
                    return selectByDayStates([0, 0, 0, 0, 0, 1, 1]);
                }
            }
        ];
    }

    /**
     * 初始化视图的值
     * @inner
     */
    function initValue() {
        //如果没有初始值，默认全部设为0，即全部选中
        var value = [];
        for (var i = 0; i < 7; i++) {
            var lineValue = [];
            value.push(lineValue);

            for (var j = 0; j < 24; j++) {

                lineValue.push(0);
            }
        }

        return value;
    }

    /**
     * 获取部件的css class
     * @param  {Schedule} schedule Schedule实例
     * @inner
     */
    function getClass(schedule, part) {

        return helper.getPartClasses(schedule, part).join(' ');
    }

    /**
     * 获取部件的id
     * @param  {Schedule} schedule Schedule实例
     * @inner
     */
    function getId(schedule, part) {

        return helper.getId(schedule, part);
    }

    /**
     * 获取快捷方式的html
     * @param  {Schedule} schedule Schedule实例
     * @inner
     */
    function getShortcutHtml(schedule) {
        var me = schedule;
        var html = [];

        var tpl = ''
            + '<span class="${clazz}" data-item="${index}"'
            + ' >${text}</span>';

        //说明标题拼接
        var textClass = getClass(me, 'shortcut-text-item');

        html.push('<span class="' + textClass + '">快速设定：</span>');


        var shortcuts = me.shortcut;
        var clazz = getClass(me, 'shortcut-item');

        //shortcut拼接
        for (var i = 0, len = shortcuts.length; i < len; i++) {
            var shortcut = shortcuts[i];
            html.push(
                lib.format(
                    tpl,
                    {
                        clazz: clazz,
                        text: shortcut.text,
                        index: i
                    }
                ));
        }

        return html.join('');
    }

    /**
     * 初始化body
     * @param  {Schedule} schedule Schedule实例
     * @inner
     */
    function initBody(schedule) {
        lib.g(getId(schedule, 'body')).innerHTML = ''
            + getBodyTimeHtml(schedule) // 拼接html: 头部time列表
            + getBodyDayHtml(schedule) // 拼接html: 星期列表
            + getBodyItemHtml(schedule); // 拼接html: 时间item列表
    }

    /**
     * 拼接html: body 头部time列表
     * @param  {Schedule} schedule Schedule实例
     * @inner
     */
    function getBodyTimeHtml(schedule) {
        var me = schedule;
        var html = [];

        var timelineClass = getClass(me, 'time-line');
        var bodyHeadId = getId('body-head');
        html.push(
            '<div class="', timelineClass, '" id="',
            bodyHeadId + '">'
        );

        var timeHClass = getClass(me, 'time-head');
        for (var i = 0; i <= 24; i = i + 2) {
            html.push(
                '<div class="', timeHClass,
                '" data-time="', i, '" ',
                'id="', getId(me, 'time-head' + i), '">',
                i,
                '</div>'
            );
        }

        html.push('</div>');

        return html.join('');
    }

    /**
     * 拼接html: body 星期列表
     * @param  {Schedule} schedule Schedule实例
     * @inner
     */
    function getBodyDayHtml(schedule) {
        var me = schedule;
        var html = [];

        var dayHClass = getClass(me, 'day-head');
        var dayHId = getId(me, 'day-head');
        html.push('<div id="', dayHId, '" class="', dayHClass, '">');

        var dayClass = getClass(me, 'day');
        var dayTpl = ''
            + '<div class="' + dayClass + '">'
            + '<input type="checkbox" id="${dayId}" value="${value}">'
            + '&nbsp;<label for="${dayId}">${dayWord}</label>'
            + '</div>';

        var dayTexts = me.dayTexts;
        for (var i = 0; i < 7; i++) {
            html.push(
                lib.format(
                    dayTpl,
                    {
                        dayWord: dayTexts[i],
                        dayId: getId(me, 'line-state' + i),
                        value: i
                    }
                )
            );
        }

        html.push('</div>');

        return html.join('');

    }

    /**
     * 拼接html: body 时间item列表
     * @param  {Schedule} schedule Schedule实例
     * @inner
     */
    function getBodyItemHtml(schedule) {
        var me = schedule;
        var html = [];

        var timeTpl = ''
            + '<div class="${timeClass}"'
            + ' id="${itemId}"'
            + ' data-day="${dayIndex}"'
            + ' data-time-item="1"'
            + ' data-time="${timeIndex}">'
            + '</div>';

        var timeBClass = getClass(me, 'time-body');
        var timeBId = getId(me, 'time-body');
        html.push('<div id="', timeBId, '" class="', timeBClass, '">');

        //7天
        var lineClass = getClass(me, 'line');
        for (var i = 0; i < 7; i++) {

            var lineId = getId(me, 'line' + i);
            html.push(
                '<div class="', lineClass, '" id="', lineId, '">'
            );

            //24小时
            for (var j = 0; j < 24; j++) {

                var itemId = getId(me, 'time_' + i + '_' + j);

                html.push(
                    lib.format(
                        timeTpl,
                        {
                            itemId: itemId,
                            timeClass: getClass(me, 'time'),
                            dayIndex: i,
                            timeIndex: j
                        }
                    )
                );
            }

            html.push('</div>');
        }

        html.push('</div>');

        return html.join('');
    }

    /**
     * 重绘view区域
     * @param  {Schedule} schedule Schedule实例
     * @inner
     */
    function repaintView(schedule, value) {
        var me = schedule;
        var selectedClass = helper.getPartClasses(me, 'time-selected');
        var hoverClass = helper.getPartClasses(me, 'time-hover');

        for (var i = 0; i < 7; i++) {
            var statusArr = [];
            //item dom
            var lineEl = lib.g(getId(me, 'line' + i));

            //去掉每行的连续选择遮罩层
            removeSelectedLineCoverTip(schedule, lineEl);

            for (var j = 0; j < 24; j++) {

                var item = lib.g(getId(me, 'time_' + i + '_' + j));
                var val = value[i][j];

                //根据value,设置item的选中状态
                if (val) {

                    lib.addClasses(item, selectedClass);
                } else {

                    lib.removeClasses(item, selectedClass);
                }

                lib.removeClasses(item, hoverClass);
                statusArr.push(val);
            }
            //根据每周的value, 创建连续选中遮罩
            createSelectedLineCoverTip(me, statusArr, lineEl, i);
        }
    }

    /**
     * 根据每周的value, 创建连续选中遮罩
     * @param  {Schedule} schedule Schedule实例
     * @param  {Array.<string>}  arr 星期index（参数）的每天的value值
     * @param  {HTMLElement} parent item父元素
     * @param  {number} 星期索引
     * @inner
     */
    function createSelectedLineCoverTip(schedule, arr, parent, index) {
        var me = schedule;
        var i = index;

        //将当前星期的checkbox先初始化为不选中
        var checkInput = lib.g(getId(me, 'line-state' + i));
        checkInput.checked = false;

        //对于连续选中大于3天的进行遮罩处理
        var patt = /1{3,}/g;
        var statusStr = arr.join('');
        var result;
        var coverClass = getClass(me, 'continue-covertimes');
        var coverTpl = ''
            + '<div class="${coverClass}">'
            + '<strong>${text}</strong>'
            + '</div>';

        while ((result = patt.exec(statusStr)) != null) {
            var length = result[0].length;
            var start = result.index;
            var end = start + length;

            var coverDiv = document.createElement('aside');
            var cssStyle = ';width:' + length * 25
                + 'px;top:0;left:' + start * 25 + 'px;';

            //设置星期checkbox的选中值
            checkInput.checked = length === 24 ? true : false;

            coverDiv.setAttribute('data-start-time', start);
            coverDiv.setAttribute('data-end-time', end);
            coverDiv.setAttribute('data-day', i);
            coverDiv.className = coverClass;
            coverDiv.style.cssText += cssStyle;

            coverDiv.innerHTML = lib.format(
                coverTpl,
                {
                    start: start,
                    end: end,
                    text: length === 24
                        ? '全天投放' : start + ':00-' + end + ':00',
                    coverClass: getClass(me, 'covertimes-tip')
                }
            );

            parent.appendChild(coverDiv);

            //挂载事件
            helper.addDOMEvent(
                me,
                coverDiv,
                'mouseover',
                lib.curry(coverTipOverHandler, coverDiv)
            );
            helper.addDOMEvent(
                me,
                coverDiv,
                'mouseout',
                lib.curry(coverTipOutHandler, coverDiv)
            );
        }
    }

    /**
     * coverTip command hanlder
     * 遮罩的hover 事件句柄
     *
     */
    function coverTipOverHandler(element,e) {
        element.style.opacity = '0';
        element.style.cursor = 'pointer';
    }
    function coverTipOutHandler(element,e) {
        element.style.opacity = '0.5';
    }

    /**
     * 去掉每行的连续选择遮罩层
     * @param  {Schedule} schedule Schedule实例
     * @inner
     */
    function removeSelectedLineCoverTip(schedule, parent) {

        var removeDiv = parent.getElementsByTagName('aside');

        var len = removeDiv.length;
        while (len) {
            var item = removeDiv[0];

            if (item.getAttribute('data-day') != null) {
                helper.clearDOMEvents(schedule, item);
                parent.removeChild(item);
            }
            len--;
        }
    }

    /**
     * 设置tip遮罩的位置
     * @param  {Schedule} schedule
     * @param  {string} tipId    要显示的tip Id
     * @param  {Object} mousepos 当前鼠标的位置
     * @param  {string} tipText  要显示的内容
     */
    function showPromptTip(schedule, tipId, mousepos, tipText) {
        var me = schedule;

        tipId = tipId || getId(me, 'tip');
        var tipElement = lib.g(tipId);

        if (tipElement) {

            tipElement.style.top = mousepos.y + 'px';
            tipElement.style.left = mousepos.x + 'px';
            tipElement.innerHTML = tipText;
        }
        else {
            var cssStyle = ''
                + ';position:absolute;z-index:5000;background:#fff6bd;top:'
                + mousepos.y + 'px;left:' + mousepos.x + 'px;display:none;';

            var tipClass = getClass(me, 'shortcut-item-tip');

            tipElement = document.createElement('div');
            tipElement.style.cssText = cssStyle;
            tipElement.id = tipId;
            tipElement.className = tipClass;

            tipElement.innerHTML = tipText;
            document.body.appendChild(tipElement);

            //记录下来，以便dispose的时候清除
            me.followTip[tipId] = tipElement;
        }

        //添加setTimeout,防止拖动的时候闪耀
        me.tipElementTime = setTimeout(function () {

            tipElement.style.display = 'block';
        }, 100);

        return tipElement;
    }

    /**
     * 隐藏tip遮罩
     * @param  {Schedule} schedule
     * @param  {String} tipId    要显示的tip Id
     */
    function hidePromptTip(schedule, tipId) {

        clearTimeout(schedule.tipElementTime);

        var tip = lib.g(tipId);
        tip && (tip.style.display = 'none');
    }

    /**
     * dayWord click handle
     * 点击星期checkbox的处理函数
     *
     */
    function dayClickHandler(e) {
        var target = lib.event.getTarget(e);

        if (target.nodeName.toLowerCase() !== 'input') {
            return;
        }
        //禁用状态下，功能不可用
        if (this.disabled) {
            return false;
        }

        var me = this;
        var dom = target;
        var dayIndex = parseInt(dom.value, 10);
        var dayState = dom.checked;

        var rawValueCopy = rawValueClone(me.rawValue);

        var timeValue = rawValueCopy[dayIndex];

        for (var i = 0, len = timeValue.length; i < len; i++) {

            timeValue[i] = dayState ? 1 : 0;

        }

        me.setRawValue(rawValueCopy);

    }

    /**
     * shortcut click handle
     * 点击shortcut的处理函数
     *
     * @param  {Object} arg 选项
     */
    function shortcutClickHandler(e) {
        var target = lib.event.getTarget(e);

        if (!target || !lib.hasAttribute(target, 'data-item')) {
            return;
        }

        //禁用状态下，功能不可用
        if (this.disabled) {
            return;
        }

        var index = target.getAttribute('data-item');

        var func = this.shortcut[index].getValue;
        typeof func === 'function' && func.call(this);

        var rawValue;

        if (typeof func === 'function') {
            rawValue = func.call(this);
        }
        else {
            rawValue = func;
        }

        this.setRawValue(rawValue);

    }

    /**
     * 快捷方式区域的mousemove的处理函数
     *
     * @inner
     */
    function shortcutMoveHandler(e) {
        var target = lib.event.getTarget(e);

        if (!target || !target.getAttribute('data-item')) {
            return;
        }

        //禁用状态下，功能不可用
        if (this.disabled) {
            return false;
        }

        var element = target;

        var me = this;

        //获取鼠标位置
        lib.event.getMousePosition(e);

        var mousepos = {};
        mousepos.y = e.pageY + 20;
        mousepos.x = e.pageX + 10;

        var dom = element;

        var index = dom.getAttribute('data-item');
        var tipId = getId(me, 'shortcut-item') + index;

        setTimeout(function () {
            var tipElement = lib.g(tipId);

            if (tipElement) {

                tipElement.style.top = mousepos.y + 'px';
                tipElement.style.left = mousepos.x + 'px';
            }

        }, 0);
    }

    /**
     * 快捷方式区域的mouseover mouseout的处理函数
     *
     * @inner
     */
    function shortcutOverOutHandler(isOver, e) {
        var target = lib.event.getTarget(e);

        if (!target || !target.getAttribute('data-item')) {

            return;
        }

        //禁用状态下，功能不可用
        if (this.disabled) {
            return false;
        }

        var element = target;

        //获取鼠标位置
        lib.event.getMousePosition(e);

        var mousepos = {};
        mousepos.y = e.pageY + 20;
        mousepos.x = e.pageX + 10;


        var me = this;

        var dom = element;

        var index = dom.getAttribute('data-item');
        var tipId = getId(me, 'shortcut-item') + index;

        //构建并获取tip
        var clazz = helper.getPartClasses(me, 'shortcut-item-hover');

        if (isOver) {
            lib.addClasses(dom, clazz);

            var tipText = me.shortcut[index].tip;
            showPromptTip(me, tipId, mousepos, tipText);
        }
        else {
            lib.removeClasses(dom, clazz);
            hidePromptTip(me, tipId);
        }
    }

    var timeTipTpl = ''
        + '<div id="${timeId}" class="${timeClass}">${time}</div>'
        + '<div id="${textId}" class="${textClass}">${text}</div>';

    /**
     * timeItem mouseover handler
     * 时间的mouseover的处理函数
     *
     */
    function timeOverHandler(e) {
        var target = lib.event.getTarget(e);

        if (!target || !target.getAttribute('data-time-item')) {
            return;
        }

        //禁用状态下，功能不可用
        if (this.disabled) {
            return false;
        }

        var element = target;

        //添加hover class
        lib.addClasses(
            element,
            helper.getPartClasses(this, 'time-hover')
        );

        //获取鼠标位置
        lib.event.getMousePosition(e);
        var mousepos = {};
        mousepos.y = e.pageY + 20;
        mousepos.x = e.pageX + 10;

        var me = this;

        //获取当前元素所代表的时间
        var time = parseInt(element.getAttribute('data-time'), 10);
        var day = parseInt(element.getAttribute('data-day'), 10);

        //创立并显示提示tip
        var tipText = lib.format(timeTipTpl,
            {
                time: '<strong>' + time
                + ':00</strong>&nbsp;—&nbsp;<strong>'
                + (time + 1) + ':00</strong>',
                text: '点击/拖动鼠标选择',
                timeId: getId(me, 'timeitem-tip-head'),
                textId: getId(me, 'timeitem-tip-body'),
                timeClass: getClass(me, 'timeitem-tip-head'),
                textClass: getClass(me, 'timeitem-tip-body')
            }
        );
        var tipId = getId(me, 'timeitem-tip');

        showPromptTip(me, tipId, mousepos, tipText);


        //重新计算所有遮罩层的显示
        var timebody = lib.g(getId(me, 'time-body'));
        var timeCovers = timebody.getElementsByTagName('aside');

        for (var i = 0, len = timeCovers.length; i < len; i++) {
            var item = timeCovers[i];
            var startCT =
                parseInt(item.getAttribute('data-start-time'), 10);
            var endCT =
                parseInt(item.getAttribute('data-end-time'), 10);
            var coverDay =
                parseInt(item.getAttribute('data-day'), 10);

            if (time >= startCT
                && time < endCT
                && day === coverDay) {
                item.style.display = 'none';
            }
            else {
                item.style.display = 'block';
            }
        }
    }

    /**
     * timeItem mouseout handler
     * 时间的mouseout的处理函数
     *
     */
    function timeOutHandler(e) {
        var target = lib.event.getTarget(e);

        if (!target || !target.getAttribute('data-time-item')) {
            return;
        }

        //禁用状态下，功能不可用
        if (this.disabled) {
            return false;
        }

        //移除hover效果
        lib.removeClasses(
            target,
            helper.getPartClasses(this, 'time-hover')
        );

        //隐藏tip
        hidePromptTip(this, getId(this, 'timeitem-tip'));
    }

    var getTimeBodyMoveHandler; //drag mousemove的句柄
    var getTimeBodyUpHandler; //drag mouseup的句柄


    /**
     * drag时 mousedown的事件处理函数
     */
    function timeBodyDownHandler(e) {
        //禁用状态下，功能不可用
        if (this.disabled) {
            return false;
        }
        var me = this;
        var doc = document;


        getTimeBodyMoveHandler = lib.bind(timeBodyMoveHandler, me);
        getTimeBodyUpHandler = lib.bind(timeBodyUpHandler, me);

        lib.on(doc, 'mousemove', getTimeBodyMoveHandler);
        lib.on(doc, 'mouseup', getTimeBodyUpHandler);


        //记录鼠标位置
        lib.event.getMousePosition(e);
        this.dragStartPos = {x: e.pageX, y: e.pageY};


        // 鼠标拖拽效果
        // 为了防止在控件渲染后，位置变动导致计算错误，所以每次mousedown
        // 位置都计算一遍
        var timebody = lib.g(getId(me, 'time-body'));
        me.dragRange = [];

        var timebodyTop = lib.getOffset(timebody).top;
        var timebodyLeft = lib.getOffset(timebody).left;
        me.dragRange.push(timebodyTop);
        me.dragRange.push(timebodyLeft + timebody.offsetWidth);
        me.dragRange.push(timebodyTop + timebody.offsetHeight);
        me.dragRange.push(timebodyLeft);


        //添加兼容设置
        ondragHuck(timebody);

        // 显示follow区域
        var cellPos = getTragTimeCellPos(this,
            {x: e.pageX, y: e.pageY}
        );

        //hock ie下drag快速移动有时不执行mouseout, 此处隐藏tip
        var tipId = getId(me, 'timeitem-tip');
        lib.g(tipId) && (lib.g(tipId).style.display = 'none');

        //渲染鼠标跟随div
        repaintFollowEle(this, cellPos);
    }

    /**
     * drag时 mousemove的事件处理函数
     */
    function timeBodyMoveHandler(e) {
        //记录鼠标位置
        lib.event.getMousePosition(e);

        //计算当前显示区域
        var cellPos = getTragTimeCellPos(this,
            {x: e.pageX, y: e.pageY}
        );

        //渲染鼠标跟随div
        repaintFollowEle(this, cellPos);

    }

    /**
     * drag时 mouseup的事件处理函数
     */
    function timeBodyUpHandler(e) {
        var me = this;

        //清除兼容设置
        offDragHuck(lib.g(getId(me, 'time-body')));

        //隐藏鼠标跟随div
        var followEle = lib.g(getId(me, 'follow-item'));
        followEle.style.display = 'none';

        //记录鼠标位置
        lib.event.getMousePosition(e);

        //为了修正，up的时候再重新计算下位置
        var cellPos = getTragTimeCellPos(me,
            {x: e.pageX, y: e.pageY}
        );

        //hack ie8下重新渲染遮罩层的时候会跳动，发现是setCapture的原因
        //此处使用setTimeout，使其跳出setCapture的范围
        setTimeout(function () {
            setSelectedAreaValue(me, cellPos);
        }, 10);

        //卸载事件
        var doc = document;
        lib.un(doc, 'mousemove', getTimeBodyMoveHandler);
        lib.un(doc, 'mouseup', getTimeBodyUpHandler);
    }

    /**
     * drag后，重绘选中的值
     * @param {Schedule} schedule
     */
    function setSelectedAreaValue(schedule, cellPos) {

        var me = schedule;

        var startcell = cellPos.startcell;
        var endcell = cellPos.endcell;

        var minXCell = Math.min(startcell.x, endcell.x);
        var minYCell = Math.min(startcell.y, endcell.y);
        var maxXCell = Math.max(startcell.x, endcell.x);
        var maxYCell = Math.max(startcell.y, endcell.y);

        var rawValueCopy = rawValueClone(me.rawValue);

        for (var i = minYCell; i <= maxYCell; i++) {
            for (var j = minXCell; j <= maxXCell; j++) {

                if (rawValueCopy[i][j]) {
                    rawValueCopy[i][j] = 0;
                }
                else {
                    rawValueCopy[i][j] = 1;
                }

            }
        }

        me.setRawValue(rawValueCopy);
    }

    /**
     * 获取选择区域的开始和结束配置
     * @param  {Schedule} schedule
     * @param  {Object} mousepos 当前的鼠标位置
     * @return {Object} 选择区域的开始和结束配置
     */
    function getTragTimeCellPos(schedule, mousepos) {
        var me = schedule;
        var timeBodyPos = me.dragRange;
        var dragStartPos = me.dragStartPos;
        var rangePos = {};

        //计算拖动遮罩层的结束鼠标点
        if (mousepos.x <= timeBodyPos[1]
            && mousepos.x >= timeBodyPos[3]) {
            rangePos.x = mousepos.x;
        }
        else {
            rangePos.x = mousepos.x - dragStartPos.x < 0
                ? timeBodyPos[3] : timeBodyPos[1];
        }

        if (mousepos.y <= timeBodyPos[2]
            && mousepos.y >= timeBodyPos[0]) {
            rangePos.y = mousepos.y;
        }
        else {
            rangePos.y = mousepos.y - dragStartPos.y < 0
                ? timeBodyPos[0] : timeBodyPos[2];
        }

        var cellrange = {startcell: {}, endcell: {}};
        //计算拖动遮罩层覆盖区域位置
        cellrange.startcell.x =
            Math.floor((dragStartPos.x - me.dragRange[3]) / 25);
        cellrange.startcell.y =
            Math.floor((dragStartPos.y - me.dragRange[0]) / 25);
        cellrange.endcell.x =
            Math.floor((rangePos.x - me.dragRange[3]) / 25);
        cellrange.endcell.y =
            Math.floor((rangePos.y - me.dragRange[0]) / 25);

        if (cellrange.endcell.x >= 23) {
            cellrange.endcell.x = 23;
        }
        if (cellrange.endcell.y >= 6) {
            cellrange.endcell.y = 6;
        }

        return cellrange;
    }

    /**
     * drag时的鼠标跟随层的渲染方法
     * @param {Schedule} schedule
     * @param {Object} cellPos  选择区域的开始和结束配置
     */
    function repaintFollowEle(schedule, cellPos) {
        var me = schedule;

        var followEleId = getId(schedule, 'follow-item');
        var followEle = lib.g(followEleId);
        if (!followEle) {
            followEle = document.createElement('div');
            followEle.className = getClass(me, 'follow-item');
            followEle.id = followEleId;
            lib.g(getId(me, 'time-body')).appendChild(followEle);
        }


        var startcell = cellPos.startcell;
        var endcell = cellPos.endcell;
        var startcellX = startcell.x;
        var startcellY = startcell.y;
        var endcellX = endcell.x;
        var endcellY = endcell.y;
        var divTop;
        var divLeft;
        var divHeight;
        var divWidth;


        if (endcellY >= startcellY) {
            divTop = startcellY * 25;
            divHeight = (endcellY - startcellY + 1) * 25 - 2;
        }
        else {
            divTop = endcellY * 25;
            divHeight = (startcellY - endcellY + 1) * 25 - 2;
        }

        if (endcellX >= startcellX) {
            divLeft = startcellX * 25;
            divWidth = (endcellX - startcellX + 1) * 25 - 2;
        }
        else {
            divLeft = endcellX * 25;
            divWidth = (startcellX - endcellX + 1) * 25 - 2;
        }

        var cssStyles = ''
            + ';display:block;'
            + ';width:' + divWidth + 'px'
            + ';height:' + divHeight + 'px'
            + ';top:' + divTop + 'px'
            + ';left:' + divLeft + 'px'
            + ';background:#faffbe';

        followEle.style.cssText += cssStyles;
    }

    /**
     * drag开启时的默认清理函数
     * @param  {HTMLElement} target 当前触发事件的元素
     */
    function ondragHuck(target) {

        var doc = document;

        //修正拖曳过程中页面里的文字会被选中
        lib.on(doc, 'selectstart', dragUnSelect);

        //设置鼠标粘滞
        if (target.setCapture) {
            target.setCapture();
        }
        else if (window.captureEvents) {
            window.captureEvents(window.Event.MOUSEMOVE | window.Event.MOUSEUP);
        }

        //清除鼠标已选择元素
        if (document.selection) {
            document.selection.empty && document.selection.empty();
        }
        else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    }

    /**
     * drag关闭时的清除函数
     * @param  {HTMLElement} target 当前触发事件的元素
     */
    function offDragHuck(target) {

        var doc = document;

        //解除鼠标粘滞
        if (target.releaseCapture) {
            target.releaseCapture();
        }
        else if (window.releaseEvents) {
            window.releaseEvents(window.Event.MOUSEMOVE | window.Event.MOUSEUP);
        }

        lib.un(doc, 'selectstart', dragUnSelect);
    }

    /**
     * drag时清除选择区域的hander
     */
    function dragUnSelect(e) {
        lib.event.preventDefault(e);
    }

    /**
     * 拷贝rawValue一个副本
     * @param  {Array} rawValue 一个二维数组
     */
    function rawValueClone(rawValue) {

        var val = [];

        for (var i = 0, len = rawValue.length; i < len; i++) {

            val.push([].slice.call(rawValue[i], 0));
        }

        return val;
    }

    /**
     * 设置星期checkbox的状态
     * @param {Schedule} schedule 当前控件
     * @param {string} state    状态
     * @param {boolean} value    值
     */
    function setDayCheckboxState(schedule, state, value) {

        var dayHead = lib.g(getId(schedule, 'day-head'));
        var inputs = dayHead.getElementsByTagName('input');

        for (var i = 0, len = inputs.length; i < len; i++) {

            inputs[i][state] = value;
        }
    }

    /**
     * 根据坐标值改变当前值
     * @param {Schedule} schedule 当前控件
     * @param {Boolean} isSelect 是否选中当前坐标
     * @param {Array.<number>}  Coord 当前坐标[星期，小时]
     */
    function dealValueByCoord(schedule, isSelect, coord) {

        var rawValueCopy = rawValueClone(schedule.rawValue);

        for (var i = 0, len = coord.length; i < len; i++) {

            var item = coord[i];

            if (rawValueCopy[item[0]] != null
                && rawValueCopy[item[0]][item[1]] != null) {

                rawValueCopy[item[0]][item[1]] = isSelect ? 1 : 0;
            }
        }

        schedule.setRawValue(rawValueCopy);
    }

    Schedule.prototype = {

        constructor: Schedule,

        /**
         * 控件类型
         * @type {string}
         */
        type: 'Schedule',

        /**
         * 创建控件主元素
         * @override
         * @return {HTMLElement}
         */
        createMain: function (options) {
            if (!options.tagName) {
                return InputControl.prototype.createMain.call(this);
            }
            return document.createElement(options.tagName);
        },

        /**
         * 初始化参数
         *
         * @param {Object=} options 构造函数传入的参数
         * @override
         * @protected
         */
        initOptions: function (options) {
            var properties = {};

            lib.extend(properties, Schedule.defaultProperties, options);

            this.setProperties(properties);

            //检测是否初始化rawValue值，没有则设置为默认
            if (this.rawValue == null) {

                this.setRawValue(initValue());
            }

            //记录当前创建的tip元素
            this.followTip = {};

        },

        /**
         * 初始化DOM结构
         *
         * @protected
         */
        initStructure: function () {
            var me = this;

            this.main.tabIndex = 0;

            var tpl = ''
                + '<input type="hidden" name="${name}" id="${inputId}"/>'
                + '<div class="${bodyClass}" id="${bodyId}"></div>'
                + '<div class="${headClass}">'
                + '<div class="${helpClass}">'
                + '<div class="${helpSelectedClass}"></div>'
                + '<div class="${helpTextClass}">'
                + '${helpSelected}'
                + '</div>'
                + '<div class="${helpUnselectedClass}"></div>'
                + '<div class="${helpTextClass}">${help}</div>'
                + '</div>'
                + '<div class="${shortcutClass}" id="${shortcutId}">'
                + '${shortcutHtml}'
                + '</div>'
                + '</div>';

            this.main.innerHTML = lib.format(
                tpl,
                {
                    name: this.name,
                    inputId: getId(me, 'value-input'),
                    headClass: getClass(me, 'head'),
                    bodyClass: getClass(me, 'body'),
                    helpClass: getClass(me, 'help'),
                    helpSelectedClass: getClass(me, 'help-selected'),
                    helpUnselectedClass: getClass(me, 'help-unselected'),
                    helpTextClass: getClass(me, 'help-text'),
                    shortcutClass: getClass(me, 'shortcut'),
                    shortcutId: getId(me, 'shortcut'),
                    bodyId: getId(me, 'body'), //7
                    helpSelected: me.helpSelectedText,
                    help: me.helpText,
                    shortcutHtml: getShortcutHtml(me)
                }
            );

            initBody(me);
        },

        /**
         * 初始化事件交互
         *
         * @protected
         * @override
         */
        initEvents: function () {
            var timebody = lib.g(getId(this, 'time-body'));
            //绑定拖动drag事件
            this.helper.addDOMEvent(timebody, 'mousedown', timeBodyDownHandler);

            //绑定timebody mouseover事件
            this.helper.addDOMEvent(timebody, 'mouseover', timeOverHandler);

            //绑定timebody mouseout事件
            this.helper.addDOMEvent(timebody, 'mouseout', timeOutHandler);

            //绑定选择星期事件
            this.helper.addDOMEvent(lib.g(getId(this, 'day-head')), 'click', dayClickHandler);

            var shortcut = this.helper.getPart('shortcut');
            //绑定点击shortcut事件
            this.helper.addDOMEvent(shortcut, 'click', shortcutClickHandler);

            //shortcut mouseover
            this.helper.addDOMEvent(shortcut, 'mouseover', lib.curry(shortcutOverOutHandler, true));

            //shortover mouseout
            this.helper.addDOMEvent(shortcut, 'mouseout', lib.curry(shortcutOverOutHandler, false));

            //shortcut mousemove
            this.helper.addDOMEvent(shortcut, 'mousemove', shortcutMoveHandler);
        },

        /**
         * 设值
         *
         * @override
         * @protected
         */
        setProperties: function (properties) {
            var changes = InputControl.prototype.setProperties.call(
                this, properties);

            var rawValueObj = changes.rawValue;

            if (rawValueObj
                && (this.stringifyValue(rawValueObj.oldValue)
                !== this.stringifyValue(rawValueObj.newValue))) {

                this.fire('change', {rawValue: this.rawValue});
            }

        },

        /**
         * 渲染自身
         *
         * @override
         * @protected
         */
        repaint: helper.createRepaint(
            InputControl.prototype.repaint,
            {
                name: 'rawValue',
                paint: function (schedule, rawValue) {

                    //填充hidden input的值
                    var value = schedule.stringifyValue(rawValue);
                    lib.g(getId(schedule, 'value-input')).value =
                        value == null ? '' : value;

                    repaintView(schedule, rawValue);
                }
            },
            {
                name: 'disabled',
                paint: function (schedule, value) {

                    setDayCheckboxState(schedule, 'disabled', value);
                }
            },
            {
                name: 'readonly',
                paint: function (schedule, value) {

                    setDayCheckboxState(schedule, 'readonly', value);
                }
            }
        ),

        /**
         * 将string类型的value转换成原始格式
         *
         * @override
         * @param {string} value 字符串值
         * @return {Array}
         */
        parseValue: function (value) {
            var arr = [];
            var step = 24;

            for (var i = 0, len = value.length; i < len; i = i + step) {
                var inner = value.substring(i, i + step).split('');

                var innerOut = [];

                for (var j = 0; j < inner.length; j++) {

                    innerOut.push(inner[j] - 0);
                }

                arr.push(innerOut);
            }
            return arr;
        },

        /**
         * 将value从原始格式转换成string
         *
         * @override
         *
         * @param {Array} rawValue 原始值
         * @return {string}
         */
        stringifyValue: function (rawValue) {

            var arr = [];

            if (!rawValue) {

                return null;
            }

            for (var i = 0, len = rawValue.length; i < len; i++) {

                arr.push(rawValue[i].join(''));
            }

            return arr.join('');
        },

        /**
         * 设置控件的值，并更新视图
         *
         * @public
         * @param {Array} rawValue 控件的值
         */
        setRawValue: function (rawValue) {

            this.setProperties({rawValue: rawValue});
        },

        /**
         * 获取控件的值
         *
         * @public
         */
        getRawValue: function () {

            return this.rawValue;
        },

        /**
         * 按照坐标选择
         * @param {...Array.<number>}  Coord 当前坐标[星期，小时]
         */
        select: function (coord) {
            dealValueByCoord(this, 1, [].slice.call(arguments));
        },

        /**
         * 取消选择按照坐标
         * @param {...Array.<number>}  Coord 当前坐标[星期，小时]
         */
        unselect: function (coord) {
            dealValueByCoord(this, 0, [].slice.call(arguments));
        },

        /**
         * 销毁释放控件
         */
        dispose: function () {
            helper.beforeDispose(this);

            //清除followTip
            var followTip = this.followTip;
            for (var key in followTip) {

                if (followTip[key]) {

                    document.body.removeChild(followTip[key]);
                }
            }

            helper.dispose(this);
            helper.afterDispose(this);
        }
    };

    lib.inherits(Schedule, InputControl);
    main.register(Schedule);

    /*-----------------------------------------------------------------------------------------------*/
    window.Schedule = main;
})(window);
