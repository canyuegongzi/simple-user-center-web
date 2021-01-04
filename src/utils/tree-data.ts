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

/**
 * 筛选树结构节点
 * @param treeData {Array} 树结构数据
 * @param filedStr {String} 筛选字段
 * @param value {String | Number}
 * @return {string}
 */
export const findTreeNode = (treeData: any[], filedStr: 'id', value: any) =>{
    if (!treeData || !filedStr || !value) return ''
    let node = null
    const findNode = (arr: any[]) => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][filedStr] == value) {
                node = arr[i];
                throw new Error('STOP');
            }
            if (arr[i].children && arr[i].children.length > 0) {
                findNode(arr[i].children)
            }
        }
    }
    try {
        findNode(treeData)
    }catch (e) {
        if (e.message === 'STOP') {
            console.log(node)
            return node
        }
    }
    findNode(treeData)
    console.log(node)
    console.log(treeData)
    return node
}
