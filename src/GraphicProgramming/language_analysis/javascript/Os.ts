import { http, addQuotationMarksForNumber } from "../../../utils";

export class Os {
  // 使 class 能够动态添加属性
  [k: string]: any;

  shutdown(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    const select_1 = this.variableConversion(node.select_1)

    return `
    await post('/ahk', {
      "type": "shutdown",
      "state": ${select_1},
    });
    ${next}`
  }

  notice(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);
    let input_2 = this.next(node.input_2) || this.variableConversion(node.defaultInput_2);

    input_1 = addQuotationMarksForNumber(input_1);
    input_2 = addQuotationMarksForNumber(input_2);

    return `
    await post('/ahk', {
      "type": "notice",
      "content": ${input_1},
      "title": ${input_2},
    });
    ${next}`
  };

  getTime(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "output_1") return `v_${index.index}`;
      return "";
    }
    this.data[index] = `v_${index}`;

    const next = this.next(node.next);

    const data = {
      "type": 'getTime',
    }
    const json = JSON.stringify(data)
    const url = http + '/ahk'

    return `
    const xml_${index} = new XMLHttpRequest();
    xml_${index}.open('post', '${url}', false);
    xml_${index}.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xml_${index}.send('${json}');
    const v_${index} = JSON.parse(xml_${index}.responseText);
    ${next}
    `;
  };

  getDiskInfo(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "output_1") return `v_${index.index}`;
      return "";
    }
    this.data[index] = `v_${index}`;

    const next = this.next(node.next);

    const data = {
      "type": 'getDiskInfo',
    }
    const json = JSON.stringify(data)
    const url = http + '/ahk'

    return `
    const xml_${index} = new XMLHttpRequest();
    xml_${index}.open('post', '${url}', false);
    xml_${index}.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xml_${index}.send('${json}');
    const v_${index} = JSON.parse(xml_${index}.responseText);
    ${next}
    `;
  };

  getOsInfo(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "output_1") return `v_${index.index}`;
      return "";
    }
    this.data[index] = `v_${index}`;

    const next = this.next(node.next);

    const data = {
      "type": 'getOsInfo',
    }
    const json = JSON.stringify(data)
    const url = http + '/ahk'

    return `
    const xml_${index} = new XMLHttpRequest();
    xml_${index}.open('post', '${url}', false);
    xml_${index}.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xml_${index}.send('${json}');
    const v_${index} = JSON.parse(xml_${index}.responseText);
    ${next}
    `;
  };

  volumeCtrl(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);

    input_1 = addQuotationMarksForNumber(input_1);

    return `
    await post('/ahk', {
      "type": "volumeCtrl",
      "vol": ${input_1},
    });
    ${next}`
  };
}