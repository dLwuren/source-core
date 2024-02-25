import { LinearLayout } from "../element/layout";
import { GraphNode } from "./BaseNode";
import { GraphNodeLayout } from "../graph_node_layout";

import {
  LinkNode,
  LinkNodeAnyEntry,
  LinkNodeBooleanEntry,
  LinkNodeBooleanOutput,
  LinkNodeNext,
  LinkNodeNumberEntry,
  LinkNodeNumberOutput,
  LinkNodeArrayEntry,
  LinkNodeArrayOutput,
  LinkNodeObjectEntry,
  LinkNodeObjectOutput,
  LinkNodeStringEntry,
  LinkNodeStringOutput,
} from "../link_node";
import { Input, Text, Svg } from "../element/Element";
import { Select, Alert } from "../element/group";

import { openDialog } from '../../utils/index'

// 数据类型
export class Typeof extends GraphNode {
  static alias = "数据类型";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    const lin_0 = new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setColumn(LinearLayout.Direction.column)
      .setStyle({
        "padding": "10px",
        "justify-content": "flex-start",
      })
    this.appendChild(lin_0)

    const title = new Text(Typeof.alias).setFontSize("12px").setStyle({ "margin": "0 10px", "display": "flex", "justify-content": "center" })
    const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeStringOutput, "output_1")
    const input_1 = this.linkNode_input(graphNodeLayout, "输入值", LinkNodeAnyEntry, "defaultInput_1");
    lin_0.appendChild(title).appendChild(output_1.linearLayout).appendChild(input_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "typeof",
      next: null,
      uuid: this.uuid,

      defaultInput_1: this.linkNodeValues.defaultInput_1,
      input_1: null,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    token.input_1 = this.entryNode("defaultInput_1", map);
    return index;
  }
}

// 创建数字
export class NumCreate extends GraphNode {
  static alias = "创建数字";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);
    this.initTitle_LinkPoint();
    const lin_0 = new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setColumn(LinearLayout.Direction.column)
      .setStyle({
        "padding": "10px",
        "justify-content": "flex-start",
      })
    this.appendChild(lin_0)

    const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeNumberOutput, "output_1")
    const input_1 = this.linkNode_input(graphNodeLayout, "数字", LinkNodeNumberEntry, "defaultInput_1");

    lin_0.appendChild(output_1.linearLayout).appendChild(input_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "numCreate",
      next: null,
      uuid: this.uuid,

      output_1: null,
      defaultInput_1: this.linkNodeValues.defaultInput_1,
      input_1: null,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    token.output_1 = this.outputNode("output_1", map);
    token.input_1 = this.entryNode("defaultInput_1", map);
    return index;
  }
}

// 数字转文字
export class NumToStr extends GraphNode {
  static alias = "数字转文字";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    const lin_0 = new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setColumn(LinearLayout.Direction.column)
      .setStyle({
        "padding": "10px",
        "justify-content": "flex-start",
      })
    this.appendChild(lin_0)

    const title = new Text(NumToStr.alias).setFontSize("12px").setStyle({ "margin": "0 10px", "display": "flex", "justify-content": "center" })
    const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeStringOutput, "output_1")
    const input_1 = this.linkNode_input(graphNodeLayout, "数字", LinkNodeNumberEntry, "defaultInput_1");

    lin_0.appendChild(title).appendChild(output_1.linearLayout).appendChild(input_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "numToStr",
      next: null,
      uuid: this.uuid,

      output_1: null,
      defaultInput_1: this.linkNodeValues.defaultInput_1,
      input_1: null,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    token.output_1 = this.outputNode("output_1", map);
    token.input_1 = this.entryNode("defaultInput_1", map);
    return index;
  }
}

// 创建文字
export class StrCreate extends GraphNode {
  static alias = "创建文字";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);
    this.initTitle_LinkPoint();
    const lin_0 = new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setColumn(LinearLayout.Direction.column)
      .setStyle({
        "padding": "10px",
        "justify-content": "flex-start",
      })
    this.appendChild(lin_0)

    const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeStringOutput, "output_1")
    const input_1 = this.linkNode_input(graphNodeLayout, "文字", LinkNodeStringEntry, "defaultInput_1");

    lin_0.appendChild(output_1.linearLayout).appendChild(input_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "strCreate",
      next: null,
      uuid: this.uuid,

      output_1: null,
      defaultInput_1: this.linkNodeValues.defaultInput_1,
      input_1: null,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    token.output_1 = this.outputNode("output_1", map);
    token.input_1 = this.entryNode("defaultInput_1", map);
    return index;
  }
}

