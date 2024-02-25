import { LinearLayout } from "../element/layout";
import { GraphNodeLayout } from "../graph_node_layout";
import { GraphNode } from "./BaseNode";

import { Svg, Text } from "../element/Element";
import { Alert } from "../element/group";
import { LinkNodeAnyEntry, LinkNodeNumberEntry, LinkNodeNumberOutput, LinkNodeObjectOutput, LinkNodeStringEntry, LinkNodeStringOutput } from "../link_node";

export class StringBuilder extends GraphNode {
  static alias = "字符串构造器";
  left: any;
  varList: { [k: string]: any } = {};
  index = 0;
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(false, false);

    const { container, left, right } = this.container_left_right();
    this.appendChild(container);
    this.left = left;

    this.appendChild(
      new LinearLayout()
        .setStyle({ "padding": "10px" })
        .justifyContent("flex-start")
        .appendChild(
          new Text("添加")
            .setStyle({ "font-size": "12px", "cursor": " pointer" })
            .selfAuto(el => {
              el.$el.addEventListener("click", () => {
                left.appendChild(this.createVariable(graphNodeLayout))
              })
            })
        )
    )

    right.selfAuto((el: any) => {
      const { linearLayout, text, linkNode } = this.text_linkNode(graphNodeLayout, "对象", LinkNodeStringOutput);
      right.setStyle({ "margin-left": "30px" });
      el.appendChild(linearLayout);
      linkNode.setLinkMaxCount(10000);
      linkNode.setAlias("returnOutput");
      this.setLinkNodeList("returnOutput", linkNode);
    })

  }

  createVariable(graphNodeLayout: GraphNodeLayout, vname: any = null) {
    const varName = vname || "var_" + this.index++;

    const obj = this.linkNode_input(graphNodeLayout, "", LinkNodeAnyEntry, varName)
    const linearLayout = new LinearLayout().setStyle({ "margin": "2.5px 0" });
    const linkNodeBoxOutput = obj.linkNode;

    linearLayout
      .alignItems()
      .appendChild(
        obj.linearLayout
      )
      .appendChild(
        new Svg()
          .selfAuto((el) => {
            el.$el.addEventListener("click", (e: PointerEvent) => {

              if (this.graphNodeLayout.alert) {
                this.graphNodeLayout.removeChild(this.graphNodeLayout.alert);
                this.graphNodeLayout.alert = null;
              }

              const infoG = this.graphNodeLayout.$el.getBoundingClientRect();
              const info = el.$el.getBoundingClientRect();

              this.graphNodeLayout.appendChild(
                new Alert("是否删除该变量", (b: boolean) => {
                  if (b) {
                    linkNodeBoxOutput.removeLines();
                    this.left.removeChild(linearLayout);
                    this.graphNodeLayout.alert = null;
                    delete this.varList[varName];
                    delete this.linkNodeValues[varName];
                  }
                }, info.left - infoG.left, info.top - infoG.top)
                  .selfAuto(el => {
                    this.graphNodeLayout.alert = el;
                  })
              );
            })
            el.setAttribute("viewBox", "0 0 1024 1024")
            el.setAttribute("fill", "#fff")
            el.setStyle({
              "width": "16px",
              "margin-left": "10px",
              "cursor": "pointer"
            })
            el.$el.innerHTML = `<path d="M810 274l-238 238 238 238-60 60-238-238-238 238-60-60 238-238-238-238 60-60 238 238 238-238z" p-id="2753"></path>`
          })
      )

    this.setLinkNodeList(varName, linkNodeBoxOutput);

    this.varList[varName] = varName;
    return linearLayout;
  }

  getData() {
    return {
      ...super.getData(),
      varList: Object.keys(this.varList),
      index: this.index
    }
  }

  setData(obj: { [k: string]: any; }): void {
    this.index = obj.index;
    obj.varList.forEach((item: string) => {
      this.left.appendChild(this.createVariable(this.graphNodeLayout, item));

      this.linkNodeList[item].input.$el.value = obj.linkNodeValues[item];
      this.linkNodeValues[item] = obj.linkNodeValues[item];

      delete obj.linkNodeValues[item];
    })

    Object.keys(obj.linkNodeValues).forEach((k) => {
      this.linkNodeList[k].input.$el.value = obj.linkNodeValues[k];
      this.linkNodeValues[k] = obj.linkNodeValues[k];
    })
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const parameter: any[] = [];
    const token = {
      type: "stringBuilder",
      parameter: parameter,
      uuid: this.uuid,
    }

    map.push(token);

    Object.keys(this.varList).forEach(k => {
      const i = token.parameter.length;
      token.parameter.push({
        name: k,
        defaultValue: this.linkNodeValues[k],
        value: null,
      });
      token.parameter[i].value = this.entryNode(k, map);
    });

    return { index, linkNodeAlias };
  }
}

// anchor
// at
export class StringAt extends GraphNode {
  static alias = "获取字符";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(false, false);

