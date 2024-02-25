import { post, http, addQuotationMarksForNumber} from "../../../utils";

export class Window {
  // 使 class 能够动态添加属性
  [k: string]: any;

  msgWin(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);

    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);

    return `
    await post('/ahk', {
      "type": "msgWin",
      "msg": String(${input_1})
    });
    ${next}`
  };

  formWin(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "output_1") return `obj_${index.index}`;
      return "";
    }
    this.data[index] = `obj_${index}`;

    const next = this.next(node.next);
    const uuid = node.uuid

    // 数组 格式为：[{itemName: 'item_0', type: '文本', value: '1'}]
    const parameter = node.parameter;
    const formList = node.formList; // 表单配置子项索引

    let valueList = "" // 各个子项的值，最后用于生成一个数组
    let typeList = "" // 各个子项的type，最后用于生成一个数组

    formList.forEach((item, i) => {
      if (i != 0) valueList += ",";
      valueList += this.next(item) || null;

      if (i != 0) typeList += ",";
      typeList += this.variableConversion(parameter[i].type);
    })

    const options = {
      devtools: true,
      title: '表单窗口',
      size: {
        width: 316,
        height: 439
      },
      decorations: false,
      // 相对路径是以 dist 中的情况为准
      entry: './FormWin.html'
    }
    const json = JSON.stringify(options)

    return `
    const valueList_${index} = new Array(${valueList});
    const typeList_${index} = new Array(${typeList});

    let html_${index} = ""
    html_${index} = fromCreate(typeList_${index}, valueList_${index}, "${uuid}")

    await new Promise(resolve => setTimeout(resolve, 150));
    const v_${index} = Niva.api.window.open(${json});
    await new Promise(resolve => setTimeout(resolve, 300));

    v_${index}.then((id) => {
      Niva.api.window.sendMessage(encodeURIComponent(html_${index}), id)
        .catch((e) => { console.log(e, 'error') })
    }).catch((e) => { console.log(e, 'error') });

    socket.once("${uuid}", async function (msg) {
      const obj_${index} = JSON.parse(msg);
      ${next}
    });
    await new Promise(resolve => setTimeout(resolve, 150));`;
  };

  stop(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    let input_1 = this.next(node.input_1) || this.variableConversion(node.defaultInput_1);

    const data = {
      "type": 'stop',
    }
    const json = JSON.stringify(data)
    const url = http + '/py'

    return `const xml_${index} = new XMLHttpRequest();
    xml_${index}.open('post', '${url}', false);
    xml_${index}.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xml_${index}.send('${json}');
    const v_${index} = JSON.parse(xml_${index}.responseText);
    ${next}
    `;
  };

}