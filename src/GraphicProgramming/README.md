简单谈谈该项目的架构。核心部分都在 GrphicProgramming 这个文件夹中。



## 项目架构

`graph_menu_list 文件夹` 提供菜单的实例化、可视化与相关操作；



`class GraphNodeLayout` 提供画布与各种节点操作事件，并提供节点的 ToKen 化；



`graph 文件夹` 提供节点的实例化、可视化。里面定义的类全部添加到菜单里面。

> `graph 文件夹` 里面定义的类（还没实例化），在 `class GraphNodeLayout` 中被添加到节点菜单中：`this.setMenu(new NodeMenu(Group, "基础"))` 。



`language_analysis 文件夹` 提供各个节点的对应解析器。`class LanguageAnalysis` 负责将 ToKen 化的节点解析成对应的代码的字符串；



最后在 Test.vue 中执行代码。



## 节点→代码→执行

### 入口

首先 components 文件夹中的 Test.vue 调用：

```js
this.layout = new GraphNodeLayout()
run() {
  const code = new LanguageAnalysis().analysis(this.layout.toToken(), "js");
  // 动态创建一个函数，run 变量接收了动态创建的函数。
  const run = new Function("const fun = " + (code || "function(){}") + "; fun()");
  // 调用前面创建的函数 run，即执行动态创建的代码
  run();
}
```



### 解析器

graph_node_layout.ts 定义了 GraphNodeLayout 这个类。这个类表示画布，其中的 toToKen() 能够将画布里的节点转为能够被解析器解析的结构。
language_analysis 文件夹里的 index.ts 定义了 LanguageAnalysis 这个类。这个类用于将画布节点 toToKen() 后返回的对象解析成对应的代码片段（字符串）。

LanguageAnalysis 架构
在文件夹中定义各种类，这些类只包含了各种解析用的方法。例如：

```js
// javaScript.ts
export class JavaScript {
  // 解析 function 节点
  function(){ ... }
  // 解析 referenceFunction 节点
  referenceFunction(){ ... }
  ...
}
```

然后这些类全部导出到 language_analysis/javascript/index.ts 并实例化：

```
export default  {
    name: "js",
    install(){
        return [
            new JavaScript(),
 	    ...
        ]
    }
}
```

然后继续被导出到 language_analysis/index.ts ：

```js
const analysisList: { [k: string]: any } = {};
export class LanguageAnalysis {
  analysis(node: { [k: string]: any }, name: string) {
    const analysis = analysisList[name];
    this.loader = analysis;
    ...
  }
}
```

打印 this.loader (即 LanguageAnalysis.loader)：

```js
[JavaScript, ObjectAnalysis, ArrayToken, ...]
```

this.loader 是一个数组，数组中的每个元素都是一个解析器类的实例，这些实例包含了解析各种节点的方法。
也就是说，this.loader 集合了各种解析器。



### 将 toToKen() 返回值解析成字符串

下面代码会将 toToKen() 返回值转为 string ，并依次 push 进 this.functionList 。this.functionList 里面存储着所有代码的字符串。

```js
// 解析核心代码
analysis(node: { [k: string]: any }, name: string) {
  ...
  node.tree.forEach((index: number) => {
    // 毫无疑问 this.next() 是核心
    this.functionList.push(this.next(index));
  })
  ...
}
```

最后会调用 this.commit(“end”) ，其实就相当于执行了 `return this.functionList[0]` 。

> this.commit：提供 funName ，会调用 this.loader 里面的同名解析器。例如 funName = “end” ，则会调用 `[JavaScript, ObjectAnalysis, ArrayToken, ...]` 这些实例里面叫 end 的方法（new JavaScript().end()）。this.commit 的实现比较简单，就是个遍历。



## 图形化

该项目的图形实现流程：

`element/custom_element.ts` 定义了 `class CustomElement` 。该类实例化时创建了 div 以实现图形化，所有图形化相关的类的基类。

> 画布、右键菜单、节点、输入框、警告 .... 所有与图形相关的类都继承了它。通过 `setStyle()` 方法来调节样式。



`element/Element.ts`定义了常用的图形类，包括：`text / Input / Image ... / svg ` 等等。

> 文字也被视为一种图形。
>
> ```js
> // class Text 构造函数
> constructor(text:any=""){
>     super();
>     this.setTag("div");
>     this.setText(text);
>     this.setStyle({
>         display: "inline-block"
>     });
> }
> ```



