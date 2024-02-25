export class Mind {
  // 使 class 能够动态添加属性
  [k: string]: any;

  newMind(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "output_1") return `v_${index.index}`;
      return "";
    }
    this.data[index] = `v_${index}`;

    const next = this.next(node.next);
    const options = {
      devtools: true,
      title: '思维导图',
      size: {
        width: 830,
        height: 530
      },
      decorations: false,
      // 相对路径是以 dist 中的情况为准
      entry: './MindMapping.html'
    }
    const json = JSON.stringify(options)

    return `
    await new Promise(resolve => setTimeout(resolve, 150));
    const v_${index} = Niva.api.window.open(${json});
    await new Promise(resolve => setTimeout(resolve, 150));
    ${next}
    `;
  };

  addBroNode(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    let input_1 = this.next(node.input_1);
    let input_2 = this.next(node.input_2) || this.variableConversion(node.defaultInput_2);

    return `
    await new Promise(resolve => setTimeout(resolve, 150));

    ${input_1}.then((id) => {
      Niva.api.window.sendMessage(encodeObj({
        "type": "addBroNode",
        "data": ${input_2}
      }), id)
        .catch((e) => { console.log(e, 'error') })
    }).catch((e) => { console.log(e, 'error') });

    await new Promise(resolve => setTimeout(resolve, 150));
    ${next}`
  };

  addSubNode(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    let input_1 = this.next(node.input_1);
    let input_2 = this.next(node.input_2) || this.variableConversion(node.defaultInput_2);

    return `
    await new Promise(resolve => setTimeout(resolve, 150));

    ${input_1}.then((id) => {
      Niva.api.window.sendMessage(encodeObj({
        "type": "addSubNode",
        "data": ${input_2}
      }), id)
        .catch((e) => { console.log(e, 'error') })
    }).catch((e) => { console.log(e, 'error') });

    await new Promise(resolve => setTimeout(resolve, 150));
    ${next}`
  };

  getNodeUid(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "output_1") return `nodeUid_${index.index}`;
      return "";
    }
    this.data[index] = `nodeUid_${index}`;

    const next = this.next(node.next);
    const uuid = node.uuid
    let input_1 = this.next(node.input_1);

    return `
    socket.once("${uuid}", async function (msg) {
      const nodeUid_${index} = JSON.parse(msg);
      ${next}
    });

    // 延时, 既可以保证 socket.once 完成注册, 又可以避免频繁发送信息导致 niva 崩溃
    await new Promise(resolve => setTimeout(resolve, 150));

     ${input_1}.then((id) => {
      Niva.api.window.sendMessage(encodeObj({
        "type": "getNodeUid",
        "uuid": "${uuid}"
      }), id)
        .catch((e) => { console.log(e, 'error') })
    }).catch((e) => { console.log(e, 'error') });

    await new Promise(resolve => setTimeout(resolve, 150));
    `;
  };

  getNodeInfo(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "output_1") return `nodeInfo_${index.index}`;
      return "";
    }
    this.data[index] = `nodeInfo_${index}`;

    const next = this.next(node.next);
    const uuid = node.uuid
    let input_1 = this.next(node.input_1);
    let input_2 = this.next(node.input_2);

    return `
    socket.once("${uuid}", async function (msg) {
      const nodeInfo_${index} = JSON.parse(msg);
      ${next}
    });

    await new Promise(resolve => setTimeout(resolve, 150));
 
     ${input_1}.then((id) => {
      Niva.api.window.sendMessage(encodeObj({
        "type": "getNodeInfo",
        "uuid": "${uuid}",
        "data": ${input_2}
      }), id)
        .catch((e) => { console.log(e, 'error') })
    }).catch((e) => { console.log(e, 'error') });

    await new Promise(resolve => setTimeout(resolve, 150));
    `;
  };

  delNode(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    const input_1 = this.next(node.input_1);

    return `
    await new Promise(resolve => setTimeout(resolve, 150));

    ${input_1}.then((id) => {
      Niva.api.window.sendMessage(encodeObj({
        "type": "delNode",
      }), id)
        .catch((e) => { console.log(e, 'error') })
    }).catch((e) => { console.log(e, 'error') });

    await new Promise(resolve => setTimeout(resolve, 150));
    ${next}`
  };

  changeNode(index: any, node: { [k: string]: any }) {
    const next = this.next(node.next);
    let input_1 = this.next(node.input_1);
    let input_2 = this.next(node.input_2) || this.variableConversion(node.defaultInput_2);

    return `
    await new Promise(resolve => setTimeout(resolve, 150));

    ${input_1}.then((id) => {
      Niva.api.window.sendMessage(encodeObj({
        "type": "changeNode",
        "data": ${input_2}
      }), id)
        .catch((e) => { console.log(e, 'error') })
    }).catch((e) => { console.log(e, 'error') });

    await new Promise(resolve => setTimeout(resolve, 150));
    ${next}`
  };

}