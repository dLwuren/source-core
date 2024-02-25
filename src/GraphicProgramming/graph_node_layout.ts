// 画布 一切内容的集合
import { CustomElement } from "./element/custom_element";
import { Line } from "./element/group";
import { AbsoluteLayout, LinearLayout } from "./element/layout";
import { LinkNode } from "./link_node";

import { Input, Text, Div } from "./element/Element";
import { BaseMenuList, NodeMenu, VarMenu } from "./graph_menu_list";
import { copy, paste } from "./utils/CopyPaste";
import { Message } from "./utils/message";

// 自定义的
import * as Base from "./graph/Base";
import * as Application from "./graph/Application";
import * as TextHandler from "./graph/Text";
import * as Process from "./graph/Process";
import * as Keyboard_mouse from "./graph/Keyboard_mouse";
import * as Os from "./graph/Os";
import * as DataType from "./graph/DataType";
import * as Window from "./graph/Window";
import * as file from "./graph/File";
import * as Mind from "./graph/Mind";

// 自带的
import * as Group from "./graph/BaseNode";
import * as Newtwork from "./graph/Network";
import * as Object_ from "./graph/Object";
import * as ArrayNode from "./graph/Array"
import * as arithmetic_peration from "./graph/arithmetic_peration"
import * as logical_operation from "./graph/logical_operation"
import * as String_ from "./graph/String";

export class GraphNodeLayout extends AbsoluteLayout {
  activeLine: Line | undefined;
  activeLinkNode: LinkNode | undefined;
  openActiveLinkNode: LinkNode | undefined;
  // 被选中的节点
  nodeList: CustomElement[] = [];
  variables: Group.DefineVariable[] = [];
  isMenu = false;
  alert: any;
  // 当前激活的图形节点
  activeGraphNodes: Group.GraphNode[] = [];
  // 菜单列表
  menus: BaseMenuList[] = [];

  // 入口节点
  // entryNode = Group.GFunction;
  entryNode = Base.Start;

  constructor() {
    super();
    // 背景画布样式
    this.setStyle({
      "background-image": `
            linear-gradient(0deg,#444 0px,#444 1px,transparent 1px,transparent 100px),
            linear-gradient(90deg,#444 0px,#444 1px,transparent 1px,transparent 100px);`,
      "background-size": "40px 40px",
      "background-position": "0 0,15px 15px",
      "overflow": " auto",
      "background-color": "#333",
      "width": "10000px",
      "height": "10000px",
      "position": "absolute",
    })

    this.initMenuEvent();
    this.initEvent();
    this.setAttribute("tabindex", 0);

    // 自定义
    // this.setMenu(new VarMenu(this))
    this.setMenu(new NodeMenu(Base, "基础"))
    this.setMenu(new NodeMenu(Process, "流程"))
    this.setMenu(new NodeMenu(DataType, "数据类型"))
    this.setMenu(new NodeMenu(Keyboard_mouse, "键鼠操作"))
    this.setMenu(new NodeMenu(TextHandler, "文字"))
    this.setMenu(new NodeMenu(Application, "应用"))
    this.setMenu(new NodeMenu(Os, "系统"))
    this.setMenu(new NodeMenu(Window, "窗口"))
    this.setMenu(new NodeMenu(file, "文件"))
    this.setMenu(new NodeMenu(Mind, "思维导图"))

    // 自带的
    // this.setMenu(new NodeMenu(Group, "基础"))
    // this.setMenu(new NodeMenu(arithmetic_peration, "算数运算"))
    // this.setMenu(new NodeMenu(logical_operation, "逻辑运算"))
    // this.setMenu(new NodeMenu(String_, "字符串"))
    // this.setMenu(new NodeMenu(Object_, "对象"))
    // this.setMenu(new NodeMenu(ArrayNode, "数组"))
    // this.setMenu(new NodeMenu(Newtwork, "网络"))

    // this.import() // 初始化画布时导入
  }

