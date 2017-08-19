$(document).ready(function () {    
   
    var g_width = 0;
    
    //去除cef中log：event.layerX and event.layerY are broken and deprecated in WebKit. 
    //They will be removed from the engine in the near future.
    $.event.props = $.event.props.join('|').replace('layerX|layerY|', '').split('|');
    
    //--------------------------初始化句柄,缓存句柄很重要，可以实现高效的查询------------------
    var g_list = $("#list");
    var g_activityEdit = $("#activity_edit");
    var g_editButton = $("#detailEdit");
    var g_delButton = $("#detailDel");
    var g_searchResule = $("#searchResule");
    var calenderToday = $("#calenderToday");
    
    //----------------------------日期选择插件---------------------------------
    $('.selDate').datePicker({
        clickInput:true,
        verticalOffset:25,
        createButton:false,
        startDate:'1902-01-01',
        endDate:'2037-12-31'
    });
    
    var selTimeFlag = true;
    
    $(".selTime").mousedown(function(){
        selTimeFlag = false;
    }).focus(function (event) {
        if(selTimeFlag)
        {
            return;
        }
        selTimeFlag = true;
        $(".timePicker").hide();
        var val = $(this).val();
        val = val.split(":");
        var next = $(this).next();
        next.find(".timePickerH").text(val[0]);
        next.find(".timePickerM").text(val[1]);
        next.show().focus();
    }).click(function () {
        stopBubble();
    });
    $(".timePicker").blur(function () {
        $(this).hide();
    });
    //------------------------------初始化页面的布局函数----------------------------------
    function initLayout() {
        //获取窗口的宽高
        var w = $("#content").width();
        var h = $("#content").height();
        w = w - 270;
        
        //初始化搜索结果显示div
        g_searchResule.width(w-1).height(h);
        var topH = g_searchResule.css("top");
	/*has problem when minsize the windows
        if(isMinStatus())
        {
            if (topH != "0px") {
                g_searchResule.css("top","-" + h + "px");
            }
        }
	*/
        calenderToday.width(w);
        
        //初始化月、日列表div
        g_list.width(2*w +10);
        $("#month_list").width(w).height(h);
        //$("#month_list,#day_list").width(w).height(h);
        g_width = w;
        
        //初始化日活动分布div
//        h = (h - h%24)/24 - 1;
//        $(".hours").css({"height":h +"px","line-height":h +"px"})
//        $("#day_activity").width(w-30);
    }
    //监听窗口的变化
	$(window).resize(initLayout);
	//初始化窗口的布局
    initLayout();	

    //------------------------------------点击当前页面要处理事件---------------------------------
    $(document).click(function () {
        $("#popInOrOut").hide();
        //$(".remindSel").hide();
        //$("#repeatSel").hide();
    })
    
    
    
    //------------------------------------------监听搜索框中的变化----------------------------
    var g_searchText;
    var g_searchHandle = $("#searchEvent");
    
    // 获得焦点时，启动定时器
    g_searchHandle.focus(function(){
        g_searchText = g_searchHandle.val();
        global.intervalObj = setInterval(searchHandle,300);
    });
    // 失去焦点时，清除定时器
    g_searchHandle.blur(function(){
        clearInterval(global.intervalObj);
        
        //搜索后，重新初始化选中项
        //defaultEventDetail();
    });
    
    // jsUserName input的值改变时执行的函数
    function searchHandle() {
        var txt = g_searchHandle.val();
        if (txt != g_searchText) {
            g_searchResule.show();
            if (txt == "") {
                g_searchText = "";
                g_searchResule.css("top","-" + g_searchResule.height() + "px");
                return;
            }
            //设置搜索关键字
            document.getElementById("keyWord").innerText = txt;
            g_searchText = txt;
            g_searchResule.css("top","0");
            
            cef.param = txt;
            cef.calendar("search");
        }
        else if (g_searchText == "") {
            g_searchResule.css("top","-" + g_searchResule.height() + "px");
        }
    }
    
    //------------------------------------------监听标题输入框的变化----------------------------
    var g_inputText = "";
    var g_titleHandle = $("#editNameArea");
    
    // 获得焦点时，启动定时器
    g_titleHandle.focus(function(){
        g_inputText = g_titleHandle.val();
        global.intervalObj = setInterval(titleHandle,300);
    });
    // 失去焦点时，清除定时器
    g_titleHandle.blur(function(){
        clearInterval(global.intervalObj);
    });
    // jsUserName input的值改变时执行的函数
    function titleHandle() {
        var txt = g_titleHandle.val();
        if (txt != g_inputText) {
        
            //判断保存按钮的可用性
            judgeCanUse();
             
            g_inputText = txt;
        }
    }
    
    
    //------------------------------------------监听说明输入框编辑---------------------------
    var g_infoHandle = $("#editInfoArea");
    
    // 获得焦点时，启动定时器
    g_infoHandle.focus(function(){
        g_inputText = g_infoHandle.val();
        global.intervalObj = setInterval(infoHandle,300);
    });
    // 失去焦点时，清除定时器
    g_infoHandle.blur(function(){
        clearInterval(global.intervalObj);
    });
    // jsUserName input的值改变时执行的函数
    function infoHandle() {
        var txt = g_infoHandle.val();
        if (txt != g_inputText) {
        
            //判断保存按钮的可用性
            judgeCanUse();
             
            g_inputText = txt;
        }
    }
    //------------------------------------------监听地点输入框编辑---------------------------
    var g_addrHandle = $("#editAddrArea");
    
    // 获得焦点时，启动定时器
    g_addrHandle.focus(function(){
        g_inputText = g_addrHandle.val();
        global.intervalObj = setInterval(addrHandle,300);
    });
    // 失去焦点时，清除定时器
    g_addrHandle.blur(function(){
        clearInterval(global.intervalObj);
    });
    // jsUserName input的值改变时执行的函数
    function addrHandle() {
        var txt = g_addrHandle.val();
        if (txt != g_inputText) {
        
            //判断保存按钮的可用性
            judgeCanUse();
             
            g_inputText = txt;
        }
    }
    
    
    
    $(".activityButton,.menuToday").hover(function () {
        if($(this).hasClass("disable"))
        {
            return;
        }
        $(this).css("background-position-y","-25px");
    },function () {
        if($(this).hasClass("disable"))
        {
            return;
        }
        $(this).css("background-position-y","0px");
    }).mousedown(function () {
        if($(this).hasClass("disable"))
        {
            return;
        }
        $(this).css("background-position-y","-50px");
    }).mouseup(function () {
        if($(this).hasClass("disable"))
        {
            return;
        }
        $(this).css("background-position-y","-25px");
        var id = $(this).attr("id");
    });
    
    $(".menuDay").hover(function () {
        if ($(this).attr("class") != "menuDay") {
            return;
        }
        $(this).parent().css("background-position-y","-25px");
    },function () {
        if ($(this).attr("class") != "menuDay") {
            return;
        }
        $(this).parent().css("background-position-y","0px");
    }).mousedown(function () {
        if ($(this).attr("class") != "menuDay") {
            return;
        }
        $(this).parent().css("background-position-y","-50px");
    }).mouseup(function () {
        if ($(this).attr("class") != "menuDay") {
            return;
        }
        $(this).parent().css("background-position-y","0px");
        $(this).addClass("menuDayOn");
        $(".menuMonth").removeClass("menuMonthOn");
        g_list.css("left","-" + g_width + "px")
    });
    
    $(".menuMonth").hover(function () {
        if ($(this).attr("class") != "menuMonth") {
            return;
        }
        $(this).parent().css("background-position-y","-25px");
    },function () {
        if ($(this).attr("class") != "menuMonth") {
            return;
        }
        $(this).parent().css("background-position-y","0px");
    }).mousedown(function () {
        if ($(this).attr("class") != "menuMonth") {
            return;
        }
        $(this).parent().css("background-position-y","-50px");
    }).mouseup(function () {
        if ($(this).attr("class") != "menuMonth") {
            return;
        }
        $(this).parent().css("background-position-y","0px");
        $(this).addClass("menuMonthOn");
        $(".menuDay").removeClass("menuDayOn");
        g_list.css("left","0px")
    });
    
    $(".contact_button").hover(function () {
        if ($(this).hasClass("disable")) {
            return;
        }
        $(this).css("background-position-y","-34px");
    },function () {
        $(this).css("background-position-y","0px");
    }).mousedown(function () {
        if ($(this).hasClass("disable")) {
            return;
        }
        $(this).css("background-position-y","-68px");
    }).mouseup(function () {
        $(this).css("background-position-y","0px");
    });
    
    var g_remSureStatus = false;
    $("#exportAll").hover(function () {
        $(this).addClass("exportAllHover");
    },function () {
        $(this).removeClass("exportAllHover");
    }).click(function () {
        var save = $("#sure_export");
        if ($(this).hasClass("exportAllOn")) {
            $(this).removeClass("exportAllOn");
            $("#coverExportAll").hide();
            if (g_remSureStatus) {
                save.addClass("disable");
            }
            else
            {
                save.removeClass("disable");
            }
        }
        else
        {
            if (save.hasClass("disable")) {
                g_remSureStatus = true;
            }
            else
            {
                g_remSureStatus = false;
            }
            $(this).addClass("exportAllOn");
            $("#coverExportAll").show();
            save.removeClass("disable");
        }
    });
    
    $("#selAll").click(function () {
        var checkBox = $("#exportList").find(".selOne");
        var len = checkBox.length;
        if ($(this).hasClass("selOn")) {
            $(this).removeClass("selOn");
            checkBox.removeClass("selOn");
            $("#sure_export").addClass("disable");
        }
        else {
            $(this).addClass("selOn")
            checkBox.addClass("selOn");
            if (len == 0) 
            {
                $("#sure_export").addClass("disable");
            }
            else
            {
                $("#sure_export").removeClass("disable");
            }
        }
    });
    
    $("#importSelAll").click(function () {
        var checkBox = $("#importList").find(".selOne");
        var len = checkBox.length;
        if ($(this).hasClass("selOn")) {
            $(this).removeClass("selOn");
            checkBox.removeClass("selOn");
            $("#sure_import").removeClass("disable");
        }
        else {
            $(this).addClass("selOn")
            checkBox.addClass("selOn");
            if (len == 0) 
            {
                $("#sure_import").addClass("disable");
            }
            else
            {
                $("#sure_import").removeClass("disable");
            }
        }
    });
    
    $(".submitButton").hover(function () {
        if ($(this).hasClass("disable")) {
            return;
        }
        $(this).css("background-position-y","-28px");
    },function () {
        if ($(this).hasClass("disable")) {
            return;
        }
        $(this).css("background-position-y","0px");
    }).mousedown(function () {
        if ($(this).hasClass("disable")) {
            return;
        }
        $(this).css("background-position-y","-56px");
    }).mouseup(function () {
        if ($(this).hasClass("disable")) {
            return;
        }
        $(this).css("background-position-y","0px");
    });
    
    $(".close").hover(function () {
        if ($(this).hasClass("disable")) {
            return;
        }
        $(this).css("background-position-x","-31px");
    },function () {
        if ($(this).hasClass("disable")) {
            return;
        }
        $(this).css("background-position-x","0px");
    }).mousedown(function () {
        if ($(this).hasClass("disable")) {
            return;
        }
        $(this).css("background-position-x","-62px");
    }).mouseup(function () {
        if ($(this).hasClass("disable")) {
            return;
        }
        $(this).css("background-position-x","0px");
    }).click(function () {
        $("#exportPop").hide();
    });
    
    //全天复选框
    $("#allDay").hover(function () {
        $(this).addClass("allDayHover");
    },function () {
        $(this).removeClass("allDayHover");
    }).click(function () {
        if ($(this).hasClass("allDayOn")) {
            $(this).removeClass("allDayOn");
            //显示时间选择
            $("#edit_endTime").show();
            $("#edit_beginTime").show();
            $("#edit_beginDate").width(155);
            $("#edit_endDate").width(155);
        }
        else{
            $(this).addClass("allDayOn");
            //设置时间段为一天的时间
            document.getElementById("edit_endDate").value = document.getElementById("edit_beginDate").value;
            //隐藏时间选择
            $("#edit_endTime").hide();
            $("#edit_beginTime").hide();
            $("#edit_beginDate").width(190);
            $("#edit_endDate").width(190);
        }

        //判断保存按钮的可用性
        judgeCanUse();
         
    });
    
    //添加图标按钮事件
    $("#editAdd").click(function () {
        var len = $("#remind_single").find(".edit_single").length;
        if (len <= 4) {
            var prev = $(this).prev();
            prev.append('<div id="r-0" class="edit_single" onclick="showRemindSel(this)">\
                        <div class="edit_del"></div>\
                        <div class="upArrow"></div>\
                        <div class="label_edit">{{calendar_js_prereminder_lang}}</div>\
                        <div time ="5" class="remind_text">5 {{calendar_js_time_minute_lang}}</div>\
                        <div class="remindSel">\
                        </div></div>');
                        
            prev.find(".edit_del:last").click(function () {
                $(this).parent().remove();  
                if(len <= 4)
                {
                    $("#editAdd").show();
                } 
                
                //判断保存按钮的可用性
                judgeCanUse();
            })
            
            if (len == 4) {
                $("#editAdd").hide();
            }
            
             //判断保存按钮的可用性
             judgeCanUse();
        }
    })
    
    //点击导入导出按钮
    $("#importExport").click(function () {
        if ($(this).hasClass("disable")) {
            return;
        }
        $("#popInOrOut").show();
        var size = cef.calendar("getEventSize");
        if (size > 0){
            $("#popOut").removeClass("disable");
        }
        else
        {
            $("#popOut").addClass("disable");
        }
        return false;
    });
    
    //导入日历
    $(".popIn_top").hover(function () {
        if (!$(this).hasClass("disable")) {
            $(this).addClass("popIn_top_on");
        }
    },function () {
        if (!$(this).hasClass("disable")) {
            $(this).removeClass("popIn_top_on");
        }
    }).click(function () {
        return false;
    });
    
    //导出日历
    $(".popOut_bottom").hover(function () {
        if (!$(this).hasClass("disable")) {
            $(this).addClass("popOut_bottom_on");
        }
    },function () {
        if (!$(this).hasClass("disable")) {
            $(this).removeClass("popOut_bottom_on");
        }
    }).click(function () {
        return false;
    });

    var gIntervalflag;
    var gFlag = true;
    //时间选择
    $(".timePickerHnext").click(function () {
        var val = $(this).parent().parent().find(".timePickerH");
        var h = parseInt(val.text(),10);
        if (h<23) {
            h ++;
        }
        else if (h == 23) {
            h = 0;
        }
        if (h<10) {
            h = "0" + h;
        }
        val.text(h);
    }).mousedown(function () {
        gFlag = true;
        var val = $(this).parent().parent().find(".timePickerH");
        setTimeout(function () {
            if (gFlag) {
                gIntervalflag = setInterval(function () {
                    var h = parseInt(val.text(),10);
                    if (h<23) {
                        h ++;
                    }
                    else if (h == 23) {
                        h = 0;
                    }
                    if (h<10) {
                        h = "0" + h;
                    }
                    val.text(h);
                },100); 
            }
        },100);       
    }).mouseup(function () {
        if (gFlag) {
            clearInterval(gIntervalflag);
        }
        gFlag = false;
    }).mouseout(function () {
        if (gFlag) {
            clearInterval(gIntervalflag);
        }
        gFlag = false;
    });
    
    $(".timePickerHprev").click(function () {
        var val = $(this).parent().parent().find(".timePickerH");
        var h = parseInt(val.text(),10);
        if (h>0) {
            h --;
        }
        else if (h == 0) {
            h = 23;
        }
        if (h<10) {
            h = "0" + h;
        }
        val.text(h);
    }).mousedown(function () {
        gFlag = true;
        var val = $(this).parent().parent().find(".timePickerH");
        setTimeout(function () {
            if (gFlag) {
                gIntervalflag = setInterval(function () {
                    var h = parseInt(val.text(),10);
                    if (h>0) {
                        h --;
                    }
                    else if (h == 0) {
                        h = 23;
                    }
                    if (h<10) {
                        h = "0" + h;
                    }
                    val.text(h);
                },100); 
            }
        },100);       
    }).mouseup(function () {
        if (gFlag) {
            clearInterval(gIntervalflag);
        }
        gFlag = false;
    }).mouseout(function () {
        if (gFlag) {
            clearInterval(gIntervalflag);
        }
        gFlag = false;
    });
    $(".timePickerMnext").click(function () {
        var val = $(this).parent().parent().find(".timePickerM");
        var m = parseInt(val.text(),10);
        if (m<59) {
            m ++;
        }
        else if (m == 59) {
            m = 0;
        }
        if (m<10) {
            m = "0" + m;
        }
        val.text(m);
    }).mousedown(function () {
        gFlag = true;
        var val = $(this).parent().parent().find(".timePickerM");
        setTimeout(function () {
            if (gFlag) {
                gIntervalflag = setInterval(function () {
                    var m = parseInt(val.text(),10);
                    if (m<59) {
                        m ++;
                    }
                    else if (m == 59) {
                        m = 0;
                    }
                    if (m<10) {
                        m = "0" + m;
                    }
                    val.text(m);
                },100); 
            }
        },100);       
    }).mouseup(function () {
        if (gFlag) {
            clearInterval(gIntervalflag);
        }
        gFlag = false;
    }).mouseout(function () {
        if (gFlag) {
            clearInterval(gIntervalflag);
        }
        gFlag = false;
    });
    $(".timePickerMprev").click(function () {
        var val = $(this).parent().parent().find(".timePickerM");
        var m = parseInt(val.text(),10);
        if (m>0) {
            m --;
        }
        else if (m == 0) {
            m = 59;
        }
        if (m<10) {
            m = "0" + m;
        }
        val.text(m);
    }).mousedown(function () {
        gFlag = true;
        var val = $(this).parent().parent().find(".timePickerM");
        setTimeout(function () {
            if (gFlag) {
                gIntervalflag = setInterval(function () {
                    var m = parseInt(val.text(),10);
                    if (m>0) {
                        m --;
                    }
                    else if (m == 0) {
                        m = 59;
                    }
                    if (m<10) {
                        m = "0" + m;
                    }
                    val.text(m);
                },100); 
            }
        },100);       
    }).mouseup(function () {
        if (gFlag) {
            clearInterval(gIntervalflag);
        }
        gFlag = false;
    }).mouseout(function () {
        if (gFlag) {
            clearInterval(gIntervalflag);
        }
        gFlag = false;
    });
    
    //确定选择时间
    $(".timePickerOk").click(function () {
        var par = $(this).parent().parent();
        var time = par.find(".timePickerH").text() + ":" + par.find(".timePickerM").text();
        var parInput = par.prev();
        parInput.val(time);
        par.hide();
        
        //判断输入时间的合法性
        if(parInput.attr("id") == "edit_beginTime")
        {
            judgeTime(0)
        }
        else
        {
            judgeTime(1)
        }
        
        //判断保存按钮是否可用
        judgeCanUse()
    });
    
    //当前时间
    $(".timePickerNow").click(function () {
        var date = new Date();
        var h = date.getHours();
        var m = date.getMinutes();
        if (h<10) {
            h = "0" + h;
        }
        if (m<10) {
            m = "0" + m;
        }
        var par = $(this).parent().parent();
        par.find(".timePickerH").text(h);
        par.find(".timePickerM").text(m);        
    });
    
    
    $.fn.autoTextarea = function(options) {
        var defaults={
            maxHeight:1000, //默认最大高度
            minHeight:14 //默认最小高度，也就是文本框最初的高度，当内容高度小于这个高度的时候，文本以这个高度显示
        };

        var opts = $.extend({},defaults,options);
        return $(this).each(function() {
            $(this).bind("paste cut keydown keyup focus blur",function(){
//                var height,style=this.style;
//                this.style.height =  opts.minHeight + 'px';
//                if (this.scrollHeight > opts.minHeight) {
//                    if (this.scrollHeight > opts.maxHeight) {
//                        height = opts.maxHeight;
//                        style.overflowY = 'scroll';
//                    } else {
//                        height = this.scrollHeight;
//                        style.overflowY = 'hidden';
//                    }
//                    style.height = height  + 'px';
//                }
                initTextareaHeight(this);
            });
        });
    };
    
    $('#editNameArea,#editInfoArea,#editAddrArea').autoTextarea();
    
})