// 文字转数字
export class StrToNum extends GraphNode {
  static alias = "文字转数字";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    const lin_0 = new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setColumn(LinearLayout.Direction.column)
      .setStyle({
        "padding": "10px",
        "justify-content": "flex-start",
      })
    this.appendChild(lin_0)

    const title = new Text(StrToNum.alias).setFontSize("12px").setStyle({ "margin": "0 10px", "display": "flex", "justify-content": "center" })
    const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeNumberOutput, "output_1")
    const input_1 = this.linkNode_input(graphNodeLayout, "文字", LinkNodeStringEntry, "defaultInput_1");

    lin_0.appendChild(title).appendChild(output_1.linearLayout).appendChild(input_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "strToNum",
      next: null,
      uuid: this.uuid,

      output_1: null,
      defaultInput_1: this.linkNodeValues.defaultInput_1,
      input_1: null,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    token.output_1 = this.outputNode("output_1", map);
    token.input_1 = this.entryNode("defaultInput_1", map);
    return index;
  }
}

// 创建数组
export class ArrCreate extends GraphNode {
  static alias = "创建数组";
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
      const { linearLayout, text, linkNode } = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeArrayOutput);
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
                new Alert("是否删除该项", (b: boolean) => {
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
      type: "arrCreate",
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

// 数组 增加 1 项
export class ArrAdd extends GraphNode {
  static alias = "数组增加1项";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    const lin_0 = new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setColumn(LinearLayout.Direction.column)
      .setStyle({
        "padding": "10px",
        "justify-content": "flex-start",
      })
    this.appendChild(lin_0)

    const title = new Text(ArrAdd.alias).setFontSize("12px").setStyle({ "margin": "0 10px", "display": "flex", "justify-content": "center" })
    const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeArrayOutput, "output_1")
    const input_1 = this.linkNode_text(graphNodeLayout, "原数组", LinkNodeArrayEntry, "defaultInput_1");
    const input_2 = this.linkNode_input(graphNodeLayout, "增加内容", LinkNodeAnyEntry, "defaultInput_2");

    lin_0.appendChild(title)
      .appendChild(output_1.linearLayout)
      .appendChild(input_1.linearLayout)
      .appendChild(input_2.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "arrAdd",
      next: null,
      uuid: this.uuid,

      output_1: null,
      defaultInput_1: this.linkNodeValues.defaultInput_1,
      input_1: null,
      defaultInput_2: this.linkNodeValues.defaultInput_2,
      input_2: null,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    token.output_1 = this.outputNode("output_1", map);
    token.input_1 = this.entryNode("defaultInput_1", map);
    token.input_2 = this.entryNode("defaultInput_2", map);
    return index;
  }
}

// 数组 删除 1 项
export class ArrDel extends GraphNode {
  static alias = "数组删除1项";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    const lin_0 = new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setColumn(LinearLayout.Direction.column)
      .setStyle({
        "padding": "10px",
        "justify-content": "flex-start",
      })
    this.appendChild(lin_0)

    const title = new Text(ArrDel.alias).setFontSize("12px").setStyle({ "margin": "0 10px", "display": "flex", "justify-content": "center" })
    const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeArrayOutput, "output_1")
    const input_1 = this.linkNode_text(graphNodeLayout, "原数组", LinkNodeArrayEntry, "defaultInput_1");
    const input_2 = this.linkNode_input(graphNodeLayout, "索引", LinkNodeNumberEntry, "defaultInput_2");

    lin_0.appendChild(title)
      .appendChild(output_1.linearLayout)
      .appendChild(input_1.linearLayout)
      .appendChild(input_2.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "arrDel",
      next: null,
      uuid: this.uuid,

      output_1: null,
      defaultInput_1: this.linkNodeValues.defaultInput_1,
      input_1: null,
      defaultInput_2: this.linkNodeValues.defaultInput_2,
      input_2: null,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    token.output_1 = this.outputNode("output_1", map);
    token.input_1 = this.entryNode("defaultInput_1", map);
    token.input_2 = this.entryNode("defaultInput_2", map);
    return index;
  }
}

// 数组 查找 1 项
export class ArrGet extends GraphNode {
  static alias = "数组获取1项";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    const lin_0 = new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setColumn(LinearLayout.Direction.column)
      .setStyle({
        "padding": "10px",
        "justify-content": "flex-start",
      })
    this.appendChild(lin_0)

