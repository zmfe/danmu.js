# danmu.js
弹幕系统

    var DialectCurtain = new Curtain();
    DialectCurtain.play();
    //增加弹幕：前端直接往fontlist push对象，或从后端请求后，往fontlist push对象
    fontlist.push({ text: "咔咔过过", size: 1.5, color:"rgb(82,84,91)", start_time: 1000, duration: 6000 });
    //测试一下：
    $(window).click(function(){
        fontlist.push({ text: "咔咔过过", size: 1.5, color:"rgb(82,84,91)", start_time: 1000, duration: 6000 });
    });
