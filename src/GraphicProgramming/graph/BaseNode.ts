import KeyframesAnimation from "../utils/KeyframesAnimation";
import { uuid } from "../utils/uuid";
import { CustomElement } from "../element/custom_element";
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

class AttrSelect extends Select {
  target: any;
  isDeep = true;
  setTarget(target: any) {
    this.target = target;
    this.updateAttr();

    return this;
  }

  updateAttr(obj: any = this.target) {
    this.clearList();

    const list: any[] = this.getAttrs();

    list.forEach((v, i) => {
      const type = typeof obj[v];
      list[i] = [v, type];

      list[i].toString = function () {
        return v;
      }
    })

    this.adds(list);

    return this;
  }

  getAttrs(obj: any = this.target) {
    let list: any[] = Object.getOwnPropertyNames(obj);

    if (obj.__proto__) {
      list = [...list, ...this.getAttrs(obj.__proto__)];
    }

    return list;
  }
}

class BoxSelect extends Group {
  ul: ListLayout;
  constructor(graphNodeLayout: GraphNodeLayout) {
    super();

    setTimeout(() => {
      this.setStyle({
        "width": "300px",
        "height": "400px",
        "background": "#fff",
        "position": "fixed",
        "left": "50%",
        "top": "50%",
        "transform": "translate(-50%,-50%)",
        "z-index": "10000",
        "border-radius": "8px",
        "padding": "10px"
      })
    })

    this.appendChild(
      new LinearLayout()
        .setStyle({
          "justify-content": "space-between",
          "border-bottom": "solid 1px #999",
          "padding-bottom": "5px"
        })
        .appendChild(
          new Text("请选择选项")
        )
        .appendChild(
          new Svg()
            .selfAuto((el) => {
              el.$el.addEventListener("click", (e: PointerEvent) => {
                graphNodeLayout.removeChild(this);
              })
              el.setAttribute("viewBox", "0 0 1024 1024")
              el.setAttribute("fill", "#666")
              el.setStyle({
                "width": "20px",
                "margin-left": "10px",
                "cursor": "pointer"
              })
              el.$el.innerHTML = `<path d="M810 274l-238 238 238 238-60 60-238-238-238 238-60-60 238-238-238-238 60-60 238 238 238-238z" p-id="2753"></path>`
            })
        )
    );

    this.ul = new ListLayout().setStyle({ "width": "100%", "overflow": "auto", "font-size": "12px" });
    this.appendChild(this.ul);

    this.ul.on("clickItem", (res) => {
      this.event.emit("clickItem", {
        value: res.target.$el.innerText
      });

      graphNodeLayout.removeChild(this);
    })
  }

  set(list: string[]) {

    this.ul.adapter.list = list;

    this.ul.render();

    return this;
  }
}

export class GraphNode extends Group {
  static id = 0;
  uuid: string;
  title: Text | undefined;
  titleLayout: LinearLayout | undefined;
  // alias 别名
  static alias = "基础节点";

  linkNodeList: { [k: string]: LinkNode } = {};

  graphNodeLayout: GraphNodeLayout;

  linkNodeValues: { [k: string]: any } = {};

  constructor(graphNodeLayout: GraphNodeLayout) {
    super();
    this.graphNodeLayout = graphNodeLayout;
    this.uuid = uuid();

    // 窗口默认样式
    this.setStyle({
      "border": "solid 2px transparent",
      "position": "absolute",
      "left": "0",
      "top": "0",
      "background": "rgba(20,20,20,0.8)",
      "z-index": 1,
      "color": "#fff",
      "border-radius": "8px",
      "overflow": "hidden",
      "transition": "border 0.25s",
      "box-sizing": "border-box"
    })

    // 初始化窗口选择事件
    this.initSelectEvent();
    // 初始化节点移动事件
    this.initWindowMoveEvent();
    this.initWindowMoveEventMobile();

    if (isMobile()) this.deleteMobile();
  }

  // 初始化窗口选择事件
  initSelectEvent() {
    this.$el.addEventListener("mousedown", (e: PointerEvent) => {
      if (!this.graphNodeLayout.isActive(this)) {
        this.graphNodeLayout.cancelActive();
        this.graphNodeLayout.active(this);
      }

      e.stopPropagation();
    })

    this.$el.addEventListener("dblclick", () => {
      this.graphNodeLayout.cancelActive();
      this.graphNodeLayout.active(this);
    })
  }

  // 初始化节点移动事件
  initWindowMoveEvent() {

    let position: any = null;
    const move = (e: PointerEvent) => {
      if (position) {
        position.x += e.movementX;
        position.y += e.movementY;

        this.setStyle({
          left: position.x + "px",
          top: position.y + "px",
          // transform: `translate(${position.x}px,${position.y}px)`
        })

        this.updateLine();

        this.graphNodeLayout.moveSelectAll(e.movementX, e.movementY, this);
      }
    }

    const remove = () => {
      if (this.parent) {
        this.parent.$el.removeEventListener("mousemove", move);
        this.parent.$el.removeEventListener("mouseup", remove);
        position = null;
      }

    }

    this.$el.addEventListener("mousedown", (e: PointerEvent) => {
      if (this.parent) {

        const boxinfo = this.$el.getBoundingClientRect();
        const parentinfo = this.parent.$el.getBoundingClientRect();

        position = {};
        position.x = boxinfo.left - parentinfo.left;
        position.y = boxinfo.top - parentinfo.top;

        this.parent.$el.addEventListener("mousemove", move);
        this.parent.$el.addEventListener("mouseup", remove);
      }
    });

    return this;
  }

  /**初始化节点移动事件 移动端
   * 
   * @returns 
   */
  initWindowMoveEventMobile() {
    let position: any = null;
    const movement = {
      x: 0,
      y: 0,
      getX(x: number) {
        if (this.x) {
          const x_ = x - this.x;
          this.x = x;
          return x_;
        }
        this.x = x;
        return 0;
      },
      getY(y: number) {
        if (this.y) {
          const y_ = y - this.y;
          this.y = y;
          return y_;
        }
        this.y = y;
        return 0;
      },
    }

    const move = (e: TouchEvent) => {
      const x = movement.getX(e.touches[0].clientX);
      const y = movement.getY(e.touches[0].clientY);
      if (position) {
        position.x += x;
        position.y += y;

        this.setStyle({
          left: position.x + "px",
          top: position.y + "px",
        })

        this.updateLine();

        // this.graphNodeLayout.moveSelectAll(x + cx,y + cy,this);
        e.stopPropagation();
        e.preventDefault();
      }

    }

    const remove = () => {
      if (this.parent) {
        this.parent.$el.removeEventListener("touchmove", move);
        this.parent.$el.removeEventListener("touchend", remove);
        position = null;
        movement.x = 0;
        movement.y = 0;
      }

    }

    this.$el.addEventListener("touchstart", (e: PointerEvent) => {
      if (this.parent) {
        const boxinfo = this.$el.getBoundingClientRect();
        const parentinfo = this.parent.$el.getBoundingClientRect();
        position = {};
        position.x = boxinfo.left - parentinfo.left;
        position.y = boxinfo.top - parentinfo.top;

        this.parent.$el.addEventListener("touchmove", move);
        this.parent.$el.addEventListener("touchend", remove);
      }
      this.graphNodeLayout.cancelActive();
      this.graphNodeLayout.active(this);
      e.stopPropagation();
    });

    return this;
  }

  /**
   * 
   */
  deleteMobile() {
    this.$el.addEventListener("dblclick", () => {
      new AlertMsg.Alert().show("是否删除该节点", () => {
        this.delete();
        new Message().setMode(Message.SUCESS).show("删除成功");
      });
    })
  }

  // 初始化窗口标题
  initTitle(bgcolor = "#0069b1") {
    // 标题
    this.title = new Text(this.ClassName).setStyle({ "pointer-events": "none", "font-size": "12px" });
    this.titleLayout = new LinearLayout()
      .appendChild(this.title)
      .setStyle({
        "justify-content": "space-between",
        padding: "5px 10px",
        background: `linear-gradient(90deg, ${bgcolor}, #ffffff22)`,
        "aligin-item": 'center'
      })
    this.push(this.titleLayout);
    this.titleLayout.$el.oncopy = function () { return false; }

    this.title.setText(this.Class.alias + "(" + this.ClassName + ")");
  }

  // 初始化流程节点
  initLinkPoint(graphNodeLayout: GraphNodeLayout) {
    // 链接点
    const linearLayout = new LinearLayout()
      .setStyle({ "justify-content": "space-between" });
    this.entry = new LinkNodeUp(graphNodeLayout);
    this.ouput = new LinkNodeNext(graphNodeLayout).setStyle({ "margin-left": "40px" });

    linearLayout
      .appendChild(this.entry)
      .appendChild(this.ouput)
      .setStyle({ "padding": "10px" })

    this.push(linearLayout);

    this.setLinkNodeList("entry", this.entry);
    this.setLinkNodeList("ouput", this.ouput);
  }

