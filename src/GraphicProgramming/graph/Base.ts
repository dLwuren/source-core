import KeyframesAnimation from "../utils/KeyframesAnimation";
import { uuid } from "../utils/uuid";
import { CustomElement } from "../element/custom_element";
import { GraphNode } from "./BaseNode"
import * as AlertMsg from "../utils/Alert";
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
  LinkNodeUp
} from "../link_node";

import { LinearLayout, ListLayout } from "../element/layout/index";
import { Group, Select, Alert } from "../element/group";
import { Input, Svg, Text } from "../element/Element";
import { GraphNodeLayout } from "../graph_node_layout";
import { Message } from "../utils/message";
import { isMobile } from "../utils/isMobile";

// 变量下拉列表项目
const linkNodeType = {
  boolean: "布尔",
  string: "字符串",
  number: "数值",
  function: "函数",
  array: "数组",
  linkNode: "linkNode",
  object: "对象",
  undefined: "未定义",
  null: "空"
}

// 开始、入口、主函数
export class Start extends GraphNode {
  static alias = "开始";
  index = 0;
  varList: { [k: string]: any }[] = [];
  right: any;

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);
    this.initTitle_LinkPoint(false, true, "#6f0000");

    // const { container, left, right } = this.container_left_right();
    // this.appendChild(container);

    // this.appendChild(
    //   new LinearLayout()
        // .setStyle({ "padding": "10px" })
        // .justifyContent("flex-end")
        // .appendChild(
        //   new Text("添加")
        //     .setStyle({ "font-size": "12px", "cursor": " pointer" })
        //     .selfAuto(el => {
        //       el.$el.addEventListener("click", () => {
        //         right.appendChild(this.createVariable(graphNodeLayout))
        //       })
        //     })
        // )
    // )

    // this.right = right;
  }

  createVariable(graphNodeLayout: GraphNodeLayout, vname: any = null, vType: any = null, linkNodeName: any = null) {
    const Class: any = {
      string: LinkNodeStringOutput,
      number: LinkNodeNumberOutput,
      boolean: LinkNodeBooleanOutput,
      function: LinkNodeFunctionOutput,
      array: LinkNodeObjectOutput,
      object: LinkNodeObjectOutput,
      null: LinkNodeObjectOutput,
      undefined: LinkNodeObjectOutput,
    }
    const list = Object.keys(linkNodeType);

    linkNodeName = linkNodeName || "var_" + this.index++;
    // const varName = vname ||;

    const data = {
      varName: vname || linkNodeName,
      varType: list[0],
      linkNodeName: linkNodeName,
    }

    vType = vType || list[0];

    const linearLayout = new LinearLayout().setStyle({ "margin": "2.5px 0" });
    let linkNodeBoxOutput = new Class[vType](graphNodeLayout)
      .setAlias(linkNodeName)
      .setLinkMaxCount(10000)

    const input = new Input()
      .setValue(vname || linkNodeName)
      .hint("变量名称")
      .onOld("change", () => {
        data.varName = input.getValue();
      })
      .setStyle({ "width": "50px", "margin": "0 5px", "font-size": "12px", "outline": "none" });

    const select = new Select()
      .adds(list)
      .setValue(vType)
      .on("select", (el) => {
        linkNodeBoxOutput.removeLines();
        linearLayout.removeChild(linkNodeBoxOutput);
        linkNodeBoxOutput = new Class[el.value](graphNodeLayout)
          .setAlias(linkNodeName)
          .setLinkMaxCount(10000)
        linearLayout.appendChild(linkNodeBoxOutput);
        this.setLinkNodeList(linkNodeName, linkNodeBoxOutput);
        data.varType = el.value;
      });

    linearLayout
      .alignItems()
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
                new Alert("是否删除该变量", (b: boolean) => {
                  if (b) {
                    linkNodeBoxOutput.removeLines();
                    this.right.removeChild(linearLayout);
                    this.graphNodeLayout.alert = null;

                    const i = this.varList.indexOf(data);
                    if (i > -1) this.varList.splice(i, 1);
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
              "margin-right": "10px",
              "cursor": "pointer"
            })
            el.$el.innerHTML = `<path d="M810 274l-238 238 238 238-60 60-238-238-238 238-60-60 238-238-238-238 60-60 238 238 238-238z" p-id="2753"></path>`
          })
      )
      .appendChild(select)
      .appendChild(input)
      .appendChild(linkNodeBoxOutput);

    this.setLinkNodeList(linkNodeName, linkNodeBoxOutput);

    this.varList.push(data);
    console.log(this.varList)
    return linearLayout;
  }

  getData() {
    return {
      ...super.getData(),
      varList: this.varList,
      index: this.index
    }
  }

 
  getToken(map: any[], linkNodeName = "") {
    const index = super.getToken(map);
    const parameter: any = [];
    const token = {
      type: "start",
      funName: "",
      parameter: parameter,
      next: null,
      uuid: this.uuid
    }

    this.varList.forEach(item => {
      token.parameter.push({
        name: item.varName,
        type: item.varType,
        linkNodeName: item.linkNodeName
      });
    });

    map.push(token);
    token.next = this.outputNode("next", map);
    return index;
  }
}

// 结束任务
export class EndTask extends GraphNode {
  static alias = "结束任务";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(true, false, "#6f0000");

    // lin_0.appendChild()
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "endTask",
      uuid: this.uuid,
    }

    map.push(token);

    return index;
  }
}

// console.log
export class Log extends GraphNode {
  static alias = "控制台日志";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    const { linkNode, linearLayout } = this.linkNode_input(graphNodeLayout, "^输入值", LinkNodeAnyEntry, "value", true);

    this.push(
      new LinearLayout().setStyle({ "padding": "10px" })
        .appendChild(linearLayout)
    );
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "log",
      funName: "",
      next: null,
      value: null,
      defaultValue: this.linkNodeValues.value,
      uuid: this.uuid
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    token.value = this.entryNode("value", map);
    return index;
  }
}

// 打开脚本列表
// 调用 源核 的某个功能