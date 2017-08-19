if(typeof CallType == "undefined"){
    var CallType = {
        ALL: 0,
        RECEIVED: 1,
        CALLED: 2,
        MISSED: 3,
    }
}

if (typeof ContactType == "undefined") {
    var ContactType = {
        PHONE: 0,
        STARRED: -1,
        SIM1: -2,
        SIM2: -3,
        DEFAULT:-4,
    }
};
//indicator which group item sleceted
var selId =ContactType.DEFAULT;

if (typeof ContextMenu == "undefined") {
    var ContextMenu = {
        GROUP: "groupContextMenu",
        CONTACT: "contactContextMenu",
        CALL: "callContextMenu",
        ADDTO: "addContactTo",
        SENDSMS: "sendSMS",
        COIMPORTEXPORT: "coimExportContextMemu",
        CAIMPORTEXPORT: "caimExportContextMemu",
    }
};

$.fn.scrollTo = function( target, options, callback ){
  if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
  var settings = $.extend({
    scrollTarget  : target,
    offsetTop     : 0,
    duration      : 500,
    easing        : 'swing'
  }, options);
  return this.each(function(){
    var scrollPane = $(this);
    var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
    var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
    scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration), settings.easing, function(){
      if (typeof callback == 'function') { callback.call(this); }
    });
  });
}

