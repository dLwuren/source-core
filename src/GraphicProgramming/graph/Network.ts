import {
  LinkNode,
  LinkNodeAnyEntry,
  LinkNodeBooleanEntry,
  LinkNodeBooleanOutput,
  LinkNodeFunctionEntry,
  LinkNodeFunctionOutput,
  LinkNodeNext,
  LinkNodeNumberEntry,
  LinkNodeNumberOutput,
  LinkNodeObjectEntry,
  LinkNodeObjectOutput,
  LinkNodeStringEntry,
  LinkNodeStringOutput,
  LinkNodeUp,

} from "../link_node";

import { Group, Select } from "../element/group";
import { Input, Svg, Text } from "../element/Element";
import { GraphNodeLayout } from "../graph_node_layout";
import { GraphNode } from "./BaseNode";

// Promise
export class Ajax extends GraphNode {
  static alias = "Ajax";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(true, true, "#aa9d00");

    const { container, left, right } = this.container_left_right();

    left.selfAuto(() => {

      const result = this.linkNode_input(graphNodeLayout, "地址", LinkNodeObjectEntry, "url");
      left.appendChild(result.linearLayout);

      const error = this.linkNode_input(graphNodeLayout, "请求方法", LinkNodeObjectEntry, "method");
      left.appendChild(error.linearLayout);
    });

    right.selfAuto(() => {

      const obj2 = this.text_linkNode(graphNodeLayout, "成功", LinkNodeNext, "success");
      right.appendChild(obj2.linearLayout);

      const obj3 = this.text_linkNode(graphNodeLayout, "失败", LinkNodeNext, "fail");
      right.appendChild(obj3.linearLayout);

      const result = this.text_linkNode(graphNodeLayout, "result", LinkNodeObjectOutput, "result");
      right.appendChild(result.linearLayout);

      const error = this.text_linkNode(graphNodeLayout, "error", LinkNodeObjectOutput, "error");
      right.appendChild(error.linearLayout);
    });

    this.appendChild(container);
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "ajax",
      uuid: this.uuid,

      success: null,
      fail: null,
      next: null,

      defaultUrl: this.linkNodeValues.url,
      url: null,

      defaultMethod: this.linkNodeValues.method,
      method: null,
    }

    map.push(token);

    token.success = this.outputNode("success", map);
    token.fail = this.outputNode("fail", map);

    token.url = this.entryNode("url", map);
    token.method = this.entryNode("method", map);

    token.next = this.outputNode("next", map);
    return index;
  }
}

export class WebSocket extends GraphNode {
  static alias = "WebSocket";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(true, true, "#aa9d00");

    const { container, left, right } = this.container_left_right();

    left.selfAuto(() => {

      const result = this.linkNode_input(graphNodeLayout, "地址", LinkNodeObjectEntry, "url");
      left.appendChild(result.linearLayout);

      const error = this.linkNode_input(graphNodeLayout, "端口", LinkNodeObjectEntry, "port");
      left.appendChild(error.linearLayout);
    });

    right.selfAuto(() => {
      const result = this.text_linkNode(graphNodeLayout, "", LinkNodeObjectOutput, "result");
      right.appendChild(result.linearLayout);
      result.linkNode.setLinkMaxCount(10000);
    });

    this.appendChild(container);
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "webSocket",
      uuid: this.uuid,

      success: null,
      fail: null,
      next: null,

      defaultUrl: this.linkNodeValues.url,
      url: null,

      defaultPort: this.linkNodeValues.port,
      port: null,
    }

    map.push(token);

    token.url = this.entryNode("url", map);
    token.port = this.entryNode("method", map);

    token.next = this.outputNode("next", map);
    return index;
  }
}

export class SocketOnOpen extends GraphNode {
  static alias = "打开事件";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(true, true, "#016f00");

    const { container, left, right } = this.container_left_right();

    left.selfAuto(() => {
      const target = this.linkNode_input(graphNodeLayout, "目标", LinkNodeObjectEntry, "target");
      left.appendChild(target.linearLayout);
    });

    right.selfAuto(() => {
      const success = this.text_linkNode(graphNodeLayout, "", LinkNodeNext, "success");
      right.appendChild(success.linearLayout);
    });

    this.appendChild(container);
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "socketOnOpen",
      uuid: this.uuid,

      success: null,
      next: null,

      defaultTarget: this.linkNodeValues.target,
      target: null,
    }

    map.push(token);

    token.success = this.outputNode("success", map);

    token.target = this.entryNode("target", map);

    token.next = this.outputNode("next", map);
    return index;
  }
}

export class SocketOnError extends GraphNode {
  static alias = "错误事件";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(true, true, "#ff0000");

