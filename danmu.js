
    // 浏览器兼容requestAnimationFrame的方法,支持到IE6
    (function () {
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
                window[vendors[x] + 'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }
    } ());
    /**
     * 一套没有向后端请求数据的字幕方案
     */
    var fontlist,
        screen = document.getElementById("screen"),
        screen_w = screen.offsetWidth,
        screen_h = screen.offsetHeight,
        root_font = document.getElementsByTagName("html")[0].style.fontSize,
        start_time = 0,
        top_array = [5,10,15,20,25,30,35],
        fontpool = [];
        // body_font = GetCurrentStyle(window.document.body, "font-size");
    /**
     * @param text 文本内容
     * @param size 字体大小
     * @param color:"rgb(82,84,91)", start_time 开始时间
     * @param duration 持续时间
     */
    fontlist = [
            { text: "咔咔过过", size: 1.5, color:"rgb(82,84,91)", start_time: 1000, duration: 6000 },
            { text: "打脑壳", size: 2, color:"rgb(82,84,91)", start_time: 1300, duration: 6000 },
            { text: "耙耳朵", size: 1, color:"rgb(82,84,91)", start_time: 1600, duration: 6000 },
            { text: "不醒火", size: 2.5, color:"rgb(82,84,91)", start_time: 2000, duration: 6000 },
            { text: "摆龙门阵", size: 1.5, color:"rgb(82,84,91)", start_time: 3200, duration: 6000 },
            { text: "冲壳子（吹牛）", size: 1, color:"rgb(82,84,91)", start_time: 4000, duration: 6000 },
            { text: "算坛子", size: 1.5, color:"rgb(82,84,91)", start_time: 5500, duration: 6000 },
            { text: "弄归一", size: 1.5, color:"rgb(82,84,91)", start_time: 6500, duration: 6000 },
            { text: "弄巴实", size: 1.5, color:"rgb(82,84,91)", start_time: 8000, duration: 6000 },
            { text: "巴适", size: 1.5, color:"rgb(82,84,91)", start_time: 9500, duration: 6000 }
        ];
    /**
     * 
     * 获取css描述的属性
     * @param {elem} obj 文档对象
     * @param {string} prop css 属性
     * @returns
     */
    function GetCurrentStyle (obj, prop) {  
        // 兼容ie
        if (obj.currentStyle) {        
            return obj.currentStyle[prop];     
        }      
        else if (window.getComputedStyle) {    
            // 兼容Firefox(document.defaultView)    
            return document.defaultView.getComputedStyle (obj,null)[prop];     
        }      
        return null;   
    }
    /**
     * 
     * 
     * @returns
     */
    function rand(){
        var a = Math.random();
        if(a>0.7 || a<0.3) {
            return Math.random();
        }
        return a;
    }
    /**
     * @param {Object} fontmember
     */
    function Text(fontmember) {
        this.width = fontmember.text.length * parseInt(root_font) * fontmember.size;
        this.v = (screen_w + this.width)*1000/(60*fontmember.duration); //每帧移动的距离
        this.show = false;
        var ele = document.createElement("div");
        ele.className = "ele";
        ele.style.cssText = 'left:'+screen_w + 'px;font-size:' + (fontmember.size+Math.random())/2 + 'rem;color:' + fontmember.color + ';bottom:' + (screen_h-parseInt(root_font)*fontmember.size)*rand()+'px;';
        ele.textContent = fontmember.text;
        this.appearance = screen.appendChild(ele);
        console.log(this.appearance);
    }
    Text.prototype.move = function() {
        var _this = this;
        _this.show = true;
        _this.appearance.style.left = parseInt(_this.appearance.style.left) - _this.v +"px";
        if (parseInt(_this.appearance.style.left) < - (_this.width)) {
            return (_this.show =false);
        }
    };
    Text.prototype.replace = function(new_fontmember) {
        this.width = new_fontmember.text.length * parseInt(root_font) * new_fontmember.size;
        this.v = (screen_w + this.width)*1000/(60*new_fontmember.duration); //每帧移动的距离
        this.show = false;
        this.appearance.style.cssText = 'left:'+screen_w + 'px;font-size:' + (new_fontmember.size+Math.random())/2 + 'rem;color:' + new_fontmember.color + ';bottom:' + (screen_h-parseInt(root_font)*new_fontmember.size)*rand()+'px;';
        this.appearance.textContent = new_fontmember.text;
        return this;
    };
    /**
     * 幕布
     */
    function Curtain() {
        // this.content = fontpool;
        this.pool = []; //渲染池
        this.buff_pool = [];// 缓冲池
        this.time = 0;
    }
    Curtain.prototype.add = function(fontmember) {
        // var add_Text = new Text(fontmember);
        if(this.buff_pool.length === 0) {
            this.pool.push(new Text(fontmember));
        } 
        else {
            this.pool.push(this.buff_pool[0].replace(fontmember));
            this.buff_pool.splice(0,1);
        }
    };
    Curtain.prototype.remove = function(index) {
        var _this = this;
        _this.buff_pool.push(_this.pool[index]);
        _this.pool.splice(index,1);
    };
    Curtain.prototype.play = function() {
        var _this = this;
        (function go() {
            _this.time = _this.time + 1000/60;
            if(fontlist[0] && fontlist[0].start_time <= _this.time) {
                _this.add(fontlist[0]);
                fontlist.splice(0,1);
            }
            for (var i =0;i<_this.pool.length;i++) {
                _this.pool[i].move();
                if(_this.pool[i].show === false) {
                    _this.remove(i);
                }
            }
            requestAnimationFrame(function() {
                go();  
            });
        })();

