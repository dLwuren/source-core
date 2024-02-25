export class JavaScript {
  // 使 class 能够动态添加属性
  [k: string]: any;

  // 函数执行节点
  function(index: any, node: { [k: string]: any }): string {
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
    return `function(${parameter}){${body}}`;
  }

  referenceFunction(index: any, node: { [k: string]: any }) {

    return "";
  }

  tryCatch(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      return "err";
    }

    const try_ = this.next(node.try);
    const catch_ = this.next(node.catch);
    const next = this.next(node.next);

    return `try{${try_}}catch(err){${catch_}} ${next}`;
  }

  // if(index: any, node: { [k: string]: any }) {
  //   const condition = this.next(node.condition) || this.variableConversion(node.defaultCondition);
  //   const true_ = this.next(node.true);
  //   const false_ = this.next(node.false);
  //   const next = this.next(node.next);

  //   return `if(${condition}){${true_}}else{${false_}}${next}`;
  // }

  functionCall(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      return this.data[index.index];
    }

    this.data[index] = `v_${index}`;

    const funName = this.next(node.funName) || this.variableConversion(node.defaultFunName);
    const next = this.next(node.next);

    let parameter = "";
    node.parameter.forEach((item: { [k: string]: any }, index: number) => {
      if (index != 0) parameter += ",";
      parameter += this.next(item.value) || this.variableConversion(item.defaultValue);
    });

    return `const v_${index} = ${funName}(${parameter});${next}`;
  }

  log(index: any, node: { [k: string]: any }): string {
    const value = this.next(node.value) || this.variableConversion(node.defaultValue);
    const next = this.next(node.next);
    return `console.log(${value});${next}`;
  }

  print(index: any, node: { [k: string]: any }): string {
    const value = this.next(node.value) || this.variableConversion(node.defaultValue);
    const next = this.next(node.next);
    return `console.log(${value});${next}`;
  }

  input(index: any, node: { [k: string]: any }) {
    return this.variableConversion(node.value);
  }

  inputColor(index: any, node: { [k: string]: any }) {
    return this.variableConversion(node.value);
  }

  builtInObjects(index: any, node: { [k: string]: any }) {
    return node.value;
  }

  for(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      return this.data[index.index];
    }
    this.data[index] = `v_${index}`;

    const start = this.next(node.start) || this.variableConversion(node.defaultStart);
    const end = this.next(node.end) || this.variableConversion(node.defaultEnd);
    const step = this.next(node.step) || this.variableConversion(node.defaultStep);

    const forBody = this.next(node.forBody);
    const next = this.next(node.next);

    return `for (let v_${index} = ${start || 0}; v_${index} < ${end || 0}; v_${index}+=${step || 1}) {${forBody}} ${next}`;
  }

  forIn(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      return this.data[index.index];
    }

    this.data[index] = `v_${index}`;

    const target = this.next(node.target) || this.variableConversion(node.defaultTarget);

    const forBody = this.next(node.forBody);

    const next = this.next(node.next);

    return `for (const v_${index} in ${target}||[]) {if (Object.prototype.hasOwnProperty.call(${target}||[], v_${index})) {${forBody}}} ${next}`;
  }

  forOf(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      return this.data[index.index];
    }

    this.data[index] = `v_${index}`;

    const target = this.next(node.target) || this.variableConversion(node.defaultTarget);

    const forBody = this.next(node.forBody);

    const next = this.next(node.next);

    return `for (const v_${index} of ${target}) {${forBody}} ${next}`;
  }

  while(index: any, node: { [k: string]: any }) {
    const condition = this.next(node.condition) || this.variableConversion(node.defaultCondition);

    const whileBody = this.next(node.whileBody);

    const next = this.next(node.next);

    return `while(${condition}){${whileBody}}; ${next}`;
  }

  doWhile(index: any, node: { [k: string]: any }) {
    const condition = this.next(node.condition) || this.variableConversion(node.defaultCondition);

    const whileBody = this.next(node.whileBody);

    const next = this.next(node.next);
    return `do{${whileBody}}while(${condition}); ${next}`;
  }

  break(index: any, node: { [k: string]: any }) {
    return "break";
  }

  continue(index: any, node: { [k: string]: any }) {
    return "continue";
  }

  castToBoolean(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const value = this.next(node.value);
        this.data[index.index] = `!!${value}`;

        return `!!${value}`;
      }

      return this.data[index.index];
    }

    const value = this.next(node.value);
    this.data[index] = `!!${value}`;

    return `!!${value}`;
  }

  castToString(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const value = this.next(node.value);
        this.data[index.index] = `new String(${value})`;
        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const value = this.next(node.value);
    this.data[index] = `new String(${value})`;

    return this.data[index];
  }

  castToNumber(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const value = this.next(node.value);
        this.data[index.index] = `Number.parseInt(${value})`;
        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const value = this.next(node.value);
    this.data[index] = `Number.parseInt(${value})`;

    return this.data[index];
  }

  castToFunction(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const value = this.next(node.value);
        this.data[index.index] = `${value} instanceof Function ? ${value}() : new Function()`;
        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const value = this.next(node.value);
    this.data[index] = `${value} instanceof Function ? ${value} : new Function()`;

    return this.data[index];
  }

  defineVariable(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      return this.data[index.index];
    }

    this.data[index] = `${node.varName}`;

    const value = this.next(node.value) || this.variableConversion(node.defaultValue);
    const varName = node.varName;

    const next = this.next(node.next);

    return `let ${varName} = ${value}; ${next}`;
  }

  variableReference(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      return node.varName;
    }

    this.data[index] = `${node.varName}`;

    const varName = node.varName;

    return varName;
  }

  setVariable(index: any, node: { [k: string]: any }) {
    const varName = this.next(node.varName) || this.variableConversion(node.defaultVarName);
    const value = this.next(node.value) || this.variableConversion(node.defaultValue);

    const next = this.next(node.next);

    return `${varName}=${value};${next}`;
  }

  add(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
        const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
        this.data[index.index] = `(${value1} + ${value2})`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
    const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
    this.data[index] = `(${value1} + ${value2})`;

    return this.data[index];
  }

  sub(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
        const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
        this.data[index.index] = `(${value1} - ${value2})`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
    const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
    this.data[index] = `(${value1} - ${value2})`;

    return this.data[index];
  }

  mutiplication(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
        const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
        this.data[index.index] = `(${value1} * ${value2})`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
    const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
    this.data[index] = `(${value1} * ${value2})`;

    return this.data[index];
  }

  division(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
        const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
        this.data[index.index] = `(${value1} / ${value2})`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
    const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
    this.data[index] = `(${value1} / ${value2})`;

    return this.data[index];
  }

  mod(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
        const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
        this.data[index.index] = `(${value1} % ${value2})`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
    const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
    this.data[index] = `(${value1} % ${value2})`;

    return this.data[index];
  }

  and(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
        const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
        this.data[index.index] = `(${value1} && ${value2})`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
    const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
    this.data[index] = `(${value1} && ${value2})`;

    return this.data[index];
  }

  or(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
        const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
        this.data[index.index] = `(${value1} || ${value2})`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
    const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
    this.data[index] = `(${value1} || ${value2})`;

    return this.data[index];
  }

  not(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
        this.data[index.index] = `!${value1}`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
    this.data[index] = `!${value1}`;

    return this.data[index];
  }

  equal(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
        const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
        this.data[index.index] = `(${value1} === ${value2})`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
    const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
    this.data[index] = `(${value1} === ${value2})`;

    return this.data[index];
  }

  notEqual(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
        const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
        this.data[index.index] = `(${value1} !== ${value2})`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
    const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
    this.data[index] = `(${value1} !== ${value2})`;

    return this.data[index];
  }

  greaterThan(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
        const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
        this.data[index.index] = `(${value1} > ${value2})`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
    const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
    this.data[index] = `(${value1} > ${value2})`;

    return this.data[index];
  }

  lessThan(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
        const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
        this.data[index.index] = `(${value1} < ${value2})`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
    const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
    this.data[index] = `(${value1} < ${value2})`;

    return this.data[index];
  }

  greaterThanOrEqual(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
        const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
        this.data[index.index] = `(${value1} >= ${value2})`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
    const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
    this.data[index] = `(${value1} >= ${value2})`;

    return this.data[index];
  }

  lessThanOrEqual(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
        const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
        this.data[index.index] = `(${value1} <= ${value2})`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
    const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
    this.data[index] = `(${value1} <= ${value2})`;

    return this.data[index];
  }

  stringSplicing(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
        const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
        this.data[index.index] = `${value1} +""+ ${value2}`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const value1 = this.next(node.value1) || this.variableConversion(node.defaultValue1);
    const value2 = this.next(node.value2) || this.variableConversion(node.defaultValue2);
    this.data[index] = `${value1} +""+ ${value2}`;

    return this.data[index];
  }

  setInterval(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      return this.data[index.index];
    }

    this.data[index] = `v_${index}`;

    const time = this.next(node.time) || this.variableConversion(node.defaultTime);
    const timeBody = this.next(node.timeBody);

    const next = this.next(node.next);

    return `const v_${index} = setInterval(()=>{${timeBody}},${time || 0}); ${next}`;
  }

  clearInterval(index: any, node: { [k: string]: any }) {
    const flag = this.next(node.flag);

    const next = this.next(node.next);

    return `clearInterval(${flag}); ${next}`;
  }

  setTimeout(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      return this.data[index.index];
    }

    this.data[index] = `v_${index}`;

    const time = this.next(node.time) || this.variableConversion(node.defaultTime);
    const timeBody = this.next(node.timeBody);

    const next = this.next(node.next);

    return `const v_${index} = setTimeout(()=>{${timeBody}},${time || 0}); ${next}`;
  }

  clearTimeout(index: any, node: { [k: string]: any }) {
    const flag = this.next(node.flag);

    const next = this.next(node.next);

    return `clearTimeout(${flag}); ${next}`;
  }

  querySelector(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      return this.data[index.index];
    }

    this.data[index] = `v_${index}`;

    const target = this.next(node.target) || this.variableConversion(node.defaultTarget);
    const select = this.next(node.select) || this.variableConversion(node.defaultSelect);
    const next = this.next(node.next);

    return `const v_${index} = ${target || 'document'}.querySelectorAll(${select});${next}`;
  }

  return(index: any, node: { [k: string]: any }) {
    const value = this.next(node.value) || this.variableConversion(node.defaultValue);

    return `return ${value};`;
  }

  instance(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      return this.data[index.index];
    }

    this.data[index] = `v_${index}`;

    const funName = this.next(node.funName) || this.variableConversion(node.defaultFunName);
    const next = this.next(node.next);

    let parameter = "";
    node.parameter.forEach((item: { [k: string]: any }, index: number) => {
      if (index != 0) parameter += ",";
      parameter += this.next(item.value) || this.variableConversion(item.defaultValue);
    });

    return `const v_${index} = new ${funName}(${parameter});${next}`;
  }

  this_() {
    return "this";
  }

  arguments() {
    return "arguments";
  }

  document() {
    return "document";
  }

  window() {
    return "window";
  }

  body() {
    return "document.body";
  }

  promise(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "resolve") return `re_${index.index}`;
      if (index.linkNodeAlias == "reject") return `rt_${index.index}`;
      if (index.linkNodeAlias == "result") return `res_${index.index}`;
      if (index.linkNodeAlias == "error") return `err_${index.index}`;
      return "";
    }

    this.data[index] = `v_${index}`;

    const task = this.next(node.task);
    const success = this.next(node.success);
    const fail = this.next(node.fail);

    const next = this.next(node.next);

    return `new Promise((re_${index},rt_${index})=>{${task}}).then((res_${index})=>{${success}},(err_${index})=>{${fail}});${next}`;
  }

  getBoundingClientRect(index: any, node: { [k: string]: any }) {
    console.log(index, index.linkNodeAlias, index.index);
    if (typeof index != "number") {
      if (index.linkNodeAlias == "object") return `v_${index.index}`;
      if (index.linkNodeAlias == "left") return `v_${index.index}.left`;
      if (index.linkNodeAlias == "right") return `v_${index.index}.right`;
      if (index.linkNodeAlias == "top") return `v_${index.index}.top`;
      if (index.linkNodeAlias == "bottom") return `v_${index.index}.bottom`;
      if (index.linkNodeAlias == "width") return `v_${index.index}.width`;
      if (index.linkNodeAlias == "height") return `v_${index.index}.height`;
      if (index.linkNodeAlias == "x") return `v_${index.index}.x`;
      if (index.linkNodeAlias == "y") return `v_${index.index}.y`;
      return "";
    }

    this.data[index] = `v_${index}`;

    const target = this.next(node.target) || this.variableConversion(node.defaultTarget);

    const next = this.next(node.next);

    return `const v_${index} = ${target || 'document.body'}.getBoundingClientRect();${next}`;
  }

  JSONStringify(index: any, node: { [k: string]: any }) {

    if (!this.data[index.index]) {
      const target = this.next(node.target) || this.variableConversion(node.defaultTarget);
      this.data[index.index] = `JSON.stringify(${target})`;
    }

    return this.data[index.index];
  }

  JSONParse(index: any, node: { [k: string]: any }) {
    if (!this.data[index.index]) {
      const target = this.next(node.target) || this.variableConversion(node.defaultTarget);
      this.data[index.index] = `JSON.parse(${target})`;
    }

    return this.data[index.index];
  }

  regExpInput(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const target = this.defaultNext("target", node);

        this.data[index.index] = `${target}`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const target = node.default_target;
    this.data[index] = `${target}`;
    return this.data[index];
  }

  end() {
    return this.functionList[0];
  }
} 
