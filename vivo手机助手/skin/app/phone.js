$(document).ready(function(){setEvent();document.getElementById("loadfailed").style.display="none";document.getElementById("loadding").style.display="block";$("#searchInstalled").attr("disabled","disabled").val("")});function appImgError(a){a.src="images/default.png";a.parentNode.style.backgroundImage=""}function setEvent(){$("#applist").on("click","li",function(){var d=$(this);if(d.hasClass("liOn")){d.removeClass("liOn");d.find(".sel").removeClass("selOn")}else{var c=$("#applist").find("li");c.removeClass("liOn");c.find(".sel").removeClass("selOn");d.addClass("liOn");d.find(".sel").addClass("selOn")}var b=0,a=0;b=$(".selOn").length;a=$(".sel").length;if(b==a&&b!=0&&a!=0){$("#selAll").addClass("selAllOn")}else{$("#selAll").removeClass("selAllOn")}setMenuButton()}).on("click",".sel",function(c){var d=$(this);if(d.hasClass("selOn")){d.removeClass("selOn");d.parent().removeClass("liOn")}else{d.addClass("selOn");d.parent().addClass("liOn")}var b=0,a=0;b=$(".selOn").length;a=$(".sel").length;if(b==a&&b!=0&&a!=0){$("#selAll").addClass("selAllOn")}else{$("#selAll").removeClass("selAllOn")}setMenuButton();c.stopPropagation()}).on("click",".canUpdateBtn",function(a){btnUpdate(this);a.stopPropagation()}).on("click",".uninstallBtn",function(a){btnUninstall(this);a.stopPropagation()}).on("click",".moveToBtn",function(a){btnMove(this);a.stopPropagation()});$("#selAll").on("click",function(){var a=$("#applist").find("li");if($(this).hasClass("selAllOn")){$(this).removeClass("selAllOn");a.removeClass("liOn");a.find(".sel").removeClass("selOn")}else{$(this).addClass("selAllOn");a.addClass("liOn");a.find(".sel").addClass("selOn")}setMenuButton();return false});$(".del").on("hover",function(){$(this).addClass("delOn")},function(){$(this).removeClass("delOn")})}function btnUpdate(c){var b=$(c);if(b.hasClass("disable")){return}b.addClass("disable");b.text("下载中");var j="";var i=b.parent().parent();var h=i.attr("id");var a=i.find(".appRealName").text();var e=b.attr("uurl");var d=i.find(".appPosition").text();var f=i.find(".appNewVersion").text().substring(4);myIframe.window.InstallOrUpdateSuccess("-1",h);var g;if(d=="手机内存"){g=1}else{if(d=="SD卡"){g=2}else{g=0}}j='[{"packageName":"'+h+'", "appName":"'+a+'", "downloadUrl":"'+e+'", "version":"'+f+'", "installLoc":"'+g+'"}]';cef.param=j;cef.appStore("downloadApp");return false}function btnUninstall(f){var h=$(f);var e="";var a=h.parent().parent();var d=a.attr("id");var c=a.find(".appRealName").text();e='[{"pkgName":"'+d+'", "name":"'+c+'"}]';var b="";if(global.connectUSB){b="<div class=prompt_text2>确定要卸载“"+c+"”?</div>"}else{b="<div class=prompt_text2>确定要卸载“"+c+"”?<br>（请在手机上确认卸载）</div>"}$("#prompt_message").html(b);var g=$("#prompt_title");g.text("卸载");$("#prompt_close").show().unbind("click").click(function(){$("#prompt").hide()});$("#no").text("取消").show().unbind("click").click(function(){$("#prompt").hide()});$("#yes").text("确定").show().unbind("click").click(function(){iframeUninstallApp(e)});$("#prompt").show();return false}function btnMove(e){var g=$(e);if(g.hasClass("disable")){return}var d="";var a=g.parent().parent();var c=a.attr("id");var b=a.find(".appRealName").text();var f=g.attr("loc");if(f=="1"){f=2}else{if(f=="2"){f=1}else{return}}d='[{"pkgName":"'+c+'", "name":"'+b+'","toLoc":'+f+"}]";iframeMoveApp(d);return false}function moveApps2SD(c){if($(c).hasClass("disable")){return}var a="";var b=0;$("#applist").find(".selOn").each(function(){var e=$(this).parent().attr("id");var d=$(this).next().find(".appRealName").text();var f=$(this).parent().find(".moveToBtn").attr("loc");if(f=="1"){f=2;if(b==0){a='{"pkgName":"'+e+'", "name":"'+d+'","toLoc":'+f+"}"}else{a+=',{"pkgName":"'+e+'", "name":"'+d+'","toLoc":'+f+"}"}b++}});a="["+a+"]";iframeMoveApp(a);return false}function installLocal(a){if($(a).hasClass("disable")){return}$("#installList").text("");$("#sureInstallLocApk").addClass("disable");$("#installPrompt").show();$("#waitPrompt").hide();$("#disableCover").hide();$("#toPhone").removeClass("toWhereOn");$("#toSD").removeClass("toWhereOn");document.getElementById("installPrompt").innerHTML='提示：即将安装 <span id="allLocApkNum">0</span> 个apk，<span id="toPhoneNum">0</span> 个安装到系统空间，<span id="toSdNum">0</span> 个安装到SD卡';document.getElementById("installAppPop").style.display="block";$("#nospacePrompt").hide()}function uninstallApp(e){if($(e).hasClass("disable")){return}var b="";var d=0;var c="";$("#applist").find(".selOn").each(function(){var h=$(this).parent().attr("id");var g=$(this).next().find(".appRealName").text();if(d==0){c=g;b='{"pkgName":"'+h+'", "name":"'+g+'"}'}else{b+=',{"pkgName":"'+h+'", "name":"'+g+'"}'}d++});b="["+b+"]";var a="";if(d==1){if(global.connectUSB){a="<div class=prompt_text2>确定要卸载“"+c+"”?</div>"}else{a="<div class=prompt_text2>确定要卸载“"+c+"”?<br>（请在手机上确认卸载）</div>"}}else{if(global.connectUSB){a="<div class=prompt_text2>确定要卸载“"+c+'”等<span style="color:#C00000;">'+d+"</span>个应用</div>"}else{a="<div class=prompt_text2>确定要卸载“"+c+'”等<span style="color:#C00000;">'+d+"</span>个应用<br>（请在手机上确认卸载）</div>"}}$("#prompt_message").html(a);var f=$("#prompt_title");f.text("卸载");$("#prompt_close").show().unbind("click").click(function(){$("#prompt").hide()});$("#no").text("取消").show().unbind("click").click(function(){$("#prompt").hide()});$("#yes").text("确定").show().unbind("click").click(function(){iframeUninstallApp(b)});$("#prompt").show()}function updateApp(c){if($(c).hasClass("disable")){return}var a="";var b=0;$("#applist").find(".selOn").each(function(){var d=$(this).parent();var h=d.attr("id");var f=$(this).next().find(".appRealName").text();var g=d.find(".updateBtn").attr("uurl");var j=d.find(".appPosition").text();var e=d.find(".appNewVersion").text().substring(4);if(d.find(".canUpdateBtn").length!=0){d.find(".updateBtn").removeClass("canUpdateBtn").text("下载中");myIframe.window.InstallOrUpdateSuccess("-1",h);var i;if(j=="手机内存"){i=1}else{if(j=="SD卡"){i=2}else{i=0}}if(b==0){a='{"packageName":"'+h+'", "appName":"'+f+'", "downloadUrl":"'+g+'", "version":"'+e+'", "installLoc":"'+i+'"}'}else{a+=',{"packageName":"'+h+'", "appName":"'+f+'", "downloadUrl":"'+g+'", "version":"'+e+'", "installLoc":"'+i+'"}'}b++}});a="["+a+"]";cef.param=a;cef.appStore("downloadApp");setMenuButton();return false}function refreshApp(a){if($(a).hasClass("disable")){return}refreshing();cef.appStore("refreshPhoneApp")}function backupApp(e){if($(e).hasClass("disable")){return}var b="";var d=0;var c="";$("#applist").find(".selOn").each(function(){var h=$(this).parent().attr("id");var g=$(this).next().find(".appRealName").text();if(d==0){c=g;b='{"pkgName":"'+h+'", "name":"'+g+'"}'}else{b+=',{"pkgName":"'+h+'", "name":"'+g+'"}'}d++});b="["+b+"]";var a="";if(d==1){a="<div class=prompt_text2>确定要备份“"+c+"”</div>"}else{a="<div class=prompt_text2>确定要备份“"+c+'”等<span style="color:#C00000;">'+d+"</span>个应用</div>"}$("#prompt_message").html(a);var f=$("#prompt_title");f.text("应用备份");f.prev().remove();f.before('<div class="uninstallAppIcon"></div>');$("#prompt_close").show().unbind("click").click(function(){$("#prompt").hide()});$("#no").text("取消").show().unbind("click").click(function(){$("#prompt").hide()});$("#yes").text("确定").show().unbind("click").click(function(){iframeBackupApp(JSON.parse(b))});$("#prompt").show()}Array.prototype.mySort=function(d){for(var c=1;c<this.length;c++){var b;if(d(this[c],this[c-1])>0){var a=this[c];for(b=c-1;b>=0&&d(this[b],a)<0;b--){this[b+1]=this[b]}this[b+1]=a}}};Array.prototype.removeByPkgName=function(b){for(var a=0;a<this.length;a++){if(this[a]["pkgname"]==b){console.log("find&remove");this.splice(a,1);return}}};Array.prototype.changeLocByPkgName=function(c,b){for(var a=0;a<this.length;a++){if(this[a]["pkgname"]==b){this[a]["installloc"]=c;return}}};function sortBySize(c){var a;if(global.phoneAppID=="alreadyInstall"){a="size"}else{if(global.phoneAppID=="canUpdateApp"){a="newsize"}}var b=$(c);if(b.hasClass("sortByDesc")){b.addClass("sortByAsce").removeClass("sortByDesc");a=a+"Asce"}else{if(b.hasClass("sortByAsce")){b.addClass("sortByDesc").removeClass("sortByAsce");a=a+"Desc"}else{$(".sortByDesc").removeClass("sortByDesc");$(".sortByAsce").removeClass("sortByAsce");b.addClass("sortByDesc");a=a+"Desc"}}if(global.phoneAppID=="alreadyInstall"){global.curInstalledMod=global.Mod[a];setPhoneApp(global.installedAppCsJson)}else{if(global.phoneAppID=="canUpdateApp"){global.curUpdateMod=global.Mod[a];setPhoneApp(global.updateAppCsJson)}}}function sortByInstallloc(c){var a="installloc";var b=$(c);if(b.hasClass("sortByDesc")){b.addClass("sortByAsce").removeClass("sortByDesc");a=a+"Asce"}else{if(b.hasClass("sortByAsce")){b.addClass("sortByDesc").removeClass("sortByAsce");a=a+"Desc"}else{$(".sortByDesc").removeClass("sortByDesc");$(".sortByAsce").removeClass("sortByAsce");b.addClass("sortByDesc");a=a+"Desc"}}if(global.phoneAppID=="alreadyInstall"){global.curInstalledMod=global.Mod[a];setPhoneApp(global.installedAppCsJson)}else{if(global.phoneAppID=="canUpdateApp"){global.curUpdateMod=global.Mod[a];setPhoneApp(global.updateAppCsJson)}}}function sortByMod(d,c){console.log(d);var a=d.substring(0,d.length-4);console.log("stringBuf "+a);var b=".tittle"+d.substring(0,1).toUpperCase()+d.substring(1,d.length-4);if(!(d==global.Mod.defaultMod)){if(c!=""&&c!=null){c.mySort(function(f,e){var h=""+f[a];var g=""+e[a];if(h.length>2&&h.substring(h.length-2,h.length)=="KB"){h=""+parseFloat(h)/1024}if(g.length>2&&g.substring(g.length-2,g.length)=="KB"){g=""+parseFloat(g)/1024}if($(b).hasClass("sortByDesc")){if(parseFloat(h)==parseFloat(g)){return f.name.toUpperCase()>e.name.toUpperCase()?-1:1}return parseFloat(h)-parseFloat(g)}else{if(parseFloat(h)==parseFloat(g)){return f.name.toUpperCase()>e.name.toUpperCase()?1:-1}return parseFloat(g)-parseFloat(h)}})}}}function refreshing(){global.bPhoneSearch="0";$("#installApp").addClass("disable");$("#uninstallApp").addClass("disable");$("#updateApp").addClass("disable");$("#refreshApp").addClass("disable");$("#searchInstalled").attr("disabled","disabled").val("");document.getElementById("loadding").style.display="block";document.getElementById("loadfailed").style.display="none"}function refreshPhoneAppReady(a){if(a=="1"){global.bPhoneSearch="0";getPhoneApp()}else{$("#installApp").removeClass("disable");$("#refreshApp").removeClass("disable");$("#loadding").hide();$("#loadfailed").show()}$("#prompt").hide()}function setMenuButton(){var c=$("#applist").find(".liOn").length;var b=$("#applist").find(".liOn").find(".canUpdateBtn").length;if(c>0){$("#uninstallApp").removeClass("disable")}else{$("#uninstallApp").addClass("disable")}if(b>0){$("#updateApp").removeClass("disable")}else{$("#updateApp").addClass("disable")}if(b>0||c>0){$("#backupApp").removeClass("disable")}else{$("#backupApp").addClass("disable")}var a=0;$("#applist").find(".selOn").each(function(){var d=$(this).parent().find(".moveToBtn").attr("loc");if(d=="1"){a++}});if(a!=0){$("#moveApp2SD").removeClass("disable")}else{$("#moveApp2SD").addClass("disable")}}function checkAllSel(){var a=$("#applist");if(a.find(".sel").length!=a.find(".selOn").length){document.getElementById("selAll").className="selAll"}else{if(a.find(".sel").length==0){document.getElementById("selAll").className="selAll"}else{document.getElementById("selAll").className="selAll selAllOn"}}}function setPhoneApp(a){if(global.phoneAppID=="alreadyInstall"){global.installedAppCsJson=a;sortByMod(global.curInstalledMod,global.installedAppCsJson);setInstalledApp(global.installedAppCsJson)}else{if(global.phoneAppID=="canUpdateApp"){global.updateAppCsJson=a;sortByMod(global.curUpdateMod,global.updateAppCsJson);setUpdateApp(global.updateAppCsJson)}}}function setUpdateApp(h){var d=$("#applist");var j="";if(h!=""&&h!=null){for(var e=0;e<h.length;e++){var g,a;if(h[e]["installloc"]==1){g="手机内存"}else{if(h[e]["installloc"]==2){g="SD卡"}else{g="未知"}}var f,c,b;if(h[e]["newver"]!=-1){f=h[e]["newver"];b=h[e]["status"];if(b==1){c='<div class="updateBtn" uurl="'+h[e]["uurl"]+'">下载中</div>'}else{if(b==5){c='<div class="updateBtn"  uurl="'+h[e]["uurl"]+'">安装中</div>'}else{c='<div class="updateBtn canUpdateBtn" uurl="'+h[e]["uurl"]+'">升级</div>'}}}else{f="--";c='<div class="updateBtn">升级</div>'}j+='<li id="'+h[e]["pkgname"]+'">            <div class="sel"></div>            <div class="appName">                <div class="appIcon"><img src="'+h[e]["icon"]+'" onerror="appImgError(this)"/></div>                <div class="appRealName">'+h[e]["name"]+'</div>            </div>            <div class="splitEmpty"></div>            <div class="appSize">'+h[e]["newsize"]+'</div>            <div class="splitEmpty"></div>            <div class="appPosition">'+g+'</div>            <div class="splitEmpty"></div>            <div class="appVersion">                 <div class="appCurrVersion">当前: '+h[e]["ver"]+'</div>                 <div class="appNewVersion">最新: '+f+'</div>             </div>            <div class="splitEmpty"></div>            <div class="appOP">'+c+"            </div>        </li>"}d.html(j)}else{d.html(j)}$("#selAll").removeClass("selAllOn");setMenuButton();$("#searchInstalled").removeAttr("disabled");document.getElementById("loadding").style.display="none";document.getElementById("loadfailed").style.display="none"}function setInstalledApp(a){var e=$("#applist");var c="";if(a!=""&&a!=null){for(var d=0;d<a.length;d++){var g,b;if(a[d]["installloc"]==1){g="手机内存";if(a[d]["move"]==1){b='<div class="moveToBtn" loc="1">移至SD卡</div>'}else{b='<div class="moveToBtn disable" loc="0">不可移动</div>'}}else{if(a[d]["installloc"]==2){g="SD卡";if(a[d]["move"]==1){b='<div class="moveToBtn" loc="2">移至手机</div>'}else{b='<div class="moveToBtn disable" loc="0">不可移动</div>'}}else{g="未知";b='<div class="moveToBtn disable" loc="0">不可移动</div>'}}var f;if(a[d]["newver"]!=-1){f=a[d]["newver"]}else{f="--"}c+='<li id="'+a[d]["pkgname"]+'">            <div class="sel"></div>            <div class="appName">                <div class="appIcon"><img src="'+a[d]["icon"]+'" onerror="appImgError(this)"/></div>                <div class="appRealName">'+a[d]["name"]+'</div>            </div>            <div class="splitEmpty"></div>            <div class="appSize">'+a[d]["size"]+'</div>            <div class="splitEmpty"></div>            <div class="appPosition">'+g+'</div>            <div class="splitEmpty"></div>            <div class="appVersion">                 <div class="appCurrVersion">当前: '+a[d]["ver"]+'</div>                 <div class="appNewVersion">最新: '+f+'</div>             </div>            <div class="splitEmpty"></div>            <div class="appOP">'+b+'<div class="uninstallBtn">卸载</div>            </div>        </li>'}e.html(c)}else{e.html(c)}$("#selAll").removeClass("selAllOn");setMenuButton();$("#searchInstalled").removeAttr("disabled");document.getElementById("loadding").style.display="none";document.getElementById("loadfailed").style.display="none"}function uninstallOneDone(b){var c=b[0]["pkgName"];var d=b[0]["progress"];if(c!="0"){var a=document.getElementById(c);if(a!=null){a.parentNode.removeChild(a);global.installedAppCsJson.removeByPkgName(c);global.updateAppCsJson.removeByPkgName(c);checkAllSel();setMenuButton()}}$("#progressNum").text(d)}function moveOneDone(b){var f=b[0]["pkgName"];var g=b[0]["progress"];var c=b[0]["loc"];if(f!="0"){var a=document.getElementById(f);if(a!=null){var e=$(a).find(".appPosition");var d=$(a).find(".moveToBtn");if(c=="1"){e.text("手机内存");d.text("移至SD卡");d.attr("loc","1")}else{if(c=="2"){e.text("SD卡");d.text("移至手机");d.attr("loc","2")}else{e.text("未知");d.text("不可移动");d.attr("loc","0");d.addClass("disable")}}global.installedAppCsJson.changeLocByPkgName(c,f);global.updateAppCsJson.changeLocByPkgName(c,f)}}$("#progressNum").text(g)}function newInstall(a){if(global.bPhoneSearch=="1"){return}if(a!=""&&a!=null){if(global.phoneAppID=="alreadyInstall"){global.installedAppCsJson.push(a[0]["app"][0]);if(global.curInstalledMod!=global.Mod.defaultMod){setPhoneApp(global.installedAppCsJson);return}}else{if(global.phoneAppID=="canUpdateApp"){global.updateAppCsJson.push(a[0]["app"][0]);if(global.curUpdateMod!=global.Mod.defaultMod){setPhoneApp(global.updateAppCsJson);return}}}var c="";if(a[0]["app"]!=""){if(a[0]["app"][0]["newver"]==-1&&global.phoneAppID=="canUpdateApp"){return}var g,b;if(a[0]["app"][0]["installloc"]==1){g="手机内存";if(a[0]["app"][0]["move"]==1){b='<div class="moveToBtn" loc="1">移至SD卡</div>'}else{b='<div class="moveToBtn disable" loc="0">不可移动</div>'}}else{if(a[0]["app"][0]["installloc"]==2){g="SD卡";if(a[0]["app"][0]["move"]==1){b='<div class="moveToBtn" loc="2">移至手机</div>'}else{b='<div class="moveToBtn disable" loc="0">不可移动</div>'}}else{g="未知";b='<div class="moveToBtn disable" loc="0">不可移动</div>'}}var f,h;if(a[0]["app"][0]["newver"]!=-1){f=a[0]["app"][0]["newver"];h='<div class="updateBtn canUpdateBtn" uurl="'+a[0]["app"][0]["uurl"]+'">升级</div>'}else{f="--";h='<div class="updateBtn">升级</div>'}if(global.phoneAppID=="alreadyInstall"){h="";b+='<div class="uninstallBtn">卸载</div>'}else{if(global.phoneAppID=="canUpdateApp"){b=""}}c='<li id="'+a[0]["app"][0]["pkgname"]+'">                <div class="sel"></div>                <div class="appName">                    <div class="appIcon"><img src="'+a[0]["app"][0]["icon"]+'" onerror="appImgError(this)"/></div>                    <div class="appRealName">'+a[0]["app"][0]["name"]+'</div>                </div>                <div class="splitEmpty"></div>                <div class="appSize">'+a[0]["app"][0]["size"]+'</div>                <div class="splitEmpty"></div>                <div class="appPosition">'+g+'</div>                <div class="splitEmpty"></div>                <div class="appVersion">                     <div class="appCurrVersion">当前: '+a[0]["app"][0]["ver"]+'</div>                     <div class="appNewVersion">最新: '+f+'</div>                 </div>                <div class="splitEmpty"></div>                <div class="appOP">'+h+b+"</div>            </li>"}else{return}var d=a[0]["list"];if(d!="1"){var e=document.getElementById(d);if($(e).length>0){$(e).before(c)}else{if(global.phoneAppID=="canUpdateApp"){$("#applist").append(c)}$("#applist").append(c)}}else{if(global.phoneAppID=="canUpdateApp"){$("#applist").append(c)}$("#applist").append(c)}checkAllSel();setMenuButton()}}function updateInstall(b){if(b!=""&&b!=null){var d=document.getElementById(b[0]["pkgname"]);var a=$(d);if(a.length>0){if(global.phoneAppID=="canUpdateApp"){if(b[0]["newver"]!=-1){a.find(".appIcon").find("img").attr("src",b[0]["icon"]);a.find(".appRealName").text(b[0]["name"]);a.find(".appCurrVersion").text("当前: "+b[0]["ver"]);a.find(".appNewVersion").text("最新: "+b[0]["newver"]);a.find(".appSize").text(b[0]["size"]);var g=a.find(".appPosition");var c=a.find(".moveToBtn");if(b[0]["installloc"]==1){g.text("手机内存")}else{if(b[0]["installloc"]==2){g.text("SD卡")}else{g.text("未知")}}var h=a.find(".updateBtn");h.removeClass("disable").text("升级");h.attr("uurl",b[0]["uurl"])}else{d.parentNode.removeChild(d);installedAppCsJson.removeByPkgName(b[0]["pkgname"]);updateAppCsJson.removeByPkgName(b[0]["pkgname"])}}else{a.find(".appIcon").find("img").attr("src",b[0]["icon"]);a.find(".appRealName").text(b[0]["name"]);a.find(".appCurrVersion").text("当前: "+b[0]["ver"]);a.find(".appSize").text(b[0]["size"]);var g=a.find(".appPosition");var c=a.find(".moveToBtn");if(b[0]["installloc"]==1){g.text("手机内存");if(b[0]["move"]==1){c.removeClass("disable").text("移至SD卡").attr("loc","1")}else{c.addClass("disable").text("不可移动").attr("loc","0")}}else{if(b[0]["installloc"]==2){g.text("SD卡");if(b[0]["move"]==1){c.removeClass("disable").text("移至手机").attr("loc","2")}else{c.addClass("disable").text("不可移动").attr("loc","0")}}else{g.text("未知");c.addClass("disable").text("不可移动").attr("loc","0")}}var f=a.find(".appNewVersion");if(b[0]["newver"]!=-1){f.text("最新: "+b[0]["newver"])}else{f.text("最新: --")}}}else{if(global.bPhoneSearch=="1"){return}if(b[0]["newver"]==-1&&global.phoneAppID=="canUpdateApp"){return}var g,c;if(b[0]["installloc"]==1){g="手机内存";if(b.move==1){c='<div class="moveToBtn" loc="1">移至SD卡</div>'}else{c='<div class="moveToBtn disable" loc="0">不可移动</div>'}}else{if(b[0]["installloc"]==2){g="SD卡";if(b[0]["move"]==1){c='<div class="moveToBtn" loc="2">移至手机</div>'}else{c='<div class="moveToBtn disable" loc="0">不可移动</div>'}}else{g="未知";c='<div class="moveToBtn disable" loc="0">不可移动</div>'}}var f,h;if(b[0]["newver"]!=-1){f=b[0]["newver"];h='<div class="updateBtn canUpdateBtn" uurl="'+b[0]["uurl"]+'">升级</div>'}else{f="--";h='<div class="updateBtn">升级</div>'}if(global.phoneAppID=="alreadyInstall"){h="";c+='<div class="uninstallBtn">卸载</div>'}else{if(global.phoneAppID=="canUpdateApp"){c=""}}var e="";e='<li id="'+b[0]["pkgname"]+'">                <div class="sel"></div>                <div class="appName">                    <div class="appIcon"><img src="'+b[0]["icon"]+'" onerror="appImgError(this)"/></div>                    <div class="appRealName">'+b[0]["name"]+'</div>                </div>                <div class="splitEmpty"></div>                <div class="appSize">'+b[0]["size"]+'</div>                <div class="splitEmpty"></div>                <div class="appPosition">'+g+'</div>                <div class="splitEmpty"></div>                <div class="appVersion">                     <div class="appCurrVersion">当前: '+b[0]["ver"]+'</div>                     <div class="appNewVersion">最新: '+f+'</div>                 </div>                <div class="splitEmpty"></div>                <div class="appOP">'+h+c+"</div>            </li>";$("#applist").append(e)}checkAllSel();setMenuButton()}}function getPhoneApp(){changePhoneMenu();if(global.phoneAppID=="alreadyInstall"){cef.appStore("getInstalledApp")}else{if(global.phoneAppID=="canUpdateApp"){cef.appStore("getUpdateApp")}}}function addLocalApk(a){cef.param=a+"";cef.appStore("addLocalApk")}function addLocalApkDone(g){var j="";var h=0;var d=0,e="SD卡",b="sd",a=0,f=0;if(g!=""&&g!=null){var c=0;for(c=0;c<g.length;c++){if(h==0){d=g[c]["loc"];if(d=="1"){e="手机";b=""}}else{j+='<li id="'+g[c]["appPackageName"]+'" appName="'+g[c]["appName"]+'" url="'+g[c]["appLocUrl"]+'" loc="'+d+'" bsize="'+g[c]["appbsize"]+'" class="toInstallAppList" >                                <div class="imgTxt"><img src="images/appIconBg.png" onerror="errorImg(this)"/></div>                                <div class="selTxt imgTxtName">'+g[c]["appName"]+'</div>                                <div class="selTxt selTxtVersion">'+g[c]["appVersion"]+'</div>                                <div class="selTxt">'+g[c]["appSize"]+'</div>                                <div class="selTxt selTxtInstallationLoc"><div class="'+b+' switch" onclick="changePos(this)">'+e+'</div></div>                                <div class="selTxt selTxtRemove"><div class="del" onclick="removeSel(this)"></div></div>                            </li>'}h++}}else{}$("#installList").append(j);checkPos();checkSpace()}function checkSpace(){cef.appStore("getSpace")}function checkLeftSpace(a){var f=$('li[loc="1"]');var b=$('li[loc="2"]');var d=0,e=0;for(var c=0;c<f.length;++c){d+=parseInt(f[c].getAttribute("bsize"))}for(var c=0;c<b.length;++c){e+=parseInt(b[c].getAttribute("bsize"))}if(d>parseInt(a.phone)){$(".installPrompt").hide();$("#nospacePrompt").show();console.log("zhuguoyu1111");$("#location").text("手机空间不足");$("#sureInstallLocApk").addClass("disable");return}if(e>parseInt(a.internal)&&e>parseInt(a.external)){$(".installPrompt").hide();$("#nospacePrompt").show();console.log("zhuguoyu2222");$("#location").text("SD卡检测不到或空间不足");$("#sureInstallLocApk").addClass("disable");return}$(".installPrompt").hide();$("#installPrompt").show();checkInstallLocBtn()}function checkInstallLocBtn(){var a=$("#installList li").length;if(a<=0){$("#sureInstallLocApk").addClass("disable")}else{$("#sureInstallLocApk").removeClass("disable")}$("#installPrompt").show();$("#waitPrompt").hide();$("#disableCover").hide()}function waitForSelApp(){$("#sureInstallLocApk").addClass("disable");$("#installPrompt").hide();$("#waitPrompt").show();$("#disableCover").show()}function sureInstallLocApk(d){if($(d).hasClass("disable")){return}var b="";var e=0;var c="",a="";$("#installList").find("li").each(function(){c=$(this).attr("url");a=$(this).attr("appName");c=c.replace(/\\/g,"\\\\");a=a.replace(/\\/g,"\\\\");if(e==0){b='{"name":"'+a+'","packageName":"'+$(this).attr("id")+'","version":"'+$(this).find(".selTxtVersion").text()+'","localApk":"'+c+'","installLoc":'+$(this).attr("loc")+"}"}else{b+=',{"name":"'+a+'","packageName":"'+$(this).attr("id")+'","version":"'+$(this).find(".selTxtVersion").text()+'","localApk":"'+c+'","installLoc":'+$(this).attr("loc")+"}"}e++});appInstallPrompt(e,a);if(b!=""){cef.param="["+b+"]";cef.appStore("installLocalApk")}document.getElementById("installAppPop").style.display="none"}function appInstallPrompt(c,a){if(c==1){a="应用 <span>"+a+"</span><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;已经成功添加到下载任务中！"}else{a="共 <span>"+a+"</span>等，"+c+" 应用个<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;已经成功添加到下载任务中！"}document.getElementById("downloadName").innerHTML=a;var b=document.getElementById("downloadBubble");b.style.display="block";setTimeout(function(){b.style.display="none"},2000)}function cancelInstallLocApk(){document.getElementById("installList").innerHTML="";cef.appStore("stopSelLocalApk")}function searchInstalledHandle(){var a=global.searchInstalledObj.val();if(a!=global.searchTxt){global.searchTxt=a;a=global.searchInstalledObj.val();if(a==""){global.bPhoneSearch="0";getPhoneApp()}else{global.bPhoneSearch="1";var b="0";if(global.phoneAppID=="alreadyInstall"){b="0"}else{if(global.phoneAppID=="canUpdateApp"){b="1"}}cef.param=b+a;cef.appStore("searchPhoneApp")}}}function changePhoneMenu(){if(global.phoneAppID=="alreadyInstall"){document.getElementById("menuUninstall").style.display="block";document.getElementById("menuUpdate").style.display="none"}else{if(global.phoneAppID=="canUpdateApp"){document.getElementById("menuUninstall").style.display="none";document.getElementById("menuUpdate").style.display="block"}}}function setInstalledNum(b){var a="已安装 ("+b+")";$("#installedli").text(a)}function setCanupdateNum(b){var a="可更新 ("+b+")";$("#canUpdateli").text(a)}function changePhoneAppStatus(b,a){if(global.phoneAppID=="alreadyInstall"){return}if(b=="4"){var c=document.getElementById(a);if(c!=null){c.parentNode.removeChild(c)}}else{if(b=="-1"){var c=document.getElementById(a);if(c!=null){$(c).find(".updateBtn").addClass("disable").text("下载中")}}else{if(b=="7"||b=="5"){var c=document.getElementById(a);if(c!=null){$(c).find(".updateBtn").addClass("disable").text("安装中")}}else{if(b=="6"||b=="8"||b=="3"){var c=document.getElementById(a);if(c!=null){$(c).find(".updateBtn").removeClass("disable").text("升级")}}}}}setMenuButton()};