export default class ImageCutter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        let root = this.shadowRoot;
        root.prepend(ImageCutter.template.content.cloneNode(true));
    }
}
let template = document.createElement("template");
/*
    imgBottom指的是在底层的图片，必须有opacity: 0.5(目的是只有选择框中的图片是不透明的，营造出选择框内亮，选择框外暗的效果)
    selector指的是选择框，必须有overflow:hidden
    container指的是选择框中的背景板
    imgTop指的是背景板中的图片，相对于imgBottom在上层
*/
template.innerHTML = `
    <style>
        :host(slot[name="selector"]) {
            overflow: hidden;
        }
        :host(slot[name="imgBottom"]) {
            opacity: 0.5;
        }
    </style>
    <slot name="imgBottom"></slot>
    <slot name="selector">
        <slot name="container">
            <slot name="imgTop"></slot>
        </slot>
    </slot>
`
ImageCutter.template = template;
customElements.define('image-cutter', ImageCutter);