//-------------------------------------------------------------非jquery内函数-------------------------

//屏蔽鼠标右键 ;
document.oncontextmenu = new Function("return false;")

//隐藏所有窗口;
function hdieAllPop()
{
    document.getElementById('popInOrOut').style.display = "none";
}

//监听窗口是否最小化
function isMinStatus() { 
    var isMin = false; 
    if (window.outerWidth != undefined) { 
    isMin = window.outerWidth <= 160 && window.outerHeight <= 27; 
    } 
    else { 
    isMin = window.screenTop < -30000 && window.screenLeft < -30000; 
    } 
    return isMin; 
} 

//设置Textarea根据内容的多少设置高度
function initTextareaHeight(obj) {
    var height,st=obj.style;
    st.height = '14px';
    if (obj.scrollHeight > 14) {
        if (obj.scrollHeight > 1000) {
            height = 1000;
            obj.overflowY = 'scroll';
        } else {
            height = obj.scrollHeight;
            obj.overflowY = 'hidden';
        }
        st.height = height  + 'px';
    }
}
//新建活动
function newAction (obj) {
    
    if ($(obj).hasClass("disable")) {
        return;
    }
    //判断是否在编辑状态下
    if(judgeSaveOrNot())
    {
        return;
    }
    newActionEx ();
}
//新建活动
function newActionEx () {
    //显示编辑状态
    showEditStatus();
    
    var eventEdit = $("#editDetail");
    eventEdit.attr("eventId","-1");
    eventEdit.attr("rule","0");

    $("#edit_beginDate").width(155);
    $("#edit_endDate").width(155);
    $("#edit_endTime").show();
    $("#edit_beginTime").show();
    $("#allDay").removeClass("allDayOn");
    
    //清空说明
    var editArea = document.getElementById("editInfoArea");
    editArea.value = "";
    editArea.style.height = '18px';
    
    //清空地点
    editArea = document.getElementById("editAddrArea");
    editArea.value = "";
    editArea.style.height = '18px';
    
    //清空标题
    editArea = document.getElementById("editNameArea");
    editArea.value = "";
    editArea.style.height = '18px';
    
    //重置重复频率
    $("#repeatType").text("{{calendar_js_once_event_lang}}").attr("repeatType","0");
    $("#repeat_single .upArrow").show();
    //初始化提醒
    var csTemp = '<div id="r-0" class="edit_single" onclick="showRemindSel(this)">\
            <div class="edit_del"></div>\
            <div class="upArrow"></div>\
            <div class="label_edit">{{calendar_js_prereminder_lang}}</div>\
            <div time ="5" class="remind_text">5 {{calendar_js_time_minute_lang}}</div>\
            <div class="remindSel"></div></div>';
            
    var remind = $("#remind_single");
    remind.html("").append(csTemp); 
    remind.next().show();
         
    //删除图标按钮事件
    remind.find(".edit_del").unbind("click").click(function () {
        $(this).parent().remove();   
        $("#editAdd").show();
        
        //判断保存按钮的可用性
        judgeCanUse();  
    })
    //初始化时间
    //var date = getCurrDate();
    var date = getNowClickDate();
    var myDate = date + " " + getWeek(date);
    var time = getCurrTime();
    var endTime = getCurrEndTime(time);
    
    var tempTime = endTime.split(":");
    tempTime = parseInt(tempTime[0],10);
    var endDate = myDate;
    if (tempTime == 0) {
        date = getNextDay(date);
        endDate = date + " " + getWeek(date);
    }
    
    document.getElementById("edit_beginDate").value = myDate;
    document.getElementById("edit_endDate").value = endDate;
    
    document.getElementById("edit_beginTime").value = time;
    document.getElementById("edit_endTime").value = endTime;
    
    //设置第一次新建的编辑框中的文本
    global.csEditText = getEditText();
}

//导入日历
function importCalendar() {

    //判断是否在编辑状态下
    if(judgeSaveOrNot())
    {
        return;
    }
    $("#popInOrOut").hide();
    //弹出选择窗口
    cef.calendar("showImportDlg");
}

function importFail() {
    $(".coverScreen").hide();
    
    var bubble = $("#bubble");
    document.getElementById("bubble_message").innerHTML = "<div class=prompt_textName><div class=sorry ></div>选择的文件有错误!</div>";
    bubble.show();

    setTimeout(function () {
        bubble.hide();
    },1000);
}

//重新选择文件
//function reSelImport()
//{
//    //弹出选择窗口
//    cef.calendar("showImportDlg");
//}

//选择文件成功
//function showImportCalendar(csJson) {

//    var importPop = $("#importPop");
//    //填充选择进来的Vcs文件
//    if (csJson != "" && csJson != null) {
//        importPop.show();
//        initImportDlg();
//        var importL = $("#importList");
//        var fileName, id, temp;
//        for(var i=0;i<csJson.length;i++){ 
//            id = csJson[i]["id"];
//            fileName = csJson[i]["fileName"];
//            temp = '<li><div fileId="' + id + '" class="selOne"></div>\
//                        <div class="selTxt">' + fileName + '</div>\
//                    </li>'
//            importL.append(temp);
//        }
//        importL.find("li").unbind("click").click(function () {
//            var len = 0;
//            
//            var checkBox = $(this).find(".selOne");
//            var selList = $("#importList");
//            if (checkBox.hasClass("selOn")) {
//                checkBox.removeClass("selOn");
//                $("#importSelAll").removeClass("selOn");
//                len = selList.find(".selOn").length;
//            }
//            else {
//                checkBox.addClass("selOn");
//                len = selList.find(".selOn").length;
//                if (selList.find("li").length == len) {
//                    $("#importSelAll").addClass("selOn");
//                }
//            }
//            
//            if (len == 0) 
//            {
//                $("#sure_import").addClass("disable");
//            }
//            else
//            {
//                $("#sure_import").removeClass("disable");
//            }
//        });
//        
//    }
//    else
//    {
//        if(importPop.css("display") != "none")
//        {
//            var bubble = $("#coverImportAll");
//            bubble.show();
//            setTimeout(function () {
//                bubble.hide();
//            },2000);
//        }
//        else{
//            //选择路径完成，执行导出操作
//            document.getElementById("bubble_message").innerHTML = "<div class=prompt_textName><div class=refresh></div>选择的文件失败!</div>";
//            var bubble = $("#bubble");
//            bubble.show();
//            
//            setTimeout(function () {
//                bubble.hide();
//            },2000);
//        }
//    }
//}

