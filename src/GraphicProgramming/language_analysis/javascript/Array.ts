export class ArrayToken {
  [k: string]: any;

  // 函数执行节点
  length(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const target = this.next(node.target) || this.variableConversion(node.defaulltTarget);
        this.data[index.index] = `${target}.length`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    return "";
  }

  isArray(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const target = this.next(node.target) || this.variableConversion(node.defaulltTarget);
        this.data[index.index] = `${target} instanceof Array`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    return "";
  }

  get(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const target = this.next(node.target) || this.variableConversion(node.defaulltTarget);
        const index = this.next(node.index) || this.variableConversion(node.defaulltIndex);
        this.data[index.index] = `${target}[${index}]`;

        return this.data[index.index];
      }
      console.log(this.data[index.index])
      return this.data[index.index];
    }
    return "";
  }

  set(index: any, node: { [k: string]: any }) {

    const target = this.next(node.target) || this.variableConversion(node.defaulltTarget);
    const index_ = this.next(node.index) || this.variableConversion(node.defaulltIndex);
    const value = this.next(node.value) || this.variableConversion(node.defaulltValue);
    const next = this.next(node.next)

    return `${target}[${index_}] = ${value};${next}`;
  }

  push(index: any, node: { [k: string]: any }) {
    const target = this.next(node.target) || this.variableConversion(node.defaulltTarget);
    const value = this.next(node.value) || this.variableConversion(node.defaulltValue);
    const next = this.next(node.next);

    return `${target}.push(${value});${next}`;
  }

  pop(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      return this.data[index.index];
    }

    this.data[index] = `v_${index}`;

    const target = this.next(node.target) || this.variableConversion(node.defaulltTarget);
    const next = this.next(node.next);

    return `const v_${index} = ${target}.pop();${next}`;
  }

  foreach(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "index") return `i_${index.index}`;
      if (index.linkNodeAlias == "value") return `v_${index.index}`;
      return "";
    }

    this.data[index] = `v_${index}`;

    const target = this.next(node.target) || this.variableConversion(node.defaultTarget);

    const forBody = this.next(node.forBody);

    const next = this.next(node.next);

    return `${target}.forEach((v_${index},i_${index})=>{${forBody}}); ${next}`;
  }

  fill(index: any, node: { [k: string]: any }) {
    const target = this.next(node.target) || this.variableConversion(node.defaultTarget);

    const value = this.next(node.value) || this.variableConversion(node.defaulltValue);

    const next = this.next(node.next);

    return `${target}.fill(${value}); ${next}`;
  }

  array(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      return this.data[index.index];
    }

    this.data[index] = `v_${index}`;

    const next = this.next(node.next);

    let parameter = "";
    node.parameter.forEach((item: { [k: string]: any }, index: number) => {
      if (index != 0) parameter += ",";
      parameter += this.next(item.value) || this.variableConversion(item.defaultValue);
    });

    return `const v_${index} = new Array(${parameter});${next}`;
  }

  arrayFilter(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "index") return `i_${index.index}`;
      if (index.linkNodeAlias == "value") return `v_${index.index}`;
      if (index.linkNodeAlias == "array") return `a_${index.index}`;
      if (index.linkNodeAlias == "returnv") return `re_${index.index}`;
      return "";
    }

    this.data[index] = `re_${index}`;

    const target = this.defaultNext("target", node);

    const forBody = this.next(node.forBody);
    const next = this.next(node.next);

    return `const ${this.data[index]} = ${target}.filter((v_${index},i_${index},a_${index})=>{${forBody}}); ${next}`;
  }

  join(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      return this.data[index.index];
    }

    this.data[index] = `re_${index}`;

    const target = this.defaultNext("target", node);
    const code = this.defaultNext("code", node);

    const next = this.next(node.next);

    return `const ${this.data[index]} = ${target}.join(${code}); ${next}`;
  }

  arrayMap(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "index") return `i_${index.index}`;
      if (index.linkNodeAlias == "value") return `v_${index.index}`;
      if (index.linkNodeAlias == "array") return `a_${index.index}`;
      if (index.linkNodeAlias == "returnv") return `re_${index.index}`;
      return "";
    }

    this.data[index] = `re_${index}`;

    const target = this.defaultNext("target", node);

    const forBody = this.next(node.forBody);
    const next = this.next(node.next);

    return `const ${this.data[index]} = ${target}.map((v_${index},i_${index},a_${index})=>{${forBody}}); ${next}`;
  }

  arraySort(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "a") return `a_${index.index}`;
      if (index.linkNodeAlias == "b") return `b_${index.index}`;
      if (index.linkNodeAlias == "returnv") return this.data[index.index];
      return "";
    }

    this.data[index] = `re_${index}`;

    const target = this.defaultNext("target", node);

    const funBody = this.next(node.funBody);
    const next = this.next(node.next);

    return `const ${this.data[index]} = ${target}.sort((a_${index},b_${index})=>{${funBody}}); ${next}`;
  }

  arraySplice(index: any, node: { [k: string]: any }) {
    const target = this.defaultNext("target", node);
    const i = this.defaultNext("index", node);
    const deleteCount = this.defaultNext("deleteCount", node);
    const next = this.next(node.next);

    let parameter = "";
    node.parameter.forEach((item: { [k: string]: any }, index: number) => {
      if (index != 0) parameter += ",";
      parameter += this.next(item.value) || this.variableConversion(item.defaultValue);
    });

    return `${target}.splice(${i},${deleteCount},${parameter});${next}`;
  }

  arraySlice(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      return this.data[index.index];
    }

    this.data[index] = `re_${index}`;

    const target = this.defaultNext("target", node);
    const start = this.defaultNext("start", node);
    const end = this.defaultNext("end", node);

    const next = this.next(node.next);

    return `const ${this.data[index]} = ${target}.slice(${start},${end}); ${next}`;
  }

  arrayIndexOf(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      return this.data[index.index];
    }

    this.data[index] = `re_${index}`;

    const target = this.defaultNext("target", node);
    const value = this.defaultNext("value", node);

    const next = this.next(node.next);
    return `const ${this.data[index]} = ${target}.indexOf(${value}); ${next}`;
  }
} 