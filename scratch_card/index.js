/*
  params = {
  target:'',//selector 目标canvas
  width: '',//带单位,默认300px
  height: '',//带单位，默认150px
  coatingColor:'',//图层颜色，默认#aaa
  wipeRadius: ''//带单位，默认20px
  wipePercent: ,//0-100,擦除百分比
  callbackAfterWipe: ''//擦除完成回调函数
}
*/
function Scratch_card(params) {
    this.params = params;
    this.init();
}
Scratch_card.prototype = {
  constructor: Scratch_card,
  init: function(){
    var target = this.target = document.querySelector(this.params.target),
        width = this.params.width = this.params.width ? this.params.width : '300px',
        height =this.params.height = this.params.height ? this.params.height : '150px';
    this.operateObj = target.getContext('2d');
    target.style.width = width;
    target.style.height = height;
    this.operateObj.fillStyle = this.params.coatingColor ? this.params.coatingColor : '#aaa';
    this.operateObj.fillRect(0,0,parseInt(width), parseInt(height));
    //添加事件监听
    target.addEventListener('touchmove', this.moveHandler.bind(this), this.isPassiveSupported() ? {passive: false} : false);
    target.addEventListener('touchend', this.moveEndHandler.bind(this), this.isPassiveSupported() ? {passive: false} : false);

  },
  isPassiveSupported : function() {
    var passiveSupported = false;
    var options = Object.defineProperty({}, 'passive', {
        get: function(){
           passiveSupported = true;
        }
      })
    try {
      document.addEventListener('test', null, options);
    } catch (err) {}
    return passiveSupported;
  },
  getOffset: function(target) {
    if(target.nodeName === 'BODY') {
      return {
        top: 0,
        left: 0,
      }
    }
    return {
      top: target.offsetTop + arguments.callee(target.offsetParent).top,
      left: target.offsetLeft + arguments.callee(target.offsetParent).left,
    }
  },
  moveHandler: function(evt) {
    evt.preventDefault();
    //获取点击处坐标
    var offset = this.getOffset(this.target);
    radius = this.params.radius || 20;
    this.moveInfo = {
      x: parseInt(evt.touches[0].pageX - offset.left),
      y: parseInt(evt.touches[0].pageY - offset.top),
    }
    //擦除
    this.operateObj.beginPath();
    this.operateObj.arc(this.moveInfo.x, this.moveInfo.y, radius, 0, Math.PI * 2);
    this.operateObj.closePath();
    this.operateObj.globalCompositeOperation = 'destination-out';
    this.operateObj.fillStyle = 'black';
    this.operateObj.fill();
  },
  moveEndHandler: function() {
    var wipePercent = this.params.wipePercent ? this.parame.wipePercent : 40;
    if(this.wipePercent() >= wipePercent) {
      this.params.callbackAfterWipe && this.params.callbackAfterWipe();
      this.operateObj.clearRect(0,0,parseInt(this.params.width), parseInt(this.params.height));
    }
  },
  wipePercent: function() {
    var img_data = this.operateObj.getImageData(0,0, parseInt(this.params.width), parseInt(this.params.height)).data,
        opacityPointNum = 0;
    for(var i = 0; i< img_data.length; i+=4) {
      if(img_data[i + 3] === 0){
        opacityPointNum ++;
      }
    }
    return parseInt(opacityPointNum / Math.ceil(img_data.length/4) * 100);
  }
}
