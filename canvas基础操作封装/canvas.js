(function () {
  class SAUC {
    constructor ({id, isScale, UIW}) {
      this.init(id) // 初始化画布
      this.isScale = isScale // 是否按设备大小缩放
      this.UIW = UIW || window.innerWidth // 设计稿宽度
    }
    init (id) {
      const container = document.querySelector('#' + id)
      const containerSize = this.containerSize = {width: container.clientWidth, height: container.clientHeight}
      container.innerHTML = `<canvas width=${containerSize.width} height=${containerSize.height}>抱歉，该设备不支持！</canvas>`
      this.ctx = container.firstElementChild.getContext('2d')
      this.renderList = []
      window.requestAnimationFrame = requestAnimationFrame ||
        webkitRequestAnimationFrame ||
        mozRequestAnimationFrame ||
        msRequestAnimationFrame ||
        function (fn) {setTimeout(fn, 1000 / 60)}
      this.render()
    }
    create ({type, params}) {
      const el = {
        type, // type类型： 'line', 'dashline', 'rect', 'image', arc
        params
      }
      if (type === 'image') {
        let img
        if (typeof params[0] === 'string') {
          img = new Image()
          img.src = params[0]
          el.params[0] = img
        }
      }
      el.id = this.renderList.length
      this.renderList.push(el)
      return el
    }
    lineGenerator (params = []) {
      const [x1 = 0, y1 = 0, x2 = 0, y2 = 0, s = 'black', w = '1'] = params.map(val => this.turnUnit(val)) // 起点横坐标，起点纵坐标，终点横坐标，终点纵坐标，颜色，宽度
      this.ctx.beginPath()
      this.ctx.moveTo(x1, y1)
      this.ctx.lineTo(x2, y2)
      this.ctx.strokeStyle = s
      this.ctx.lineCap = 'round'
      this.ctx.lineWidth = w
      this.ctx.stroke()
    }
    dashlineGenerator (params = []) {
      const [dashConf, ...lineConf] = params
      this.ctx.setLineDash(dashConf)
      this.lineGenerator(lineConf)
    }
    rectGenerator (params = []) {
      const [x, y, w, h, s = 'black'] = params.map(val => this.turnUnit(val)) // 水平位置，竖直位置，宽，高，颜色
      this.ctx.beginPath()
      this.ctx.fillStyle = s
      this.ctx.fillRect(x, y, w, h, s)
    }
    arcGenerator (params = []) {
      const [x, y, r, sa, ea, s] = params.map(val => this.turnUnit(val)) // 水平， 数值，半径， 起始角度，结束角度 
      this.ctx.beginPath()
      this.ctx.arc(x, y, r, sa, ea)
      this.ctx.fillStyle = s
      this.ctx.fill()
    }
    imageGenerator (params) {
      const [image, x, y, w, h] = params.map(val => this.turnUnit(val)) // 图片， 水平， 数值， 宽， 高
      if (image) {
        this.ctx.drawImage(image, x, y, w, h)
      }
    }
    turnUnit (px) {
      let result = px
      if (this.isScale && typeof px === 'number') {
        result = window.innerWidth / this.UIW * px
      }
      return result
    }
    render () {
      this.ctx.clearRect(0, 0, this.containerSize.width, this.containerSize.height)
      this.renderList.forEach((val, i) => {
        this.ctx.save()
        this[val.type + 'Generator'](val.params)
        this.ctx.restore()
      })
      window.requestAnimationFrame(this.render.bind(this))
    }
    remove (item) {
      this.renderList.splice(item.id, 1)
      this.renderList.forEach((val, i) => {
        val.id = i
      })
    }
  }
  typeof exports === 'undefined' ? window.SAUC = SAUC : module.exports = SAUC
})()