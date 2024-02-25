// Keys,

import { LinearLayout } from "../element/layout";
import { GraphNodeLayout } from "../graph_node_layout";
import { LinkNodeAnyEntry, LinkNodeBooleanOutput, LinkNodeFunctionEntry, LinkNodeFunctionOutput, LinkNodeNumberOutput, LinkNodeObjectEntry, LinkNodeObjectOutput, LinkNodeStringEntry, LinkNodeStringOutput } from "../link_node";
import { GraphNode } from "./BaseNode";
import { Svg, Text } from "../element/Element";
import { Alert } from "../element/group";

// 对象属性获取节点属性
export class ObjectSet extends GraphNode {
  static alias = "设置对象属性";
  value_: any;
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setStyle({
        "padding": "10px",
        "justify-content": "flex-start",
        "align-items": "center"
      })
      .appendChild(
        new LinearLayout()
          .setStyle({ "justify-content": "space-between" })
          .setColumn(LinearLayout.Direction.column)
          .selfAuto(el => {
            const { linearLayout } = this.linkNode_input(graphNodeLayout, "目标对象", LinkNodeObjectEntry, "target");
            el.appendChild(linearLayout);
          })
          .selfAuto(el => {
            const { linearLayout } = this.linkNode_input(graphNodeLayout, "属性", LinkNodeStringEntry, "attrName");
            el.appendChild(linearLayout);
          })
          .selfAuto(el => {
            const { linearLayout } = this.linkNode_input(graphNodeLayout, "值", LinkNodeAnyEntry, "value");
            el.appendChild(linearLayout);
          })
      )
  }

  getData() {
    return {
      ...super.getData(),
      attrName: this.value_
    }
  }

  setData(obj: { [k: string]: any; }): void {
    super.setData(obj);
    this.value = obj.attrName;
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "objectSet",
      uuid: this.uuid,
      next: null,

      defaultTarget: this.linkNodeValues.target,
      target: null,

      defaultAttrName: this.linkNodeValues.attrName,
      attrName: null,

      defaultValue: this.linkNodeValues.value,
      value: null,
    }

    map.push(token);

    token.target = this.entryNode("target", map);
    token.attrName = this.entryNode("attrName", map);
    token.value = this.entryNode("value", map);

    token.next = this.outputNode("next", map);
    return index;
  }
}

// 对象属性获取节点属性
export class ObjectGet extends GraphNode {
  static alias = "获取对象属性";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(false, false);

    const { container, left, right } = this.container_left_right();
    this.appendChild(container);

    left.selfAuto(() => {
      const target = this.linkNode_input(graphNodeLayout, "目标", LinkNodeObjectEntry, "target");
      left.appendChild(target.linearLayout);

      const attrName = this.linkNode_input(graphNodeLayout, "属性", LinkNodeStringEntry, "attrName");
      left.appendChild(attrName.linearLayout);
    });

    right.selfAuto(() => {
      const value = this.text_linkNode(graphNodeLayout, "value", LinkNodeObjectOutput, "value");
      right.appendChild(value.linearLayout);
    });

  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "objectGet",
      uuid: this.uuid,
    }

    map.push(token);

    this.entryNodeTemplate(token, ["target", "attrName"], map);
    return index;
  }
}

// 对象函数调用
export class ObjectCallFunction extends GraphNode {
  static alias = "对象函数调用";
  left: any;
  varList: { [k: string]: any } = {};
  index = 0;
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    const { container, left, right } = this.container_left_right();
    this.appendChild(container);
    this.left = left;

    left.selfAuto(el => {
      const target = this.linkNode_input(graphNodeLayout, "目标", LinkNodeAnyEntry, "target");
      el.appendChild(target.linearLayout);

      const attr = this.linkNode_input(graphNodeLayout, "函数名", LinkNodeStringEntry, "attr");
      el.appendChild(attr.linearLayout);
    })