  /**节点标题头
   * left, right = true 表示有连线点,
   * bgcolor，背景色
   */
  initTitle_LinkPoint(left = true, right = true, bgcolor = "#0069b1") {
    // 链接点
    const linearLayout = new LinearLayout()
      .setStyle({
        "justify-content": "space-between",
        background: `linear-gradient(90deg, ${bgcolor}, #ffffff22)`,
        "padding": "5px 10px",
        "align-items": "center"
      });

    if (left) {
      this.entry = new LinkNodeUp(this.graphNodeLayout).setStyle({ "margin-right": "10px" });
      linearLayout.appendChild(this.entry);
      this.setLinkNodeList("up", this.entry);
    }

    this.title = new Text(this.ClassName).setStyle({ "pointer-events": "none", "font-size": "12px" });
    linearLayout
      .appendChild(this.title);

    if (right) {
      this.ouput = new LinkNodeNext(this.graphNodeLayout).setStyle({ "margin-left": "40px" });
      linearLayout.appendChild(this.ouput);
      this.setLinkNodeList("next", this.ouput);
    }

    this.push(linearLayout);
    // 如果希望标题头有英文，则使用下面的代码
    // this.title.setText(this.Class.alias + "(" + this.ClassName.replace("Node", "") + ")");
    this.title.setText(this.Class.alias);
  }

  updateLine() {
    const info = this.graphNodeLayout.$el.getBoundingClientRect();
    Object.keys(this.linkNodeList).forEach(key => {
      this.linkNodeList[key].updatedLine(info);
    })
    return this;
  }

  setLinkNodeList(key: string, linkNode: LinkNode) {
    this.linkNodeList[key] = linkNode;
    linkNode.parentNode = this;
  }

  toObject(maps: string[] = [], targetLinkNode: LinkNode | undefined = undefined) {
    if (maps.indexOf(this.uuid) > -1) return {
      uuid: this.uuid,
      mode: "reference",
      nodeName: this.ClassName,
      linkNodeName: targetLinkNode?.alias || targetLinkNode?.typeName
    }

    maps.push(this.uuid);

    const boxinfo = this.$el.getBoundingClientRect();
    const parentinfo = this.parent?.$el.getBoundingClientRect();

    const position = { x: 0, y: 0 };

    position.x = boxinfo.left - parentinfo.left;
    position.y = boxinfo.top - parentinfo.top;

    const obj: { [k: string]: any; } = {
      uuid: this.uuid,
      mode: "next",
      nodeName: this.ClassName,
      outputs: {},
      entrys: {},
      data: this.getData(),
      position,
      linkNodeName: targetLinkNode?.alias || targetLinkNode?.typeName
    };

    Object.keys(this.linkNodeList).forEach(k => {
      const node: LinkNode = this.linkNodeList[k];
      if (node.mode == LinkNode.OUTPUT) {
        node.lines.forEach(line => {
          obj.outputs[line.startObject.alias || line.startObject.typeName] = line.endObject.parentNode.toObject(maps, line.endObject);
        })
      }
      else {
        node.lines.forEach(line => {
          obj.entrys[line.endObject.alias || line.endObject.typeName] = line.startObject.parentNode.toObject(maps, line.startObject);
        })
      }
    })

    Object.keys(this.linkNodeValues).forEach(k => {
      if (!obj.entrys[k]) {
        obj.entrys[k] = {
          uuid: this.uuid,
          mode: "value",
          nodeName: this.ClassName,
          linkNodeName: targetLinkNode?.alias || targetLinkNode?.typeName,
          value: this.linkNodeValues[k]
        }
      }
    })

    return obj;
  }

  /************* */
  outputNode(name: string, map: any[]) {
    if (this.linkNodeList[name] && this.linkNodeList[name].lines[0]) {
      return this.linkNodeList[name].lines[0].endObject.parentNode.toToken(
        map,
        this.linkNodeList[name].lines[0].endObject.alias
      );
    }
    return -1;
  }

  entryNode(name: string, map: any[]) {
    if (this.linkNodeList[name] && this.linkNodeList[name].lines[0]) {
      return this.linkNodeList[name].lines[0].startObject.parentNode.toToken(
        map,
        this.linkNodeList[name].lines[0].startObject.alias
      );
    }
    return -1;
  }

  outputNodeTemplate(token: any, name: string | string[] = "", map: any[]) {
    if (name instanceof Array) {
      name.forEach(n => {
        this.outputNodeTemplate(token, n, map);
      })
    }
    else {
      token[name] = this.outputNode(name, map);
      token["default_" + name] = this.linkNodeValues[name];
    }
  }

  entryNodeTemplate(token: any, name: string | string[] = "", map: any[]) {
    if (name instanceof Array) {
      name.forEach(n => {
        this.entryNodeTemplate(token, n, map);
      })
    }
    else {
      token[name] = this.entryNode(name, map);
      token["default_" + name] = this.linkNodeValues[name];
    }
  }

  setMapIndex(map: any[], index: number) {
    map[0][this.uuid] = index;
  }

  toToken(map: any[], linkNodeAlias = "") {
    if (map[0][this.uuid]) return {
      index: map[0][this.uuid],
      linkNodeAlias,
    };
    const index = this.getToken(map, linkNodeAlias);
    return index;
  }

  getToken(map: any[], linkNodeAlias = ""): any {
    const index = map.length;
    this.setMapIndex(map, index);
    return index;
  }

  getlinkNodeByAlias(alias: string) {

    for (const key in this.linkNodeList) {
      if (Object.prototype.hasOwnProperty.call(this.linkNodeList, key)) {
        const element = this.linkNodeList[key];
        if (element.alias == alias) return element;
      }
    }
  }

  /**想理解 container/left/right 的含义，可以看看 if 可视化节点的实现 */
  container_left_right() {
    const container = new LinearLayout().setStyle({ "justify-content": "space-between", "padding": "10px" });

    const left = new LinearLayout().setColumn(LinearLayout.Direction.column);
    const right = new LinearLayout().setColumn(LinearLayout.Direction.column).setStyle({ "margin-left": "10px" });

    container.appendChild(left);
    container.appendChild(right);
    return {
      container,
      left,
      right
    }
  }

  text_linkNode(graphNodeLayout: GraphNodeLayout, str = "", linkNodeTem: any = LinkNodeObjectOutput, alias: any = null) {
    const lin = new LinearLayout().setStyle({ "align-items": "center", "justify-content": "flex-end", "margin": "2.5px 0" });

    const text = new Text(str).setFontSize("12px").setStyle({ "margin-right": "10px" });
    const linkNode: LinkNode = new linkNodeTem(graphNodeLayout);
    linkNode.setLinkMaxCount(10000)

    lin.appendChild(text).appendChild(linkNode);

    if (alias) {
      this.setLinkNodeList(alias, linkNode);
      linkNode.setAlias(alias);
    }

    return {
      linearLayout: lin,
      text,
      linkNode
    }
  }

  linkNode_text(graphNodeLayout: GraphNodeLayout, str = "", linkNodeTem: any = LinkNodeObjectOutput, alias: any = null) {
    const lin = new LinearLayout().setStyle({ "align-items": "center", "justify-content": "space-between", "margin": "2.5px 0" });

    const text = new Text(str).setFontSize("12px").setStyle({ "margin": "0 10px" });
    const linkNode: LinkNode = new linkNodeTem(graphNodeLayout);

    lin.appendChild(linkNode).appendChild(text);

    if (alias) {
      this.setLinkNodeList(alias, linkNode);
      linkNode.setAlias(alias);
    }

    return {
      linearLayout: lin,
      text,
      linkNode
    }
  }

  linkNode_text_linkNode(graphNodeLayout: GraphNodeLayout, str = "", entry: any = LinkNodeObjectEntry, entryAlias: any = null, output: any = LinkNodeObjectOutput, outputAlias: any = null) {
    const lin = new LinearLayout().setStyle({ "align-items": "center", "justify-content": "space-between", "margin": "2.5px 0" });
    const text = new Text(str).setFontSize("12px").setStyle({ "margin": "0 10px" });
    const entryNode: LinkNode = new entry(graphNodeLayout);
    const outputNode: LinkNode = new output(graphNodeLayout).setLinkMaxCount(10000);

    lin.appendChild(entryNode).appendChild(text).appendChild(outputNode);

    if (entryAlias) {
      this.setLinkNodeList(entryAlias, entryNode);
      entryNode.setAlias(entryAlias);
    }
    if (outputAlias) {
      this.setLinkNodeList(outputAlias, outputNode);
      outputNode.setAlias(outputAlias);
    }

    return {
      linearLayout: lin,
      entryNode,
      text,
      outputNode
    }
  }

