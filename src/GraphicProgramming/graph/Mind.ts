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

// 创建新的思维导图
export class NewMind extends GraphNode {
  static alias = "新建思维导图";

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
      type: "newMind",
      next: null,
      uuid: this.uuid,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    return index;
  }
}

// 增加子节点
export class AddSubNode extends GraphNode {
  static alias = "增加子节点";

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

    const input_1 = this.linkNode_text(graphNodeLayout, "思维导图", LinkNodeObjectEntry, "defaultInput_1");
    const input_2 = this.linkNode_input(graphNodeLayout, "文字", LinkNodeStringEntry, "defaultInput_2");

    lin_0.appendChild(input_1.linearLayout).appendChild(input_2.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "addSubNode",
      next: null,
      uuid: this.uuid,

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

// 增加兄弟节点
export class AddBroNode extends GraphNode {
  static alias = "增加兄弟节点";

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

    const input_1 = this.linkNode_text(graphNodeLayout, "思维导图", LinkNodeObjectEntry, "defaultInput_1");
    const input_2 = this.linkNode_input(graphNodeLayout, "文字", LinkNodeStringEntry, "defaultInput_2");

    lin_0.appendChild(input_1.linearLayout).appendChild(input_2.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "addBroNode",
      next: null,
      uuid: this.uuid,

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

// 删除节点
export class DelNode extends GraphNode {
  static alias = "删除节点";

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

    const input_1 = this.linkNode_text(graphNodeLayout, "思维导图", LinkNodeObjectEntry, "defaultInput_1");

    lin_0.appendChild(input_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "delNode",
      next: null,
      uuid: this.uuid,

      input_1: null,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    token.input_1 = this.entryNode("defaultInput_1", map);
    return index;
  }
}

// 获取激活节点的 uid
export class GetNodeUid extends GraphNode {
  static alias = "获取激活节点";

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
    const input_1 = this.linkNode_text(graphNodeLayout, "思维导图", LinkNodeObjectEntry, "defaultInput_1");

    lin_0.appendChild(output_1.linearLayout).appendChild(input_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "getNodeUid",
      next: null,
      uuid: this.uuid,

      input_1: null,
    }

    map.push(token);

    token.next = this.outputNode("next", map);

    token.input_1 = this.entryNode("defaultInput_1", map);
    return index;
  }
}

// 提供 uid 获取指定节点的相关信息 (查找节点) 父节点、子节点列表、数据、节点层级
export class GetNodeInfo extends GraphNode {
  static alias = "获取节点信息";

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
    const input_1 = this.linkNode_text(graphNodeLayout, "思维导图", LinkNodeObjectEntry, "defaultInput_1");
    const input_2 = this.linkNode_text(graphNodeLayout, "节点uid", LinkNodeStringEntry, "defaultInput_2");

    lin_0.appendChild(output_1.linearLayout)
      .appendChild(input_1.linearLayout)
      .appendChild(input_2.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "getNodeInfo",
      next: null,
      uuid: this.uuid,

      input_1: null,
      input_2: null,
    }

    map.push(token);

    token.next = this.outputNode("next", map);

    token.input_1 = this.entryNode("defaultInput_1", map);
    token.input_2 = this.entryNode("defaultInput_2", map);
    return index;
  }
}

// 修改节点
export class ChangeNode extends GraphNode {
  static alias = "修改节点";

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

    const input_1 = this.linkNode_text(graphNodeLayout, "思维导图", LinkNodeObjectEntry, "defaultInput_1");
    const input_2 = this.linkNode_input(graphNodeLayout, "文字", LinkNodeStringEntry, "defaultInput_2");

    lin_0.appendChild(input_1.linearLayout).appendChild(input_2.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "changeNode",
      next: null,
      uuid: this.uuid,

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

// 待开发节点
// 激活指定节点 先清空激活节点列表
// 导出 json
// 导入 json
// 导出 xmind
// 导入 md
// 导出 md