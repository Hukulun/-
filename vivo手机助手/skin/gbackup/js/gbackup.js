global={bConnected:false,bBackup:true,bAll:false};progressor={total:0,current:0};$(document).ready(function(){console.log("document ready!");$("#title").bind("mousedown",function(a){if(a.button==0){window.CaptureWindow(event.clientX,event.clientY)}});$("#closeButton").bind("click",function(){window.ExitApp()});$("#backupAllPage .allProgressBar").progressbar({value:false,change:function(a,b){var c=$(this).progressbar("value");if(c==false){$("#backupAllPage .progressText").text("");return}$("#backupAllPage .progressText").text(c+"%")},complete:function(a,b){$("#backupAllPage .progressNoteText").text("{{backup_js_progressNoteText_backupComplete_lang}}");$("#allBackupCancellButton").text("{{backup_js_allBackupCancelButton_complete_lang}}")}});$("#restoreAllPage .allProgressBar").progressbar({value:false,change:function(a,b){var c=$(this).progressbar("value");if(c==false){$("#restoreAllPage .progressText").text("");return}$("#restoreAllPage .progressText").text(c+"%")},complete:function(a,b){$("#restoreAllPage .progressNoteText").text("{{backup_js_progressNoteText_restoreComplete_lang}}")}});$("#backupAllButton").on("click",function(){if(global.bConnected===false){return}$("#menuBar .allCheck").removeAttr("disabled");$("#menuBar .allCheck").prop("checked",false);$("#optionalBackupStartButton").show();$("#optionaBackupCancellButton").text("{{backup_js_optionaBackupCancelButton_cancel_lang}}");hideAllPage();$("#backupOptionalPage").show();global.bBackup=true;$("#backupOptionalPage .backupOptionalNote").text("{{backup_js_backupOptionalNote_backup_lang}}");$("#optionalBackupStartButton").text("{{backup_js_optionalBackupStart_backupStart_lang}}");$("#optionalBackupStartButton").attr("disabled","disabled");$("#backupOptionalPathButton").removeAttr("disabled");$.ajax({url:"http://gbackup/getBackupItem",type:"GET",success:function(e){var a=JSON.parse(e);var d=window.GetExternalStorageState();var c={_dataList:a.list,ExternalStorageState:d,RestoreApp:true};var b=template("optionalItemTemplate",c);$("#backupOptionalItem").html(b);$("#backupOptionalItem").css({height:"200"});$("#backupOptionalPage .optionalPath").show();$("#backupOptionalPage .path").attr("value",a.path);$("#tip").text("{{backup_js_tip_app_backup_lang}}").show();if(d==false){$("#tip").text("{{backup_js_tip_externalStorageStateisFalse_lang}}").show()}},error:function(){},complete:function(){}})});$("#optionalBackupStartButton").on("click",function(){csJson=new Array();var d=$(".rootItem");var m=false;for(var e=0;e<d.length;++e){var l={};var k=$(d[e]).attr("id");var c=new Array();var h=$("#"+k+" .childItem");var g=false;if(h.length==0){if($("#"+k+" .checkAllItem").prop("checked")==true){g=true}}else{for(var b=0;b<h.length;++b){var a=$(h[b]).attr("id");var f=$(h[b]).find("input");if($(f).prop("checked")==true){c.push(a);g=true}}}if(g){l.id=k;l.list=c;$("#"+k+" .progressBar").show();$("#"+k+" .lastTime").hide();csJson.push(l);m=true}}if(!m){return}$(this).hide();csJson=JSON.stringify(csJson);$("#backupOptionalItem  .progressBar").progressbar({value:0,change:function(i,j){var n=$(this).progressbar("value")},complete:function(i,j){}});if(global.bBackup){startBackup(csJson)}else{optionalRestore(csJson)}});$("#backupOptionalItem").on("click",".checkAllItem",function(){var c=$(this).parent().attr("id");if($(this).prop("checked")==false){$("#"+c+" .childItem .checkItem").prop("checked",false)}else{$("#"+c+" .childItem .checkItem").prop("checked",true)}var b=shouldBeAllChecked();$("#menuBar .allCheck").prop("checked",b);var a=$("#backupOptionalItem input[type=checkbox]:checked").length;if(a>0){$("#optionalBackupStartButton").removeAttr("disabled")}else{$("#optionalBackupStartButton").attr("disabled","disabled")}});$("#backupOptionalItem").on("click",".checkItem",function(){var b=$(this).parent().parent().attr("id");if($(this).prop("checked")==false){$("#"+b+" .checkAllItem").prop("checked",false)}else{var d=shouldCheckedRoot(b);$("#"+b+" .checkAllItem").prop("checked",d)}var c=shouldBeAllChecked();$("#menuBar .allCheck").prop("checked",c);var a=$("#backupOptionalItem input[type=checkbox]:checked").length;if(a>0){$("#optionalBackupStartButton").removeAttr("disabled")}else{$("#optionalBackupStartButton").attr("disabled","disabled")}});$("#menuBar .allCheck").on("click",function(){var b=$(".allCheck").prop("checked");$('.checkAllItem[disabled!="disabled"]').prop("checked",b);$('.checkItem[disabled!="disabled"]').prop("checked",b);var a=$("#backupOptionalItem input[type=checkbox]:checked").length;if(b===true&&a>0){$("#optionalBackupStartButton").removeAttr("disabled")}else{$("#optionalBackupStartButton").attr("disabled","disabled")}});$("#restoreAllbutton").on("click",function(){if(global.bConnected===false){return}global.bBackup=false;var a={};a.bAll=global.bAll;$.ajax({url:"http://gbackup/getBackupPackageList",type:"POST",data:JSON.stringify(a),success:function(f){if(f==null||f=="null"||f==undefined||f=="undefined"){return}var c=JSON.parse(f);var e={_dataList:c};var d=template("restoreItemTemplate",e);$("#restoreAllPage .restoreAllItemList").html(d).show();$("#restoreAllPage .restoreAllNote").show();$("#restoreAllPage .progressAllNote").hide();$("#restoreAllPage .allProgressBar").hide();$("#retoreAllPathButton").show();$("#allRestoreCancellButton").text("{{backup_js_allRestoreCancelButton_cancel_lang}}").attr("package",true);var b=$("#restoreAllPage .item").length;if(b==0){$("#allRestoreStartButton").text("{{backup_js_allRestoreStartButton_empty_lang}}")}else{$("#allRestoreStartButton").text("{{backup_js_allRestoreStartButton_notEmpty_lang}}")}hideAllPage();$("#restoreAllPage").show()},error:function(){},complete:function(){}})});$("#restoreAllPage").on("dblclick",".item",function(){var b=$(this).attr("path");var a={};a.path=b;a.bAll=global.bAll;$.ajax({url:"http://gbackup/startRestore",type:"POST",data:JSON.stringify(a),success:function(c){showOptionRestore(c)},error:function(){},complete:function(){}})});$("#allRestoreCancellButton").on("click",function(){if($(this).attr("package")!=undefined){$(this).removeAttr("package");hideAllPage();$("#selectFunPage").show()}else{var a=this;$(a).attr("disabled","disabled");$.ajax({url:"http://gbackup/cancel",TYPE:"GET",success:function(b){$("#restoreAllPage .restoreAllItemList").show();$("#restoreAllPage .restoreAllNote").show();$("#restoreAllPage .progressAllNote").hide();$("#restoreAllPage .allProgressBar").hide();$("#retoreAllPathButton").show();$("#allRestoreCancellButton").text("{{backup_js_allRestoreCancelButton_cancel_lang}}").attr("package",true);$("#allRestoreStartButton").show();hideAllPage();$("#restoreAllPage").show();$(a).removeAttr("disabled")},error:function(){},complete:function(){}})}});$("#optionaBackupCancellButton").on("click",function(){var a=($(this).attr("restore")!=undefined);$(this).removeAttr("restore");var b=this;$(b).attr("disabled","disabled");$.ajax({url:"http://gbackup/cancel",TYPE:"GET",success:function(c){$(b).removeAttr("disabled");$("#backupOptionalItem").empty();hideAllPage();if(a===true){$("#allRestoreCancellButton").text("{{backup_js_allRestoreCancelButton_cancel_lang}}").attr("package",true);$("#restoreAllPage").show()}else{hideAllPage();$("#selectFunPage").show()}},error:function(){},complete:function(){}})});$("#backupOptionalItem").on("click",".triggerItem",function(){var b=$(this);var a=$(this).parent().parent().attr("id");if(b.hasClass("openItem")){b.removeClass("openItem").addClass("hideItem");$("#"+a+" .childItem").hide()}else{b.removeClass("hideItem").addClass("openItem");$("#"+a+" .childItem").show()}});$("#backupOptionalPathButton").on("click",function(){$.ajax({url:"http://gbackup/setBackupPath",TYPE:"GET",success:function(a){if(a==""||a==undefined||a=="undefined"){return}$("#backupOptionalPage .path").attr("value",a)},error:function(){},complete:function(){}})});$("#retoreAllPathButton").on("click",function(){if($("#oldformat").prop("checked")==true){$.ajax({url:"http://gbackup/selectzip",TYPE:"GET",success:function(a){if(a==="cancel"){return}$.ajax({url:"http://gbackup/parserzip",type:"POST",data:a,success:function(b){if(b=="error"){$("#tip").text("{{backup_js_tip_wrongFile_lang}}").show();setTimeout(function(){$("#tip").hide()},2000);return}showOptionRestore(b)},error:function(){},complete:function(){}})},error:function(){},complete:function(){}})}else{$.ajax({url:"http://gbackup/parserDirecotry",TYPE:"GET",success:function(a){if(a==""||a==undefined||a=="undefined"||a=="cancel"){return}else{if(a==="error"){$("#tip").text("{{backup_js_tip_wrongDir_lang}}").show();setTimeout(function(){$("#tip").hide()},2000);return}}showOptionRestore(a)},error:function(){},complete:function(){}})}})});window.onload=function(){connectDevice()};function connectDevice(){$.ajax({url:"http://gbackup/connect",type:"GET",success:function(a){console.log(a)},error:function(){},complete:function(){}})}function hideAllPage(){$(".page").hide();$("#tip").hide();$("#backupAllPage .allProgressBar").progressbar("value",0);$("#restoreAllPage .allProgressBar").progressbar("value",0);$("#backupOptionalItem").empty()}function onConnectting(a){if(a=="0"){$("#connectState_text_bgcolor").text("{{backup_js_connectState_beginConnect_lang}}")}else{if(a=="1"){$("#connectState_text_bgcolor").text("{{backup_js_connectState_installAssistant_lang}}")}else{if(a=="2"){$("#connectState_text_bgcolor").text("{{backup_js_connectState_updateAssistant_lang}}")}else{if(a=="3"){$("#connectState_text_bgcolor").text("{{backup_js_connectState_connectSuccess_lang}}");global.bConnected=true;gePhoneInfo()}else{if(a=="4"){$("#connectState_text_bgcolor").text("{{backup_js_connectState_notSupportBackup_lang}}").addClass("sansuo");setTimeout(function(){$("#connectState_text_bgcolor").text("{{backup_js_connectState_connectSuccess_lang}}").removeClass("sansuo")},3000)}else{if(a=="5"){$("#connectState_text_bgcolor").text("{{backup_js_connectState_notSupportRestore_lang}}").addClass("sansuo");setTimeout(function(){$("#connectState_text_bgcolor").text("{{backup_js_connectState_connectSuccess_lang}}").removeClass("sansuo")},3000)}else{$("#connectState_text_bgcolor").text("{{backup_js_connectState_installDriver_lang}}")}}}}}}}function gePhoneInfo(){$.ajax({url:"http://gbackup/getPhoneInfo",type:"get",success:function(b){var a=JSON.parse(b);if(a["version.pcservice"]<=0){$("#backupAllButton").attr("disabled","disabled");$("#restoreAllbutton").attr("disabled","disabled")}else{$("#backupAllButton").removeAttr("disabled","disabled");$("#restoreAllbutton").removeAttr("disabled","disabled")}},error:function(){},complete:function(a){}})}function shouldCheckedRoot(a){var d=$("#"+a+" .checkItem");var b=0;var e=$(d).length;for(var c=0;c<e;++c){if($(d[c]).prop("checked")==true){++b}}return b==e}function shouldBeAllChecked(){var c=$('.checkAllItem[disabled!="disabled"]');var a=0;for(var b=0;b<c.length;++b){if($(c[b]).prop("checked")==true){++a}}return a==c.length}function startBackup(a){$("#backupOptionalPage input").attr("disabled","disabled");$("#backupOptionalPathButton").attr("disabled","disabled");$.ajax({url:"http://gbackup/backup",type:"post",data:a,success:function(b){$("#allBackupCancellButton").text("{{backup_js_allBackupCancelButton_complete_lang}}");$("#optionaBackupCancellButton").text("{{backup_js_optionaBackupCancelButton_complete_lang}}")},error:function(){console.log("error")},complete:function(){console.log("complete")}})}function onDisconnect(){global.bConnected=false;hideAllPage();$("#connectState_text_bgcolor").text("{{backup_js_connectState_disConnect_lang}}");$("#selectFunPage").show()}function setConnectFailedState(a){console.log(a)}function setProgress(c){var a=JSON.parse(c);var f=a.id;var d=parseInt(a.index);var b=parseInt(a.count);if(global.bBackup){if(global.bAll){if(b==0){$("#backupAllPage ."+f+" .stateImage").removeClass("doing");$("#backupAllPage ."+f+" .stateImage").addClass("done")}else{if(b==-1){$("#backupAllPage ."+f+" .stateImage").attr("class","stateImage");$("#backupAllPage ."+f+" .stateImage").addClass("failed")}else{if(d!=0){var e=parseInt(parseInt(++progressor.current)*100/parseInt(progressor.total));$("#backupAllPage .allProgressBar").progressbar("value",e);if(d==b){$("#backupAllPage ."+f+" .stateImage").removeClass("doing");$("#backupAllPage ."+f+" .stateImage").addClass("done")}}else{$("#backupAllPage ."+f+" .stateImage").removeClass("unStart");$("#backupAllPage ."+f+" .stateImage").addClass("doing")}}}$("#backupAllPage ."+f+" .nCount").text(d)}else{if(b==0){$("#"+f+"  .progressBar").progressbar("value",100);$("#"+f+"  .proLabel").text("0")}else{if(d==0){$("#"+f+"  .progressBar").progressbar("value",false)}else{$("#"+f+"  .progressBar").progressbar("value",parseInt(d*100/b));$("#"+f+"  .proLabel").text(""+d)}}}}else{if(global.bAll){if(d!=0){var e=parseInt(parseInt(++progressor.current)*100/parseInt(progressor.total));$("#restoreAllPage .allProgressBar").progressbar("value",e)}else{$("#restoreAllPage .progressNoteText").text("{{backup_js_progressNoteText_restoring_lang}}"+f)}}else{if(b==0){$("#"+f+"  .progressBar").progressbar("value",100);$("#"+f+"  .proLabel").text("0")}else{if(d==0){$("#"+f+"  .progressBar").progressbar("value",false)}else{$("#"+f+"  .progressBar").progressbar("value",parseInt(d*100/b));$("#"+f+"  .proLabel").text(""+d)}}}}}function setTotalCount(a){progressor.total=parseInt(a)}function optionalRestore(a){$("#backupOptionalPage input").attr("disabled","disabled");$.ajax({url:"http://gbackup/optionalRestore",type:"post",data:a,success:function(b){console.log(b);$("#optionaBackupCancellButton").text("{{backup_js_optionaBackupCancelButton_complete_lang}}")},error:function(){},complete:function(){}})}function showCheckPasswd(a){console.log("showCheckPasswd = "+a);if(a==="0"){$("#checkpasswd").show()}else{if(a=="1"){$("#checkpasswd").hide()}else{if(a=="3"){$("#checkpasswd").hide();$("#tip").text("{{backup_js_tip_notUnlock_lang}}").show()}}}}function restoreOk(b){var a=JSON.parse(b);if(a.success==0){if($("#allRestoreCancellButton").attr("package")!=true){$("#allRestoreCancellButton").text("{{backup_js_allRestoreCancelButton_complete_lang}}")}if($("#optionaBackupCancellButton").attr("package")!=true){$("#optionaBackupCancellButton").text("{{backup_js_optionaBackupCancelButton_complete_lang}}")}}else{if(a.gresotre==0){if($("#allRestoreCancellButton").attr("package")!=true){$("#allRestoreCancellButton").text("{{backup_js_allRestoreCancelButton_complete_lang}}")}if($("#optionaBackupCancellButton").attr("package")!=true){$("#optionaBackupCancellButton").text("{{backup_js_optionaBackupCancelButton_complete_lang}}")}}else{$("#tip").text("{{backup_js_tip_restoreSuccess_lang}}").show();$("#allRestoreCancellButton").text("{{backup_js_allRestoreCancelButton_reboot_lang}}");$("#allRestoreCancellButton").attr("reboot",true)}}}function showError(a){if(a=="1"){$("#tip").text("{{backup_js_tip_notEnoughMemoryStorageSpace_lang}}").show()}else{if(a=="2"){$("#tip").text("{{backup_js_tip_memoryStorageFull_lang}}").show()}else{if(a=="3"){$("#tip").text("{{backup_js_tip_fileNotFound_lang}}").show()}else{if(a=="4"){$("#tip").text("{{backup_js_tip_UploadFileFailed_lang}}").show()}else{if(a=="5"){$("#tip").text("{{backup_js_tip_backupFailed_lang}}").show()}else{if(a=="6"){$("#tip").text("{{backup_js_tip_unknownFailed_lang}}").show()}else{$("#tip").text("{{backup_js_tip_unknownFailed_lang}}").show()}}}}}}$(".progressBar").each(function(){if($(this).progressbar("value")==false){$(this).progressbar("value",0)}})}function showOptionRestore(h){if(h==""||h=="error"){return}$("#allRestoreCancellButton").removeAttr("package");progressor.current=0;hideAllPage();var a=JSON.parse(h);var e=a.counter;var f=window.GetExternalStorageState();var g=window.GetDeviceKey();var b=a.phone["key"];var d={_dataList:e,ExternalStorageState:f,RestoreApp:g===b};$("#menuBar .allCheck").removeAttr("disabled");var c=template("optionalItemTemplate",d);$("#backupOptionalItem").html(c);$("#backupOptionalPage .optionalPath").hide();$("#backupOptionalPage .backupOptionalNote").text("{{backup_js_backupOptionalNote_restore_lang}}");$("#backupOptionalItem").css({height:"256"});$("#optionalBackupStartButton").attr("disabled","disabled");$("#optionalBackupStartButton").text("{{backup_js_optionalBackupStart_restoreStart_lang}}").show();$("#optionaBackupCancellButton").text("{{backup_js_optionaBackupCancelButton_cancel_lang}}").attr("restore",true);$("#menuBar .allCheck").prop("checked",false);$("#backupOptionalPage").show();if(!(g===b)){$("#tip").text("{{backup_js_tip_app_restore_lang}}").show()}if(f==false){$("#tip").text("{{backup_js_tip_externalStorageStateisFalse_lang}}").show()}};