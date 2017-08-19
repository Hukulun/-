$(document).ready(function () {    
    
    //去除cef中log：event.layerX and event.layerY are broken and deprecated in WebKit. 
    //They will be removed from the engine in the near future.
    $.event.props = $.event.props.join('|').replace('layerX|layerY|', '').split('|');
    
    global.myIframeObj = $("#myIframe");
    
    
    $(".category").click(function () {
	    var obj = $(this);
	    //obj.find(".category Down").css("background-position-x","0px");
	    var id = obj.attr("id");
	    if (!obj.hasClass("category-selected")) {
	        $(".category-selected").removeClass("slideDown category-selected");
			obj.addClass("slideDown category-selected");;
	        $(".app_group").slideUp();
	        obj.next().slideToggle();
	        if (id == "phoneMedia") {
	            showVivoPart();
	        }
/* 	        else if(id == "thirhMedia") {
	            showThirdPart();
	        }
	        else 
	        {
	            showThirdPart();
	        } */
	    }else{
			obj.hasClass("slideDown")?obj.removeClass("slideDown"):obj.addClass("slideDown");
			obj.next().slideToggle();
		}
	});
	$("#phoneMedia").click();
    
    /* $("#thirdMediaList").find(".category-list").mousedown(function () {
        var tempObj = $(this);
        var objId = tempObj.attr("id");
        //统计使用
        countUse(objId);
        var id = "";
        if (tempObj.hasClass("tuijian"))
        {
            id = "third" + objId + "Part";
        }
        else
        {
            id = objId + "Part";
        }
        $("#thirdMediaList").find(".category-list").removeClass("category-list-click");
        tempObj.addClass("category-list-click");
        $(".category").css("background-position-y","0px");
        if (id != global.thirdPartId) {
            var thirdPartId = global.thirdPartId;
            global.thirdPartId = id;
            if (tempObj.hasClass("tuijian")) {
                var thirdObj = document.getElementById(id);
                if (thirdObj != undefined) {
					if(typeof thirdPartId != "undefined")
						document.getElementById(thirdPartId).style.display = "none";
                    document.getElementById(id).style.display = "block";
                }
                else
                {
                    var strUrl = tempObj.attr("url");
                    var loadingId = objId + "Loading";
                    var tempId = "third"+ objId + "Iframe";
                    var iframeId = objId + "Iframe";
                    var content = '<div id="'+ id + '">'
                       + '<div class="menuBar appManager">'
                       + '<div id="thirdGoBack" onclick="thirdGoBack(this)" class="menu-nav disable"><div class="prevIcon"></div></div>'
					   + '<div class="menu-nav-split"></div>'
                       + '<div id="thirdGoForward" onclick="thirdGoForward(this)" class="menu-nav disable"><div class="nextIcon"></div></div>'
					   + '<div class="menu-nav-split"></div>'
                       + '<div onclick="refreshThird(this)" class="menu-nav"><div class="refreshIcon"></div></div>'
                       + '</div>'
                        + '<div id="' + tempId + '"  class="marginTop"><iframe class="iframeHide iframeShow" id="'+ iframeId +'" src="' + strUrl + '" onload="getDress(\'' + objId + '\');"></iframe></div>'
                        + '<div id="'+ loadingId + '" class="iframeLoading"></div>'
                        + '</div> ';
                    $("#thirdPart").append(content);
                    
                	$(".menu-nav").unbind("hover").unbind("mousedown").unbind("mouseup").hover(function () {
                        if ($(this).hasClass("disable")) {
                            return;
                        }
                        $(this).addClass("menu-nav-on");
                        },function () {
                            if ($(this).hasClass("disable")) {
                                return;
                            }
                            $(this).removeClass("menu-nav-on");
                            $(this).removeClass("menu-nav-down");
                        }).mousedown(function () {
                            if ($(this).hasClass("disable")) {
                                return;
                            }
                            $(this).removeClass("menu-nav-on");
                            $(this).addClass("menu-nav-down");
                        }).mouseup(function () {
                            if ($(this).hasClass("disable")) {
                                return;
                            }
                            $(this).removeClass("menu-nav-down");
                            $(this).removeClass("menu-nav-on");
                        })
	
                        var obj = document.getElementById(loadingId);
                        obj.style.display = "block";
//                        $("#" + tempId).ready(function () {
//                            setTimeout(function () {
//                                obj.style.display = "none";
//                            },5000)
//                        });

                        $.ajax({
                           type: "get",
                           url: strUrl,
                           data: "",
                           dataType:"html",
                           beforeSend:function(){
                            //frames['rightFrame'].document.body.innerHTML=loadHtml;
                            //frames["rightFrame"].document.close(); 
                            //frames["rightFrame"].document.write(loadHtml);   
                            
                           },
                           success: function(msg){
                                //$("#rightFrame").Document.body.html(msg);
                               //frames["rightFrame"].document.close(); 
                               //frames["rightFrame"].document.write(msg); 
								$(".menuBar #thirdGoBack").removeClass("disable");
								$(".menuBar #thirdGoForward").removeClass("disable");
                                obj.style.display = "none";
                            },
                            error: function(){
                                //请求出错处理
//                                frames[iframeId].document.close(); 
//                                frames[iframeId].document.write("<div style=\"text-align:center;line-height:400px;color:red;\">页面加载失败，请尝试刷新该页面</div>");
								$(".menuBar #thirdGoBack").addClass("disable");
								$(".menuBar #thirdGoForward").addClass("disable");
                                obj.style.display = "none"; 
                            }
                        }); 
                    
                }
                $('#'+thirdPartId).css("display","none");
                $('#'+id).css("display","block");
            }
            else
            {
                var iframeObj = $("#"+ id);
                var menuTabObj = iframeObj.find(".menuTabOn")
                var tempId = menuTabObj.attr("id") + "Iframe";
                var iframeId = objId + "Iframe";
                iframeObj = $("#"+ iframeId)
                var thirdFrame = document.getElementById(tempId);
                if (thirdFrame == null) {
                        var obj = document.getElementById(objId + "Loading");
                        obj.style.display = "block";
                        var strUrl = menuTabObj.attr("url");
                        iframeObj.append('<iframe class="iframeHide iframeShow" id="' + tempId + '" src="' + strUrl +'" onload="getDress(\'' + objId + '\');"></iframe>');
                        $.ajax({
                           type: "get",
                           url: strUrl,
                           data: "",
                           dataType:"html",
                           beforeSend:function(){
                            //frames['rightFrame'].document.body.innerHTML=loadHtml;
                            //frames["rightFrame"].document.close(); 
                            //frames["rightFrame"].document.write(loadHtml);   
                            
                           },
                           success: function(msg){
                                //$("#rightFrame").Document.body.html(msg);
                               //frames["rightFrame"].document.close(); 
                               //frames["rightFrame"].document.write(msg); 
                               
							   $(".menuBar #thirdGoBack").removeClass("disable");
								$(".menuBar #thirdGoForward").removeClass("disable");
                                obj.style.display = "none";
                            },
                            error: function(){
                                //请求出错处理
								$(".menuBar #thirdGoBack").addClass("disable");
								$(".menuBar #thirdGoForward").addClass("disable");
                                obj.style.display = "none";
                                //frames[tempId].document.close(); 
                                //frames[tempId].document.write("<div style=\"text-align:center;line-height:400px;color:red;\">页面加载失败，请尝试刷新该页面</div>");   
                            }
                        }); 
                   }
				if(typeof thirdPartId != "undefined")
					document.getElementById(thirdPartId).style.display = "none";
                document.getElementById(id).style.display = "block";
            }
            
            if (id=="thirdMusicPart" || id=="thirdyinyuetaiPart" || id=="thirdkuainanPart" || id=="thirddongtingPart" || id=="third5singPart" 
            || id=="thirdxiamiPart") {
                cef.media("flashInstall");
            }
            else {
                var flashnotifier = document.getElementById("flash-notifier");
                flashnotifier.style.display = "none";
            }
        }
    }) */
    
    
    //手机多媒体模块管理
	$("#phoneMediaList").find(".phoneMediaTitle").hover(function () {
        if (!$(this).next().hasClass("liListShow")) {
	        $(this).addClass("phoneMediaTitleHover")
        }
    },function () {
	    $(this).removeClass("phoneMediaTitleHover")
    }).mousedown(function () {
        var tempObj = $(this);
        var obj = tempObj.next();
        if(obj.hasClass("liListShow"))
        {
            return;
        }
        
        $(".liList").removeClass("liListShow");
        obj.addClass("liListShow");
        
        //切换右侧的iframe
        var iframeId = tempObj.attr("id") + "Iframe";
        var iframeUrl = tempObj.attr("url");
        var iframeObj = $("#vivoMediaIframe");
        var objFrame = document.getElementById(iframeId);
        if (objFrame == null) {
            $("#vivoMediaIframe").find("iframe").removeClass("iframeShow");
                iframeObj.append('<iframe class="iframeHide iframeShow" id="' + iframeId + '" src="' + iframeUrl +'"></iframe>');
        }
        else
        {
            $("#vivoMediaIframe").find("iframe").removeClass("iframeShow");
            objFrame.className = "iframeHide iframeShow";
        }
    })
    
    $("#phoneMediaList").find(".category-list").mousedown(function () {
        var tempObj = $(this);
        $("#phoneMediaList").find(".category-list").removeClass("category-list-click");
        tempObj.addClass("category-list-click");
        $(".category").css("background-position-y","0px");
        
        //填充右侧的界面，根据分类下的显示进行处理
        
    });    
    
/*     $(".menu-tab").find("li").click(function () {
        var obj = $(this);
        var id = obj.parent().parent().attr("id");
        
        $("#"+id).find("li").removeClass("menuTabOn");
        var url= obj.attr("url");
        obj.addClass("menuTabOn");
        
//        if (id == "MusicTab") {
//        
//            var iframeObj = $("#thirdMusicIframe");
//            id = obj.attr("id") + "Iframe";
//            var thirdFrame = document.getElementById(id);
//            if (thirdFrame == null) {
//                var obj = document.getElementById("musicIframeLoading");
//                obj.style.display = "block";
//                iframeObj.append('<iframe class="iframeHide" id="' + id + '" name="' + id + '" src="' + url +'"></iframe>');
//                $("#" +id).ready(function () {
//                    setTimeout(function () {
//                        obj.style.display = "none";
//                    },2000)
//                });
//            }
//            iframeObj.find("iframe").removeClass("iframeShow");
//            document.getElementById(id).className = "iframeHide iframeShow";
//        }
//        else if (id == "MovieTab") {
//            var iframeObj = $("#thirdMovieIframe");
//            id = obj.attr("id") + "Iframe";
//            var thirdFrame = document.getElementById(id);
//            if (thirdFrame == null) {
//                var obj = document.getElementById("movieIframeLoading");
//                obj.style.display = "block";
//                iframeObj.append('<iframe class="iframeHide" id="' + id + '" name="' + id + '" src="' + url +'"></iframe>');
//                $("#" +id).ready(function () {
//                    setTimeout(function () {
//                        obj.style.display = "none";
//                    },2000)
//                });
//            }
//            iframeObj.find("iframe").removeClass("iframeShow");
//            document.getElementById(id).className = "iframeHide iframeShow";
//        }
        if (id == "TextTab") {
            var iframeObj = $("#thirdTextIframe");
            id = obj.attr("id") + "Iframe";
            var thirdFrame = document.getElementById(id);
            if (thirdFrame == null) {
                var obj = document.getElementById("thirdTextLoading");
                obj.style.display = "block";
                iframeObj.append('<iframe class="iframeHide" id="' + id + '" name="' + id + '" src="' + url +'"></iframe>');
                $("#" +id).ready(function () {
                    setTimeout(function () {
                        obj.style.display = "none";
                    },2000)
                });
            }
            iframeObj.find("iframe").removeClass("iframeShow");
            document.getElementById(id).className = "iframeHide iframeShow";
        }
        else if (id == "PictureTab") {
            var iframeObj = $("#thirdPictureIframe");
            id = obj.attr("id") + "Iframe";
            var thirdFrame = document.getElementById(id);

            if (thirdFrame == null) {
                var obj = document.getElementById("thirdPictureLoading");
                obj.style.display = "block";
                iframeObj.append('<iframe class="iframeHide" id="' + id + '" name="' + id + '" src="' + url +'"></iframe>');
                $("#" +id).ready(function () {
                    setTimeout(function () {
                        obj.style.display = "none";
                    },2000)
                });
            }
            iframeObj.find("iframe").removeClass("iframeShow");
            document.getElementById(id).className = "iframeHide iframeShow";
        }
//        else if (id == "ThemeTab") {
//            var iframeObj = $("#thirdThemeIframe");
//            id = obj.attr("id") + "Iframe";
//            var thirdFrame = document.getElementById(id);
//            if (thirdFrame == null) {
//                var obj = document.getElementById("themeIframeLoading");
//                obj.style.display = "block";
//                iframeObj.append('<iframe class="iframeHide" id="' + id + '" name="' + id + '" src="' + url +'"></iframe>');
//                $("#" +id).ready(function () {
//                    setTimeout(function () {
//                        obj.style.display = "none";
//                    },2000)
//                });
//            }
//            iframeObj.find("iframe").removeClass("iframeShow");
//            document.getElementById(id).className = "iframeHide iframeShow";
//        }
    }); */
    
    
/*     $("#notShow").hover(function () {
        $(this).addClass("notShowHover");
    },function() {
        $(this).removeClass("notShowHover");
    }).click(function () {
        if ($(this).hasClass("notShowOn")) {
            $(this).removeClass("notShowOn");
        }
        else
        {
            $(this).addClass("notShowOn");
        }
    }); */
	
/* 	setTimeout(function(){
		$('#thirdRing').mousedown();
	}, 100); */
	

 })
 
