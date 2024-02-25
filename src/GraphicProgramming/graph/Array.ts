import { LinearLayout } from "../element/layout";
import { GraphNode } from "./BaseNode";
import { GraphNodeLayout } from "../graph_node_layout";
import {
  LinkNodeAnyEntry,
  LinkNodeBooleanOutput,
  LinkNodeNext,
  LinkNodeArrayEntry,
  LinkNodeNumberEntry,
  LinkNodeNumberOutput,
  LinkNodeObjectEntry,
  LinkNodeObjectOutput,
  LinkNodeStringEntry,
  LinkNodeStringOutput,
  LinkNodeArrayOutput,
} from "../link_node";
import { Svg, Text } from "../element/Element";
import { Alert } from "../element/group";


// export const moduleName = "Array";

export class ArrayLength extends GraphNode {
  static alias = "数组长度";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setStyle({
        "padding": "10px",
        "justify-content": " space-between",
        "align-items": "center"
      })
      .appendChild(
        new LinearLayout()
          .setColumn(LinearLayout.Direction.column)
          .selfAuto(el => {
            const { linearLayout } = this.linkNode_input(graphNodeLayout, "目标", LinkNodeAnyEntry, "target");
            el.appendChild(linearLayout);
          })
      )
      .selfAuto((el) => {
        const { linearLayout, linkNode } = this.text_linkNode(graphNodeLayout, "长度", LinkNodeNumberOutput);
        el.appendChild(linearLayout);
        this.setLinkNodeList("value", linkNode);

        linearLayout.setStyle({
          "margin-left": "20px"
        })
        linkNode.setLinkMaxCount(10000).setAlias("valueOutput");
      })
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "length",
      uuid: this.uuid,

      defaulltTarget: this.linkNodeValues.target,
      target: null,
    }

    map.push(token);

    token.target = this.entryNode("target", map);
    return { index, linkNodeAlias };
  }
}

export class IsArray extends GraphNode {
  static alias = "是数组";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setStyle({
        "padding": "10px",
        "justify-content": " space-between",
        "align-items": "center"
      })
      .appendChild(
        new LinearLayout()
          .setColumn(LinearLayout.Direction.column)
          .selfAuto(el => {
            const { linearLayout } = this.linkNode_input(graphNodeLayout, "目标", LinkNodeAnyEntry, "target");
            el.appendChild(linearLayout);
          })
      )
      .selfAuto((el) => {
        const { linearLayout, linkNode } = this.text_linkNode(graphNodeLayout, "是数组", LinkNodeBooleanOutput);
        el.appendChild(linearLayout);
        this.setLinkNodeList("value", linkNode);

        linearLayout.setStyle({
          "margin-left": "20px"
        })
        linkNode.setLinkMaxCount(10000).setAlias("valueOutput");
      })
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "isArray",
      uuid: this.uuid,

      defaulltTarget: this.linkNodeValues.target,
      target: null
    }

    map.push(token);

    token.target = this.entryNode("target", map);
    return { index, linkNodeAlias };
  }
}

// get,set,push,pop,splice,foreach
export class ArrayGet extends GraphNode {
  static alias = "获取";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle();

    new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setStyle({
        "padding": "10px",
        "justify-content": " space-between",
        "align-items": "center"
      })
      .appendChild(
        new LinearLayout()
          .setColumn(LinearLayout.Direction.column)
          .selfAuto(el => {
            const { linearLayout } = this.linkNode_input(graphNodeLayout, "数组", LinkNodeArrayEntry, "target");
            el.appendChild(linearLayout);
          })
          .selfAuto(el => {
            const { linearLayout } = this.linkNode_input(graphNodeLayout, "下标", LinkNodeNumberEntry, "index");
            el.appendChild(linearLayout);
          })
      )
      .appendChild(
        new LinkNodeObjectOutput(graphNodeLayout)
          .setStyle({
            "margin-left": "20px"
          })
          .setIsNext(false)
          .setAlias("value")
          .setLinkMaxCount(10000)
          .selfAuto((el: any) => {
            this.setLinkNodeList("valueOutput", el);
          })
      )
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "get",
      uuid: this.uuid,

