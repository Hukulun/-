if(typeof SmsKind == "undefined"){
	var SmsKind = {
		SMS: 0,
		MMS: 1,
		FAV: 2,
		SIM: 3,
	}
}

if(typeof MessageType == "undefined"){
	var MessageType = {
		MESSAGE_TYPE_ALL: 0,
		MESSAGE_TYPE_INBOX: 1,
		MESSAGE_TYPE_SENT: 2,
		MESSAGE_TYPE_DRAFT: 3,
		MESSAGE_TYPE_OUTBOX: 4,
		MESSAGE_TYPE_FAILED: 5,
		MESSAGE_TYPE_QUEUED: 6,
	}
}

if(typeof InitStatus == "undefined"){
	var InitStatus = {
		mmsSms: false,
		favSms: false,
		simSms: false,
		encrytedAll: false
	}
}


if(typeof MessageTypeTip == "undefined"){
	var MessageTypeTip = {{util_js_meesagetyptip_array_lang}};
}

var Util = (function () {
	var now = new Date();
	var week = {{util_js_week_array_lang}};
	var _month =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
	Array.prototype.remove = function(value) {
		if(this.indexOf(value) != -1) {
			this.splice(this.indexOf(value), 1);
		}   
	}

	Array.prototype.add = function(value) {
		if(this.indexOf(value) == -1) {
			this.push(value);
			return true;
		}
		return false;
	}
	
	Date.prototype.toMMSS = function () {
		var mm = this.getMinutes();
		var ss = this.getSeconds();
		if (mm < 10) {mm = "0"+mm;}
		if (ss < 10) {ss = "0"+ss;}
		return mm+":"+ss;
	}
	
	
	Date.prototype.toMyString = function () {
		var mm = this.getMinutes();
		var hh = this.getHours();
		if (mm < 10) {mm = "0"+mm;}
		if (hh < 10) {hh = "0"+hh;}
		if(navigator.language == "zh-CN"){	
			var month = this.getMonth() + 1;
			return  month + "月" + this.getDate() + "日 " +  hh + ":" + mm;
		}else{
			return  hh + ":" + mm + " " + this.getDate() + " " + _month[this.getMonth()];
		}
	}
	
	Date.prototype.toSplitString = function () {
		if(navigator.language == "zh-CN"){	
			var month = this.getMonth() + 1;
			return this.getFullYear() + "年" + month + "月" + this.getDate() + " " + week[this.getDay()];
		}else{
			return week[this.getDay()] + " " + this.getDate() + " " + _month[this.getMonth()] + " " + this.getFullYear();
		}
	}
	
	

	
	Date.prototype.isSameDay = function (day) {
		return this.getFullYear() == day.getFullYear() && this.getMonth() == day.getMonth() && this.getDate() == day.getDate();
	}
	

	String.prototype.trim   =   function(){
         //   用正则表达式将前后空格
         //   用空字符串替代。
         return this.replace(/^\s+|\s+$/g,"");
	}

	String.prototype.isPhoneNumber = function(){
        var patrn=/^[0-9\+]{1,}$/; 
		if (!patrn.exec(this)) return false;
		return true;
	}

	String.prototype.escape = function(){
	    var elem = document.createElement("div");
	    elem.appendChild(document.createTextNode(this));
	    return elem.innerHTML.replace(/ /g, "&nbsp;").replace(/\r\n|\n/g, "</br>");
	}

	String.prototype.unescape = function() {
	    var elem = document.createElement("div");
	    elem.innerHTML = this;
	    return div.innerHTML;
	}

	var trim = function (h) {
		try {
			return h.replace(/^\s+|\s+$/g, "")
		} catch (j) {
			return h
		}
	}
	var byteLength = function (b) {
		if (typeof b == "undefined") {
			return 0
		}
		var a = b.match(/[^\x00-\x80]/g);
		return (b.length + (!a ? 0 : a.length))
	};

	return {
		getSmsCount : function (obj) {
			if(obj.value.length == 0) return 0;
			if(escape(obj.value).indexOf("%u")>=0) {
				$(obj).prop("maxlength", 536);
				if (obj.value.length <= 70) {
					return 1;
				} else {
					return Math.ceil(obj.value.length/67);
				};
			} else {
				$(obj).prop("maxlength", 1224);
				if (obj.value.length <= 160) {
					return 1;
				} else {
					return Math.ceil(obj.value.length/153);
				}
			}
		}
	}
})()
