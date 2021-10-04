<template>
  <div ref="profileContainer" class="profileContainer" @click="$event.stopPropagation();">
    <imgCutter id="cutter" ref="cutter">
      <img slot="imgBottom" width="100%" ref="imgBottom"/>
      <div slot="selector" ref="selector">
        <div slot="container" id="container" ref="container">
          <img slot="imgTop" width="100%" ref="imgTop"/>
        </div>
      </div>
    </imgCutter>
    <div id="btnBox">
      <button id="btnOk" @click="handleClose">&#x2714</button>
      <button id="btnCancel" @click="handleCancelClose">&#x2717</button>
    </div>
  </div>
</template>

<script>
// 静默执行原生web组件,这个组件规范了行为提升本模块的语义化程度
import "../utils/imageCutter";
export default {
  name: "vanghua-image-selector",
  props: ['imgSrc', 'type'],
  data() {
    return {
      // 当前设备的字体大小(移动端默认是14)
      fontSize: 14,
      // 选择框和选择框背景板的偏移量，这两组值是相关的，在选择框大小放缩时这两组值相互之间需要动态绑定(下面选择了计算属性)
      left: 0,
      top: 0,
    }
  },
  computed: {
    containerLeft() {
      return this.left * (-1) - 0.3 * this.fontSize
    },
    containerTop() {
      return this.top * (-1) - 0.3 * this.fontSize
    }
  },
  mounted() {
    let cutter = this.$refs.cutter;
    let selector = this.$refs.selector;
    let imgBottom = this.$refs.imgBottom;
    let imgTop = this.$refs.imgTop;
    let container = this.$refs.container;
    let profileContainer = this.$refs.profileContainer;

    // 弹出选择框时使选择框无论如何位于上方，profileContainer的父元素位于全局堆叠上下文，因为全局中可能有相同的复用组件，所以只能修改它
    let parent = profileContainer.parentNode;
    parent.style.zIndex = 1;
    // 我们进行图片选择时要让profileContainer全屏，所以要宽高和屏幕一致然后修正偏移量，此偏移量是由父元素引起
    profileContainer.style.cssText = `height: ${window.innerHeight}px; width: ${window.innerWidth}px; left: ${-parent.offsetLeft}px; top: ${-parent.offsetTop}px;`;


    imgTop.src = imgBottom.src = this.imgSrc;
    // 处理严格模式下事件处理程序中this指向event.target事件目标的问题
    let that = this;
    // 获取初始字体大小用于计算em继承相关运算
    this.fontSize = window.getComputedStyle(document.body, "null").fontSize.slice(0, -2);
    // 根据用户的选择来更改选择框的样式,注意重复设置cssText会覆盖上次的cssText
    if(this.type !== "circle")
      selector.style.cssText = `border-radius: 0px; width: 100%;`;

    // 初始定位选择框
    (function setSelectorCenter() {
      // 选择框初始位置居中，更新top和left属性
      that.left = cutter.offsetWidth / 2 - selector.offsetWidth / 2
      that.top = cutter.offsetHeight / 2 - selector.offsetHeight / 2
      selector.style.cssText += `left: ${that.left}px; top: ${that.top}px;`

      // 初始化选择框背景板的位置，背景板应该紧贴视口左上角，效果和#cutter元素一样
      container.style.cssText = `left: ${that.containerLeft}px; top: ${that.containerTop}px; height: ${cutter.offsetHeight}px; width: ${cutter.offsetWidth}px`;
    })();

    // 鼠标滚轮放缩
    (function() {
      cutter.addEventListener("mousewheel", function(event) {
        if (event.deltaY > 0 && selector.offsetHeight <= Math.min(imgBottom.offsetHeight, imgBottom.offsetWidth)) {
          if(that.type === "circle") {
            selector.style.cssText = `height: ${selector.offsetHeight / that.fontSize + 0.2}em; width: ${selector.offsetHeight / that.fontSize + 0.2}em;`
            ;[that.left, that.top] = [cutter.offsetWidth / 2 - selector.offsetWidth / 2, cutter.offsetHeight / 2 - selector.offsetHeight / 2];
            // 更新偏移量，随着大小变化，偏移量也发生了变化，这点容易被忽略。在选择框偏移量发生变化时也要更新选择框背景板的偏移量
            container.style.cssText = `left: ${that.containerLeft}px; top: ${that.containerTop}px; height: ${cutter.offsetHeight}px; width: ${cutter.offsetWidth}px`;
          }
          else {
            selector.style.height = selector.offsetHeight / that.fontSize + 0.2 + 'em';
            ;[that.top] = [cutter.offsetHeight / 2 - selector.offsetHeight / 2];
          }
        } else if (selector.offsetHeight / that.fontSize >= 3.2) {
          if(that.type === "circle") {
            selector.style.cssText = `height: ${selector.offsetHeight / that.fontSize - 0.2}em; width: ${selector.offsetHeight / that.fontSize - 0.2}em;`
            ;[that.left, that.top] = [cutter.offsetWidth / 2 - selector.offsetWidth / 2, cutter.offsetHeight / 2 - selector.offsetHeight / 2];
            // 更新偏移量，随着大小变化，偏移量也发生了变化，这点容易被忽略。在选择框偏移量发生变化时也要更新选择框背景板的偏移量
            container.style.cssText = `left: ${that.containerLeft}px; top: ${that.containerTop}px; height: ${cutter.offsetHeight}px; width: ${cutter.offsetWidth}px`;
          } else {
            selector.style.height = selector.offsetHeight / that.fontSize - 0.2 + 'em';
            ;[that.top] = [cutter.offsetHeight / 2 - selector.offsetHeight / 2];
          }
        }
      });
    })();

    // 选择框的双指缩放
    (function() {
      let lastFirstFingerTouch = {
        clientX: 0,
        clientY: 0
      }
      let lastSecondFingerTouch = {
        clientX: 0,
        clientY: 0
      }
      cutter.addEventListener("touchmove", function (event) {
        // 如果不是双指事件则不处理
        if (event.touches.length !== 2)
          return;
        let lastDistance = Math.pow(lastFirstFingerTouch.clientX - lastSecondFingerTouch.clientX, 2) + Math.pow(lastFirstFingerTouch.clientY - lastSecondFingerTouch.clientY, 2);
        let immediateDistance = Math.pow(event.touches[0].clientX - event.touches[1].clientX, 2) + Math.pow(event.touches[0].clientY - event.touches[1].clientY, 2);
        [lastFirstFingerTouch.clientX, lastFirstFingerTouch.clientY] = [event.touches[0].clientX, event.touches[0].clientY];
        [lastSecondFingerTouch.clientX, lastSecondFingerTouch.clientY] = [event.touches[1].clientX, event.touches[1].clientY];
        // 下面处理双指对选择框的放缩
        if (immediateDistance > lastDistance && selector.offsetHeight <= Math.min(imgBottom.offsetHeight, imgBottom.offsetWidth)) {
          if(that.type === "circle") {
            selector.style.cssText = `height: ${selector.offsetHeight / that.fontSize + 0.2}em; width: ${selector.offsetHeight / that.fontSize + 0.2}em;`
            ;[that.left, that.top] = [cutter.offsetWidth / 2 - selector.offsetWidth / 2, cutter.offsetHeight / 2 - selector.offsetHeight / 2];
            // 更新偏移量，随着大小变化，偏移量也发生了变化，这点容易被忽略。在选择框偏移量发生变化时也要更新选择框背景板的偏移量
            container.style.cssText = `left: ${that.containerLeft}px; top: ${that.containerTop}px; height: ${cutter.offsetHeight}px; width: ${cutter.offsetWidth}px`;
          }
          else {
            selector.style.height = selector.offsetHeight / that.fontSize + 0.2 + 'em';
            ;[that.top] = [cutter.offsetHeight / 2 - selector.offsetHeight / 2];
          }
        } else if (selector.offsetHeight / that.fontSize >= 3.2) {
          if(that.type === "circle") {
            selector.style.cssText = `height: ${selector.offsetHeight / that.fontSize - 0.2}em; width: ${selector.offsetHeight / that.fontSize - 0.2}em;`
            ;[that.left, that.top] = [cutter.offsetWidth / 2 - selector.offsetWidth / 2, cutter.offsetHeight / 2 - selector.offsetHeight / 2];
            // 更新偏移量，随着大小变化，偏移量也发生了变化，这点容易被忽略。在选择框偏移量发生变化时也要更新选择框背景板的偏移量
            container.style.cssText = `left: ${that.containerLeft}px; top: ${that.containerTop}px; height: ${cutter.offsetHeight}px; width: ${cutter.offsetWidth}px`;
          } else {
            selector.style.height = selector.offsetHeight / that.fontSize - 0.2 + 'em';
            ;[that.top] = [cutter.offsetHeight / 2 - selector.offsetHeight / 2];
          }
        }
      });
    })();

    // 选择框的拖动
    (function() {
      selector.addEventListener("touchstart", function (event) {
        // 初始化上次触摸点为当前触摸点
        let lastTouch = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        }
        selector.ontouchmove = function (event) {
          if(event.touches.length > 1)
            return;
          // 本次触摸点与上次触摸点的距离差
          let touchMov = {
            deltaX: event.touches[0].clientX - lastTouch.x,
            deltaY: event.touches[0].clientY - lastTouch.y
          }
          // 更新上一次触摸点为本次触摸点
          lastTouch = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
          }
          // 选择框在图像上横向移动边界控制
          if (selector.offsetLeft + touchMov.deltaX >= 0 && selector.offsetLeft + selector.offsetWidth + touchMov.deltaX <= cutter.offsetWidth) {
            that.left = selector.offsetLeft + touchMov.deltaX
            selector.style.left = `${that.left}px`
            // 选择框背景板要相反方向移动，即在表现上来看是相对#cutter静止的
            container.style.cssText = `left: ${that.containerLeft}px; top: ${that.containerTop}px; height: ${cutter.offsetHeight}px; width: ${cutter.offsetWidth}px`;
          }
          // 选择框在图像上纵向移动边界控制
          if (selector.offsetTop + touchMov.deltaY >= Math.max(imgBottom.offsetTop, 0) && selector.offsetTop + selector.offsetHeight + touchMov.deltaY <= Math.min(imgBottom.offsetTop + imgBottom.offsetHeight, cutter.offsetHeight)) {
            that.top = selector.offsetTop + touchMov.deltaY
            selector.style.top = `${that.top}px`
            // 选择框背景板要相反方向移动，即在表现上来看是相对#cutter静止的
            container.style.cssText = `left: ${that.containerLeft}px; top: ${that.containerTop}px; height: ${cutter.offsetHeight}px; width: ${cutter.offsetWidth}px`;
          }
        }
        selector.ontouchend = function () {
          // 触摸结束移除事件处理程序
          selector.ontouchmove = null
          selector.ontouchup = null
        }
      })
    })();
  },
  methods: {
    handleClose(event) {
      event.stopPropagation();
      let that = this
      let selector = this.$refs.selector;
      let img = this.$refs.imgBottom;
      let profileContainer = this.$refs.profileContainer;
      // 首先绘制一张和手机上显示的图片一样大的图片，因为我们只知道在手机上这张图片上的选择框偏移量，而canvas打开图片只是打开原始尺寸
      let canvas = document.createElement("canvas");
      [canvas.width, canvas.height] = [img.offsetWidth, img.offsetHeight];
      let ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.offsetWidth, img.offsetHeight)
      let temp = canvas.toDataURL("image/png")

      // 进入正题，截取图片
      let image = new Image()
      image.src = temp
      image.onload = function() {
        let canvas = document.createElement("canvas");
        [canvas.width, canvas.height] = [selector.offsetWidth, selector.offsetHeight];
        let ctx = canvas.getContext("2d");
        ctx.drawImage(this, selector.offsetLeft, selector.offsetTop - img.offsetTop, selector.offsetWidth, selector.offsetHeight, 0, 0, canvas.width, canvas.height)
        let result = canvas.toDataURL("image/png")
        that.$emit("close", result)
        // 退出后还原全局堆叠上下文
        profileContainer.parentNode.style.zIndex = 0;
      }
    },
    handleCancelClose(event) {
      this.$emit('close');
      event.stopPropagation();
      // 退出后还原全局堆叠上下文
      let profileContainer = this.$refs.profileContainer;
      profileContainer.parentNode.style.zIndex = 0;
    }
  }
}
</script>

<style scoped>
.profileContainer {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0px;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
#cutter {
  display: flex;
  width: 100%;
  height: calc(100% - 4em);
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
#btnBox {
  height: 4em;
  width: 100%;
}
#btnBox button {
  border-radius: 9999px;
  font-weight: 400;
  font-size: 1.2em;
}
#btnOk {
  float: left;
  margin-left: 1em;
}
#btnCancel {
  float: right;
  margin-right: 1em;
}
#cutter > div[slot="selector"] {
  border: 0.3em solid white;
  border-radius: 9999px;
  height: 7em;
  width: 7em;
  position: absolute;
  overflow: hidden;
}
#cutter > img[slot="imgBottom"] {
  opacity: 0.5;
}
#container {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
