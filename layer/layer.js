(function () {
  function createLayer (dom, txt, padding, noticeP) {
    dom = dom instanceof Element ? dom : document.querySelector(dom)
    if (!dom) throw new Error('要绑定遮罩的dom不存在！')

    var w = dom.offsetWidth
    var h = dom.offsetHeight
    var div = document.createElement('div')
    var offset = getOffset(dom)
    var hand = document.createElement('div')
    var words = document.createElement('p')
    var cover = document.createElement('div')
    var notice = document.createElement('div')
    //noticeTop = (noticeTop ? noticeTop : h) + offset.top + 'px'
    noticeP = noticeP ? noticeP : []
    noticeP[0] = noticeP[0] ? parseInt(noticeP[0]) + offset.left + 'px' : offset.left + 'px'
    noticeP[1] = !noticeP[1] ? h + offset.top + 'px' : h + parseInt(noticeP[1]) + offset.top + 'px'
    console.log(noticeP)
    padding = padding ? padding : []
    for(var i = 0; i < 4; i++) {
      if (!padding[i]) {
        padding[i] = '0px'
      }
    }
    div.id = 'cover-201809121042'
    hand.id = 'hand-201809121042'
    words.id = 'words-201809121042'
    cover.id = 'stopclick-cover-201809121042'
    notice.id = 'notice-201809121042'
    dom.style.position = 'relative'
    dom.style.zIndex = '101'
    div.style.width = w + 'px'
    div.style.height = h + 'px'
    div.style.padding = padding.join(' ')
    div.style.top = offset.top - window.pageYOffset - parseInt(padding[0]) + 'px'
    div.style.left = offset.left - window.pageXOffset - parseInt(padding[3]) + 'px'
    notice.style.width = w + 'px'
    notice.style.top = noticeP[1]
    notice.style.left = noticeP[0]
    if (txt) words.innerHTML = txt
    notice.appendChild(hand)
    notice.appendChild(words)
    document.body.appendChild(div)
    document.body.appendChild(cover)
    document.body.appendChild(notice)
    function closeLayer () {
      document.body.removeChild(div)
      document.body.removeChild(cover)
      document.body.removeChild(notice)
      dom.style.position = ''
      dom.style.zIndex = ''
    }
    cover.addEventListener('click', closeLayer)
    notice.addEventListener('click', closeLayer)
    div.addEventListener('click', closeLayer)
    dom.addEventListener('click', closeLayer)
  }

  function getOffset (dom, s) {
    s = s || {}
    if (dom === null) return s
    var left = (s.left || 0) + dom.offsetLeft
    var top = (s.top || 0) + dom.offsetTop
    return getOffset(dom.offsetParent, {left, top})
  }
  typeof module === 'undefined' ? window.createLayer = createLayer : module.exports = createLayer
})()