  linkNode_input(graphNodeLayout: GraphNodeLayout, str = "", linkNodeTem: any = LinkNodeObjectOutput, alias = "", isString = false) {
    const lin = new LinearLayout().setStyle({ "align-items": "center", /*"justify-content": "space-between",*/ "margin": "2.5px 0" });

    const text = new Text(str).setFontSize("12px").setStyle({ "margin": "0 5px" });
    const input = new Input().hint("默认值").setStyle({ "padding": "2px 5px", "font-size": "12px", "width": "66px", "outline": "none", "margin-left": '5px' });
    const linkNode: LinkNode = new linkNodeTem(graphNodeLayout);

    lin.appendChild(linkNode).appendChild(input).appendChild(text);
    linkNode.setAlias(alias);

    input.$el.addEventListener("mousedown", ((e: PointerEvent) => {
      e.stopPropagation();
    }))

    input.$el.addEventListener("keydown", ((e: PointerEvent) => {
      e.stopPropagation();
      // e.preventDefault();
      // return false;
    }))

    this.linkNodeValues[alias] = "";
    input.$el.addEventListener("change", () => {
      const value = input.$el.value.trim();
      this.linkNodeValues[alias] = value;
    })

    linkNode.input = input;

    this.setLinkNodeList(alias, linkNode);

    return {
      linearLayout: lin,
      text,
      linkNode,
      input
    }
  }

  linkNode_select(graphNodeLayout: GraphNodeLayout, str = "", option: object, linkNodeTem: any = LinkNodeObjectOutput, alias = "", isString = false) {
    const list = Object.keys(option)
    let selectValue = null
    const lin = new LinearLayout().setStyle({ "align-items": "center", "margin": "2.5px 0" });
    const text = new Text(str).setFontSize("12px").setStyle({ "margin": "0 5px" });
    const select = new Select()
      .setStyle({ "padding": "2px 5px", "font-size": "12px", "width": "80px", "outline": "none", "margin-left": '5px' })
      .adds(list)
      .setValue(list[0])
      .on("select", (el) => {
        selectValue = el.value;
      });

    const linkNode: LinkNode = new linkNodeTem(graphNodeLayout);

    lin.appendChild(linkNode).appendChild(select).appendChild(text);
    linkNode.setAlias(alias);

    // 将用户选中的值设置为默认值
    this.linkNodeValues[alias] = option[select.$el.value];
    // 更改选项时，更改 this.linkNodeValues[alias] 值
    select.$el.addEventListener("change", () => {
      const value = option[select.$el.value];
      console.log(value, 'value')
      this.linkNodeValues[alias] = value;
    })
    linkNode.input = select;
    this.setLinkNodeList(alias, linkNode);

    return {
      linearLayout: lin,
      text,
      linkNode,
      selectValue
    }
  }

  delete() {
    Object.keys(this.linkNodeList).forEach(k => {
      const linkNode: LinkNode = this.linkNodeList[k];
      linkNode.removeLines();
    })
    this.graphNodeLayout.removeChild(this);
    this.event.emit("close", this);
  }

  getData() {
    const obj: { [k: string]: any } = {
      linkNodeValues: {}
    };

    Object.keys(this.linkNodeValues || {}).forEach((k) => {
      obj.linkNodeValues[k] = this.linkNodeValues[k]
    })

    return obj;
  }

  setData(obj: { [k: string]: any }) {
    Object.keys(obj.linkNodeValues || {}).forEach((k) => {
      this.linkNodeList[k].input.$el.value = obj.linkNodeValues[k];
      this.linkNodeValues[k] = obj.linkNodeValues[k];
    })

    return
  }
}

// 函数
export class GFunction extends GraphNode {
  static alias = "函数";
  index = 0;
  varList: { [k: string]: any }[] = [];
  right: any;

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);
    this.initTitle_LinkPoint(false, true, "#6f0000");

    const { container, left, right } = this.container_left_right();
    this.appendChild(container);

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
      linkNodeName: linkNodeName
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
        console.log(data, el.value)
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
                    if (i > -1) this.varList.splice(i);
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
    return linearLayout;
  }

  getData() {
    return {
      ...super.getData(),
      varList: this.varList,
      index: this.index
    }
  }

  setData(obj: { [k: string]: any; }): void {
    super.setData(obj);
    obj.varList.forEach((item: any) => {
      this.right.appendChild(this.createVariable(this.graphNodeLayout, item.varName, item.varType, item.linkNodeName))
    })
    this.index = obj.index;
  }

  getToken(map: any[], linkNodeName = "") {
    const index = super.getToken(map);
    const parameter: any = [];
    const token = {
      type: "function",
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

// 引用函数
export class ReferenceFunction extends GraphNode {
  static alias = "引用函数";
  index = 0;
  varList: { [k: string]: any }[] = [];
  right: any;

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);
    this.initTitle_LinkPoint(false, true, "#6f0000");

    const { linearLayout } = this.linkNode_input(graphNodeLayout, "函数名称", LinkNodeStringEntry, "fun");
    this.appendChild(linearLayout);
    linearLayout.setStyle({ "padding": "10px" })

    const { container, left, right } = this.container_left_right();
    this.appendChild(container);

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
      linkNodeName: linkNodeName
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
                    if (i > -1) this.varList.splice(i);
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

    return linearLayout;
  }

  getData() {
    return {
      ...super.getData(),
      varList: this.varList,
      index: this.index
    }
  }

  setData(obj: { [k: string]: any; }): void {
    super.setData(obj);
    obj.varList.forEach((item: any) => {
      this.right.appendChild(this.createVariable(this.graphNodeLayout, item.varName, item.varType, item.linkNodeName))
    })

    this.index = obj.index;

  }

  getToken(map: any[], linkNodeName = "") {
    const index = super.getToken(map);
    const parameter: any = [];
    const token = {
      type: "referenceFunction",
      funName: "",
      parameter: parameter,
      next: null,
      uuid: this.uuid
    }

    this.varList.forEach(item => {
      token.parameter.push({
        name: item.varName,
        type: item.varType
      });
    });

    map.push(token);
    token.next = this.outputNode("next", map);

    return index;
  }
}

// TryCatchNode 异常处理
export class TryCatch extends GraphNode {
  static alias = "异常处理";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    const { container, left, right } = this.container_left_right();

    right.selfAuto(() => {
      const obj1 = this.text_linkNode(graphNodeLayout, "try", LinkNodeNext);
      right.appendChild(obj1.linearLayout);
      obj1.linkNode.setAlias("tryNext");
      this.setLinkNodeList("tryNext", obj1.linkNode);

      const obj2 = this.text_linkNode(graphNodeLayout, "catch", LinkNodeNext);
      right.appendChild(obj2.linearLayout);
      obj2.linkNode.setAlias("catchNext");
      this.setLinkNodeList("catchNext", obj2.linkNode);

      const obj3 = this.text_linkNode(graphNodeLayout, "错误", LinkNodeObjectOutput);
      right.appendChild(obj3.linearLayout.setStyle({ "margin-top": "10px" }));
      obj3.linkNode.setAlias("error");
      this.setLinkNodeList("error", obj3.linkNode);
      obj3.linkNode.setLinkMaxCount(10000);
    })

    this.appendChild(container);
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "tryCatch",
      funName: "",
      try: null,
      catch: null,
      next: null,
      uuid: this.uuid
    }

    map.push(token);

    token.try = this.outputNode("tryNext", map);
    token.catch = this.outputNode("catchNext", map);
    token.next = this.outputNode("next", map);

    return index;
  }
}

// if 判断
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

      const obj2 = this.text_linkNode(graphNodeLayout, "ELSE", LinkNodeNext);
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
      true: null,
      false: null,
      next: null,
      defaultCondition: this.linkNodeValues.condition,
      condition: null,
      uuid: this.uuid
    }

    map.push(token);

    token.true = this.outputNode("trueNext", map);
    token.false = this.outputNode("falseNext", map);
    token.next = this.outputNode("next", map);

    token.condition = this.entryNode("condition", map);

    return index;
  }
}

// 函数调用
export class FunctionCall extends GraphNode {
  static alias = "函数调用";
  left: any;
  varList: { [k: string]: any } = {};
  index = 0;
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    const { linearLayout } = this.linkNode_input(graphNodeLayout, "目标", LinkNodeFunctionEntry, "value");
    linearLayout.setStyle({ "justify-content": "flex-start", "padding": "10px" })
    this.push(linearLayout);

    const { container, left, right } = this.container_left_right();
    this.appendChild(container);
    this.left = left;

    this.appendChild(
      new LinearLayout()
        .setStyle({ "padding": "10px" })
        .justifyContent("flex-start")
        .appendChild(
          new Text("添加")
            .setStyle({ "font-size": "12px", "cursor": " pointer" })
            .selfAuto(el => {
              el.$el.addEventListener("click", () => {
                left.appendChild(this.createVariable(graphNodeLayout))
              })
            })
        )
    )