$(document).ready(function () {

    global.callListObj = $("#call-list");

	$('body').on('contextmenu',function(){
		return false;
	});
	
    $(".category").click(function () {
	    var obj = $(this);
	    var id = obj.attr("id");
	    if (!obj.hasClass("category-selected")) {
	        $(".category-selected").removeClass("slideDown category-selected");
	        obj.addClass("slideDown category-selected");
			$(".group").slideUp();
	        obj.next().slideDown();
	        if (id == "allContact") {
	            //showAllContact();
	            showContact();

                document.getElementById('call_list').innerHTML = "";
	        } else if(id == "simContact") {
	            //showSimContact();
	            //showContact();
	        } else if(id == "callLog") {
	            //showCallLog();
	            showCall();

                var cateId = getClickCategorylistId($("#call_group"));
                if (cateId == "AllCall") {
                    showCallList(CallType.ALL);
                } else if (cateId == "Missed") {
                    showCallList(CallType.MISSED);
                } else if (cateId == "Called") {
                    showCallList(CallType.CALLED);
                } else if (cateId == "Received") {
                    showCallList(CallType.RECEIVED);
                }
	        }
	    }else{
			obj.hasClass("slideDown")?obj.removeClass("slideDown"):obj.addClass("slideDown");
			obj.next().slideToggle();
		}
	});
	firstShowForAllContact();
	
	
	$("#coimportExport").on("mouseenter",function(){
        if(!$("#coimExportContextMemu").is(":visible")){
            showOpTips($(this),"{{contact_js_exportcontacts_tips_lang}}");
        }
    })
    $("#coimportExport").on("mouseleave",function(){
        hideOpTips();
    })
    $("#call_group").find(".category-list").mousedown(function () {
        var tempObj = $(this);
        $("#call_group").find(".category-list").removeClass("category-list-click");
        tempObj.addClass("category-list-click");
        $(".category").css("background-position-y","0px");
        $('#call_all_checker').prop("checked", false);

        console.log(tempObj.attr("id"));
        if (tempObj.attr("id") == "AllCall") {
            $("#callduration_text").html("{{title_callDuration_lang}}");
            showCallList(CallType.ALL);
        }
        else if (tempObj.attr("id") == "Missed") {
            $("#callduration_text").html("{{title_ringDuration_lang}}");
            showCallList(CallType.MISSED);
        }
        else if (tempObj.attr("id") == "Called") {
            $("#callduration_text").html("{{title_callDuration_lang}}");
            showCallList(CallType.CALLED);
        }
        else if (tempObj.attr("id") == "Received") {
            $("#callduration_text").html("{{title_callDuration_lang}}");
            showCallList(CallType.RECEIVED);
        }
    });
    
	$('#contact_all_checker').bind('click', function () {
	    if ($(this).prop("checked")) {
            $('#contact_list>li input').prop("checked", true);
		    $('#contact_list li').css("background","#FFF url(images/contactClick_bg.png) 0 0 repeat-x")
	    } else {
            $('#contact_list>li input').prop("checked", false);
		    $('#contact_list li').css("background","")
	    }
		var checkedObj = $('#contact_list').find('input:checked').parent().parent();
	    var nChecklen = checkedObj.length;
           console.log("contact_all_checker and nChecklen ="+nChecklen);
        var selectsim = false;
		for(var i=0 ; i<nChecklen ; ++i){
            if (checkedObj[i].getAttribute("sim") !== "-1") {
                selectsim = true;
            }
		}
	    if(nChecklen > 0) {
		    $('#delContact').removeClass('disable');
			$('#sendGroupMess').removeClass('disable');
		    if (nChecklen>1) {
				if(!selectsim){
					$('#delRepeat').removeClass('disable');
				}
				else{
					$('#delRepeat').addClass('disable');
				}
		    }
	    } else {
		    $('#delContact').addClass('disable');
		    $('#sendGroupMess').addClass('disable');
		    $('#delRepeat').addClass('disable');
	    }
        console.log("selid = "+ selId);
        if (selectsim === true) {
            $('#delContact').addClass('disable');
        };
	});
	
	$('#call_all_checker').bind('click', function () {
	    if ($(this).prop("checked")){
		    $('#call_list>li input').prop("checked", true);
            $('#call_list li').css("background","#FFF url(images/contactClick_bg.png) 0 0 repeat-x")
	    } else {
		    $('#call_list>li input').prop("checked", false);
            $('#call_list li').css("background","");
	    }
	    var nChecklen = $('#call_list input:checked').length;
	    if(nChecklen > 0) {
		    $('#delCall').removeClass('disable');
	    } else {
		    $('#delCall').addClass('disable');
	    }
	});

    $("#contact_list").on("click", ".contact-list-item", function(event){
		console.log("contact_list");
        var contactId = this.id;
        var obj = $(this);
        $(".contact-list-item").css("background", "");  //去掉所有项的选中背景
        $("#contact_list input").prop("checked", false);   //去掉所有选中框的选中
        this.style.background = "#FFF url(images/contactClick_bg.png) 0 0 repeat-x";
        obj.find("input").prop("checked", true);
        contactBarstatus();
        if (contactId != undefined) {
            var id = parseInt(contactId, 10);
            var sim = obj.attr('sim');
            getContactdetail(id, sim);
        } else {
            console.error("the clicked contact has no id");
        }
    }).on("contextmenu", ".contact-list-item", function(event){
        var obj = $(this);
        if (!obj.find("input").prop("checked")) {
            $(".contact-list-item").css("background", "");
            $("#contact_list input").prop("checked", false);
            this.style.background = "#FFF url(images/contactClick_bg.png) 0 0 repeat-x";
            obj.find("input").prop("checked", true);
            var contactId = this.id;
            if (contactId != undefined) {
                var id = parseInt(contactId, 10);
                console.log(id);
				var sim=$(this).attr("sim");
                getContactdetail(id, sim);
            };
        }
        var checked = $('#contact_list').find('input:checked');
        var nChecklen = 0;
        var nNonSimlen = 0; //非SIM的选中
        var selectsim = false;
        for (var i=0, len=checked.length; i<len; i++) {
            var li = $(checked[i]).parent().parent();
            if (li.attr('sim') === "-1") {
                nNonSimlen++;
            } else {
                selectsim = true;
            }
            nChecklen++;
        }
        if (nNonSimlen == 0 ||  selectsim === true) {
            $('#cocmDelete').attr('disabled', true);
        } else {
            $('#cocmDelete').attr('disabled', false);
        }
        if (nChecklen==1) {
            if ($('#cocmSendSMS').find('.right').length == 0) {
                $('#cocmSendSMS').prepend('<div class="right"></div>');
            }
			var id=$(this).attr("id");
			var numbers=$("#"+id+" .phone").text();
            $('#cocmSendSMS .li').text('{{contact_js_cocmSendSMS_lang}}');
            $('#cocmSendSMS').attr('disabled', numbers.length==0);
			$("#sendGroupMess").removeClass("disable");
        } else {
            $('#cocmSendSMS .li').text('{{contact_is_cocmSendSMS_group_lang}}');
            $('#cocmSendSMS .right').remove();
            $('#cocmSendSMS').attr('disabled', false);
			$("#sendGroupMess").removeClass("disable");
        }

        var selgroup = getClickCategorylistId($('#contact_group'));
        if(selgroup == "phoneContact" || selgroup == "sim1" || selgroup == "sim2") {
            $('#cocmRemove').attr("disabled", true);
        } else {
            $('#cocmRemove').attr("disabled", (nChecklen>0)?false:true);
        }

     
        if (!global.bRefreshed) {
            $('#cocmExport').attr('disabled', true);
            $('#cocmAddto').attr("disabled", true);
        } else {
            $('#cocmExport').attr('disabled', false);
            $('#cocmAddto').attr("disabled", false);
        }
		if(selectsim === true) {
            $('#cocmAddto').attr("disabled", true);
        } else {
            $('#cocmAddto').attr("disabled", false);
        }

        var menu = $("#"+ContextMenu.CONTACT);
        var x = event.clientX;
        var y = event.clientY-12;
        var bodyWidth = document.documentElement.clientWidth;
        var bodyHeight = document.documentElement.clientHeight;
        var h = menu.height();
        if (bodyHeight - y < h) {
            y -= h;
        }
        menu.css({"left":x,"top":y}).show();//.slideDown(300);
		if($('#sim1').attr('clicked')!="yes" && $('#sim2').attr('clicked')!="yes")
			$('#delContact').attr('class','menu-nav');
        event.returnValue=false;
        event.cancelBubble=true;
        contactBarstatus();
        return false;
    }).on('click', '.contact_checker', function (event) {
        var obj = $(this);
        if (obj.prop("checked") == true) {
            obj.parent().parent().css("background", "#FFF url(images/contactClick_bg.png) 0 0 repeat-x");
            var contactid = parseInt(this.parentNode.parentNode.id, 10);
            var sim = $(this.parentNode.parentNode).attr('sim');
            getContactdetail(contactid, sim);
        } else {
            obj.parent().parent().css("background", "transparent");
        }
        
        contactBarstatus();
        event.stopPropagation();
    }).on('click', '.star', function (event) {

        var obj = $(this);
        var starred = obj.attr('star')==0 ? true:false;
        var contactid = parseInt(this.parentNode.parentNode.id, 10);
        ajaxRequest("http://contact/starcontact?id=" + contactid, starred==true?"PUT":"DELETE", "", 
            function (msg) {
                if (msg == "") {
                    artAlert('starFailed', '{{contact_js_starFailed_note_lang}}', '{{contact_js_starfail_contact_lang}}');
                    return;
                }

                if (starred == true) {
                    obj.addClass('starred');
                    obj.attr('star', '1');
                } else {
                    obj.removeClass('starred');
                    obj.attr('star', '0');
                    if (getClickCategorylistId($("#contact_group")) == 'starredContact') {
                        obj.parent().parent().remove();
                        showContactdetail($('#contact_list>li:first'));

                        var contact_list = $('#contact_list');
                        var length = contact_list.find('li').length;
                        var checked_length = contact_list.find('li input:checked').length;
                        if (length <= 0) {
                            $('#sendGroupMess').addClass('disable');
                            $('#delContact').addClass('disable');
                            $('#contact_all_checker').prop("checked", false);
                        } else if (length === checked_length) {
                            $('#contact_all_checker').prop("checked", true);
                        };
                    };
                }
                setGroupmemberNum();
            }
        );
        event.stopPropagation();
    });

    $('#call_list').on('click', '.call-list-item', function(event) {
        var obj = $(this);
        
        $(".call-list-item").css("background", "");  //去掉所有项的选中背景
        $("#call_list input").prop("checked", false);   //去掉所有选中框的选中
        this.style.background = "#FFF url(images/contactClick_bg.png) 0 0 repeat-x";
        obj.find("input").prop("checked", true);

        callBarstatus();
    }).on('contextmenu', '.call-list-item', function(event) {
        var obj = $(this);
        if (!obj.find("input").prop("checked")) {
            $(".call-list-item").css("background", "");
            $("#call_list input").prop("checked", false);
            this.style.background = "#FFF url(images/contactClick_bg.png) 0 0 repeat-x";
            obj.find("input").prop("checked", true);
        }

        var menu = $("#"+ContextMenu.CALL);
        var x = event.clientX;
        var y =event.clientY-12;
        var bodyWidth = document.documentElement.clientWidth;
        var bodyHeight = document.documentElement.clientHeight;
        var h = menu.height();
        if (bodyHeight - y < h) {
            y -= h;
        }
        menu.css({"left":x,"top":y}).show();//.slideDown(300);

        event.returnValue=false;
        event.cancelBubble=true;
        callBarstatus();
		var hasNumber = false;
		var list = $(".call-list-item").find("input:checked").parent().parent();//[2].getAttribute("number");
		for(var i=0 ; i<list.length ; ++i){
			if(parseInt($(list[i]).attr("number"))>0){
				hasNumber = true;
				break;
			}
		}
		if(hasNumber){
			$("#cacmSendSMS .li").removeClass("disable")
		}else{
			$("#cacmSendSMS .li").addClass("disable")
		}
        return false;
    }).on('click', '.call_checker', function (event) {
        var obj = $(this);
        if (obj.prop("checked") == true) {
            obj.parent().parent().css('background', '#FFF url(images/contactClick_bg.png) 0 0 repeat-x');
        } else {
            obj.parent().parent().css('background', 'transparent');
        }
        callBarstatus();
        event.stopPropagation();
    });

    $("#contact_group").on("click", '.category-right', function(){
        //如果已选中，则编辑该群组名
        if ($(this).attr("clicked") == "yes") {
            var clickGroupId = $(this).attr("id");
            editGroup(clickGroupId);
        } else {
            selCategory(this);
        }
    }).on("contextmenu", '.category-right', function(event){
        var thisObj = $(this);
        if(thisObj.find(".editGroupInput").length > 0)
        {
            return;
        }
        selCategory(this);

        var menu = $("#"+ContextMenu.GROUP);
        var x = event.clientX;
        var y =event.clientY-12;
        var bodyWidth = document.documentElement.clientWidth;
        var bodyHeight = document.documentElement.clientHeight;
        var h = menu.height();
        if (bodyHeight - y < h) {
            y -= h;
        }
        menu.attr("value", this.id);
        menu.css({"left":x,"top":y}).show("normal");//slideDown(300);
        
        //获取前右键点击的群组的id
        var thisId = thisObj.attr("id");
        if (thisId == "phoneContact" || thisId == "starredContact" || thisId == "sim1" || thisId == "sim2") {
            $('#gcmDelete').attr('disabled', true);
            $("#gcmEdit").attr('disabled', true);
        }
        else {
            $("#gcmDelete").attr('disabled', false);
            $("#gcmEdit").attr('disabled', false);
        }
        
        if ($(this).find("a").text() == "( 0 )") {
            $("#gcmSendSMS").attr('disabled', true);
        }
        else {
            $("#gcmSendSMS").attr('disabled', false);
        }

        event.returnValue=false;
        event.cancelBubble=true;
        return false;
    });

    $("#addGroup").click(function () {
        $("#addGroupText").hide();
        $("#addGroupInput").css("display","inline");
        $("#addGroupInput>input").val("").focus();
        return false;
    })
    //添加群组的确定按钮
    $("#addGroupInput>input").keyup(function() {
        if(event.keyCode==13) {
            $("#addGroupInput>input").blur();
        }
    }).click(function () {
        return false;
    }).blur(function () {
        $("#addGroupText").css("display","inline");
        $("#addGroupInput").hide();
        var temp = $("#addGroupInput>input");
        var groupName = temp.val();
        if (groupName != "") {
            //转换编码格式
			groupName = groupName.substr(0,100);		//限制前100个字符
            var exist = window.checkGroupname(groupName);

            if (exist) {
                artAlert('groupNameExist', '{{contact_js_groupname_exist_lang}}', '{{contact_js_group_name_lang}}"'+groupName+'"{{contact_js_group_name_exit_lang}}');
            } else {
                ajaxRequest("http://contact/newgroup?" + encodeURIComponent(groupName), "PUT", "",
                    function (msg) {
                        if (msg == "") {
                            artAlert('newgroupFailed', '{{contact_js_newgroup_failed_lang}}', '{{contact_js_newgroup_lang}}"'+groupName+'"{{contact_js_new_group_fail_lang}}');
                            return;
                        }

                        var group = JSON.parse(msg);
                        var data = {
                            list: group
                        };
                        var html = template('group_template', data);
                        $("#contact_group").append(html);
                        console.log(html);
                        console.log("contact" + msg)
                });
            }
        }
        event.returnValue=false;
        event.cancelBubble=true;
        return false;
    });


    //初始化左侧的宽度
    initLeft();
    //监听窗口的变化
    $(window).resize(initLeft);

    /*$('#searchContact').change(function () {
        if (this.value == '') {
            return;
        };
        window.searchContact(this.value, function(contactlist) {
            var contactdata = {
                list: contactlist,
                search: 1,
            };
            var contacthtml = template('contact_list_template', contactdata);
            document.getElementById('contact_list').innerHTML = contacthtml;
            console.log(contacthtml);

            $("#contact_group").find(".category-list").removeClass("category-list-click");
            $('#phoneContact').addClass("category-list-click");

            $('#contact_list').attr('search', '1');
           
            showContactdetail($('#contact_list>li:first'));
            contactBarstatus();
        });
    });

    $('#searchCall').change(function () {
        window.searchCall(this.value, function(calllist) {
            var data = {
                list: calllist,
            };
            $('#call_all_checker').prop('checked', false);
            $('#delCall').addClass('disable');
            var contacthtml = template('call_list_template', data);
            document.getElementById('call_list').innerHTML = contacthtml;
            resetCallLogMenuBar();
        });
    });*/
    
    var oldSearchCallText;
    $('#searchCall').on('keyup',function(){
		if((oldSearchCallText=="undefined"||oldSearchCallText=="")&&this.value=="")
			return ;
		searchCalls(this);
		oldSearchCallText = this.value;
	})


    $(".contact_detail_side").on('click', '.label_button', function () {
        var id = $(this).parent().parent().find(".phone_text").attr("dataid");

        if (id != "") {
            var dataids = [];
            dataids.push(id);
            sendSMS(dataids,"id");
        }
    });


    $('body').on('click', '.contextmenu>li', function(event) {
        var cmid = this.id;
        var obj = $(this);
        if (obj.attr("disabled") || obj.find('.right').length!=0 || obj.hasClass('hr')) {
            return;
        }

        if (cmid == 'gcmSendSMS') {
            $('.contextmenu').hide();
            var groupId = getClickCategorylistId($("#contact_group"));
            var selId;
            if (groupId == "phoneContact") {
                selId = ContactType.PHONE;
            }
            else if (groupId == "starredContact") {
                selId = ContactType.STARRED;
            }
            else if (groupId == "sim1") {
                selId = ContactType.SIM1;
            }
            else if (groupId == "sim2") {
                selId = ContactType.SIM2;
            } else {
                selId = parseInt(groupId, 10);
            }

            window.getContactlistById(selId, function(success, contactlist){
                var dataids = new Array();
                for (var i = 0; i < contactlist.length; i++) {
					if(contactlist[i]._dataid!="")
						dataids.push(contactlist[i]._dataid);
                };
                setTimeout(function(){
                    sendSMS(dataids,"id");
                }, 10);
            })
        } else if (cmid == 'gcmDelete') {
            delGroup();
        } else if (cmid == 'gcmEdit') {
            editGroup(getClickCategorylistId($("#contact_group")));
        } else if (cmid == 'cocmSendSMS') {
	    	var dataids = new Array();
	    	$('#contact_list').find("li input:checked").each(function(){
	    		var id = $(this).parent().next().attr("dataid");
	    		var ids = id.replace(/\s/g, '').split(',');
	    		dataids = dataids.concat(ids);
	    	})
    		sendSMS(dataids,"id");
        } else if (cmid == 'cocmDelete') {
            delContacts();

        } else if (cmid == 'cocmExport' || cmid == 'exportContact') {
            exportContacts();

        } else if (cmid == 'cocmRemove') {
            var list = $('#contact_list').find('input:checked');
            if (list.length<0) { return };

            var ids = [];
            for (var i=0, len=list.length; i<len; i++) {
                var li = $(list[i]).parent().parent();
                if (li.attr('sim') == -1) {
                    ids.push(li.attr('id'));
                };
            };

            var selectgroup = getClickCategorylistId($("#contact_group"));
            if (selectgroup == 'starredContact') {
                starContacts(ids, false)
            } else if (selectgroup != 'phoneContact' && selectgroup != 'sim1' && selectgroup != 'sim2') {
                removeGroupMember(selectgroup, ids);
            };

        } else if (cmid == 'cacmSendSMS') {
			if($("#cacmSendSMS .li").hasClass("disable"))
				return ;
			$('.contextmenu').hide();
			var arr = new Array();
            $('#call_list').find("li input:checked").each(function(){
                var addr = $(this).parent().parent().attr("number");
				if($.inArray(addr,arr)==-1&&parseInt(addr)>0){
					arr.push(addr);
				}
            })
			$.each(arr,function(i,key){
				var addrArray = new Array();
				addrArray.push(arr[i]);
				setTimeout(function(){
					sendSMS(addrArray,"num");
                }, 10);
			})
        } else if (cmid == 'cacmDelete') {
            delCalls();
        } else if (cmid == 'importContact') {
            importContacts();
        } else if (cmid == 'importCall') {
            importCalls();
        } else if (cmid == 'cacmExport' || cmid == 'exportCall') {
            exportCalls();
        };

        $('.contextmenu').hide();

        event.stopPropagation();
    }).on('mouseenter', '.contextmenu>li', function(event) {

        if (!$(this).parent().hasClass("second")) {
            $('.second').hide();
        }

        if ($(this).find('.right').length!=0) {
            if (this.id == 'cocmAddto') {
                if ($(this).attr("disabled")) {
                    return false;
                }
                var menu = $("#"+ContextMenu.ADDTO);
                var parent = $("#"+ContextMenu.CONTACT);

                var html = "";
                var selectgroup = getClickCategorylistId($("#contact_group"));

                var list = $('#contact_group').find('.category-list');
                for (var i=0, len=list.length; i<len; i++) {
                    var groupId = list[i].id;
                    var groupName = $(list[i]).find('.group-category-name').text();
                    if (groupId != 'phoneContact' && groupId != 'starredContact' && groupId != 'sim1' && groupId != 'sim2') {
                        if (groupId == selectgroup) {
                            html += '<li disabled value="' + parseInt(groupId,10) + '"><div class="li">' + groupName + '</div></li>';
                        }
                        else
                        {
                            html += '<li value="' + parseInt(groupId,10) + '"><div class="li">' + groupName + '</div></li>';
                        }
                    } else if (groupId == 'starredContact') {
                        if (groupId == selectgroup) {
                            html = '<li disabled value="star"><div class="li">{{contact_js_contextmenu_star_lang}}</div></li>' + html;
                        }
                        else
                        {
                            html = '<li value="star"><div class="li">{{contact_js_contextmenu_star2_lang}}</div></li>' + html;
                        }

                    }
                };

                menu.html(html);
                menu.find("li").click(function () {
                    if ($(this).attr("disabled")) {
                        return false;
                    }
                    var ids = [];
                    var checked = $('#contact_list').find('input:checked');
                    
                    for (var i=0, len=checked.length; i<len; i++) {
                        var li = $(checked[i]).parent().parent();
                        if (li.attr('sim') == -1) {
                            ids.push(li.attr('id'));
                        };
                    };
                    var value = $(this).attr('value');
                    if (value == 'star') {
                        starContacts(ids, true);
                    } else {
                        addGroupMember(value, ids); 
                    }

                    $('.contextmenu').hide();
                    return false;
                });

                var l = parseInt(parent.css("left"),10) + parent.width() + 1;
                var t = parseInt(parent.css("top"),10) + 25;
                var bodyHeight = document.documentElement.clientHeight;
                var h = menu.height();
                if (bodyHeight - t < h) {
                    t -= h;
                }
                menu.css({"left":l,"top":t}).show();

            }
            else if (this.id == 'cocmSendSMS') {
                if ($(this).attr("disabled")) {
                    return false;
                }
                var menu = $("#"+ContextMenu.SENDSMS);
                var parent = $("#"+ContextMenu.CONTACT);

                var select = $('#contact_list').find('input:checked').first();
                var phone = select.parent().next().text();
                var phonelist = phone.split(", ");
				var dataids = select.parent().next().attr("dataid");
				var idlist = dataids.split(",");
                var html = "";
                for (var i=0, len=phonelist.length; i<len; i++) {
                    html += '<li dataid='+idlist[i]+'><div class="li">' + phonelist[i] + '</div></div>';
                };

                menu.html(html);

                menu.find("li").click(function () {
					var id = $(this).attr("dataid").replace(/\s/g, '');
                    $('.contextmenu').hide();

                    setTimeout(function(){
                        var dataids = [];
                        dataids.push(id);
                        sendSMS(dataids,"id");
                    }, 10);
                    return false;
                });

                var l = parseInt(parent.css("left"),10) + parent.width() + 1;
                var t = parseInt(parent.css("top"),10);
                var bodyHeight = document.documentElement.clientHeight;
                var h = menu.height();
                if (bodyHeight - t < h) {
                    t -= h;
                }
                menu.css({"left":l,"top":t}).show();
            }
        }
    }).on('mousedown', '.contextmenu', function(event){
        event.stopPropagation();
    }).mousedown(function () {
        $('.contextmenu').hide();
    });


	$('#searchContact').on('keyup',function(event){
		if(event.which != 9){//TAB
			if((typeof oldSearchText=="undefined"||oldSearchText=="")&&this.value=="")
				return ;
			searchContacts(this);
			oldSearchText = this.value;
		}
	})
    
    if (cef.isConnected() == true) {
        initHtml();
        window.getReadyContacts(function(listValue, bReady){
            if(listValue !== null){
                console.log(listValue.length);
                var html = template('contact_list_template', {list: listValue});
                $('#contact_list').html(html);
            }

            console.log(bReady)
            if(bReady){
                initDone();
            }
        });
    } else {
        notConnect();
    }

    
})
//Jquery到这里结束
var global = {
    callListObj:"",
    bRefreshed: false,
}