    const title = new Text(ArrGet.alias).setFontSize("12px").setStyle({ "margin": "0 10px", "display": "flex", "justify-content": "center" })
    const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeStringOutput, "output_1")
    const input_1 = this.linkNode_text(graphNodeLayout, "原数组", LinkNodeArrayEntry, "defaultInput_1");
    const input_2 = this.linkNode_input(graphNodeLayout, "索引", LinkNodeNumberEntry, "defaultInput_2");

    lin_0.appendChild(title)
      .appendChild(output_1.linearLayout)
      .appendChild(input_1.linearLayout)
      .appendChild(input_2.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "arrGet",
      next: null,
      uuid: this.uuid,

      output_1: null,
      defaultInput_1: this.linkNodeValues.defaultInput_1,
      input_1: null,
      defaultInput_2: this.linkNodeValues.defaultInput_2,
      input_2: null,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    token.output_1 = this.outputNode("output_1", map);
    token.input_1 = this.entryNode("defaultInput_1", map);
    token.input_2 = this.entryNode("defaultInput_2", map);
    return index;
  }
}

// 数组 修改 1 项
export class ArrChange extends GraphNode {
  static alias = "数组修改1项";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    const lin_0 = new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setColumn(LinearLayout.Direction.column)
      .setStyle({
        "padding": "10px",
        "justify-content": "flex-start",
      })
    this.appendChild(lin_0)

    const title = new Text(ArrChange.alias).setFontSize("12px").setStyle({ "margin": "0 10px", "display": "flex", "justify-content": "center" })
    const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeArrayOutput, "output_1")
    const input_1 = this.linkNode_text(graphNodeLayout, "原数组", LinkNodeArrayEntry, "defaultInput_1");
    const input_2 = this.linkNode_input(graphNodeLayout, "索引", LinkNodeNumberEntry, "defaultInput_2");
    const input_3 = this.linkNode_input(graphNodeLayout, "修改内容", LinkNodeAnyEntry, "defaultInput_3");

    lin_0.appendChild(title)
      .appendChild(output_1.linearLayout)
      .appendChild(input_1.linearLayout)
      .appendChild(input_2.linearLayout)
      .appendChild(input_3.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "arrChange",
      next: null,
      uuid: this.uuid,

      output_1: null,
      defaultInput_1: this.linkNodeValues.defaultInput_1,
      input_1: null,
      defaultInput_2: this.linkNodeValues.defaultInput_2,
      input_2: null,
      defaultInput_3: this.linkNodeValues.defaultInput_3,
      input_3: null,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    token.output_1 = this.outputNode("output_1", map);
    token.input_1 = this.entryNode("defaultInput_1", map);
    token.input_2 = this.entryNode("defaultInput_2", map);
    token.input_3 = this.entryNode("defaultInput_3", map);
    return index;
  }
}

// 对象 增加 1 项
export class ObjAdd extends GraphNode {
  static alias = "对象增加1项";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    const lin_0 = new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setColumn(LinearLayout.Direction.column)
      .setStyle({
        "padding": "10px",
        "justify-content": "flex-start",
      })
    this.appendChild(lin_0)

    const title = new Text(ObjAdd.alias).setFontSize("12px").setStyle({ "margin": "0 10px", "display": "flex", "justify-content": "center" })
    const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeObjectOutput, "output_1")
    const input_1 = this.linkNode_text(graphNodeLayout, "原对象", LinkNodeObjectEntry, "defaultInput_1");
    const input_2 = this.linkNode_input(graphNodeLayout, "键", LinkNodeAnyEntry, "defaultInput_2");
    const input_3 = this.linkNode_input(graphNodeLayout, "值", LinkNodeAnyEntry, "defaultInput_3");

    lin_0.appendChild(title)
      .appendChild(output_1.linearLayout)
      .appendChild(input_1.linearLayout)
      .appendChild(input_2.linearLayout)
      .appendChild(input_3.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "objAdd",
      next: null,
      uuid: this.uuid,

      output_1: null,
      defaultInput_1: this.linkNodeValues.defaultInput_1,
      input_1: null,
      defaultInput_2: this.linkNodeValues.defaultInput_2,
      input_2: null,
      defaultInput_3: this.linkNodeValues.defaultInput_3,
      input_3: null,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    token.output_1 = this.outputNode("output_1", map);
    token.input_1 = this.entryNode("defaultInput_1", map);
    token.input_2 = this.entryNode("defaultInput_2", map);
    token.input_3 = this.entryNode("defaultInput_3", map);
    return index;
  }
}