      defaulltTarget: this.linkNodeValues.target,
      target: null,

      defaulltIndex: this.linkNodeValues.index,
      index: null
    }

    map.push(token);

    token.target = this.entryNode("target", map);
    token.index = this.entryNode("index", map);
    return { index, linkNodeAlias };
  }
}

export class ArraySet extends GraphNode {
  static alias = "设置";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setStyle({
        "padding": "10px",
        "justify-content": " space-between",
        "align-items": "center"
      })
      .appendChild(
        new LinearLayout()
          .setColumn(LinearLayout.Direction.column)
          .selfAuto(el => {
            const { linearLayout } = this.linkNode_input(graphNodeLayout, "数组", LinkNodeObjectEntry, "target");
            el.appendChild(linearLayout);
          })
          .selfAuto(el => {
            const { linearLayout } = this.linkNode_input(graphNodeLayout, "下标", LinkNodeNumberEntry, "index");
            el.appendChild(linearLayout);
          })
          .selfAuto(el => {
            const { linearLayout } = this.linkNode_input(graphNodeLayout, "值", LinkNodeAnyEntry, "value");
            el.appendChild(linearLayout);
          })
      )
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "set",
      uuid: this.uuid,
      next: null,

      defaulltTarget: this.linkNodeValues.target,
      target: null,

      defaulltIndex: this.linkNodeValues.index,
      index: null,

      defaulltValue: this.linkNodeValues.value,
      value: null
    }

    map.push(token);

    token.target = this.entryNode("target", map);
    token.index = this.entryNode("index", map);
    token.value = this.entryNode("value", map);

    token.next = this.outputNode("next", map);
    return index;
  }
}

export class ArrayPush extends GraphNode {
  static alias = "入栈";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setStyle({
        "padding": "10px",
        "justify-content": " space-between",
        "align-items": "center"
      })
      .appendChild(
        new LinearLayout()
          .setColumn(LinearLayout.Direction.column)
          .selfAuto(el => {
            const { linearLayout } = this.linkNode_input(graphNodeLayout, "数组", LinkNodeObjectEntry, "target");
            el.appendChild(linearLayout);
          })
          .selfAuto(el => {
            const { linearLayout } = this.linkNode_input(graphNodeLayout, "值", LinkNodeAnyEntry, "value");
            el.appendChild(linearLayout);
          })
      )
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "push",
      uuid: this.uuid,
      next: null,

      defaulltTarget: this.linkNodeValues.target,
      target: null,

      defaulltValue: this.linkNodeValues.value,
      value: null
    }

    map.push(token);

    token.target = this.entryNode("target", map);
    token.value = this.entryNode("value", map);

    token.next = this.outputNode("next", map);
    return index;
  }
}

export class ArrayPop extends GraphNode {
  static alias = "出栈";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setStyle({
        "padding": "10px",
        "justify-content": " space-between",
        "align-items": "center"
      })
      .appendChild(
        new LinearLayout()
          .setColumn(LinearLayout.Direction.column)
          .selfAuto(el => {
            const { linearLayout } = this.linkNode_input(graphNodeLayout, "数组", LinkNodeObjectEntry, "target");
            el.appendChild(linearLayout);
          })
      )
      .appendChild(
        new LinkNodeObjectOutput(graphNodeLayout)
          .setStyle({
            "margin-left": "20px"
          })
          .setAlias("value")
          .setLinkMaxCount(10000)
          .selfAuto((el: any) => {
            this.setLinkNodeList("valueOutput", el);
          })
      )
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "pop",
      uuid: this.uuid,
      next: null,

      defaulltTarget: this.linkNodeValues.target,
      target: null,
    }

    map.push(token);

    token.target = this.entryNode("target", map);

    token.next = this.outputNode("next", map);
    return index;
  }
}