  /**初始化菜单事件 */
  initMenuEvent() {
    let currentLin: any = null;
    // this.$el 表示当前组件的根 DOM 元素
    this.$el.addEventListener("mousedown", (e: PointerEvent) => {
      // 鼠标右键值为 2
      if (e.buttons == 2) {
        if (currentLin) {
          this.removeChild(currentLin);
          currentLin = null;
        }

        this.isMenu = true;
        const lin = this.createMenu(e.offsetX, e.offsetY);

        const close = () => {
          // this.removeChild(lin);
          this.$el.removeEventListener("click", close);
          this.isMenu = false;
        }

        this.$el.addEventListener("click", close);

        lin.$el.addEventListener("click", (e: PointerEvent) => {
          e.stopPropagation();
        })

        const infoP = this.$el.parentNode.getBoundingClientRect();
        const info = lin.$el.getBoundingClientRect();

        const x = e.pageX - infoP.left;
        const y = e.pageY - infoP.top;

        if (x + info.width > infoP.width) {
          lin.setStyle({
            "left": (e.offsetX - info.width) + "px",
          })
        }

        if (y + info.height > infoP.height) {
          lin.setStyle({
            "top": (e.offsetY - info.height) + "px",
          })
        }

        currentLin = lin;
      }
    })

    let time = 0;
    let x = 0;
    let y = 0;
    this.$el.addEventListener("touchstart", (e: TouchEvent) => {
      time = new Date().getTime();
      x = e.changedTouches[0].pageX;
      y = e.changedTouches[0].pageY;
      if (currentLin) {
        this.removeChild(currentLin);
        currentLin = null;
      }
    })

    this.$el.addEventListener("touchend", (e: TouchEvent) => {
      if (new Date().getTime() - time > 800 && Math.abs((e.changedTouches[0].pageX - x) * (e.changedTouches[0].pageY - y)) < 100) {
        const info = this.$el.getBoundingClientRect();
        const offsetX = x - info.left, offsetY = y - info.top;
        const lin = this.createMenu(offsetX, offsetY, false);

        currentLin = lin;

        lin.setStyle({
          "position": "fixed",
          "left": '50%',
          "top": "50%",
          "transform": "translate(-50%,-50%)"
        })

        lin.$el.addEventListener("touchstart", (e: TouchEvent) => {
          e.stopPropagation();
        })

        time = 10000000000;
      }
    })
  }

  /**创建右键菜单 */
  createMenu(x: number, y: number, focus = true) {
    // 右键菜单主体
    const box = new LinearLayout()
      .setColumn(LinearLayout.Direction.column)
      .setStyle({
        "width": "250px",
        "max-width": "100vw",
        "height": "300px",
        "background": "#fff",
        "position": "absolute",
        "z-index": "2",
        "padding": "5px 10px 5px 5px",
        "font-size": "13px",
        "border-radius": "5px"
      });

    this.appendChild(box, x + "px", y + "px");

    // 列表项
    const box1 = new LinearLayout()
      .setColumn(LinearLayout.Direction.column)
      .setStyle({
        "overflow": "hidden",
        "overflow-y": "auto",
        "margin-top": "10px",
        "flex": "1",
      })

    let input: any;
    const inputEle = new Input()
      .setStyle({
        "font-size": "12px",
        "width": "90%",
        "outline": "none",
        "padding": "5px",
        "box-sizing": " border-box",
        "border": "solid 1px rgb(203, 203, 203)",
      })
      .setAttribute("placeholder", "节点名称")
      .selfAuto(el => {
        input = el;
        if (focus) setTimeout(() => {
          el.$el.focus();
        })
      })
    const closeEle = new Div()
      .setHtml(`<svg t="1701865641696" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
      p-id="15117" width="20" height="20">
      <path
        d="M576 512l277.333333 277.333333-64 64-277.333333-277.333333L234.666667 853.333333 170.666667 789.333333l277.333333-277.333333L170.666667 234.666667 234.666667 170.666667l277.333333 277.333333L789.333333 170.666667 853.333333 234.666667 576 512z"
        fill="#515151" p-id="15118"></path>
    </svg>`)
      .setStyle({
        "position": "absolute",
        "right": "0px",
        "padding": "5px",
        "margin-right": "3px",
        "cursor": "pointer",
        "font-size": "12px",
        "line-height": "20px",
      })
      .selfAuto(el => {
        el.$el.addEventListener("click", () => {
          this.removeChild(box)
        })
      })
    const lin = new LinearLayout()
      .setColumn(LinearLayout.Direction.row)
      .appendChild(inputEle)
      .appendChild(closeEle)

    // 将输入框添加到菜单
    box.appendChild(lin);

    function match(target: string, str: string) {
      if (str.trim() == "") return true;
      if (target.toLocaleLowerCase().match(str.toLocaleLowerCase())) {
        return true;
      }
      return false;
    }

    /**重新创建列表项内容 */
    const create = (value: string) => {
      box1.$el.innerHTML = "";
      this.menus.forEach(item => {
        const { add, clickItem, remove } = this.createChildMenu(item.getName(), box1);

        let max = 0;
        for (let i = 0; i < item.getCount(); i++) {
          // const n = item.getItem(i);
          let n
          if (item.getTarget()[item.getItem(i)]?.alias) {
            n = item.getTarget()[item.getItem(i)].alias + ' (' + item.getItem(i) + ')'
          } else {
            n = item.getItem(i)
          }

          if (match(n, value)) {
            max++;
            // 添加到菜单子项，顺带给子项绑定点击插入节点事件
            add(n, i);
          }
        }

        if (max == 0) remove();

        clickItem((name: string, index: number) => {
          // 向画布插入节点
          item.clickItem(name, index, x, y, this);
          // 点击后注销掉右键菜单
          // this.removeChild(box);
        })
      })
    }

    let timeF: any = null;
    let upv = "";
    // 输入框绑定 keyup 事件
    input.$el.addEventListener("keyup", () => {
      // 使用 trim()去除前后的空格
      // 当前的输入值是否和之前的值相同，如果相同，则 return
      if (upv == input.$el.value.trim()) return;

      upv = input.$el.value.trim()
      // 取消之前设置的定时器，防止频繁触发 create()
      if (timeF) clearTimeout(timeF);

      timeF = setTimeout(() => {
        create(upv);
        // 将 timeF 变量设为 null，表示定时器已经完成
        timeF = null;
      }, 200)
    });

    create("");
    // 将列表项添加到菜单
    box.appendChild(box1);
    return box;
  }

