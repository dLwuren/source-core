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
  LinkNodeObjectEntry,
  LinkNodeObjectOutput,
  LinkNodeStringEntry,
  LinkNodeStringOutput,
} from "../link_node";
import { Input, Text, Svg } from "../element/Element";
import { Select, Alert } from "../element/group";

import { openDialog } from '../../utils/index'

// 存储值
export class SaveValue extends GraphNode {
  static alias = "存储值";
  static varType = "number"

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setColumn(LinearLayout.Direction.column)
      .setStyle({
        "padding": "10px",
        "justify-content": "flex-start",
      })
      .selfAuto(el => {
        const title = new Text(SaveValue.alias)
          .setFontSize("12px")
          .setStyle({
            "margin": "0 10px",
            "display": "flex",
            "justify-content": "center"
          })
        const lin = new LinearLayout().setStyle({ "align-items": "center", "justify-content": "flex-end", "margin": "2.5px 0" });
        const firstItemTitle = new Text("返回值").setFontSize("12px").setStyle({ "margin": "0 10px" })
        const value = this.linkNode_text(graphNodeLayout, "值", LinkNodeAnyEntry, "value");
        el.appendChild(title)
          .appendChild(this.createVariable(graphNodeLayout, el, lin, firstItemTitle, value, "outputValue"));
      })

  }

  createVariable(graphNodeLayout: GraphNodeLayout, ParentEl: any = null, lin, title, value, linkNodeName: any = null) {
    const option = {
      "数字": "number",
      "文字": "string",
      "数组": "array",
      "对象": "object",
    }
    const Class: any = {
      string: LinkNodeStringOutput,
      number: LinkNodeNumberOutput,
      boolean: LinkNodeBooleanOutput,
      array: LinkNodeArrayOutput,
      object: LinkNodeObjectOutput,
      null: LinkNodeObjectOutput,
      undefined: LinkNodeObjectOutput,
    }
    const list = Object.keys(option);
    let vType = null || list[0];

    SaveValue.varType = option[vType]

    const text = new Text("数据类型")
      .setFontSize("12px")
      .setStyle({
        "margin": "0 10px",
        "display": "flex",
        "flex-direction": "row",
        "justify-content": "flex-start"
      });
    // 输出接口
    let linkNodeBoxOutput = new Class[option[vType]](graphNodeLayout)
      .setAlias(linkNodeName)
      .setLinkMaxCount(10000)
    const select = new Select()
      .adds(list)
      .setValue(vType)
      .on("select", (el) => {
        SaveValue.varType = option[el.value]

        // 移除连接线
        linkNodeBoxOutput.removeLines();
        // 把输出接口移除，以方便重新插入
        lin.removeChild(linkNodeBoxOutput);

        // 新创建的接口由选项决定类型
        linkNodeBoxOutput = new Class[option[el.value]](graphNodeLayout)
          .setAlias(linkNodeName)
          .setLinkMaxCount(10000)

        lin.appendChild(linkNodeBoxOutput);
        this.setLinkNodeList(linkNodeName, linkNodeBoxOutput);
      });
    const linearLayout = new LinearLayout()
      .setStyle({ "margin": "2.5px 0" })
      .alignItems()
      .appendChild(select)
      .appendChild(text);

    this.setLinkNodeList(linkNodeName, linkNodeBoxOutput);

    lin.appendChild(title).appendChild(linkNodeBoxOutput)
    ParentEl.appendChild(lin)
    ParentEl.appendChild(value.linearLayout);

    return linearLayout;
  }

  getToken(map: any[]) {
    const index = super.getToken(map);

    const token = {
      type: "saveValue",
      next: null,
      uuid: this.uuid,

      defaultValue: this.linkNodeValues.value,
      value: null,

      varType: SaveValue.varType
    }

    map.push(token);
    token.next = this.outputNode("next", map);
    token.value = this.entryNode("value", map);

    return index;
  }

}

// 创建数据
// export class CreateData extends GraphNode {
//   static alias = "创建数据";

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

