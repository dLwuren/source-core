import { addQuotationMarksForNumber } from "../../../utils";


export class Process {
  // 使 class 能够动态添加属性
  [k: string]: any;

  saveValue(index: any, node: { [k: string]: any }) {
    // const varType = this.variableConversion(node.varType)
    let value = this.next(node.value)

    return `${value}`
  }

  // 已经弃用
  createData(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "output_1") return `var_${index.index}`;
      return "";
    }
    this.data[index] = `var_${index}`;

    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);

    // 判断 input_1 是否为数字
    const regex = /^-?\d+(?:\.\d+)?$/
    if (regex.test(input_1)) {
      input_1 = parseFloat(input_1)
    }

    if (this.next(node.input_1)) {
      return `
      const var_${index} = ${input_1}
      ${next}`;
    } else {
      return `
      const var_${index} = "${input_1}"
      ${next}`;
    }

  }

  if(index: any, node: { [k: string]: any }) {
    const condition = this.next(node.condition) || this.variableConversion(node.defaultCondition);
    const true_ = this.next(node.true);
    const false_ = this.next(node.false);
    const next = this.next(node.next);
    return `
    if(${condition}){
      ${true_}
    }else{
      ${false_}
    }
    ${next}`;
  }

  switch(index: any, node: { [k: string]: any }) {
    const input = this.next(node.input) || this.variableConversion(node.defaultInput);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);
    let input_2 = this.next(node.input_2) || this.variableConversion(node.defaultInput_2);
    let input_3 = this.next(node.input_3) || this.variableConversion(node.defaultInput_3);

    const case_1 = this.next(node.case_1);
    const case_2 = this.next(node.case_2);
    const case_3 = this.next(node.case_3);
    const next = this.next(node.next);

    return `switch (${input}) {
      case ${input_1}:
        ${case_1}
        break
      case ${input_2}:
        ${case_2}
        break
      case ${input_3}:
        ${case_3}
        break
    };
    ${next}`;
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

    return `for (let v_${index} = ${start || 0}; v_${index} < ${end || 0}; v_${index}+=${step || 1}) {
      ${forBody}
    } 
    ${next}`;
  }

  pasue(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    const input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);

    return `
    await new Promise(resolve => setTimeout(resolve, ${input_1}));
    ${next}`;
  }

  randomInt(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);

    const input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);
    const input_2 = this.next(node.input_2) || this.variableConversion(node.defaultInput_2);

    return `(Math.floor(Math.random() * (${input_2} - ${input_1} + 1)) + ${input_1})`;
  }

  note(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    const input_1 = node.input_1;

    return `
    // ${input_1}
    ${next}`;
  }

  signal(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "output_1") return `v_${index.index}`;
      return "";
    }
    this.data[index] = `v_${index}`;

    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);
    const true_ = this.next(node.true);

    return `
    let v_${index} = "";
    socket.on(${input_1}, async function (msg) {
      v_${index} = msg
      ${true_}
    });
    ${next}`;
  }

  delSignal(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);

    return `
    socket.removeAllListeners(${input_1})
    ${next}`;
  }

  // 解析器index return this.commit("end");
  end() {
    return this.functionList[0];
  }
}