//屏蔽鼠标右键 ;
document.oncontextmenu = new Function("return false;")
function myfocus() { 
    if(document.activeElement.id != "appSearch")
    {
        document.getElementById('myIframe').focus(); 
    }
}

window.onload = function () {
  //   cef.media("flashInstall");
}

function getDress(id){
     var loadingId = id + "Loading";
     id = id + "Iframe";
     _obj = $('HTML');
     var txt = _obj[0].innerText;
     txt = txt.substr(0,5);
     if (txt == "Error" || txt == "Not F") {
        frames[id].document.write("<div style=\"font-family: 微软雅黑,Verdana,sans-serif,宋体;text-align:center;line-height:400px;color:#666;\">页面加载失败，请尝试点击刷新重试</div>");
        document.getElementById(loadingId).style.display = "none";
     }
 }


//禁用backspace键的后退功能，但是可以删除文本内容
document.onkeydown = check;  
function check(e) {  
    var code;  
    if (!e) var e = window.event;  
    if (e.keyCode) code = e.keyCode;  
    else if (e.which) code = e.which;  
    if (((event.keyCode == 8) &&                                                    //BackSpace   
         ((event.srcElement.type != "search" && 
         event.srcElement.type != "text" &&   
         event.srcElement.type != "textarea" &&   
         event.srcElement.type != "password") ||   
         event.srcElement.readOnly == true)) ||   
        ((event.ctrlKey) && ((event.keyCode == 78) || (event.keyCode == 82)) ) ||    //CtrlN,CtrlR   
        (event.keyCode == 116) ) {                                                   //F5   
        event.keyCode = 0;   
        event.returnValue = false;   
    }  
    return true;  
} 

