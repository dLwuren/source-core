import { http, addQuotationMarksForNumber } from "../../../utils";

export class Text {
  // 使 class 能够动态添加属性
  [k: string]: any;

  replaceText(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);

    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);
    let input_2 = this.next(node.input_2) || this.variableConversion(node.defaultInput_2);
    let input_3 = this.next(node.input_3) || this.variableConversion(node.defaultInput_3)

    input_1 = addQuotationMarksForNumber(input_1);
    input_2 = addQuotationMarksForNumber(input_2);
    input_3 = addQuotationMarksForNumber(input_3);

    // 如果没有输入替换成什么文字，则替换成 ""
    if (input_3 === 'null') input_3 = '\"\"';

    return `${input_1}.replaceAll(${input_2}, ${input_3})`;
  }

  connectionText(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);

    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);
    let input_2 = this.next(node.input_2) || this.variableConversion(node.defaultInput_2);
    let input_3 = this.next(node.input_3) || this.variableConversion(node.defaultInput_3);

    input_1 = addQuotationMarksForNumber(input_1);
    input_2 = addQuotationMarksForNumber(input_2);
    input_3 = addQuotationMarksForNumber(input_3);

    if (input_1 === 'null') input_1 = '\"\"';
    if (input_2 === 'null') input_2 = '\"\"';
    if (input_3 === 'null') input_3 = '\"\"';

    return `"".concat(${input_1}, ${input_2}, ${input_3})`;
  }

  splitText(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);

    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);
    let input_2 = this.next(node.input_2) || this.variableConversion(node.defaultInput_2);

    input_1 = addQuotationMarksForNumber(input_1);
    input_2 = addQuotationMarksForNumber(input_2);

    return `${input_1}.split(${input_2})`;
  }

  subText(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);

    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);
    let input_2 = this.next(node.input_2) || this.variableConversion(node.defaultInput_2);
    let input_3 = this.next(node.input_3) || this.variableConversion(node.defaultInput_3);

    return `${input_1}.slice((${input_2} - 1), ${input_3})`;
  }

  // 正则表达式 暂不实现
  regEx(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);

    const input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);
    const input_2 = this.next(node.input_2) || this.variableConversion(node.defaultInput_2);

  }

  textLength(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);

    input_1 = addQuotationMarksForNumber(input_1);

    return `${input_1}.length`;
  }

  delText(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);

    input_1 = addQuotationMarksForNumber(input_1)

    return `
    await post('/ahk', {
      "type": "delText",
      "num": ${input_1},
    });
    ${next}`
  }

  // 键鼠操作有个更好的，这个弃用
  // inputText(index: any, node: { [k: string]: any }) {
  //   const next = this.next(node.next);
  //   let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);

  //   input_1 = addQuotationMarksForNumber(input_1)

  //   return `
  //   await post('/ahk', {
  //     "type": "inputText",
  //     "str": ${input_1},
  //   });
  //   ${next}`
  // }

  wToClipboard(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);

    input_1 = addQuotationMarksForNumber(input_1)

    return `
    await post('/ahk', {
      "type": "wToClipboard",
      "str": ${input_1},
    });
    ${next}`
  }

  clearClipboard(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);

    return `
    await post('/ahk', {
      "type": "clearClipboard",
    });
    ${next}`
  }

  getClipboard(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "output_1") return `v_${index.index}`;
      return "";
    }
    this.data[index] = `v_${index}`;

    const next = this.next(node.next);

    const data = {
      "type": 'getClipboard',
    }
    const json = JSON.stringify(data)
    const url = http + '/ahk'

    return `
    const xml_${index} = new XMLHttpRequest();
    xml_${index}.open('post', '${url}', false);
    xml_${index}.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xml_${index}.send('${json}');
    const v_${index} = xml_${index}.responseText;
    ${next}
    `;
  };

  getSelectedText(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "output_1") return `v_${index.index}`;
      return "";
    }
    this.data[index] = `v_${index}`;

    const next = this.next(node.next);

    const data = {
      "type": 'getSelectedText',
    }
    const json = JSON.stringify(data)
    const url = http + '/ahk'

    return `
    const xml_${index} = new XMLHttpRequest();
    xml_${index}.open('post', '${url}', false);
    xml_${index}.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xml_${index}.send('${json}');
    const v_${index} = xml_${index}.responseText;
    ${next}
    `;
  };

}