  /**创建右键菜单里面的节点（列表项） */
  createChildMenu(name: string, parent: LinearLayout) {
    const box = new LinearLayout().setColumn(LinearLayout.Direction.column);
    parent.appendChild(box);
    const lin = new LinearLayout()
      .setColumn(LinearLayout.Direction.column)
      .setStyle({
        "padding-left": "10px"
      });

    let isNone = false;
    let svg: any;
    let height = 0;

    box.appendChild(
      new LinearLayout()
        .alignItems("center")
        .appendChild(
          new Text()
            .selfAuto(el => {
              svg = el;
            })
            .setStyle({
              "transform": "rotateZ(0deg)",
              "transition": "0.25s"
            })
            .setHtml(`<svg t="1678672878051" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2884" width="12" ><path d="M573.056 752l308.8-404.608A76.8 76.8 0 0 0 820.736 224H203.232a76.8 76.8 0 0 0-61.056 123.392l308.8 404.608a76.8 76.8 0 0 0 122.08 0z" fill="#888" p-id="2885"></path></svg>`)
        )
        .appendChild(new Text(name).setStyle({ "margin-left": "10px" }))
        .setStyle({
          "cursor": "pointer",
          "font-size": "12px",
          // 子项类别的颜色
          "color": "#0085ff",
        })
        .selfAuto(el => {
          el.$el.addEventListener("click", () => {
            isNone = !isNone;
            lin.setStyle({ "height": isNone ? "0px" : height + "px", "overflow": "hidden", "transition": "0.25s" });
            svg.setStyle({
              "transform": isNone ? "rotateZ(-90deg)" : "rotateZ(0deg)"
            });
          })
        })
    ).appendChild(lin);

    setTimeout(() => {
      height = box.$el.getBoundingClientRect().height;
      lin.setStyle({ "height": isNone ? "0px" : height + "px" });
    });

    let clickItem: any;
    return {
      /**移除列表项 */
      remove() {
        parent.removeChild(box);
      },
      clickItem(fun: (name: string, index: number) => void) {
        clickItem = fun;
      },
      add(name: string, index: number) {
        lin.appendChild(
          new CustomElement()
            .setStyle({
              "cursor": "pointer",
              "padding": "2.5px 10px",
              "color": "#333"
            })
            .appendChild(new Text(name))
            .selfAuto(el => {
              el.$el.addEventListener("click", () => {
                const regex = /\((.*?)\)/g;  // 使用非贪婪匹配，获取圆括号内的内容（含括号）
                !clickItem || clickItem(name.match(regex).map(match => match.slice(1, -1)), index);
              })
            })
        );
      }
    };
  }

