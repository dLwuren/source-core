import { Vector2 } from "../../utils/Vector2";
import { CustomElement } from "../custom_element";
import { Circular, CurveLine, Path, Svg, Text } from "../Element";
import { LinearLayout } from "../layout";
import KeyframesAnimation from "../../utils/KeyframesAnimation"

// 模板类
export class Group extends CustomElement {
  list: CustomElement[] = [];
  constructor() {
    super();
  }

  push(e: CustomElement) {
    this.list.push(e);
    this.appendChild(e);
  }

  remove(e: number | CustomElement) {
    if (typeof e == "number") {
      if (e >= 0 && e < this.list.length) {
        this.removeChild(this.list[e]);
        this.list.splice(e, 1);
      }
    }
    else if (e instanceof CustomElement) {
      const i = this.list.indexOf(e);
      if (i >= 0 && i < this.list.length) {
        this.removeChild(this.list[i]);
        this.list.splice(i, 1);
      }

    }

  }

  pop() {
    const i = this.list.length - 1;
    if (i >= 0 && i < this.list.length) {
      this.removeChild(this.list[i]);
      const e = this.list[i];
      this.list.splice(i, 1);

      return e;
    }
  }

  get(i: number) {
    return this.list[i];
  }
}

/**开关、转换 */
export class Switch extends Group {
  circular: Circular;
  isOpen = false;
  constructor() {
    super();

    this.setStyle({
      "width": "50px",
      "height": "20px",
      "border": "solid 1px gray",
      "border-radius": "25px",
      "background": "#ffffff",
      "cursor": "pointer",
    });

    const circular = new Circular();
    circular.setRadius(10);
    circular.setBackground("green");
    circular.setStyle({
      "border-radius": "25px",
      "position": "absolute",
      "left": "0%",
      "transition": "all 0.25s",
      "background": "rgb(189, 189, 189)"
    });
    this.circular = circular;
    this.push(circular);

    this.$el.addEventListener("click", () => {
      if (this.isOpen) {
        this.close();
        this.isOpen = false;
      }
      else {
        this.open();
        this.isOpen = true;
      }
    })
  }

  open() {
    this.circular.setStyle({
      "left": "calc(100% - 20px)",
      "background": "rgb(0, 140, 255)",
    })

    this.setStyle({
      "border": "solid 1px rgb(0, 140, 255)",
    });

    this.event.emit("open", this);

    return this;
  }

  close() {
    this.circular.setStyle({
      "left": "0%",
      "background": "rgb(189, 189, 189)"
    })

    this.setStyle({
      "border": "solid 1px gray",
    })

    this.event.emit("close", this);

    return this;
  }

  setScale(i = 1) {
    this.setStyle({
      "transform": `scale(${i})`,
    })

    return this;
  }
}

/**弧线 */
export class Curve extends Group {
  svg: Svg;
  curveLine: CurveLine;
  pointStart: Vector2 = new Vector2(0, 0);
  pointEnd: Vector2 = new Vector2(100, 100);

  constructor() {
    super();

    this.svg = new Svg();

    this.curveLine = new CurveLine();

    this.svg.appendChild(this.curveLine);

    this.push(this.svg);
    this.update();
  }

  update() {

    const w = this.pointEnd.x - this.pointStart.x;
    const h = this.pointEnd.y - this.pointStart.y;
    this.svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

    this.svg.setStyle({
      left: this.pointStart.x + "px",
      top: this.pointStart.y + "px",
      width: w + "px",
      height: h + "px"
    })

    this.curveLine.set([
      this.pointStart.x, this.pointStart.y, Path.M,

      this.pointEnd.x, 0, Path.C,

      0, this.pointEnd.y, Path.C_,

      this.pointEnd.x, this.pointEnd.y, Path.C_,
    ]);
  }

  set(index: number, x: number, y: number) {
    if (index == 0) {
      this.pointStart.set(x, y);
    }
    else {
      this.pointEnd.set(x, y);
    }

    this.update();
  }
}

export class Line extends Group {
  svg: Svg;
  path: Path;
  startObject: any;
  endObject: any;

  pointStart: Vector2 = new Vector2(0, 0);
  pointEnd: Vector2 = new Vector2(100, 100);

  constructor() {
    super();

    this.svg = new Svg().setStyle({ "position": "absolute" });

    this.path = new Path();
    this.path.stroke("#fff");
    this.path.strokeWidth(2);
    this.path.fill("none")

    this.svg.appendChild(this.path);

    this.push(this.svg);
    this.update();
    this.setStyle({
      "pointer-events": "none",
      "z-index": 0
    })
  }

  quadrant() {
    if (this.pointEnd.x > this.pointStart.x && this.pointEnd.y < this.pointStart.y) {
      return 1;
    }
    else if (this.pointEnd.x < this.pointStart.x && this.pointEnd.y < this.pointStart.y) {
      return 2;
    }
    else if (this.pointEnd.x < this.pointStart.x && this.pointEnd.y > this.pointStart.y) {
      return 3;
    }
    else {
      return 4;
    }
  }