//关闭导入窗口
//function importPopClose() {        
//    $("#importPop").hide();
//}

//取消导入
//function cancelImport() {    
//    $("#importPop").hide();
//}

//初始化导入框
//function initImportDlg()
//{    
//    //将所有选择框设置为未选择
//    $("#importSelAll").removeClass("selOn");
//    $("#importList").html("");
//    //确定按钮置灰
//    $("#sure_import").addClass("disable");

//}

//确认导入日历
//function sureImport() {
//    if ($(this).hasClass("disable")) {
//        return;
//    }
//    $("#importPop").hide();
//    var flag = true;
//    var csFileId = "";
//    //获取导入的活动文件Id
//    $("#importList").find(".selOn").each(function () {
//        if (flag) {
//            csFileId = $(this).attr("fileId");
//            flag = false;
//        }
//        else
//        {
//            csFileId = csFileId + " " + $(this).attr("fileId");
//        }
//    });
//    
//    //type为1表示导入的是zip文件中的多个或单个vcs
//    param = "[{\"type\":\"1\" , \"csFileId\":\"" + csFileId + "\"}]";
//	cef.param = param;
//    cef.calendar("importCalendar");
//    
//    showImportPross();
//}


//导出日历
function exportExport (obj) {
    if ($(obj).hasClass("disable")) {
        return;
    }
    
    //判断是否在编辑状态下
    if(judgeSaveOrNot())
    {
        return;
    }
    
    //隐藏导入导出下拉框
    $("#popInOrOut").hide();
    
    //初始化导出时间选择
    var myDate = new Date();
    var nM = myDate.getMonth() + 1;
    var nD = myDate.getDate();
    if (nM <10) {
        nM = "0" + nM;
    }
    if (nD <10) {
        nD = "0" + nD;
    }
    var startDate = myDate.getFullYear() + "-" + nM + "-" + nD;
    document.getElementById("exportPopBeginDate").value = startDate + " " + getWeek(startDate);
    var endDate = getNextMonth(startDate);
    document.getElementById("exportPopEndDate").value = endDate + " " + getWeek(endDate);

    $("#exportPop").show();
    //初始化导出框
    initExportDlg();
        
    var param = "[{\"beginDate\":\"" + startDate + "\" , \"endDate\":\"" + endDate + "\"}]";
	cef.param = param;
	cef.calendar("betweenDate");
}
//关闭导出窗口
function exportPopClose() {        
    $("#exportPop").hide();
}

//取消导出
function cancelExport() {    
    $("#exportPop").hide();
}

//初始化导出框
function initExportDlg()
{    
    //将选择框还原
    $("#exportAll").removeClass("exportAllOn");
    $("#coverExportAll").hide();
    
    //将所有选择框设置为未选择
    $("#selAll").removeClass("selOn");
    $("#exportList").find(".selOne").removeClass("selOn");
    //确定按钮置灰
    $("#sure_export").addClass("disable");

}

//确认导出,会弹出路径选择框，还没有执行导出
function sureExport(obj) {
    if ($(obj).hasClass("disable")) {
        return;
    }
    
    var exportAll = 0;
    var csId = "";
    var param;
    if($("#exportAll").hasClass("exportAllOn"))
    {
        exportAll = 1;
    }
    else
    {
        var bFlag = true;
        $("#exportList").find(".selOn").each(function () {
            if (bFlag) {
                csId = $(this).attr("eventId");
                bFlag = false;
            }
            else
            {
                csId = csId + " " + $(this).attr("eventId");
            }
        });
    }
     param = "[{\"exportAll\":\"" + exportAll + "\" , \"csId\":\"" + csId + "\"}]";
     
    //确认导出、选择导出路径
    cef.param = param;
    cef.calendar("exportCalendar");
}

//正在导出
function nowExport()
{        
    //将选择框还原
    $("#exportAll").removeClass("exportAllOn");
    $("#coverExportAll").hide();
    $("#exportPop").hide();
    
    //选择路径完成，执行导出操作
    document.getElementById("bubble_message").innerHTML = "<div class=prompt_textName><div class=refresh ></div>{{calendar_js_exporting_hint_lang}}</div>";
    $("#bubble").show();
}


//隐藏导出完成提示框
function hideExportBubble(csType)
{
    $("#exportPop").hide();
    $("#bubble").show();
    var bubbleMess = $("#bubble_message");
    if (csType == "0") {
        //导出无日程的时候
        bubbleMess.html("<div class=prompt_textName ><div class=sorry ></div>{{calendar_js_event_empty_lang}}</div>");
    }
    else if (csType == "1")
    {
        //操作失败
        bubbleMess.html("<div class=prompt_textName ><div class=sorry ></div>{{calendar_js_operator_fail_lang}}</div>");
    }
    else if (csType == "2")
    {
        //导出成功
        bubbleMess.html("<div class=prompt_textName ><div class=ok ></div>{{calendar_js_export_success_lang}}</div>");
    }
    else if (csType == "3")
    {
        //操作失败
        bubbleMess.html("<div class=prompt_textName ><div class=sorry ></div>{{calendar_js_backup_failed_nospace_lang}}</div>");
    }
    
    setTimeout(function () {
        $("#bubble").hide();
    },2000);
}

//隐藏弹出的重复频率和闹钟提醒
function hideRepeatRemind()
{
    //隐藏重复频率
    $("#repeatSel").hide();
    //隐藏闹钟提醒
    $(".remindSel").hide();
    //隐藏时间选择弹出框
    $(".timePicker").hide();

}
//显示提醒选框
function showRemindSel(obj)
{

    //先隐藏别的弹出框
    $("#repeatSel").hide();
    //隐藏时间弹窗
    $(".timePicker").hide();
    
    //操作当前弹出框
    obj = $(obj);
    var sel = obj.find(".remindSel");
    if (sel.css("display") != "none")
    {
        sel.hide();
    }
    else
    {
        //隐藏别的弹出框
        $(".remindSel").hide();
    
        var radio0 = "",radio1 = "",radio2 = "",radio3 = "",radio4 = "",radio5 = "",radio6 = "",radio7 = "",radio8 = "";
        var rule = parseInt(obj.find(".remind_text").attr("time"),10);
        switch(rule)
        {
        case 0:
            radio0 = "radioSelOn";
            break;
        case 5:
            radio1 = "radioSelOn";
            break;
        case 15:
            radio2 = "radioSelOn";
            break;
        case 30:
            radio3 = "radioSelOn";
            break;
        case 60:
            radio4 = "radioSelOn";
            break;
        case 120:
            radio5 = "radioSelOn";
            break;
        case 1440:
            radio6 = "radioSelOn";
            break;
        case 2880:
            radio7 = "radioSelOn";
            break;
        case 10080:
            radio8 = "radioSelOn";
            break;
        }
        var csTemp;
        csTemp = '<div time="0" class="remindList remindListFirst"><div class="radioSel ' + radio0 + '"></div>{{calendar_js_on_time_lang}}</div>\
                  <div time="5" class="remindList"><div class="radioSel ' + radio1 + '"></div>5 {{calendar_js_time_minute_lang}}</div>\
                  <div time="15" class="remindList"><div class="radioSel ' + radio2 + '"></div>15 {{calendar_js_time_minute_lang}}</div>\
                  <div time="30" class="remindList"><div class="radioSel ' + radio3 + '"></div>30 {{calendar_js_time_minute_lang}}</div>\
                  <div time="60" class="remindList"><div class="radioSel ' + radio4 + '"></div>1 {{calendar_js_time_hour_lang}}</div>\
                  <div time="120" class="remindList"><div class="radioSel ' + radio5 + '"></div>2 {{calendar_js_time_hour_lang}}</div>\
                  <div time="1440" class="remindList"><div class="radioSel ' + radio6 + '"></div>1 {{calendar_js_time_day_lang}}</div>\
                  <div time="2880" class="remindList"><div class="radioSel ' + radio7 + '"></div>2 {{calendar_js_time_day_lang}}</div>\
                  <div time="10080" class="remindList remindListLast"><div class="radioSel ' + radio8 + '"></div>1 {{calendar_js_time_week_lang}}</div>';

        sel.html("").append(csTemp).show();
        
        //添加事件
        var child = sel.find(".remindList");
        child.unbind("click").click(function () {
            child.find(".radioSel").removeClass("radioSelOn");
            $(this).find(".radioSel").addClass("radioSelOn");
            obj.find(".remind_text").text($(this).text()).attr("time",$(this).attr("time"));
            $(".remindSel").hide();
            
            //判断保存按钮的可用性
            judgeCanUse();
             
            //停止冒泡
            stopBubble();
        })
    }
    //停止冒泡
    stopBubble();
}

//显示重复频率选择框
function showRepeatSel()
{
	//若是仅修改此次活动，不弹出选择框
	if($("#editDetail").attr("rule") == "1")
	{
		return;
	}
    //先隐藏别的弹出框
    $(".remindSel").hide();
    //隐藏时间弹窗
    $(".timePicker").hide();
    
    //操作当前的弹出框
    var sel = $("#repeatSel");
    if (sel.css("display") != "none")
    {
        sel.hide();
    }
    else
    {
        var week,nM,nD,csTemp,remNum;
        //获取开始日期
        var startDate = document.getElementById("edit_beginDate").value;
        startDate = startDate.split(" ");
        
        //获取月中的第几个周
        remNum = getWeekNum(startDate[0]);
        
        week = startDate[1];
        startDate = startDate[0].split("-");
        nM = startDate[1];
        nD = startDate[2];
        
        var radio0 = "",radio1 = "",radio2 = "",radio3 = "",radio4 = "",radio5 = "",radio6 = "";
        var rule = parseInt($("#repeatType").attr("repeatType"),10);
        switch(rule)
        {
        case 0:
            radio0 = "radioSelOn";
            break;
        case 1:
            radio1 = "radioSelOn";
            break;
        case 2:
            radio2 = "radioSelOn";
            break;
        case 3:
            radio3 = "radioSelOn";
            break;
        case 4:
            radio4 = "radioSelOn";
            break;
        case 5:
            radio5 = "radioSelOn";
            break;
        case 6:
            radio6 = "radioSelOn";
            break;
        }
		var suffix = {{calendar_js_suffix_lang}};
		
		//若是第5周，则标记为最后一周
		var tempStr = '{{calendar_js_everymonth_lang}}({{calendar_js_everymonth_frequece_lang}}' +' '+remNum + '{{calendar_js_one_attr_lang}}'+suffix[remNum%30]+' '+ week + ')';
		if(remNum == 5)
		{
			tempStr = "{{calendar_js_everymonth_lang}}({{calendar_js_everymonth_lastweek_lang}}" + week + ")";
		}
		
        if (week != "{{calendar_js_week_saturday_lang}}" && week != "{{calendar_js_week_sunday_lang}}") {
            sel.css("margin-top","-215px");
            csTemp = '<div repeatType="0" class="repeatList repeatListFirst"><div class="radioSel ' + radio0 + '"></div>{{calendar_js_once_event_lang}}</div>\
                     <div repeatType="1" class="repeatList"><div class="radioSel ' + radio1 + '"></div>{{calendar_js_everyday_lang}}</div>\
                     <div repeatType="2" class="repeatList"><div class="radioSel ' + radio2 + '"></div>{{calendar_js_everyweekday_lang}}</div>\
                     <div repeatType="3" class="repeatList"><div class="radioSel ' + radio3 + '"></div>{{calendar_js_everyweek_lang}}({{calendar_js_everyweek_frequece_lang}}' +' '+week + ')</div>\
                     <div repeatType="4" class="repeatList"><div class="radioSel ' + radio4 + '"></div>'+ tempStr + '</div>\
                     <div repeatType="5" class="repeatList"><div class="radioSel ' + radio5 + '"></div>{{calendar_js_everymonth_lang}}(' + nD +suffix[nD%30]+ '{{calendar_js_date_day_lang}})</div>\
                     <div repeatType="6" class="repeatList repeatListLast"><div class="radioSel ' + radio6 + '"></div>{{calendar_js_everyyear_lang}}(' + nM + '{{calendar_js_date_month_lang}}' + nD + '{{calendar_js_date_day_lang}})</div>';
        }
        else
        {
            sel.css("margin-top","-190px");
            csTemp = '<div repeatType="0" class="repeatList repeatListFirst"><div class="radioSel ' + radio0 + '"></div>{{calendar_js_once_event_lang}}</div>\
                     <div repeatType="1" class="repeatList"><div class="radioSel ' + radio1 + '"></div>{{calendar_js_everyday_lang}}</div>\
                     <div repeatType="3" class="repeatList"><div class="radioSel ' + radio3 + '"></div>{{calendar_js_everyweek_lang}}({{calendar_js_everyweek_frequece_lang}}'+' '+week + ')</div>\
                     <div repeatType="4" class="repeatList"><div class="radioSel ' + radio4 + '"></div>' + tempStr + '</div>\
                     <div repeatType="5" class="repeatList"><div class="radioSel ' + radio5 + '"></div>{{calendar_js_everymonth_lang}}(' + nD+suffix[nD%30]+ '{{calendar_js_date_day_lang}})</div>\
                     <div repeatType="6" class="repeatList repeatListLast"><div class="radioSel ' + radio6 + '"></div>{{calendar_js_everyyear_lang}}(' + nM + '{{calendar_js_date_month_lang}}' + nD + '{{calendar_js_date_day_lang}})</div>';
        }

        sel.html("").append(csTemp).show();
        
        //添加事件
        var child = sel.find(".repeatList");
        child.unbind("click").click(function () {
            child.find(".radioSel").removeClass("radioSelOn");
            $(this).find(".radioSel").addClass("radioSelOn");
            sel.prev().text($(this).text()).attr("repeatType",$(this).attr("repeatType"));
             $("#repeatSel").hide();
             
             //判断保存按钮的可用性
             judgeCanUse();
             
            //停止冒泡
            stopBubble();
        })
    }
    //停止冒泡
    stopBubble();
}

