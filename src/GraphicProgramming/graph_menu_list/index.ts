
import * as GraphNode from "../graph/BaseNode"
import { GraphNodeLayout } from "../graph_node_layout";

export interface BaseMenuList {
  getName(): string;
  getCount(): number;
  getItem(index: number): string;
  clickItem(name: string, index: number, x: number, y: number, graphNodeLayout: GraphNodeLayout): any;
  getTarget(): any[];
}

// 右键菜单
export class NodeMenu implements BaseMenuList {
  graphNodes: string[];
  // 菜单里的代码块
  target: any;
  targetName: string;
  constructor(target: any, targetName: string) {
    this.graphNodes = Object.keys(target);
    this.target = target;
    this.targetName = targetName;
  }
  getTarget(): any[] {
    return this.target;
  }

  /**往 graphNodeLayout 里添加节点。NodeMenu 方法。 */
  clickItem(name: string, index: number, x: number, y: number, graphNodeLayout: GraphNodeLayout) {
    const graphNode: any = this.target;
    const node: any = new graphNode[name](graphNodeLayout);

    graphNodeLayout.appendChild(
      node,
      x + "px",
      y + "px"
    );

    return node;
  }

  getName(): string {
    return this.targetName;
  }

  getCount(): number {
    return this.graphNodes.length;
  }

  getItem(index: number): string {
    return this.graphNodes[index];
  }

}

// 变量菜单 注册到右键菜单
// 当有存在变量时，打开右键就会弹出变量引用
export class VarMenu implements BaseMenuList {
  graphNodes: any[] = [];
  graphNodeLayout: GraphNodeLayout;

  constructor(graphNodeLayout: GraphNodeLayout) {
    this.graphNodeLayout = graphNodeLayout;
  }

  getTarget(): any[] {
    return [];
  }

  clickItem(name: string, index: number, x: number, y: number, graphNodeLayout: GraphNodeLayout) {
    if (this.graphNodes[index][1] == "var") {
      const node: any = new GraphNode.VariableReference(graphNodeLayout);
      graphNodeLayout.appendChild(
        node,
        x + "px",
        y + "px"
      );
      node.setData({ variableName: this.graphNodes[index][0] });
    } else if (this.graphNodes[index][1] == "funvar") {
      const node: any = new GraphNode.VariableReference(graphNodeLayout);
      graphNodeLayout.appendChild(
        node,
        x + "px",
        y + "px"
      );
      node.setData({ variableName: this.graphNodes[index][0] });
    } else if (this.graphNodes[index][1] == "fun") {
      const node: any = new GraphNode.VariableReference(graphNodeLayout);
      graphNodeLayout.appendChild(
        node,
        x + "px",
        y + "px"
      );
      node.setData({ variableName: this.graphNodes[index][0] });
    }

    return;
  }

  getName(): string {
    return "变量引用";
  }

  getCount(): number {
    this.graphNodes = [];
    this.graphNodeLayout.nodeList.forEach(item => {
      if (item instanceof GraphNode.DefineVariable) {
        const variableName = item.variableName;
        this.graphNodes.push([variableName, "var", "变量引用"]);
      }
      else if (item instanceof GraphNode.GFunction) {
        item.varList.forEach(obj => {
          this.graphNodes.push([obj.varName, "fun", "函数变量引用"]);
        });
      }
      else if (item instanceof GraphNode.ReferenceFunction) {
        if (item.linkNodeValues.fun) {
          this.graphNodes.push([item.linkNodeValues.fun, "fun", "引用函数"]);
        }

        item.varList.forEach(obj => {
          this.graphNodes.push([obj.varName, "funvar", "函数变量引用"]);
        });
      }
    });

    return this.graphNodes.length;
  }

  getItem(index: number): string {
    return this.graphNodes[index][0] + " (" + this.graphNodes[index][2] + ")";
  }
}