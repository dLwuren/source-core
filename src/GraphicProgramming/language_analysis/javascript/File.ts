import { post, http, addQuotationMarksForNumber } from "../../../utils";

export class File {
  // 使 class 能够动态添加属性
  [k: string]: any;
  writeFile(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next)
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1)
    let input_2 = this.next(node.input_2) || this.variableConversion(node.defaultInput_2)
    input_2 = addQuotationMarksForNumber(input_2)

    return `
    await post('/file', {
      "type": "writeFile",
      "path": ${input_1},
      "content": ${input_2}
    });
    ${next}`
  };

  readFile(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "output_1") return `v_${index.index}`;
      return "";
    }
    this.data[index] = `v_${index}`;

    const next = this.next(node.next)
    const input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1)

    const url = http + '/file'

    return `
    const xml_${index} = new XMLHttpRequest();
    xml_${index}.open('post', '${url}', false);
    xml_${index}.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    const obj_${index} = {
      "type": 'readFile',
      "path": ${input_1}
    }

    const json_${index} = JSON.stringify(obj_${index})
    xml_${index}.send(json_${index});
    const v_${index} = xml_${index}.responseText;
    ${next}`
  };
};