//获取当前的日期
function getCurrDate() {
    var myDate = new Date();
    var nY = global.defaultYear;
    var nM = myDate.getMonth() + 1;
    var nD = myDate.getDate();
    if (nM <10) {
        nM = "0" + nM;
    }
    if (nD <10) {
        nD = "0" + nD;
    }
    if (!global.errorYear) {
        nY = myDate.getFullYear();
    }
    var date = nY + "-" + nM + "-" + nD;
    return date;
}

//获取当前的日期
function getNowClickDate() {
    var nY = $("#nian").text();
    var nM =  parseInt($("#yue").text(),10);
    var nD =  parseInt($("#ri").text(),10);
    if (nM <10) {
        nM = "0" + nM;
    }
    if (nD <10) {
        nD = "0" + nD;
    }
    var date = nY + "-" + nM + "-" + nD;
    return date;
}

//获取当前的实践
function getCurrTime() {
    //从c++获取时间
    cef.calendar("getDate");
    var param = cef.param;
    param = param.split(" ");
    param = param[1].split("-");
    var nH = parseInt(param[0],10);
    var nM = parseInt(param[1],10);
    if (nM<30) {
        nM = 30
    }
    else
    {
        nH ++;
        nM = 0;
    }
    
    if (nH >= 24) {
        nH = 0;
    }
    
    if (nH <10) {
        nH = "0" + nH;
    }
    if (nM <10) {
        nM = "0" + nM;
    }
    var time = nH + ":" + nM;
    return time;
}

//格式化时间
function formatTime(time) {
    time = time.split(":");
    var nH = parseInt(time[0],10);
    var nM = parseInt(time[1],10);
    if (nH <10) {
        nH = "0" + nH;
    }
    if (nM <10) {
        nM = "0" + nM;
    }
    var time = nH + ":" + nM;
    return time;
}

//获取当前的下n分钟的时间
function getCurrEndTime(time) {
    time = time.split(":");
    var nH = parseInt(time[0],10);
    var nM = time[1];
    
    nH = nH + 1;

    if (nH == 24) {
        time = "00:" + nM; 
    }
    else
    {
        if (nH < 10) {
            nH = "0" + nH;
        }
        time = nH + ":" + nM;    
    }
    return time;
}

//根据日期获取星期
function getWeek(date) {
    var num = new Date(date).getDay();
    var temp = "";
    switch(num)
    {
        case 0:
        temp = "{{calendar_js_week_sunday_lang}}";
        break;
        case 1:
        temp = "{{calendar_js_week_monday_lang}}";
        break;
        case 2:
        temp = "{{calendar_js_week_tuesday_lang}}";
        break;
        case 3:
        temp = "{{calendar_js_week_wednesday_lang}}";
        break;
        case 4:
        temp = "{{calendar_js_week_thursday_lang}}";
        break;
        case 5:
        temp = "{{calendar_js_week_friday_lang}}";
        break;
        case 6:
        temp = "{{calendar_js_week_saturday_lang}}";
        break;
    };
    return temp;
}
//获取第几个星期
function getWeekNum(date) {
    var myDate = new Date(date);
    var d = myDate.getDate();
    //var w = myDate.getDay();
    /* 
    a = d = 当前日期 
    b = 6 - w = 当前周的还有几天过完（不算今天） 
    a + b 的和在除以7 就是当天是当前月份的第几周 
    */ 
    //var num = Math.ceil( (d + 6 - w) / 7 );
    var num = Math.ceil( d/ 7 );
    switch(num)
    {
        case 1:
        temp = "{{calendar_js_one_lang}}";
        break;
        case 2:
        temp = "{{calendar_js_two_lang}}";
        break;
        case 3:
        temp = "{{calendar_js_three_lang}}";
        break;
        case 4:
        temp = "{{calendar_js_four_lang}}";
        break;
        case 5:
        temp = "{{calendar_js_five_lang}}";
        break;
        case 6:
        temp = "{{calendar_js_six_lang}}";
        break;
    };
    return num;
}
//根据日期获取下一个月的日期
function getNextMonth(date) {
    var temp;
    var nY, nM, nD;
    date = date.split("-");
    nY = parseInt(date[0],10);
    nM = parseInt(date[1],10);
    nD = parseInt(date[2],10);
    nM ++;
	if (nM > 12)
	{
		nY ++;
		nM = 1;
	}
    if (nM == 4 || nM == 6 || nM == 9 || nM == 11) {
        if (nD == 31) {
            nD = 30;
        }
    }
    else if (nM == 2) {
        if((nY/4==0&&nY/100!=0)||(nY/400==0)){
            if (nD > 29) {
                nD = 29;
            }
        }
        else{
            if (nD > 28) {
                nD = 28;
            }
        }
    }
    
    if (nM < 10) {
        nM = "0" + nM;
    }
    if (nD < 10) {
        nD = "0" + nD;
    }
    temp = nY + "-" + nM + "-" + nD;
    return temp;
}

//根据日期获取前一个月的日期
function getPrevMonth(date) {
    var temp;
    var nY, nM, nD;
    date = date.split("-");
    nY = parseInt(date[0],10);
    nM = parseInt(date[1],10);
    nD = parseInt(date[2],10);
    nM --;
	if (nM <= 0)
	{
		nY --;
		nM = 12;
	}
    if (nM <10) {
        nM = "0" + nM;
    }
    if (nD <10) {
        nD = "0" + nD;
    }
    temp = nY + "-" + nM + "-" + nD;
    return temp;
}

//根据日期获取上一天的日期
function getPrevDay(date) {
    var temp;
    var nY, nM, nD;
    date = date.split("-");
    nY = parseInt(date[0],10);
    nM = parseInt(date[1],10);
    nD = parseInt(date[2],10);
    nD --;
    if (nM == 4 || nM == 6 || nM == 9 || nM == 11) {
        if (nD < 1) {
            nM --;
            nD = 30;
        }
    }
    else if (nM == 2) {
        //判断闰年
        if(((nY%4 == 0)&&(nY%100 != 0)) || (nY%400 == 0)){
            if (nD < 1) {
                nM --;
                nD = 29;
            }
        }
        else{
            if (nD < 1) {
                nM --;
                nD = 28;
            }
        }
    }
    else{
        if (nD > 31) {
            nM --;
            nD = 31;
        }
    }
	if (nM < 1)
	{
		nY --;
		nM = 12;
	}
	if (nM < 10)
	{
	    nM = "0" + nM;
	}
	if (nD < 10)
	{
	    nD = "0" + nD;
	}
    temp = nY + "-" + nM + "-" + nD;
    return temp;
}

//根据日期获取下一天的日期
function getNextDay(date) {
    var temp;
    var nY, nM, nD;
    date = date.split("-");
    nY = parseInt(date[0],10);
    nM = parseInt(date[1],10);
    nD = parseInt(date[2],10);
    nD ++;
    if (nM == 4 || nM == 6 || nM == 9 || nM == 11) {
        if (nD > 30) {
            nM ++;
            nD = 1;
        }
    }
    else if (nM == 2) {
        //判断闰年
        if(((nY%4 == 0)&&(nY%100 != 0)) || (nY%400 == 0)){
            if (nD > 29) {
                nM ++;
                nD = 1;
            }
        }
        else{
            if (nD > 28) {
                nM ++;
                nD = 1;
            }
        }
    }
    else{
        if (nD > 31) {
            nM ++;
            nD = 1;
        }
    }
	if (nM > 12)
	{
		nY ++;
		nM = 1;
	}
	if (nM < 10)
	{
	    nM = "0" + nM;
	}
	if (nD < 10)
	{
	    nD = "0" + nD;
	}
    temp = nY + "-" + nM + "-" + nD;
    return temp;
}

//获取两天个日期的相差天数
function desDate(todyDate,endDate,startDate) {
    todyDate = todyDate.replace(/-/g,"/");
    endDate = endDate.replace(/-/g,"/");
    startDate = startDate.replace(/-/g,"/");
        
    var dt1 = new Date(endDate); 
    var dt2 = new Date(startDate); 
    var n= (dt1-dt2)/(3600*24*1000);
    var dOri = new Date(todyDate);
    dOri.setDate(dOri.getDate()+n);
    var m,d;
    m = dOri.getMonth() + 1;
    d = dOri.getDate();
    if (m < 10) {
        m = "0" + m;
    }
    if (d < 10) {
        d = "0" + d;
    }
    var date= dOri.getFullYear() + "-" + m + "-" + d;
    return date;
}

//---------------------------------------------页面操作函数----------------------------------------

//点击刷新按钮
function refresh () {
	if($("#refresh").hasClass("disable"))
		return;
    //判断是否在编辑状态下
    if(judgeSaveOrNot())
    {
        return;
    }
    
    $("#bubble_message").html("<div class=bubble_text ><div class=refresh ></div>{{calendar_js_refresh_hint_lang}}</div>");
    $("#bubble").show();
    cef.calendar("refresh");
}

//清空所有数据
function removeAll(obj)
{
    if ($(obj).hasClass("disable")) {
        return;
    }
    
    //判断是否在编辑状态下
    if(judgeSaveOrNot())
    {
        return;
    }

//	showEditStatus();
    art.dialog({
		title : '{{calendar_js_deletedlg_title_lang}}',
		content : '{{calendar_js_deletedlg_content_lang}}',
		lock : true,
		dblclickNotHide : true,
		width: 300,
		okValue: '{{calendar_js_deletedlg_okbtn_lang}}',
		ok : function(){
			$("#bubble_message").html("<div class=bubble_text ><div class=refresh ></div>{{calendar_js_delete_hint_lang}}</div>");
        	$("#bubble").show();
        	cef.calendar("removeAll");
        	return true;
		},
		cancelValue: '{{calendar_js_deletedlg_cancelbtn_lang}}',
		cancel : function(){
			return true;
		}
	})
    
}

//点击左侧的上一月按钮
function prevM(obj) {

    obj = $(obj);
    if(obj.hasClass("disable"))
    {
        return;
    }
    //判断是否在编辑状态下
    if(judgeSaveOrNot())
    {
        return;
    }
    
    obj.addClass("disable");
    obj.css("background-position-y","0px");
    
            
    var start = $("#preActivityIcon");
    var startDate = start.text();
    startDate = getPrevMonth(startDate);
    start.text(startDate);
    var endDate = $("#nextActivityIcon").text();
    
    var param = "[{\"beginDate\":\"" + startDate + "\" , \"endDate\":\"" + endDate + "\"}]";
	cef.param = param;
	cef.calendar("betweenMonth");
    
}

//点击左侧的下一月按钮
function nextM(obj) {

    obj = $(obj);
    if(obj.hasClass("disable"))
    {
        return;
    }
    //判断是否在编辑状态下
    if(judgeSaveOrNot())
    {
        return;
    }
    
    obj.addClass("disable");
    obj.css("background-position-y","0px");
    
    var end = $("#nextActivityIcon");
    var endDate = end.text();
    endDate = getNextMonth(endDate);
    end.text(endDate);
    var startDate = $("#preActivityIcon").text();

    var param = "[{\"beginDate\":\"" + startDate + "\" , \"endDate\":\"" + endDate + "\"}]";
	cef.param = param;
	cef.calendar("betweenMonth");
}