var global = {
    thirdPartId:undefined,
}

function connectSuccess(bUSB) {
    //手机连接成功
    if (bUSB == "1") {
        global.connectUSB = true;
    }
    else {
        global.connectUSB = false;
    }

    //refreshing();
    
    //getPhoneApp();
}
//第三方主页
/* function homePageThird() {
    $(".category-list").removeClass("category-list-click");
    if (global.thirdPageId != "thirdHomePage") {
        showThirdStore();
        $("#thirdStore").find(".thirdStore").hide();
        document.getElementById("iframeLoading").style.display = "none";
        document.getElementById("thirdHomePage").style.display = "block";
        global.thirdPageId = "thirdHomePage";
    }
} */

/* function refreshThird(obj) {
	var id = $(".category-list-click").attr("id");
	$("#"+id+"Loading ").show();
    //刷新等待
	var showFrame = $("#"+id+"Iframe .iframeShow");
	if(showFrame.length==0)
		showFrame = $("#"+id+"Iframe");
    var url = showFrame.attr("src");
	showFrame.hide();
    showFrame.attr("src",url + "?ram=" + parseInt(100*Math.random()));
	$.ajax({
        type: "get",
        url: url,
        data: "",
        dataType:"html",
       success: function(msg){ 
			$(".menuBar #thirdGoBack").removeClass("disable");
			$(".menuBar #thirdGoForward").removeClass("disable");
        },
        error: function(){
			$(".menuBar #thirdGoBack").addClass("disable");
			$(".menuBar #thirdGoForward").addClass("disable");                    
        }
    }); 
    showFrame.ready(function () {
        setTimeout(function () {
            $("#"+id+"Loading").hide();
			showFrame.show()
        },1000)
    });
} */

