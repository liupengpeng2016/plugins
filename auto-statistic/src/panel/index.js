import './index.scss'
/*********** 统计参数配置面板类 *************/
class Panel {
  constructor () {
    this.state = {
      list: [{key:'', value: ''}]
    }
    this.panelList = null
    this.panel = null
    Object.defineProperty(this.state, 'list', {
      set: this.renderList.bind(this)
    })
  }
  init () {
    // 初始化dom
    const panel = document.createElement('div')
    panel.classList.add('panel-20190327')
    panel.innerHTML = `<div class=panel-container-20190327>
      <div class=panel-list-20190327></div>
      <p class='panel-btn-20190327'>
      <span id='confirm-btn-20190327'>确定</span>
      <span id='cancel-btn-20190327'>取消</span>
      </p>
      </div>`
    document.body.appendChild(panel)
    this.panel = panel
    this.panelList = panel.querySelector('.panel-list-20190327')

    // 初始化事件绑定
    const self = this
    panel.addEventListener('input', function () {
      const order = event.target.parentNode.data.order
      const name = event.target.name
      const value = event.target.value
      self.state.list[order][name] = value
    })
    panel.querySelector('#confirm-btn-20190327').addEventListener('click', function () {
      self.hide()
      self.saveList()
      self.removeItem()
    })
    panel.querySelector('#cancel-btn-20190327').addEventListener('click', function () {
      self.hide()
      self.removeItem()
    })
    return panel
  }
  addItem () { // 添加参数项
    this.state.list.push({
      key: '',
      value: ''
    })
  }
  removeItem () { // 删除参数项
    if (arguments.length) {
      this.state.list.splice(arguments[0], 1)
    } else {
      this.state.list = []
    }
  }
  renderList () { // 渲染参数项列表
    let innerHtml = '',
      list = this.state.list
    for (let i = 0; i < list.length; i++) {
      innerHtml += `<div class='panel-item-20190327' data-order=${i}>
        <span>参数${i + 1}</span>
        <input placeholder='请输入key' value=${list[i][0]} name='key'/>
        <input placeholder='请输入value' value=${list[i][1]} name='value'/>
        </div>`
    }
    this.panelList.innerHTML = innerHtml
  }
  hide () { // 隐藏面板
    this.panel.style.display = 'none'
  }
  show () { // 展示面板
    this.panel.style.display = 'block'
  }
  saveList () {
    localStorage.setItem('panelList', JSON.stringify(this.state.list))
  }
}
export default Panel