export class ArrayForeach extends GraphNode {
  static alias = "Foreach循环";
  variableName_: any;
  variableValue_: any;
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setStyle({
        "padding": "10px",
        "justify-content": " space-around",
      })
      .appendChild(
        new LinearLayout()
          .setStyle({ "justify-content": "space-between" })
          .setColumn(LinearLayout.Direction.column)
          .selfAuto(el => {
            const { linearLayout, input } = this.linkNode_input(graphNodeLayout, "目标", LinkNodeObjectEntry, "target");
            el.appendChild(linearLayout);
          })
      )
      .appendChild(
        new LinearLayout()
          .setStyle({ "margin-left": "20px", "justify-content": "space-between" })
          .setColumn(LinearLayout.Direction.column)
          .appendChild(
            new LinearLayout()
              .setStyle({ "justify-content": "space-between", "align-items": "center" })
              .appendChild(
                new Text("循环体")
                  .setStyle({
                    "font-size": "12px",
                    "margin-right": "10px"
                  })
              )
              .appendChild(
                new LinkNodeNext(graphNodeLayout)
                  .setAlias("forBody")
                  .setIsNext(false)
                  .setLinkMaxCount(10000)
                  .selfAuto((el: any) => {
                    this.setLinkNodeList("forBody", el);
                  })
              )

          )
          .appendChild(
            new LinearLayout()
              .setStyle({ "justify-content": "space-between", "margin-top": "20px", "align-items": "center" })
              .appendChild(
                new Text("值")
                  .setStyle({
                    "font-size": "12px"
                  })
              )
              .appendChild(
                new LinkNodeObjectOutput(graphNodeLayout)
                  .setAlias("value")
                  .setIsNext(false)
                  .setLinkMaxCount(10000)
                  .selfAuto((el: any) => {
                    this.setLinkNodeList("valueOutput", el);
                  })
              )

          )
          .appendChild(
            new LinearLayout()
              .setStyle({ "justify-content": "space-between", "align-items": "center" })
              .appendChild(
                new Text("索引")
                  .setStyle({
                    "font-size": "12px"
                  })
              )
              .appendChild(
                new LinkNodeNumberOutput(graphNodeLayout)
                  .setAlias("index")
                  .setIsNext(false)
                  .setLinkMaxCount(10000)
                  .selfAuto((el: any) => {
                    this.setLinkNodeList("indexOutput", el);
                  })
              )

          )
      )
  }

  getData() {
    return {
      ...super.getData(),
      variableName: this.variableName,
      variableValue: this.variableValue,
    }
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "foreach",
      uuid: this.uuid,
      next: null,

      defaulltTarget: this.linkNodeValues.target,
      target: null,

      forBody: null,
    }

    map.push(token);

    token.target = this.entryNode("target", map);
    token.forBody = this.outputNode("forBody", map);
    token.next = this.outputNode("next", map);
    return index;
  }
}

// ArrayFill
export class ArrayFill extends GraphNode {
  static alias = "填充";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setStyle({
        "padding": "10px",
        "justify-content": "space-between",
        "align-items": "center"
      })
      .appendChild(
        new LinearLayout()
          .setColumn(LinearLayout.Direction.column)
          .selfAuto(el => {
            const { linearLayout } = this.linkNode_input(graphNodeLayout, "目标", LinkNodeObjectEntry, "target");
            el.appendChild(linearLayout);
          })
          .selfAuto(el => {
            const { linearLayout } = this.linkNode_input(graphNodeLayout, "填充值", LinkNodeAnyEntry, "value");
            el.appendChild(linearLayout);
          })
      )
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "fill",
      uuid: this.uuid,
      next: null,

      defaulltTarget: this.linkNodeValues.target,
      target: null,

      defaulltValue: this.linkNodeValues.value,
      value: null,
    }

    map.push(token);

    token.target = this.entryNode("target", map);
    token.value = this.entryNode("value", map);

    token.next = this.outputNode("next", map);
    return index;
  }
}

// Array
export class GArray extends GraphNode {
  static alias = "数组";
  left: any;
  varList: { [k: string]: any } = {};
  index = 0;
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

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
      const { linearLayout, text, linkNode } = this.text_linkNode(graphNodeLayout, "对象", LinkNodeArrayOutput);
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
      type: "array",
      parameter: parameter,
      uuid: this.uuid,

      next: null
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

    token.next = this.outputNode("next", map);

    return index;
  }
}

// at
export class ArrayAt extends ArrayGet {
  static alias = "获取";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);
  }
}
// concat 合并元素
// copyWithin: target,start,end 赋值元素
// entries
// every
// filter
export class ArrayFilter extends GraphNode {
  static alias = "过滤";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    const { left, container, right } = this.container_left_right();