    right.selfAuto(el => {
      const { linearLayout, text, linkNode } = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeObjectOutput, "return");
      right.setStyle({ "margin-left": "30px" });
      el.appendChild(linearLayout);
      linkNode.setLinkMaxCount(10000);
    })

  }

  createVariable(graphNodeLayout: GraphNodeLayout, vname: any = null) {
    const varName = vname || "var_" + this.index++;

    const obj = this.linkNode_input(graphNodeLayout, "", LinkNodeAnyEntry, varName)
    const linearLayout = new LinearLayout().setStyle({ "margin": "2.5px 0" });
    const linkNodeBoxOutput = obj.linkNode;

    linearLayout
      .alignItems()
      .appendChild(
        obj.linearLayout
      )
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
                    this.left.removeChild(linearLayout);
                    this.graphNodeLayout.alert = null;
                    delete this.varList[varName];
                    delete this.linkNodeValues[varName];
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
              "margin-left": "10px",
              "cursor": "pointer"
            })
            el.$el.innerHTML = `<path d="M810 274l-238 238 238 238-60 60-238-238-238 238-60-60 238-238-238-238 60-60 238 238 238-238z" p-id="2753"></path>`
          })
      )

    this.setLinkNodeList(varName, linkNodeBoxOutput);

    this.varList[varName] = varName;
    return linearLayout;
  }

  getData() {
    return {
      ...super.getData(),
      varList: Object.keys(this.varList),
      index: this.index
    }
  }

  setData(obj: { [k: string]: any; }): void {
    this.index = obj.index;
    obj.varList.forEach((item: string) => {
      this.left.appendChild(this.createVariable(this.graphNodeLayout, item));

      this.linkNodeList[item].input.$el.value = obj.linkNodeValues[item];
      this.linkNodeValues[item] = obj.linkNodeValues[item];

      delete obj.linkNodeValues[item];
    })

    Object.keys(obj.linkNodeValues).forEach((k) => {
      this.linkNodeList[k].input.$el.value = obj.linkNodeValues[k];
      this.linkNodeValues[k] = obj.linkNodeValues[k];
    })
  }

  getToken(map: any[]) {
    const index = super.getToken(map);

    const parameter: any[] = [];
    const token = {
      type: "functionCall",
      defaultFunName: this.linkNodeValues.value,
      funName: null,
      next: null,
      parameter: parameter,
      uuid: this.uuid
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    token.funName = this.entryNode("value", map);

    Object.keys(this.varList).forEach(k => {
      const i = token.parameter.length;
      token.parameter.push({
        name: k,
        defaultValue: this.linkNodeValues[k],
        value: null,
      });
      token.parameter[i].value = this.entryNode(k, map);
    });

    return index;
  }
}

// 输出
export class Print extends GraphNode {
  static alias = "输出";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    const { linkNode, linearLayout } = this.linkNode_input(graphNodeLayout, "", LinkNodeAnyEntry, "value", true);

    this.push(
      new LinearLayout().setStyle({ "padding": "10px" })
        .appendChild(linearLayout)
    );
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "print",
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

// 输出
export class Log extends GraphNode {
  static alias = "控制台日志";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    const { linkNode, linearLayout } = this.linkNode_input(graphNodeLayout, "", LinkNodeAnyEntry, "value", true);

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

// 输入
export class InputNode extends GraphNode {
  static alias = "输入";
  value_: any = "";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle();

    const linearLayout = new LinearLayout()
      .setStyle({
        "justify-content": "space-between",
        "padding": "10px"
      })
      .appendChild(
        new Input()
          .setStyle({
            "color": "#808080",
            "width": "70px",
            "outline": "none",
            "font-size": "12px"
          })
          .selfAuto((el) => {
            this.input = el;
            Object.defineProperty(this, "value", {
              set(v: any) {
                el.$el.value = v;
                this.value_ = v;
              },
              get() {
                return this.value_;
              }
            })
            el.$el.addEventListener("keyup", () => {
              this.value_ = el.$el.value;
            })
          })
      )
      .appendChild(
        new LinkNodeStringOutput(graphNodeLayout)
          .setStyle({
            "margin-left": "20px"
          })
          .setAlias("value")
          .setIsNext(false)
          .selfAuto((el: any) => {
            this.setLinkNodeList("valueOutput", el);
          })
          .setLinkMaxCount(10000)
      )

    this.push(linearLayout);
  }

  getData() {
    console.log('getdata', this.value_)
    return {
      value: this.value_
    }
  }

  setData(obj: { [k: string]: any; }): void {
    this.value = obj.value;
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);
    const token = {
      type: "input",
      funName: "",
      next: null,
      value: this.value_.trim(),
      uuid: this.uuid
    }

    map.push(token);
    return { index, linkNodeAlias };
  }
}

// 输入颜色
export class InputColor extends GraphNode {
  static alias = "输入颜色";
  value_ = "rgb(0,0,0,1)";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle();

    this.remove(1);

    const linearLayout = new LinearLayout()
      .setStyle({
        "justify-content": "space-between",
        "padding": "10px"
      })
      .appendChild(
        new Input()
          .setAttribute("type", "color")
          .setStyle({
            "color": "#808080",
            "width": "70px",
            "outline": "none",
            "font-size": "12px"
          })
          .selfAuto((el) => {
            this.input = el;
            Object.defineProperty(this, "value", {
              set(v: any) {
                el.$el.value = v;
                this.value_ = v;
              },
              get() {
                return this.value_;
              }
            })
            el.$el.addEventListener("change", () => {
              this.value_ = el.$el.value;
            })
          })
      )
      .appendChild(
        new LinkNodeStringOutput(graphNodeLayout)
          .setStyle({
            "margin-left": "20px"
          })
          .setAlias("value")
          .setIsNext(false)
          .selfAuto((el: any) => {
            this.setLinkNodeList("valueOutput", el);
          })
          .setLinkMaxCount(10000)
      )

    this.push(linearLayout);
  }

  getData() {
    return {
      value: this.value_
    }
  }

  setData(obj: { [k: string]: any; }): void {
    this.value = obj.value;
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);
    const token = {
      type: "inputColor",
      funName: "",
      next: null,
      value: this.value_.trim(),
      uuid: this.uuid
    }

    map.push(token);
    return { index, linkNodeAlias };
  }
}

// 内置对象
export class BuiltInObjects extends GraphNode {
  static alias = "内置对象";
  value_: any;
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle();

    const linearLayout = new LinearLayout()
      .setStyle({
        "justify-content": "space-between",
        "padding": "10px"
      })
      .appendChild(
        new Input()
          .setTag("textarea")
          .setStyle({
            "color": "#808080",
            "width": "200px",
            "height": "30px",
            "outline": "none",
            "font-size": "14px",
            "padding": "10px"
          })
          .selfAuto((el) => {
            this.input = el;
            Object.defineProperty(this, "value", {
              set(v: any) {
                el.$el.value = v;
                this.value_ = v;
              },
              get() {
                return this.value_;
              }
            })
            el.$el.addEventListener("keyup", () => {
              this.value_ = el.$el.value;
            });
            el.$el.addEventListener("mousedown", (e: PointerEvent) => {
              e.stopPropagation();
            })
          })
      )
      .appendChild(
        new LinkNodeObjectOutput(graphNodeLayout)
          .setStyle({
            "margin-left": "20px"
          })
          .setAlias("object")
          .setIsNext(false)
          .selfAuto((el: any) => {
            this.setLinkNodeList("objectOutput", el);
          })
          .setLinkMaxCount(10000)
      )

    this.push(linearLayout);
  }

  getData() {
    return {
      value: this.value_
    }
  }

  setData(obj: { [k: string]: any; }): void {
    this.value = obj.value;
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);
    const token = {
      type: "builtInObjects",
      value: this.value_.trim(),
      uuid: this.uuid
    }

    map.push(token);
    return { index, linkNodeAlias };
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
                  .setTypeName(linkNodeType.number)
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

