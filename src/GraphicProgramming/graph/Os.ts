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

// 关机、重启、休眠、锁屏
export class Shutdown extends GraphNode {
  static alias = "关机";
  static select_1 = "shutdown"

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

    const option = {
      "关机": "shutdown",
      "重启": "restart",
      "休眠": "sleep",
    }
    const list = Object.keys(option)
    const select_1 = new Select()
      .adds(list)
      .setValue(list[0])
      .on("select", (el) => {
        Shutdown.select_1 = option[el.value]
      })
    const text = new Text("关机/重启/休眠")
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

    lin_0.appendChild(lin_1);
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "shutdown",
      next: null,
      uuid: this.uuid,

      select_1: Shutdown.select_1,
    }

    map.push(token);
    token.next = this.outputNode("next", map);
    return index;
  }
}

// 系统通知
export class Notice extends GraphNode {
  static alias = "通知";

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

    const input_1 = this.linkNode_input(graphNodeLayout, "通知内容", LinkNodeStringEntry, "defaultInput_1");
    const input_2 = this.linkNode_input(graphNodeLayout, "标题", LinkNodeStringEntry, "defaultInput_2");

    lin_0.appendChild(input_1.linearLayout).appendChild(input_2.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "notice",
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

// 获取时间
export class GetTime extends GraphNode {
  static alias = "获取当前时间";

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
      type: "getTime",
      next: null,
      uuid: this.uuid,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    return index;
  }
}

// 获取磁盘信息
export class GetDiskInfo extends GraphNode {
  static alias = "获取磁盘信息";

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
      type: "getDiskInfo",
      next: null,
      uuid: this.uuid,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    return index;
  }
}

// 获取系统信息
export class GetOsInfo extends GraphNode {
  static alias = "获取系统信息";

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
      type: "getOsInfo",
      next: null,
      uuid: this.uuid,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    return index;
  }
}

// 音量调节
export class VolumeCtrl extends GraphNode {
  static alias = "音量调节";

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

    const input_1 = this.linkNode_input(graphNodeLayout, "音量", LinkNodeStringEntry, "defaultInput_1");

    lin_0.appendChild(input_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "volumeCtrl",
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
