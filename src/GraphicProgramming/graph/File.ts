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

// 写入文件
export class WriteFile extends GraphNode {
  static alias = "写文件";

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

    const input_1 = this.linkNode_input(graphNodeLayout, "文件路径", LinkNodeStringEntry, "defaultInput_1");
    const input_2 = this.linkNode_input(graphNodeLayout, "内容", LinkNodeStringEntry, "defaultInput_2");

    lin_0.appendChild(input_1.linearLayout)
    lin_0.appendChild(input_2.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "writeFile",
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

// 读文件
export class ReadFile extends GraphNode {
  static alias = "读文件";

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
    const input_1 = this.linkNode_input(graphNodeLayout, "文件路径", LinkNodeStringEntry, "defaultInput_1");

    lin_0.appendChild(output_1.linearLayout).appendChild(input_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "readFile",
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

