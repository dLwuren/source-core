import js from "./javascript/index";

// 创建一个空对象 analysisList，用于存储语言解析插件
const analysisList: { [k: string]: any } = {};

export class LanguageAnalysis {
  // 存储数据
  data: { [k: string]: any } = {};
  // 存储当前使用的语言解析插件
  loader: any;
  // 存储节点列表
  list: { [k: string]: any } = {};
  // 存储函数列表 存放代码的字符串
  functionList: any[] = [];

  // 注册语言解析插件
  static use(obj: any) {
    analysisList[obj.name] = obj.install();
  }
  // 返回已注册的语言解析插件的键值列表
  static keys() {
    return Object.keys(analysisList);
  }

  /**node 为节点对象，name 为语言解析插件的名称 */
  analysis(node: { [k: string]: any }, name: string) {
    // 事件周期： 解析前，解析完，组装
    // 获取指定名称的语言解析插件对象
    const analysis = analysisList[name];

    try {
      // 检查插件是否存在，如果不存在则抛出错误
      if (!analysis) throw new Error("不存在解析插件：" + name);
      // 将当前使用的语言解析插件存储到 loader 属性
      this.loader = analysis;
      // 将节点对象存储到 list 属性
      this.list = node;

      // 调用 commit("start") 方法，执行解析前的操作
      // 目前 start 没有被定义，因此这里没有什么意义
      // this.commit("start");

      // 遍历节点的 tree 属性，对每个节点调用 next() 方法，并将返回的函数存储到 functionList 数组中。
      node.tree.forEach((index: number) => {
        this.functionList.push(this.next(index));
      });
      // console.log(
      //   'data', this.data,
      //   'loader', this.loader,
      //   'list', this.list,
      //   'functionList', this.functionList, typeof this.functionList[0]
      // )

      // 相当于返回最后生成的代码字符串
      // commit("end") 指解析器 language_analysis 的 JavaScript 类里面的 end()
      return this.commit("end");
    }
    catch (err) {
      console.error(err);
    }

    return "";
  }

  /**执行语言解析插件的特定函数 */
  commit(funName: string) {
    let code = "";
    // 遍历当前使用的语言解析插件的每个属性，如果属性名等于 funName，则调用该函数，并将 code 作为参数传递。
    this.loader.forEach((item: any) => {
      if (item[funName]) {
        // Function.prototype.call() ，以给定的 this 值和逐个提供的参数调用该函数
        code = item[funName].call(this, code);
      }
    })
    return code;
  }

  /**用于获取下一个节点的处理函数 */
  next(index: any) {
    if (index == -1) return "";

    // 根据节点的索引或序号获取节点对象，并将其赋值给变量 node
    const node = this.list.maps[index.index || index];
    let fun: any = null;
    if (index instanceof Number) {
      // 根据节点的类型获取对应的处理函数，并将其赋值给变量 fun
      fun = this.get(node.type);
    }
    else {
      fun = this.get(node.type);
    }

    // 如果 fun 是一个函数，则调用它，并将节点的索引和节点对象作为参数传递
    if (fun instanceof Function) return fun(index, node);
    return "";
  }

  /**用于获取默认下一个节点的处理结果 */
  defaultNext(name: string, node: any, noString = true) {
    if (noString) return this.next(node[name]) || this.variableConversion(node["default_" + name]);
    else return this.next(node[name]) || `"${node["default_" + name]}"`;
  }

  /**用于获取指定函数名的函数 */
  get(funName: string) {
    let fun;
    // 遍历当前使用的语言解析插件的每个属性，
    // 如果属性名等于 funName，则将该函数绑定当前实例（this）并赋值给变量 fun
    this.loader.forEach((item: any) => {
      // 将名为funName的属性从对象item中提取出来，并使用bind方法将其绑定到当前上下文（this）
      if (item[funName]) fun = item[funName].bind(this);
    })

    return fun;
  }

  /**对节点输入框输入内容进行预处理，例如给字符串添加双引号 */
  variableConversion(value: string) {
    if (!value) return "null";
    value = value.trim();
    if (value == "") return null;

    // 用户输入首个字符为 + 或 : 时
    // if (value[0] == "+" || value[0] == ":") return `"${value.substring(1)}"`;

    // // 布尔
    // if (/^true|false$/.test(value)) {
    //   console.log('布尔', value)
    //   return value;
    // }

    // // 属性选择
    // if (/^[a-zA-Z_.$][0-9a-zA-Z_.$]*$/.test(value)) {
    //   console.log('属性选择', value)
    //   return value;
    // }
    // // 变量
    // if (/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(value)) {
    //   console.log('变量', value)
    //   return value;
    // }

    // 数值
    if (/^-{0,1}[0-9]+\.{0,1}[0-9]*e{0,1}\+*[0-9]*$/.test(value)) {
      return value;
    }
    // 数值 十六进制、二进制或八进制数
    if (/^(0x[a-fA-F0-9]+)|(0b[0-1]*)|(0o[0-7]*)$/.test(value)) {
      return value;
    }

    // 字符串
    // 将字符串中的双引号替换为转义后的双引号，并使用反引号包裹整个字符串
    return `"${value.replaceAll("\"", `\\"`)}"`;
  }
}

// 注册 js 解析器
LanguageAnalysis.use(js);