    const { container, left, right } = this.container_left_right();

    left.selfAuto(() => {
      const target = this.linkNode_input(graphNodeLayout, "目标", LinkNodeObjectEntry, "target");
      left.appendChild(target.linearLayout);
    });

    right.selfAuto(() => {
      const errNext = this.text_linkNode(graphNodeLayout, "", LinkNodeNext, "errNext");
      right.appendChild(errNext.linearLayout);

      const error = this.text_linkNode(graphNodeLayout, "错误", LinkNodeObjectOutput, "error");
      right.appendChild(error.linearLayout);
      error.linkNode.setLinkMaxCount(10000);
    });

    this.appendChild(container);
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "socketOnError",
      uuid: this.uuid,

      next: null,
      errNext: null,

      defaultTarget: this.linkNodeValues.target,
      target: null,
    }

    map.push(token);
    token.target = this.entryNode("target", map);

    token.errNext = this.outputNode("errNext", map);
    token.next = this.outputNode("next", map);
    return index;
  }
}

export class SocketOnMessage extends GraphNode {
  static alias = "消息事件";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(true, true, "#0074ff");

    const { container, left, right } = this.container_left_right();

    left.selfAuto(() => {
      const result = this.linkNode_input(graphNodeLayout, "目标", LinkNodeObjectEntry, "target");
      left.appendChild(result.linearLayout);
    });

    right.selfAuto(() => {
      const result = this.text_linkNode(graphNodeLayout, "", LinkNodeNext, "msgNext");
      right.appendChild(result.linearLayout);

      const message = this.text_linkNode(graphNodeLayout, "消息", LinkNodeObjectOutput, "message");
      right.appendChild(message.linearLayout);
      message.linkNode.setLinkMaxCount(10000);
    });

    this.appendChild(container);
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "socketOnMessage",
      uuid: this.uuid,

      next: null,
      msgNext: null,

      defaultTarget: this.linkNodeValues.target,
      target: null,
    }

    map.push(token);
    token.target = this.entryNode("target", map);

    token.msgNext = this.outputNode("msgNext", map);
    token.next = this.outputNode("next", map);
    return index;
  }
}

export class SocketOnClose extends GraphNode {
  static alias = "关闭事件";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(true, true, "#aeaeae");

    const { container, left, right } = this.container_left_right();

    left.selfAuto(() => {
      const result = this.linkNode_input(graphNodeLayout, "目标", LinkNodeObjectEntry, "target");
      left.appendChild(result.linearLayout);
    });

    right.selfAuto(() => {
      const closeNext = this.text_linkNode(graphNodeLayout, "", LinkNodeNext, "closeNext");
      right.appendChild(closeNext.linearLayout);
    });

    this.appendChild(container);
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "socketOnClose",
      uuid: this.uuid,

      closeNext: null,
      next: null,

      defaultTarget: this.linkNodeValues.target,
      target: null,
    }

    map.push(token);

    token.target = this.entryNode("target", map);
    token.closeNext = this.outputNode("closeNext", map);
    token.next = this.outputNode("next", map);
    return index;
  }
}

export class SocketSend extends GraphNode {
  static alias = "发送";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(true, true);

    const { container, left, right } = this.container_left_right();

    left.selfAuto(() => {
      const result = this.linkNode_input(graphNodeLayout, "目标", LinkNodeObjectEntry, "target");
      left.appendChild(result.linearLayout);

      const message = this.linkNode_input(graphNodeLayout, "信息", LinkNodeStringEntry, "message");
      left.appendChild(message.linearLayout);
    });


    this.appendChild(container);
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "socketSend",
      uuid: this.uuid,
      next: null,

      defaultTarget: this.linkNodeValues.target,
      target: null,

      defaultMessage: this.linkNodeValues.message,
      message: null,
    }

    map.push(token);

    token.target = this.entryNode("target", map);
    token.message = this.entryNode("message", map);
    token.next = this.outputNode("next", map);
    return index;
  }
}

export class SocketClose extends GraphNode {
  static alias = "关闭";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(true, true);

    const { container, left, right } = this.container_left_right();

    left.selfAuto(() => {
      const result = this.linkNode_input(graphNodeLayout, "目标", LinkNodeObjectEntry, "target");
      left.appendChild(result.linearLayout);
    });


    this.appendChild(container);
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "socketClose",
      uuid: this.uuid,
      next: null,

      defaultTarget: this.linkNodeValues.target,
      target: null,

    }

    map.push(token);

    token.target = this.entryNode("target", map);
    token.next = this.outputNode("next", map);
    return index;
  }
}