export class ForIn extends GraphNode {
  static alias = "ForIn循环";
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
      })
      .appendChild(
        new LinearLayout()
          .setStyle({ "justify-content": "space-between" })
          .setColumn(LinearLayout.Direction.column)
          .selfAuto(el => {
            const { linearLayout, input } = this.linkNode_input(graphNodeLayout, "目标", LinkNodeObjectEntry, "target");
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
              .setStyle({ "justify-content": "space-between", "margin-top": "20px", "align-items": "center" })
              .appendChild(
                new Text("键")
                  .setStyle({
                    "font-size": "12px"
                  })
              )
              .appendChild(
                new LinkNodeStringOutput(graphNodeLayout)
                  .setAlias("key")
                  .setIsNext(false)
                  .setLinkMaxCount(10000)
                  .selfAuto((el: any) => {
                    this.setLinkNodeList("keyOutput", el);
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
      type: "forIn",
      forBody: null,
      next: null,
      uuid: this.uuid,

      defaultTarget: this.linkNodeValues.target,
      target: null,
    }

    map.push(token);

    token.forBody = this.outputNode("forBody", map);
    token.next = this.outputNode("next", map);

    token.target = this.entryNode("target", map);

    return index;
  }
}

export class ForOf extends GraphNode {
  static alias = "ForOf循环";
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
      })
      .appendChild(
        new LinearLayout()
          .setStyle({ "justify-content": "space-between" })
          .setColumn(LinearLayout.Direction.column)
          .selfAuto(el => {
            const { linearLayout, input } = this.linkNode_input(graphNodeLayout, "目标", LinkNodeObjectEntry, "target");
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
              .setStyle({ "justify-content": "space-between", "margin-top": "20px", "align-items": "center" })
              .appendChild(
                new Text("值")
                  .setStyle({
                    "font-size": "12px"
                  })
              )
              .appendChild(
                new LinkNodeObjectOutput(graphNodeLayout)
                  .setAlias("value")
                  .setIsNext(false)
                  .setLinkMaxCount(10000)
                  .selfAuto((el: any) => {
                    this.setLinkNodeList("valueOutput", el);
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
      type: "forOf",
      forBody: null,
      next: null,
      uuid: this.uuid,

      defaultTarget: this.linkNodeValues.target,
      target: null,
    }

    map.push(token);

    token.forBody = this.outputNode("forBody", map);
    token.next = this.outputNode("next", map);

    token.target = this.entryNode("target", map);

    return index;
  }
}

// while
export class While extends GraphNode {
  static alias = "循环";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(true, true);

    const { container, left, right } = this.container_left_right();

    left.selfAuto(() => {
      const condition = this.linkNode_input(graphNodeLayout, "条件", LinkNodeBooleanEntry, "condition");
      left.appendChild(condition.linearLayout);
    });

    right.selfAuto(() => {
      const obj1 = this.text_linkNode(graphNodeLayout, "循环体", LinkNodeNext, "whileBody");
      right.appendChild(obj1.linearLayout);
    });



    this.appendChild(container);
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "while",
      uuid: this.uuid,

      whileBody: null,
      next: null,

      condition: null,
      defaultCondition: this.linkNodeValues.condition
    }

    map.push(token);

    token.condition = this.entryNode("condition", map);

    token.whileBody = this.outputNode("whileBody", map);
    token.next = this.outputNode("next", map);
    return index;
  }
}

// do-While
export class DoWhile extends GraphNode {
  static alias = "循环";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(true, true);

    const { container, left, right } = this.container_left_right();

    left.selfAuto(() => {
      const condition = this.linkNode_input(graphNodeLayout, "条件", LinkNodeBooleanEntry, "condition");
      left.appendChild(condition.linearLayout);
    });

    right.selfAuto(() => {
      const obj1 = this.text_linkNode(graphNodeLayout, "循环体", LinkNodeNext, "whileBody");
      right.appendChild(obj1.linearLayout);
    });


    this.appendChild(container);
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "doWhile",
      uuid: this.uuid,

      whileBody: null,
      next: null,

      condition: null,
      defaultCondition: this.linkNodeValues.condition
    }

    map.push(token);

    token.condition = this.entryNode("condition", map);

    token.whileBody = this.outputNode("whileBody", map);
    token.next = this.outputNode("next", map);
    return index;
  }
}

// 中断
export class Break extends GraphNode {
  static alias = "中断";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);
    this.initTitle_LinkPoint(true, false);
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "break",
    }

    map.push(token);
    return index;
  }
}

// 继续
export class Continue extends GraphNode {
  static alias = "继续执行";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(true, false);
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "continue",
    }

    map.push(token);
    return index;
  }
}

// 类型转换成布尔
export class CastToBoolean extends GraphNode {
  static alias = "转换布尔";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    const linearLayout = new LinearLayout().setStyle({ "padding": "10px" });

    linearLayout
      .setStyle({
        "justify-content": "space-between",
        "align-items": "center"
      })
      .appendChild(
        new LinkNodeAnyEntry(graphNodeLayout)
          .setAlias("valueEntry")
          .selfAuto((el: any) => {
            this.setLinkNodeList("valueEntry", el);
          })
      )
      .selfAuto((el) => {
        const { linearLayout, linkNode } = this.text_linkNode(graphNodeLayout, "布尔", LinkNodeBooleanOutput);
        el.appendChild(linearLayout);
        this.setLinkNodeList("booleanEntry", linkNode);

        linearLayout.setStyle({
          "margin-left": "20px"
        })
        linkNode.setLinkMaxCount(10000).setAlias("valueOutput");
      })
    this.push(linearLayout);
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);
    const token = {
      type: "castToBoolean",
      value: null,
      uuid: this.uuid,
    }

    map.push(token);

    token.value = this.entryNode("valueEntry", map);

    return { index, linkNodeAlias };
  }
}

// 类型转换成字符串
export class CastToString extends GraphNode {
  static alias = "转换字符串";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    const linearLayout = new LinearLayout().setStyle({ "padding": "10px" });

    linearLayout
      .setStyle({
        "justify-content": "space-between",
        "align-items": "center"
      })
      .appendChild(
        new LinkNodeAnyEntry(graphNodeLayout)
          .setAlias("valueEntry")
          .selfAuto((el: any) => {
            this.setLinkNodeList("valueEntry", el);
          })
      )
      .selfAuto((el) => {
        const { linearLayout, linkNode } = this.text_linkNode(graphNodeLayout, "字符串", LinkNodeStringOutput);
        el.appendChild(linearLayout);
        this.setLinkNodeList("stringEntry", linkNode);

        linearLayout.setStyle({
          "margin-left": "20px"
        })
        linkNode.setLinkMaxCount(10000).setAlias("valueOutput");
      })

    this.push(linearLayout);
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);
    const token = {
      type: "castToString",
      value: null,
      uuid: this.uuid,
    }

    map.push(token);

    token.value = this.entryNode("valueEntry", map);

    return { index, linkNodeAlias };
  }
}

// 类型转换成数值
export class CastToNumber extends GraphNode {
  static alias = "转换数值";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    const linearLayout = new LinearLayout().setStyle({ "padding": "10px" });

    linearLayout
      .setStyle({
        "justify-content": "space-between",
        "align-items": "center"
      })
      .appendChild(
        new LinkNodeAnyEntry(graphNodeLayout)
          .setAlias("valueEntry")
          .selfAuto((el: any) => {
            this.setLinkNodeList("valueEntry", el);
          })
      )
      .selfAuto((el) => {
        const { linearLayout, linkNode } = this.text_linkNode(graphNodeLayout, "数值", LinkNodeNumberOutput);
        el.appendChild(linearLayout);
        this.setLinkNodeList("numberEntry", linkNode);

        linearLayout.setStyle({
          "margin-left": "20px"
        })
        linkNode.setLinkMaxCount(10000).setAlias("valueOutput");
      })

    this.push(linearLayout);
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);
    const token = {
      type: "castToNumber",
      value: null,
      uuid: this.uuid,
    }

    map.push(token);

    token.value = this.entryNode("valueEntry", map);

    return { index, linkNodeAlias };
  }
}

// 类型转换成函数
export class CastToFunction extends GraphNode {
  static alias = "转换函数";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    const linearLayout = new LinearLayout().setStyle({ "padding": "10px" });

    linearLayout
      .setStyle({
        "justify-content": "space-between",
        "align-items": "center"
      })
      .appendChild(
        new LinkNodeAnyEntry(graphNodeLayout)
          .setAlias("valueEntry")
          .selfAuto((el: any) => {
            this.setLinkNodeList("valueEntry", el);
          })
      )
      .selfAuto((el) => {
        const { linearLayout, linkNode } = this.text_linkNode(graphNodeLayout, "函数", LinkNodeFunctionOutput);
        el.appendChild(linearLayout);
        this.setLinkNodeList("functionEntry", linkNode);

        linearLayout.setStyle({
          "margin-left": "20px"
        })
        linkNode.setLinkMaxCount(10000).setAlias("valueOutput");
      })

    this.push(linearLayout);
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);
    const token = {
      type: "castToFunction",
      value: null,
      uuid: this.uuid,
    }

    map.push(token);

    token.value = this.entryNode("valueEntry", map);

    return { index, linkNodeAlias };
  }
}

// 定义变量
export class DefineVariable extends GraphNode {
  static alias = "定义变量";
  variableName_: any = "";
  variableValue_: any = "";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    this.variableName_ = "name" + this.uuid;

    graphNodeLayout.variables.push(this);

    this.on("close", () => {
      const index = graphNodeLayout.variables.indexOf(this);
      if (index > -1) graphNodeLayout.variables.splice(index, 1);
    })