//点击编辑或保存按钮触发事件
function editOrDel(obj) {
    if ($(obj).hasClass("disable")) {
        return;
    }
    var txt = obj.innerText;
    if (txt == "{{calendar_js_editbtn_text_lang}}") {
        var csJson = global.csEventDetailJson;
        if (csJson != "" && csJson != null) {
            var repeat,search;
            for(var i=0;i<csJson.length;i++){ 
                if (i == 0) {
                    //先判断该事件是否是重复的
                    repeat = csJson[i]["rule"];
                    search = csJson[i]["search"];
                    if (repeat == "0") {
                        //显示编辑状态
                        showEditStatus();
                        //获取当前这个活动的详细信息填充编辑
                        setEventEdit("0");
                    }
                    else
                    {
                        //获取当前活动的Id，根据Id删除当前的活动
                        var eventDetail = $("#eventDetail");
                        var id = eventDetail.attr("eventId");
                        if (id == "-1") {
                            return;
                        }
                        if (search == "1") {
                            //显示编辑区
                            showEditStatus();
                            //获取当前这个活动的详细信息填充编辑
                            setEventEdit("2");
                            return;
                        }
                        var rule = eventDetail.attr("eventRule");
                        var csTemp = "";
                        
                        
                        
                        var starDate = csJson[i]["startDate"];
                        var endDate = csJson[i]["endDate"];
                        
                        //重复事件只编辑当天活动
                        var todyDate =  $("#eventDetail").attr("todyDate");

                        art.dialog({
							title : '{{calendar_js_editdlg_title_lang}}',
							lock : true,
							dblclickNotHide : true,
							width: 300,
							okValue: '{{calendar_js_editdlg_okbtn_lang}}',
							ok : function(){
								var listOn = $(".prompt_selectListOn");
	                            if (listOn.length == 0) {
	                                repeat = 0;
	                            }
	                            else
	                            {
	                                repeat = listOn.attr("rule");
	                            }
	                            //显示编辑区
	                            showEditStatus();
	                            //获取当前这个活动的详细信息填充编辑
	                            setEventEdit(repeat);
					        	return true;
							},
							cancelValue: '{{calendar_js_editdlg_cancelbtn_lang}}',
							cancel : function(){
								return true;
							},
							initialize: function(){
							    if (csJson[i]["firstDay"] == "0") {
							    	this.content('<div class=\"prompt_select\">\
		                                <div rule=1 class=\"prompt_selectList prompt_selectListOn\">{{calendar_js_promt_changethis_event_lang}}</div>\
		                                <div rule=2 class=\"prompt_selectList\">{{calendar_js_promt_changeall_event_lang}}</div>\
		                                <div rule=3 class=\"prompt_selectList\">{{calendar_js_promt_changeallfromnow_event_lang}}</div>\
		                            </div>');
							    } else {
							    	this.content('<div class=\"prompt_select\">\
							            <div rule=1 class=\"prompt_selectList prompt_selectListOn\">{{calendar_js_promt_changethis_event_lang}}</div>\
							            <div rule=2 class=\"prompt_selectList\">{{calendar_js_promt_changealldump_event_lang}}</div>\
							        </div>');
							    }
								$(".prompt_selectList").click(function () {
								     $(".prompt_selectList").removeClass("prompt_selectListOn");
								     $(this).addClass("prompt_selectListOn");
								});
							},
						})

                    }
                }
            }
        }
    }
    else if (txt == "{{calendar_js_savebtn_text_lang}}") {
        hideSearchResult();
        var editDetail = $("#editDetail");
        
        //活动的Id
        var id = editDetail.attr("eventId");
        //保存规则
        var rule = editDetail.attr("rule");
        
        //重复事件只编辑当天活动
        var todyDate =  editDetail.attr("todyDate");
        
        //原先时间的全天
        var originalAllDay = editDetail.attr("originalAllDay");
        
        //活动名称
        var title = editDetail.find("#editNameArea").val();
        title = title.replace(/^\s*|\s*$/g,"");
        //全天
        var allDay = 0;
        if($("#allDay").hasClass("allDayOn"))
        {
            allDay = 1;
        }
        
        //开始时间
		var tem;
        var beginDate = editDetail.find("#edit_beginDate").val();
		tem = beginDate.split(" ");
		beginDate = tem[0]+" ";
        //结束时间
        var endDate = editDetail.find("#edit_endDate").val();
        tem = endDate.split(" ");
		endDate = tem[0]+" ";
        if (allDay) {
            beginDate = beginDate + "00:00";
            endDate = endDate + "23:59";
        }
        else
        {
            beginDate = beginDate + editDetail.find("#edit_beginTime").val();
            endDate = endDate +  editDetail.find("#edit_endTime").val();
        }
        
        //地点
        var actLocation = editDetail.find("#editAddrArea").val();
        //描述
        var description = editDetail.find("#editInfoArea").val();
        description = description.replace(/^\s*|\s*$/g,"");
        
        
        //重复频率
        var repeat = $("#repeatType").attr("repeatType");
        
        //获取闹钟提醒
        var remind = "", bFlag = true;
        $("#remind_single").find(".remind_text").each(function () {
            if(bFlag)
            {
                remind = $(this).attr("time");
                bFlag = false;
            }
            else
            {
                remind =remind + " " + $(this).attr("time");
            }
        });
        
        //将活动信息封装成json格式传递给C++处理
        var param = '[{"id":"' + id + '",\
                       "rule":"' + rule + '",\
                       "title":"' + title + '",\
                       "beginDate":"' + beginDate + '",\
                       "endDate":"' + endDate + '",\
                       "location":"' + actLocation + '",\
                       "description":"' + description + '",\
                       "originalAllDay":"' + originalAllDay + '",\
                       "allDay":"' + allDay + '",\
                       "repeat":"' + repeat + '",\
                       "originalDate":"' + todyDate + '",\
                       "remind":"' + remind + '"}]';
        cef.param = param;
        cef.calendar("save");
        
        //以藏编辑状态
        hideEditStatus();
        
        //$("#sideBarCover").css("left","0px");
        
        $("#prevButton").addClass("disable");
        $("#nextButton").addClass("disable");
    }
    else if(txt == "{{calendar_js_deletebtn_text_lang}}") {
        
        hideSearchResult();
        //获取当前活动的Id，根据Id删除当前的活动
        showDelPrompt($("#eventDetail"));
    }
    else if(txt == "{{calendar_js_cancelbtn_text_lang}}") {
        //隐藏编辑界面
        hideEditStatus();
    }
}

//弹出删除提示框
function showDelPrompt(obj)
{
    //获取当前活动的Id，根据Id删除当前的活动
    var id = obj.attr("eventId");
    if (id == "-1") {
        return;
    }
    var rule = obj.attr("eventRule");
    var search = obj.attr("search");


	art.dialog({
		title : '{{calendar_js_deletedlg_title_lang}}',
		lock : true,
		dblclickNotHide : true,
		width: 300,
		okValue: '{{calendar_js_deletedlg_okbtn_lang}}',
		ok : function(){

			document.getElementById("bubble").style.display = "block";
	        document.getElementById("bubble_message").innerHTML = "<div class=\"bubble_text\"><div class=\"refresh\" ></div>{{calendar_js_deletedlg_hint_lang}}</div>";
	        var listOn = $(".prompt_selectListOn");
	        if (listOn.length == 0) {
	            if (rule != "0" && search == "1") {
	                rule = 2;
	            }
	            else
	            {
	                rule = 0;
	            }
	        }
	        else
	        {
	            rule = listOn.attr("rule");
	        }

	        var event_group = document.getElementById("event_group");
	        $(event_group).empty();
	        
	  
	        $("#prevButton").addClass("disable");
	        $("#nextButton").addClass("disable");
	        
	        //重复事件只编辑当天活动
	        var todyDate =  $("#eventDetail").attr("todyDate");
	        var param = '[{"id":"' + id + '", "modify_select":"' + rule + '", "todyDate":"' + todyDate + '"}]';
	        cef.param = param;
	        cef.calendar("deleteEvent");

        	return true;
		},
		cancelValue: '{{calendar_js_deletedlg_cancelbtn_lang}}',
		cancel : function(){
			return true;
		},
		initialize: function(){
		    if (rule == "0" || search == "1") {
		    	this.content("<div class=\"delPrompt_text\">{{calendar_js_deletedlg_deletethis_hint_lang}}</div>");
		    } else {
		    	this.content('<div class=\"prompt_select\">\
		            <div rule=1 class=\"prompt_selectList prompt_selectListOn\">{{calendar_js_deletedlg_deletethis_promt_lang}}</div>\
		            <div rule=3 class=\"prompt_selectList\">{{calendar_js_deletedlg_deletefromnow_promt_lang}}</div>\
		            <div rule=2 class=\"prompt_selectList\">{{calendar_js_deletedlg_deleteall_promt_lang}}</div>\
		        </div>');

	            $(".prompt_selectList").click(function () {
			        $(".prompt_selectList").removeClass("prompt_selectListOn");
			        $(this).addClass("prompt_selectListOn");
			    });
		    }
		},
	})
}


//弹出删除提示框
function showLeftDelPrompt(obj)
{
    //获取当前活动的Id，根据Id删除当前的活动
    var id = obj.attr("eventId");
    var rule = obj.attr("eventRule");

    art.dialog({
		title : '{{calendar_js_deletedlg_title_lang}}',
		lock : true,
		dblclickNotHide : true,
		width: 300,
		okValue: '{{calendar_js_deletedlg_okbtn_lang}}',
		ok : function(){

			document.getElementById("bubble").style.display = "block";
	        document.getElementById("bubble_message").innerHTML = "<div class=\"bubble_text\"><div class=\"refresh\" ></div>{{calendar_js_delete_hint_lang}}</div>";
	        var listOn = $(".prompt_selectListOn");
	        if (listOn.length == 0) {
	            rule = 0;
	        }
	        else
	        {
	            rule = listOn.attr("rule");
	        }

	        //重复事件只编辑当天活动
	        var todyDate;
	        
			obj.addClass('disable');
	        //获取
	        while (1) {
	            obj = obj.prev();
	            if (obj.hasClass("calTitle")) {
	                break;
	            }
	        }
	        //记录当前事件今天的年月日
	        todyDate =  obj.find(".calTitle-year").text();
	    
	        var param = '[{"id":"' + id + '", "modify_select":"' + rule + '", "todyDate":"' + todyDate + '"}]';
	        cef.param = param;
	        cef.calendar("deleteEvent");
	        
	        $("#prevButton").addClass("disable");
	        $("#nextButton").addClass("disable");

        	return true;
		},
		cancelValue: '{{calendar_js_deletedlg_cancelbtn_lang}}',
		cancel : function(){
			return true;
		},
		initialize: function(){
		    if (rule == "0") {
		    	this.content("<div class=\"delPrompt_text\">{{calendar_js_deletedlg_deletethis_hint_lang}}</div>");
		    } else {
		    	this.content('<div class=\"prompt_select\">\
		            <div rule=1 class=\"prompt_selectList prompt_selectListOn\">{{calendar_js_deletedlg_deletethis_promt_lang}}</div>\
		            <div rule=3 class=\"prompt_selectList\">{{calendar_js_deletedlg_deletefromnow_promt_lang}}</div>\
		            <div rule=2 class=\"prompt_selectList\">{{calendar_js_deletedlg_deleteall_promt_lang}}</div>\
		        </div>');

	            $(".prompt_selectList").click(function () {
			        $(".prompt_selectList").removeClass("prompt_selectListOn");
			        $(this).addClass("prompt_selectListOn");
			    });
		    }
		},
	})
}


//---------------------------------------------C++中调用的函数----------------------------------------

//初始化或刷新成功
function init (csJson) {

    //从c++获取时间
    cef.calendar("getDate");
    var param = cef.param;
    param = param.split(" ");
    param = param[0].split("-");

    var nY = param[0];
    if (nY > dateSelection.maxYear || nY < dateSelection.minYear) {
        nY = global.defaultYear;
    }
    
    var date = nY + "-" + param[1] + "-" + param[2];
    $("#preActivityIcon").text(date);
    $("#nextActivityIcon").text(getNextMonth(date));
    
    //初始化左边的列表
    setBetweenMonth(csJson);
    
    //将界面的布局的元数据进行初始化
    initInterFace();

    if(cef.isConnected()){
    	$('#newActivity,#removeAll,#importExport,#refresh').removeClass('disable');
    } else {
    	$('#newActivity,#removeAll,#importExport,#refresh').addClass('disable');
    }
    
}

//将界面的布局的元数据进行初始化
function initInterFace (){

    //将搜索框中内容清空,隐藏搜索结果
    document.getElementById("searchEvent").value = "";
    var searchResule = $("#searchResule");
    searchResule.css("top","-" + searchResule.height() + "px");
    
    //将日期的选择弹出框隐藏
    $("#dateSelectionDiv").hide();
    dateSelection.tmpMonth = -1;
    dateSelection.currMonth = -1;
    
    //初始化月界面，调用的是rili.js中的函数
    global.bRefresh = true;
    global.currSelectDay = null;
    initMonthInterface();
    
    //隐藏等待弹出框
    $("#bubble").hide();
    $("#prevButton").removeClass("disable");
    $("#nextButton").removeClass("disable");
}

