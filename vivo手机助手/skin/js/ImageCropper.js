(function(a){var b=function(f,c,e,d){this.width=f;this.height=c;this.cropWidth=e;this.cropHeight=d;this.image=null;this.imageCanvas=null;this.imageContext=null;this.imageScale=1;this.imageRotation=0;this.imageLeft=0;this.imageTop=0;this.imageViewLeft=0;this.imageViewTop=0;this.canvas=null;this.context=null;this.previews=[];this.maskGroup=[];this.maskAlpha=0.6;this.maskColor="#111";this.cropLeft=0;this.cropTop=0;this.cropViewWidth=e;this.cropViewHeight=d;this.dragSize=7;this.dragColor="#fff";this.dragLeft=0;this.dragTop=0;this.mouseX=0;this.mouseY=0;this.inCropper=false;this.inDragger=false;this.isMoving=false;this.isResizing=false;this.mouseStartX=0;this.mouseStartY=0;this.cropStartLeft=0;this.cropStartTop=0;this.cropStartWidth=0;this.cropStartHeight=0};a.ImageCropper=b;b.prototype.setCanvas=function(c){this.canvas=document.getElementById(c)||c;this.context=this.canvas.getContext("2d");this.canvas.width=this.width;this.canvas.height=this.height;this.canvas.oncontextmenu=this.canvas.onselectstart=function(){return false};this.imageCanvas=document.createElement("canvas");this.imageContext=this.imageCanvas.getContext("2d");this.imageCanvas.width=this.width;this.imageCanvas.height=this.height};b.prototype.addPreview=function(c){var e=document.getElementById(c)||c;var d=e.getContext("2d");this.previews.push(d)};b.prototype.loadImage=function(d){if(!this.isAvaiable()){return}var c=this;if(!c.image){c.image=new Image()}c.image.onload=function(f){c._init()};c.image.src=d};b.prototype._init=function(){var e=Math.min(this.width/this.image.width,this.height/this.image.height);if(e>1){e=Math.min(this.cropViewWidth/this.image.width,this.cropViewHeight/this.image.height)}if(this.image.width*e<this.cropViewWidth){e=Math.min(e,this.cropViewWidth/this.image.width)}if(this.image.height*e<this.cropViewHeight){e=Math.min(e,this.cropViewHeight/this.image.height)}this.imageViewLeft=this.imageLeft=(this.width-this.image.width*e)/2;this.imageViewTop=this.imageTop=(this.height-this.image.height*e)/2;this.imageScale=e;this.imageRotation=0;var d=Math.min(this.image.width*e,this.image.height*e);this.cropViewWidth=Math.min(d,this.cropWidth);this.cropViewHeight=Math.min(d,this.cropHeight);this.cropLeft=(this.width-this.cropViewWidth)/2;this.cropTop=(this.height-this.cropViewHeight)/2;this.dragLeft=this.cropLeft+this.cropViewWidth-this.dragSize/2;this.dragTop=this.cropTop+this.cropViewHeight-this.dragSize/2;this._update();var c=this;this.canvas.onmousedown=function(f){c._mouseHandler.call(c,f)};this.canvas.onmouseup=function(f){c._mouseHandler.call(c,f)};this.canvas.onmousemove=function(f){c._mouseHandler.call(c,f)}};b.prototype._mouseHandler=function(d){if(d.type=="mousemove"){var c=this.canvas.getClientRects()[0];this.mouseX=d.pageX-c.left;this.mouseY=d.pageY-c.top;this._checkMouseBounds();this.canvas.style.cursor=(this.inCropper||this.isMoving)?"move":(this.inDragger||this.isResizing)?"se-resize":"";this.isMoving?this._move():this.isResizing?this._resize():null}else{if(d.type=="mousedown"){this.mouseStartX=this.mouseX;this.mouseStartY=this.mouseY;this.cropStartLeft=this.cropLeft;this.cropStartTop=this.cropTop;this.cropStartWidth=this.cropViewWidth;this.cropStartHeight=this.cropViewHeight;this.inCropper?this.isMoving=true:this.inDragger?this.isResizing=true:null}else{if(d.type=="mouseup"){this.isMoving=this.isResizing=false}}}};b.prototype._checkMouseBounds=function(){this.inCropper=(this.mouseX>=this.cropLeft&&this.mouseX<=this.cropLeft+this.cropViewWidth&&this.mouseY>=this.cropTop&&this.mouseY<=this.cropTop+this.cropViewHeight);this.inDragger=(this.mouseX>=this.dragLeft&&this.mouseX<=this.dragLeft+this.dragSize&&this.mouseY>=this.dragTop&&this.mouseY<=this.dragTop+this.dragSize);this.inCropper=this.inCropper&&!this.inDragger};b.prototype._move=function(){var d=this.mouseX-this.mouseStartX;var c=this.mouseY-this.mouseStartY;this.cropLeft=Math.max(this.imageViewLeft,this.cropStartLeft+d);this.cropLeft=Math.min(this.cropLeft,this.width-this.imageViewLeft-this.cropViewWidth);this.cropTop=Math.max(this.imageViewTop,this.cropStartTop+c);this.cropTop=Math.min(this.cropTop,this.height-this.imageViewTop-this.cropViewHeight);this.dragLeft=this.cropLeft+this.cropViewWidth-this.dragSize/2;this.dragTop=this.cropTop+this.cropViewHeight-this.dragSize/2;this._update()};b.prototype._resize=function(){var e=Math.min(this.mouseX-this.mouseStartX,this.mouseY-this.mouseStartY);var c=Math.max(10,this.cropStartWidth+e);var d=Math.max(10,this.cropStartHeight+e);var c=Math.min(c,this.width-this.cropStartLeft-this.imageViewLeft);var d=Math.min(d,this.height-this.cropStartTop-this.imageViewTop);this.cropViewWidth=this.cropViewHeight=Math.round(Math.min(c,d));this.dragLeft=this.cropLeft+this.cropViewWidth-this.dragSize/2;this.dragTop=this.cropTop+this.cropViewHeight-this.dragSize/2;this._update()};b.prototype.rotate=function(d){if(!this.image){return}this.imageRotation+=d;var c=Math.abs(this.imageRotation%180)==90;this.imageViewLeft=c?this.imageTop:this.imageLeft;this.imageViewTop=c?this.imageLeft:this.imageTop;this.cropLeft=(this.width-this.cropViewWidth)/2;this.cropTop=(this.height-this.cropViewHeight)/2;this.dragLeft=this.cropLeft+this.cropViewWidth-this.dragSize/2;this.dragTop=this.cropTop+this.cropViewHeight-this.dragSize/2;this._update()};b.prototype._update=function(){this.context.clearRect(0,0,this.width,this.height);this._drawImage();this._drawMask();this._drawStroke();this._drawDragger();this._drawPreview()};b.prototype._drawImage=function(){this.imageContext.clearRect(0,0,this.width,this.height);this.imageContext.save();var c=this.imageRotation%360;this.imageContext.translate(this.imageViewLeft,this.imageViewTop);this.imageContext.scale(this.imageScale,this.imageScale);this.imageContext.rotate(this.imageRotation*Math.PI/180);switch((360-c)%360){case 90:this.imageContext.drawImage(this.image,-this.image.width,0);break;case 180:this.imageContext.drawImage(this.image,-this.image.width,-this.image.height);break;case 270:this.imageContext.drawImage(this.image,0,-this.image.height);break;case 0:default:this.imageContext.drawImage(this.image,0,0);break}this.imageContext.restore();this.context.drawImage(this.imageCanvas,0,0)};b.prototype._drawPreview=function(){for(var c=0;c<this.previews.length;c++){var d=this.previews[c];d.clearRect(0,0,d.canvas.width,d.canvas.height);d.save();d.drawImage(this.imageCanvas,this.cropLeft,this.cropTop,this.cropViewWidth,this.cropViewHeight,0,0,d.canvas.width,d.canvas.height);d.restore()}};b.prototype._drawMask=function(){this._drawRect(0,0,this.width,this.cropTop,this.maskColor,null,this.maskAlpha);this._drawRect(0,this.cropTop,this.cropLeft,this.cropViewHeight,this.maskColor,null,this.maskAlpha);this._drawRect(0,this.cropTop+this.cropViewHeight,this.width,this.height-this.cropViewHeight-this.cropTop,this.maskColor,null,this.maskAlpha);this._drawRect(this.cropLeft+this.cropViewWidth,this.cropTop,this.width-this.cropLeft-this.cropViewWidth,this.cropViewHeight,this.maskColor,null,this.maskAlpha)};b.prototype._drawDragger=function(){this._drawRect(this.dragLeft,this.dragTop,this.dragSize,this.dragSize,null,this.dragColor,null)};b.prototype._drawStroke=function(){this.context.save();this.context.strokeStyle="#CCCC00";this.context.lineWidth=3;this.context.strokeRect(this.cropLeft,this.cropTop,this.cropViewWidth,this.cropViewHeight);this.context.restore()};b.prototype._drawRect=function(d,i,g,c,e,f,h){this.context.save();if(e!==null){this.context.fillStyle=e}if(f!==null){this.context.strokeStyle=f}if(h!==null){this.context.globalAlpha=h}this.context.beginPath();this.context.rect(d,i,g,c);this.context.closePath();if(e!==null){this.context.fill()}if(f!==null){this.context.stroke()}this.context.restore()};b.prototype.getCroppedImageData=function(e,c,f){var d=document.createElement("canvas");d.width=e||this.cropWidth;d.height=c||this.cropHeight;d.getContext("2d").drawImage(this.imageCanvas,this.cropLeft,this.cropTop,this.cropViewWidth,this.cropViewHeight,0,0,d.width,d.height);return d.toDataURL(f||"image/png")};b.prototype.isAvaiable=function(){return typeof(FileReader)!=="undefined"};b.prototype.isImage=function(c){return(/image/i).test(c.type)}})(window);