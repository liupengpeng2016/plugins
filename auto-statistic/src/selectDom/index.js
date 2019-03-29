import './index.scss'

/********* 选取dom ********/
class SelectDom {
  constructor () {
    this.isSave = false
    this.currentDom = null
  }
  init () {
    this.bindEvent()
  }
  markTarget (evt) {
    const dom = evt.target
    dom && dom.classList.add('mark-20190327')
  }
  removeMark (evt) {
    const dom = evt.target
    dom && dom.classList.remove('mark-20190327')
  }
  removeMenu () {
    if (!this.menu) throw new Error('menu is not created')
    this.menu.style.display = 'none'
  }
  createMask (evt) {
    this.currentDom && this.currentDom.classList.remove('dom-mask') 
    const dom = evt.target
    dom.classList.add('dom-mask')
    this.currentDom = dom
  }
  bindEvent () {
    const self = this
    document.addEventListener('mouseover', this.markTarget.bind(this))
    document.addEventListener('mouseout', this.removeMark.bind(this))
    document.addEventListener('click', this.createMask.bind(this))
  }
  setPanel (panel) {
    panel.create()
  }
}
export default SelectDom