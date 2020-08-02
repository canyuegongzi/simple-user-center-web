/**
 * 线性化数据树形话
 * @param source
 * @param id
 * @param parentId
 * @param children
 */
export const listToTree = (source: any, id?: any, parentId?: any, children?: any) => {
    const cloneData = JSON.parse(JSON.stringify(source));
    return cloneData.filter((father: any) => {
        const branchArr = cloneData.filter((child: any) => father[id] === child[parentId]);
        // tslint:disable-next-line:no-unused-expression
        branchArr.length > 0 ? father[children] = branchArr : '';
        return father[parentId] === -1;
    });
};

/**
 * 树形数据线性化
 * @param list
 */
export const treeConvertList = (root: any) =>  {
    const list = [];
    if (root) {
        const Root = JSON.parse(JSON.stringify(root));
        const queue = [];
        queue.push(Root);
        while (queue.length) {
            const node: any = queue.shift();
            if (node.children && node.children.length) {
                queue.push(...node.children);
            }
            delete node.children;
            if (node.parentId !== null && node.parentId !== undefined) {
                list.push(node);
            }
        }
    }
    return list;
};
