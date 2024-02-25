// 逻辑运算******************************************

import { LinearLayout } from "../element/layout";
import { GraphNodeLayout } from "../graph_node_layout";
import { LinkNode, LinkNodeAnyEntry, LinkNodeBooleanOutput, LinkNodeNumberOutput, LinkNodeObjectEntry } from "../link_node";
import { GraphNode } from "./BaseNode";

// 与
export class And extends GraphNode {
  static alias = "& 与";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle();

    const { left, container, right } = this.container_left_right();

    this.appendChild(container);

    left.selfAuto(el => {
      const value1 = this.linkNode_input(graphNodeLayout, "值1", LinkNodeObjectEntry, "value1");
      el.appendChild(value1.linearLayout);

      const value2 = this.linkNode_input(graphNodeLayout, "值2", LinkNodeObjectEntry, "value2");
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
      type: "and",
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
// 或
export class Or extends GraphNode {
  static alias = "| 或";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle();

    const { left, container, right } = this.container_left_right();

    this.appendChild(container);

    left.selfAuto(el => {
      const value1 = this.linkNode_input(graphNodeLayout, "值1", LinkNodeObjectEntry, "value1");
      el.appendChild(value1.linearLayout);

      const value2 = this.linkNode_input(graphNodeLayout, "值2", LinkNodeObjectEntry, "value2");
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
      type: "or",
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
// 非
export class Not extends GraphNode {
  static alias = "! 非";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle();

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
            const { linearLayout } = this.linkNode_input(graphNodeLayout, "值", LinkNodeAnyEntry, "value1");
            el.appendChild(linearLayout);
          })
      )
      .appendChild(
        new LinkNodeBooleanOutput(graphNodeLayout)
          .setStyle({
            "margin-left": "20px"
          })
          .setIsNext(false)
          .setLinkMaxCount(10000)
          .setAlias("value")
          .selfAuto((el: any) => {
            this.setLinkNodeList("valueOutput", el);
          })
      )
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);
    const token = {
      uuid: this.uuid,
      type: "not",
      defaultValue1: this.linkNodeValues.value1,
      value1: null,
    }
    map.push(token);

    token.value1 = this.entryNode("value1", map);
    return { index, linkNodeAlias };
  }
}
// 等于
export class Equal extends GraphNode {
  static alias = "=== 等于";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle();

    const { left, container, right } = this.container_left_right();

    this.appendChild(container);

    left.selfAuto(el => {
      const value1 = this.linkNode_input(graphNodeLayout, "值1", LinkNodeObjectEntry, "value1");
      el.appendChild(value1.linearLayout);

      const value2 = this.linkNode_input(graphNodeLayout, "值2", LinkNodeObjectEntry, "value2");
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
      type: "equal",
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
// 不等于
export class NotEqual extends GraphNode {
  static alias = "!= 不等于";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle();

    const { left, container, right } = this.container_left_right();

    this.appendChild(container);

    left.selfAuto(el => {
      const value1 = this.linkNode_input(graphNodeLayout, "值1", LinkNodeObjectEntry, "value1");
      el.appendChild(value1.linearLayout);

      const value2 = this.linkNode_input(graphNodeLayout, "值2", LinkNodeObjectEntry, "value2");
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
      type: "notEqual",
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
// 大于
export class GreaterThan extends GraphNode {
  static alias = "> 大于";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle();

    const { left, container, right } = this.container_left_right();

    this.appendChild(container);

    left.selfAuto(el => {
      const value1 = this.linkNode_input(graphNodeLayout, "值1", LinkNodeObjectEntry, "value1");
      el.appendChild(value1.linearLayout);

      const value2 = this.linkNode_input(graphNodeLayout, "值2", LinkNodeObjectEntry, "value2");
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
      type: "greaterThan",
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
// 小于
export class LessThan extends GraphNode {
  static alias = "< 小于";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle();

    const { left, container, right } = this.container_left_right();

    this.appendChild(container);

    left.selfAuto(el => {
      const value1 = this.linkNode_input(graphNodeLayout, "值1", LinkNodeObjectEntry, "value1");
      el.appendChild(value1.linearLayout);

      const value2 = this.linkNode_input(graphNodeLayout, "值2", LinkNodeObjectEntry, "value2");
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
      type: "lessThan",
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
// 大于等于
export class GreaterThanOrEqual extends GraphNode {
  static alias = ">= 大于等于";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle();

    const { left, container, right } = this.container_left_right();

    this.appendChild(container);

    left.selfAuto(el => {
      const value1 = this.linkNode_input(graphNodeLayout, "值1", LinkNodeObjectEntry, "value1");
      el.appendChild(value1.linearLayout);

      const value2 = this.linkNode_input(graphNodeLayout, "值2", LinkNodeObjectEntry, "value2");
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
      type: "greaterThanOrEqual",
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
// 小于不等于 Less than or equal to
export class LessThanOrEqual extends GraphNode {
  static alias = "<= 小于等于";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle();

    const { left, container, right } = this.container_left_right();

    this.appendChild(container);

    left.selfAuto(el => {
      const value1 = this.linkNode_input(graphNodeLayout, "值1", LinkNodeObjectEntry, "value1");
      el.appendChild(value1.linearLayout);

      const value2 = this.linkNode_input(graphNodeLayout, "值2", LinkNodeObjectEntry, "value2");
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
      type: "lessThanOrEqual",
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