function firstShowForAllContact(){
	if (!$("#allContact").hasClass("category-selected"))
		$("#allContact").click();
}

var oldSearchText;
function initLeft() {
    var h =  document.documentElement.clientHeight;//document.body.clientHeight;
    h = h - 2*35 - 1;
    $('#call_group').height(h);
    $('#contact_group_div').height(h);
}

function topMenuClick(obj) {
/*
delCall
refreshCall

newContact
delContact
importExport
sendGroupMess
delRepeat
refresh
cloudbackup*/
    if ($(obj).hasClass("disable")) {
        return;
    }

	var id = obj.id;
	if (id == "newContact") {
	    //window.editContact(-1);
        editContact(-1, "");
	} else if (id == "delContact") {
        delContacts();
	} else if (id == "coimportExport") {
        hideOpTips();
        if ($('#contact_list').find('input:checked').length > 0) {
            $('#exportContact').attr('disabled', false);
        } else {
            $('#exportContact').attr('disabled', true);
        }
        $("#"+ContextMenu.COIMPORTEXPORT).show();//slideDown(300);
	}  else if (id == "caimportExport") {
        if ($('#call_list').find('input:checked').length > 0) {
            $('#exportCall').attr('disabled', false);
        } else {
            $('#exportCall').attr('disabled', true);
        }
        $("#"+ContextMenu.CAIMPORTEXPORT).show();//.slideDown(300);
    } else if (id == "sendGroupMess") {
    	var dataids = new Array();
    	$('#contact_list').find("li input:checked").each(function(){
    		var numberid = $(this).parent().next().attr("dataid");
    		var ids = numberid.replace(/\s/g, '').split(',');
    		dataids = dataids.concat(ids);
    	})
    	sendSMS(dataids,"id");
   	    
	} else if (id == "delRepeat") {
        var list = $('#contact_list').find('input:checked');
        if (list.length<=1) {
            return;
        }
        art.dialog({
            id : 'delRepeatdlg',
            title : '{{contact_js_delRepeat_info_lang}}',
            width: '300px',
            content : '{{contact_js_delRepeat_chosefrom_lang}}<span style="color:red;">' + list.length + '</span>{{contact_js_delRepeat_note_lang}}<br>({{contact_js_delRepeate_name_lang}})',
            okValue : '{{contact_js_delRepeat_do_lang}}',
            cancelValue : '{{contact_js_delRepeat_cancel_lang}}',
            ok : function () {
                var ids = "";
                for (var i=0, len=list.length; i<len; i++) {
                    ids = (ids==""?"":(ids+"*")) + parseInt(list[i].parentNode.parentNode.id, 10);
                }
                ajaxRequest("http://contact/repeatContact", "POST", ids, function(msg){

                	if (msg === 'ok') {
    				 	$('.processTxt').append('<label class="d-over-tip">{{contact_js_delRepeat_success_lang}}</label>');
    				 	setGroupmemberNum();
                        contactBarstatus();
					    setTimeout(function () {
					       CloseArtDialog();
					    },1000);
                	};

                });

                var html = '<div class="processbg"><div id="process"/></div></div><div class="processTxt">{{contact_js_delRepeat_doingnow_lang}}[<span id="text"></span>]...</div>';
                this.content(html);
                this.button({
                        id: 'ok',
                        callback: function () {
                            return false;
                        },
                        disabled: true  
                    })
                return false;
            },
            
            cancel : function () {
            	window.stopEvent();
                return true;
            },
            focus : true,
			dblclickNotHide : true,
            lock : true
        });
		/* _LOCN */
	} else if (id == "cloudbackup") {

        art.dialog({
            id : 'cloudBackupdlg',
            title : '{{contact_js_cloudBackupdlg_info_lang}}',
            width: '300px',
            content : '{{contact_js_couldBackdlg_wifitip_lang}}<span style="color:red;">{{contact_js_couldBackdlg_phonestream_lang}}</span>({{contact_js_couldBackdlg_backup_lang}})',
            okValue : '{{contact_js_couldBackdlg_BackUpdo_lang}}',
            cancelValue : '{{contact_js_couldBackdlg_cancel_lang}}',
            ok : function () {
                $('#bubble_message').html('<div class="bubble_text"><div class="refresh"></div>{{contact_js_cloudBackdlg_doingnow_lang}}</div>');
                $('#bubble').show();

                ajaxRequest("http://contact/cloudbackup", "PUT", "", 
                    function(result){
						var msg = "{{contact_js_backup_success}}";
						if(result == "timeout") {
							msg = "{{contact_js_backup_timeout}}";
						}
						art.dialog({
							title : '{{contact_js_starFailed_note_lang}}',
							width : '300px',
							content : msg,
							okValue : '{{share_ok_str}}',
							ok : function () {
								return true;
							},
							focus : true,
							dblclickNotHide : true,
							lock : true
						});
                        $('#bubble').hide();
                });
                
                return true;
            },
            cancel : function () {
                return true;
            },
            focus : true,
			dblclickNotHide : true,
            lock : true
        });
	} else if (id == "delCall") {
   	    delCalls();
	} else if (id == "refresh") {
        global.bRefreshed = false;
		selId = ContactType.PHONE;
		firstShowForAllContact();

        initHtml();
        ajaxRequest("http://contact/refreshcontact", "GET", "", function (msg) {
            console.log(msg);
            global.bRefreshed = true;
        });
    }
    else if(id == "refreshcall") {
        clearCalls();
        var csDoWwhat = "<div class=bubble_text><div class=refresh ></div>{{contact_js_initCallHtml_lang}}</div>";
        $("#bubble_message").html(csDoWwhat);
        //$('#bubble').removeClass('coverScreen');
        $('#bubble').show();
         ajaxRequest("http://contact/refreshcall", "GET", "", function (msg) {
            fillCallList(eval('('+msg +')'));
			$('#AllCall').addClass('category-list-click');
            $('#bubble').hide();
        });
    }
}
function fillCallList(callList){
    setCallNum();
    callBarstatus();
    $('#bubble').hide();
    if(callList==null){
        $("#call_list").text("");
        return;
    }
    var callData = {
        list : callList
    }
    var html = template('call_list_template', callData);
    $('#call_list').html(html);
    var nChecklen = $('#call_list').find('input:checked').length;
    var nAlllen = $('#call_list').find('input').length;
    $('#call_all_checker').prop('checked', ((nChecklen==nAlllen)&&nAlllen!=0)?true:false);
}
function initHtml() {
    resetgrouplist();
    clearContacts();
    clearCalls();
    resetContactdetail();
    $('#phoneContact').addClass("category-list-click");
    $("#addGroupText").show();
    $('#unConected').hide();
    $('#contact_list').empty();
    enableAll(true);
    firstShowForAllContact();
    var csDoWwhat = "<div class=bubble_text><div class=refresh ></div>{{contact_js_initHtml_lang}}</div>";
    $("#bubble_message").html(csDoWwhat);
    //$('#bubble').removeClass('coverScreen');
    $('#bubble').show();
}

