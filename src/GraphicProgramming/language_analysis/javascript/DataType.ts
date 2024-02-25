import { addQuotationMarksForNumber } from "../../../utils";

export class DataType {
  // 使 class 能够动态添加属性
  [k: string]: any;

  typeof(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);

    return `typeof(${input_1})`
  }

  numCreate(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      return this.data[index.index];
    }
    this.data[index] = `v_${index}`;

    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);

    return `
    const v_${index} = ${input_1};
    ${next}`;
  }

  numToStr(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    const input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);

    return `String(${input_1})`;
  }

  strCreate(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      return this.data[index.index];
    }
    this.data[index] = `v_${index}`;

    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);

    // 如果输入数值，则添加双引号
    input_1 = addQuotationMarksForNumber(input_1)

    return `
    const v_${index} = ${input_1};
    ${next}`;
  }

  strToNum(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);

    return `parseFloat(${input_1})`;
  }

  arrCreate(index: any, node: { [k: string]: any }) {
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
console.log(parameter)
    return `
    const v_${index} = new Array(${parameter});
    ${next}`;
  }

  arrAdd(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);
    let input_2 = this.next(node.input_2) || this.variableConversion(node.defaultInput_2);

    return `${input_1}.concat([${input_2}])`
  }

  arrDel(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);
    let input_2 = this.next(node.input_2) || this.variableConversion(node.defaultInput_2);

    return `${input_1}.toSpliced(${input_2}, 1)`;
  }

  arrGet(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);
    let input_2 = this.next(node.input_2) || this.variableConversion(node.defaultInput_2);

    return `${input_1}[${input_2}]`;
  }

  arrChange(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);
    let input_2 = this.next(node.input_2) || this.variableConversion(node.defaultInput_2);
    let input_3 = this.next(node.input_3) || this.variableConversion(node.defaultInput_3);

    return `${input_1}.toSpliced(${input_2}, 1, ${input_3})`;
  }

  objAdd(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);
    let input_2 = this.next(node.input_2) || this.variableConversion(node.defaultInput_2);
    let input_3 = this.next(node.input_3) || this.variableConversion(node.defaultInput_3);

    return `Object.assign({}, ${input_1}, { ${input_2}: ${input_3} })`;
  }

  objDel(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "output_1") return `obj_${index.index}`;
      return "";
    }
    this.data[index] = `obj_${index}`;

    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);
    let input_2 = this.next(node.input_2) || this.variableConversion(node.defaultInput_2);

    return `
    const obj_${index} = Object.assign({}, ${input_1});
    delete  obj_${index}[${input_2}];
    ${next}`;
  }

  objGet(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);
    let input_2 = this.next(node.input_2) || this.variableConversion(node.defaultInput_2);

    return `${input_1}[${input_2}]`;
  }

  objChange(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "output_1") return `obj_${index.index}`;
      return "";
    }
    this.data[index] = `obj_${index}`;

    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);
    let input_2 = this.next(node.input_2) || this.variableConversion(node.defaultInput_2);
    let input_3 = this.next(node.input_3) || this.variableConversion(node.defaultInput_3);

    return `
    const obj_${index} = Object.assign({}, ${input_1});
    obj_${index}[${input_2}] = ${input_3};
    ${next}`;
  }

}