//     const title = new Text(CreateData.alias).setFontSize("12px").setStyle({ "margin": "0 10px", "display": "flex", "justify-content": "center" })
//     const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeStringOutput, "output_1")
//     const input_1 = this.linkNode_input(graphNodeLayout, "数据", LinkNodeAnyEntry, "defaultInput_1");

//     lin_0.appendChild(title).appendChild(output_1.linearLayout).appendChild(input_1.linearLayout)
//   }

//   getToken(map: any[]) {
//     const index = super.getToken(map);
//     const token = {
//       type: "createData",
//       next: null,
//       uuid: this.uuid,

//       output_1: null,
//       defaultInput_1: this.linkNodeValues.defaultInput_1,
//       input_1: null,
//     }

//     map.push(token);

//     token.next = this.outputNode("next", map);
//     token.output_1 = this.outputNode("output_1", map);
//     token.input_1 = this.entryNode("defaultInput_1", map);

//     return index;
//   }
// }

// if
export class If extends GraphNode {
  static alias = "判断";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    const { container, left, right } = this.container_left_right();

    left.selfAuto(() => {
      const obj1 = this.linkNode_input(graphNodeLayout, "条件", LinkNodeAnyEntry, "condition");
      left.appendChild(obj1.linearLayout);
    })

    right.selfAuto(() => {
      const obj1 = this.text_linkNode(graphNodeLayout, "真", LinkNodeNext);
      right.appendChild(obj1.linearLayout);
      obj1.linkNode.setAlias("trueNext");
      this.setLinkNodeList("trueNext", obj1.linkNode);

      const obj2 = this.text_linkNode(graphNodeLayout, "假", LinkNodeNext);
      right.appendChild(obj2.linearLayout);
      obj2.linkNode.setAlias("falseNext");
      this.setLinkNodeList("falseNext", obj2.linkNode);
    })

    this.appendChild(container);
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "if",
      funName: "",
      next: null,
      uuid: this.uuid,

      condition: null,
      defaultCondition: this.linkNodeValues.condition,

      true: null,
      false: null,
    }

    map.push(token);

    token.condition = this.entryNode("condition", map);

    token.true = this.outputNode("trueNext", map);
    token.false = this.outputNode("falseNext", map);
    token.next = this.outputNode("next", map);

    return index;
  }
}

// switch
export class Switch extends GraphNode {
  static alias = "分支";
  right: any;

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    const value = this.linkNode_input(graphNodeLayout, "输入值", LinkNodeAnyEntry, "input");
    value.linearLayout.setStyle({ "padding": "5px" });
    this.appendChild(value.linearLayout)

    const { container, left, right } = this.container_left_right();
    this.appendChild(container);

    right.appendChild(this.createCase(graphNodeLayout, 1, "case_1", "input_1"))
    right.appendChild(this.createCase(graphNodeLayout, 2, "case_2", "input_2"))
    right.appendChild(this.createCase(graphNodeLayout, 3, "case_3", "input_3"))
  }

  createCase(graphNodeLayout: GraphNodeLayout, index: number, outputAlias: string, inputAlias: string) {
    let linkNodeName = "分支" + index;
    const linearLayout = new LinearLayout().setStyle({ "margin": "2.5px 0" });

    const { container, left, right } = this.container_left_right();
    let linkNodeBoxOutput = null

    left.selfAuto(() => {
      const obj1 = this.linkNode_input(graphNodeLayout, "条件", LinkNodeAnyEntry, inputAlias);
      left.appendChild(obj1.linearLayout);
      linkNodeBoxOutput = obj1.linkNode;
    })
    right.selfAuto(() => {
      const obj1 = this.text_linkNode(graphNodeLayout, linkNodeName, LinkNodeNext);
      right.appendChild(obj1.linearLayout);
      obj1.linkNode.setAlias(outputAlias);
      this.setLinkNodeList(outputAlias, obj1.linkNode);
    })

    linearLayout
      .alignItems()
      .appendChild(container)

    return linearLayout
  }

  getToken(map: any[], linkNodeName = "") {
    const index = super.getToken(map);
    // 
    const caseInput: any = [];
    const token = {
      type: "switch",
      next: null,
      uuid: this.uuid,

      case_1: null,
      case_2: null,
      case_3: null,

      defaultInput: this.linkNodeValues.input,
      input: null,
      defaultInput_1: this.linkNodeValues.input_1,
      input_1: null,
      defaultInput_2: this.linkNodeValues.input_2,
      input_2: null,
      defaultInput_3: this.linkNodeValues.input_3,
      input_3: null,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    token.case_1 = this.outputNode("case_1", map);
    token.case_2 = this.outputNode("case_2", map);
    token.case_3 = this.outputNode("case_3", map);

    token.input = this.entryNode("input", map);
    token.input_1 = this.entryNode("input_1", map);
    token.input_2 = this.entryNode("input_2", map);
    token.input_3 = this.entryNode("input_3", map);
    return index;
  }
}

