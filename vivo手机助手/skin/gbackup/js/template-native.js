/*!art-template - Template Engine | http://aui.github.com/artTemplate/*/
;!function(){function V(b){return b.replace(C,"").replace(B,",").replace(A,"").replace(z,"").replace(y,"").split(/^$|,+/)}function U(b){return"'"+b.replace(/('|\\)/g,"\\$1").replace(/\r/g,"\\r").replace(/\n/g,"\\n")+"'"}function T(an,am){function al(c){return ad+=c.split(/\n/).length-1,af&&(c=c.replace(/\s+/g," ").replace(/<!--.*?-->/g,"")),c&&(c=Y[1]+U(c)+Y[2]+"\n"),c}function ak(d){var i=ad;if(ag?d=ag(d,am):aj&&(d=d.replace(/\n/g,function(){return ad++,"$line="+ad+";"})),0===d.indexOf("=")){var h=ae&&!/^=[=#]/.test(d);if(d=d.replace(/^=[=#]?|[\s;]*$/g,""),h){var g=d.replace(/\s*\([^\)]+\)/,"");I[g]||/^(include|print)$/.test(g)||(d="$escape("+d+")")}else{d="$string("+d+")"}d=Y[1]+d+Y[2]}return aj&&(d="$line="+i+";"+d),E(V(d),function(e){if(e&&!ac[e]){var c;c="print"===e?W:"include"===e?r:I[e]?"$utils."+e:H[e]?"$helpers."+e:"$data."+e,o+=e+"="+c+",",ac[e]=!0}}),d+"\n"}var aj=am.debug,ai=am.openTag,ah=am.closeTag,ag=am.parser,af=am.compress,ae=am.escape,ad=1,ac={$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1},aa="".trim,Y=aa?["$out='';","$out+=",";","$out"]:["$out=[];","$out.push(",");","$out.join('')"],X=aa?"$out+=text;return $out;":"$out.push(text);",W="function(){var text=''.concat.apply('',arguments);"+X+"}",r="function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);"+X+"}",o="'use strict';var $utils=this,$helpers=$utils.$helpers,"+(aj?"$line=0,":""),n=Y[0],b="return new String("+Y[3]+");";E(an.split(ai),function(e){e=e.split(ah);var d=e[0],f=e[1];1===e.length?n+=al(d):(n+=ak(d),f&&(n+=al(f)))});var a=o+n+b;aj&&(a="try{"+a+"}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:"+U(an)+".split(/\\n/)[$line-1].replace(/^\\s+/,'')};}");try{var ab=new Function("$data","$filename",a);return ab.prototype=I,ab}catch(Z){throw Z.temp="function anonymous($data,$filename) {"+a+"}",Z}}var S=function(d,c){return"string"==typeof c?F(c,{filename:d}):P(d,c)};S.version="3.0.0",S.config=function(d,c){R[d]=c};var R=S.defaults={openTag:"<%",closeTag:"%>",escape:!0,cache:!0,compress:!1,parser:null},Q=S.cache={};S.render=function(d,c){return F(d,c)};var P=S.renderFile=function(e,d){var f=S.get(e)||G({filename:e,name:"Render Error",message:"Template not found"});return d?f(d):f};S.get=function(f){var e;if(Q[f]){e=Q[f]}else{if("object"==typeof document){var h=document.getElementById(f);if(h){var g=(h.value||h.innerHTML).replace(/^\s*|\s*$/g,"");e=F(g,{filename:f})}}}return e};var O=function(d,c){return"string"!=typeof d&&(c=typeof d,"number"===c?d+="":d="function"===c?O(d.call(d)):""),d},N={"<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","&":"&#38;"},M=function(b){return N[b]},L=function(b){return O(b).replace(/&(?![\w#]+;)|[<>"']/g,M)},K=Array.isArray||function(b){return"[object Array]"==={}.toString.call(b)},J=function(f,e){var h,g;if(K(f)){for(h=0,g=f.length;g>h;h++){e.call(f,f[h],h,f)}}else{for(h in f){e.call(f,f[h],h)}}},I=S.utils={$helpers:{},$include:P,$string:O,$escape:L,$each:J};S.helper=function(d,c){H[d]=c};var H=S.helpers=I.$helpers;S.onerror=function(e){var d="Template Error\n\n";for(var f in e){d+="<"+f+">\n"+e[f]+"\n\n"}"object"==typeof console&&console.error(d)};var G=function(b){return S.onerror(b),function(){return"{Template Error}"}},F=S.compile=function(e,c){function n(b){try{return new k(b,l)+""}catch(a){return c.debug?G(a)():(c.debug=!0,F(e,c)(b))}}c=c||{};for(var m in R){void 0===c[m]&&(c[m]=R[m])}var l=c.filename;try{var k=T(e,c)}catch(f){return f.filename=l||"anonymous",f.name="Syntax Error",G(f)}return n.prototype=k.prototype,n.toString=function(){return k.toString()},l&&c.cache&&(Q[l]=n),n},E=I.$each,D="break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined",C=/\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g,B=/[^\w$]+/g,A=new RegExp(["\\b"+D.replace(/,/g,"\\b|\\b")+"\\b"].join("|"),"g"),z=/^\d[^,]*|,\d[^,]*/g,y=/^,+|,+$/g;"function"==typeof define?define(function(){return S}):"undefined"!=typeof exports?module.exports=S:this.template=S}();