function initDone() {

    console.log('initDone')
    setCallNum();
    enableAll(false);
    $('#bubble').hide();
    $('#bubble').addClass('coverScreen');
//    $('#contact_list>li:first').click();
    updateGroupList();
    global.bRefreshed = true;
}

function updateGroupList()
{

    console.log('update grouplist')
    var grouplist = window.getGrouplist();
    var data = {
        list: grouplist
    };
    var html = template('grouplist_template', data);
    document.getElementById("contact_group").innerHTML = html;
    $('#phoneContact').addClass("category-list-click");
}
function notConnect() {
    initHtml();
    $('.contextmenu').hide();
    $("#addGroupInput>input").val('');
    $("#addGroupText").hide();
    $('#unConected').show();
    CloseArtDialog();
}

function connected() {
    initHtml();
}

function filllist(json) {
	if (json == null) {
		return;
	};
    var data = {
        list: json
    }
    var html = template('contact_list_template', data);
    $('#contact_list').append(html);
}

function getClickCategorylistId(hwnd) {
    var nClick = hwnd.find(".category-list-click").length;
    var idClick;
    if (nClick!=0) {
        idClick = hwnd.find(".category-list-click").attr("id");
    }
    else {
        hwnd.find(".category-list:first").addClass("category-list-click");
        idClick = hwnd.find(".category-list:first").attr("id");
    }

    return idClick;
}
function showCall() {
    document.getElementById("w-contact").style.display = "none";
    document.getElementById("w-call").style.display = "block";
}
function showContact() {
    document.getElementById("w-call").style.display = "none";
    document.getElementById("w-contact").style.display = "block";
}
/* function showAllContact() {
    document.getElementById("call_group").style.display = "none";
    //document.getElementById("SIM_group").style.display = "none";
    document.getElementById("contact_group_div").style.display = "block";
    //document.getElementById("accountsel").style.display = "block";
} */

function showSimContact() {
    document.getElementById("call_group").style.display = "none";
    document.getElementById("contact_group_div").style.display = "none";
    //document.getElementById("accountsel").style.display = "none";
    //document.getElementById("SIM_group").style.display = "block";
}

/* function showCallLog() {
    //document.getElementById("SIM_group").style.display = "none";
    document.getElementById("contact_group_div").style.display = "none";
    //document.getElementById("accountsel").style.display = "none";
    document.getElementById("call_group").style.display = "block";
} */

			
function getContactlist(type) {

    try {
        window.getContactlistById(type, function(success, contactlist){
            if (success == true) {
                var contactdata = {
                    list: contactlist
                };
                var contacthtml = template('contact_list_template', contactdata);
                document.getElementById('contact_list').innerHTML = contacthtml;

     
                /*if (type == ContactType.SIM1 || type == ContactType.SIM2) {
                    $('#contact_list').attr('sim', 1);
                } else {
                    $('#contact_list').attr('sim', 0);
                }*/
                
                showContactdetail($('#contact_list>li:first'),type);
            }
            else {
                document.getElementById('contact_list').innerHTML = "";
                resetContactdetail();
            }
            if (type == ContactType.SIM2 || type == ContactType.SIM1) {
                console.log("get sim contact list");
                contactBarstatus(true);
            }
            else
            {
                contactBarstatus();
            }
          
        });
    }
    catch(err) {
        console.log("getContactlistById" + type + "->" + err.name + "--" + err.message);
    }
}