/* function thirdGoBack(obj) {
	if($(obj).hasClass("disable"))
		return;
    obj = $(obj).parent().parent().find(".iframeShow");
    id = obj.attr("id");
    if (id == undefined) {
        id = $(obj).parent().find(".iframeShow").attr("id")
    }
    if ($(obj).hasClass("disable")) {
        return;
    }
    document.getElementById(id).contentWindow.history.back();
}

function thirdGoForward(obj) {
	if($(obj).hasClass("disable"))
		return;
    obj = $(obj).parent().parent().find(".iframeShow");
    id = obj.attr("id");
    if (id == undefined) {
        id = $(obj).parent().find(".iframeShow").attr("id")
    }
    if ($(obj).hasClass("disable")) {
        return;
    }
    document.getElementById(id).contentWindow.history.forward();
} */

function goBack(obj) {
    if ($(obj).hasClass("disable")) {
        return;
    }
    cef.appStore("goBack");
}
function goForward(obj) {
    if ($(obj).hasClass("disable")) {
        return;
    }
    cef.appStore("goForward");
}

function checkBackAndForward(csJson) {
    if (csJson == "01") {
        $("#goBack").addClass("disable");
        $("#goForward").removeClass("disable");
    }
    else if (csJson == "10") {
        $("#goBack").removeClass("disable");
        $("#goForward").addClass("disable");
    }
    else if (csJson == "11") {
        $("#goBack").removeClass("disable");
        $("#goForward").removeClass("disable");
    }
    else if (csJson == "00") {
        $("#goBack").addClass("disable");
        $("#goForward").addClass("disable");
    }
}