`element/layout/index.ts` 继承了 `class CustomElement` 并定义了一系列带有布局功能的类。例如：

```js
/**线性布局 */
export class LinearLayout extends Layout { ... }

/**列表布局。被用于下拉选择框 */
export class ListLayout extends Layout { ... }
```

这些布局类被广泛应用到各处。几乎所有节点的实例化都是靠 `class LinearLayout` 实现可视化的，可以看看节点类的构造函数都有 `new LinearLayout()` 。



## 节点图形类

`element/group/index.ts` 主要定义了 `class Group` 。这个类拓展了 `class CustomElement` ，给其添加了一些“数组”功能。例如：

```js
list: CustomElement[] = [];
push(e: CustomElement) {
  this.list.push(e);
  this.appendChild(e);
}
remove
pop
get
```

由于 `class Group` 拥有数组功能，因此，只要某个类的功能上涉及到“多个子节点”，就会用到 `class Group` 。

这个类在 `GraphicProgramming/graph/base.ts` 中再次被拓展为 `class GraphNode` (基础节点类)。所有的节点类都继承了它。例如：

```
// GraphicProgramming\graph\base.ts
export class GFunction extends GraphNode { ... }
export class Print extends GraphNode { ... }
```



> `class CustomElement` 提供图形化， `class Graph` 提供数组功能。



## 一些功能的实现

### 右键创建菜单

`class GraphNodeLayout` 实例化时执行了 `this.initMenuEvent()` ，在 `this.$el` 上绑定了右键执行 `this.createMenu()` 事件。



### 点击菜单子项目插入节点、子项目的名字

`class GraphNodeLayout` 里面定义了 `createMenu` 方法。该方法用于创建右键菜单，菜单创建后执行 `create()` ，连带执行 `createChildMenu()` 给子项绑定 `click` 事件，点击执行 `clickItem()` 。

`createChildMenu()` 用于右键菜单列表项的生成。`create()` 给输入框绑定了 `keyup` 事件。每次执行该事件会重新刷新列表。

列表子项名字也在 `create()` 中完成获取：

```js
for (let i = 0; i < item.getCount(); i++) {
  // 获取列表子项的名字
  const n = item.getItem(i);
  console.log('name', n)
  if (match(n, value)) {
    max++;
    // 添加到菜单子项，顺带给子项绑定点击插入节点事件
    add(n, i);
  }
}
```

> add 函数是核心。`item.clickItem()` 实现了插入可视化节点（但没有解析该节点。run 的时候才会去解析节点）



### 自定义可视化节点

参考：[js可视化编程：自定义节点_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1iX4y1v7h1/?vd_source=0465383ae88f789c88dd145fd65df12e)

源码见 CustomNode.vue。

```js
import { GraphNode } from '../GraphicProgramming/graph/base';
import { NodeMenu } from '../GraphicProgramming/graph_menu_list/index';
import { Input, Text } from '../GraphicProgramming/element/Element';

// number 类型链接节点
import { LinkNodeNumberEntry, LinkNodeNumberOutput } from '../GraphicProgramming/link_node';

import { LinearLayout } from '../GraphicProgramming/element/layout/index';
```



```js
// 1、自定义节点
class CustomNode extends GraphNode {
  static alias = "别名";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);
    // 初始化标题
    this.initTitle_LinkPoint(true, true)

    // 自定义内容
    this.appendChild(new Input())
    this.appendChild(new Text('123'))

    // 参数入口。数字类型入口
    const entry = new LinkNodeNumberEntry(graphNodeLayout)
    const output = new LinkNodeNumberOutput(graphNodeLayout)
    const layout = new LinearLayout()
    layout.justifyContent("space-between")
    layout.setStyle({
      "padding": "10px"
    })
	// 入口加入布局
    layout.appendChild(entry)
    layout.appendChild(output)
    this.appendChild(layout)

    // 通知连接线节点已经移动
    this.setLinkNodeList("entry", entry)
    this.setLinkNodeList("output", output)
  }
}
```



```js
// CustomNode.vue
mounted() {
  // 3、清空默认菜单列表
  this.layout.clearMenu();

  this.layout.appendTo(this.$refs.content);

  // 2、添加自定义列表
  this.layout.addMenu(new NodeMenu({ CustomNode }, '自定义节点'))
},
```



在定义图形节点时，为了能够解析，根据情况需要实现一些方法：

