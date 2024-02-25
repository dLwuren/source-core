export class ObjectAnalysis {
  [k: string]: any;
  objectSet(index: any, node: { [k: string]: any }) {
    const target = this.next(node.target) || this.variableConversion(node.defaultTarget);
    const attrName = this.next(node.attrName) || `"${node.defaultAttrName}"`;
    const value = this.next(node.value) || this.variableConversion(node.defaultValue);

    const next = this.next(node.next);

    return `${target}[${attrName}] = ${value}; ${next}`;
  }

  objectGet(index: any, node: { [k: string]: any }) {

    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const target = this.defaultNext("target", node) || "this";
        const attrName = this.defaultNext("attrName", node, false);

        this.data[index.index] = `${target}[${attrName}]`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const target = this.defaultNext("target", node) || "this";
    const attrName = this.defaultNext("attrName", node, false);
    this.data[index] = `${target}[${attrName}]`;
    return this.data[index];
  }

  objectGetString(index: any, node: { [k: string]: any }) {

    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const target = this.defaultNext("target", node) || "this";
        const attrName = this.defaultNext("attrName", node, false);

        this.data[index.index] = `${target}[${attrName}]`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const target = this.defaultNext("target", node) || "this";
    const attrName = this.defaultNext("attrName", node, false);
    this.data[index] = `${target}[${attrName}]`;
    return this.data[index];
  }

  objectGetBoolean(index: any, node: { [k: string]: any }) {

    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const target = this.defaultNext("target", node) || "this";
        const attrName = this.defaultNext("attrName", node, false);

        this.data[index.index] = `${target}[${attrName}]`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const target = this.defaultNext("target", node) || "this";
    const attrName = this.defaultNext("attrName", node, false);
    this.data[index] = `${target}[${attrName}]`;
    return this.data[index];
  }

  objectGetNumber(index: any, node: { [k: string]: any }) {

    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const target = this.defaultNext("target", node) || "this";
        const attrName = this.defaultNext("attrName", node, false);

        this.data[index.index] = `${target}[${attrName}]`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const target = this.defaultNext("target", node) || "this";
    const attrName = this.defaultNext("attrName", node, false);
    this.data[index] = `${target}[${attrName}]`;
    return this.data[index];
  }

  objectGetFunction(index: any, node: { [k: string]: any }) {

    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const target = this.defaultNext("target", node) || "this";
        const attrName = this.defaultNext("attrName", node, false);

        this.data[index.index] = `${target}[${attrName}]`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const target = this.defaultNext("target", node) || "this";
    const attrName = this.defaultNext("attrName", node, false);
    this.data[index] = `${target}[${attrName}]`;
    return this.data[index];
  }

  objectCallFunction(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      return this.data[index.index];
    }

    this.data[index] = `v_${index}`;

    const target = this.defaultNext("target", node) || "this";
    const attrName = this.defaultNext("attr", node, false);

    let parameter = "";
    node.parameter.forEach((item: { [k: string]: any }, index: number) => {
      if (index != 0) parameter += ",";
      parameter += this.next(item.value) || this.variableConversion(item.defaultValue);
    });

    const next = this.next(node.next);

    return `const v_${index} = ${target}[${attrName}].bind(${target})(${parameter});${next}`;
  }
}