function refresh() {
    //刷新等待
    
    document.getElementById("bubble_message").innerHTML = '<div class="bubble_text"><div class="refresh" ></div>正在刷新,请稍候！</div>';
    $("#bubble").show();
    if (global.refreshPage == "home/home.html") {
        global.param = "refresh";
    }
    if (global.param != "refresh" && global.param != "initIndex") {
        cef.appStore("removeCacheFile");
    }
    global.myIframeObj.attr("src",global.refreshPage);
}

//第三方js处理

/* function showThirdPart()
{
    document.getElementById("vivoPart").style.display = "none";
    document.getElementById("thirdPart").style.display = "block";
	var id = $("#thirdPart>[style='display: block;']").attr("id");
	id = id.substring(0,id.length-4);
	tuijianId = id.substring(5);
	$(".category-list").removeClass("category-list-click");
	$("#"+id).addClass("category-list-click");
	$("#"+tuijianId).addClass("category-list-click");
} */
function showVivoPart()
{
   // document.getElementById("thirdPart").style.display = "none";
    document.getElementById("vivoPart").style.display = "block";
    
    //默认打开第一个标签
    /*if(!$("#phoneMediaList").find("li").hasClass("category-list-click"))
    {
        var tempObj = $("#phoneMediaList").find("li:first");
        tempObj.addClass("category-list-click");
        
        //填充右侧的界面
        var iframeId = tempObj.attr("id") + "Iframe";
        var iframeUrl = tempObj.attr("url");
        var iframeObj = $("#vivoMediaIframe");
        var objFrame = document.getElementById(iframeId);
        if (objFrame == null) {
            $("#vivoMediaIframe").find("iframe").removeClass("iframeShow");
                iframeObj.append('<iframe class="iframeHide iframeShow" id="' + iframeId + '" src="' + iframeUrl +'"></iframe>');
        }
        else
        {
            $("#vivoMediaIframe").find("iframe").removeClass("iframeShow");
            objFrame.className = "iframeHide iframeShow";
        }
    }*/
	
	
    var tempObj = $("#phoneMediaList").find(".phoneMediaTitle:first");
	var iframeId = "photoIframe";
	var iframeUrl = tempObj.attr("url");
	var iframeObj = $("#vivoMediaIframe");
    var objFrame = document.getElementById(iframeId);
	if (objFrame == null) {
		$("#vivoMediaIframe").find("iframe").removeClass("iframeShow");
			iframeObj.append('<iframe class="iframeHide iframeShow" id="' + iframeId + '" src="' + iframeUrl +'"></iframe>');
	}
	else
	{
		$("#vivoMediaIframe").find("iframe").removeClass("iframeShow");
		objFrame.className = "iframeHide iframeShow";
	}
	var child = $("#photolist").children().first();
	$(".category-list").removeClass("category-list-click");
	child.addClass("category-list-click");
	$("#photolist").show();
}