    this.appendChild(container);

    left.selfAuto(el => {
      const target = this.linkNode_input(graphNodeLayout, "数组", LinkNodeObjectEntry, "target");
      el.appendChild(target.linearLayout);
    })

    right.selfAuto(el => {
      const returnv = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeNumberOutput, "returnv");
      el.appendChild(returnv.linearLayout);
      returnv.linearLayout.setStyle({ "margin-bottom": "20px" })

      const target = this.text_linkNode(graphNodeLayout, "循环体", LinkNodeNext, "forBody");
      el.appendChild(target.linearLayout);

      const value = this.text_linkNode(graphNodeLayout, "值", LinkNodeObjectOutput, "value");
      el.appendChild(value.linearLayout);

      const index = this.text_linkNode(graphNodeLayout, "索引", LinkNodeNumberOutput, "index");
      el.appendChild(index.linearLayout);

      const array = this.text_linkNode(graphNodeLayout, "数组", LinkNodeObjectOutput, "array");
      el.appendChild(array.linearLayout);
    })
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "arrayFilter",
      uuid: this.uuid,
      next: null,

      forBody: null,
    }

    map.push(token);

    this.entryNodeTemplate(token, ["target"], map);

    token.forBody = this.outputNode("forBody", map);
    token.next = this.outputNode("next", map);
    return index;
  }
}
// find
// findIndex
// findLast
// findLastIndex
// flat
// flatMap
// includes
// indexOf
export class ArrayIndexOf extends GraphNode {
  static alias = "查找";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    const { left, container, right } = this.container_left_right();

    this.appendChild(container);

    left.selfAuto(el => {
      const target = this.linkNode_input(graphNodeLayout, "数组", LinkNodeObjectEntry, "target");
      el.appendChild(target.linearLayout);

      const value = this.linkNode_input(graphNodeLayout, "连接符", LinkNodeObjectEntry, "value");
      el.appendChild(value.linearLayout);
    })

    right.selfAuto(el => {
      const re_value = this.text_linkNode(graphNodeLayout, "", LinkNodeNumberOutput, "re_value");
      el.appendChild(re_value.linearLayout);
    })

  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "arrayIndexOf",
      uuid: this.uuid,
      next: null,
    }

    map.push(token);

    this.entryNodeTemplate(token, ["target", "value"], map);
    token.next = this.outputNode("next", map);

    return index;
  }
}
// join
export class ArrayJoin extends GraphNode {
  static alias = "获取";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    const { left, container, right } = this.container_left_right();

    this.appendChild(container);

    left.selfAuto(el => {
      const target = this.linkNode_input(graphNodeLayout, "数组", LinkNodeObjectEntry, "target");
      el.appendChild(target.linearLayout);

      const code = this.linkNode_input(graphNodeLayout, "连接符", LinkNodeStringEntry, "code");
      el.appendChild(code.linearLayout);
    })

    right.selfAuto(el => {
      const value = this.text_linkNode(graphNodeLayout, "", LinkNodeStringOutput, "value");
      el.appendChild(value.linearLayout);
    })

  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "join",
      uuid: this.uuid,
      next: null,
    }

    map.push(token);

    this.entryNodeTemplate(token, ["target", "code"], map);
    token.next = this.outputNode("next", map);

    return index;
  }
}
// keys
// lastIndexOf
// map
export class ArrayMap extends GraphNode {
  static alias = "Map";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    const { left, container, right } = this.container_left_right();

    this.appendChild(container);

    left.selfAuto(el => {
      const target = this.linkNode_input(graphNodeLayout, "数组", LinkNodeObjectEntry, "target");
      el.appendChild(target.linearLayout);
    })

