function Slide (params) {
  //参数配置
  var target = document.querySelector(params.target),
      wrapper = target.querySelector('.slide-wrapper'),
      slides = target.querySelectorAll('.slide-item'),
      slideNum = slides.length,
      targetWidth = target.clientWidth,
      targetHeight = target.clientHeight,
      slideWidth = params.preview ? targetWidth / params.preview : targetWidth,
      slideHeight = params.preview ? targetHeight / params.preview : targetHeight,
      wrapperWidth = target.clientWidth * (slideNum + (params.loop ? 2 : 0));

  this.params = {
    mode: params.mode ? params.mode : 'slide',
    direction: params.direction ? params.direction : 'horizontal',
    speed: params.speed ? params.speed : 500,
    delay: params.delay ? params.delay : 3000,
    autoplay: params.autoplay === true ? true : false,
    initialSlide: params.loop === true ? params.initialSlide || 1 : (params.initialSlide || 1) - 1,
    loop: params.loop === true ? true : false,
    paginationConcat: params.paginationConcat,
    pagination: params.pagination === true ? target.querySelector('.slide-pagination') : null,
    nav: params.nav === true ? target.querySelector('.slide-nav') : null,
    paginationEvent: params.paginationEvent || 'click',
    onAnimateEnd: params.onAnimateEnd,
    onAnimateStart: params.onAnimateStart,
    stopAfterConcat: params.stopAfterConcat === true ? true :false,
    timingFunction: params.timingFunction ? params.timingFunction : 'linear',
    target: target,
    targetWidth: targetWidth,
    targetHeight: targetHeight,
    wrapper: wrapper,
    wrapperWidth: wrapperWidth,
    slides: slides,
    slideNum: slideNum,
    slideWidth: slideWidth,
    slideHeight: slideHeight,
  }

  //运行状态
  this.state = {
    activeSlide: this.params.loop ? params.initialSlide || 1 : params.initialSlide - 1 || 0,
    currentTop: -1 * this.params.initialSlide * slideHeight,
    currentLeft: -1 * this.params.initialSlide * slideWidth,
  }
  //初始化
    //模式
  if(this.params.mode === 'slide') {
    this.slideModeInit();
  } else if(this.params.mode === 'fade') {
    this.fadeModeInit();
  }
    //分页
  if(this.params.pagination) {
    this.paginationInit();
  }
    //导航按钮
  if(this.params.nav) {
    this.navInit();
  }
  //自动开始
  if(this.params.autoplay === true){
    this.changeSlide();
  }
}