/* function appDownloadPrompt(csJson) {
    //提示应用已经加入下载列表

    if (csJson != "" && csJson != null) {
        var appNum = parseInt(csJson[0]["appNum"],10);
        var appName = csJson[0]["appName"];
        var appType = csJson[0]["appType"];
        if(appType == "text")
        {
            if (appNum <= 1) {
                appName = '电子书apk <span>' + appName + '</span>'
            }
            else
            {
                appName = '共 ' + appNum + ' 个电子书apk，<span>' + appName + '</span>等'
            }
        }
        else
        {
            if (appNum <= 1) {
                appName = '应用 <span>' + appName + '</span>'
            }
            else
            {
                appName = '共 ' + appNum + ' 个应用，<span>' + appName + '</span>等'
            }
        }
        document.getElementById("downloadName").innerHTML = appName;
        var obj = document.getElementById("downloadBubble");
        obj.style.display = "block";
        setTimeout(function () {
            obj.style.display = "none";
        },2000);
    }
    else
    {
        document.getElementById("bubble_message").innerHTML = '<div class="bubble_text"><div class="sorry" ></div>下载任务添加失败！</div>';
        var obj = document.getElementById("bubble");
        obj.style.display = "block";
        setTimeout(function () {
            obj.style.display = "none";
        },2000);
    }
} */
/* function mediaDownloadPrompt(csJson) {
    //提示应用已经加入下载列表
    
    if (typeof jsonstr == "string") {
        jsonstr = JSON.parse(jsonstr);
    }
    if (csJson != "" && csJson != null) {
        var mediaNum = parseInt(csJson[0]["mediaNum"],10);
        var mediaName = csJson[0]["mediaName"];
        var mediaType = csJson[0]["mediaType"];
        if (mediaType == "text") {
            if (mediaNum <= 1) {
                mediaName = '电子书 <span>' + mediaName + '</span>'
            }
            else
            {
                mediaName = '共 ' + mediaNum + ' 本电子书，<span>' + mediaName + '</span>等'
            }
        }
        
        document.getElementById("downloadName").innerHTML = mediaName;
        var obj = document.getElementById("downloadBubble");
        obj.style.display = "block";
        setTimeout(function () {
            obj.style.display = "none";
        },2000);
    }
    else
    {
        document.getElementById("bubble_message").innerHTML = '<div class="bubble_text"><div class="sorry" ></div>下载任务添加失败！</div>';
        var obj = document.getElementById("bubble");
        obj.style.display = "block";
        setTimeout(function () {
            obj.style.display = "none";
        },2000);
    }
} */

function closeGuide(obj) {
/*     obj = obj.parentNode.parentNode;
    if($("#notShow").hasClass("notShowOn"))
    {
        //写配置文件，标志用户已经阅读
        cef.param = "alreadyReadMedia";
        cef.media("alreadyRead");
    }
    $("#guide").remove(); */
}

function showGuide(csJson) {
/*     if (csJson == "1") {
        document.getElementById("guide").style.display = "block";
    }
    else
    {
        $("#guide").remove();
    } */
}

