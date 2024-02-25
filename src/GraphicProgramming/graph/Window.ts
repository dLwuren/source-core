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
  LinkNodeArrayEntry,
  LinkNodeObjectEntry,
  LinkNodeObjectOutput,
  LinkNodeStringEntry,
  LinkNodeStringOutput,
} from "../link_node";
import { Input, Text, Svg } from "../element/Element";
import { Select, Alert } from "../element/group";

import { openDialog } from '../../utils/index'

// 消息窗口 失去焦点后自动消失
export class MsgWin extends GraphNode {
  static alias = "消息窗口";

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

    const input_1 = this.linkNode_input(graphNodeLayout, "窗口内容", LinkNodeStringEntry, "defaultInput_1");

    lin_0.appendChild(input_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "msgWin",
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

// 表单窗口
export class FormWin extends GraphNode {
  static alias = "表单窗口";
  index = 0;
  itemList: { [k: string]: any }[] = [];
  right: any;

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);
    this.initTitle_LinkPoint();

    const { container, left, right } = this.container_left_right();

    const lin_0 = new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setColumn(LinearLayout.Direction.column)
      .setStyle({
        "padding": "10px",
        "justify-content": "flex-start",
      })
    const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeObjectOutput, "output_1")
    // const input_1 = this.linkNode_input(graphNodeLayout, "不关闭表单", LinkNodeNumberEntry, "defaultInput_1");

    lin_0.appendChild(output_1.linearLayout)
    // .appendChild(input_1.linearLayout)

    this.appendChild(lin_0).appendChild(container);

    // 添加键
    this.appendChild(
      new LinearLayout()
        .setStyle({ "padding": "10px" })
        .justifyContent("flex-end")
        .appendChild(
          new Text("添加")
            .setStyle({ "font-size": "12px", "cursor": " pointer" })
            .selfAuto(el => {
              el.$el.addEventListener("click", () => {
                right.appendChild(this.createVariable(graphNodeLayout))
              })
            })
        )
    )
    this.right = right;
  }

  createVariable(graphNodeLayout: GraphNodeLayout, vname: any = null, vType: any = null, linkNodeName: any = null) {
    // 变量下拉列表项目
    const option = {
      "文本": "text",
      "输入框": "input",
      "多行文本框": "textarea",
      "单选": "radio",
      "多选": "checkbox",
      "下拉列表": "list",
    }
    const Class: any = {
      "文本": LinkNodeStringEntry,
      "输入框": LinkNodeStringEntry,
      "多行文本框": LinkNodeStringEntry,
      "单选": LinkNodeArrayEntry,
      "多选": LinkNodeArrayEntry,
      "下拉列表": LinkNodeArrayEntry,
    }
    const list = Object.keys(option);

    linkNodeName = "item_" + this.index++;

    const data = {
      linkNodeName: linkNodeName,
      inputValue: "",
      itemType: list[0],
    }

    const linearLayout = new LinearLayout().setStyle({ "margin": "2.5px 0" });

    // 值输入口
    let linkNodeBoxEntry = new LinkNodeStringEntry(graphNodeLayout)
      .setAlias(linkNodeName)

    //  输入框
    // const input = new Input()
    //   .hint("默认值")
    //   .setStyle({ "width": "50px", "margin": "0 5px", "font-size": "12px", "outline": "none" })
    //   .onOld("change", () => {
    //     data.inputValue = input.getValue();
    //   });

    // 选项
    const select = new Select()
      .adds(list)
      .setValue("文本")
      .setStyle({ "margin": "0 0 0 30px" })
      .selfAuto((el) => {
        data.itemType = "文本";
      })
      .on("select", (el) => {
        linkNodeBoxEntry.removeLines();
        linearLayout
          .removeChild(linkNodeBoxEntry)
          // .removeChild(input)
          .removeChild(select)
          .removeChild(del);
        linkNodeBoxEntry = new Class[el.value](graphNodeLayout)
          .setAlias(linkNodeName)
        linearLayout
          .appendChild(linkNodeBoxEntry)
          // .appendChild(input)
          .appendChild(select)
          .appendChild(del);
        this.setLinkNodeList(linkNodeName, linkNodeBoxEntry);
        data.itemType = el.value;
      });

    // 删除item按钮
    const del = new Svg()
      .selfAuto((el) => {
        el.$el.addEventListener("click", (e: PointerEvent) => {

          if (this.graphNodeLayout.alert) {
            this.graphNodeLayout.removeChild(this.graphNodeLayout.alert);
            this.graphNodeLayout.alert = null;
          }

          const infoG = this.graphNodeLayout.$el.getBoundingClientRect();
          const info = el.$el.getBoundingClientRect();

          this.graphNodeLayout.appendChild(
            new Alert("是否删除该项", (b: boolean) => {
              if (b) {
                linkNodeBoxEntry.removeLines();
                this.right.removeChild(linearLayout);
                this.graphNodeLayout.alert = null;

                // 获取item对应的data，并删除
                const i = this.itemList.indexOf(data);
                if (i > -1) this.itemList.splice(i, 1);
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

    linearLayout
      .alignItems()
      .appendChild(linkNodeBoxEntry)
      // .appendChild(input)
      .appendChild(select)
      .appendChild(del)

    this.setLinkNodeList(linkNodeName, linkNodeBoxEntry);
    this.itemList.push(data);
    return linearLayout;
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const parameter: any = [];
    const token = {
      type: "formWin",
      next: null,
      uuid: this.uuid,
      parameter: parameter,

      output_1: null,
      // defaultInput_1: this.linkNodeValues.defaultInput_1,
      // input_1: null,
      formList: [],
    }

    this.itemList.forEach(item => {
      token.parameter.push({
        itemName: item.linkNodeName,
        type: item.itemType,
        value: item.inputValue,
      });
    });

    map.push(token);

    token.next = this.outputNode("next", map);
    // 获取输入口的值
    this.itemList.forEach(item => {
      token.formList.push(this.entryNode(item.linkNodeName, map))
    })
    token.output_1 = this.outputNode("output_1", map);
    // token.input_1 = this.entryNode("defaultInput_1", map);
    return index;
  }
}