```js
// 创建变量。使节点支持添加变量
createVariable()

// 和 setData() 相对应，有 setData() 通常就有 getData()
// 复制节点时需要获取节点的值（详见 copy() 的实现），以使粘贴时可以正确粘贴
// 导出时也需要获取节点的值
getData()

// 需要保障默认值正确的节点需要定义
// 例如：有输入值能力的图形节点需要定义，例如定义变量、输入
// 使图形节点粘贴、导出时输入框里面的内容能够正确（保障自定义默认值正确）
setData(obj: { [k: string]: any; })

// 使图形节点能够 token 化
// 里面的 const token 是必要的。
getToken(map: any[], linkNodeName = "")
```

> `getToken` 是必要的，其它方法根据需求来决定是否去实现。
>
> 只用考虑这几个方法即可，其它方法无需实现。

> createVariable()：GFunction、FunctionCall 都实现了这个。实现方法不同，功能也不同。
>
> getData() 、 setData() 用于保障 导出 / 导入 、复制 / 粘贴 时节点的数据正确。因此节点涉及到赋值时，就需要定义这两个函数。function 之类的节点也需要。
>
> getToken() 用于将图形节点能够 token 化，只有 token 化后才能去解析成代码字符串。因此所有节点都需要去定义。



### 自定义解析函数

log 节点是个很好的例子。for 是个更好的例子。

log 的可视化节点：

```js
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
```

log 的解析节点：

```js
  log(index: any, node: { [k: string]: any }): string {
    const value = this.next(node.value) 
    			|| this.variableConversion(node.defaultValue);
    const next = this.next(node.next);
    // console.log(next)
    return `console.log(${value});${next}`;
  }
```

解析节点会获得可视化节点的 `token` 。下面是常用的 token 属性：

type，必要的。

next 表示下一个节点，只要需要接下一个节点，就需要有这个属性，`${next}` 是固定写在最后。

uuid，必要的。虽然解析节点中不用。

value，输入框里面的值。

defaultValue，输入框里面没有值时的默认值





### 解析类与节点图形类的关系

解析类与节点图形类的桥梁：

```
// class LanguageAnalysis
// 根据节点的类型获取对应的处理函数，并将其赋值给变量 fun
fun = this.get(node.type);
```

node 其实就是图形节点的 token 化数组，结构如下：

```js
[
    {
        "1hd6dg5o4_dc": 1,
        "1hdbfrg3f_56": 2,
        "1hdbfs2bv_t3": 3
    },
    {
        "type": "function",
        "funName": "",
        "parameter": [],
        "next": 2,
        "uuid": "1hd6dg5o4_dc"
    },
    {
        "type": "print",
        "funName": "",
        "next": -1,
        "value": -1,
        "uuid": "1hdbfrg3f_56"
    }
]
```



图形节点 `toToKen()` 

`run` 时，图形节点的 `toToken()` 被调用，`token` 被 push 进 map ，并赋值给 `this.entryNode` 或 `this.outputNode`。



### 检查入口节点

在将所有节点拼接前，会先检查 `入口节点` 是否存在。不存在则不会去拼接节点。

```js
// 入口节点
entryNode = Group.GFunction;

if (el instanceof Group.GFunction) {
  for (let i = 0; i < this.nodeList.length; i++) {
    const node = this.nodeList[i];
    if (node instanceof Group.GFunction) {
      // 有多个 GFunction 节点时弹出警告
      new Message().setMode(Message.WARN).show(
          "函数入口已经存在，请勿重复创建！", 
          3000)
      return this;
    }
  }
```



## 常用可视化节点

### 输出 print

类似的有：变量赋值

![image-20231102224731797](../image/image-20231102224731797.png)

```js
export class Print extends GraphNode {
  static alias = "输出";
  constructor(graphNodeLayout: GraphNodeLayout) {
    super(graphNodeLayout);

    this.initTitle_LinkPoint();
      
    const { linkNode, linearLayout } = 	
        this.linkNode_input(graphNodeLayout, 
                            "", LinkNodeAnyEntry, 
                            "value", true);

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
```



### 异常处理 trycatch

![image-20231102230710387](../image/image-20231102230710387.png)



## 快速开发一个节点

大标题：

this.initTitle_LinkPoint();

> 大标题后一个输出节点对应的值为 next

无大标题模板：

