// 变量赋值
// 算数运算****************************************

import { GraphNodeLayout } from "../graph_node_layout";
import { LinkNodeNumberEntry, LinkNodeNumberOutput } from "../link_node";
import { GraphNode } from "./BaseNode";

// 加法
export class Add extends GraphNode {
  static alias = "+ 加法";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle();

    const { left, container, right } = this.container_left_right();

    this.appendChild(container);

    left.selfAuto(el => {
      const value1 = this.linkNode_input(graphNodeLayout, "值1", LinkNodeNumberEntry, "value1");
      el.appendChild(value1.linearLayout);

      const value2 = this.linkNode_input(graphNodeLayout, "值2", LinkNodeNumberEntry, "value2");
      el.appendChild(value2.linearLayout);
    })

    right.selfAuto(el => {
      const returnv = this.text_linkNode(graphNodeLayout, "", LinkNodeNumberOutput, "value");
      el.appendChild(returnv.linearLayout);
    })

  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);
    const token = {
      uuid: this.uuid,
      type: "add",
      defaultValue1: this.linkNodeValues.value1,
      defaultValue2: this.linkNodeValues.value2,
      value1: null,
      value2: null,
    }

    map.push(token);

    token.value1 = this.entryNode("value1", map);
    token.value2 = this.entryNode("value2", map);
    return { index, linkNodeAlias };
  }
}

// 减法
export class Sub extends GraphNode {
  static alias = "- 减法";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle();

    const { left, container, right } = this.container_left_right();

    this.appendChild(container);

    left.selfAuto(el => {
      const value1 = this.linkNode_input(graphNodeLayout, "值1", LinkNodeNumberEntry, "value1");
      el.appendChild(value1.linearLayout);

      const value2 = this.linkNode_input(graphNodeLayout, "值2", LinkNodeNumberEntry, "value2");
      el.appendChild(value2.linearLayout);
    })

    right.selfAuto(el => {
      const returnv = this.text_linkNode(graphNodeLayout, "", LinkNodeNumberOutput, "value");
      el.appendChild(returnv.linearLayout);
    })

  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);
    const token = {
      uuid: this.uuid,
      type: "sub",
      defaultValue1: this.linkNodeValues.value1,
      defaultValue2: this.linkNodeValues.value2,
      value1: null,
      value2: null,
    }
    map.push(token);

    token.value1 = this.entryNode("value1", map);
    token.value2 = this.entryNode("value2", map);
    return { index, linkNodeAlias };
  }
}

// 乘法
export class Multiplication extends GraphNode {
  static alias = "* 乘法";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle();

    const { left, container, right } = this.container_left_right();

    this.appendChild(container);

    left.selfAuto(el => {
      const value1 = this.linkNode_input(graphNodeLayout, "值1", LinkNodeNumberEntry, "value1");
      el.appendChild(value1.linearLayout);

      const value2 = this.linkNode_input(graphNodeLayout, "值2", LinkNodeNumberEntry, "value2");
      el.appendChild(value2.linearLayout);
    })

    right.selfAuto(el => {
      const returnv = this.text_linkNode(graphNodeLayout, "", LinkNodeNumberOutput, "value");
      el.appendChild(returnv.linearLayout);
    })

  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);
    const token = {
      uuid: this.uuid,
      type: "mutiplication",
      defaultValue1: this.linkNodeValues.value1,
      defaultValue2: this.linkNodeValues.value2,
      value1: null,
      value2: null,
    }
    map.push(token);

    token.value1 = this.entryNode("value1", map);
    token.value2 = this.entryNode("value2", map);
    return { index, linkNodeAlias };
  }
}

// 除法
export class Division extends GraphNode {
  static alias = "/ 除法";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle();

    const { left, container, right } = this.container_left_right();

    this.appendChild(container);

    left.selfAuto(el => {
      const value1 = this.linkNode_input(graphNodeLayout, "值1", LinkNodeNumberEntry, "value1");
      el.appendChild(value1.linearLayout);

      const value2 = this.linkNode_input(graphNodeLayout, "值2", LinkNodeNumberEntry, "value2");
      el.appendChild(value2.linearLayout);
    })

    right.selfAuto(el => {
      const returnv = this.text_linkNode(graphNodeLayout, "", LinkNodeNumberOutput, "value");
      el.appendChild(returnv.linearLayout);
    })

  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);
    const token = {
      uuid: this.uuid,
      type: "division",
      defaultValue1: this.linkNodeValues.value1,
      defaultValue2: this.linkNodeValues.value2,
      value1: null,
      value2: null,
    }
    map.push(token);

    token.value1 = this.entryNode("value1", map);
    token.value2 = this.entryNode("value2", map);
    return { index, linkNodeAlias };
  }
}

// 求余
export class Mod extends GraphNode {
  static alias = "% 求模";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle();

    const { left, container, right } = this.container_left_right();

    this.appendChild(container);

    left.selfAuto(el => {
      const value1 = this.linkNode_input(graphNodeLayout, "值1", LinkNodeNumberEntry, "value1");
      el.appendChild(value1.linearLayout);

      const value2 = this.linkNode_input(graphNodeLayout, "值2", LinkNodeNumberEntry, "value2");
      el.appendChild(value2.linearLayout);
    })

    right.selfAuto(el => {
      const returnv = this.text_linkNode(graphNodeLayout, "", LinkNodeNumberOutput, "value");
      el.appendChild(returnv.linearLayout);
    })

  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);
    const token = {
      uuid: this.uuid,
      type: "mod",
      defaultValue1: this.linkNodeValues.value1,
      defaultValue2: this.linkNodeValues.value2,
      value1: null,
      value2: null,
    }
    map.push(token);

    token.value1 = this.entryNode("value1", map);
    token.value2 = this.entryNode("value2", map);
    return { index, linkNodeAlias };
  }
}