    const { container, left, right } = this.container_left_right();
    this.appendChild(container);

    left.selfAuto(() => {
      const target = this.linkNode_input(graphNodeLayout, "目标", LinkNodeStringEntry, "target");
      left.appendChild(target.linearLayout);

      const attrName = this.linkNode_input(graphNodeLayout, "下标", LinkNodeNumberEntry, "index");
      left.appendChild(attrName.linearLayout);
    });

    right.selfAuto(() => {
      const value = this.text_linkNode(graphNodeLayout, "字符", LinkNodeNumberOutput, "char");
      right.appendChild(value.linearLayout);
    });

  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "stringAt",
      uuid: this.uuid,
    }

    map.push(token);

    this.entryNodeTemplate(token, ["target", "index"], map);
    return index;
  }
}
// big
// blink
// bold
// charAt
export class StringCharAt extends GraphNode {
  static alias = "获取字符";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(false, false);

    const { container, left, right } = this.container_left_right();
    this.appendChild(container);

    left.selfAuto(() => {
      const target = this.linkNode_input(graphNodeLayout, "目标", LinkNodeStringEntry, "target");
      left.appendChild(target.linearLayout);

      const attrName = this.linkNode_input(graphNodeLayout, "下标", LinkNodeNumberEntry, "index");
      left.appendChild(attrName.linearLayout);
    });

    right.selfAuto(() => {
      const value = this.text_linkNode(graphNodeLayout, "字符", LinkNodeNumberOutput, "Unicode");
      right.appendChild(value.linearLayout);
    });

  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "stringCharAt",
      uuid: this.uuid,
    }

    map.push(token);

    this.entryNodeTemplate(token, ["target", "index"], map);
    return index;
  }
}
// charCodeAt
export class StringCharCodeAt extends GraphNode {
  static alias = "获取Unicode码";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(false, false);

    const { container, left, right } = this.container_left_right();
    this.appendChild(container);

    left.selfAuto(() => {
      const target = this.linkNode_input(graphNodeLayout, "目标", LinkNodeStringEntry, "target");
      left.appendChild(target.linearLayout);

      const attrName = this.linkNode_input(graphNodeLayout, "下标", LinkNodeNumberEntry, "index");
      left.appendChild(attrName.linearLayout);
    });

    right.selfAuto(() => {
      const value = this.text_linkNode(graphNodeLayout, "Unicode", LinkNodeNumberOutput, "Unicode");
      right.appendChild(value.linearLayout);
    });

  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "stringCharCodeAt",
      uuid: this.uuid,
    }

    map.push(token);

    this.entryNodeTemplate(token, ["target", "index"], map);
    return index;
  }
}

// codePointAt
// concat
// constructor
// endsWith
// fixed
// fontcolor
// fontsize
// includes
// indexOf
export class StringIndexOf extends GraphNode {
  static alias = "字符查找";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(false, false);

    const { container, left, right } = this.container_left_right();
    this.appendChild(container);

    left.selfAuto(() => {
      const target = this.linkNode_input(graphNodeLayout, "目标", LinkNodeStringEntry, "target");
      left.appendChild(target.linearLayout);

      const attrName = this.linkNode_input(graphNodeLayout, "查找字符", LinkNodeAnyEntry, "char");
      left.appendChild(attrName.linearLayout);
    });

    right.selfAuto(() => {
      const value = this.text_linkNode(graphNodeLayout, "索引", LinkNodeNumberOutput, "index");
      right.appendChild(value.linearLayout);
    });

  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "stringIndexOf",
      uuid: this.uuid,
    }

    map.push(token);

    this.entryNodeTemplate(token, ["target", "char"], map);
    return index;
  }
}
// isWellFormed
// italics
// lastIndexOf
// length
export class StringLength extends GraphNode {
  static alias = "字符串长度";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(false, false);

    const { container, left, right } = this.container_left_right();
    this.appendChild(container);

    left.selfAuto(() => {
      const target = this.linkNode_input(graphNodeLayout, "目标", LinkNodeStringEntry, "target");
      left.appendChild(target.linearLayout);
    });

    right.selfAuto(() => {
      const value = this.text_linkNode(graphNodeLayout, "长度", LinkNodeNumberOutput, "length");
      right.appendChild(value.linearLayout);
    });
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "stringLength",
      uuid: this.uuid,

      defaulltTarget: this.linkNodeValues.target,
      target: null,
    }

    map.push(token);

    token.target = this.entryNode("target", map);
    return { index, linkNodeAlias };
  }
}
// link
// localeCompare
// match
// matchAll
// normalize
// padEnd
// padStart
// repeat
// replace
// replaceAll
// search
// slice
// small
// split
// startsWith
// strike
// sub
// substr
// substring
// sup
// toLocaleLowerCase
// toLocaleUpperCase
// toLowerCase
// toString
// toUpperCase
// toWellFormed
// trim
// trimEnd
// trimLeft
// trimRight
// trimStart
// valueOf