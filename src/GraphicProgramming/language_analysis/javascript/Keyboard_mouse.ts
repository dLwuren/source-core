import { http, addQuotationMarksForNumber } from "../../../utils";

export class Keyboard_mouse {
  // 使 class 能够动态添加属性
  [k: string]: any;

  click(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    // 坐标格式： (num,num)
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);

    return `
    await post('/py', {
      "type": "click",
      "xy": ${input_1}
    });
    ${next}`;
  };

  // getControlId(index: any, node: { [k: string]: any }) {
  //   const next = this.next(node.next);
  //   const input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);

  //   return `await post('/py', {
  //     "type": "getControlId",
  //     "position": "${input_1}",
  //   });
  //   ${next}`
  // };

  inputWord(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);

    // 如果输入数值，则添加双引号。因为 inputWord() 期待参数类型为文本
    input_1 = addQuotationMarksForNumber(input_1)

    return `
    await post('/ahk', {
      "type": "inputWord",
      "text": ${input_1},
    });
    ${next}`
  };

  inputKey(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);

    return `
    await post('/ahk', {
      "type": "inputKey",
      "text": ${input_1},
    });
    ${next}`
  };

  getMouseInfo(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "output_1") return `v_${index.index}`;
      return "";
    }
    this.data[index] = `v_${index}`;

    const next = this.next(node.next);

    // 使用同步方式发送请求。如果请求失败会导致阻塞
    const data = {
      "type": 'getMouseInfo',
    }
    const json = JSON.stringify(data)
    const url = http + '/ahk'

    // const xhr = new XMLHttpRequest();
    // xhr.open('post', http + '/ahk', false);
    // xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    // xhr.send(JSON.stringify(data));
    // return xhr.responseText;

    return `
    const xml_${index} = new XMLHttpRequest();
    xml_${index}.open('post', '${url}', false);
    xml_${index}.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xml_${index}.send('${json}');
    const v_${index} = JSON.parse(xml_${index}.responseText);
    ${next}
    `;
  };

  moveMouse(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    // 坐标格式： (num,num)
    const input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);

    return `
    await post('/py', {
      "type": "moveMouse",
      "xy": ${input_1}
    });
    ${next}`;
  };

  pictureCenter(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "output_1") return `v_${index.index}`;
      return "";
    }
    this.data[index] = `v_${index}`;

    const next = this.next(node.next)
    const input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1)

    const url = http + '/py'

    return `
    const xml_${index} = new XMLHttpRequest();
    xml_${index}.open('post', '${url}', false);
    xml_${index}.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    const obj_${index} = {
      "type": 'pictureCenter',
      "path": ${input_1}
    }

    const json_${index} = JSON.stringify(obj_${index})
    xml_${index}.send(json_${index});
    const v_${index} = JSON.parse(xml_${index}.responseText);
    ${next}`
  };
};

