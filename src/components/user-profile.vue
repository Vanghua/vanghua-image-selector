<template>
  <div :style="innerStyle">
    <div ref="vanghua" @click="changeProfile">
      <img width="100%" height="100%" ref="img"/>
      <input type="file" ref="input" @change="handleUserProfileChanged" id="input"/>
    </div>
    <v-selector v-if="userProfileShow" @close="handleClose" :imgSrc="imgSrc" :type="type"></v-selector>
  </div>
</template>

<script>
import VanghuaImageSelector from "./vanghua-image-selector"
export default {
  name: "user-profile",
  components: {
    "v-selector": VanghuaImageSelector
  },
  props: {
    height: {
      type: String,
      required: false,
      default: "7em"
    },
    width: {
      type: String,
      required: false,
      default: "7em"
    },
    type: {
      type: String,
      required: false,
      default: "circle"
    },
    background: {
      type: String,
      required: false,
      default: "antiquewhite"
    },
    innerStyle: {
      type: Object
    }
  },
  data() {
    return {
      userProfileShow: false,
      files: null,
      imgSrc: "",
      input: null,
    }
  },
  mounted() {
    this.input = this.$refs.input;
    this.files = this.input.files;
    let vanghua = this.$refs.vanghua;
    if(this.type === "circle")
      vanghua.style.cssText = vanghua.style.cssText = `height: ${this.height}; width: ${this.width}; background: ${this.background}; overflow: hidden; border-radius: 9999px;`
    else
      vanghua.style.cssText = `height: ${this.height}; width: ${this.width}; background: ${this.background}; overflow: hidden;`
  },
  methods: {
    handleUserProfileChanged(event) {
      let fd = new FileReader();
      fd.readAsDataURL(event.target.files[0]);
      let that = this
      fd.onload = function (event) {
        that.imgSrc = event.target.result
        that.userProfileShow = true
      }
    },
    changeProfile(event) {
      this.input.click();
    },
    handleClose(image) {
      this.userProfileShow = false
      // 清空files，否则再次打开相同的图片不会触发change事件
      this.input.files = this.files
      if(image) {
        this.$refs.img.src = image;
        this.$emit("finished", image);
      }
    }
  }
}
</script>

<style scoped>
#input {
  display: none;
}
</style>