  /**将模块加载到右键菜单 */
  setMenu(menu: BaseMenuList) {
    this.menus.push(menu);
    return this;
  }

  addMenu(menu: BaseMenuList) {
    this.setMenu(menu);
  }

  /**清空右键菜单 */
  clearMenu() {
    this.menus.length = 0;
  }

  /**获取图像节点。遍历菜单获取可用节点有哪些 */
  getGraphNodes() {
    let obj = {};
    for (let i = 0; i < this.menus.length; i++) {
      const nodes = this.menus[i].getTarget();
      obj = {
        ...obj,
        ...nodes,
      }
    }
    return obj;
  }

  /**初始化事件 */
  initEvent() {
    let isSpace = false;
    let isControl = false;
    const margin = { left: 0, top: 0 };

    let removeFun: any = null;
    this.$el.addEventListener("mousedown", (e: MouseEvent) => {
      if (e.buttons == 1 && isSpace) {
        removeFun = this.pageMove(e, margin);
      }
      else if (isControl) {
        this.selectBox(e);
      }
      else {
        this.cancelActive();
        this.selectBox(e);
      }
    });

    this.$el.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.code == "Delete") {
        this.delete();
      }
      else if (e.code == "Space") {
        isSpace = true;
        this.setStyle({
          "cursor": 'grab'
        })
      }
      else if (e.code == "ControlLeft" || e.code == "ControlRight") {
        isControl = true;
      }
      else if (isControl && e.code == "KeyA") {
        e.stopPropagation();
        e.preventDefault();
        return false;
      }
      else if (e.code == "ArrowUp") {
        margin.top = Math.min(0, margin.top + 10);
        this.setStyle({
          "margin-top": margin.top + "px",
        });

      }
      else if (e.code == "ArrowDown") {
        margin.top = Math.max(-10000, margin.top - 10);
        this.setStyle({
          "margin-top": margin.top + "px",
        });
      }
      else if (e.code == "ArrowLeft") {
        margin.left = Math.min(0, margin.left + 10);
        this.setStyle({
          "margin-left": margin.left + "px",
        });

      }
      else if (e.code == "ArrowRight") {
        margin.left = Math.max(-10000, margin.left - 10);
        this.setStyle({
          "margin-left": margin.left + "px",
        });
      }
    })

    this.$el.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.code == "Space") {
        isSpace = false;
        this.setStyle({
          "cursor": "default"
        })
        if (removeFun) removeFun();
        removeFun = null;
      }
      else if (e.code == "ControlLeft" || e.code == "ControlRight") {
        isControl = false;
      }
      else if (isControl && e.code == "KeyC") {
        this.copy();
      }
      else if (isControl && e.code == "KeyX") {
        this.copy();
        this.delete();
      }
      else if (isControl && e.code == "KeyV") {
        this.paste();
      }
      else if (isControl && e.code == "KeyA") {
        this.allActive();
      }
    })

    this.$el.addEventListener("touchstart", (e: TouchEvent) => {
      this.pageMoveMobile(e, margin);
    })
  }

  /**页面移动 */
  pageMove(e: MouseEvent, margin: any) {
    const move = (e: MouseEvent) => {
      margin.left = Math.min(0, margin.left + e.movementX);
      margin.top = Math.min(0, margin.top + e.movementY);

      this.setStyle({
        "margin-left": margin.left + "px",
        "margin-top": margin.top + "px",
      });
    }

    const remove = (e: MouseEvent) => {
      this.$el.removeEventListener("mouseup", remove);
      this.$el.removeEventListener("mousemove", move);
    }

    this.$el.addEventListener("mouseup", remove);
    this.$el.addEventListener("mousemove", move);

    return remove;
  }

  /**移动端页面移动 */
  pageMoveMobile(e: TouchEvent, margin: any) {
    const point = {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY,
    }
    const move = (e: TouchEvent) => {
      margin.left = Math.min(0, margin.left + e.touches[0].pageX - point.x);
      margin.top = Math.min(0, margin.top + e.touches[0].pageY - point.y);

      point.x = e.touches[0].pageX;
      point.y = e.touches[0].pageY;

      this.setStyle({
        "margin-left": margin.left + "px",
        "margin-top": margin.top + "px",
        // transform: `translate(${margin.left}px,${margin.top}px)`
      });

      e.stopPropagation();
      e.preventDefault();
    }

    const remove = (e: TouchEvent) => {
      this.$el.removeEventListener("touchend", remove);
      this.$el.removeEventListener("touchmove", move);
    }

    this.$el.addEventListener("touchend", remove);
    this.$el.addEventListener("touchmove", move);

    return remove;
  }

  /**选择盒子。鼠标左键拖动时会创建一个选择盒子 */
  selectBox(e: MouseEvent) {
    const point = { x: -1, y: -1 };
    let selectBox: any = null;
    point.x = e.offsetX;
    point.y = e.offsetY;
    selectBox = new CustomElement();
    selectBox.setStyle({
      position: "absolute",
      left: point.x + "px",
      top: point.y + "px",
      background: "rgba(41,110,235,0.2)",
      // pointer-events 是 css 属性，用于控制元素如何响应鼠标或触摸事件。
      // 值为 none：元素不响应任何鼠标或触摸事件，鼠标事件会穿透到元素下方的元素。
      "pointer-events": "none",
      "z-index": "10003"
    });

    this.appendChild(selectBox, point.x + "px", point.y + "px");

    this.pointerEvents("none");

    const move = (e: MouseEvent) => {
      if (selectBox) {
        const x = e.offsetX;
        const y = e.offsetY;
        selectBox.setStyle({
          width: x - point.x + "px",
          height: y - point.y + "px",
        })
      }
    }

    const remove = (e: MouseEvent) => {
      this.$el.removeEventListener("mouseup", remove);
      this.$el.removeEventListener("mousemove", move);

      this.removeChild(selectBox);
      selectBox = null;

      const infoP = this.$el.getBoundingClientRect();
      const arr: Group.GraphNode[] = [];

      const boxW = e.offsetX - point.x;
      const boxH = e.offsetY - point.y;

      this.nodeList.forEach(node => {
        if (node instanceof Group.GraphNode) {
          const info = node.$el.getBoundingClientRect();
          const x = info.left - infoP.left;
          const y = info.top - infoP.top;

          const hopeW = info.width + boxW;
          const hopeH = info.height + boxH;

          const realityW = e.offsetX - x;
          const realityH = e.offsetY - y;

          if (realityW > 0 && realityW < hopeW && realityH > 0 && realityH < hopeH) {
            arr.push(node);
          }
        }
      })

      this.active(arr);
      this.pointerEvents("all");
    }

    this.$el.addEventListener("mouseup", remove);
    this.$el.addEventListener("mouseleave", move);
    this.$el.addEventListener("mousemove", move);

    return remove;
  }

  /**是否取消图形节点事件 */
  pointerEvents(value = "all") {
    this.nodeList.forEach(node => {
      if (node instanceof Group.GraphNode) {
        node.setStyle({
          // 添加 css 。pointer-events = all 表示无论元素是否透明，都可以从中触发鼠标或触摸事件，
          // 并且不会传递事件到元素下方的其他元素
          "pointer-events": value
        })
      }
    })
  }

  /**激活。节点被激活时调整样式，使之周边有光圈 */
  active(nodes: Group.GraphNode[] | Group.GraphNode) {
    // 节点被框选中时执行
    if (nodes instanceof Array) {
      nodes.forEach(node => {
        if (this.activeGraphNodes.indexOf(node) > -1) return;
        node.setStyle({
          "border": "solid 2px #fff"
        })

        this.activeGraphNodes.push(node);
      })
    }
    // 被点击选择时执行
    else {
      if (this.activeGraphNodes.indexOf(nodes) > -1) return;
      nodes.setStyle({
        "border": "solid 2px #fff"
      })

      this.activeGraphNodes.push(nodes);
    }
  }

  /**是否是激活 */
  isActive(nodes: Group.GraphNode) {
    const index = this.activeGraphNodes.indexOf(nodes);
    if (index > -1) return true;
    return false;
  }

  /**激活所有节点 */
  allActive() {
    this.cancelActive();

    const newNodes: Group.GraphNode[] = [];
    this.nodeList.forEach((node: any) => {
      if (node instanceof Group.GraphNode) newNodes.push(node);
    })

    this.active(newNodes);
  }

  /**取消激活 */
  cancelActive() {
    while (this.activeGraphNodes.length) {
      const node = this.activeGraphNodes.pop();
      if (node) {
        node.setStyle({
          "border": "solid 2px transparent"
        })
      }
    }
  }

  /**实现节点的 copy */
  copy() {
    if (!this.activeGraphNodes.length) return;
    const list: { [k: string]: any } = { nodes: [], minx: 10000, miny: 10000 };

    const parentInfo = this.$el.getBoundingClientRect();
    this.activeGraphNodes.forEach(node => {
      if (node instanceof Group.GraphNode) {
        const info = node.$el.getBoundingClientRect();

        list.minx = Math.min(list.minx, info.left - parentInfo.left);
        list.miny = Math.min(list.miny, info.top - parentInfo.top);
        list.nodes.push(
          {
            nodeType: node.ClassName,
            position: {
              left: info.left - parentInfo.left,
              top: info.top - parentInfo.top,
            },
            data: node.getData()
          }
        );
      }
    })

    const str = JSON.stringify(list);
    copy(str);
  }

  /**实现节点的 paste */
  paste() {
    paste((text: string) => {
      try {
        const list = JSON.parse(text);
        const nodes: { [k: string]: any } = this.getGraphNodes();
        this.cancelActive();
        const newNodes: Group.GraphNode[] = [];
        list.nodes.forEach((nodeInfo: any) => {
          const node: Group.GraphNode = new nodes[nodeInfo.nodeType](this);
          if (nodeInfo.data) node.setData(nodeInfo.data);
          this.appendChild(node);
          node.setStyle({
            left: nodeInfo.position.left + 20 + "px",
            top: nodeInfo.position.top + 20 + "px",
          })
          newNodes.push(node);
        })
        this.active(newNodes);
      }
      catch (err) {
        console.log(err);
      }
    });
  }

  delete() {
    while (this.activeGraphNodes.length) {
      const node: any = this.activeGraphNodes.pop();
      node.delete();
    }
  }

  /**移动选中元素 */
  moveSelectAll(x: number, y: number, currentNode: Group.GraphNode) {
    if (!this.moveFlag) {
      this.moveFlag = true;
      x += this.moveX || 0;
      y += this.moveY || 0;
      const parentinfo = this.$el.getBoundingClientRect();

      this.activeGraphNodes.forEach(node => {
        if (node instanceof Group.GraphNode) {
          if (node == currentNode) return;
          const boxinfo = node.$el.getBoundingClientRect();
          node.setStyle({
            left: (boxinfo.left - parentinfo.left + x) + "px",
            top: (boxinfo.top - parentinfo.top + y) + "px",
          })
          node.updateLine();
        }
      });

      this.moveX = 0;
      this.moveY = 0;
      setTimeout(() => { this.moveFlag = false }, 10);
    }
    else {
      this.moveX += x;
      this.moveY += y;
    }

  }

  /**将一个节点附加到节点列表的末尾处 */
  appendChild(el: CustomElement, x: any = "0px", y: any = "0px") {
    if (el instanceof Base.Start) {
      for (let i = 0; i < this.nodeList.length; i++) {
        const node = this.nodeList[i];
        if (node instanceof Base.Start) {
          // 有多个 GFunction 节点时弹出警告
          new Message().setMode(Message.WARN).show("函数入口已经存在，请勿重复创建！", 3000)
          return this;
        }
      }
    }

    if (el instanceof Process.Signal) {
      for (let i = 0; i < this.nodeList.length; i++) {
        const node = this.nodeList[i];
        if (node instanceof Process.Signal) {
          new Message().setMode(Message.WARN).show("只允许存在一个信号启动器！", 3000)
          return this;
        }
      }
    }

    if (x instanceof Number) x = x + "px";
    if (y instanceof Number) y = y + "px";
    this.$el.appendChild(el.$el);
    this.event.emit("appendChild", el);
    el.setPosition(x, y);
    el.parent = this;

    this.nodeList.push(el);
    return this;
  }

  /**删除节点后还要将子节点一并删除 */
  removeChild(el: CustomElement): this {
    super.removeChild(el);

    const index = this.nodeList.indexOf(el);
    if (index > -1) this.nodeList.splice(index, 1);

    return this;
  }

  /**在给定的 target 对象中查找指定名称为 name 的链接节点列表 */
  selectLinkNode(target: Group.GraphNode, name = "") {
    for (const key in target.linkNodeList) {
      if (Object.prototype.hasOwnProperty.call(target.linkNodeList, key)) {
        const nodeList = target.linkNodeList[key];
        if (nodeList.alias == name) return nodeList;
      }
    }
    return null;
  }

  /**将当前对象的节点列表化为一个树状结构，并生成相应的映射关系 */
  toToken() {
    // 存储将要生成的树状结构
    const tree: any = [];
    // 存储生成的映射关系
    const maps: any[] = [
      {}
    ];

    // 遍历 this.nodeList 数组中的每一个节点
    this.nodeList.forEach(node => {
      if (node instanceof this.entryNode) {
        tree.push(node.toToken(maps));
      }

      else if (node instanceof Group.ReferenceFunction) {
        tree.push(node.toToken(maps));
      }
    })

    return {
      maps, tree
    }
  }

  /**导出数据以保存工作状态 */
  export() {
    const list: { [k: string]: any } = {
      nodes: [],
      lines: [],
      margin: {
        left: this.style["margin-left"] || "0px",
        top: this.style["margin-top"] || "0px",
      }
    };

    this.nodeList.forEach(node => {
      if (node instanceof Line) {
        if (node.startObject && node.endObject) {
          list.lines.push(
            {
              start: {
                uuid: node.startObject.parentNode.uuid,
                linkNodeName: node.startObject.alias
              },
              end: {
                uuid: node.endObject.parentNode.uuid,
                linkNodeName: node.endObject.alias
              },
            }
          );
        }
      }
      else if (node instanceof Group.GraphNode) {
        list.nodes.push(
          {
            uuid: node.uuid,
            nodeType: node.ClassName,
            position: {
              left: node.style.left,
              top: node.style.top,
            },
            data: node.getData()
          }
        );
      }
      else {
        console.log(node.ClassName);
      }
    })

    return list;
  }

  /**导入数据 */
  import(obj: any) {
    // this.setStyle({
    //     "margin-left": obj.margin?.left,
    //     "margin-top": obj.margin?.top,
    // });

    const nodeObject: { [k: string]: any } = {};
    const nodes: { [k: string]: any } = this.getGraphNodes();

    obj.nodes.forEach((nodeInfo: any) => {
      if (!nodes[nodeInfo.nodeType]) return;
      const node: Group.GraphNode = new nodes[nodeInfo.nodeType](this);
      node.uuid = nodeInfo.uuid;
      if (nodeInfo.data) node.setData(nodeInfo.data);
      this.appendChild(node);
      node.setStyle({
        left: nodeInfo.position.left,
        top: nodeInfo.position.top,
      })

      nodeObject[nodeInfo.uuid] = node;
    })

    obj.lines.forEach((lineInfo: any) => {
      const line = new Line();
      const endNode = nodeObject[lineInfo.end.uuid];
      const startNode = nodeObject[lineInfo.start.uuid];

      if (!endNode || !startNode) {
        return
      }

      const endLinkNodde = this.selectLinkNode(endNode, lineInfo.end.linkNodeName);
      const startLinkNodde = this.selectLinkNode(startNode, lineInfo.start.linkNodeName);

      endLinkNodde?.lines.push(line);
      startLinkNodde?.lines.push(line);

      line.endObject = endLinkNodde;
      line.startObject = startLinkNodde;

      this.appendChild(line);

      if (startLinkNodde?.bgColor) {
        line.path.stroke(startLinkNodde?.bgColor);

        startLinkNodde?.setStyle({
          background: startLinkNodde?.bgColor
        });
      }

      if (startLinkNodde?.bgColor) {
        endLinkNodde?.setStyle({
          background: startLinkNodde?.bgColor
        });
      }

    })

    Object.keys(nodeObject).forEach(k => {
      nodeObject[k].updateLine();
    })

    return this;
  }
}