// for 循环
export class For extends GraphNode {
  static alias = "循环";
  variableName_: any;
  variableValue_: any;
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setStyle({
        "padding": "10px",
        "justify-content": " space-around",
        "align-items": "center"
      })
      .appendChild(
        new LinearLayout()
          .setStyle({ "justify-content": "space-between" })
          .setColumn(LinearLayout.Direction.column)
          .selfAuto(el => {
            const { linearLayout, input } = this.linkNode_input(graphNodeLayout, "开始值", LinkNodeNumberEntry, "startValue");
            el.appendChild(linearLayout);
          })
          .selfAuto(el => {
            const { linearLayout, input } = this.linkNode_input(graphNodeLayout, "结束值", LinkNodeNumberEntry, "endValue");
            el.appendChild(linearLayout);
          })
          .selfAuto(el => {
            const { linearLayout, input } = this.linkNode_input(graphNodeLayout, "步长值", LinkNodeNumberEntry, "stepValue");
            el.appendChild(linearLayout);
          })
      )
      .appendChild(
        new LinearLayout()
          .setStyle({ "margin-left": "20px", "justify-content": "space-between" })
          .setColumn(LinearLayout.Direction.column)
          .appendChild(
            new LinearLayout()
              .setStyle({ "justify-content": "space-between", "align-items": "center" })
              .appendChild(
                new Text("循环体")
                  .setStyle({
                    "font-size": "12px",
                    "margin-right": "10px"
                  })
              )
              .appendChild(
                new LinkNodeNext(graphNodeLayout)
                  .setAlias("forBody")
                  .setIsNext(false)
                  .setLinkMaxCount(10000)
                  .selfAuto((el: any) => {
                    this.setLinkNodeList("forBody", el);
                  })
              )

          )
          .appendChild(
            new LinearLayout()
              .setStyle({ "justify-content": "space-between", "margin-top": "20px" })
              .appendChild(
                new Text("索引")
                  .setStyle({
                    "font-size": "12px"
                  })
              )
              .appendChild(
                new LinkNodeNumberOutput(graphNodeLayout)
                  .setTypeName("数值")
                  .setAlias("index")
                  .setIsNext(false)
                  .setLinkMaxCount(10000)
                  .selfAuto((el: any) => {
                    this.setLinkNodeList("indexOutput", el);
                  })
              )

          )
      )
  }

  getData() {
    return {
      ...super.getData(),
      variableName: this.variableName,
      variableValue: this.variableValue,
    }
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "for",
      forBody: null,
      next: null,
      uuid: this.uuid,

      defaultStart: this.linkNodeValues.startValue,
      start: null,

      defaultEnd: this.linkNodeValues.endValue,
      end: null,

      defaultStep: this.linkNodeValues.stepValue,
      step: null,
    }

    map.push(token);

    token.forBody = this.outputNode("forBody", map);
    token.next = this.outputNode("next", map);

    token.start = this.entryNode("startValue", map);
    token.end = this.entryNode("endValue", map);
    token.step = this.entryNode("stepValue", map);

    return index;
  }
}

