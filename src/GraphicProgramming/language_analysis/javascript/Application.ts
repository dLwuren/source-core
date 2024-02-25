import { post, http, addQuotationMarksForNumber } from "../../../utils";

export class Application {
  // 使 class 能够动态添加属性
  [k: string]: any;

  openApplication(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next)
    let path = this.next(node.path) || this.variableConversion(node.defaultPath)
    // let state = this.next(node.state) || this.variableConversion(node.defaultState)

    return `
    await post('/ahk', {
      "type": "openApplication",
      "path": ${path}
    });
    ${next}`
  };

  openUrl(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next)
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1)

    return `
    await post('/ahk', {
      "type": "openUrl",
      "url": ${input_1}
    });
    ${next}`
  };

  createShortcut(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);
    let input_2 = this.next(node.input_2) || this.variableConversion(node.defaultInput_2);
    let input_3 = this.next(node.input_3) || this.variableConversion(node.defaultInput_3);

    input_1 = addQuotationMarksForNumber(input_1)

    return `
    await post('/ahk', {
      "type": "createShortcut",
      "name": ${input_1},
      "target": ${input_2},
      "path": ${input_3},
    });
    ${next}`
  };

  allWinId(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "output_1") return `v_${index.index}`;
      return "";
    }
    this.data[index] = `v_${index}`;

    const next = this.next(node.next);

    const data = {
      "type": 'allWinId',
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

  curWinId(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "output_1") return `v_${index.index}`;
      return "";
    }
    this.data[index] = `v_${index}`;

    const next = this.next(node.next);

    const data = {
      "type": 'curWinId',
    }
    const json = JSON.stringify(data)
    const url = http + '/ahk'

    return `
    const xml_${index} = new XMLHttpRequest();
    xml_${index}.open('post', '${url}', false);
    xml_${index}.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xml_${index}.send('${json}');
    const v_${index} = parseInt(xml_${index}.responseText);
    ${next}
    `;
  };

  winInfo(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "output_1") return `v_${index.index}`;
      return "";
    }
    this.data[index] = `v_${index}`;

    const next = this.next(node.next);
    const input_1 = this.next(node.input_1);

    const url = http + '/ahk'

    return `
    const xml_${index} = new XMLHttpRequest();
    xml_${index}.open('post', '${url}', false);
    xml_${index}.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    const obj_${index} = {
      "type": 'winInfo',
      "id": ${input_1}.toString()
    }
    const json_${index} = JSON.stringify(obj_${index})
    xml_${index}.send(json_${index});
    const v_${index} = JSON.parse(xml_${index}.responseText);
    ${next}`;
  };

  transparency(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);
    let input_2 = this.next(node.input_2) || this.variableConversion(node.defaultInput_2);

    return `
    await post('/ahk', {
      "type": "transparency",
      "id": String(${input_1}),
      "transparency": String(${input_2})
    });
    ${next}`
  };

  changeWin(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    const input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);

    return `
    await post('/ahk', {
      "type": "changeWin",
      "id": String(${input_1}),
    });
    ${next}`
  };

  winState(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    const input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);
    const select_1 = this.variableConversion(node.select_1)

    return `
    await post('/ahk', {
      "type": "winState",
      "id": String(${input_1}),
      "state": ${select_1},
    });
    ${next}`
  };

  prevWin(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);

    return `
    await post('/ahk', {
      "type": "switchPrevWin",
    });
    ${next}`
  }
}