//下载apk
/* function downloadApp(jsonstr) {
    if (typeof jsonstr == "string") {
        jsonstr = JSON.parse(jsonstr);
    }
    if (typeof jsonstr  != "string" && jsonstr != "" && jsonstr != null) {
        var csJson = "", len = 0;
        len = jsonstr.length;
        if (len == undefined) {
            var name = jsonstr["appName"];
            name = '应用 <span>' + name + '</span>'

            document.getElementById("downloadName").innerHTML = name;
            var obj = document.getElementById("downloadBubble");
            obj.style.display = "block";
            setTimeout(function () {
                obj.style.display = "none";
            },2000);
            

            csJson = "{\"downloadUrl\":\"" + jsonstr["downloadUrl"] + "\",\"appName\":\"" + jsonstr["appName"] + "\",\"packageName\":\"" + jsonstr["package"] + "\"}";

            csJson = "[" + csJson + "]";
            cef.param = csJson;
            cef.media("downloadApp");
        
        }
        
        var name = jsonstr[0]["appName"];
        if (len <= 1) {
            name = '应用 <span>' + name + '</span>'
        }
        else
        {
            name = '共 ' + len + ' 个应用,<span>' + name + '</span>等';
        }
        document.getElementById("downloadName").innerHTML = name;
        var obj = document.getElementById("downloadBubble");
        obj.style.display = "block";
        setTimeout(function () {
            obj.style.display = "none";
        },2000);
        
        for(var i=0;i<len;i++){ 
            if (i == 0) {
                csJson = "{\"downloadUrl\":\"" + jsonstr[i]["downloadUrl"] + "\",\"appName\":\"" + jsonstr[i]["appName"] + "\",\"packageName\":\"" + jsonstr[i]["package"] + "\"}";
            }
            else
            {
                csJson += ",{\"downloadUrl\":\"" + jsonstr[i]["downloadUrl"] + "\",\"appName\":\"" + jsonstr[i]["appName"] + "\",\"packageName\":\"" + jsonstr[i]["package"] + "\"}";
            }
        }
        csJson = "[" + csJson + "]";
        cef.param = csJson;
        cef.media("downloadApp");
    }
}

//下载壁纸
function downloadWallpaper(jsonstr) {
    if (typeof jsonstr == "string") {
        jsonstr = JSON.parse(jsonstr);
    }
    if (typeof jsonstr != "string" && jsonstr != "" && jsonstr != null) {
        var csJson = "", len = 0;
        len = jsonstr.length;
        
        var name = jsonstr[0]["imgName"];
        if (len <= 1) {
            name = '壁纸 <span>' + name + '</span>'
        }
        else
        {
            name = '共  '+ len + ' 张壁纸,<span>' + name + '</span>等';
        }
        document.getElementById("downloadName").innerHTML = name;
        var obj = document.getElementById("downloadBubble");
        obj.style.display = "block";
        setTimeout(function () {
            obj.style.display = "none";
        },2000);
        
        for(var i=0;i<len;i++){ 
            if (i == 0) {
                csJson = "{\"type\":\"picture\",\"downloadUrl\":\"" + jsonstr[i]["downloadUrl"] + "\",\"name\":\"" + jsonstr[i]["imgName"] + "\"}";
            }
            else
            {
                csJson += ",{\"type\":\"picture\",\"downloadUrl\":\"" + jsonstr[i]["downloadUrl"] + "\",\"name\":\"" + jsonstr[i]["imgName"] + "\"}";
            }
        }
        csJson = "[" + csJson + "]";
        cef.param = csJson;
        cef.media("downloadPicture");
    }
}

//下载壁主题
function downloadTheme(csJson) {
    var jsonstr = csJson;
    if (typeof csJson == "string") {
        csJson = JSON.parse(csJson);
    }
    else
    {
	    jsonstr = JSON.stringify(csJson);
    }
    if (typeof csJson != "string" && csJson != "" && csJson != null) {
        var mediaName = csJson["themeName"];
        mediaName = '主题 <span>' + mediaName + '</span>'
        document.getElementById("downloadName").innerHTML = mediaName;
        var obj = document.getElementById("downloadBubble");
        obj.style.display = "block";
        
        cef.param = "["+jsonstr+"]";
        cef.media("downloadTheme");

        setTimeout(function () {
            obj.style.display = "none";
        },2000);
        
    }
    else
    {
        document.getElementById("bubble_message").innerHTML = '<div class="bubble_text"><div class="sorry" ></div>下载任务添加失败！</div>';
        var obj = document.getElementById("bubble");
        obj.style.display = "block";
        setTimeout(function () {
            obj.style.display = "none";
        },2000);
    }
}

//下载视频
function downloadMovie(csJson) {
    var jsonstr = csJson;
    if (typeof csJson == "string") {
        csJson = JSON.parse(csJson);
    }
    else
    {
	    jsonstr = JSON.stringify(csJson);
    }
    if (typeof csJson != "string" && csJson != "" && csJson != null) {
        var mediaName = csJson[0]["movieName"];
        if (mediaName == undefined) {
            mediaName = csJson[0]["appName"];
        }
        var len = 0;
        len = csJson.length;
        if (len <= 1) {
            mediaName = '视频 <span>' + mediaName + '</span>'
        }
        else
        {
            mediaName = '共' + len + ' 部视频,<span>' + mediaName + '</span>等'
        }
        document.getElementById("downloadName").innerHTML = mediaName;
        var obj = document.getElementById("downloadBubble");
        obj.style.display = "block";
        
        cef.param = jsonstr;
        cef.media("downloadMovie");

        setTimeout(function () {
            obj.style.display = "none";
        },2000);
        
    }
    else
    {
        document.getElementById("bubble_message").innerHTML = '<div class="bubble_text"><div class="sorry" ></div>下载任务添加失败！</div>';
        var obj = document.getElementById("bubble");
        obj.style.display = "block";
        setTimeout(function () {
            obj.style.display = "none";
        },2000);
    }
}

//下载音乐
function downloadMusic(csJson) {
    var jsonstr = csJson;
    if (typeof csJson == "string") {
        csJson = JSON.parse(csJson);
    }
    else
    {
	    jsonstr = JSON.stringify(csJson);
    }
    if (typeof csJson != "string" && csJson != "" && csJson != null) {
        var mediaName = csJson[0]["musicName"];
        var len = 0;
        len = csJson.length;
        if (len <= 1) {
            mediaName = '音乐 <span>' + mediaName + '</span>'
        }
        else
        {
            mediaName = '共' + len + ' 首音乐,<span>' + mediaName + '</span>等'
        }
        document.getElementById("downloadName").innerHTML = mediaName;
        var obj = document.getElementById("downloadBubble");
        obj.style.display = "block";
        setTimeout(function () {
            obj.style.display = "none";
            cef.param = jsonstr;
            cef.media("downloadMusic");
        },2000);
        
    }
    else
    {
        document.getElementById("bubble_message").innerHTML = '<div class="bubble_text"><div class="sorry" ></div>下载任务添加失败！</div>';
        var obj = document.getElementById("bubble");
        obj.style.display = "block";
        setTimeout(function () {
            obj.style.display = "none";
        },2000);
    }
    
} */

