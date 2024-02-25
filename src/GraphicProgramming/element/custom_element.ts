import { Event } from "../utils/Event";

export function deepClone(target: any) {
  let obj: any;
  if (target instanceof Array) {
    obj = [];
    target.forEach(v => {
      obj.push(deepClone(v));
    })
  }
  else if (typeof target == "object") {
    obj = {};
    Object.keys(target).forEach(k => {
      obj[k] = target[k];
    })
  }
  else {
    obj = target;
  }

  return obj;
}

export class CustomElement {
  [k: string]: any;
  $el: any;
  tagName = "div";
  style: { [k: string]: any } = {};
  Class: any;
  ClassName: any;
  event: Event;
  parent: CustomElement | undefined;

  static isObject(element: any) {
    return element instanceof this;
  }

  static from(element: any) {
    const elementTem: any = new this();
    Object.keys(element).forEach(k => {
      if (typeof elementTem[k] != "undefined") {
        element[k] = deepClone(element[k]);
      }
    })
  }

  constructor() {
    this.event = new Event(this);
    this.$el = document.createElement(this.tagName);
    this.$el.that = this;

    this.ClassName = this.constructor.name;
    this.Class = this.constructor;
  }

  setTag(tag = this.tagName) {
    this.$el = document.createElement(tag);
    this.tagName = tag;
    this.$el.that = this;
    this.updateStyle();
    return this;
  }

  setAttribute(attrName: string, value: any) {
    this.$el.setAttribute(attrName, value);
    return this;
  }

  getAttribute(attrName: string) {
    this.$el.getAttribute(attrName);
  }

  setStyle(style: { [k: string]: any }) {
    Object.keys(style).forEach(key => {
      this.style[key] = style[key];
    });
    this.updateStyle();
    return this;
  }

  clearStyle() {
    this.style = {};
    this.updateStyle();
    return this;
  }

  updateStyle() {
    this.$el.setAttribute("style", this.toStyleString());
    return this;
  }

  toStyleString() {
    let style = "";
    Object.keys(this.style).forEach(key => {
      style += `${key}:${this.style[key]};`;
    });
    return style;
  }

  appendChild(el: CustomElement, ...arg: any[]) {
    this.$el.appendChild(el.$el);
    this.event.emit("appendChild", el);
    el.parent = this;
    return this;
  }

  appendTo(el: any) {
    el.appendChild(this.$el);
    this.event.emit("appendTo", el);
    return this;
  }

  removeChild(el: CustomElement) {
    try {
      this.$el.removeChild(el.$el);
      this.event.emit("removeChild", el);
      el.parent = undefined;
    }
    catch (err) {
      return this;
    }
    return this;
  }

  removeTo() {
    if (this.$el.parentElement) {
      this.$el.parentElement.removeChild(this.$el);
      this.event.emit("remove", {});
    }
    return this;
  }

  on(eventName: string, calback: (e: { [key: string]: any; }) => any) {
    this.event.on(eventName, calback);
    return this;
  }

  /**节点创建后执行函数 */
  selfAuto(fun: (el: CustomElement) => void) {
    fun.call(this, this);

    return this;
  }

  onOld(eventName: string, calback: (e: { [key: string]: any; }) => any) {
    this.$el.addEventListener(eventName, calback);
    return this;
  }

  addEventListener(eventName: string, calback: (e: { [key: string]: any; }) => any) {
    this.$el.addEventListener(eventName, calback);
    return this;
  }

  removeEventListener(eventName: string, calback: (e: { [key: string]: any; }) => any) {
    this.$el.removeEventListener(eventName, calback);
    return this;
  }
}