//全局变量
var global = {
    csEventDetailJson : "" , //用来保存当前显示的某个活动
    csEditText : " ", //用来保存新建或编辑的第一次内容
    originalDate : " ",  //用来保存新建或编辑的第一次内容
    intervalObj : "",
    bLegal : false,    //便签是否合法
};

//在jquery中获取js中的全局变量
function getGlobalMember()
{
    return global.csEditText;
}

//设置导出列表中的活动
function setBetweenDate(csJson) {
    var export_List = document.getElementById("exportList");
    var exportList = $(export_List);
    exportList.empty();

    if (csJson != "" && csJson != null) {
        var root = "", div = "";
        
        csJson.sort(function(a, b) { return a.showDate > b.showDate ? 1 : -1;} );//升序
        
        for(var i=0;i<csJson.length;i++){ 
            startDate = csJson[i]["startDate"];
            endDate = csJson[i]["endDate"];
            
            root = document.createElement("li");
            root.setAttribute("rule",csJson[i]["rule"]);
            
            div = document.createElement("div");
            div.setAttribute("eventId",csJson[i]["id"]);
            div.setAttribute("class", "selOne");
            root.appendChild(div);
            
            
            div = document.createElement("div");
            div.setAttribute("class", "selTxt");
            temp = csJson[i]["title"];
            div.innerText = temp;
            root.appendChild(div);
            
            div = document.createElement("div");
            div.setAttribute("class", "selTxt");
            temp = csJson[i]["startDate"];
            div.innerText = temp;
            root.appendChild(div);
            
            div = document.createElement("div");
            div.setAttribute("class", "selTxt");
            temp = csJson[i]["endDate"];
            div.innerText = temp;
            root.appendChild(div);
            
            div = document.createElement("div");
            div.setAttribute("class", "selTxt");
            temp = csJson[i]["location"];
            div.innerText = temp;
            root.appendChild(div);
            
            div = document.createElement("div");
            div.setAttribute("class", "selTxt");
            temp = csJson[i]["description"];
            div.innerText = temp;
            root.appendChild(div);  

            export_List.appendChild(root);
        }
        
        //添加事件
        var exportLi = exportList.find("li");
        exportLi.unbind("click").click(function () {
            var len = 0;
            
            var checkBox = $(this).find(".selOne");
            var selList = $("#export_selList");
            if (checkBox.hasClass("selOn")) {
                checkBox.removeClass("selOn");
                $("#selAll").removeClass("selOn");
                len = selList.find(".selOn").length;
            }
            else {
                checkBox.addClass("selOn");
                len = selList.find(".selOn").length;
                if (selList.find("li").length == len) {
                    $("#selAll").addClass("selOn");
                }
            }
            
            if (len == 0) 
            {
                $("#sure_export").addClass("disable");
            }
            else
            {
                $("#sure_export").removeClass("disable");
            }
        })
  
    }
    else{
    
        var root = "";
        root = document.createElement("div");
        root.setAttribute("class","noCalendar");
        root.innerText = "{{calendar_js_noevent_toast_lang}}";
        export_List.appendChild(root);
        
    }
    
    //初始化导出框
    initExportDlg();
}


//设置左侧的月份间的活动列表
function setBetweenMonth(csJson) {
    var event_group = document.getElementById("event_group");
    $(event_group).empty();
    if (csJson != "" && csJson != null) {
        var root, div;
        var temp, startArr, endArr, startArr1, endArr2, startDate, endDate;
        var startDateRem,csLocation, showDate, remDate;
        
        csJson.sort(function(a, b) { return a.showDate > b.showDate ? 1 : -1;} );//升序
        for(var i=0;i<csJson.length;i++){ 
            startDate = csJson[i]["startDate"];
            endDate = csJson[i]["endDate"];
            startArr = startDate.split(" ");
            
            showDate = csJson[i]["showDate"];
            
            //显示日期标题栏
            if (remDate != showDate) {
                remDate = showDate;
                
                $(".calAction:last").addClass("noneBg");
            
                root = document.createElement("div");
                root.setAttribute("class", "calTitle");
                
                div = document.createElement("div");
                div.setAttribute("class", "calTitle-weak");
                div.innerText = getWeek(showDate);
                root.appendChild(div);
                
                div = document.createElement("div");
                div.setAttribute("class", "calTitle-year");
                div.innerText = showDate;
                root.appendChild(div);
                
                event_group.appendChild(root);
            }

            root = document.createElement("div");
            root.setAttribute("eventId",csJson[i]["id"]);
			root.setAttribute("calendarId",csJson[i]["calendarId"]);
            root.setAttribute("eventRule",csJson[i]["rule"]);
            root.setAttribute("showDate",showDate);
            root.setAttribute("class", "calAction");
            
            csLocation = csJson[i]["location"];
            
            div = document.createElement("div");
            if (csLocation == "") {
                div.setAttribute("class", "calActionNameM");
            }
            else
            {
                div.setAttribute("class", "calActionNameN");
            }
            temp = csJson[i]["title"];
            if (temp == "") {
                temp = "({{calendar_js_notitle_text_lang}})";
            }
            div.innerText = temp;
            root.appendChild(div);
            
            div = document.createElement("div");
            div.setAttribute("class", "delAct");
            root.appendChild(div);
            
            div = document.createElement("div");
            if (csLocation == "") {
                div.setAttribute("class", "calActionTime calActionTimeM");
            }
            else
            {
                div.setAttribute("class", "calActionTime calActionTimeN");
            }
            
            //显示时间段
            endArr = endDate.split(" ");
            if (startArr[0] == endArr[0] && endArr.length > 1) {
                temp = startArr[1] + " — " + endArr[1];
            }
            else if (startArr[0] == endArr[0] && endArr.length <= 1) {
                temp = startArr[0] + " — " + endArr[0];
            }
            else
            {
                startArr1 = startArr[0].split("-");
                endArr1 = endArr[0].split("-");
                
                if (startArr1[0] == endArr1[0]) {
                    temp = startArr1[1] + "-" + startArr1[2] + " " + startArr[1] + " — " + endArr1[1] + "-" + endArr1[2] + " " + endArr[1];
                }
                else{
                    temp = startArr[0] + " — " + endArr[0];
                }
            }
            div.innerText = temp;
            
            root.appendChild(div);
            
            if (csLocation != "") {
                div = document.createElement("div");
                div.setAttribute("class", "calActionLocation");
                div.innerText = csLocation;
                root.appendChild(div);
            }
            
            event_group.appendChild(root);
        }
        $(".calAction:last").addClass("noneBg");
        
        
        //添加事件
        $(".calAction").unbind("hover").unbind("click").hover(function () {
            $(this).addClass("calActionOn");
            $(this).find(".delAct").show();
        },function () {
            $(this).removeClass("calActionOn");
            $(this).find(".delAct").hide();
        }).click(function () {
            //判断是否在编辑状态下
            if(judgeSaveOrNot())
            {
                return;
            }
            
            $("#todayEventList").find("li").removeClass("liOn");
            $(".calAction").removeClass("calActionClick");
            $(this).addClass("calActionClick");
            getEventById($(this));
            
            //隐藏搜索结果窗口
            hideSearchRrsult();
        })
        
        $(".delAct").unbind("click").click(function () {
            var delPar = $(this).parent();
            hideSearchResult();
            //弹出删除提示框
            showLeftDelPrompt(delPar);
            stopBubble();
        })
    }
    else
    {
        var root = "";
        root = document.createElement("div");
        root.setAttribute("class","noActivity");
        root.innerText = "{{calendar_js_noactivity_toast_lang}}";
        event_group.appendChild(root);
    }
    
    var prevDate = $("#preActivityIcon").text();
    var nextDate = $("#nextActivityIcon").text();
    
    if( prevDate <= "1902-01-01")
    {
        $("#prevButton").addClass("disable");
    }
    else
    {
        $("#prevButton").removeClass("disable");
    }    
    if( nextDate >= "2037-12-01")
    {
        $("#nextButton").addClass("disable");
    }
    else
    {
        $("#nextButton").removeClass("disable");
    }
    
    
    //$("#sideBarCover").css("left","-190px");
}

//根据Id获取事件
function getEventById(obj,search)
{
    var id = obj.attr("eventId");
    var todyDate,beginDate,endDate,beDate, calObj;
    if (obj.hasClass("calAction")) {
    
        //记录当前事件今天的年月日
        todyDate =  obj.attr("showDate");
        
        beDate = obj.find(".calActionTime").text();
        beDate = beDate.split(" — ");
        beginDate = beDate[0];
        endDate = beDate[1];
        
    }
    else if(obj.hasClass("todayLi") || search)
    {
        //记录当前事件今天的年月日
        var m ,d;
        m = parseInt($("#yue").text(),10);
        d = parseInt($("#ri").text(),10);
        if (m<10) {
            m = "0" + m;
        }
        if (d<10) {
            d = "0" + d;
        }
        todyDate =  $("#nian").text() + "-" + m + "-" + d;
        
        beginDate = obj.find("div:eq(1)").text();
        endDate = obj.find("div:eq(2)").text();
    }
    
    if (search) {
        search = 1;
    }
    else
    {
        search = 0;
    }
    
    var param = "[{\"todyDate\":\"" + todyDate + "\" , \"eventId\":\"" + id + "\" , \"beginDate\":\"" + beginDate + "\" , \"endDate\":\"" + endDate + "\" , \"search\":\"" + search + "\"}]";
	cef.param = param;
    cef.calendar("getEventDetailById");
}

//显示某个活动type为1默认优先显示左侧列表活动详情，为负值表示默认优先显示当天活动详情
function defaultEventDetail ()
{
    $("#event_group").find(".calActionClick").removeClass("calActionClick");
    
    var todayList = $("#todayEventList");
    var len = todayList.find("li").length;
    if ( len > 0)
    {
        todayList.find("li").removeClass("liOn");
        var first = todayList.find("li:first");
        first.addClass("liOn");
        getEventById(first);
    }
    else
    {
        $("#eventDetail").empty();
        $("#detailEdit").text("{{calendar_js_editbtn_text_lang}}").addClass("disable");
        $("#detailDel").text("{{calendar_js_deletebtn_text_lang}}").addClass("disable");
    }
    
    //设置全部删除按钮的可用性
    var size = 0;
    size = cef.calendar("getEventSize");
    console.log("size = "+size);
    //var b = parseInt(cef.param,10);
    if (size > 0){
        $("#removeAll").removeClass("disable");
    }
    else
    {
        $("#removeAll").addClass("disable");
    }
}

//设置今天的活动的列表
function setTodayEvent(csJson)
{
    var today = document.getElementById("todayEventList");
    var jqueryToday = $("#todayEventList");
    jqueryToday.empty();
    if (csJson != "" && csJson != null) {
        var root = "", div = "";
        var temp = "";
        var date ="";
		csJson.sort(function (a,b){
			var tmp = "1970/01/01 ";
			var startTimeA = Date.parse(tmp + a.startDate);
			var startTimeB = Date.parse(tmp + b.startDate);
			return startTimeA - startTimeB;
		});
        for(var i=0;i<csJson.length;i++){ 
            root = document.createElement("li");
            root.setAttribute("eventId",csJson[i]["id"]);
			root.setAttribute("calendarId",csJson[i]["calendarId"]);
            root.setAttribute("class","todayLi");
            
            //标题
            div = document.createElement("div");
            temp = csJson[i]["title"];
            if (temp == "") {
                temp = "({{calendar_js_notitle_text_lang}})";
            }
            div.innerText = "    " + temp;
            root.appendChild(div);
            //开始时间段
            date = csJson[i]["startDate"];
            div = document.createElement("div");
            //date = date.split(" ");
            div.innerText = date;//formatTime(date[1]);
            root.appendChild(div);
            //开始时间段
            date = csJson[i]["endDate"];
            div = document.createElement("div");
            //date = date.split(" ");
            div.innerText = date;//formatTime(date[1]);
            root.appendChild(div);
            //活动地点
            div = document.createElement("div");
            div.innerText = csJson[i]["location"];
            root.appendChild(div);
            //活动描述
            div = document.createElement("div");
            div.innerText = csJson[i]["description"];
            root.appendChild(div);
            
            today.appendChild(root);
        }
        
        
        //添加事件
        jqueryToday.find("li").unbind("hover").unbind("click").hover(function () {
            $(this).css("background-color","#B7DBEA");
        },function () {
            $(this).css("background-color","transparent");
        }).click(function () {
            if (judgeSaveOrNot()) {
                return;
            }
            
            jqueryToday.find("li").removeClass("liOn");
            $(this).addClass("liOn");
            $("#event_group").find(".calAction").removeClass("calActionClick");
            
            getEventById($(this));
        })
    }
    else
    {
        var root = "";
        root = document.createElement("div");
        root.setAttribute("class","noCalendar");
        root.innerText = "{{calendar_js_noevent_text_lang}}";
        today.appendChild(root);
    }
    //初始化选中项
    defaultEventDetail();

}

