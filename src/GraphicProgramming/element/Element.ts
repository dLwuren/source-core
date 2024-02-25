import { Vector3 } from "../utils/Vector3";
import { CustomElement } from "./custom_element";

export class Div extends CustomElement {
  constructor() {
    super();
    this.setTag("div");
    this.setStyle({
      display: "inline-block"
    });
  }

  setText(text: any) {
    this.$el.innerText = text;
    this.text = text;
    return this;
  }

  setHtml(text: string) {
    this.$el.innerHTML = text;
    this.text = text;
    return this;
  }

  setColor(color: string) {
    this.setStyle({
      color,
    });

    return this;
  }

  setFontSize(size: string) {
    this.setStyle({
      "font-size": size,
    });

    return this;
  }
}

export class Text extends CustomElement {
  text = "";

  constructor(text: any = "") {
    super();
    this.setTag("div");

    this.setText(text);

    this.setStyle({
      display: "inline-block"
    });
  }

  setText(text: any) {
    this.$el.innerText = text;
    this.text = text;
    return this;
  }

  setHtml(text: string) {
    this.$el.innerHTML = text;
    this.text = text;
    return this;
  }

  setColor(color: string) {
    this.setStyle({
      color,
    });

    return this;
  }

  setFontSize(size: string) {
    this.setStyle({
      "font-size": size,
    });

    return this;
  }
}

export class Input extends CustomElement {
  constructor() {
    super();
    this.setTag("input");
    this.setAttribute("type", "text");
  }

  hint(value: string) {
    this.setAttribute("placeholder", value);
    return this;
  }

  setValue(value: string) {
    this.$el.value = value;
    return this;
  }

  getValue() {
    return this.$el.value;
  }

}

export class Image extends CustomElement {
  src = "";
  constructor() {
    super();
    this.setTag("img");
  }

  setSrc(src: string) {
    this.$el.src = src;
    this.src = src;
  }
}

export class Circular extends CustomElement {
  radius = 0;
  constructor() {
    super();

    this.setStyle({
      "border-radius": "50%",
    });
  }

  setRadius(radius: number) {
    this.radius = radius;
    this.setStyle({
      "width": radius * 2 + "px",
      "height": radius * 2 + "px",
    });

    return this;
  }

  setBackground(bg: any) {
    this.setStyle({
      background: bg,
    });

    return this;
  }
}

export class Triangle extends CustomElement {
  constructor() {
    super();

    this.setStyle({
      width: 0,
      height: 0,
      background: "transparent",
      "border-left": "solid 20px red",
      "border-right": "solid 20px transparent",
      "border-top": "solid 20px yellow",
      "border-bottom": "solid 20px yellow"
    })
  }
}

export class BaseSvg extends CustomElement {
  constructor() {
    super();
  }

  setTag(tag = this.tagName) {
    this.$el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    this.tagName = tag;
    this.$el.that = this;
    this.updateStyle();
    return this;
  }
}

export class Svg extends BaseSvg {
  constructor() {
    super();

    this.setTag("svg");

    this.setAttribute("viewBox", "0 0 100 100");
    this.setAttribute("version", "1.1");
    this.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  }
}

export class Path extends BaseSvg {
  pointArray: Vector3[] = [];
  static M = 0;
  static L = 1;
  static C = 2;
  static C_ = 3;

  strokeWidth_ = 3;

  constructor() {
    super();
    this.setTag("path");
  }

  set(pointArray: number[]) {
    this.pointArray.length = 0;
    for (let i = 0; i < pointArray.length; i += 3) {
      this.pointArray.push(
        new Vector3(
          pointArray[i],
          pointArray[i + 1],
          pointArray[i + 2]
        )
      )
    }

    this.updatePoint();
    return this;
  }

  push(pointArray: number[]) {
    for (let i = 0; i < pointArray.length; i += 3) {
      this.pointArray.push(
        new Vector3(
          pointArray[i],
          pointArray[i + 1],
          pointArray[i + 2]
        )
      )
    }
    this.updatePoint();
    return this;
  }

  splice(start: number, deleteCount: number, ...arg: Vector3[]) {
    this.pointArray.splice(start, deleteCount, ...arg);
    this.updatePoint();
    return this;
  }

  clear(): this {
    this.pointArray.length = 0;
    return this;
  }

  updatePoint(): this {
    this.setAttribute("d", this.toString());
    return this;
  }

  toString(): string {
    let str = "";
    const command = ["M", "L", "C", ","];

    this.pointArray.forEach(point => {
      str += `${command[point.z]} ${point.x} ${point.y} `;
    })

    return str;
  }

  fill(color: string) {
    this.setAttribute("fill", color);
    return this;
  }

  stroke(color: string) {
    this.setAttribute("stroke", color);
    return this;
  }

  strokeWidth(num: number) {
    this.strokeWidth_ = num;
    this.setAttribute("stroke-width", num);
    return this;
  }
}

export class CurveLine extends Path {
  constructor() {
    super();
    this.fill("none");
    this.stroke("black");
    this.push([
      0, 0, Path.M,
      0, 70, Path.C,
      70, 0, Path.C_,
      100, 100, Path.C_
    ]);
  }
}
