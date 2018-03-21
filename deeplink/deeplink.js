function DeepLink (params){
  // params = {
  //   target: '',
  //   iosScheme: '',
  //   androidScheme: '',
  //   iosDownloadUrl: '',
  //   androidDownloadUrl: '',
  //   universalLink: '',
  // }
  this.params = params;
  var _this = this,
  target = params.target instanceof Element ? params.target : document.querySelector(params.target);
  target.addEventListener('click', function(){
    _this.downloadIfNoApp();
  });
}
DeepLink.prototype = {
 constructor: DeepLink,
 isPlatform: function (platform) {
   var ug = navigator.userAgent;
   var reg = new RegExp(platform, 'i');
   if(ug.search(reg) != -1) {
     return true;
   }
   return false;
 },
 getIosVersion: function () {
   var ug = navigator.userAgent;
   var version = ug.match(/iPhone OS \d+_\d+/)[0].match(/\d+_\d+/)[0];
   return parseInt(version);
 },
 downloadIfNoApp: function () {
   var startTime = Date.now(),
    isIos = this.isPlatform('iphone'),
    isAndroid = this.isPlatform('android'),
    iosDownloadUrl = this.params.iosDownloadUrl,
    androidDownloadUrl = this.params.androidDownloadUrl,
    universalLink = this.params.universalLink,
    schemeUrl,
    endTime,
    directToUrl;
   function directToDownload () {
     setTimeout(function() {
       endTime = Date.now();
       directToUrl = isIos ? iosDownloadUrl : androidDownloadUrl;
       if(endTime - startTime < 5000 && directToUrl) {
         location.href = directToUrl;
       }
     }, 100)
   }


   schemeUrl = isIos ? this.params.iosScheme : this.params.androidScheme;
   if(!schemeUrl){
     return console.error('schemeUrl is empty!')
   }
   location.href = schemeUrl;

   if(isIos) {
     //ios9.0以上使用通用链接
     if(this.getIosVersion() >= 9 && universalLink) {
       return  location.href = universalLink;
     }
     directToDownload();
   } else if(isAndroid) {
     directToDownload();
   }
 }
}
//commonjs支持
var module;
if(module) {
  module.exports = DeepLink;
}