//设置右侧的活动的详细信息
function setEventDetail(csJson) {
    //保存当前的json数据供编辑的时候使用
    global.csEventDetailJson = csJson;
    
    if (csJson != "") {
        //显示详情界面
        var eventD = $("#eventDetail");
        eventD.empty();
        var remDate,week, minutes,minutesText,beginDate,endDate,title,description,loca;
        var minutesArr = new Array,j = 0,todyDate,startDate;
        for(var i=0;i<csJson.length;i++){ 
            if (i == 0) {
                todyDate = csJson[i]["todyDate"];
                eventD.attr("eventId",csJson[i]["id"]);
				eventD.attr("calendarId",csJson[i]["calendarId"]);
                eventD.attr("eventRule",csJson[i]["rule"]);
                eventD.attr("todyDate",todyDate);
                eventD.attr("search",csJson[i]["search"]);

                title = csJson[i]["title"];
                if (title == "") {
                    title = "({{calendar_js_notitle_text_lang}})";
                }
                
                
                var repeat = parseInt(csJson[i]["rule"],10);
                
                //设置开始时间
                date = csJson[i]["startDate"];
                remDate = date;
                
                beginDate = date.replace("-","{{calendar_js_date_year_lang}}");
                beginDate = beginDate.replace("-","{{calendar_js_date_month_lang}}");

                date = csJson[i]["endDate"];
                endDate = date.replace("-","{{calendar_js_date_year_lang}}");
                endDate = endDate.replace("-","{{calendar_js_date_month_lang}}");

                loca = csJson[i]["location"];
                if (loca == "") {
                    loca = "({{calendar_js_nolocation_text_lang}})";
                }

                description = csJson[i]["description"];
                if (description == "") {
                    description = "({{calendar_js_nodescription_text_lang}})";
                }

                eventD.append("<div class=\"detail_item\">\
                    <div class=\"detail_item_content\">\
                        <div class=\"detail_item_name\">&nbsp;" + title + "</div>\
                        <div class=\"detail_item_begin\">{{calendar_js_event_begindate_text_lang}}" + beginDate + "</div>\
                        <div class=\"detail_item_end\">{{calendar_js_event_enddate_text_lang}}" + endDate + "</div>\
                        <div class=\"detail_item_addr\">&nbsp;" + loca + "</div>\
                        <div class=\"detail_item_info\">&nbsp;" + description + "</div>\
                    </div>\
                </div>");
                
				var suffix = {{calendar_js_suffix_lang}};
				var isLastweek = false;
                switch(repeat)
                {
                case 0:
                    repeat = "{{calendar_js_once_event_lang}}";
                    break;
                case 1:
                    repeat = "{{calendar_js_everyday_lang}}";
                    break;
                case 2:
                    repeat = "{{calendar_js_everyweekday_lang}}";
                    break;
                case 3:
                    remDate = remDate.split(" ");
                    remDate = remDate[0];
                    remDate = getWeek(remDate);
                    repeat = "{{calendar_js_everyweek_lang}}({{calendar_js_everyweek_frequece_lang}}" +" "+ remDate + ")";
                    
                    break;
                case 4:
					var oridate = csJson[i]["startDateOri"];
					oridate = oridate.split(" ")[0];
					if(getWeekNum(oridate) == 5)
						isLastweek = true;
                    remDate = remDate.split(" ");
                    remDate = remDate[0];
                    week = getWeekNum(remDate);
                    remDate = getWeek(remDate);
                    if(isLastweek)
						repeat = "{{calendar_js_everymonth_lang}}({{calendar_js_everymonth_lastweek_lang}}" +  remDate + ")";
					else
						repeat = "{{calendar_js_everymonth_lang}}({{calendar_js_everymonth_frequece_lang}}" + week +suffix[week%30]+"{{calendar_js_one_attr_lang}}"+" " +  remDate + ")";
                    break;
                case 5:
                    remDate = remDate.split(" ");
                    remDate = remDate[0];
                    remDate = remDate.split("-");
                    
                    repeat = "{{calendar_js_everymonth_lang}}(" + remDate[2]+suffix[remDate[2]%30] + "{{calendar_js_date_day_lang}})";
                    break;
                case 6:
                    remDate = remDate.split(" ");
                    remDate = remDate[0];
                    remDate = remDate.split("-");
                    
                    repeat = "{{calendar_js_everyyear_lang}}(" + remDate[1] + "{{calendar_js_date_month_lang}}" + remDate[2] + "{{calendar_js_date_day_lang}})";
                    break;
                }
                eventD.append("<div class=\"detail_sigle\">\
                            <div class=\"detail_lable\">{{calendar_js_event_repeat_hint_text_lang}}</div>\
                            <div class=\"detail_minutes\">" + repeat + "</div>\
                        </div>");
            }
            else
            {
                minutes = parseInt(csJson[i]["minutes"],10);
                //将时间进行排序
                minutesArr[j] = minutes;
                j ++;
            }
        }
        
        minutesArr.sort(function compare(a,b){return a-b;});
        for (var i = 0; i < minutesArr.length; i++) {
			switch(minutesArr[i])
			{
			case 0:
				minutesText = "{{calendar_js_on_time_lang}}";
				break;
			case 5:
				minutesText = "5 {{calendar_js_time_minute_lang}}";
				break;
			case 15:
				minutesText = "15 {{calendar_js_time_minute_lang}}";
				break;
			case 30:
				minutesText = "30 {{calendar_js_time_minute_lang}}";
				break;
			case 60:
				minutesText = "1 {{calendar_js_time_hour_lang}}";
				break;
			case 120:
				minutesText = "2 {{calendar_js_time_hour_lang}}";
				break;
			case 1440:
				minutesText = "1 {{calendar_js_time_day_lang}}";
				break;
			case 2880:
				minutesText = "2 {{calendar_js_time_day_lang}}";
				break;
			case 10080:
				minutesText = "1 {{calendar_js_time_week_lang}}";
				break;
			}    
            eventD.append("<div class=\"detail_sigle\">\
                        <div class=\"detail_lable\">{{calendar_js_prereminder_lang}}</div>\
                        <div class=\"detail_minutes\">" + minutesText + "</div>\
                    </div>");
        }
        
        //将两个按钮设置成可用状态
        

    }
    else
    {
        //显示新建界面
    }
    
    hideEditStatus();
}

function setEventEdit(rule) {
    var csJson = global.csEventDetailJson;
    if (csJson != "" && csJson != null) {
        //清空提醒
        var remind = $("#remind_single");
        remind.html("");
        
        //显示编辑界面
        var eventEdit = document.getElementById("editDetail");
        var eventEditObj = $(eventEdit);
        var csTemp, repeatType, date = "",m = "01",d = "01",week,remDate;
        var remWeek,remNum = "一";//,remBeginDate,startDate;
        var minutes = 0, minutesText;
        var minutesArr = new Array,j = 0;
        for(var i=0;i<csJson.length;i++){ 
            if (i == 0) {
                //活动id
                eventEditObj.attr("eventId",csJson[i]["id"]);
                eventEditObj.attr("rule",rule);
                eventEditObj.attr("todyDate",csJson[i]["startDate"]);
                eventEditObj.attr("originalAllDay",csJson[i]["isAllDay"]);
                //标题
                var titleObj = document.getElementById("editNameArea");
                titleObj.value = csJson[i]["title"];
                //设置高度
                initTextareaHeight(titleObj);
                        
                //开始时间
                if (rule == "2") {
                    date = csJson[i]["startDateOri"];
                }
                else
                {
                    date = csJson[i]["startDate"];
                }

                week = date.split(" ");
                date = date.split(" ");

                remDate = date[0].split("-");
                
                //获取星期
                remWeek = getWeek(week[0]);
                //获取月中的第几周
                remNum = getWeekNum(date[0]);
                
                document.getElementById("edit_beginDate").value = date[0] + " " + remWeek;
                var time = formatTime(date[1]);
                document.getElementById("edit_beginTime").value = time;
                
                //结束时间
                if (rule == "2") {
                    date = csJson[i]["endDateOri"];
                }
                else
                {
                    date = csJson[i]["endDate"];
                }

                week = date.split(" ");
                date = date.split(" ");
                
                document.getElementById("edit_endDate").value = date[0] + " " + getWeek(week[0]);
                document.getElementById("edit_endTime").value = formatTime(date[1]);
                
                //是否全天
                csTemp = csJson[i]["isAllDay"];
                if (csTemp == "0")
                {
                    $("#allDay").removeClass("allDayOn");
                    $("#edit_beginDate").width(155);
                    $("#edit_endDate").width(155);
                    $("#edit_endTime").show();
                    $("#edit_beginTime").show();
                }
                else
                {
                    $("#allDay").addClass("allDayOn");
                    //将时间选项隐藏
                    $("#edit_endTime").hide();
                    $("#edit_beginTime").hide();
                    $("#edit_beginDate").width(190);
                    $("#edit_endDate").width(190);
                }
                var suffix= {{calendar_js_suffix_lang}};
                //活动地点
                var eventLocationObj = document.getElementById("editAddrArea");
                eventLocationObj.value = csJson[i]["location"];
                //设置高度
                initTextareaHeight(eventLocationObj);
                
                //活动说明
                var descriptionObj = document.getElementById("editInfoArea");
                descriptionObj.value = csJson[i]["description"];
                //设置高度
                initTextareaHeight(descriptionObj);
                
                //重复说明
                repeatType = csJson[i]["rule"]
				
				//仅修改此次活动时，重复规则自动锁定为“一次性活动”
				if(rule == "1")
				{
					repeatType = "0";
					$("#repeat_single .upArrow").hide();
				}
				else
				{
					$("#repeat_single .upArrow").show();
				}
				
                //remWeek = remWeek.substring(1,2);
                if (repeatType == "0") {
                    csTemp = "{{calendar_js_once_event_lang}}";
                }
                else if (repeatType == "1") {
                    csTemp = "{{calendar_js_everyday_lang}}";
                }
                else if (repeatType == "2") {
                    csTemp = "{{calendar_js_everyweekday_lang}}";
                }
                else if (repeatType == "3") {
                    csTemp = "{{calendar_js_everyweek_lang}}({{calendar_js_everyweek_frequece_lang}} " + remWeek+")";
                }
                else if (repeatType == "4") {
				
					csTemp = "{{calendar_js_everymonth_lang}}({{calendar_js_everymonth_frequece_lang}} " + remNum + '{{calendar_js_one_attr_lang}}'+suffix[remNum%30]+" " + remWeek + ")";
					//若是第5周，则标记为最后一周
					if(remNum == 5)
					{
						csTemp = "{{calendar_js_everymonth_lang}}({{calendar_js_everymonth_lastweek_lang}}" + remWeek + ")";
					}    
                }
                else if (repeatType == "5") {
                    csTemp = "{{calendar_js_everymonth_lang}}(" + remDate[2]+suffix[remDate[2]%30]+ "{{calendar_js_date_day_lang}})";
                }
                else if (repeatType == "6") {
                    csTemp = "{{calendar_js_everyyear_lang}}("+remDate[1] + "{{calendar_js_date_month_lang}}" + remDate[2] + "{{calendar_js_date_day_lang}})";
                }
                else
                {
                    csTemp = "{{calendar_js_once_event_lang}}";
                }
                $("#repeatType").text(csTemp).attr("repeatType",repeatType);
            }
            else
            {  
                minutes = parseInt(csJson[i]["minutes"],10);
                minutesArr[j] = minutes;
                j++;
            }
        }
        
        minutesArr.sort(function compare(a,b){return a-b;});
        for (var i = 0; i < minutesArr.length; i++) {
			switch(minutesArr[i])
			{
			case 0:
				minutesText = "{{calendar_js_on_time_lang}}";
				break;
			case 5:
				minutesText = "5 {{calendar_js_time_minute_lang}}";
				break;
			case 15:
				minutesText = "15 {{calendar_js_time_minute_lang}}";
				break;
			case 30:
				minutesText = "30 {{calendar_js_time_minute_lang}}";
				break;
			case 60:
				minutesText = "1 {{calendar_js_time_hour_lang}}";
				break;
			case 120:
				minutesText = "2 {{calendar_js_time_hour_lang}}";
				break;
			case 1440:
				minutesText = "1 {{calendar_js_time_day_lang}}";
				break;
			case 2880:
				minutesText = "2 {{calendar_js_time_day_lang}}";
				break;
			case 10080:
				minutesText = "1 {{calendar_js_time_week_lang}}";
				break;
			default:
			    minutesArr[i] = 0;
				minutesText = "{{calendar_js_on_time_lang}}";
			}
            //填充提醒
            csTemp = '<div class="edit_single" onclick="showRemindSel(this)">\
                    <div class="edit_del"></div>\
                    <div class="upArrow"></div>\
                    <div class="label_edit">{{calendar_js_prereminder_lang}}</div>\
                    <div time ="'+ minutesArr[i] + '" class="remind_text">'+  minutesText + '</div>\
                    <div class="remindSel"></div></div>';

            remind.append(csTemp);
            
            //删除图标按钮事件
            remind.find(".edit_del:last").unbind("click").click(function () {
                $(this).parent().remove();   
                $("#editAdd").show();
                
                //判断保存按钮的可用性
                judgeCanUse();  
            })
        }
        
        if (remind.find(".edit_single").length >= 5) {
            $("#editAdd").hide();
        }
    }
    else
    {
        //显示新建界面
    }    
    
    //保存初始编辑状态的数据
    global.csEditText = getEditText();
}

