  class Ca {
    constructor ({target, isScale, unit, isAutoRender = true}) {
      this.isScale = isScale // 是否按设备大小缩放
      this.unit = unit || document.documentElement.clientWidth // 设计稿宽度
      this.isAutoRender = isAutoRender // 是否自动重复渲染，false时调用this.render()手动渲染
      this.init(target) // 初始化画布
    }
    init (target) {
      const container = typeof target === 'string' ? document.querySelector('#' + target) : target
      const dpr = window.devicePixelRatio
      const containerSize = this.containerSize = {width: container.clientWidth * dpr, height: container.clientHeight * dpr}
      container.innerHTML = `<canvas width=${containerSize.width} height=${containerSize.height} style='width:100%;height:100%'>抱歉，该设备不支持！</canvas>`
      this.ctx = container.firstElementChild.getContext('2d')
      this.renderList = []
      
      window.requestAnimationFrame = requestAnimationFrame ||
        webkitRequestAnimationFrame ||
        mozRequestAnimationFrame ||
        msRequestAnimationFrame ||
        function (fn) {setTimeout(fn, 1000 / 60)}
      if (this.isAutoRender) {
        this.render(true)
      }
    }
    create ({type, params}) {
      const el = {
        type, // type类型： 'line', 'dashline', 'rect', 'image', arc, font
        params
      }
      if (type === 'image') {
        let img
        if (typeof params[0] === 'string') {
          img = new Image()
          img.src = params[0]
          el.params[0] = img
          img.onload = () => {
            if (!this.isAutoRender) {
              this.render()
            } 
          }
        }
      }
      el.id = this.renderList.length
      this.renderList.push(el)
      return el
    }
    lineGenerator (params = []) {
      const [x1 = 0, y1 = 0, x2 = 0, y2 = 0, s = 'black', w = 1] = params.map(val => this.turnUnit(val)) // 起点横坐标，起点纵坐标，终点横坐标，终点纵坐标，颜色，宽度
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
      const [image, x, y, w, h] = params.map(val => this.turnUnit(val)) // 图片， 水平， 竖直， 宽， 高
      if (image) {
        this.ctx.drawImage(image, x, y, w, h)
      }
    }
    fontGenerator (params) {
      const [txt, x, y, size, c, base, isBold, family = 'Arial'] = params.map((val, i) => i > 0 ? this.turnUnit(val) : val) // 文字，水平，竖直
      this.ctx.font = (isBold ? 'bold ' : '') + size + 'px ' + family
      this.ctx.fillStyle = c
      this.ctx.textAlign = base
      this.ctx.fillText(txt, x, y)

    }
    turnUnit (px) {
      let result = px
      if (this.isScale && typeof px === 'number') {
        result = Math.max(document.documentElement.clientWidth / this.unit * px * window.devicePixelRatio, 1)
      }
      return result
    }
    clear () {
      this.renderList = []
    }
    render (isKeep) {
      this.ctx.clearRect(0, 0, this.containerSize.width, this.containerSize.height)
      this.renderList.forEach((val, i) => {
        this.ctx.save()
        this[val.type + 'Generator'](val.params)
        this.ctx.restore()
      })
      if (isKeep) {
        window.requestAnimationFrame(this.render.bind(this, true))
      }
    }
    remove (item) {
      this.renderList.splice(item.id, 1)
      this.renderList.forEach((val, i) => {
        val.id = i
      })
    }
  }
export default Ca