// 暂停执行
export class Pause extends GraphNode {
  static alias = "暂停";

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

    const input_1 = this.linkNode_input(graphNodeLayout, "暂停时间", LinkNodeNumberEntry, "defaultInput_1");
    lin_0.appendChild(input_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "pasue",
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

// 随机整数
export class RandomInt extends GraphNode {
  static alias = "随机整数";

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

    const title = new Text(RandomInt.alias).setFontSize("12px").setStyle({ "margin": "0 10px", "display": "flex", "justify-content": "center" })
    const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeNumberOutput, "output_1")
    const input_1 = this.linkNode_input(graphNodeLayout, "最小值", LinkNodeNumberEntry, "defaultInput_1");
    const input_2 = this.linkNode_input(graphNodeLayout, "最大值", LinkNodeNumberEntry, "defaultInput_2");
    lin_0.appendChild(title).appendChild(output_1.linearLayout).appendChild(input_1.linearLayout).appendChild(input_2.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "randomInt",
      next: null,
      uuid: this.uuid,

      output_1: null,
      defaultInput_1: this.linkNodeValues.defaultInput_1,
      input_1: null,
      defaultInput_2: this.linkNodeValues.defaultInput_2,
      input_2: null,
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    token.output_1 = this.outputNode("output_1", map);

    token.input_1 = this.entryNode("defaultInput_1", map);
    token.input_2 = this.entryNode("defaultInput_2", map);
    return index;
  }
}

// 注释
export class Note extends GraphNode {
  static alias = "注释";
  static content = ""

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

    const input_1 = new Input()
      .setTag("textarea")
      .setStyle({
        "background": "#1a1a1a",
        "color": "#808080",
        "width": "200px",
        "height": "30px",
        "outline": "none",
        "font-size": "14px",
        "padding": "10px",
        "border-color": "#0069b1",
      })
    input_1.$el.addEventListener("change", (e) => {
      const value = input_1.$el.value.trim();
      Note.content = value;
    })

    lin_0.appendChild(input_1)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "note",
      next: null,
      uuid: this.uuid,

      input_1: Note.content,
    }

    map.push(token);

    token.next = this.outputNode("next", map);

    return index;
  }
}

// 信号启动器 注册一个 socketio
export class Signal extends GraphNode {
  static alias = "信号启动器";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);
    this.initTitle_LinkPoint();

    // const { container, left, right } = this.container_left_right();
    const lin_0 = new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setColumn(LinearLayout.Direction.column)
      .setStyle({
        "padding": "10px",
        "justify-content": "flex-start",
      })
    this.appendChild(lin_0)

    const obj1 = this.text_linkNode(graphNodeLayout, "满足信号时执行", LinkNodeNext);
    obj1.linkNode.setAlias("trueNext");
    this.setLinkNodeList("trueNext", obj1.linkNode);

    const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeStringOutput, "output_1")
    const input_1 = this.linkNode_input(graphNodeLayout, "信号", LinkNodeStringEntry, "defaultInput_1");
    lin_0.appendChild(obj1.linearLayout)
      .appendChild(output_1.linearLayout)
      .appendChild(input_1.linearLayout);
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "signal",
      next: null,
      uuid: this.uuid,

      // output_1: null,
      defaultInput_1: this.linkNodeValues.defaultInput_1,
      input_1: null,
      true: null,
    }

    map.push(token);
    token.true = this.outputNode("trueNext", map);
    token.next = this.outputNode("next", map);
    // token.output_1 = this.outputNode("output_1", map);

    token.input_1 = this.entryNode("defaultInput_1", map);
    return index;
  }
}

// 删除信号启动器
export class DelSignal extends GraphNode {
  static alias = "删除信号启动器";

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

    const input_1 = this.linkNode_input(graphNodeLayout, "信号", LinkNodeStringEntry, "defaultInput_1");
    lin_0.appendChild(input_1.linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "delSignal",
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