/* function flashInstall(installed) {
 
    var obj = document.getElementById("flash-notifier");
    if (installed == "1") {
        obj.style.display = "none";
    }
    else{
        obj.style.display = "block";
    }
}

function closeflashNotifier() {
    var obj = document.getElementById("flash-notifier");
    
    obj.style.display = "none";
} */

function _external_link_(url) {
    cef.param = url;
    cef.public("_external_link_");
}




//==================================================================================================================
function showEdit(obj)
{
    obj = $(obj);
    
    obj.hide();
    obj = obj.prev();
    obj.show();
    obj.find("input").val("").focus();
}
function hideEdit(obj)
{
    obj = $(obj);
    var val= obj.val();
    obj = obj.parent();
    
    obj.hide();
    obj.next().show();
    
    if (val == "") {
        return;
    }
    else
    {
        obj.before('<li class="category-list" id="Li3"  url="photo/photo.html" ><div class="listIconBg adding"></div><div class="fileName">'+val+'</div><div class="listNum">(0)</div></li>')

    }
}


function countUse(thirdName)
{
    cef.param = thirdName;
    cef.media("countUse");
}

function clearList(){
	$('#photolist').html("");
}

function onConnectedBtnState(bConnect){
    photoIframe.window.onConnectedBtnState(bConnect);
}

function getCurrentFolderId(){
	return $("li.category-list-click").attr("id");
}