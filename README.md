# vanghua-iamge-selector

> 基于Vue的面向移动端的图片选择器组件

## 引入组件

``` bash
# 安装组件
npm install vanghua-image-selector

# 局部引用
import VanghuaImageSelector from "vanghua-image-selector"
```

## 提供接口
|  属性接口   | 描述  | 单位 |
|  ----  | ----  | ---- |
| height  | 控制展示框的高度 | 同css中的height单位 |
| width  | 控制展示框的宽度 | 同css中的width单位 |
| background | 控制展示框的背景色 | 和css中的background一样 |
| type | 控制图片选择框的类型 | 'circle'表示圆形，用于头像选取; 'rec'表示矩形，用于背景选取|
| innerStyle | 控制展示框的样式 | 类型是对象，用于给展示框设置样式 |

|  事件接口   | 描述  | 说明 |
|  ----  | ----  | ---- |
|finished|选择完图片后获得截取图像的base64编码| 事件有一个参数，是获取的图像的base64编码 |
## 使用教程

```vue
<template>
  <div class="container">
    <vanghua-image-selector width="100%" height="9em" type="rec" background="cornflowerblue"></vanghua-image-selector>
    <vanghua-image-selector :innerStyle=" {position: 'absolute', top: '5.5em', left: '2em'}" @finished="handleFinished"></vanghua-image-selector>
  </div>
</template>

<script>
import VanghuaImageSelector from "vanghua-image-selector";
export default {
  name: "Home",
  components: {
    "vanghua-image-selector": VanghuaImageSelector
  },
  methods: {
    handleFinished(image) {
      console.log(image)
    }
  }
}
</script>

<style scoped>
.container {
  height: 100%;
  background: #42b983;
  position: relative;
}
</style>
```

上述使用教程的效果图

![](https://img-blog.csdnimg.cn/a34e784f04114749b9697a4a821de1d6.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAVmFuZ2h1YQ==,size_13,color_FFFFFF,t_70,g_se,x_16#pic_center)