    right.selfAuto(el => {
      const { linearLayout, text, linkNode } = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeObjectOutput, "return");
      right.setStyle({ "margin-left": "30px" });
      el.appendChild(linearLayout);
      linkNode.setLinkMaxCount(10000);
    })

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

  getToken(map: any[]) {
    const index = super.getToken(map);

    const parameter: any[] = [];
    const token = {
      type: "objectCallFunction",
      defaultFunName: this.linkNodeValues.value,
      next: null,
      parameter: parameter,
      uuid: this.uuid
    }

    map.push(token);

    this.entryNodeTemplate(token, ["target", "attr"], map);

    Object.keys(this.varList).forEach(k => {
      const i = token.parameter.length;
      token.parameter.push({
        name: k,
        defaultValue: this.linkNodeValues[k],
        value: null,
      });
      token.parameter[i].value = this.entryNode(k, map);
    });

    token.next = this.outputNode("next", map);

    return index;
  }
}

// 对象字符串
export class ObjectGetString extends GraphNode {
  static alias = "对象上获取字符串";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(false, false);

    const { container, left, right } = this.container_left_right();
    this.appendChild(container);

    left.selfAuto(() => {
      const target = this.linkNode_input(graphNodeLayout, "目标", LinkNodeObjectEntry, "target");
      left.appendChild(target.linearLayout);

      const attrName = this.linkNode_input(graphNodeLayout, "属性", LinkNodeStringEntry, "attrName");
      left.appendChild(attrName.linearLayout);
    });

    right.selfAuto(() => {
      const value = this.text_linkNode(graphNodeLayout, "value", LinkNodeStringOutput, "value");
      right.appendChild(value.linearLayout);
    });

  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "objectGetString",
      uuid: this.uuid,
    }

    map.push(token);

    this.entryNodeTemplate(token, ["target", "attrName"], map);
    return index;
  }
}

// 对象布尔值
export class ObjectGetBoolean extends GraphNode {
  static alias = "对象上获取布尔值";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(false, false);

    const { container, left, right } = this.container_left_right();
    this.appendChild(container);

    left.selfAuto(() => {
      const target = this.linkNode_input(graphNodeLayout, "目标", LinkNodeObjectEntry, "target");
      left.appendChild(target.linearLayout);

      const attrName = this.linkNode_input(graphNodeLayout, "属性", LinkNodeStringEntry, "attrName");
      left.appendChild(attrName.linearLayout);
    });

    right.selfAuto(() => {
      const value = this.text_linkNode(graphNodeLayout, "value", LinkNodeBooleanOutput, "value");
      right.appendChild(value.linearLayout);
    });

  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "objectGetBoolean",
      uuid: this.uuid,
    }

    map.push(token);

    this.entryNodeTemplate(token, ["target", "attrName"], map);
    return index;
  }
}

// 对象数值
export class ObjectGetNumber extends GraphNode {
  static alias = "对象上获取布尔值";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(false, false);

    const { container, left, right } = this.container_left_right();
    this.appendChild(container);

    left.selfAuto(() => {
      const target = this.linkNode_input(graphNodeLayout, "目标", LinkNodeObjectEntry, "target");
      left.appendChild(target.linearLayout);

      const attrName = this.linkNode_input(graphNodeLayout, "属性", LinkNodeStringEntry, "attrName");
      left.appendChild(attrName.linearLayout);
    });

    right.selfAuto(() => {
      const value = this.text_linkNode(graphNodeLayout, "value", LinkNodeNumberOutput, "value");
      right.appendChild(value.linearLayout);
    });

  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "objectGetNumber",
      uuid: this.uuid,
    }

    map.push(token);

    this.entryNodeTemplate(token, ["target", "attrName"], map);
    return index;
  }
}

// 对象函数
export class ObjectGetFunction extends GraphNode {
  static alias = "对象上获取函数";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(false, false);

    const { container, left, right } = this.container_left_right();
    this.appendChild(container);

    left.selfAuto(() => {
      const target = this.linkNode_input(graphNodeLayout, "目标", LinkNodeObjectEntry, "target");
      left.appendChild(target.linearLayout);

      const attrName = this.linkNode_input(graphNodeLayout, "属性", LinkNodeStringEntry, "attrName");
      left.appendChild(attrName.linearLayout);
    });

    right.selfAuto(() => {
      const value = this.text_linkNode(graphNodeLayout, "value", LinkNodeFunctionOutput, "value");
      right.appendChild(value.linearLayout);
    });
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "objectGetFunction",
      uuid: this.uuid,
    }

    map.push(token);

    this.entryNodeTemplate(token, ["target", "attrName"], map);
    return index;
  }
}