//公用方法
Slide.prototype = {
  constructor: Slide,
  config: {
    interval: 4,
    moveToTime: 300,
    timingFunctionRatio: 1 / 3,
  },
  loopModeReset: function(resetToStart) {
    //重置位置及状态
    var direction = this.params.direction,
        loop = this.params.loop,
        isHori = this.params.direction === 'horizontal' ? true : false,
        slideNum = this.params.slideNum;
    resetToStart = resetToStart && true;
    if(resetToStart) {
      var position = -1 * this.params[isHori ? 'slideWidth' : 'slideHeight'];
      this.state[isHori ? 'currentLeft' : 'currentTop'] = position;
      this.state.activeSlide = 1;
      this.params.wrapper.style[isHori ? 'left' : 'top'] = position + 'px';
    }else {
      var position = -1 * slideNum * this.params[isHori ? 'slideWidth' : 'slideHeight'];
      this.state[isHori ? 'currentLeft' : 'currentTop'] = position;
      this.state.activeSlide = slideNum;
      this.params.wrapper.style[isHori ? 'left' : 'top'] = position + 'px';
    }
  },
  stopMoving: function() {
    clearInterval(this.stopChangeSlide);
    clearInterval(this.stopTransition);
  },
  paginationOrder: function(slideOrder) {
    var loop = this.params.loop,
        slideNum = this.params.slideNum,
        result;
    if(!loop) {
      if(slideOrder + 1 > slideNum) {
        return 0;
      }else if(slideOrder < 0){
        return slideNum - 1;
      }else{
        return slideOrder;
      }
    }else{
      if(slideOrder > 0 && slideOrder < slideNum + 1 ){
        return slideOrder - 1;
      }
      return slideOrder === 0 ? slideNum - 1 : 0;
    }
  },
  slideAnimateEnd: function(nextSlide) {
    var loop = this.params.loop,
        slideNum = this.params.slideNum;
        //循环情况下重置
        this.state.activeSlide = nextSlide;
        if(loop) {
          if(nextSlide > slideNum) {
            this.loopModeReset(true);
          }else if(nextSlide - 1 < 0) {
            this.loopModeReset(false)
          }
        }
  },
  changeSlide: function() {
    var _this = this,
        stopChangeSlide,
        loop = this.params.loop,
        mode = this.params.mode,
        pagination = this.params.pagination;

    this.stopChangeSlide = stopChangeSlide = setInterval(function() {
      //动画前回调
      if(_this.params.onAnimateStart) {
        _this.params.onAnimateStart(this);
      }

      var nextSlide = _this.state.activeSlide + 1;
      //分页切换
      if(pagination) {
        _this.changePagination(_this.state.activeSlide, nextSlide);
      }
      //slide transition
      if(mode === 'slide'){
        _this.slide(nextSlide);
      }
      if(mode === 'fade'){
        _this.fade(nextSlide);
      }
    }, this.params.delay);
  },
  changePagination: function(currentSlide, nextSlide) {
    var currentPagination = this.paginationOrder(currentSlide),
        nextPagination = this.paginationOrder(nextSlide);
    this.addClass(this.params.paginationItem[nextPagination], 'active');
    this.removeClass(this.params.paginationItem[currentPagination], 'active');
  },
  slide: function(nextSlide) {
      var count = Math.round(this.params.speed / this.config.interval),
          countMax = count,
          _this = this,
          loop = this.params.loop,
          slideNum = this.params.slideNum,
          currentPosition,
          nextPosition,
          spaceOnce,
          stopTranstion,
          changeState,
          changeStyle;
      //非循环模式下边界调整
      if(!this.params.loop) {
        if(nextSlide < 0){
          nextSlide = slideNum - 1;
        }else if(nextSlide > slideNum - 1) {
          nextSlide = 0;
        }
      }
      if(this.params.direction === 'horizontal') {
        nextPosition = -1 * nextSlide * this.params.slideWidth;
        currentPosition = this.state.currentLeft;
        spaceOnce = (nextPosition - currentPosition) / count;
        changeState = 'currentLeft';
        changeStyle = 'left';
      }

      if(this.params.direction === 'vertical') {
        nextPosition = -1 * nextSlide * this.params.slideHeight;
        currentPosition = this.state.currentTop;
        spaceOnce = (nextPosition - currentPosition) / count;
        changeState = 'currentTop';
        changeStyle = 'top';
      }
      var s = nextPosition - currentPosition;
      var speedUpCount = Math.round(count * _this.config.timingFunctionRatio),
      a = (nextPosition - currentPosition) / 2 / Math.pow(speedUpCount * _this.config.interval, 2);

      this.stopTransition = stopTransition = setInterval(function() {
        //ease曲线
        if(_this.params.timingFunction === 'ease') {
              console.log('speedUpCount' + speedUpCount)
              console.log('count' + count)
          if(count >= speedUpCount) {
            var so = 0.5 * a * Math.pow(_this.config.interval * (countMax - count), 2),
                st = 0.5 * a * Math.pow(_this.config.interval * (countMax - count + 1), 2);
            console.log('state1')
            spaceOnce = st - so;
          }else if(count <= speedUpCount) {
             so = 0.5 * a * Math.pow(_this.config.interval * (countMax - count - 2 * speedUpCount), 2);
             st = 0.5 * a * Math.pow(_this.config.interval * (countMax - count - 2 * speedUpCount + 1), 2);
             spaceOnce = st - so;
             console.log('state2')

          }else {
            spaceOnce = a * speedUpCount * _this.config.interval;
            console.log('state3')

          }
        }

        currentPosition += spaceOnce;
        //更新状态
        _this.state[changeState] = currentPosition;
        //更新视图
        _this.params.wrapper.style[changeStyle] = currentPosition + 'px';
        if(count <= 0){
          //中止动画
          clearInterval(stopTransition);
          //执行动画结束时的回调
          _this.slideAnimateEnd(nextSlide);
          if(_this.params.onAnimateEnd){
            _this.params.onAnimateEnd();
          }
        }
        count --;
      }, this.config.interval);
  },
  resolveBorder: function(slide) {
    var slideNum = this.params.slideNum;
    if(slide < 0) {
      return slideNum - 1;
    }
    if(slide > slideNum - 1) {
      return 0;
    }
    return slide;
  },
  fade: function(nextSlide) {
    //获取当前slide和下一个slide，并更改样式；
      var currentSlide = this.state.activeSlide,
          slides = this.params.slides,
          stopTranstion,
          _this = this;
      //nextSlide 边界处理
      nextSlide = this.resolveBorder(nextSlide);
      //更改样式
      this.removeClass(slides[currentSlide], 'next-slide');
      this.addClass(slides[currentSlide], 'current-slide');
      this.addClass(slides[nextSlide], 'next-slide');
    //当前slide进行透明度过渡；
    var count = parseInt(_this.params.speed / _this.config.interval, 10),
        numOnce = 1 / count,
        nextOpacity = 1;
      stopTranstion = this.stopTransition = setInterval(function(){
        nextOpacity -= numOnce;
        nextOpacity = nextOpacity <= 0 ? 0 : nextOpacity;
        slides[currentSlide].style.opacity = nextOpacity;
        if(nextOpacity === 0){
          clearInterval(stopTranstion);
          //过渡完成之后重置上一个slide
          slides[currentSlide].style.opacity = 1;
          _this.removeClass(slides[currentSlide], 'current-slide');
          _this.state.activeSlide = nextSlide;
          if(_this.params.onAnimateStart){
            _this.params.onAnimateStart(_this)
          }
        }
      }, this.config.interval)
  },
  slideModeInit: function() {
    var wrapper = this.params.wrapper,
        slides = this.params.slides,
        slideWidth = this.params.slideWidth,
        slideHeight = this.params.slideHeight,
        wrapperWidth = this.params.wrapperWidth,
        initialSlide = this.params.initialSlide,
        targetWidth = this.params.targetWidth,
        targetHeight = this.params.targetHeight,
        loop = this.params.loop,
        direction = this.params.direction;

    if(direction === 'horizontal') {
      //slide width set
      for(var i = 0; i < slides.length; i++) {
        slides[i].style.width = slideWidth + 'px';
      }

      this.addClass(this.params.target, 'slide-horizontal');
      wrapper.style.width = wrapperWidth + 'px';//宽度设置
      wrapper.style.left = (loop ? -1 : 0) * slideWidth * initialSlide + 'px';//设置初始位置
    }
    if(direction === 'vertical') {
      //slide height set
      for(var i = 0; i < slides.length; i++) {
        slides[i].style.height = slideHeight + 'px';
      }
      this.addClass(this.params.target, 'slide-vertical');
      wrapper.style.top = (loop ? -1 : 0) * slideHeight * initialSlide + 'px';
    }

    if(loop === true) {
      wrapper.appendChild(slides[0].cloneNode(true));
      wrapper.insertBefore(slides[slides.length -1].cloneNode(true), slides[0]);
    }

  },
  fadeModeInit: function() {
    var currentSlide = this.state.activeSlide,
        nextSlide = this.resolveBorder(currentSlide + 1);
    this.addClass(this.params.target, 'fade-mode');
    this.addClass(this.params.slides[currentSlide], 'current-slide');
    this.addClass(this.params.slides[nextSlide], 'next-Slide');
    this.params.loop = false;
  },
  paginationInit: function() {
    var num = this.params.slideNum,
        mode = this.params.mode,
        paginationContent = '';
    for(var i = 0; i < num; i++) {
      paginationContent += '<span data_order="'+ i +'"></span>';
    }
    this.params.pagination.innerHTML = paginationContent;

    var paginationItem = this.params.pagination.querySelectorAll('span');
    this.params.paginationItem = paginationItem;
    this.addClass(paginationItem[this.paginationOrder(this.params.initialSlide)], 'active');

    //分页事件绑定
    var evt = this.params.paginationEvent;

    var _this = this;
    this.params.pagination['on' + evt] = function(e) {
      var e = event || e;
      if(e.target.nodeName === 'SPAN'){
        var order = parseInt(e.target.getAttribute('data_order'), 10);
        var currentSlide = _this.state.activeSlide;
        var nextSlide = _this.state.activeSlide = _this.params.loop ? order + 1 : order;
        //停止动画
        _this.stopMoving();
        //更新slide
        if(mode === 'slide'){
          _this.slide(nextSlide);
        }
        if(mode === 'fade'){
          _this.fade(nextSlide);
        }
        //更新pagination
        _this.changePagination(currentSlide, nextSlide);
        //是否继续播放
        if(_this.params.stopAfterConcat === false) {
          _this.changeSlide();
        }

      }
    }
  },
  navInit: function() {
    var nav = this.params.nav,
        target = this.params.target,
        mode = this.params.mode,
        prev = target.querySelector('.slide-prev'),
        next = target.querySelector('.slide-next'),
        _this = this;
    function handleNav(e) {
      var activeSlide = _this.state.activeSlide,
          loop = _this.params.loop,
          slideNum = _this.params.slideNum,
          e = event || evt,
          next = e.target.className.indexOf('prev') > 0 ? -1 : 1;
      if(!loop) {
        if(activeSlide === 0 && next === -1 ) {
          return
        }else if(activeSlide >= slideNum - 1 && next === 1){
          return
        }
      }
      //停止动画
      _this.stopMoving();
      //更新slide
      if(mode === 'slide'){
        _this.slide(activeSlide + next);
      }
      if(mode === 'fade'){
        _this.fade(activeSlide + next);
      }
      _this.changePagination(activeSlide, activeSlide + next);
      //是否继续播放
      if(_this.params.stopAfterConcat === false) {
        _this.changeSlide();
      }

    }
    prev.onclick = handleNav;
    next.onclick = handleNav;
  },
  addClass: function(target, className) {
    target.className = target.className + ' ' + className;
  },
  removeClass: function(target, className) {
    var reg = new RegExp('\\s*' + className, 'g');
    target.className = target.className.replace(reg, '');
  }
}
