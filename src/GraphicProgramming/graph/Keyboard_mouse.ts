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
  LinkNodeArrayOutput,
  LinkNodeArrayEntry,
  LinkNodeObjectEntry,
  LinkNodeObjectOutput,
  LinkNodeStringEntry,
  LinkNodeStringOutput,
} from "../link_node";
import { Input, Text, Svg } from "../element/Element";
import { Select, Alert } from "../element/group";
import { openDialog } from '../../utils/index'

// 点击
export class Click extends GraphNode {
  static alias = "点击";

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

    const input_1 = this.linkNode_input(graphNodeLayout, "屏幕位置", LinkNodeStringEntry, "defaultInput_1");
    // const input_1 = this.linkNode_input(graphNodeLayout, "点击次数", LinkNodeAnyEntry, "defaultInput_1");
    // const input_1 = this.linkNode_input(graphNodeLayout, "点击按钮", LinkNodeAnyEntry, "defaultInput_1");
    // const input_1 = this.linkNode_input(graphNodeLayout, "连点间隔时间", LinkNodeAnyEntry, "defaultInput_1");

    lin_0.appendChild(input_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "click",
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

// 获取控件ID 暂未实现
// export class GetControlId extends GraphNode {
//   static alias = "获取控件ID";

//   constructor(graphNodeLayout: GraphNodeLayout) {
//     super(graphNodeLayout);

//     const lin_0 = new LinearLayout()
//       .selfAuto((el => this.push(el)))
//       .setColumn(LinearLayout.Direction.column)
//       .setStyle({
//         "padding": "10px",
//         "justify-content": "flex-start",
//       })
//     this.appendChild(lin_0)

//     const title = new Text(GetControlId.alias).setFontSize("12px").setStyle({ "margin": "0 10px", "display": "flex", "justify-content": "center" })
//     const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeObjectOutput, "output_1")
//     const input_1 = this.linkNode_input(graphNodeLayout, "屏幕位置", LinkNodeAnyEntry, "defaultInput_1");
//     lin_0.appendChild(title).appendChild(output_1.linearLayout).appendChild(input_1.linearLayout)
//   }

//   getToken(map: any[]) {
//     const index = super.getToken(map);
//     const token = {
//       type: "getControlId",
//       next: null,
//       uuid: this.uuid,

//       defaultInput_1: this.linkNodeValues.defaultInput_1,
//       input_1: null,
//     }

//     map.push(token);

//     token.next = this.outputNode("next", map);
//     token.input_1 = this.entryNode("defaultInput_1", map);
//     return index;
//   }
// }

// 输入文字
export class InputWord extends GraphNode {
  static alias = "输入文字";

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

    const input_1 = this.linkNode_input(graphNodeLayout, "文本", LinkNodeStringEntry, "defaultInput_1");

    lin_0.appendChild(input_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "inputWord",
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

// 输入按键
export class InputKey extends GraphNode {
  static alias = "输入按键";

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

    const input_1 = this.linkNode_input(graphNodeLayout, "文本", LinkNodeStringEntry, "defaultInput_1");

    lin_0.appendChild(input_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "inputKey",
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

// 鼠标手势 暂未实现
// 录制鼠标动作，包括点击、长按
// export class MouseGestures extends GraphNode {
//   static alias = "鼠标手势";

//   constructor(graphNodeLayout: GraphNodeLayout) {
//     super(graphNodeLayout);
//     this.initTitle_LinkPoint();
//     const lin_0 = new LinearLayout()
//       .selfAuto((el => this.push(el)))
//       .setColumn(LinearLayout.Direction.column)
//       .setStyle({
//         "padding": "10px",
//         "justify-content": "flex-start",
//       })
//     this.appendChild(lin_0)
//   }

//   getToken(map: any[]) {
//     const index = super.getToken(map);
//     const token = {
//       type: "createVar",
//       next: null,
//       uuid: this.uuid,
//     }

//     map.push(token);

//     token.next = this.outputNode("next", map);

//     return index;
//   }
// }

// 获取鼠标处信息
// 鼠标位置、鼠标所处位置的颜色、所处窗口标题、pid
export class GetMouseInfo extends GraphNode {
  static alias = "获取鼠标处信息";

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
      type: "getMouseInfo",
      next: null,
      uuid: this.uuid,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    return index;
  }
}

// 移动鼠标
export class MoveMouse extends GraphNode {
  static alias = "移动鼠标";

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

    const input_1 = this.linkNode_input(graphNodeLayout, "位置", LinkNodeAnyEntry, "defaultInput_1");
    lin_0.appendChild(input_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "moveMouse",
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

// 获取屏幕中指定图片的中心位置
export class PictureCenter extends GraphNode {
  static alias = "图片中心坐标";

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
    
    const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeArrayOutput, "output_1")
    const input_1 = this.linkNode_input(graphNodeLayout, "文件路径", LinkNodeStringEntry, "defaultInput_1");

    lin_0.appendChild(output_1.linearLayout).appendChild(input_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "pictureCenter",
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

// 提供控件 id ，返回控件信息
// 操作控件
// 鼠标拖动