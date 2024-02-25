import { LinearLayout } from "../element/layout";
import { GraphNode } from "./BaseNode";
import { GraphNodeLayout } from "../graph_node_layout";

import {
  LinkNode,
  LinkNodeAnyEntry,
  LinkNodeBooleanOutput,
  LinkNodeNext,
  LinkNodeNumberEntry,
  LinkNodeNumberOutput,
  LinkNodeObjectEntry,
  LinkNodeObjectOutput,
  LinkNodeStringEntry,
  LinkNodeStringOutput,
} from "../link_node";
import { Input, Text, Svg } from "../element/Element";
import { Select, Alert } from "../element/group";

import { openDialog } from '../../utils/index'


// 打开应用
// 2；指定路径、最大化/最小化/隐藏运行
export class OpenApplication extends GraphNode {
  static alias = "打开应用";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);
    // 初始化标题
    this.initTitle_LinkPoint(true, true)

    // 自定义内容
    new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setColumn(LinearLayout.Direction.column)
      .setStyle({
        "padding": "10px",
        "justify-content": "flex-start",
      })
      .selfAuto(el => {
        const path = this.linkNode_input(graphNodeLayout, "应用路径", LinkNodeStringEntry, "pathValue");
        el.appendChild(path.linearLayout);

        const option = {
          "正常": "",
          "最大化": "Max",
          "最小化": "Min",
          "隐藏运行": "Hide",
        }
        const state = this.linkNode_select(graphNodeLayout, "打开模式", option, LinkNodeStringEntry, "stateValue");
        // el.appendChild(state.linearLayout);
      })
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "openApplication",
      next: null,
      uuid: this.uuid,

      defaultPath: this.linkNodeValues.pathValue,
      path: null,

      defaultState: this.linkNodeValues.stateValue,
      state: null,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    token.path = this.entryNode("pathValue", map);
    token.state = this.entryNode("stateValue", map);
    return index;
  }
}

// 打开网页
export class OpenUrl extends GraphNode {
  static alias = "打开网页";

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

    const input_1 = this.linkNode_input(graphNodeLayout, "网址", LinkNodeStringEntry, "defaultInput_1");

    lin_0.appendChild(input_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "openUrl",
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

// 创建应用快捷方式(.lnk) 快捷方式名字可以添加后缀 目标路径支持本地文件、网址
export class CreateShortcut extends GraphNode {
  static alias = "创建快捷方式";

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

    const input_1 = this.linkNode_input(graphNodeLayout, "快捷方式名字", LinkNodeStringEntry, "defaultInput_1");
    const input_2 = this.linkNode_input(graphNodeLayout, "目标路径", LinkNodeStringEntry, "defaultInput_2");
    const input_3 = this.linkNode_input(graphNodeLayout, "生成位置", LinkNodeStringEntry, "defaultInput_3");
    lin_0.appendChild(input_1.linearLayout).appendChild(input_2.linearLayout).appendChild(input_3.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "createShortcut",
      next: null,
      uuid: this.uuid,

      defaultInput_1: this.linkNodeValues.defaultInput_1,
      input_1: null,
      defaultInput_2: this.linkNodeValues.defaultInput_2,
      input_2: null,
      defaultInput_3: this.linkNodeValues.defaultInput_3,
      input_3: null,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    token.input_1 = this.entryNode("defaultInput_1", map);
    token.input_2 = this.entryNode("defaultInput_2", map);
    token.input_3 = this.entryNode("defaultInput_3", map);
    return index;
  }
}

// 获取所有应用 id
export class AllWinId extends GraphNode {
  static alias = "获取所有窗口id";

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
    lin_0.appendChild(output_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "allWinId",
      next: null,
      uuid: this.uuid,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    return index;
  }
}

// 获取当前应用 id
export class CurWinId extends GraphNode {
  static alias = "获取当前窗口id";

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
    lin_0.appendChild(output_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "curWinId",
      next: null,
      uuid: this.uuid,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    return index;
  }
}

// 提供 id 获取应用属性、获取应用信息
export class WinInfo extends GraphNode {
  static alias = "获取窗口信息";

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
    const input_1 = this.linkNode_text(graphNodeLayout, "窗口id", LinkNodeNumberEntry, "defaultInput_1");

    lin_0.appendChild(output_1.linearLayout).appendChild(input_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "winInfo",
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

// 调整窗口透明度
export class Transparency extends GraphNode {
  static alias = "调整窗口透明度";

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

    const input_1 = this.linkNode_text(graphNodeLayout, "窗口id", LinkNodeNumberEntry, "defaultInput_1");
    const input_2 = this.linkNode_input(graphNodeLayout, "透明度", LinkNodeNumberEntry, "defaultInput_2");

    lin_0.appendChild(input_1.linearLayout).appendChild(input_2.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "transparency",
      next: null,
      uuid: this.uuid,

      defaultInput_1: this.linkNodeValues.defaultInput_1,
      input_1: null,
      defaultInput_2: this.linkNodeValues.defaultInput_2,
      input_2: null,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    token.input_1 = this.entryNode("defaultInput_1", map);
    token.input_2 = this.entryNode("defaultInput_2", map);

    return index;
  }
}

// 提供 id ，将对应窗口变为活动状态
export class ChangeWin extends GraphNode {
  static alias = "切换窗口";

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

    const input_1 = this.linkNode_text(graphNodeLayout, "窗口id", LinkNodeNumberEntry, "defaultInput_1");

    lin_0.appendChild(input_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "changeWin",
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

// 提供 id ，将对应窗口最大化、最小化、置顶、关闭
export class WinState extends GraphNode {
  static alias = "改变窗口状态";
  static select_1 = "normal"

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

    const input_1 = this.linkNode_text(graphNodeLayout, "窗口id", LinkNodeNumberEntry, "defaultInput_1");

    const option = {
      "原窗口状态": "normal",
      "最小化": "min",
      "最大化": "max",
      "关闭": "close",
      "打开/取消置顶": "pin",
    }
    const list = Object.keys(option)
    const select_1 = new Select()
      .adds(list)
      .setValue(list[0])
      .on("select", (el) => {
        WinState.select_1 = option[el.value]
      })
    const text = new Text("窗口状态")
      .setFontSize("12px")
      .setStyle({
        "margin": "0 10px",
        "display": "flex",
        "flex-direction": "row",
        "justify-content": "flex-start"
      });
    const lin_1 = new LinearLayout()
      .setStyle({ "margin": "2.5px 0" })
      .alignItems()
      .appendChild(select_1)
      .appendChild(text);

    lin_0.appendChild(input_1.linearLayout).appendChild(lin_1);
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "winState",
      next: null,
      uuid: this.uuid,

      defaultInput_1: this.linkNodeValues.defaultInput_1,
      input_1: null,
      select_1: WinState.select_1,
    }

    map.push(token);
    token.next = this.outputNode("next", map);
    token.input_1 = this.entryNode("defaultInput_1", map);
    return index;
  }
}

// 激活上一个窗口
export class PrevWin extends GraphNode {
  static alias = "激活上一个窗口";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);
    this.initTitle_LinkPoint();
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "prevWin",
      next: null,
      uuid: this.uuid,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    return index;
  }
}