    new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setStyle({
        "padding": "10px",
        "justify-content": "space-between",
        "align-items": "center",
      })
      .appendChild(
        new LinearLayout()
          .setColumn(LinearLayout.Direction.column)
          .appendChild(
            new LinearLayout()
              .setStyle({ "justify-content": "space-between" })
              .appendChild(
                new Text("变量名称")
                  .setStyle({
                    "font-size": "12px"
                  })
              )
              .appendChild(
                new Input()
                  .setStyle({
                    "margin-left": "10px",
                    "width": "70px",
                    "outline": "none",
                    "font-size": "12px"
                  })
                  .selfAuto((el) => {
                    el.$el.value = this.variableName_;
                    Object.defineProperty(this, "variableName", {
                      set(v: any) {
                        el.$el.value = v;
                        this.variableName_ = v;
                      },
                      get() {
                        return this.variableName_;
                      }
                    })
                    el.$el.addEventListener("keyup", () => {
                      this.variableName_ = el.$el.value;
                    })
                  })
              )
          )
          .selfAuto(el => {
            const { linearLayout } = this.linkNode_input(graphNodeLayout, "值", LinkNodeAnyEntry, "variableValue");
            this.appendChild(linearLayout);
            linearLayout.setStyle({ "padding": "10px" })
          })
      )
      .appendChild(
        new LinkNodeObjectOutput(graphNodeLayout)
          .setStyle({
            "margin-left": "20px",
          })
          .setAlias("value")
          .setIsNext(false)
          .setLinkMaxCount(10000)
          .selfAuto((el: any) => {
            this.setLinkNodeList("valueEntry", el);
          })
      )
  }

  getData() {
    return {
      ...super.getData(),
      variableName: this.variableName,
      variableValue: this.variableValue,
    }
  }

  setData(obj: { [k: string]: any; }): void {
    super.setData(obj);
    this.variableName = obj.variableName;
    this.variableValue = obj.variableValue;
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "defineVariable",
      next: null,
      uuid: this.uuid,

      varName: this.variableName,

      defaultValue: this.linkNodeValues.variableValue,
      value: null,
    }

    map.push(token);

    token.value = this.entryNode("variableValue", map);

    token.next = this.outputNode("next", map);

    return index;
  }
}

// 变量引用
export class VariableReference extends GraphNode {
  static alias = "变量引用";
  variableName = "";
  variableObject: any;
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    // this.initTitle();

    new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setStyle({
        "padding": "10px",
        "justify-content": "space-between",
        "align-items": "center"
      })
      .appendChild(
        new Text("选择变量名称")
          .setStyle({ "cursor": "pointer" })
          .setFontSize("12px")
          .selfAuto(el => {
            this.variableObject = el;
            el.$el.addEventListener("dblclick", () => {
              const list: string[] = [];
              graphNodeLayout.variables.forEach(item => {
                list.push(item.variableName_);
              });
              graphNodeLayout.appendChild(
                new BoxSelect(graphNodeLayout).set(list)
                  .on("clickItem", res => {
                    el.setText(res.value);
                    this.variableName = res.value;
                  })
              );
            })
          })
      )
      .appendChild(
        new LinkNodeObjectOutput(graphNodeLayout)
          .setAlias("value")
          .setStyle({
            "margin-left": "20px"
          })
          .setLinkMaxCount(10000)
          .selfAuto((el: any) => {
            this.setLinkNodeList("valueOutput", el);
          })
      )
  }

  getData() {
    return {
      variableName: this.variableName,
    }
  }

  setData(obj: { [k: string]: any; }): void {
    this.variableName = obj.variableName;
    this.variableObject.setText(obj.variableName);
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);
    const token = {
      uuid: this.uuid,
      type: "variableReference",
      varName: this.variableName,
    }

    map.push(token);
    return { index, linkNodeAlias };
  }
}

// 变量赋值
// 对象属性获取节点属性
export class SetVariable extends GraphNode {
  static alias = "变量赋值";
  value_: any;
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setColumn(LinearLayout.Direction.column)
      .setStyle({
        "padding": "10px",
        "justify-content": "flex-start",
      })
      .selfAuto(el => {
        const target = this.linkNode_input(graphNodeLayout, "目标对象", LinkNodeObjectEntry, "target");
        el.appendChild(target.linearLayout);

        const value = this.linkNode_input(graphNodeLayout, "值", LinkNodeAnyEntry, "value");
        el.appendChild(value.linearLayout);
      })
  }

  getData() {
    return {
      ...super.getData(),
      attrName: this.value_
    }
  }

  setData(obj: { [k: string]: any; }): void {
    super.setData(obj);
    this.value = obj.attrName;
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      uuid: this.uuid,
      type: "setVariable",
      next: null,
      defaultVarName: this.linkNodeValues.target,
      varName: null,
      defaultValue: this.linkNodeValues.value,
      value: null,
    }

    map.push(token);
    token.varName = this.entryNode("target", map);
    token.value = this.entryNode("value", map);
    token.next = this.outputNode("next", map);
    return index;
  }
}

//  循环时间定时器
export class SetInterval extends GraphNode {
  static alias = "循环时间定时器";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(true, true, "#9900b1");

    new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setStyle({
        "padding": "10px",
        "justify-content": "space-between",
        "align-items": "center"
      })
      .appendChild(
        new LinearLayout()
          .setStyle({ "justify-content": "space-between" })
          .setColumn(LinearLayout.Direction.column)
          .selfAuto(el => {
            const { linearLayout } = this.linkNode_input(graphNodeLayout, "时间", LinkNodeNumberEntry, "time");

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
                new Text("定时体")
                  .setStyle({
                    "font-size": "12px",
                    "margin-right": "10px"
                  })
              )
              .appendChild(
                new LinkNodeNext(graphNodeLayout)
                  .setAlias("timeBody")
                  .setIsNext(false)
                  .setLinkMaxCount(10000)
                  .selfAuto((el: any) => {
                    this.setLinkNodeList("timeBody", el);
                  })
              )
          )
      )

    this.appendChild(
      new LinearLayout()
        .setStyle({
          "justify-content": "flex-end",
          "padding": "10px",
          "align-items": "center",
        })
        .appendChild(
          new Text("定时标志")
            .setFontSize("12px")
            .setStyle({ "margin-right": "10px" })
        )
        .appendChild(
          new LinkNodeNumberOutput(graphNodeLayout)
            .setAlias("flag")
            .setLinkMaxCount(10000)
            .selfAuto((el: any) => {
              this.setLinkNodeList("flagOutput", el);
            })
        )
    )
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "setInterval",
      uuid: this.uuid,
      next: null,
      timeBody: null,

      defaultTime: this.linkNodeValues.time,
      time: null,
    }

    map.push(token);

    token.timeBody = this.outputNode("timeBody", map);
    token.next = this.outputNode("next", map);

    token.time = this.entryNode("time", map);

    return index;
  }
}

// 清除循环定时标志
export class ClearInterval extends GraphNode {
  static alias = "清除循环定时器";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    const linearLayout = new LinearLayout().setStyle({ "padding": "10px" });

    linearLayout
      .setStyle({
        "justify-content": "space-between"
      })
      .appendChild(
        new LinkNodeNumberEntry(graphNodeLayout)
          .setAlias("flag")
          .selfAuto((el: any) => {
            this.setLinkNodeList("flag", el);
          })
      )

    this.push(linearLayout);
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "clearInterval",
      uuid: this.uuid,
      next: null,

      flag: null,
    }

    map.push(token);

    token.next = this.outputNode("next", map);

    token.flag = this.entryNode("flag", map);

    return index;
  }
}

//  时间定时器
export class SetTimeout extends GraphNode {
  static alias = "时间定时器";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.vid = DefineVariable.id++;

    this.initTitle_LinkPoint(true, true, "#9900b1");

    new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setStyle({
        "padding": "10px",
        "justify-content": "space-between",
        "align-items": "center"
      })
      .appendChild(
        new LinearLayout()
          .setStyle({ "justify-content": "space-between" })
          .setColumn(LinearLayout.Direction.column)
          .selfAuto(el => {
            const { linearLayout } = this.linkNode_input(graphNodeLayout, "时间", LinkNodeNumberEntry, "time");

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
                new Text("定时体")
                  .setStyle({
                    "font-size": "12px",
                    "margin-right": "10px"
                  })
              )
              .appendChild(
                new LinkNodeNext(graphNodeLayout)
                  .setAlias("timeBody")
                  .setIsNext(false)
                  .setLinkMaxCount(10000)
                  .selfAuto((el: any) => {
                    this.setLinkNodeList("timeBody", el);
                  })
              )
          )
      )

    this.appendChild(
      new LinearLayout()
        .setStyle({
          "justify-content": "flex-end",
          "padding": "10px",
          "align-items": "center",
        })
        .appendChild(
          new Text("定时标志")
            .setFontSize("12px")
            .setStyle({ "margin-right": "10px" })
        )
        .appendChild(
          new LinkNodeNumberOutput(graphNodeLayout)
            .setAlias("flag")
            .setLinkMaxCount(10000)
            .selfAuto((el: any) => {
              this.setLinkNodeList("flagOutput", el);
            })
        )
    )
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "setTimeout",
      uuid: this.uuid,
      next: null,
      timeBody: null,