function showContactdetail() {
     var hwnd = arguments[0] ? arguments[0] : $('#contact_list>li:first');
     var selid = arguments[1] ? arguments[1] : ContactType.DEFAULT;

    hwnd.find('input').prop('checked', true);
    hwnd.css("background","#FFF url(images/contactClick_bg.png) 0 0 repeat-x");

    var contactId = hwnd.attr("id");
    if (contactId == undefined) {
        resetContactdetail();
     
    } else {
        var id = parseInt(contactId, 10);
        var sim = hwnd.attr('sim');
        getContactdetail(id, sim);
        $('#contact_all_checker').prop('disabled', false);
    }
    if (selid != ContactType.DEFAULT) 
    {
          
              if (selid == ContactType.SIM1|| selid == ContactType.SIM2) {
                  console.log("sim1 or sim2  so make it disable");
                 $('#delContact').addClass('disable');                
            };
    }
};
   

function getContactdetail(contactid, sim) {

    if (sim == -1) {
        $("#detailEdit").removeClass("disable");
        $("#detailDel").removeClass("disable");
    }
    else {
        $("#detailEdit").addClass("disable");
        $("#detailDel").addClass("disable");
    }
    
    try {
        window.getContactInfo(contactid, function (success, contactInfo) {
            if (success == true) {
                $('#detailEditDel').attr("contactid", contactid);
                var contactData = {
                    list: contactInfo
                }
                var html = template('contact_detail_template', contactData);
                var detailobj = document.getElementById('contact_detail');
                detailobj.innerHTML = html;
                
                var hwnd = $("#contact_detail");
                var len = hwnd.find(".detail_item").length;
                if (len > 1) {
                    hwnd.find(".detail_item:first").addClass("detail_first");
                    hwnd.find(".detail_item:last").addClass("detail_last");
                }
                else {
                    hwnd.find(".detail_item").addClass("detail_sigle");
                }
            }
            else {
                resetContactdetail();
            }
        });
    }
    catch (err) {
        console.log("getContactInfo" + contactid + "->" + err.name + "++" + err.message);
    }
    
}

function enableAll(enable) {
    if (enable) {
        $('#newContact').addClass('disable');
        $('#delContact').addClass('disable');
        $('#coimportExport').addClass('disable');
        $('#sendGroupMess').addClass('disable');
        $('#delRepeat').addClass('disable');
        $('#refresh').addClass('disable');
        $('#cloudbackup').addClass('disable');
        $('#delCall').addClass('disable');
        $('#caimportExport').addClass('disable');

        $('#searchContact').prop('disabled', true);
        $('#searchCall').prop('disabled', true);
        $('#addGroup').css('display', 'none');
    } else {
        $('#newContact').removeClass('disable');
        //$('#delContact').addClass('disable');
        $('#coimportExport').removeClass('disable');
        //$('#sendGroupMess').addClass('disable');
        //$('#delRepeat').addClass('disable');
        $('#refresh').removeClass('disable');
        //$('#delCall').addClass('disable');
        $('#caimportExport').removeClass('disable');

        contactBarstatus();
        callBarstatus();

        $('#searchContact').prop('disabled', false);
        $('#searchCall').prop('disabled', false);
        $('#addGroup').css('display', 'block');

        if (window.supportCloudbackup()) {
            $('#cloudbackup').removeClass('disable');
        }
    }
}

function clearContacts() {
    document.getElementById("contact_list").innerHTML = "";
}

function resetgrouplist() {
    document.getElementById("contact_group").innerHTML 
            = '<div class="category-list category-right"  id="phoneContact">\
			  	<div class="category-name">{{contact_js_resetgrouplist_phone_lang}}</div><a id="phoneContactNum">( 0 )</a>\
			  </div>';
}

function resetContactdetail() {
	document.getElementById('contact_detail').innerHTML = "";
    $("#detailEdit").addClass("disable");
    $("#detailDel").addClass("disable");
}

function clearCalls() {
    clearCallNum();
    document.getElementById("call_list").innerHTML = "";
}

function clearCallNum() {
    $("#call_group").find(".category-list").removeClass("category-list-click");
    //$("#AllCall").addClass("category-list-click");
    
    document.getElementById("AllCallNum").innerText = "0";
    document.getElementById("MissedNum").innerText = "0";
    document.getElementById("CalledNum").innerText = "0";
    document.getElementById("ReceivedNum").innerText = "0";
}

function setCallNum() {
    var callnum = window.getCallNum();
    $('#AllCallNum').text(callnum["all"]);
    $('#MissedNum').text(callnum["missed"]);
    $('#CalledNum').text(callnum["called"]);
    $('#ReceivedNum').text(callnum["received"]);
}

function setGroupmemberNum() {
    var list = window.getGroupmemberNum();

    for (var i=0, len=list.length; i<len; i++) {
        $('#'+list[i]["id"]).text("( "+list[i]["num"]+" )");
    };
}

function editCurrentContact(hwnd) {
    if (!$(hwnd).hasClass("disable")) {
        var contactid = $("#detailEditDel").attr("contactid");
        //window.editContact(parseInt(contactid, 10));
        console.log("edit contact")
        editContact(parseInt(contactid, 10), "");
    }
    else {
        console.log("none");
    }
}

function delCurrentContact(hwnd) {
    if (!$(hwnd).hasClass("disable")) {
        var contactid = $("#detailEditDel").attr("contactid");
        
        //var ids = [];
        //ids.push(contactid+'co');
        delContacts(contactid);
    }
    else {
        console.log("none");
    }
}

function groupSendMess(hwnd) {

}

function delGroup() {
	art.dialog({
		id : 'delgroupdlg',
		title : '{{contact_js_delGroup_info_lang}}',
		content : '{{contact_js_delGroup_content_lang}}',
		okValue : '{{contact_js_delGroup_ok_lang}}',
		cancelValue : '{{contact_js_delGroup_cancel_lang}}',
		ok : function () {
			var delGroupId = getClickCategorylistId($("#contact_group"));
			var id = parseInt(delGroupId, 10);
			
            ajaxRequest("http://contact/deletegroup?id="+id, "PUT", "", 
                function(){
                    //显示删除群组的上一个群组
                    var delgroup = $("#"+delGroupId);
                    var category = delgroup.prev();
                    $("#contact_group").find(".category-list").removeClass("category-list-click");
                    category.addClass("category-list-click");
                    delgroup.remove();

                    //获取当前选中的群组的Id
                    var groupId = category.attr("id");
                    var selId;
                    if (groupId == "phoneContact") {
                        selId = ContactType.PHONE;
                    }
                    else if (groupId == "starredContact") {
                        selId = ContactType.STARRED;
                    }
                    else if (groupId == "sim1") {
                        selId = ContactType.SIM1;
                    }
                    else if (groupId == "sim2") {
                        selId = ContactType.SIM2;
                    } else {
                        selId = parseInt(groupId, 10);
                    }
                    console.log("group removed, default select group id: " + selId);
                    
                    getContactlist(selId);
                });
			
			return true;
		},
		cancel : function () {
			return true;
		},
		focus : true,
		dblclickNotHide : true,
		lock : true
	});

}

function editGroup(groupId) {
    console.log(groupId);
    var groupHwnd = $("#" + groupId);
    var len = groupHwnd.find("input").length;
    if (groupId != "phoneContact" && groupId != "starredContact" && groupId != "sim1" && groupId != "sim2" && len == 0) {
        var orihtml = groupHwnd.html();
        var oriName = groupHwnd.children("div").text();
        var oriNum = groupHwnd.children("a").text();

        console.log(oriName + "--" + oriNum + "++" + orihtml);
        groupHwnd.html('<div class="editGroupInput"><input id="editGroupInput" type="text" value="' + oriName + '"/></div>');
        var par = groupHwnd;
        
        var inputHwnd = groupHwnd.find("input");
        $("#editGroupInput").select().focus();

        groupHwnd.find("input").keyup(function() {
            if(event.keyCode==13) {
                $("#editGroupInput").blur();
            }
        }).blur(function () {
            console.log("blur")
            var newName = inputHwnd.val().replace(/\n/g,"");
            //newName = newName.replace(/ /g,"");
            console.log(newName)

            if (newName == "" || newName == oriName) {
                par.html(orihtml);
            }
            else
            {
                newName = unescape(newName);
                par.html(orihtml);
				newName = newName.substr(0,100);		//限制前100个字符
                var exist = window.checkGroupname(newName);

                if (exist) {
                    artAlert('groupNameExist', '{{contact_js_editGroup_haveexist_lang}}', '{{contact_js_editGroup_groupname_lang}}"'+newName+'"{{contact_js_editGroup_existing_lang}}');
                } else {
					var postData = {
						"id":parseInt(groupId, 10),
						"name":newName
					}
                    ajaxRequest("http://contact/renamegroup", "PUT", JSON.stringify(postData),
                        function (msg) {
                            console.log(msg);
                            if (msg == "") {
                                artAlert('renamegroupFailed', '{{contact_js_editGroup_rename_fail_lang}}', '{{contact_js_editGroup_rename_lang}}"'+newName+'"{{contact_js_editGroup_rename_failure_lang}}');
                                return;
                            }

                            var group = JSON.parse(msg);
                            var id = group["_id"];
                            var name = group["_name"];
                            $('#'+id).find('.group-category-name').first().text(name);
                    });
                }
            }
        });
    }
}