// 对象 删除 1 项
export class ObjDel extends GraphNode {
  static alias = "对象删除1项";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);
    this.initTitle_LinkPoint();
    const lin_0 = new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setColumn(LinearLayout.Direction.column)
      .setStyle({
        "padding": "10px",
        "justify-content": "flex-start",
      })
    this.appendChild(lin_0)

    const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeObjectOutput, "output_1")
    const input_1 = this.linkNode_text(graphNodeLayout, "原对象", LinkNodeObjectEntry, "defaultInput_1");
    const input_2 = this.linkNode_input(graphNodeLayout, "键", LinkNodeAnyEntry, "defaultInput_2");

    lin_0.appendChild(output_1.linearLayout)
      .appendChild(input_1.linearLayout)
      .appendChild(input_2.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "objDel",
      next: null,
      uuid: this.uuid,

      output_1: null,
      defaultInput_1: this.linkNodeValues.defaultInput_1,
      input_1: null,
      defaultInput_2: this.linkNodeValues.defaultInput_2,
      input_2: null,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    token.output_1 = this.outputNode("output_1", map);
    token.input_1 = this.entryNode("defaultInput_1", map);
    token.input_2 = this.entryNode("defaultInput_2", map);
    return index;
  }
}

// 对象 查找 1 项
export class ObjGet extends GraphNode {
  static alias = "对象获取1项";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    const lin_0 = new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setColumn(LinearLayout.Direction.column)
      .setStyle({
        "padding": "10px",
        "justify-content": "flex-start",
      })
    this.appendChild(lin_0)

    const title = new Text(ObjGet.alias).setFontSize("12px").setStyle({ "margin": "0 10px", "display": "flex", "justify-content": "center" })
    const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeStringOutput, "output_1")
    const input_1 = this.linkNode_text(graphNodeLayout, "原对象", LinkNodeObjectEntry, "defaultInput_1");
    const input_2 = this.linkNode_input(graphNodeLayout, "键", LinkNodeAnyEntry, "defaultInput_2");

    lin_0.appendChild(title)
      .appendChild(output_1.linearLayout)
      .appendChild(input_1.linearLayout)
      .appendChild(input_2.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "objGet",
      next: null,
      uuid: this.uuid,

      output_1: null,
      defaultInput_1: this.linkNodeValues.defaultInput_1,
      input_1: null,
      defaultInput_2: this.linkNodeValues.defaultInput_2,
      input_2: null,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    token.output_1 = this.outputNode("output_1", map);
    token.input_1 = this.entryNode("defaultInput_1", map);
    token.input_2 = this.entryNode("defaultInput_2", map);
    return index;
  }
}

// 对象 修改 1 项
export class ObjChange extends GraphNode {
  static alias = "对象修改1项";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);
    this.initTitle_LinkPoint();
    const lin_0 = new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setColumn(LinearLayout.Direction.column)
      .setStyle({
        "padding": "10px",
        "justify-content": "flex-start",
      })
    this.appendChild(lin_0)

    const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeObjectOutput, "output_1")
    const input_1 = this.linkNode_text(graphNodeLayout, "原对象", LinkNodeObjectEntry, "defaultInput_1");
    const input_2 = this.linkNode_input(graphNodeLayout, "键", LinkNodeAnyEntry, "defaultInput_2");
    const input_3 = this.linkNode_input(graphNodeLayout, "值", LinkNodeAnyEntry, "defaultInput_3");

    lin_0.appendChild(output_1.linearLayout)
      .appendChild(input_1.linearLayout)
      .appendChild(input_2.linearLayout)
      .appendChild(input_3.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "objChange",
      next: null,
      uuid: this.uuid,

      output_1: null,
      defaultInput_1: this.linkNodeValues.defaultInput_1,
      input_1: null,
      defaultInput_2: this.linkNodeValues.defaultInput_2,
      input_2: null,
      defaultInput_3: this.linkNodeValues.defaultInput_3,
      input_3: null,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    token.output_1 = this.outputNode("output_1", map);
    token.input_1 = this.entryNode("defaultInput_1", map);
    token.input_2 = this.entryNode("defaultInput_2", map);
    token.input_3 = this.entryNode("defaultInput_3", map);
    return index;
  }
}