//显示编辑状态
function showEditStatus(){
    hideSearchResult();
    
    var edit = $("#activity_edit");
    edit.show();
    edit.css("right","0px");
    $("#detailEdit").text("{{calendar_js_savebtn_text_lang}}").addClass("disable");
    $("#detailDel").text("{{calendar_js_cancelbtn_text_lang}}").removeClass("disable");

    //隐藏弹出框
    $(".coverScreen").hide();
}

//隐藏编辑状态
function hideEditStatus(){
    var edit = $("#activity_edit");
    edit.css("right","-270px");
    edit.hide();
    var eventD = $("#eventDetail");
    if (eventD.html() != "" && eventD.attr("calendarId") == 1) {
        $("#detailEdit").text("{{calendar_js_editbtn_text_lang}}").removeClass("disable");
        $("#detailDel").text("{{calendar_js_deletebtn_text_lang}}").removeClass("disable");
    }
    else
    {
        eventD.attr("eventId","-1");
        eventD.attr("eventRule","-1");
        eventD.attr("todyDate","-1");
                
        $("#detailEdit").text("{{calendar_js_editbtn_text_lang}}").addClass("disable");
        $("#detailDel").text("{{calendar_js_deletebtn_text_lang}}").addClass("disable");
    }
}

//隐藏搜索框
function hideSearchResult(){
    $("#searchEvent").val("");
    searchResule = $("#searchResule");
    searchResule.css("top","-" + searchResule.height() + "px");
}

//判断保存按钮是否可用
function judgeCanUse()
{
    if(global.csEditText != getEditText())
    {
        if(global.bLegal == true) {
            hideSearchResult();
            $("#detailEdit").removeClass("disable");
        }
        else {
            $("#detailEdit").addClass("disable");
        }
    }
    else
    {
        $("#detailEdit").addClass("disable");
    }
}

//判断导出部分时间的合法性,type为0表示操作的是开始时间，为1表示操作的是结束时间
function judgeExportTime(type)
{
    //获取开始和结束日期时间句柄
    var bObj = document.getElementById("exportPopBeginDate");
    var eObj = document.getElementById("exportPopEndDate");
    
    //获取开始和结束日期时间数值
    var bDate = bObj.value;
    bDate = bDate.split(" ");
    bDate = bDate[0];
    var eDate = eObj.value;
    eDate = eDate.split(" ");
    eDate = eDate[0];
    
    if (type)
    {
        if (bDate > eDate) {
            bDate = getPrevDay(eDate);
            bObj.value = bDate + " " + getWeek(bDate);
        }
    }
    else
    {
        if (bDate > eDate) {
            eDate = getNextDay(bDate);
            eObj.value = eDate + " " + getWeek(eDate);
        }
    }
    
    //重新初始化导出窗口中的内容
    bDate = bObj.value;
    bDate = bDate.split(" ");
    bDate = bDate[0];
    eDate = eObj.value;
    eDate = eDate.split(" ");
    eDate = eDate[0];
    
        
    var param = "[{\"beginDate\":\"" + bDate + "\" , \"endDate\":\"" + eDate + "\"}]";
	cef.param = param;
	cef.calendar("betweenDate");
}

//判断编辑部分时间的合法性,type为0表示操作的是开始时间，为1表示操作的是结束时间
function judgeTime(type)
{
    //获取开始和结束日期时间句柄
    var beginDateObj = document.getElementById("edit_beginDate");
    var beginTimeObj = document.getElementById("edit_beginTime");
    var endDateObj = document.getElementById("edit_endDate");
    var endTimeObj = document.getElementById("edit_endTime");
    
    //获取开始和结束日期时间数值
    var beginDate = beginDateObj.value;
    beginDate = beginDate.split(" ");
    beginDate = beginDate[0];
    var beginTime = beginTimeObj.value;
    var endDate = endDateObj.value;
    endDate = endDate.split(" ");
    endDate = endDate[0];
    var endTime = endTimeObj.value;
    
    var hour,minute;
    
    //判断是否是全天
    if ($("#allDay").hasClass("allDayOn"))
    {
        if (type) {
            //当前操作的是结束日期
            beginDateObj.value = endDate + " " + getWeek(endDate);
        }
        else
        {
            endDateObj.value = beginDate + " " + getWeek(beginDate);
        }  
        return;
    }
    
    //非全天操作
    if (beginDate > endDate)
    {
        if (type) {
            //当前操作的是结束日期
            beginDate = getPrevDay(endDate);
            beginDateObj.value = beginDate + " " + getWeek(beginDate);
        }
        else
        {
            if (beginTime > endTime) {
                endDate = getNextDay(beginDate);
            }
            else
            {
                endDate = beginDate;
            }
            endDateObj.value = endDate + " " + getWeek(endDate);
        }    
    }
    else if(beginDate == endDate)
    {
        //当日期是同一天
        if(beginTime > endTime)
        {
            if (type) {
                //当前操作的是结束日期
                beginTime = endTime.split(":");
                hour = parseInt(beginTime[0],10);
                minute = beginTime[1];
                hour--;
                
                if (hour < 0 ) {
                    hour = 23;
                    beginDate = getPrevDay(beginDate);
                    //重新设置日期
                    beginDateObj.value = beginDate + " " + getWeek(beginDate);
                }
                if (hour<10) {
                    hour = "0" + hour;
                }
                beginTime = hour + ":" + minute;

                //重新设置时间
                beginTimeObj.value = beginTime;
            }
            else
            {
                //当前操作的是开始日期
                endTime = beginTime.split(":");
                hour = parseInt(endTime[0],10);
                minute = endTime[1];
                
                hour ++;
                if (hour >= 24 ) {
                    hour = 0;
                    endDate = getNextDay(endDate);
                    //重新设置日期
                    endDateObj.value = endDate + " " + getWeek(endDate);
                }
                if (hour<10) {
                    hour = "0" + hour;
                }
                endTime = hour + ":" + minute; 
                
                //重新设置时间
                endTimeObj.value = endTime;
            }
                
        }
        else if (beginTime == endTime) {
            //不做任何操作
        }
    
    }
    else if(beginDate < endDate)
    {
        //不做任何操作
    }
}

//获取编辑时候，编辑窗口中的所有文本
function getEditText() {
    var temp = "",bTime,eTime;
    
    var name = $("#editNameArea").val();
    var note = $("#editInfoArea").val();
    name = name.replace(/^\s*|\s*$/g,"");
    note = note.replace(/^\s*|\s*$/g,"");

    if(name.length!=0 || note.length!=0) {
        global.bLegal = true;
    }
    else {
        global.bLegal = false;
    }
    var act = $("#activity_edit");
    //活动名称
    temp = act.find("#editNameArea").val();
    
    //开始日期
    temp = temp + act.find("#edit_beginDate").val();
    
    bTime = act.find("#edit_beginTime");
    if (bTime.css("display")!="none") {
        temp = temp + bTime.val();
    }

    //结束日期
    temp = temp + act.find("#edit_endDate").val(); 
    
    eTime = act.find("#edit_endTime");
    if (eTime.css("display")!="none") {
        temp = temp + eTime.val();
    } 
    
    //活动地点、说明
    temp = temp + act.find("#editAddrArea").val();
    temp = temp + act.find("#editInfoArea").val();
    
    //获取重复频率文本
    temp = temp + act.find("#repeatType").text();
    act.find("#remind_single").find(".remind_text").each(function () {
        temp = temp + $(this).text();
    })
    return temp;
}

//判断是否放弃修改
function judgeSaveOrNot(){
    
    if ($("#detailEdit").hasClass("disable") || $("#activity_edit").css("right") == "-270px") {
        hideEditStatus();
        return false;
    }
    else
    {
    	art.dialog({
			title : '{{calendar_js_event_edittip_hint_lang}}',
			content : '{{calendar_js_event_edittip_content_lang}}',
			lock : true,
			dblclickNotHide : true,
			width: 300,
			okValue: '{{calendar_js_event_edittip_okbtn_text_lang}}',
			ok : function(){
				hideEditStatus();
	        	return true;
			},
			cancelValue: '{{calendar_js_event_edittip_cancelbtn_text_lang}}',
			cancel : function(){
				return true;
			}
		})
    }
    return true;
}

//显示编辑界面
//隐藏搜索窗口
function hideSearchRrsult() {
    document.getElementById("searchEvent").value = "";
    var searchResult = $("#searchResule");
    searchResult.css("top","-" + searchResult.height() + "px");
}

//搜索成功
function setSearchResult (csJson) {
    var searchL = $("#search_list");
    
    //清空搜索结果界面
    searchL.empty();
    
    //初始化搜索个数
    var searchNum = document.getElementById("searchNum");
    searchNum.innerText = 0;
    
    if (csJson != "" && csJson != null) {
        var li = "", div = "";
        
        var len = csJson.length;
        
        //设置搜索个数
        searchNum.innerText = len;
        
        for(var i=0;i<len;i++){ 
            csTemp = "<li eventId=\"" + csJson[i]["id"] + "\"><div>" + csJson[i]["title"] + "</div>\
                <div>" + csJson[i]["startDate"] + "</div>\
                <div>" + csJson[i]["endDate"] + "</div>\
                <div>" + csJson[i]["location"] + "</div>\
                <div>" + csJson[i]["description"] + "</div></li>";
            searchL.append(csTemp);
 　　    } 
 　　    
        searchL.find("li").unbind("hover").unbind("click").hover(function () {
            $(this).css("background-color","#B7DBEA");
        },function () {
            $(this).css("background-color","transparent");
        }).click(function () {
        
            //判断是否在编辑状态下
            if(judgeSaveOrNot())
            {
                return;
            }
            searchL.find("li").removeClass("liOn");
            $("#event_group").find(".calAction").removeClass("calActionClick");
            $("#todayEventList").find("li").removeClass("liOn");
            $(this).addClass("liOn");
            
            getEventById($(this),1);
        })
 　　    
    }
    else
    {
        searchL.empty();
    }
}

//保存或删除成功
function saveOrDelSuccess()
{
    //需要重部分新初始化
    var startDate = $("#preActivityIcon").text();
    var endDate = $("#nextActivityIcon").text();
    var param = "[{\"beginDate\":\"" + startDate + "\" , \"endDate\":\"" + endDate + "\"}]";
	cef.param = param;
	cef.calendar("betweenMonth");
	
	
	var SY = document.getElementById("nian").innerText;
	var SM = parseInt(document.getElementById("yue").innerText,10);
	global.currSelectDay = parseInt(document.getElementById("ri").innerText,10);
	global.bRefresh = false;
    drawCld(SY, SM - 1);
    
    $("#bubble").hide();
    
    $("#prevButton").removeClass("disable");
    $("#nextButton").removeClass("disable");
    
    
    document.getElementById("bubble").style.display = "none";
}

//设置导入日历的总人数
function showImportPross() {
    //弹出导出联系人提示
    art.dialog({
    	id: 'importDlg',
		title : '{{calendar_js_importdlg_title_lang}}',
		content : '<div class=refresh ></div>{{calendar_js_importdlg_hint_text_lang}}',
		lock : true,
		dblclickNotHide : true,
		width: 300,
		cancelValue: '{{calendar_js_importdlg_cancelbtn_text_lang}}',
		cancel : function(){
			cef.calendar("stopImport");
			return true;
		}
	});
}

function startImport(nCnt){
	art.dialog.get('importDlg').content(document.getElementById("processScript").innerHTML);
	document.getElementById("nCnt").innerHTML = nCnt;
}

function onProcess(nDone){
	$('#nDone').text(nDone);
	$('#nCnt').text(nCnt);
	var nCnt = parseInt(document.getElementById("nCnt").innerHTML);
	$("#process").css("width", nDone/nCnt*230);
}


//关闭导入窗口   
function fileCheckError() {
    //弹出导出联系人提示
    art.dialog.get('importDlg').content("<div>{{calendar_js_importfail_hint_text_lang}}</div>");
    setTimeout(function () {
        CloseArtDialog();
    },1000);    
} 


function onImportFinish(){
	$('.process_text').html('{{calendar_js_import_success_hint_text_lang}}');
    setTimeout(function () {
        CloseArtDialog();
        $('#refresh').click();
    },1000);  
}

function CloseArtDialog(){
	var dialogs = art.dialog.get();
	for(var id in dialogs){
		dialogs[id].close();
	}
}

function closeAllChildWindow(){
    CloseArtDialog();
    $("#popInOrOut").hide();
}