export class NetWork {
  [k: string]: any;

  ajax(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (index.linkNodeAlias == "result") return `res_${index.index}`;
      if (index.linkNodeAlias == "error") return `err_${index.index}`;
      return "";
    }

    this.data[index] = `v_${index}`;

    const url = this.next(node.url) || this.variableConversion(node.defaultUrl) || `"/"`;
    const method = this.next(node.method) || this.variableConversion(node.defaultMethod) || "'GET'";

    const success = this.next(node.success);
    const fail = this.next(node.fail);

    const next = this.next(node.next);

    return `utils.ajax(${url},${method}).then((res_${index})=>{${success}},(err_${index})=>{${fail}});${next}`;
  }

  webSocket(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      return this.data[index.index];
    }

    this.data[index] = `v_${index}`;

    const url = this.next(node.url) || node.defaultUrl || `localhost`;
    const port = this.next(node.port) || node.defaultPort || "3000";

    const next = this.next(node.next);

    return `const v_${index} = new WebSocket("ws://${url}:${port}");${next}`;
  }

  socketOnOpen(index: any, node: { [k: string]: any }) {

    const target = this.next(node.target) || this.variableConversion(node.defaultTarget);

    const success = this.next(node.success);

    const next = this.next(node.next);

    return `${target}.onopen = function(){${success}};${next}`;
  }

  socketOnError(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      return this.data[index.index];
    }

    this.data[index] = `v_${index}`;

    const target = this.next(node.target) || this.variableConversion(node.defaultTarget);

    const errNext = this.next(node.errNext);
    const next = this.next(node.next);

    return `${target}.onerror = function(v_${index}){${errNext}};${next}`;
  }

  socketOnMessage(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      return this.data[index.index];
    }

    this.data[index] = `v_${index}.data`;

    const target = this.next(node.target) || this.variableConversion(node.defaultTarget);

    const msgNext = this.next(node.msgNext);
    const next = this.next(node.next);

    return `${target}.onmessage = function(v_${index}){${msgNext}};${next}`;
  }

  socketOnClose(index: any, node: { [k: string]: any }) {
    const target = this.next(node.target) || this.variableConversion(node.defaultTarget);

    const closeNext = this.next(node.closeNext);
    const next = this.next(node.next);

    // new WebSocket().

    return `${target}.onclose = function(){${closeNext}};${next}`;
  }

  socketSend(index: any, node: { [k: string]: any }) {
    const target = this.next(node.target) || node.defaultTarget;
    const message = this.next(node.message) || this.variableConversion(node.defaultMessage);

    const next = this.next(node.next);

    return `${target}.send(${message});${next}`;
  }

  socketClose(index: any, node: { [k: string]: any }) {
    const target = this.next(node.target) || node.defaultTarget;

    const next = this.next(node.next);

    return `${target}.close();${next}`;
  }
} 