function groupSendMess(obj) {
	if ($(obj).hasClass("disable")) {
		return;
	}
	//获取该群组的所有联系人
	var contactList = "", phoneList, len, i = 0, j;
	var name ,phoneList, phone,selPhone="",contactId = "";
	//获取所选择的联系人
	g_contactList.find("li").each(function () {
		j = 0;
		name = removeSpace($(this).find(".nl").text(),"");
		phone = removeSpace($(this).find(".pl").text(),"g");

		if (phone == "") {
			return;
		}
		phoneList = phone.split(",");
		len = phoneList.length;
		while(j<len)
		{
			var p = phoneList[j].replace(/ /g,"");
			if (phoneList[j] != "") {
				if (j == 0) {
					//获取联系人的Id
					contactId = $(this).attr("id");

					//保存已经选中的联系人号码,D对号码进行封装
					selPhone = ";" + contactId + "_" + j + "_" + p + ";";
					phone = name + "<" + p + ">";
					if (i == 0) {
						gSelPhone += selPhone;
						contactList = phone;
					}
					else
					{
						gSelPhone += selPhone;
						contactList = contactList + ";" + phone;
					}
					i ++; 
				}
				else
				{
					selPhone  = selPhone + contactId + "_" + j + "_" + p + ";";

					if (i == 0) {
					phone = phone + ";" + name + "<" + p + ">";
					gSelPhone = selPhone;
					contactList = phone;
					}
					else
					{
					phone = name + "<" + p + ">";
					gSelPhone += selPhone;
					contactList = contactList + ";" + phone;
					}
					i ++;  
				}
			}
			j++;                  
		}
	});
	//alert(gSelPhone);
	//显示发送窗口
	showSendMess(contactList,i)
}

function contactBarstatus() {

   var sim_mod = (arguments[0]!=undefined) ? arguments[0] : false;
    var nChecklen = $('#contact_list').find('input:checked').length;
    var nAlllen = $('#contact_list').find('input').length;
    $('#contact_all_checker').prop("checked", ((nChecklen==nAlllen)&&(nAlllen!=0))?true:false);
    if(nChecklen > 0) {
	    $('#delContact').removeClass('disable');
		var checked = $('#contact_list').find('input:checked');
        var selectsim = false;
		for(var i=0 ; i<nChecklen ; ++i){
			var li = $(checked[i]).parent().parent();
            if (li.attr("sim") !== "-1") {
                selectsim = true;
            };
		}
		$('#sendGroupMess').removeClass('disable');
	    if (nChecklen>1) {
			if(!selectsim){
				$('#delRepeat').removeClass('disable');
			}else{
				$('#delRepeat').addClass('disable');
			}
	    }else if(nChecklen == 1){
            $('#delRepeat').addClass('disable');
        }
    } else {
	    $('#delContact').addClass('disable');
	    $('#sendGroupMess').addClass('disable');
	    $('#delRepeat').addClass('disable');
    }
    if (sim_mod || selectsim) {

        $('#delContact').addClass('disable');     
    };
}

function callBarstatus() {

	var nChecklen = $('#call_list').find('input:checked').length;
    var nAlllen = $('#call_list').find('input').length;
    $('#call_all_checker').prop('checked', ((nChecklen==nAlllen)&&nAlllen!=0)?true:false);

    if(nChecklen > 0) {
	    $('#delCall').removeClass('disable');
    } else {
	    $('#delCall').addClass('disable');
    }
}

function selCategory(cateObj) {

    $(cateObj).parent().find(".category-list").removeClass("category-list-click");//去掉所有选中
    $(cateObj).addClass("category-list-click");//选中当前
 
    $("#contact_group").find(".category-right").attr("clicked","no");//把所有项clicked置为no
    $(cateObj).attr("clicked","yes"); //把当前选中clicked置为yes，用于标识当前选中

    $('#contact_all_checker').prop('checked', false);
    $('#contact_list').html("");
    
    var groupId = $(cateObj).attr("id");
  //  var selId;

    if (groupId == "phoneContact") {
        selId = ContactType.PHONE;
    }
    else if(groupId == "starredContact"){
        selId = ContactType.STARRED;
    }
    else if(groupId == "sim1"){
        selId = ContactType.SIM1;
    }
    else if(groupId == "sim2"){
        selId = ContactType.SIM2;
    }
    else
    {
        selId = parseInt(groupId, 10);
    }

    console.log(selId);
    getContactlist(selId);
}

function showCallList(type) {
    try {
        window.getCallList(type, function(success, calllist){
            if (success == true) {
                var callData = {
                    list: calllist
                }
                var html = template('call_list_template', callData);
                document.getElementById('call_list').innerHTML = html;
            } else {
                document.getElementById('call_list').innerHTML = "";
            }
            callBarstatus();
        });
    } catch (e) {
        console.debug("getCallList" + type + "->" + e.name + "++" + e.message);
    }
    
}

function removeGroupMember(groupid, ids) {
    art.dialog({
        id: 'removeGroupMemberDlg',
        title : '{{contact_js_removeGroupMember_title_lang}}',
        /* content : '<div id="process">\
                        <div class="processtext">\
                            {{contact_js_removeGroupMember_content_lang}}（<span style="color:#0C7EC5;" id="processNum">0</span>/'+ ids.length +'）\
                        </div>\
                        <div class="process">\
                            <div class="process_left"></div>\
                            <div class="process_center"></div>\
                            <div class="process_right"></div>\
                        </div>\
                    </div>', */
        cancelValue : '{{contact_js_removeGroupMember_cancel_lang}}',
        width : 300,
        cancel : function () {
            ids.splice(0, ids.length,'{{contact_js_removeGroupMember_content_lang}}');
            return false;
        },
        focus : true,
		dblclickNotHide : true,
        lock : true
    });
	startGroupMemberProcess('removeGroupMemberDlg',ids.length);
    removeGroupMemberImpl(groupid, ids, ids.length);
}

function removeGroupMemberImpl(groupid, ids, all) {
    if (ids.length > 0) {
        var id = "";
        var posts = [];
        var postnum = (ids.length>10)?10:ids.length;
        for (var i=0; i < postnum; i++) {
            var first = ids[0];
            id = ((id=="")?"":(id+"*")) + parseInt(first, 10);
            posts.push(first);
            ids.splice(0,1);
        }
        ajaxRequest("http://contact/groupmember?gid="+parseInt(groupid, 10)+"&id="+id, "DELETE", "", 
            function (msg) {
                for (var i=0, len=posts.length; i<len; i++) {
                    $('#'+posts[i]).remove();
                }
                
                setGroupMemberProcessNum(posts.length);
                posts.splice(0, posts.length);
                removeGroupMemberImpl(groupid,ids, all);
        });
    } else {
        var ch = $('#contact_list').find('input:checked:first');
        if (ch.length == 0) {
            document.getElementById('contact_list').scrollTop = 0;
            showContactdetail($('#contact_list>li:first'));
        } else {
            showContactdetail($(ch).parent().parent());
        }
        setGroupmemberNum();
        contactBarstatus();

        setGroupMemberProcessNum(-1);
    }
}
function addGroupMember(groupid, ids) {
    art.dialog({
        id: 'addGroupMemberDlg',
        title : '{{contact_js_addGroupDlg_title_lang}}',
        /* content : '<div id="process">\
                        <div class="processtext">\
                            {{contact_js_addGroupDlg_content_lang}}（<span style="color:#0C7EC5;" id="processNum">0</span>/'+ ids.length +'）\
                        </div>\
                        <div class="process">\
                            <div class="process_left"></div>\
                            <div class="process_center"></div>\
                            <div class="process_right"></div>\
                        </div>\
                    </div>', */
        cancelValue : '{{contact_js_addGroupDlg_cancel_lang}}',
        width : 300,
        cancel : function () {
            ids.splice(0, ids.length);
            return false;
        },
        focus : true,
		dblclickNotHide : true,
        lock : true
    });
	startGroupMemberProcess('addGroupMemberDlg',ids.length,'{{contact_js_addGroupDlg_content_lang}}');
    addGroupMemberImpl(groupid, ids, ids.length);
}

function addGroupMemberImpl(groupid, ids, all) {
    if (ids.length > 0) {
        var id = "";
        var posts = [];
        var postnum = (ids.length>10)?10:ids.length;
        for (var i=0; i < postnum; i++) {
            var first = ids[0];
            id = ((id=="")?"":(id+"*")) + parseInt(first, 10);
            posts.push(first);
            ids.splice(0,1);
        }
        ajaxRequest("http://contact/groupmember?gid="+parseInt(groupid, 10)+"&id="+id, "PUT", "", 
            function (msg) {
                
                setGroupMemberProcessNum(posts.length);
                posts.splice(0, posts.length);
                addGroupMemberImpl(groupid, ids, all);
        });
    } else {
        setGroupmemberNum();
        setGroupMemberProcessNum(-1);
    }
}

function startGroupMemberProcess(dlgName,length,processTxt) {
	initProcess(dlgName,length,processTxt);
}

function setGroupMemberProcessNum(nProcess) {
	if(nProcess != -1){
		var num = $('#nDone').text();
		num = parseInt(num);
		nProcess += num;
	}
	setProcess(nProcess);
}