```js
export class Switch extends GraphNode {
  static alias = "分支";

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
    
    lin_0.appendChild()
  }

  getToken(map: any[]) {
    const index = super.getToken(map);
    const token = {
      type: "createVar",
      next: null,
      uuid: this.uuid,
    }

    map.push(token);
      
    token.next = this.outputNode("next", map);
      
    return index;
  }
}
```

> (el => this.push(el)) 用于将值作为参数，故不可省略。
>
> lin_0，作为一个容器，用于包裹其它 lin 。然后用 this.appendChild 加入到这个可视化节点。
>
> 最后将子项添加到 lin_0

解析模板：

```js
if(index: any, node: { [k: string]: any }) {
  const next = this.next(node.next);
  return ``;
}
```



子项：

- 标题

```js
const title = new Text(CreateVar.alias).setFontSize("12px").setStyle({"margin": "0 10px","display": "flex","justify-content": "center"})
```



- 返回值

![image-20231107222749898](../image/image-20231107222749898.png)

```js
const output_1 = this.text_linkNode(graphNodeLayout, "返回值", LinkNodeObjectOutput, "output_1")
```

getToken 处

```js
output_1: null,

token.output_1 = this.outputNode("output_1", map);
```

> 不管是箭头型还是正方形接口，都是用 this.outputNode(“alias”, map) 获取值

解析处

```
const output_1 = this.next(node.output_1);
```

> next() 指的是下一个节点返回的内容（可以是函数体，也可以是值。不管是箭头型，还是正方形接口，都是用它）
>
> this.variableConversion 用于获取默认值



- linkNode_input

![image-20231107222416513](../image/image-20231107222416513.png)

```js
const input_1 = this.linkNode_input(graphNodeLayout, "变量值", LinkNodeAnyEntry, "defaultInput_1");
```

getToken 处

因为有输入框，所以有 `defaultInput_1` 

```js
defaultInput_1: this.linkNodeValues.defaultInput_1,
input_1: null,

token.input_1 = this.entryNode("defaultInput_1", map);
```

解析处

```js
let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);
```



- 单独一个 select

给类添加静态属性

```js
static select_1 = "number"
```



```js
const option = {
  "数字": "number",
  "文字": "string",
  "数组": "array",
  "对象": "object",
}
const list = Object.keys(option)
const select_1 = new Select()
  .adds(list)
  .setValue(list[0])
  .on("select", (el) => {
     类名.select_1 = option[el.value]
  })
const text = new Text("数据类型")
  .setFontSize("12px")
  .setStyle({
    "margin": "0 10px",
    "display": "flex",
    "flex-direction": "row",
    "justify-content": "flex-start"
  });
const lin_1 = new LinearLayout()
  .setStyle({ "margin": "2.5px 0" })
  .alignItems()
  .appendChild(select_1)
  .appendChild(text);
```



getToken 处

```js
select_1: 类名.select_1,
```

解析处

```js
const select_1 = this.variableConversion(node.select_1)
```



- 前面有入口的 select

参考 “打开应用” 节点。



## 其它说明

### bind()

```js
item[funName].bind(this);
```

这段代码是将名为funName的属性从对象item中提取出来，并使用bind方法将其绑定到当前上下文（this）。

bind()方法是JavaScript中的一个内置函数，用于创建一个新的函数，该函数的上下（this）被永久地绑定到定的值。通过使用bind()方法，我们可以将函数与特定的对象绑定在一起，无论如何调用该函数，它的上下文都不会改变。

在这个例子中，item对象中的funName属性是一个函数。通过使用bind()方法并将this作为参数传递给bind()方法，我们将该函数的下文绑定到当前的上下文，确保在调用该函数时，它仍然在正确的上下文中运行。

例如，假设item对象如下所示：

```
const item = {  
  funName: function() {    
    console.log(this.foo);  
  },  
  foo: 'Hello' 
}; 
```

然后使用`item[funName].bind(this);`代码来调用函数，并确保它在正确的上下文中运行。

```
const boundFunction = item.funName.bind(this); 
boundFunction(); // 输出: Hello 
```

在这个例子中，我们创建了一个绑定函数boundFunction，并确保在运行该函数时，this.foo的值为’Hello’。bind()方法确保了函数在使用时使用正确的上下文。



### 接口类型

箭头型接口，表示该节点作为一段完整的代码加入到整个函数中；

正方形接口，表示作为函数的参数加入到整个函数中