      defaultTime: this.linkNodeValues.time,
      time: null,
    }

    map.push(token);

    token.timeBody = this.outputNode("timeBody", map);
    token.next = this.outputNode("next", map);

    token.time = this.entryNode("time", map);

    return index;
  }
}

// 清除定时标志
export class ClearTimeout extends GraphNode {
  static alias = "清除定时器";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    const linearLayout = new LinearLayout().setStyle({ "padding": "10px" });

    linearLayout
      .setStyle({
        "justify-content": "space-between"
      })
      .appendChild(
        new LinkNodeNumberEntry(graphNodeLayout)
          .setAlias("flag")
          .selfAuto((el: any) => {
            this.setLinkNodeList("flagEntry", el);
          })
      )

    this.push(linearLayout);
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "clearTimeout",
      uuid: this.uuid,
      next: null,

      flag: null,
    }

    map.push(token);

    token.next = this.outputNode("next", map);

    token.flag = this.entryNode("flag", map);

    return index;
  }
}

// QuerySelector
export class QuerySelector extends GraphNode {
  static alias = "获取元素对象";
  value_: any;
  input: any;
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    const { container, left, right } = this.container_left_right();
    this.appendChild(container);

    left.selfAuto(el => {
      const target = this.linkNode_input(graphNodeLayout, "目标", LinkNodeObjectEntry, "target");
      left.appendChild(target.linearLayout);

      const select = this.linkNode_input(graphNodeLayout, "选择器", LinkNodeStringEntry, "select");
      left.appendChild(select.linearLayout);
      select.input.hint("请输入选择器");
    });

    right.selfAuto(el => {
      const target = this.text_linkNode(graphNodeLayout, "", LinkNodeObjectOutput, "value");
      right.appendChild(target.linearLayout);
    })
  }

  getData() {
    return {
      select: this.value_
    }
  }

  setData(obj: { [k: string]: any; }): void {
    this.value = obj.select;
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "querySelector",
      uuid: this.uuid,
      next: null,

      defaultTarget: this.linkNodeValues.target,
      target: null,

      defaultSelect: this.linkNodeValues.select,
      select: null
    }

    map.push(token);

    token.target = this.entryNode("target", map);
    token.select = this.entryNode("select", map);

    token.next = this.outputNode("next", map);
    return index;
  }
}

// 返回值节点
export class Return extends GraphNode {
  static alias = "返回值";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);
    this.initTitle_LinkPoint(true, false);

    const { left, container, right } = this.container_left_right();
    this.appendChild(container);

    const { linearLayout, linkNode } = this.linkNode_input(graphNodeLayout, "返回值", LinkNodeAnyEntry, "value");
    left.appendChild(linearLayout)
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "return",
      uuid: this.uuid,

      defaultValue: this.linkNodeValues.value,
      value: null
    }

    map.push(token);

    token.value = this.entryNode("value", map);
    return index;
  }
}

// 获取类实例
export class Instance extends GraphNode {
  static alias = "new 实例化类";
  left: any;
  varList: { [k: string]: any } = {};
  index = 0;
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();

    const { linearLayout } = this.linkNode_input(graphNodeLayout, "目标", LinkNodeFunctionEntry, "value");
    linearLayout.setStyle({ "justify-content": "flex-start", "padding": "10px" })
    this.push(linearLayout);

    const { container, left, right } = this.container_left_right();
    this.appendChild(container);
    this.left = left;

    this.appendChild(
      new LinearLayout()
        .setStyle({ "padding": "10px" })
        .justifyContent("flex-start")
        .appendChild(
          new Text("添加")
            .setStyle({ "font-size": "12px", "cursor": " pointer" })
            .selfAuto(el => {
              el.$el.addEventListener("click", () => {
                left.appendChild(this.createVariable(graphNodeLayout))
              })
            })
        )
    )

    right.selfAuto(el => {
      const { linearLayout, text, linkNode } = this.text_linkNode(graphNodeLayout, "对象", LinkNodeObjectOutput);
      right.setStyle({ "margin-left": "30px" });
      el.appendChild(linearLayout);
      linkNode.setLinkMaxCount(10000);
      linkNode.setAlias("returnOutput");
      this.setLinkNodeList("returnOutput", linkNode);
    })

  }

  createVariable(graphNodeLayout: GraphNodeLayout, vname: any = null) {
    const varName = vname || "var_" + this.index++;

    const obj = this.linkNode_input(graphNodeLayout, "", LinkNodeAnyEntry, varName)
    const linearLayout = new LinearLayout().setStyle({ "margin": "2.5px 0" });
    const linkNodeBoxOutput = obj.linkNode;

    linearLayout
      .alignItems()
      .appendChild(
        obj.linearLayout
      )
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
                    this.left.removeChild(linearLayout);
                    this.graphNodeLayout.alert = null;
                    delete this.varList[varName];
                    delete this.linkNodeValues[varName];
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
              "margin-left": "10px",
              "cursor": "pointer"
            })
            el.$el.innerHTML = `<path d="M810 274l-238 238 238 238-60 60-238-238-238 238-60-60 238-238-238-238 60-60 238 238 238-238z" p-id="2753"></path>`
          })
      )

    this.setLinkNodeList(varName, linkNodeBoxOutput);

    this.varList[varName] = varName;
    return linearLayout;
  }

  getData() {
    return {
      ...super.getData(),
      varList: Object.keys(this.varList),
      index: this.index
    }
  }

  setData(obj: { [k: string]: any; }): void {
    this.index = obj.index;
    obj.varList.forEach((item: string) => {
      this.left.appendChild(this.createVariable(this.graphNodeLayout, item));

      this.linkNodeList[item].input.$el.value = obj.linkNodeValues[item];
      this.linkNodeValues[item] = obj.linkNodeValues[item];

      delete obj.linkNodeValues[item];
    })

    Object.keys(obj.linkNodeValues).forEach((k) => {
      this.linkNodeList[k].input.$el.value = obj.linkNodeValues[k];
      this.linkNodeValues[k] = obj.linkNodeValues[k];
    })
  }

  getToken(map: any[]) {
    const index = super.getToken(map);

    const parameter: any[] = [];
    const token = {
      type: "instance",
      defaultFunName: this.linkNodeValues.value,
      funName: null,
      next: null,
      parameter: parameter,
      uuid: this.uuid
    }

    map.push(token);

    token.next = this.outputNode("next", map);
    token.funName = this.entryNode("value", map);

    Object.keys(this.varList).forEach(k => {
      const i = token.parameter.length;
      token.parameter.push({
        name: k,
        defaultValue: this.linkNodeValues[k],
        value: null,
      });
      token.parameter[i].value = this.entryNode(k, map);
    });

    return index;
  }
}

export class This extends GraphNode {
  static alias = "This";
  value_: any;
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    const linearLayout = new LinearLayout()
      .setStyle({
        "justify-content": "space-between",
        "padding": "10px",
        "align-items": "center"
      })
      .appendChild(
        new Text("this").setFontSize("12px")
      )
      .appendChild(
        new LinkNodeObjectOutput(graphNodeLayout)
          .setStyle({
            "margin-left": "20px"
          })
          .setAlias("this")
          .setIsNext(false)
          .selfAuto((el: any) => {
            this.setLinkNodeList("thisOutput", el);
          })
          .setLinkMaxCount(10000)
      )

    this.push(linearLayout);
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "this_",
      uuid: this.uuid
    }

    map.push(token);
    return { index, linkNodeAlias };
  }

}

// 参数数组节点
export class Arguments extends GraphNode {
  static alias = "参数数组";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    const linearLayout = new LinearLayout()
      .setStyle({
        "justify-content": "space-between",
        "padding": "10px",
        "align-items": "center"
      })
      .appendChild(
        new Text("arguments").setFontSize("12px")
      )
      .appendChild(
        new LinkNodeObjectOutput(graphNodeLayout)
          .setStyle({
            "margin-left": "20px"
          })
          .setAlias("this")
          .setIsNext(false)
          .selfAuto((el: any) => {
            this.setLinkNodeList("thisOutput", el);
          })
          .setLinkMaxCount(10000)
      )

    this.push(linearLayout);
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "arguments",
      uuid: this.uuid
    }

    map.push(token);
    return { index, linkNodeAlias };
  }
}

// 文档对象
export class Document extends GraphNode {
  static alias = "文档对象";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    const linearLayout = new LinearLayout()
      .setStyle({
        "justify-content": "space-between",
        "padding": "10px",
        "align-items": "center"
      })
      .appendChild(
        new Text("document").setFontSize("12px")
      )
      .appendChild(
        new LinkNodeObjectOutput(graphNodeLayout)
          .setStyle({
            "margin-left": "20px"
          })
          .setAlias("document")
          .setIsNext(false)
          .selfAuto((el: any) => {
            this.setLinkNodeList("thisOutput", el);
          })
          .setLinkMaxCount(10000)
      )

