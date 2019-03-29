import SelectDom from './selectDom'
import Panel from './panel'
const panel  = new Panel()
const selectDom = new SelectDom()
selectDom.init()
panel.init()
// window.addEventListener('click', function () {
//   event.preventDefault()
//   event.stopPropagation()
// }, true)