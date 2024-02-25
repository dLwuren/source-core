export class Base {
  // 使 class 能够动态添加属性
  [k: string]: any;

  // 开始
  start(index: any, node: { [k: string]: any }): string {
    if (typeof index != "number") {
      for (let i = 0; i < node.parameter.length; i++) {
        if (index.linkNodeAlias == node.parameter[i].linkNodeName) {
          return node.parameter[i].name;
        }
      }

      return "";
    }
    const body = this.next(node.next);
    // parameter 参数
    let parameter = "";

    node.parameter.forEach((item: any, index: number) => {
      if (index != 0) parameter += ",";
      parameter += item.name;
    });

    return `async function( ${parameter}){
      try {
        ${body}
      } catch (error) {
        console.log("运行错误", error)
      }
    }`;
  }

  // 结束任务
  endTask(index: any, node: { [k: string]: any }): string {
    return `
    return
    `;
  }

  // 打印到开发者工具
  log(index: any, node: { [k: string]: any }): string {
    const value = this.next(node.value) || this.variableConversion(node.defaultValue);
    const next = this.next(node.next);
    return `
    console.log(${value});
    ${next}`;
  }
}