function starContacts(ids, bstar) {
    var txt = bstar?'{{contact_js_starContacts_info_lang}}';
    art.dialog({
        id: 'starContactsDlg',
        title : txt,
        /* content : '<div id="process">\
                        <div class="processtext">\
                           {{contact_js_statContacts_content_on_lang}} ' + txt + '，{{contact_js_starContacts_content_please_lang}}（<span style="color:#0C7EC5;" id="processNum">0</span>/'+ ids.length +'）\
                        </div>\
                        <div class="process">\
                            <div class="process_left"></div>\
                            <div class="process_center"></div>\
                            <div class="process_right"></div>\
                        </div>\
                    </div>', */
        cancelValue : '{{contact_js_starContacts_content_cancel_lang}}',
        width : 300,
        cancel : function () {
            ids.splice(0, ids.length);
            return false;
        },
        focus : true,
		dblclickNotHide : true,
        lock : true
    });
	startStar(ids.length,'{{contact_js_statContacts_content_on_lang}} ' + txt + '，{{contact_js_starContacts_content_please_lang}}');
    starContactsImpl(ids, ids.length, bstar);
}

function starContactsImpl(ids, all, bstar) {
    if (ids.length > 0) {
        var id = "";
        var posts = [];
        var postnum = (ids.length>10)?10:ids.length;
        for (var i = 0; i < postnum; i++) {
            var first = ids[0];
            id = ((id=="")?"":(id+"*")) + parseInt(first, 10);
            posts.push(first);
            ids.splice(0,1);
        }
        ajaxRequest("http://contact/starcontact?id="+id, bstar==true?"PUT":"DELETE", "", 
            function (msg) {
                for (var i = posts.length - 1; i >= 0; i--) {
                    var li = $('#'+posts[i]).find('.star:first');
                    console.log(li);
                    if (bstar) {
                        li.addClass('starred');
                        li.attr('star','1');
                    } else {
                        li.removeClass('starred');
                        li.attr('star','0');
                        if (getClickCategorylistId($("#contact_group")) == 'starredContact') {
                            li.parent().parent().remove();
                        };
                    }
                }
                
                setStarNum(posts.length);
                posts.splice(0, posts.length);
                starContactsImpl(ids, all, bstar);
        });
    } else {

        var ch = $('#contact_list').find('input:checked:first');
        if (ch.length == 0) {
            document.getElementById('contact_list').scrollTop = 0;
            showContactdetail($('#contact_list>li:first'));
        } else {
            showContactdetail($(ch).parent().parent());
        }
        setGroupmemberNum();
        contactBarstatus();
        setStarNum(-1);
    }
}

function startStar(length,processTxt) {
	initProcess('starContactsDlg',length,processTxt);
}

function setStarNum(nProcess) {
	if(nProcess != -1){
		var num = $('#nDone').text();
		num = parseInt(num);
		nProcess += num;
	}
	setProcess(nProcess);
}

function delContacts(id) {
    var ids = [];
    var _content;

    if (id == undefined) {
        var list = $('#contact_list').find('input:checked');
        _content = '{{contact_js_delContacts_listsure_lang}}<font color="red"> ' + list.length + ' </font>{{contact_js_delcontacts_numbers_lang}}';
     
        for (var i=0, len=list.length; i<len; i++) {
            ids.push(list[i].parentNode.parentNode.id);
        };
        if (ids.length<=0) {
            return;
        }
    } else {
        ids.push(id+'co');
        _content = '{{contact_js_delcontacts_content_lang}}'
    }

    art.dialog({
        id : 'deleteDlg',
        title : '{{contact_js_delcontactdlg_title_lang}}',
        content : _content,
        okValue : '{{contact_js_delcontactdlg_ok_lang}}',
        cancelValue : '{{contact_js_delcontactdlg_cancel_lang}}',
        width : '300px',
        ok : function () {
            this.button({
                    id: 'ok',
                    callback: function () {
                        return false;
                    },
                    disabled: true  
                }, {
                    id: 'cancel',
                    callback: function () { 
                        ids.splice(0, ids.length);
                        return false;
                    }
                }
            )
			startDelete(ids.length,'{{contact_js_delContacts_listsure_lang}}');
            window.deleteContactLock();
            delContactsImpl(ids,ids.length);
            return false;
        },
        cancel : function () {
        	ids.splice(0,ids.length);
            return true;
        },
        focus : true,
		dblclickNotHide : true,
        lock : true
    });
}

function delContactsImpl(ids, all) {
    if (ids.length > 0) {
        var id = "";
        var dels = [];
        var delnum = (ids.length>10)?10:ids.length;
        for (var i = 0; i < delnum; i++) {
            var pop = ids[0];
            id = ((id=="")?"":(id+"*")) + parseInt(pop, 10);
            dels.push(pop);
            ids.splice(0,1);
        }
        ajaxRequest("http://contact/deletecontact?id="+id, "DELETE", "", 
            function (msg) {

                for (var i = dels.length-1; i >= 0; i--) {
                    $('#'+dels[i]).remove();
                }
                setDeleteNum(dels.length);
                dels.splice(0, dels.length);
                delContactsImpl(ids, all);
        });
    } else {

        var ch = $('#contact_list').find('input:checked:first');
        if (ch.length == 0) {
            document.getElementById('contact_list').scrollTop = 0;
            showContactdetail($('#contact_list>li:first'));
        } else {
            showContactdetail($(ch).parent().parent());
        }

        setGroupmemberNum();
        contactBarstatus();
        setDeleteNum(-1);
        window.deleteContactUnLock();
    }
}

function delCalls() {
    var list = $('#call_list').find('input:checked');
    var nChecklen = list.length;
    var ids = [];
    for (var i=0, len=list.length; i<len; i++) {
        ids.push(list[i].parentNode.parentNode.id);
    };
    if (ids.length<=0) {
        return;
    }
    art.dialog({
        id : 'deleteDlg',
        title : '{{contact_js_delcall_title_lang}}',
        content : '{{contact_js_delcall_content_lang}} ' + nChecklen + ' {{contact_js_delcall_content_call_lang}}',
        okValue : '{{contact_js_delcall_ok_lang}}',
        cancelValue : '{{contact_js_delcall_cancel_lang}}',
        width : '300px',
        ok : function () {
            this.title('{{contact_js_delcall_Okcall_lang}}');
            this.button({
                    id: 'ok',
                    callback: function () {
                        return false;
                    },
                    disabled: true  
                }, {
                    id: 'cancel',
                    callback: function () { 
                        ids.splice(0, ids.length);
                        return true;
                    }
                }
            )
			startDelete(ids.length,'{{contact_js_delcall_process_lang}}');
            delCallsImpl(ids, ids.length);
            return false;
        },
        cancel : function () {
            return true;
        },
        focus : true,
	dblclickNotHide : true,
        lock : true
    });
}

function delCallsImpl(ids, all) {
    if (ids.length > 0) {
        var id = "";
        var dels = [];
        var delnum = (ids.length>10)?10:ids.length;
        for (var i = 0; i < delnum; i++) {
            var pop = ids[0];
            id = ((id=="")?"":(id+"*")) + parseInt(pop, 10);
            dels.push(pop);
            ids.splice(0,1);
        }
        ajaxRequest("http://contact/deletecall?id="+id, "PUT", "", 
            function (msg) {
                for (var i = dels.length - 1; i >= 0; i--) {
                    $('#'+dels[i]).remove();
                }
                setDeleteNum(dels.length);
                dels.splice(0, dels.length);
                
                delCallsImpl(ids, all);
        });
    } else {
        setCallNum();
        callBarstatus();
        setDeleteNum(-1);

        //当某类通话记录被全被删除后显示所有通话记录
        if($("#call_list li").length==0){
            $("#searchCall").val("");
            $("#call_group").find(".category-list").removeClass("category-list-click");
            $('#AllCall').addClass("category-list-click");
            $('#call_all_checker').prop("checked", false);
            $("#callduration_text").html("{{title_callDuration_lang}}");
            showCallList(CallType.ALL);
        }
    }
}

function startDelete(length,processTxt) {
	initProcess('deleteDlg',length,processTxt);
}

function setDeleteNum(nProcess) {
	if(nProcess != -1){
		var num = $('#nDone').text();
		num = parseInt(num);
		nProcess += num;
	}
	setProcess(nProcess);
}

function exportContacts() {
    var id = "";
    var list = $('#contact_list').find('input:checked');
    for (var i=0, len=list.length; i<len; i++) {
        id = ((id=="")?(""):(id+"*")) + parseInt(list[i].parentNode.parentNode.id, 10);
    }

    art.dialog({
        id : 'exportDlg',
        title : '{{contact_js_exportcontacts_title_lang}}',
        content : '<div class="refresh"></div><div class="artIcontext">{{contact_js_exportcontacts_content_lang}}</div>',
        beforeunload : function () {
            return false;
        },
        height : 100,
        lock : true,
		dblclickNotHide : true,
    });

    ajaxRequest("http://contact/exportvcard", "POST", id, 
        function (msg) {
            var dlg = art.dialog.get('exportDlg');
            dlg.config.beforeunload = function () { return true; };

            if (msg == '') {
                dlg.close();
            } else {
                var html = "";
                if (msg == "ok") {
                    html = '<div class="ok"></div><div class="artIcontext">{{contact_js_exportcontacts_ok_lang}}</div>';
                } else {
                    html = '<div class="sorry"></div><div class="artIcontext">{{contact_js_exportcontacts_fail_lang}}</div>'; //TODO:提示语更改
                }
                dlg.content(html);
                dlg.time(1500);
            };
    });
}

