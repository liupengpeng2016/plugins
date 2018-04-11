/*
html 结构
<div id="canvas">
  <canvas class='scartch-card-canvas'></canvas>
  <img class='scratch-card-coating' src="../assets/images/gua-bg.jpg" alt="">
</div>
js 操作
new ScratchCard(params)
  params = {
  target:'',// selector 目标canvas
  coating:'',// 图层颜色或图层图片，默认#aaa
  wipeRadius: ''// 带单位，默认20px
  wipePercent: ,// 0-100,擦除百分比,默认35
  callback: ''// 擦除完成回调函数
}
实例方法
recover // 重置画布
*/
function ScratchCard (params) {
  this.params = params
  this.init()
}
var prototypeObj = {
  init: function () {
    this.target = document.querySelector(this.params.target)
    this.canvas = this.target.querySelector('canvas')
    this.coating = this.target.querySelector('img')
    this.width = this.canvas.clientWidth
    this.height = this.canvas.clientHeight
    this.operateObj = this.canvas.getContext('2d')
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.recover()
    // 添加事件监听
    this.canvas.addEventListener('touchmove', this.moveHandler.bind(this), this.isPassiveSupported() ? {passive: false} : false)
    this.canvas.addEventListener('touchend', this.moveEndHandler.bind(this), this.isPassiveSupported() ? {passive: false} : false)
  },
  isPassiveSupported: function () {
    var passiveSupported = false
    var options = Object.defineProperty({}, 'passive', {
      get: function () {
        passiveSupported = true
      }
    })
    try {
      document.addEventListener('test', null, options)
    } catch (err) {}
    return passiveSupported
  },
  getOffset: function (canvas) {
    if (canvas === null) {
      return {
        top: 0,
        left: 0
      }
    }
    return {
      top: canvas.offsetTop + this.getOffset(canvas.offsetParent).top,
      left: canvas.offsetLeft + this.getOffset(canvas.offsetParent).left
    }
  },
  moveHandler: function (evt) {
    evt.preventDefault()
    // 获取点击处坐标
    var offset = this.getOffset(this.canvas)
    var wipeRadius = this.params.wipeRadius || 24
    this.moveInfo = {
      x: parseInt(evt.touches[0].pageX - offset.left),
      y: parseInt(evt.touches[0].pageY - offset.top)
    }
    // 擦除
    this.operateObj.beginPath()
    this.operateObj.arc(this.moveInfo.x, this.moveInfo.y, wipeRadius, 0, Math.PI * 2)
    this.operateObj.closePath()
    this.operateObj.globalCompositeOperation = 'destination-out'
    this.operateObj.fillStyle = 'black'
    this.operateObj.fill()
  },
  moveEndHandler: function () {
    var wipePercent = this.params.wipePercent ? this.parame.wipePercent : 35
    if (this.wipePercent() >= wipePercent) {
      this.params.callback && this.params.callback()
      this.operateObj.clearRect(0, 0, this.width, this.height)
    }
  },
  wipePercent: function () {
    var imgData = this.operateObj.getImageData(0, 0, this.width, this.height).data
    var opacityPointNum = 0
    for (var i = 0; i < imgData.length; i += 4) {
      if (imgData[i + 3] === 0) {
        opacityPointNum++
      }
    }
    return parseInt(opacityPointNum / Math.ceil(imgData.length / 4) * 100)
  },
  recover () {
    var _this = this
    this.operateObj.globalCompositeOperation = 'source-over'

    if (this.coating) {
      this.coating.onload = function () {
        _this.operateObj.drawImage(_this.coating, 0, 0, _this.width, _this.height)
      }
      this.operateObj.drawImage(this.coating, 0, 0, this.width, this.height)
    } else {
      this.operateObj.fillStyle = this.params.coating || '#aaa'
      this.operateObj.fillRect(0, 0, this.width, this.height)
    }
  }
}
for (var i in prototypeObj) {
  if (prototypeObj.hasOwnProperty(i)) {
    ScratchCard.prototype[i] = prototypeObj[i]
  }
}
module.exports = ScratchCard