    this.push(linearLayout);
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "document",
      uuid: this.uuid
    }

    map.push(token);
    return { index, linkNodeAlias };
  }
}

// Window对象
export class Window extends GraphNode {
  static alias = "Window对象";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    const linearLayout = new LinearLayout()
      .setStyle({
        "justify-content": "space-between",
        "padding": "10px",
        "align-items": "center"
      })
      .appendChild(
        new Text("window").setFontSize("12px")
      )
      .appendChild(
        new LinkNodeObjectOutput(graphNodeLayout)
          .setStyle({
            "margin-left": "20px"
          })
          .setAlias("window")
          .setIsNext(false)
          .selfAuto((el: any) => {
            this.setLinkNodeList("thisOutput", el);
          })
          .setLinkMaxCount(10000)
      )

    this.push(linearLayout);
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "window",
      uuid: this.uuid
    }

    map.push(token);
    return { index, linkNodeAlias };
  }
}

// body对象
export class Body extends GraphNode {
  static alias = "body对象";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    const linearLayout = new LinearLayout()
      .setStyle({
        "justify-content": "space-between",
        "padding": "10px",
        "align-items": "center"
      })
      .appendChild(
        new Text("body").setFontSize("12px")
      )
      .appendChild(
        new LinkNodeObjectOutput(graphNodeLayout)
          .setStyle({
            "margin-left": "20px"
          })
          .setAlias("window")
          .setIsNext(false)
          .selfAuto((el: any) => {
            this.setLinkNodeList("thisOutput", el);
          })
          .setLinkMaxCount(10000)
      )

    this.push(linearLayout);
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "body",
      uuid: this.uuid
    }

    map.push(token);
    return { index, linkNodeAlias };
  }
}

// Promise
export class GPromise extends GraphNode {
  static alias = "Promise";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(true, true, "#15a700");

    const { container, left, right } = this.container_left_right();

    right.selfAuto(() => {
      const obj1 = this.text_linkNode(graphNodeLayout, "任务", LinkNodeNext, "task");
      right.appendChild(obj1.linearLayout);

      const resolve = this.text_linkNode(graphNodeLayout, "resolve", LinkNodeFunctionOutput, "resolve");
      right.appendChild(resolve.linearLayout);
      resolve.linkNode.setLinkMaxCount(10000);

      const reject = this.text_linkNode(graphNodeLayout, "reject", LinkNodeFunctionOutput, "reject");
      right.appendChild(reject.linearLayout);
      reject.linkNode.setLinkMaxCount(10000);


      const obj2 = this.text_linkNode(graphNodeLayout, "成功", LinkNodeNext, "success");
      right.appendChild(obj2.linearLayout);
      obj2.linearLayout.setStyle({ "margin-top": "20px" });

      const result = this.text_linkNode(graphNodeLayout, "result", LinkNodeObjectOutput, "result");
      right.appendChild(result.linearLayout);
      result.linkNode.setLinkMaxCount(10000);

      const obj3 = this.text_linkNode(graphNodeLayout, "失败", LinkNodeNext, "fail");
      right.appendChild(obj3.linearLayout);
      obj3.linearLayout.setStyle({ "margin-top": "20px" });

      const error = this.text_linkNode(graphNodeLayout, "error", LinkNodeObjectOutput, "error");
      right.appendChild(error.linearLayout);
      error.linkNode.setLinkMaxCount(10000);
    });

    this.appendChild(container);
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "promise",
      uuid: this.uuid,

      task: null,
      success: null,
      fail: null,
      next: null
    }

    map.push(token);

    token.task = this.outputNode("task", map);
    token.success = this.outputNode("success", map);
    token.fail = this.outputNode("fail", map);

    token.next = this.outputNode("next", map);
    return index;
  }
}

// getBoundingClientRect
export class GetBoundingClientRect extends GraphNode {
  static alias = "元素信息";

  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(true, true);

    const { container, left, right } = this.container_left_right();

    left.selfAuto(() => {
      const target = this.linkNode_input(graphNodeLayout, "目标", LinkNodeObjectEntry, "target");
      left.appendChild(target.linearLayout);
    });

    right.selfAuto(() => {
      const object = this.text_linkNode(graphNodeLayout, "object", LinkNodeObjectOutput, "object");
      right.appendChild(object.linearLayout);

      const left_ = this.text_linkNode(graphNodeLayout, "left", LinkNodeNumberOutput, "left");
      right.appendChild(left_.linearLayout);

      const right_ = this.text_linkNode(graphNodeLayout, "right", LinkNodeNumberOutput, "right");
      right.appendChild(right_.linearLayout);

      const top = this.text_linkNode(graphNodeLayout, "top", LinkNodeNumberOutput, "top");
      right.appendChild(top.linearLayout);

      const bottom = this.text_linkNode(graphNodeLayout, "bottom", LinkNodeNumberOutput, "bottom");
      right.appendChild(bottom.linearLayout);

      const width = this.text_linkNode(graphNodeLayout, "width", LinkNodeNumberOutput, "width");
      right.appendChild(width.linearLayout);

      const height = this.text_linkNode(graphNodeLayout, "height", LinkNodeNumberOutput, "height");
      right.appendChild(height.linearLayout);

      const x = this.text_linkNode(graphNodeLayout, "x", LinkNodeNumberOutput, "x");
      right.appendChild(x.linearLayout);

      const y = this.text_linkNode(graphNodeLayout, "y", LinkNodeNumberOutput, "y");
      right.appendChild(y.linearLayout);
    });

    this.appendChild(container);
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);

    const token = {
      type: "getBoundingClientRect",
      uuid: this.uuid,

      defaultTarget: this.linkNodeValues.target,
      target: null,
      next: null
    }

    map.push(token);

    token.target = this.entryNode("target", map);
    token.next = this.outputNode("next", map);
    return index;
  }
}

// JSON.parse
// JSON.stringify
export class JSONParse extends GraphNode {
  static alias = "解析";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle();

    new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setStyle({
        "padding": "10px",
        "justify-content": " space-between",
        "align-items": "center"
      })
      .appendChild(
        new LinearLayout()
          .setColumn(LinearLayout.Direction.column)
          .selfAuto(el => {
            const { linearLayout } = this.linkNode_input(graphNodeLayout, "目标", LinkNodeObjectEntry, "target");
            el.appendChild(linearLayout);
          })
      )
      .appendChild(
        new LinkNodeObjectOutput(graphNodeLayout)
          .setStyle({
            "margin-left": "20px"
          })
          .setIsNext(false)
          .setAlias("value")
          .setLinkMaxCount(10000)
          .selfAuto((el: any) => {
            this.setLinkNodeList("value", el);
          })
      )
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);
    const token = {
      uuid: this.uuid,
      type: "JSONParse",
      defaultTarget: this.linkNodeValues.target,
      target: null
    }

    map.push(token);
    token.target = this.entryNode("target", map);

    return { index, linkNodeAlias };
  }
}

export class JSONStringify extends GraphNode {
  static alias = "转换";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle();

    new LinearLayout()
      .selfAuto((el => this.push(el)))
      .setStyle({
        "padding": "10px",
        "justify-content": " space-between",
        "align-items": "center"
      })
      .appendChild(
        new LinearLayout()
          .setColumn(LinearLayout.Direction.column)
          .selfAuto(el => {
            const { linearLayout } = this.linkNode_input(graphNodeLayout, "目标", LinkNodeObjectEntry, "target");
            el.appendChild(linearLayout);
          })
      )
      .appendChild(
        new LinkNodeStringOutput(graphNodeLayout)
          .setStyle({
            "margin-left": "20px"
          })
          .setIsNext(false)
          .setAlias("value")
          .setLinkMaxCount(10000)
          .selfAuto((el: any) => {
            this.setLinkNodeList("value", el);
          })
      )
  }

  getToken(map: any[], linkNodeAlias = "") {
    const index = super.getToken(map);
    const token = {
      uuid: this.uuid,
      type: "JSONStringify",
      defaultTarget: this.linkNodeValues.target,
      target: null,
    }

    map.push(token);
    token.target = this.entryNode("target", map);

    return { index, linkNodeAlias };
  }
}

export class RegExpInput extends GraphNode {
  static alias = "正则表达式";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint(false, false);

    const { container, left, right } = this.container_left_right();
    this.appendChild(container);

    left.selfAuto(() => {
      const target = this.linkNode_input(graphNodeLayout, "", LinkNodeStringEntry, "target");
      left.appendChild(target.linearLayout);
      target.linkNode.removeTo();
    });

    right.selfAuto(() => {
      const value = this.text_linkNode(graphNodeLayout, "", LinkNodeObjectOutput, "reg");
      right.appendChild(value.linearLayout);
    });
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "regExpInput",
      uuid: this.uuid,
    }

    map.push(token);

    this.entryNodeTemplate(token, ["target"], map);
    return index;
  }
}