$(document).ready(function(){$.event.props=$.event.props.join("|").replace("layerX|layerY|","").split("|");global.contentObj=$("#content")});document.oncontextmenu=new Function("return false;");window.onload=function(){onLoadOk()};var global={contentObj:""};function onLoadOk(){var a=cef.findphone("getFPUrl");if(a==null||a==""){a="http://findphone.vivo.com.cn/?cs=zs"}global.contentObj.append('<iframe name="findphoneIframe" id="findphoneIframe" frameborder=no scrolling="no"src="'+a+'"></iframe>');global.contentObj.show()};