function exportCalls() {
    var id = "";
    var list = $('#call_list').find('input:checked');
    for (var i=0, len=list.length; i<len; i++) {
        id = ((id=="")?(""):(id+"*")) + parseInt(list[i].parentNode.parentNode.id, 10);
    }

    art.dialog({
        id : 'exportDlg',
        title : '{{contact_js_exportcalls_title_lang}}',
        content : '<div class="refresh"></div><div class="artIcontext">{{contact_js_exportcalls_content_lang}}</div>',
        beforeunload : function () {
            return false;
        },
        height : 100,
        lock : true,
		dblclickNotHide : true,
    });

    ajaxRequest("http://contact/exportcall", "POST", id, 
        function (msg) {
            var dlg = art.dialog.get('exportDlg');
            dlg.config.beforeunload = function () { return true; };

            if (msg == '') {
                dlg.close();
            } else {
                var html = "";
                if (msg == "ok") {
                    html = '<div class="ok"></div><div class="artIcontext">{{contact_js_exportcalls_sucess_lang}}</div>';
                } else {
                    html = '<div class="sorry"></div><div class="artIcontext">{{contact_js_exportcalls_fail_lang}}</div>'; //TODO:提示语更改
                }
                dlg.content(html);
                dlg.time(1500);
            };
    });
}

function ajaxRequest(_url, _type, _data, _callback) {
    try {
        $.ajax({
            url : _url,
            type : _type,
            data : _data,
            cache : false,
            success : _callback
        })
    } catch (e) {
        console.log(_url + "failed.\n" + e);
    }
}

function artAlert(_id, _title, _content) {
    art.dialog({
        id : _id,
        title : _title,
        content : _content,
        okValue : '{{contact_js_artAlert_ok_lang}}',
        ok : function () {
            return true;
        },
        focus : true,
        lock : true,
		dblclickNotHide : true,
        //time : _btime?3000:0,
        width : 300,
        height : 100
    });
}

function importContacts() {
    
	art.dialog({
        id : 'importDlg',
        title : '{{contact_js_aimportContacts_title_lang}}',
        content : '<div class="refresh"></div><div class="artIcontext">{{contact_js_aimportContacts_content_lang}}</div>',
        width : 300,
        lock : true,
	dblclickNotHide : true,
        cancelValue: '{{contact_js_aimportContacts_cancel_lang}}',
        cancel: function(){
    	 	window.stopEvent();
            return true;
        }
    })
    ajaxRequest("http://contact/importContacts", "PUT", "", function(msg){
    	console.log(msg)
    	if (msg == "ok") {
        console.log("import ok");
        global.bRefreshed = false;
        selId = ContactType.PHONE;

        initHtml();
        ajaxRequest("http://contact/refreshcontact", "GET", "", function (msg) {
            console.log(msg);
            global.bRefreshed = true;
        });
        }else if (msg !== "ok"){
            console.log("import not ok");
    		CloseArtDialog();
    		return;
    	}
    });
}

function startImport(length,processTxt) {
	initProcess('importDlg',length,processTxt);
}

function setImportNum(nProcess) {
	setProcess(nProcess,'<label class="d-over-tip">{{contact_js_setImportNum_text_lang}}</label>');
}

function importCalls() {
    art.dialog({
        id : 'importDlg',
        title : '{{contact_js_importCalls_title_lang}}',
        content : '<div class="refresh"></div><div class="artIcontext">{{contact_js_importCalls_content_lang}}</div>',
        beforeunload : function () {
            return false;
        },
        height : 100,
        lock : true,
		dblclickNotHide : true,
		cancelValue: '{{contact_js_importCalls_cancel_lang}}',
        cancel: function(){
            window.stopEvent();
            return true;
        }
    })
    ajaxRequest("http://contact/importCalls", "PUT", "", function(msg){
        console.log("importCalls , msg = "+ msg);
        if(msg=="ok")
        {

            showCallList(CallType.ALL);
            setCallNum();
        }else if(msg =="cancel"){
            showCallList(CallType.ALL);
            setCallNum();
        }

         var dlg = art.dialog.get('importDlg');
         dlg.config.beforeunload = function () { return true; };
         CloseArtDialog();  
        //art.dialog.get('importDlg').close();
    });
}

function sendSMS(idOrNum,use) {
	var data = idOrNum.join(',');
	data = data.replace(/\s/g,'');
    ajaxRequest("http://vivozs/mmssms/smsSendder", "POST", 
        {
        	type: 'sendto',
            datas: data,
			way:use,
        },
        function (msg) {
            console.log(msg);
        }
    );
}

function editContact(id, phone) {
    
    var postData = {
    	_id : id,
    	phone : [{"dataid":-1,"number":phone}]
    }
    console.log(JSON.stringify(postData));
    ajaxRequest("http://contact/editContact", "POST", JSON.stringify(postData), function (msg) {
        var saveid = parseInt(msg);
        console.log(msg);
        if (saveid > 0) {
            OnContactUpdate(saveid);
        };
    });
}

function searchContacts(obj) {
    console.log(obj.value);
	$("#contact_group").find(".category-list").removeClass("category-list-click");
    $('#phoneContact').addClass("category-list-click");
    $("#contact_group").find(".category-right").attr("clicked","no");
    if (obj.value == '') {
		getContactlist(ContactType.PHONE);
		 $('#phoneContact').attr("clicked","yes"); 
        return;
    };

    
    window.searchContact(obj.value, function(contactlist) {
        var contactdata = {
            list: contactlist
        };
        var contacthtml = template('contact_list_template', contactdata);
        document.getElementById('contact_list').innerHTML = contacthtml;
        showContactdetail($('#contact_list>li:first'));
        contactBarstatus();
    });
}

function searchCalls(obj) {
    if (obj.value == '') {
		showCallList(CallType.ALL);
        return;
    };
    
    
    window.searchCall(obj.value, function(calllist) {
        var data = {
            list: calllist,
        };
        $('#call_all_checker').prop('checked', false);
        $('#delCall').addClass('disable');
        var contacthtml = template('call_list_template', data);
        document.getElementById('call_list').innerHTML = contacthtml;        
        
        $("#call_group").find(".category-list").removeClass("category-list-click");
        $('#AllCall').addClass("category-list-click");
        
        resetCallLogMenuBar();
    });
}

function OnContactUpdate(id){
    selId = ContactType.PHONE;
    window.getContactlistById(selId, function(success, contactlist){
        if (success === true) {
            updateGroupList();
            var contactdata = {
                list: contactlist
            };
            var contact_list = document.getElementById('contact_list');
            contact_list.innerHTML = template('contact_list_template', contactdata);
            
            var scrollTo = document.getElementById(id + 'co');
            $(contact_list).animate({
                scrollTop: $(scrollTo).offset().top - $(contact_list).offset().top + $(contact_list).scrollTop()
            }, 'slow', function(){
                $(scrollTo).click();
            });
        }
    });
}

function CloseArtDialog(){
	var dialogs = art.dialog.get();
	for(var id in dialogs){
		dialogs[id].close();
	}
}

/*初始化对话框进度条大小*/
function initProcess(dlgName,length,processTxt){
	if(typeof dlgName != "undefined" && dlgName != "")
		var dlg = art.dialog.get(dlgName);
	if(typeof dlg != "undefined"){
		dlg.content(document.getElementById('processScript').innerHTML);
		if(typeof processTxt != "undefined" && processTxt != "")
			$('#aboveProcessTxt').prepend(processTxt);
		document.getElementById('nCnt').innerHTML = length;
	}
}

/*设置当前对话框进度条进度 -1表示完成，并显示完成的提示语*/
function setProcess(nProcess,finishedTxt){
	if(nProcess == -1 ){
		if(typeof finishedTxt != "undefined" && finishedTxt != "")
			$('.processTxt').append(finishedTxt);
	    setTimeout(function () {
	       CloseArtDialog();
	    },1000);
	    return;
	}
    var nTotal = parseInt($('#nCnt').text(), 10);
    $('#nDone').text(nProcess);
    $("#process").css("width", nProcess/nTotal*230);
}

function mergeRepeat(name){
	$('#text').text(name);
}

function mergeProcess(per){
	$("#process").css("width",per*230);
}

function delRepeat(ids){
	var list = ids.split('*');
	for (var i = 0; i < list.length; i++) {
		$('#'+list[i] + 'co').remove();
	};
}

function resetCallLogMenuBar()
{
      $('#delCall').addClass('disable');
      $('#call_all_checker').prop("checked", false);

}

function showOpTips(hwnd,text)
{
    $("#opTips").text(text).show();
    var itemObj = $(hwnd);
    var x = $(hwnd).offset().left; 
    var y = $(hwnd).offset().top; 
    var h = $(hwnd).height(); 
    $("#opTips").css({"left":x,"top":y+h+2}).show();
    $("#opTips").html(text).show(); 
}
function hideOpTips()
{
    $("#opTips").hide();
}