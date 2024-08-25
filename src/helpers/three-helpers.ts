import { Tree } from "../pages/AddThree";

export type ThreeResultType = {
  key: string;
  children: string[];
};

export type NestedThree = { [key: string]: string[] | NestedThree };
export type ThreeHierarchy = {
  [key: string]: NestedThree;
};

export class ThreeHelper {
  static getChildrenData(
    obj: Record<string, object | string[]>,
    words: string[] = []
  ): string[] {
    for (const key in obj) {
      const currentNode = obj[key];
      words.push(key);
      if (Array.isArray(currentNode)) {
        words.push(...currentNode);
        continue;
      }
      if (!Array.isArray(currentNode) && typeof currentNode === "object") {
        const currentNodesChildren = this.getChildrenData(
          currentNode as Record<string, object | string[]>
        );
        words.push(...currentNodesChildren);
        continue;
      }
    }
    return words;
  }

  static getLevels(
    obj: Record<string, object | string[]>,
    currenctDepth: number = 1,
    result: Record<string | number, ThreeResultType[]> = {}
  ) {
    if (!result[currenctDepth]) {
      result[currenctDepth] = [];
    }
    for (const key in obj) {
      const currentNode = obj[key];
      if (Array.isArray(currentNode)) {
        result[currenctDepth].push({ key, children: currentNode.concat(key) });
        continue;
      }
      if (!Array.isArray(currentNode) && typeof currentNode === "object") {
        const children = this.getChildrenData(
          currentNode as Record<string, object | string[]>
        );
        result[currenctDepth].push({ key, children: [key].concat(children) });
        this.getLevels(
          currentNode as Record<string, object | string[]>,
          currenctDepth + 1,
          result
        );
        continue;
      }
    }
    return result;
  }

  static getDepth(depth: number, data: ThreeHierarchy) {
    const allLevels = this.getLevels(data);
    return allLevels[depth];
  }

  static formatStateTreeToObject(tree: Tree[]): Record<string, any> {
    const formatNode = (node: Tree): any => {
      if (node.children.length === 0) {
        return node.key;
      }

      const childrenObj = node.children.reduce((acc, child) => {
        const formattedChild = formatNode(child);
        if (typeof formattedChild === "string") {
          if (!Array.isArray(acc)) acc = [];
          acc.push(formattedChild);
        } else {
          acc[child.key] = formattedChild;
        }
        return acc;
      }, {} as any);

      return childrenObj;
    };

    return tree.reduce((acc, node) => {
      acc[node.key] = formatNode(node);
      return acc;
    }, {} as Record<string, any>);
  }
}
