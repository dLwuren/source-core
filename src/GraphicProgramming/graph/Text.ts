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
  LinkNodeArrayOutput
} from "../link_node";
import { Input, Text, Svg } from "../element/Element";
import { Select, Alert } from "../element/group";

import { openDialog } from '../../utils/index'

// 替换文字
export class ReplaceText extends GraphNode {
  static alias = "替换文字";

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

  const title = new Text(ReplaceText.alias).setFontSize("12px").setStyle({ "margin": "0 10px", "display": "flex", "justify-content": "center" })
  const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeStringOutput, "output_1")
  const input_1 = this.linkNode_input(graphNodeLayout, "原文", LinkNodeStringEntry, "defaultInput_1");
  const input_2 = this.linkNode_input(graphNodeLayout, "需替换文字", LinkNodeStringEntry, "defaultInput_2");
  const input_3 = this.linkNode_input(graphNodeLayout, "替换成", LinkNodeStringEntry, "defaultInput_3");
  lin_0.appendChild(title)
    .appendChild(output_1.linearLayout)
    .appendChild(input_1.linearLayout)
    .appendChild(input_2.linearLayout)
    .appendChild(input_3.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "replaceText",
      value: null,
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

// 连接文字
export class ConnectionText extends GraphNode {
  static alias = "连接文字";

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

    const title = new Text(ConnectionText.alias).setFontSize("12px").setStyle({ "margin": "0 10px", "display": "flex", "justify-content": "center" })
    const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeStringOutput, "output_1")
    const input_1 = this.linkNode_input(graphNodeLayout, "文本1", LinkNodeStringEntry, "defaultInput_1");
    const input_2 = this.linkNode_input(graphNodeLayout, "文本2", LinkNodeStringEntry, "defaultInput_2");
    const input_3 = this.linkNode_input(graphNodeLayout, "文本3", LinkNodeStringEntry, "defaultInput_3");
    lin_0.appendChild(title)
      .appendChild(output_1.linearLayout)
      .appendChild(input_1.linearLayout)
      .appendChild(input_2.linearLayout)
      .appendChild(input_3.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "connectionText",
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

// 分割文本
// 提供分隔符，会根据分隔符分隔文本，返回一个数组
export class SplitText extends GraphNode {
  static alias = "分割文本";

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

    const title = new Text(SplitText.alias).setFontSize("12px").setStyle({ "margin": "0 10px", "display": "flex", "justify-content": "center" })
    const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeArrayOutput, "output_1")
    const input_1 = this.linkNode_input(graphNodeLayout, "文本", LinkNodeStringEntry, "defaultInput_1");
    const input_2 = this.linkNode_input(graphNodeLayout, "分割符", LinkNodeStringEntry, "defaultInput_2");
    
    lin_0.appendChild(title)
      .appendChild(output_1.linearLayout)
      .appendChild(input_1.linearLayout)
      .appendChild(input_2.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "splitText",
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

// 获取子字符串
// 截取原文本的从第n个到第m个的字符，作为新的字符
export class SubText extends GraphNode {
  static alias = "获取子字符串";

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

    const title = new Text(SubText.alias).setFontSize("12px").setStyle({ "margin": "0 10px", "display": "flex", "justify-content": "center" })
    const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeStringOutput, "output_1")
    const input_1 = this.linkNode_input(graphNodeLayout, "文本", LinkNodeStringEntry, "defaultInput_1");
    const input_2 = this.linkNode_input(graphNodeLayout, "从第n个字符开始", LinkNodeNumberEntry, "defaultInput_2");
    const input_3 = this.linkNode_input(graphNodeLayout, "到第m个字符结束", LinkNodeNumberEntry, "defaultInput_3");

    lin_0.appendChild(title)
      .appendChild(output_1.linearLayout)
      .appendChild(input_1.linearLayout)
      .appendChild(input_2.linearLayout)
      .appendChild(input_3.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "subText",
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

// 文字长度
export class TextLength extends GraphNode {
  static alias = "文字长度";

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

    const title = new Text(TextLength.alias).setFontSize("12px").setStyle({ "margin": "0 10px", "display": "flex", "justify-content": "center" })
    const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeNumberOutput, "output_1")
    const input_1 = this.linkNode_input(graphNodeLayout, "文本", LinkNodeStringEntry, "defaultInput_1");
    
    lin_0.appendChild(title)
      .appendChild(output_1.linearLayout)
      .appendChild(input_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "textLength",
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

// 删除指定数量的文本
export class DelText extends GraphNode {
  static alias = "删除文本";

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

    const input_1 = this.linkNode_input(graphNodeLayout, "删除字数", LinkNodeNumberEntry, "defaultInput_1");

    lin_0.appendChild(input_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "delText",
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

// 输入文本 弃用
// export class InputText extends GraphNode {
//   static alias = "输入文本";

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

//     const input_1 = this.linkNode_input(graphNodeLayout, "文本", LinkNodeAnyEntry, "defaultInput_1");

//     lin_0.appendChild(input_1.linearLayout)
//   }

//   getToken(map: any[]) {
//     const index = super.getToken(map);
//     const token = {
//       type: "inputText",
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

// 写入剪贴板
export class WToClipboard extends GraphNode {
  static alias = "写入剪贴板";

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
      type: "wToClipboard",
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

// 清空剪贴板(删除当前可粘贴的内容)
export class ClearClipboard extends GraphNode {
  static alias = "清空剪贴板";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);
    this.initTitle_LinkPoint();
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "clearClipboard",
      next: null,
      uuid: this.uuid,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    return index;
  }
}

// 获取剪贴板内容
export class GetClipboard extends GraphNode {
  static alias = "获取剪贴板";

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
    
    lin_0.appendChild(output_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "getClipboard",
      next: null,
      uuid: this.uuid,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    return index;
  }
}

// 获取选中文字
export class GetSelectedText extends GraphNode {
  static alias = "获取选中文字";

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
    
    lin_0.appendChild(output_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "getSelectedText",
      next: null,
      uuid: this.uuid,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    return index;
  }
}

// 正则表达式 暂不实现
// export class RegEx extends GraphNode {
//   static alias = "正则表达式";

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

//     const title = new Text(RegEx.alias).setFontSize("12px").setStyle({ "margin": "0 10px", "display": "flex", "justify-content": "center" })
//     const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeObjectOutput, "output_1")
//     const input_1 = this.linkNode_input(graphNodeLayout, "文本", LinkNodeAnyEntry, "defaultInput_1");
//     const input_2 = this.linkNode_input(graphNodeLayout, "正则表达式", LinkNodeAnyEntry, "defaultInput_2");
    
//     lin_0.appendChild(title)
//       .appendChild(output_1.linearLayout)
//       .appendChild(input_1.linearLayout)
//       .appendChild(input_2.linearLayout)
//   }

//   getToken(map: any[]) {
//     const index = super.getToken(map);
//     const token = {
//       type: "regEx",
//       next: null,
//       uuid: this.uuid,

//       defaultInput_1: this.linkNodeValues.defaultInput_1,
//       input_1: null,
//       defaultInput_2: this.linkNodeValues.defaultInput_2,
//       input_2: null,
//     }

//     map.push(token);

//     token.next = this.outputNode("next", map);
//     token.input_1 = this.entryNode("defaultInput_1", map);
//     token.input_2 = this.entryNode("defaultInput_2", map);
//     return index;
//   }
// }

// 语音识别 暂不实现
// 翻译文字 暂不实现
// 文字对比 filestools 库的file_diff_compare方法 https://blog.csdn.net/cainiao_python/article/details/120299861