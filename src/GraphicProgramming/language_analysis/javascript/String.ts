export class StringAnalysis {
  [k: string]: any;

  stringBuilder(index: any, node: { [k: string]: any }) {

    let parameter = "";
    node.parameter.forEach((item: { [k: string]: any }, index: number) => {
      if (index != 0) parameter += "+";
      parameter += this.next(item.value) || `"${item.defaultValue}"`;
    });

    return "(" + parameter + ")";
  }

  stringCharCodeAt(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const target = this.defaultNext("target", node);
        const i = this.defaultNext("index", node);

        this.data[index.index] = `${target}.charCodeAt(${i})`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const target = this.defaultNext("target", node);
    const i = this.defaultNext("index", node);
    this.data[index] = `${target}.charCodeAt(${i})`;
    return this.data[index];
  }

  stringCharAt(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const target = this.defaultNext("target", node);
        const i = this.defaultNext("index", node);

        this.data[index.index] = `${target}.charAt(${i})`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const target = this.defaultNext("target", node);
    const i = this.defaultNext("index", node);
    this.data[index] = `${target}.charAt(${i})`;
    return this.data[index];
  }

  stringAt(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const target = this.defaultNext("target", node);
        const i = this.defaultNext("index", node);

        this.data[index.index] = `${target}[${i}]`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const target = this.defaultNext("target", node);
    const i = this.defaultNext("index", node);
    this.data[index] = `${target}[${i}]`;
    return this.data[index];
  }

  stringLength(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const target = this.next(node.target) || this.variableConversion(node.defaulltTarget);
        this.data[index.index] = `${target}.length`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    return "";
  }

  stringIndexOf(index: any, node: { [k: string]: any }) {
    if (typeof index != "number") {
      if (!this.data[index.index]) {
        const target = this.defaultNext("target", node);
        const char = this.defaultNext("char", node);

        this.data[index.index] = `${target}.indexOf(${char})`;

        return this.data[index.index];
      }

      return this.data[index.index];
    }

    const target = this.defaultNext("target", node);
    const char = this.defaultNext("char", node);
    this.data[index] = `${target}.indexOf(${char})`;
    return this.data[index];
  }
}