$(document).ready(function(){$.event.props=$.event.props.join("|").replace("layerX|layerY|","").split("|");$("#blockManager").show();$("#cateName").find(".catItem").each(function(){$(this).remove()});global.currentPath=parent.global.currentPath;global.streamType="audio";$(".close").hover(function(){$(this).css("background-position-x","-31px")},function(){$(this).css("background-position-x","0px")}).mousedown(function(){$(this).css("background-position-x","-62px")}).mouseup(function(){$(this).css("background-position-x","0px");$(this).parent().parent().parent().hide()});$(".submitButton").hover(function(){$(this).css("background-position-y","-28px")},function(){$(this).css("background-position-y","0px")}).mousedown(function(){$(this).css("background-position-y","-56px")}).mouseup(function(){$(this).css("background-position-y","0px")});$("#listStyleBtn").click(function(){if($("#listStyle").css("display")=="none"){$("#blockStyle").hide();$("#listStyle").show();$("#listStyleNor").hide();$("#blockStyleNor").show();$("#fileList").attr("class","listList");$("#blockManager").hide();$("#listManager").show()}else{$("#blockStyle").show();$("#listStyle").hide();$("#blockStyleNor").hide();$("#listStyleNor").show();$("#fileList").attr("class","blockList");$("#blockManager").show();$("#listManager").hide()}});$("#listStyle,#blockStyle").click(function(){return false});$(document).mousedown(function(){hidePopMenus()});$(".rcList").click(function(a){if($(this).hasClass("disable")){return false}hidePopMenus();stopBubble(a)}).hover(function(){if($(this).hasClass("disable")){return false}if($(this).hasClass("rcListTop")){$(this).addClass("rcListTop-over");return}else{if($(this).hasClass("rcListBottom")){$(this).addClass("rcListBottom-over");return}}$(this).addClass("rcList-over")},function(){if($(this).hasClass("disable")){return false}if($(this).hasClass("rcListTop")){$(this).removeClass("rcListTop-over");return}else{if($(this).hasClass("rcListBottom")){$(this).removeClass("rcListBottom-over");return}}$(this).removeClass("rcList-over")}).mousedown(function(a){stopBubble(a)})});window.onload=function(){refreshFileList()};function stopBubble(a){if(a&&a.stopPropagation){a.stopPropagation()}else{window.event.cancelBubble=true}}document.oncontextmenu=new Function("return false;");document.onkeydown=keyDown;document.onkeyup=keyUp;function keyUp(){if(event.keyCode==17){global.isCtrlKeyPressing=0;return}}function keyDown(){if(event.keyCode==17){global.isCtrlKeyPressing=1;return}if(event.keyCode==13){if(global.currentShowedCover=="confirmTipPromt"){confirmDelAction()}else{if(global.currentShowedCover=="fileNameConfirm"){fileNameConfirmAction()}}return}else{if(event.keyCode==27){if(global.currentShowedCover=="bubble"){return}hideCoverScreens();return}else{if(event.keyCode==116){if(global.currentShowedCover=="none"){refreshFileList()}return}else{var a=false;$(".coverScreen").each(function(){if(!$(this).is(":hidden")){a=true}});if(a){return}}}}if(event.keyCode==65&&global.isCtrlKeyPressing==1){allSd()}else{if(event.keyCode==67&&global.isCtrlKeyPressing==1){copyAction()}else{if(event.keyCode==88&&global.isCtrlKeyPressing==1){cutAction()}else{if(event.keyCode==46){deleteShow()}else{if(event.keyCode==83&&global.isCtrlKeyPressing==1){}else{}}}}}}var global={currentPath:"",toDeleteCnt:0,isCtrlKeyPressing:0,csRCFileName:"",csRCFileFullPath:"",nRCFileNamePosL:0,nRCFileNamePosT:0,nRCFileNamePosWidth:0,streamType:"",currentShowedCover:"none"};function hidePopMenus(){$("#streamMoreActionMenu").hide();$("#rClickPopMenu").hide()}function hideCoverScreens(){$("#confirmTipPromt").hide();$("#dirNamePrompt #promptDirNameTip").hide();$("#confirmDirNameDlg").hide();$("#bubble").hide();$("#fileNameInputPrompt").hide();global.currentShowedCover="none"}function showMorePopMenu(){$("#streamMoreActionMenu").show().focus()}function newDir(a){if($(a).hasClass("disable")){return}$("#dirNamePrompt").show();document.getElementById("dirName").value="";document.getElementById("dirName").focus()}function upLoad(a){if($(a).hasClass("disable")){return}cef.param='[{"path":"'+global.currentPath+'"}]';cef.cloud("beginUploadFile");$("#bubble").show();global.currentShowedCover="bubble"}function downLoad(c){if($(c).hasClass("disable")){return}$("#bubble").show();global.currentShowedCover="bubble";var b="[";var a=0;$("#fileList").find(".select_on").each(function(){if($(this).parent().find(".isFile").length>0){if(a==0){b+='{"path":"'+$(this).parent().find(".hidedFilePath").text()+'"}';a++}else{b+=',{"path":"'+$(this).parent().find(".hidedFilePath").text()+'"}'}}});b+="]";cef.param=b;cef.cloud("beginDownMultiFile")}function deleteFiles(a){if($(a).hasClass("disable")){return}deleteShow()}function deleteShow(){$("#confirmTipPromt").show();global.currentShowedCover="confirmTipPromt"}function more(a){if($(a).hasClass("disable")){return}hidePopMenus();showMorePopMenu()}function copyActionMenu(a){if($(a).hasClass("disable")){return}copyAction()}function copyAction(){var b="[";var a=0;global.toDeleteCnt=0;$("#fileList").find(".select_on").each(function(){var d=$(this).parent().find(".hidedFilePath").text();d=escape(d).replace(/%u/g,"\\u");if(a==0){b+='{"path":"'+d+'"}';a++}else{b+=',{"path":"'+d+'"}'}global.toDeleteCnt++});b+="]";var c='[{"action":"copy","list":'+b+"}]";cef.param=c;cef.cloud("setFileClipBoard")}function cutActionMenu(a){if($(a).hasClass("disable")){return}cutAction()}function cutAction(){var b="[";var a=0;global.toDeleteCnt=0;$("#fileList").find(".select_on").each(function(){var d=$(this).parent().find(".hidedFilePath").text();d=escape(d).replace(/%u/g,"\\u");if(a==0){b+='{"path":"'+d+'"}';a++}else{b+=',{"path":"'+d+'"}'}global.toDeleteCnt++});b+="]";var c='[{"action":"cut","list":'+b+"}]";cef.param=c;cef.cloud("setFileClipBoard")}function pasteActionMenu(a){if($(a).hasClass("disable")){return}pasteAction()}function pasteAction(){cef.cloud("getFileClipBoard");var d=cef.param;if(d==null||d==""){return}var c=jQuery.parseJSON(d);if(c.length<1){return}$("#bubble").show();global.currentShowedCover="bubble";var a=c[0]["list"];var k=a.length;var j='{"list":[';var b=0;for(b=0;b<k;b++){var g=a[b]["path"];var e=g.lastIndexOf("/")+1;var f=g.length;var h=g.substring(e,f);if(b==0){j+='{"from":"'+g+'","to":"'+escape(global.currentPath+h)+'"}'}else{j+=',{"from":"'+g+'","to":"'+escape(global.currentPath+h)+'"}'}}j+="]}";cef.param=j;cef.cloud("pasteFile")}function refresh(a){if($(a).hasClass("disable")){return}refreshFileList()}function refreshFileList(){cef.param='[{"path":"'+global.streamType+'"}]';cef.cloud("beginGetStreamList");$("#bubble").show();global.currentShowedCover="bubble"}function upLevelPath(a){doUpLevel()}function doUpLevel(){var a=0;$("#cateName").find(".catItem").each(function(){if(a==0&&$(this).find(".catItem").length==0){a=1;$(this).remove()}});global.currentPath=global.currentPath.substring(0,global.currentPath.lastIndexOf("/"));global.currentPath=global.currentPath.substring(0,global.currentPath.lastIndexOf("/")+1);cef.param='[{"path":"'+global.streamType+'"}]';cef.cloud("beginGetStreamList");$("#bubble").show();global.currentShowedCover="bubble"}function showFileList(f){hideCoverScreens();if(f.length<1){var a="<ul></ul>";$("#fileList").html(a);refreshTopMenu();return}var b=f[0]["list"];var m=b.length;var a="<ul>";var c=0;for(c=0;c<m;c++){var h=b[c]["path"];var d=h.lastIndexOf("/")+1;var e=h.length;var k=h.substring(d,e);k=unescape(k);h=unescape(h);var l=b[c]["mtime"];var n=stimeTosting(l);var j=b[c]["size"];var g=b[c]["isdir"];if(g==1){a+='<li id="'+b[c]["fs_id"]+'" onmousedown="fileItemMouseDown(this)"  title="'+k+'"><div class="sn" onmousedown="sd(this)"></div><div class="fileImg" onclick="clickFileItem(this)"><img src="../images/dirIcon.png" /></div><div class="cutIcon-img-dir" onclick="clickFileItem(this)"></div>                <div class="hidedFilePath">'+h+'</div><div class="fileName" onclick="clickFileItem(this)"><a>'+k+'</a></div><div class="editDate">'+n+'</div><div class="fileSize">'+sizeTosting(j)+'</div><div class="isDir"></div></li>'}else{a+='<li id="'+b[c]["fs_id"]+'" onmousedown="fileItemMouseDown(this)"  title="'+k+'"><div class="sn" onmousedown="sd(this)"></div><div class="fileImg" onclick="clickFileItem(this)"><img src="../images/fileIcon.png" /></div><div class="cutIcon-img-file" onclick="clickFileItem(this)"></div>                <div class="hidedFilePath">'+h+'</div><div class="fileName" onclick="clickFileItem(this)"><a>'+k+'</a></div><div class="editDate">'+n+'</div><div class="fileSize">'+sizeTosting(j)+'</div><div class="isFile"></div></li>'}}a+="</ul>";$("#fileList").html(a);refreshTopMenu()}function stimeTosting(g){g=g*1000;var b=new Date(g);var e=b.getHours();var c=b.getMinutes();var k=b.getSeconds();var i=b.getFullYear();var a=b.getMonth()+1;var f=b.getDate();var j=i+"-"+a+"-"+f+" "+e+":"+c+":"+k;return j}function sizeTosting(b){var a,c;if(b<1024){a=b+"B";return a}if(b<1024*1024){c=new Number(b/1024);a=c.toFixed(1)+"K";return a}if(b<1024*1024*1024){c=new Number(b/(1024*1024));a=c.toFixed(1)+"M";return a}else{c=new Number(b/(1024*1024*1024));a=c.toFixed(1)+"G";return a}}function fileItemMouseDown(c,f){var g=f||window.event;if(g.button==2){var a=g.clientX+5;var j=g.clientY;hidePopMenus();var i=$("#rClickPopMenu");var b=document.body.scrollWidth;var d=document.body.scrollHeight;if(b-a<60){a-=65}if(d-j<84){j-=84}i.css({left:a,top:j});i.show().focus();global.csRCFileFullPath=$(c).find(".hidedFilePath").text();global.nRCFileNamePosL=$(c).find(".fileName").offset().left;global.nRCFileNamePosT=$(c).find(".fileName").offset().top;global.nRCFileNamePosWidth=$(c).find(".fileName").width();stopBubble(g)}}function jumptoDir(a){$(a).parent().find(".catItem").each(function(){$(this).remove()});global.currentPath=$(a).parent().find(".hidedCatPath").text();cef.param='[{"path":"'+global.streamType+'"}]';cef.cloud("beginGetStreamList");$("#bubble").show();global.currentShowedCover="bubble";var b=event||window.event;stopBubble(b)}function clickFileItem(b){if($(b).hasClass("disable")){return}if($(b).parent().find(".isDir").length==0){cef.param='[{"path":"'+$(b).parent().find(".hidedFilePath").text()+'"}]';cef.cloud("beginDownFile");$("#bubble").show();global.currentShowedCover="bubble"}else{global.currentPath=$(b).parent().find(".hidedFilePath").text()+"/";if($("#cateName").find(".catItem").length==0){var d=$(b).parent().find(".fileName").text();if(d.length>12){d=d.substring(0,10)+"…"}var a='<div class="catItem"><div class="hidedCatPath">'+global.currentPath+'</div><div class="showedCatName" onclick="jumptoDir(this)"><a>'+d+"</a>&nbsp;>&nbsp;</div></div>";$("#cateName").append(a)}else{var c=0;$("#cateName").find(".catItem").each(function(){if(c==0&&$(this).find(".catItem").length==0){c=1;var f=$(b).parent().find(".fileName").text();if(f.length>12){f=f.substring(0,10)+"…"}var e='<div class="catItem"><div class="hidedCatPath">'+global.currentPath+'</div><div class="showedCatName" onclick="jumptoDir(this)"><a>'+f+"</a>&nbsp;>&nbsp;</div></div>";$(this).append(e)}})}$("#bubble").show();global.currentShowedCover="bubble";cef.param='[{"path":"'+global.streamType+'"}]';cef.cloud("beginGetStreamList")}}function onDirnameInputSth(a){if($(a).hasClass("disable")){return}var b=a.value;if(b.length>0){$("#confirmDirName").removeClass("disable")}else{$("#confirmDirName").addClass("disable");return}if(event.keyCode==13){confirmDirName(a)}}function confirmDirName(b){if($(b).hasClass("disable")){return}var c=document.getElementById("dirName").value;var a=global.currentPath+c;cef.param='[{"path":"'+a+'"}]';cef.cloud("beginCreateDir");hideCoverScreens();$("#bubble").show();global.currentShowedCover="bubble"}function cancelDirName(a){hideCoverScreens()}function confirmDel(a){if($(a).hasClass("disable")){return}confirmDelAction()}function confirmDelAction(){hideCoverScreens();$("#bubble").show();global.currentShowedCover="bubble";var b="[";var a=0;global.toDeleteCnt=0;$("#fileList").find(".select_on").each(function(){var c=$(this).parent().find(".hidedFilePath").text();c=escape(c).replace(/%u/g,"\\u");if(a==0){b+='{"path":"'+c+'"}';a++}else{b+=',{"path":"'+c+'"}'}global.toDeleteCnt++});b+="]";cef.param=b;cef.cloud("beginDeleteFile")}function cancelDel(a){hideCoverScreens()}function createDirOver(e){hideCoverScreens();var j=e.length;if(j<1){refreshFileList();return}var a="";var b=0;for(b=0;b<j;b++){var f=e[b]["path"];var c=f.lastIndexOf("/")+1;var d=f.length;var g=f.substring(c,d);g=unescape(g);f=unescape(f);var h=e[b]["mtime"];var k=stimeTosting(h);a+='<li id="'+e[b]["fs_id"]+'" onmousedown="fileItemMouseDown(this)"  title="'+g+'"><div class="sn" onmousedown="sd(this)"></div><div class="fileImg" onclick="clickFileItem(this)"><img src="../images/dirIcon.png" /></div><div class="cutIcon-img-dir" onclick="clickFileItem(this)"></div>            <div class="hidedFilePath">'+f+'</div><div class="fileName" onclick="clickFileItem(this)"><a>'+g+'</a></div><div class="editDate">'+k+'</div><div class="fileSize">'+sizeTosting(0)+'</div><div class="isDir"></div></li>'}$("#fileList").find("ul").append(a)}function postFileOver(e){var j=e.length;if(j<1){return}var b="";var f=e[0]["path"];var c=f.lastIndexOf("/")+1;var a=f.substring(0,c);if(a!=global.currentPath){return}var d=f.length;var h=f.substring(c,d);h=unescape(h);f=unescape(f);var i=e[0]["mtime"];var k=stimeTosting(i);var g=e[0]["size"];b+='<li id="'+e[0]["fs_id"]+'" onmousedown="fileItemMouseDown(this)"  title="'+h+'"><div class="sn" onmousedown="sd(this)"></div><div class="fileImg" onclick="clickFileItem(this)"><img src="../images/fileIcon.png" /></div><div class="cutIcon-img-file" onclick="clickFileItem(this)"></div>        <div class="hidedFilePath">'+f+'</div><div class="fileName" onclick="clickFileItem(this)"><a>'+h+'</a></div><div class="editDate">'+k+'</div><div class="fileSize">'+sizeTosting(g)+'</div><div class="isFile"></div></li>';$("#fileList").find("ul").append(b)}function sd(a){var b=$(a);if(b.hasClass("select_on")){a.className="sn"}else{a.className="sn select_on"}refreshTopMenu()}function allSd(){var b=$(".selAll");var a=$("#fileList").find("li");if(a.length<=0){b.removeClass("selAll_on");return}if(b.hasClass("selAll_on")){b.removeClass("selAll_on");a.find(".select_on").removeClass("select_on")}else{b.addClass("selAll_on");a.find(".sn").addClass("select_on")}refreshTopMenu()}function refreshTopMenu(){var a=$("#fileList").find(".sn").length;var c=$("#fileList").find(".select_on").length;var b=0;$("#fileList").find(".select_on").each(function(){if($(this).parent().find(".isFile").length>0){b++}});if(a==c&&a!=0){$("#blockAllSelect").addClass("selAll_on");$("#listAllSelect").addClass("selAll_on")}else{$("#blockAllSelect").removeClass("selAll_on");$("#listAllSelect").removeClass("selAll_on")}if(c>0){$("#deleteFiles").removeClass("disable");$("#copyActionMenu").removeClass("disable");$("#cutActionMenu").removeClass("disable")}else{$("#deleteFiles").addClass("disable");$("#copyActionMenu").addClass("disable");$("#cutActionMenu").addClass("disable")}if(b>0){$("#downLoad").removeClass("disable")}else{$("#downLoad").addClass("disable")}}function uploadingFileBegin(a){hideCoverScreens();if(a==null||a==""){return}var b=a[0]["path"];if(b==""){return}}function downloadingFileBegin(a){hideCoverScreens();if(a==null||a==""){return}var b=a[0]["path"];if(b==""){return}}function deleteFilesBegin(a){return}function deleteFilesOver(a){refreshFileList()}function rcCopyActionMenu(b){if($(b).hasClass("disable")){return}var a="[";var d=global.csRCFileFullPath;d=escape(d).replace(/%u/g,"\\u");a+='{"path":"'+d+'"}';a+="]";var c='[{"action":"copy","list":'+a+"}]";cef.param=c;cef.cloud("setFileClipBoard")}function rcCutActionMenu(b){if($(b).hasClass("disable")){return}var a="[";var d=global.csRCFileFullPath;d=escape(d).replace(/%u/g,"\\u");a+='{"path":"'+d+'"}';a+="]";var c='[{"action":"cut","list":'+a+"}]";cef.param=c;cef.cloud("setFileClipBoard")}function rcResetFileName(b){if($(b).hasClass("disable")){return}$("#fileNameInputDiv").css({left:global.nRCFileNamePosL+4,top:global.nRCFileNamePosT-2});$("#fileNameInput").width(global.nRCFileNamePosWidth);$("#fileNameInputPrompt").show();global.currentShowedCover="fileNameConfirm";var g=global.csRCFileFullPath;var e=g.lastIndexOf("/")+1;var f=g.substring(e);document.getElementById("fileNameInput").value=f;var d=0;if(g.lastIndexOf(".")<5){d=f.length}else{d=f.lastIndexOf(".")}var c=document.getElementById("fileNameInput");if(c.setSelectionRange){c.focus();c.setSelectionRange(0,d)}else{if(c.createTextRange){var a=c.createTextRange();a.collapse(true);a.moveEnd("character",0);a.moveStart("character",d);a.select()}}}function confirmDirNameDlg(a){if($(a).hasClass("disable")){return}$("#confirmDirNameDlg").hide()}function fileNameConfirm(a){if($(a).hasClass("fileNameInputDisable")){return}fileNameConfirmAction()}function fileNameConfirmAction(){var c=document.getElementById("fileNameInput").value;if(c.lastIndexOf(".")==0||(c.lastIndexOf(".")==-1&&c.length<1)){var d="文件名不能为空！";$("#confirmDirName_message").text(d);$("#confirmDirNameDlg").show();return}var f=global.csRCFileFullPath;var e=f.substring(0,f.lastIndexOf("/")+1)+c;if(f==e){hideCoverScreens();return}if(c.length>200){var d="文件名长度不能超过200个字！";$("#confirmDirName_message").text(d);$("#confirmDirNameDlg").show();return}var b=/[\/\\\?\|\"\>\<\:\*]/;if(b.test(c)){var d='文件名不能包含下列任何字符：/  ? | " > < : *';$("#confirmDirName_message").text(d);$("#confirmDirNameDlg").show();return}var a='{"list":[';a+='{"from":"'+escape(f).replace(/%u/g,"\\u")+'","to":"'+escape(e).replace(/%u/g,"\\u")+'"}';a+="]}";cef.param=a;cef.cloud("reserFileName");hideCoverScreens();$("#bubble").show();global.currentShowedCover="bubble"}function fileNameCancel(a){hideCoverScreens()}function onFilenameInputSth(a){if($(a).hasClass("disable")){return}var b=a.value;if(b.lastIndexOf(".")>0||(b.lastIndexOf(".")==-1&&b.length>0)){$("#fileNameConfirm").removeClass("fileNameInputDisable")}else{$("#fileNameConfirm").addClass("fileNameInputDisable");return}}function switchOnThisMode(){if(global.currentShowedCover=="bubble"){refreshFileList()}};