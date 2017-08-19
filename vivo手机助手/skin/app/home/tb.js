if(!Array.prototype.indexOf){Array.prototype.indexOf=function(c,b){if(b==null){b=0}else{if(b<0){b=Math.max(0,this.length+b)}}for(var a=b;a<this.length;a++){if(this[a]===c){return a}}return -1}}if(!Array.prototype.lastIndexOf){Array.prototype.lastIndexOf=function(c,b){if(b==null){b=this.length-1}else{if(b<0){b=Math.max(0,this.length+b)}}for(var a=b;a>=0;a--){if(this[a]===c){return a}}return -1}}if(!Array.prototype.forEach){Array.prototype.forEach=function(c,d){var a=this.length;for(var b=0;b<a;b++){c.call(d,this[b],b,this)}}}if(!Array.prototype.filter){Array.prototype.filter=function(d,e){var a=this.length;var c=[];for(var b=0;b<a;b++){if(d.call(e,this[b],b,this)){c.push(this[b])}}return c}}if(!Array.prototype.map){Array.prototype.map=function(d,e){var a=this.length;var c=[];for(var b=0;b<a;b++){c.push(d.call(e,this[b],b,this))}return c}}if(!Array.prototype.some){Array.prototype.some=function(c,d){var a=this.length;for(var b=0;b<a;b++){if(c.call(d,this[b],b,this)){return true}}return false}}if(!Array.prototype.every){Array.prototype.every=function(c,d){var a=this.length;for(var b=0;b<a;b++){if(!c.call(d,this[b],b,this)){return false}}return true}}Array.prototype.contains=function(a){return this.indexOf(a)!=-1};Array.prototype.copy=function(a){return this.concat()};Array.prototype.insertAt=function(b,a){this.splice(a,0,b)};Array.prototype.insertBefore=function(c,b){var a=this.indexOf(b);if(a==-1){this.push(c)}else{this.splice(a,0,c)}};Array.prototype.removeAt=function(a){this.splice(a,1)};Array.prototype.remove=function(b){var a=this.indexOf(b);if(a!=-1){this.splice(a,1)}};TB={};TB.common={getCookie:function(a){var b=document.cookie.match("(?:^|;)\\s*"+a+"=([^;]*)");return b?unescape(b[1]):""},setCookie:function(c,e,a,d,f){e=escape(e);e+=(d)?"; domain="+d:"";e+=(f)?"; path="+f:"";if(a){var b=new Date();b.setTime(b.getTime()+(a*86400000));e+="; expires="+b.toGMTString()}document.cookie=c+"="+e},removeCookie:function(a){setCookie(a,"",-1)},pickDocumentDomain:function(){var c=location.hostname.split("."),a=c.length;var b=arguments[0]||(a<3?0:1);if(b>=a||a-b<2){b=a-2}return c.slice(b).join(".")+(location.port?":"+location.port:"")},trim:function(a){return a.replace(/(^\s*)|(\s*$)/g,"")},escapeHTML:function(b){var c=document.createElement("div");var a=document.createTextNode(b);c.appendChild(a);return c.innerHTML},unescapeHTML:function(a){var b=document.createElement("div");b.innerHTML=a.replace(/<\/?[^>]+>/gi,"");return b.childNodes[0]?b.childNodes[0].nodeValue:""},toArray:function(b,d){var c=[];for(var a=d||0;a<b.length;a++){c[c.length]=b[a]}return c},applyConfig:function(c,a){if(c&&a&&typeof a=="object"){for(var b in a){if(!YAHOO.lang.hasOwnProperty(c,b)){c[b]=a[b]}}}return c}};TB.widget={};TB.widget.SimpleScroll={};TB.widget.SimpleMarquee={};TB.widget.SimpleTab=new function(){var c=YAHOO.util;var a={eventType:"click",currentClass:"Current",tabClass:"",autoSwitchToFirst:true,stopEvent:true,delay:0.3};var b=function(f){var d=[];if(!f){return d}for(var e=0,g=f.childNodes;e<g.length;e++){if(g[e].nodeType==1){d[d.length]=g[e]}}return d};this.decorate=function(d,g){d=c.Dom.get(d);g=TB.common.applyConfig(g||{},a);var m=b(d);var f=m.shift(0);var e=f.getElementsByTagName("li");var j,o;if(g.tabClass){j=c.Dom.getElementsByClassName(g.tabClass,"*",d)}else{j=TB.common.toArray(f.getElementsByTagName("a"))}var p=new c.CustomEvent("onSwitch",null,false,c.CustomEvent.FLAT);if(g.onSwitch){p.subscribe(g.onSwitch)}var q={switchTab:function(i){c.Dom.setStyle(m,"display","none");c.Dom.removeClass(e,g.currentClass);c.Dom.addClass(e[i],g.currentClass);c.Dom.setStyle(m[i],"display","block")},subscribeOnSwitch:function(i){p.subscribe(i)}};var l=function(r){if(o){n()}var i=j.indexOf(this);q.switchTab(i);p.fire(i);if(g.stopEvent){c.Event.stopEvent(r)}return !g.stopEvent};var h=function(){var i=this;o=setTimeout(function(){l.call(i)},g.delay*1000);if(g.stopEvent){c.Event.stopEvent(ev)}return !g.stopEvent};var n=function(){clearTimeout(o)};for(var k=0;k<j.length;k++){c.Event.on(j[k],"focus",l);if(g.eventType=="mouse"){c.Event.on(j[k],"mouseover",g.delay?h:l);c.Event.on(j[k],"mouseout",n)}else{c.Event.on(j[k],"click",l)}}c.Dom.setStyle(m,"display","none");if(g.autoSwitchToFirst){q.switchTab(0)}return q}};(function(){var a=YAHOO.util;TB.widget.Slide=function(b,c){this.init(b,c)};TB.widget.Slide.defConfig={slidesClass:"Slides",triggersClass:"SlideTriggers",currentClass:"Current",eventType:"click",autoPlayTimeout:2,disableAutoPlay:false};TB.widget.Slide.prototype={init:function(b,c){this.container=a.Dom.get(b);this.config=TB.common.applyConfig(c||{},TB.widget.Slide.defConfig);try{this.slidesUL=a.Dom.getElementsByClassName(this.config.slidesClass,"ul",this.container)[0];this.slides=this.slidesUL.getElementsByTagName("li")}catch(d){throw new Error("can't find slides!")}this.delayTimeId=null;this.autoPlayTimeId=null;this.curSlide=-1;this.sliding=false;this.pause=false;this.onSlide=new a.CustomEvent("onSlide",this,false,a.CustomEvent.FLAT);if(YAHOO.lang.isFunction(this.config.onSlide)){this.onSlide.subscribe(this.config.onSlide,this,true)}this.initSlides();this.initTriggers();if(this.slides.length>0){this.play(1)}if(!this.config.disableAutoPlay){this.autoPlay()}},initTriggers:function(){var d=document.createElement("ul");this.container.appendChild(d);for(var c=0;c<this.slides.length;c++){var b=document.createElement("li");b.innerHTML=c+1;d.appendChild(b)}d.className=this.config.triggersClass;this.triggersUL=d;if(this.config.eventType=="mouse"){a.Event.on(this.triggersUL,"mouseover",this.mouseHandler,this,true);a.Event.on(this.triggersUL,"mouseout",function(f){clearTimeout(this.delayTimeId)},this,true)}else{a.Event.on(this.triggersUL,"click",this.clickHandler,this,true)}},initSlides:function(){a.Event.on(this.slides,"mouseover",function(){this.pause=true},this,true);a.Event.on(this.slides,"mouseout",function(){this.pause=false},this,true);a.Dom.setStyle(this.slides,"display","none")},clickHandler:function(d){var c=YAHOO.util.Event.getTarget(d);var b=parseInt(c.innerHTML);while(c!=this.container){if(c.nodeName.toUpperCase()=="LI"){if(!this.sliding){this.play(b,true)}break}else{c=c.parentNode}}},mouseHandler:function(f){var d=a.Event.getTarget(f);var b=parseInt(d.innerHTML);while(d!=this.container){if(d.nodeName.toUpperCase()=="LI"){var c=this;this.delayTimeId=setTimeout(function(){c.play(b,true)},(c.sliding?0.5:0.1)*1000);break}else{d=d.parentNode}}},play:function(d,b){d=d-1;if(d==this.curSlide){return}if(this.curSlide==-1){this.curSlide=0}if(b&&this.autoPlayTimeId){clearInterval(this.autoPlayTimeId)}var c=this.triggersUL.getElementsByTagName("li");c[this.curSlide].className="";c[d].className=this.config.currentClass;this.slide(d);this.curSlide=d;if(b&&!this.config.disableAutoPlay){this.autoPlay()}},slide:function(b){this.sliding=true;a.Dom.setStyle(this.slides[this.curSlide],"display","none");a.Dom.setStyle(this.slides[b],"display","block");this.sliding=false;this.onSlide.fire(b)},autoPlay:function(){var b=this;var c=function(){if(!b.pause&&!b.sliding){var d=(b.curSlide+1)%b.slides.length+1;b.play(d,false)}};this.autoPlayTimeId=setInterval(c,this.config.autoPlayTimeout*1000)}};TB.widget.ScrollSlide=function(b,c){this.init(b,c)};YAHOO.extend(TB.widget.ScrollSlide,TB.widget.Slide,{initSlides:function(){TB.widget.ScrollSlide.superclass.initSlides.call(this);a.Dom.setStyle(this.slides,"display","")},slide:function(d){var b={scroll:{by:[0,this.slidesUL.offsetHeight*(d-this.curSlide)]}};var c=new a.Scroll(this.slidesUL,b,0.5,a.Easing.easeOutStrong);c.onComplete.subscribe(function(){this.sliding=false;this.onSlide.fire(d)},this,true);c.animate();this.sliding=true}})})();TB.widget.SimpleSlide=new function(){this.decoration=function(a,b){if(!a){return}b=b||{};if(b.effect=="scroll"){if(navigator.product&&navigator.product=="Gecko"){if(YAHOO.util.Dom.get(a).getElementsByTagName("iframe").length>0){new TB.widget.Slide(a,b);return}}new TB.widget.ScrollSlide(a,b)}else{new TB.widget.Slide(a,b)}}};