(function () {
  function DeepLink (params) {
    // params = {
    //   target: '',//requier, str/dom
    //   iosScheme: '',
    //   androidScheme: '',
    //   iosDownloadUrl: '',
    //   androidDownloadUrl: '',
    //   universalLink: '',
    // }
    this.params = params
    var _this = this
    var target = params.target instanceof Element ? params.target : document.querySelector(params.target)
    target.addEventListener('click', function () {
      _this.downloadIfNoApp()
    })
  }
  DeepLink.prototype = {
    constructor: DeepLink,
    isPlatform: function (platform) {
      var ug = navigator.userAgent
      var reg = new RegExp(platform, 'i')
      if (ug.search(reg) !== -1) {
        return true
      }
      return false
    },
    getIosVersion: function () {
      var ug = navigator.userAgent
      var version = ug.match(/iPhone OS \d+_\d+/)[0].match(/\d+_\d+/)[0]
      return parseInt(version)
    },
    downloadIfNoApp: function () {
      var startTime = Date.now()
      var isIos = this.isPlatform('iphone')
      var isAndroid = this.isPlatform('android')
      var iosDownloadUrl = this.params.iosDownloadUrl
      var androidDownloadUrl = this.params.androidDownloadUrl
      var universalLink = this.params.universalLink
      var schemeUrl
      var endTime
      var directToUrl
      var url
      function directToDownload () {
        setTimeout(function () {
          endTime = Date.now()
          directToUrl = isIos ? iosDownloadUrl : androidDownloadUrl
          if (endTime - startTime < 5000 && directToUrl) {
            location.href = directToUrl
          }
        }, 100)
      }
      schemeUrl = isIos ? this.params.iosScheme : this.params.androidScheme
      url = isIos ? this.params.iosDownloadUrl : this.params.androidDownloadUrl
      if (!schemeUrl) {
        location.href = url
        return
      }
      location.href = schemeUrl
      if (isIos) {
        // ios9.0以上使用通用链接
        if (this.getIosVersion() >= 9 && universalLink) {
          location.href = universalLink
          return
        }
        directToDownload()
      } else if (isAndroid) {
        directToDownload()
      }
    }
  }
  window.DeepLink = DeepLink
})()
