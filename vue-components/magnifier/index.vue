<template>
  <div class='magnifier-wrap' ref='wrap'>
    <div class='magnify-target'>
      <slot></slot>
    </div>
    <transition>
      <div class='clone-target'
        v-show='showTarget'
        :style='{
          transform: `scale(${this.scale})`,
          transformOrigin: `${x}% ${y}%`
        }'>
        <slot></slot>
      </div>
    </transition>
    <div class="target-cover"></div>
    <div class="target-bg" v-show='showTarget'></div>
  </div>
</template>
<script>
const maxScale = 2.5;
const initScale = 2.5;
const zoomOnce = 0.2;
function throttle(fn, type = 'always', inter = 30) {
  let t = null;
  return e => {
    if (t) {
      if (type === 'once') {
        clearInterval(t);
      } else if (type === 'always') {
        return;
      }
    }
    t = setTimeout(() => {
      fn(e);
      t = null;
    }, inter);
  };
}
export default {
  data() {
    return {
      scale: 1,
      showTarget: false,
      entered: false,
      x: 50,
      y: 50
    }
  },
  mounted() {
    const wrap = this.$refs.wrap;
    const onceHandler = throttle(evt => {
        this.mouseMoveHandler(evt, { w: wrap.clientWidth, h: wrap.clientHeight });
        this.scale = initScale;
        this.showTarget = true;
        this.entered = true;
      }, 'once');
    const alwaysHandler = throttle(evt => {
        this.mouseMoveHandler(evt, { w: wrap.clientWidth, h: wrap.clientHeight });
      }, 'always', 10);
    const mousewheelHandler = throttle(evt => {
        this.mouseWheelHandler(evt);
      });
    wrap.addEventListener('mousemove', event => {
      if (this.entered) {
        alwaysHandler(event);
      } else {
        onceHandler(event);
      }
    });
    wrap.addEventListener('mousewheel', event => {
      event.preventDefault();
      mousewheelHandler(event);
    });
    wrap.addEventListener('mouseleave', event => {
      setTimeout(() => {
        this.mouseLeaveHandler();
        this.entered = false;
      }, 40);
    });
  },
  methods: {
    mouseMoveHandler(evt, { w, h }) {
      const x = evt.offsetX;
      const y = evt.offsetY;
      this.x = x / w * 100;
      this.y = y / h * 100;
    },
    mouseWheelHandler(event) {
      const isLarge = event.deltaY < 0;
      if (isLarge) {
        this.scale = Math.min(maxScale, this.scale + zoomOnce);
      } else {
        this.scale = Math.max(1, this.scale - zoomOnce);
      }
    },
    mouseLeaveHandler() {
      this.scale = 1;
      this.x = this.y = 50;
      this.showTarget = false;
    }
  }
}
</script>
<style lang="scss" scoped>
  .magnifier-wrap{
    position:relative;
    overflow: hidden;
    background:white;
  }
  .clone-target{
    position:absolute;
    top:0;
    left:0;
    z-index: 1000;
  }
  .target-cover{
    position: absolute;
    z-index: 10000;
    top:0;
    left:0;
    width:100%;
    height:100%;
    cursor:zoom-in;
    // cursor: url(../../assets/images/magnifier.ico) 4, 12 auto;
  }
  .target-bg{
    position: absolute;
    width:100%;
    height:100%;
    top:0;
    left:0;
    background:white;
    z-index: 999;
  }
  .v-enter, .v-leave-to{
    transform:scale(0)!important;
    opacity:0;
  }
  .v-enter-active, .v-leave-active{
    transition: all .3s;
  }
</style>