  update() {

    let w = Math.abs(this.pointEnd.x - this.pointStart.x);
    const h = Math.max(
      Math.abs(this.pointEnd.y - this.pointStart.y),
      this.path.strokeWidth_
    );
    const r = Math.min(w * 1.5, 500);
    w += r;

    let left = 0;
    let top = 0;

    const quadrant = this.quadrant();
    if (quadrant == 1) {
      left = this.pointStart.x - r / 2;
      top = this.pointEnd.y;

      this.path.set([
        w - r / 2, 0, Path.M,
        w - r * 0.8, 0, Path.C,
        r * 0.8, h, Path.C_,
        r / 2, h, Path.C_,
      ]);
    }
    if (quadrant == 2) {
      left = this.pointEnd.x - r / 2;
      top = this.pointEnd.y;

      this.path.set([
        r / 2, 0, Path.M,
        0, 0, Path.C,
        w, h, Path.C_,
        w - r / 2, h, Path.C_,
      ]);
    }
    if (quadrant == 3) {
      left = this.pointEnd.x - r / 2;
      top = this.pointStart.y;

      this.path.set([
        r / 2, h, Path.M,
        0, h, Path.C,
        w, 0, Path.C_,
        w - r / 2, 0, Path.C_,
      ]);
    }
    else if (quadrant == 4) {
      left = this.pointStart.x - r / 2;
      top = this.pointStart.y;

      this.path.set([
        r / 2, 0, Path.M,
        r * 0.8, 0, Path.C,
        w - r * 0.8, h, Path.C_,
        w - r / 2, h, Path.C_,
      ]);
    }

    this.svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

    this.svg.setStyle({
      width: w + "px",
      height: h + "px",
    });

    this.setStyle({
      left: left + "px",
      top: top + "px",
    });
  }

  set(index: number, x: number, y: number) {
    if (index == 0) {
      this.pointStart.set(x, y);
    }
    else {
      this.pointEnd.set(x, y);
    }

    this.update();
  }
}

/**下拉选择 */
export class Select extends Group {
  constructor() {
    super();
    this.setTag("select");

    this.setStyle({
      "outline": "none"
    })

    this.$el.addEventListener("change", () => {
      this.event.emit("select", {
        value: this.$el.value
      })
    })
  }

  add(name: string, value: any = undefined) {
    this.appendChild(
      new CustomElement()
        .setTag("option")
        .setAttribute("value", value || name)
        .selfAuto((el) => {
          el.appendChild(
            new Text(name)
          )
        })
    )

    return this;
  }

  adds(arr: any[]) {
    arr.forEach(item => {
      this.add(item)
    });

    return this;
  }

  clearList() {
    this.$el.innerHTML = "";
  }

  setValue(value: any) {
    this.$el.value = value;
    return this;
  }

  getValue() {
    return this.$el.value;
  }
}

/**警告 */
export class Alert extends Group {
  constructor(msg = "", clickFun = new window.Function(), x = 0, y = 0) {
    super();
    setTimeout(() => {
      this.setStyle({
        "position": "absolute",
        "min-width": "150px",
        "height": "auto",
        "background": "#fff",
        "z-index": 3,
        "left": x + "px",
        "top": y + "px",
        "transform": "translate(-50%,-50%)",
        "padding": "20px 20px 0px 20px",
        "box-shadow": "0 0 10px #000",
        "border-radius": "8px"
      })
    })

    this.appendChild(
      new LinearLayout()
        .setColumn(LinearLayout.Direction.column)
        .appendChild(
          new Text("提示")
            .setStyle({
              "text-align": "center",
              "font-size": "12px"
            })
        )
        .appendChild(
          new Text(msg)
            .setStyle({
              "text-align": "center",
              "margin-top": "10px",
              "font-size": "13px"
            })
        )
        .appendChild(
          new LinearLayout()
            .setStyle({
              "margin-top": "10px",
              "font-size": "12px",
              "border-top": "solid 1px #aaa",
              "padding": "10px 0"
            })
            .appendChild(
              new Text("取消")
                .setStyle({
                  "flex": "1",
                  "text-align": "center",
                  "cursor": "pointer"
                })
                .selfAuto((el) => {
                  el.$el.addEventListener("click", () => {
                    this.close();
                    clickFun(false)
                  })
                })
            )
            .appendChild(
              new Text("确认")
                .setStyle({
                  "flex": "1",
                  "text-align": "center",
                  "cursor": "pointer"
                })
                .selfAuto((el) => {
                  el.$el.addEventListener("click", () => {
                    this.close();
                    clickFun(true)
                  })
                })
            )
        )
    );

    new KeyframesAnimation(this.$el)
      .Keyframes({
        time: 0,
        opacity: 0
      })
      .Keyframes({
        time: 1,
        opacity: 1
      })
      .start()
  }

  close() {
    new KeyframesAnimation(this.$el)
      .Keyframes({
        time: 0,
        opacity: 1
      })
      .Keyframes({
        time: 1,
        opacity: 0
      })
      .start()
      .onEnd = () => {
        this.removeTo();
      }
  }
}

/************************************* */