    right.selfAuto(el => {
      const returnv = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeNumberOutput, "returnv");
      el.appendChild(returnv.linearLayout);
      returnv.linearLayout.setStyle({ "margin-bottom": "20px" })

      const target = this.text_linkNode(graphNodeLayout, "循环体", LinkNodeNext, "forBody");
      el.appendChild(target.linearLayout);

      const value = this.text_linkNode(graphNodeLayout, "值", LinkNodeObjectOutput, "value");
      el.appendChild(value.linearLayout);

      const index = this.text_linkNode(graphNodeLayout, "索引", LinkNodeNumberOutput, "index");
      el.appendChild(index.linearLayout);

      const array = this.text_linkNode(graphNodeLayout, "数组", LinkNodeObjectOutput, "array");
      el.appendChild(array.linearLayout);
    })
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "arrayMap",
      uuid: this.uuid,
      next: null,

      forBody: null,
    }

    map.push(token);

    this.entryNodeTemplate(token, ["target"], map);

    token.forBody = this.outputNode("forBody", map);
    token.next = this.outputNode("next", map);
    return index;
  }
}
// reduce
// reduceRight
// reverse
// shift
// slice
export class ArraySlice extends GraphNode {
  static alias = "切片";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    const { left, container, right } = this.container_left_right();

    this.appendChild(container);

    left.selfAuto(el => {
      const target = this.linkNode_input(graphNodeLayout, "数组", LinkNodeObjectEntry, "target");
      el.appendChild(target.linearLayout);

      const start = this.linkNode_input(graphNodeLayout, "开始", LinkNodeNumberEntry, "start");
      el.appendChild(start.linearLayout);

      const end = this.linkNode_input(graphNodeLayout, "结束", LinkNodeNumberEntry, "end");
      el.appendChild(end.linearLayout);
    })

    right.selfAuto(el => {
      const value = this.text_linkNode(graphNodeLayout, "", LinkNodeStringOutput, "value");
      el.appendChild(value.linearLayout);
    })

  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "arraySlice",
      uuid: this.uuid,
      next: null,
    }

    map.push(token);

    this.entryNodeTemplate(token, ["target", "start", "end"], map);
    token.next = this.outputNode("next", map);

    return index;
  }
}
// some
// sort
export class ArraySort extends GraphNode {
  static alias = "排序";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    const { left, container, right } = this.container_left_right();

    this.appendChild(container);

    left.selfAuto(el => {
      const target = this.linkNode_input(graphNodeLayout, "数组", LinkNodeObjectEntry, "target");
      el.appendChild(target.linearLayout);
    })

    right.selfAuto(el => {
      const returnv = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeNumberOutput, "returnv");
      el.appendChild(returnv.linearLayout);
      returnv.linearLayout.setStyle({ "margin-bottom": "20px" })

      const target = this.text_linkNode(graphNodeLayout, "回调函数", LinkNodeNext, "funBody");
      el.appendChild(target.linearLayout);

      const value = this.text_linkNode(graphNodeLayout, "a", LinkNodeNumberOutput, "a");
      el.appendChild(value.linearLayout);

      const index = this.text_linkNode(graphNodeLayout, "b", LinkNodeNumberOutput, "b");
      el.appendChild(index.linearLayout);
    })
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "arraySort",
      uuid: this.uuid,
      next: null,

      funBody: null,
    }

    map.push(token);

    this.entryNodeTemplate(token, ["target"], map);

    token.funBody = this.outputNode("funBody", map);
    token.next = this.outputNode("next", map);
    return index;
  }
}

// splice
export class ArraySplice extends GraphNode {
  static alias = "splice";
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
      const target = this.linkNode_input(graphNodeLayout, "数组", LinkNodeObjectEntry, "target");
      el.appendChild(target.linearLayout);

      const index = this.linkNode_input(graphNodeLayout, "下标", LinkNodeObjectEntry, "index");
      el.appendChild(index.linearLayout);

      const deleteCount = this.linkNode_input(graphNodeLayout, "删除数量", LinkNodeNumberEntry, "deleteCount");
      el.appendChild(deleteCount.linearLayout);
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

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const parameter: any[] = [];
    const token = {
      type: "arraySplice",
      parameter: parameter,
      uuid: this.uuid,

      next: null
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

    this.entryNodeTemplate(token, ["target", "index", "deleteCount"], map);

    token.next = this.outputNode("next", map);

    return index;
  }
}
// toLocaleString
// toReversed
// toSorted
// toSpliced
// toString
// unshift
// values
// with
// values
